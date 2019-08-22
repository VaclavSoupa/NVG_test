class HelperUtil {

static var is_child_of = {};
	
  	//Replaces stuff based on Config.WildCardReplacement setup
  	//Input:
  	//report - report instance
  	//text - text that contains wildcards to be replaced
  	static function ReplaceWildCards (report, text) : String{
  		//Go through all wildcards and replace them one by one
      	for(var key in Config.WildCardReplacement){
          	var replaceObject = Config.WildCardReplacement[key];
          	var qid = replaceObject.ReplacementText.split('.')[0];
          	var code = replaceObject.ReplacementText.split('.')[1];
          	var ds_id = replaceObject.DataSource;
      		var replacement = ResourceText.Text(report, qid, code, ds_id);
          
          	while (text.split(key).length > 1) text = text.replace(key, replacement);
        }
      
      	return text;
    }
  
  	//Checks if array A contains object B
  	static function ArrayContains(array, object){
      	var contains = false;
      	for(var i = 0; i<array.length; i++){
          	if(array[i] === object){
          		contains = true;
              	break;
            }
        }
      	return contains;
    }
  
	static function GetPagedRowSettings( row_count, page_size ) {
      var pages = [];
		var page_count = Math.ceil ( row_count / page_size );
		for (var j=0; j<page_count; ++j) {		
			var start_index = (j*page_size);
			var end_index = Math.min ( (j+1)*page_size-1, row_count -1 );
		  
			pages.push (
				{
				  PageId: j,
				  StartIndex: start_index,
				  EndIndex: end_index
				}
			);		
		}
		return pages;
	}
  	
  	//Creates a cache key that can be used in any table that's filterable based on:
  	//current report base, which comparators are enabled, vu codes (if vu is enabled), demo-filter expression (if enabled),
  	//current language (needed because we only create content headers with one language included), 
  	//execution mode (we want different styling/columns included for different execution modes)
  	//additional string that is passed as 4th parameter to this function
    static function GetCacheKeyForT0(user, report, state, additionalString){
      //Current base
      var x = user.PersonalizedReportBase;
      
      //Trend comparators + Hierarchy based comparators
      var internal_comparators = ComparatorUtil.ProcessedComparators ( report, state, user );

      for (var i=0; i<internal_comparators.length; ++i){
      	var enabled = ParamUtil.Contains (state, 'COMPARATORS_INTERNAL', internal_comparators[i].Code );
        x = x + enabled;
      }
      
      //Current language
      x = x + report.CurrentLanguage;
      
      //Norms that are enabled
      for (var i=0; i<Config.Norms.Codes.length; ++i) {
          var enabled = ParamUtil.Contains (state, 'COMPARATORS_EXTERNAL', 'norm' + (i+1) );
          x = x + enabled;
      }
      
      //Demo-filters (if enabled)
      x = x + FilterUtil.GetParamFilterExpression (user, report, state);
      
      //VU codes (if enabled)
      x = x + HelperUtil.CacheKey (state, user);
		
      //Execution mode
      x = x + state.ReportExecutionMode;
      
      //Additional string
      x = x + additionalString;
      
      return x;
    }

  	static function FilterDemographicsByHierarchy ( demographics, node_id ) {
		var o = [];
		for (var i=0; i<demographics.length; ++i) {
			var demo = demographics[i];
			if (Config.DemographicHierarchyAccess[ demo ] == null) {
				// no restictions, add
				o.push ( demo );
			}
			else {
				var top_access_node_ids = Config.DemographicHierarchyAccess[ demo ];
				// restriction exists, verify hierarchy
              for (var j=0; j<top_access_node_ids.length; ++j)
                  if ( HelperUtil.IsChildOf ( node_id, top_access_node_ids[j]  ) )
                      o.push ( demo );
			}
		}
		return o;
	}
  	
  	// JA (template 21.0) - new function that will remove duplicates from the given demographics array
  	static function RemoveDuplicatesFromDemographicsList (demographics) {
      	var o = [];
      	
    	for (var i = 0; i < demographics.length; i++) {
         	 if (GetMyIndexOf (o, demographics[i]) < 0) o.push(demographics[i]);
        }
      
      	return o;
    }
  	
  	// JA (template 21.0) - new function which will help you to get and index of element inside of given array
  	//   returns -1 in case the element wasn't found
  	static function GetMyIndexOf (arr, el) {
      	for (var i = 0; i < arr.length; i++) {
        	if (arr[i].Equals(el)) return i;
        }
      	
      	return -1;
    }
  
  	static function GetParentId (id, confirmit) {
		
		var result =  DatabaseQuery.Exec (
							confirmit, 
							Config.Hierarchy.SchemaId,
							Config.Hierarchy.TableName,
							Config.Hierarchy.ParentRelationName, // example: 'parent'
							'id', 
							id
						);
      	
		if (result.length == 1)
			return result[0];
		else
			return null;
		
	}
  
  	static function hasTotalCompany ( report, user, state, confirmit ) {
		var TopID = Config.Hierarchy.TopNodeId;
		var virtual_unit = HelperUtil.IsVirtualUnitActive ( state );
		var total_company = ParamUtil.Contains (state, 'COMPARATORS_INTERNAL', Comparators.TotalCompany);

		var include_top = (user.PersonalizedReportBase == TopID || virtual_unit) && total_company;		
		
		return include_top;
	}

	static function hasLevelUp ( report, user, state, confirmit ) {
		var TopID = Config.Hierarchy.TopNodeId;
		var virtual_unit = HelperUtil.IsVirtualUnitActive ( state );
		var level_up = ParamUtil.Contains (state, 'COMPARATORS_INTERNAL', Comparators.LevelUp);
		var ParentID = HelperUtil.GetParentId (user.PersonalizedReportBase, confirmit);
		
		var include_levelup = (user.PersonalizedReportBase == ParentID || user.PersonalizedReportBase == TopID || TopID == ParentID || virtual_unit) && level_up;

		return include_levelup;
	}

	static function IsChildOf( child_id, parent_id, confirmit ) {
		// returns true if child_id is equal to or below parent_id in the hierarchy
		if (confirmit == null) confirmit = ConfirmitClass.conf;	
      
		var key = child_id + ':' + parent_id;
		var current_id = child_id;
		
		while ( is_child_of[key] == null ) {

			// first time this combination is requested
			// look up from database		
			
			if (current_id == parent_id){
				// found match
				is_child_of[key] = true;
			}
			else {
				if ( current_id == '' || (current_id+'') == 'undefined' || current_id==null) {
					// reached top of hierarchy
					is_child_of[key] = false;
				}
				else {
					// look one level up

					current_id = GetParentId ( current_id, confirmit );
				}
			}
		}
		return is_child_of[key];
	}  

	static function GetAllDimensionsByNodeId( node_id ) {
		return Config.Dimensions.concat (
			Config.GetLocalDimensionsByNodeId ( node_id )
		);
	}
  
  	static var DimensionByQuestionId;

	static var Colors = {Red:'#d92131' , Green:'#707814', LightGreen: '#b4d232', Yellow:'#ffd600' , Blue: '#0073be', LightBlue: '#00b4eb'};

  static function HtmlToText( html ) {
    var txt = html;
    
    txt = txt.split('<br>').join('\n');
    txt = txt.split('<BR>').join('\n');
    txt = txt.split('<p>').join('\n\n');
    txt = txt.split('<P>').join('\n\n');
    txt = txt.split(' spellcheck="-1"').join('');
    txt = txt.split('<ul><li>').join('\n\u2022  ');
    txt = txt.split('</li><li>').join('\n\u2022  ');
    txt = txt.split('</li></ul>').join('');
    txt = txt.split('</b>').join('');
    txt = txt.split('<b>').join('');
    return txt;
  }
  
  
  static function CurrentUnitLabel (report, state, user) {
    var selected_vu = ParamUtil.Selected(report, state, 'VU_ACTIVE', user);
    
    var current_group_label = (selected_vu != null)
      ? selected_vu.Label 
      : user.PersonalizedReportBaseText;
    
    return current_group_label;    
  }


  static function GetNormsProjectId ( report ) {
     return Config.Hub.Norms.ProjectId; 
  }
  
  static function GetParticipationProjectId ( report ) {
      return Config.Hub.Participation.ProjectId; 
  }
  
  static function GetBenchmarkListLocation ( report ) {
    return 'ds0'; 
  }
  
   static function GetActionPlanningProjectId ( report ) {
      return Config.Hub.ActionPlanning.ProjectId; 
  }


  static function CacheKey ( state, user ) {
    
  	return ( HelperUtil.IsVirtualUnitActive ( state ) )
	  
		// VU active, let's concat all NODE_IDs and use for Cache Key
		? new VirtualUnits( user ).Values( ParamUtil.GetParamCode ( state, 'VU_ACTIVE' ) ).join('_') 
		
		// VU not active, use current NODE_ID
		: user.PersonalizedReportBase; // VU not active
    
  }
  
  
	static function PickFirstParamValue (report, state, user, param_name) {
      try {
         var code = ParamUtil.Selected ( report, state, param_name, user ).Code;     
      }
      catch (e) {
			var p = ParamLists.Get (param_name, state, report, user);
			ParamUtil.Save ( state, report, param_name, p.length>0 ? p[0].Code : null );
      }
	}


	static function ActiveVirtualUnitLabel ( report, state, user ) {
      return ParamUtil.Selected(report, state, 'VU_ACTIVE', user).Label;
    }
  
	static function IsVirtualUnitActive ( state ) {
      	var vu_code = ParamUtil.GetParamCode (state, 'VU_ACTIVE');
     	return !( vu_code == null || vu_code == '' ); 
    }
  	
  	// JA (template 21.0) - this function actually not used but still left here so it could be used one day
  	static function IsPidFilterActive ( state ) {
      	var pid_code = ParamUtil.GetParamCode (state, 'PID');
     	return !( pid_code == null || pid_code == '' ); 
    }
  	
  	// JA (template 21.0) - function below added so we will be able to hide all the RR stuff properly
  	static function ShouldRRBeHiddenBasedOnPid ( state ) {
      	var pid_active = Config.PID.Enabled;
      	var pid_code = ParamUtil.GetParamCode (state, 'PID');
     	return ( pid_active && ( pid_code == null || pid_code == '' ) ); 
    }
  
	static function CurrentDimension ( report, state ) {
		var secondary = ParamUtil.Selected( report, state, 'DIMENSION_TIER2');
		if (secondary != null)
			return secondary;
		else {
			var primary = ParamUtil.Selected( report, state, 'DIMENSION_TIER1');
			if (primary != null)
				return primary;
			else {
            	var dim = ParamUtil.Selected( report, state, 'DIMENSION');
				return dim;
          }
		}
	}
  
  static function TextSubstitution (txt) {
	
		var subs = [
			{In: '^ClientName()^', Out: Config.Client.Name }
		];
		
		for (var i=0; i<subs.length; ++i)
			txt = txt.split(subs[i].In).join(subs[i].Out);
	
		return txt;
	}
  
  
  static function RemoveHtml(txt) {
      
      	// shortcut
      	var o = txt.split('<script>');
      	if (o.length>1) txt = o[0] + ' ' + o[1].split('</script>')[1];
      
		
		txt = txt.split('&amp;').join('&');
      
		var nobreakspace_codes = ['&#160;', '&nbsp;', String.fromCharCode(160)];
		for (var i=0; i<nobreakspace_codes.length;++i)
		txt=txt.split(nobreakspace_codes[i]).join(' ');

		txt = txt.replace(/\<.+?\>/g, ''); // trim
		txt = txt.replace(/^\s+|\s+$/g,''); // collapse multiple spaces into one
      	txt = txt.replace(/<script[^>]*>.*?<\/script>/ig, '');
      
        var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
        while (SCRIPT_REGEX.test(txt)) {
            txt = txt.replace(SCRIPT_REGEX, "");
        }      
      
		return txt;
	}
 
  static function CCV (label, color, formula) {
    var ccv : ChartComboValue = new ChartComboValue();
    ccv.Name = label;
    ccv.BaseColor = new ChartComboColorSet([ color ]);
    ccv.Expression = formula;
	return ccv;
 }
  
  static function UpdateBarChart_Profile (report, bar : HeaderChartCombo) {
    
    bar.TypeOfChart = ChartComboType.Bar100;
    
    bar.Size = 300;
    bar.Thickness = "18px";
   
    var c1 : ChartComboValue = CCV (ResourceText.Text(report,'labels','PercentEffective'), Config.Colors.Green3, 'CELLV(col-4,row)');
    var c2 : ChartComboValue = CCV (ResourceText.Text(report,'labels','PercentFrustrated'), Config.Colors.Orange3, 'CELLV(col-3,row)');
    var c3 : ChartComboValue = CCV (ResourceText.Text(report,'labels','PercentDetached'), Config.Colors.Blue3, 'CELLV(col-2,row)');
    var c4 : ChartComboValue = CCV (ResourceText.Text(report,'labels','PercentIneffective'), Config.Colors.Red3, 'CELLV(col-1,row)');
    
    bar.Values = [c1, c2, c3, c4];
    return bar;
  }


  static function UpdateBarChart100 (report, bar : HeaderChartCombo, color) {
    
    bar.TypeOfChart = ChartComboType.Bar100;
    
    bar.Size = 200;
    bar.Thickness = "18px";
    
    var score : ChartComboValue = CCV (ResourceText.Text(report,'labels','PercentFav'), color, 'CELLV(col-1,row)');
    var padding : ChartComboValue = CCV (ResourceText.Text(report,'labels','Potential'), '#FCFCFC', '100-CELLV(col-1,row)');
    
    bar.Values = [score, padding];
    return bar;
  }

  
  static function UpdateBarChart (report, bar : HeaderChartCombo) {
    
    bar.TypeOfChart = ChartComboType.Bar100;
    
    bar.Size = 200;
    bar.Thickness = "18px";
    
    var fav : ChartComboValue = CCV (ResourceText.Text(report,'labels','PercentFav'), Config.Colors.GreenAlternative, 'CELLV(col-3,row)');
    var neu : ChartComboValue = CCV (ResourceText.Text(report,'labels','PercentNeu'), Config.Colors.LightGreyAlternative, 'CELLV(col-2,row)');
    var unfav : ChartComboValue = CCV (ResourceText.Text(report,'labels','PercentUnfav'), Config.Colors.Orange2, 'CELLV(col-1,row)');
    
    bar.Values = [fav, neu, unfav];
    return bar;
  }
  
	static function SortTableByColumn (table, column_index) {
      var si : SortInfo = new SortInfo();
      
		// Sort Table in Descending order
		si.Enabled = true;
		si.Direction = TableSortDirection.Descending;
		si.SortByType = TableSortByType.Position;
		si.Position = column_index;

		table.Sorting.Rows = si;
	}
  
  static function SortAnswersByScore(a, b) {
    if (a.Score < b.Score) return -1;
    if (a.Score == b.Score) {
      	if (a.Code < b.Code) return -1;
      	if (a.Code > b.Code) return 1;
      	if (a.Code == b.Code) return 0;
    }
    if (a.Score > b.Score) return 1;
  }
  
	static function GetDimensionByQuestionId (qid, node_id) {
		if (DimensionByQuestionId == null) {
			DimensionByQuestionId = {};
          	var dimensions = GetAllDimensionsByNodeId( node_id );
            for (var i=0; i<dimensions.length; ++i) { 
              	var dimension = dimensions[i];
                for (var j=0; j<dimension.Questions.length; ++j) {
                  var question_id = dimension.Questions[j];
                  if (DimensionByQuestionId [question_id] == null)
                        DimensionByQuestionId [question_id] = dimension;
                }
            }
		}
		return DimensionByQuestionId[qid];
	}

	static function GetItemRowExpression_Compact (item, dimension_id) {
		return '[CONTENT]{id:' + (dimension_id + '_' + item.Id) + '; label:"' + LookupTable.GetQuestionNumberByQuestionId(item.Id) + '."}';
	}
	
	static function GetItemRowExpression (item, report, dimension_id, state) {
	
      	var powerpoint = ExecutionMode.isPowerPoint(state);
      
      return (powerpoint) ? GetItemRowExpressionSingleCell( item, report, dimension_id, state)
        : ('[SEGMENT]{id:' + (dimension_id + '_' + item.Id) + '; label:' + report.TableUtils.EncodeJsString ( LookupTable.GetQuestionNumberByQuestionId(item.Id) + '.') + '}/[CONTENT]{label:' + report.TableUtils.EncodeJsString( RemoveHtml(item.Text) ) + '}');
		
	}
        
    static function GetItemRowExpressionSingleCell( item, report, dimension_id, state) {
      return ('[CONTENT]{id:' + (dimension_id + '_' + item.Id) + '; label:' + report.TableUtils.EncodeJsString ( LookupTable.GetQuestionNumberByQuestionId(item.Id) + '. ' + RemoveHtml(item.Text) ) + '}');    
    }

  
    static function GetDimensionRowExpression_Compact (dimension) {
      return '[CONTENT]{id:' + dimension.Code + '; label:"' + '◊' + '"}';
	}
  
   
	static function GetDimensionRowExpression (dimension, dimension_label, report, state, prefix) {
      	if (prefix == null) prefix='';

      	var powerpoint = ExecutionMode.isPowerPoint(state);

      	return powerpoint ? ('[CONTENT]{id:' + dimension.Code + '; label:' + report.TableUtils.EncodeJsString( prefix + RemoveHtml(dimension_label).toUpperCase() ) + '}')
			: ('[CONTENT]{id:' + dimension.Code + '; label:' + report.TableUtils.EncodeJsString( prefix + RemoveHtml(dimension_label) ) + '}');
	}

	
	static function GetDimensionById ( dimension_id, node_id ) {
      	var AllDimensions = GetAllDimensionsByNodeId( node_id );
		for (var i=0; i<AllDimensions.length; ++i)
			if (AllDimensions[i].Id == dimension_id)
				return AllDimensions[i];
	}
  
	static function GetHeaderById(table, id, log) {
		var o = [];
		for (var i=0; i<table.RowHeaders.Count; ++i) o.push(table.RowHeaders[i]);
		for (var i=0; i<table.ColumnHeaders.Count; ++i) o.push(table.ColumnHeaders[i]);
		return FindMatch (o, id, log);
	}
  
	static function GetHeaderColumnById(table, id, log) {
		var o = [];
		for (var i=0; i<table.ColumnHeaders.Count; ++i) o.push(table.ColumnHeaders[i]);
		return FindMatch (o, id, log);
	}
	
	static function GetHeaderColumnMap( table ) {
		var map = {};
		var headers = GetHeaderArray( table.ColumnHeaders );
		for ( var i=0; i<headers.length; ++i )
			map [ headers[i].HeaderId ] = headers[i];
			
		return map;
	}
	
	static function GetHeaderArray( header_collection ) {
		
		var o = [];
		for (var i=0; i<header_collection.Count; ++i) {
			o.push ( header_collection[i] );
			o = o.concat ( GetHeaderArray ( header_collection[i].SubHeaders ) );
		}
		
		return o;
		
	}
	
	static function FindMatch(collection, id, log) {
		// Loop over collection
		for (var i=0; i<collection.length; ++i) {
			// Check current Header
			if (collection[i].HeaderId == id)  return collection[i];

			// See if there's a match in that header's Child Branches
			var o=[];
			for (var j=0; j<collection[i].SubHeaders.Count; ++j) o.push(collection[i].SubHeaders[j]);
			var match = FindMatch(o, id, log);
			if (match != null) return match;
		}
		// No match
		return null;
	}
  
  	// Added for Direct/Indirect reporting

   	static function SelfExpression (state, report, user, hideheader) {
			
		var self_expression = '[SEGMENT]{' + 
			'label:' + report.TableUtils.EncodeJsString( SelfExpression_Label (state, report, user ) ) + ';' + 
			'expression:' + report.TableUtils.EncodeJsString ( SelfExpression_Filter (state, report, user ) ) + '; hideheader: ' + (hideheader==true) +
			'}';
			
		return self_expression;
	}

   	static function SelfExpression_Label (state, report, user ) {
		var label;
		
		if ( HelperUtil.IsVirtualUnitActive ( state ) ) {
			var index = ParamUtil.GetParamCode (state, 'VU_ACTIVE');
		
			// VIRTUAL UNIT
			var vu = new VirtualUnits ( user );
			label = vu.Alias ( index );
		}
		else {
			// STANDARD REPORT BASE
			label = user.PersonalizedReportBaseText;
		}		
		return label;
	}

   	static function SelfExpression_Filter (state, report, user ) {
		var filter;
		
		if ( HelperUtil.IsVirtualUnitActive ( state ) ) {
			var index = ParamUtil.GetParamCode (state, 'VU_ACTIVE');
		
			// VIRTUAL UNIT
			var vu = new VirtualUnits ( user );
			filter = (Config.Hierarchy.Direct)
				? vu.DirectFilterExpression( index ) // Direct reporting				
				: vu.FilterExpression( index ); // Indirect Reporting
		}
		else {
			// STANDARD REPORT BASE
			filter = (Config.Hierarchy.Direct)
				? (
                  	(ParamUtil.GetParamCode(state, 'NODE_ID') == null)
              			?(Config.Hierarchy.VariableId + '="' + user.PersonalizedReportBase + '"') // Direct reporting
              			: ''
                )
				: 'INHIERARCHY (' + Config.Hierarchy.VariableId + ',"' + user.PersonalizedReportBase + '")'; // Indirect Reporting
		}
		return filter;
	}
		
  	static function TopExpression (report, user, hideheader) {
		if (Config.Hierarchy.Direct)
	  		var filter = Config.Hierarchy.VariableId + '="' + Config.Hierarchy.TopNodeId + '"';
		else 
			var filter = 'INHIERARCHY (' + Config.Hierarchy.VariableId + ',"' + Config.Hierarchy.TopNodeId + '")';
			
		var top_expression = '[SEGMENT]{' + 
				'label:' + report.TableUtils.EncodeJsString( Config.Hierarchy.TopNodeId) + ';' + 
          		'expression:' + report.TableUtils.EncodeJsString (filter) + '; hideheader: ' + (hideheader==true) +
				'}';
      		return top_expression;
	}
	
	static function SelfExpressionWithTopparent (state, report, user, hideheader) {
		if (Config.Hierarchy.Direct)
    		var self_expression = TopExpression(report, user, hideheader) + '+' + SelfExpression(state, report, user, hideheader);
		else 
          var self_expression = Config.Hierarchy.VariableId + '{self:true; topparent:true; children:0; totals:false; hideheader:'+ (hideheader==true) +'}';
      	return self_expression;
	}
  	
  	// JA (template 21.0) - new function below added because the new calculation functionalities require to know if
  	//						the violator is currently applied
  	static function IsViolatorApplied (user, confirmit) {
    	var supressedValue = DatabaseQuery.ExecQuery(confirmit, 
                                              		 Config.Hierarchy.SchemaId, 
                                              		 Config.Hierarchy.TableName, 
                                              		 Config.Hierarchy.HideScoresColumnName, 
                                              		 'id', 
                                              		 user.PersonalizedReportBase);

        if(supressedValue[0] == null || supressedValue[0] == 'undefined' || supressedValue[0] == '')
            return false;
        else
            return true;
    }
}