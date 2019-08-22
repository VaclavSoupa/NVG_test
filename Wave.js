class Wave {

    static function CurrentWaveExpression () {
        return Config.Wave.VariableId + ' = "' + Config.Wave.Codes.Current + '"'; // e.g. Year = "2015"
    }
	
    static function PreviousWaveExpression () {
        return Config.Wave.VariableId + ' = "' + Config.Wave.Codes.Previous + '"'; // e.g. Year = "2014"
    }

	static function PreviousWaveExpression2 () {
		return Config.Wave.VariableId + ' = "' + Config.Wave.Codes.Previous2 + '"'; // e.g. Year = "2013"
	}

    static function PreviousWaveExpression3 () {
        return Config.Wave.VariableId + ' = "' + Config.Wave.Codes.Previous3 + '"'; // e.g. Year = "2012"
    }
  
    static function Previous( state, report, user, hideheader, is_hidden, label ) {
      	if(label == null || typeof label == 'undefined')
          label = 'trend1';
		var encoded_label = report.TableUtils.EncodeJsString (label);
		if ( !is_hidden ) {
			var self_expression = HelperUtil.SelfExpression(state, report, user, true);
			return '[SEGMENT]{label:' + encoded_label + ';  hideheader:' + (hideheader==true) + '; expression:' + report.TableUtils.EncodeJsString( PreviousWaveExpression() ) + '}/(' + self_expression + ')';
		}
		else
			return '[CONTENT]{label:' + encoded_label + '}';        
    }
  
    static function Previous2( state, report, user, hideheader, is_hidden, label ) {
      	if(label == null || typeof label == 'undefined')
          label = 'trend2';
		var encoded_label = report.TableUtils.EncodeJsString (label);
		if ( !is_hidden ) {
			var self_expression = HelperUtil.SelfExpression(state, report, user, true);
			return '[SEGMENT]{label:' + encoded_label + '; hideheader:' + (hideheader==true) + '; expression:' + report.TableUtils.EncodeJsString( PreviousWaveExpression2() ) + '}/(' + self_expression + ')';
		}
		else
			return '[CONTENT]{label:' + encoded_label + '}';        
    }
  
    static function Previous3( state, report, user, hideheader, is_hidden, label ) {
      	if(label == null || typeof label == 'undefined')
          label = 'trend3';
		var encoded_label = report.TableUtils.EncodeJsString (label);
		if ( !is_hidden ) {
			var self_expression = HelperUtil.SelfExpression(state, report, user, true);
			return '[SEGMENT]{label:' + encoded_label  + '; hideheader:' + (hideheader==true) + '; expression:' + report.TableUtils.EncodeJsString( PreviousWaveExpression3() ) + '}/(' + self_expression + ')';
		}
		else
			return '[CONTENT]{label:' + encoded_label + '}';        
    }
  
    static function Current( report, user, state, comparators_map, DELETE_ME, hideheader) { //, topparent, break_is_by_hierarchy, report_base ) {
      
      var current = '[SEGMENT]{' + 
            'label:' + report.TableUtils.EncodeJsString( 'Current Wave' ) + ';' + 
            'hideheader:' + (hideheader==true) + ';' + 
            'expression:' + report.TableUtils.EncodeJsString( CurrentWaveExpression() ) + 
            '}';
            
        var segments = [];
      
        // Add SELF
        var self_expression = HelperUtil.SelfExpression(state, report, user);
        segments.push ( self_expression );

            
        // Add Comparators that are not historicals
      
      for ( var key in comparators_map ) {
      
      	var comparator = comparators_map [ key ];
        
        if ( !comparator.IsHistorical ) {
          
          if ( !comparator.Hidden ) {
  
              // Add separate Segment for comparator
            
              var filter = 'INHIERARCHY (' + Config.Hierarchy.VariableId + ',"' + comparator.Id + '")';
              var comparator_expression = '[SEGMENT]{' + 
                      'label:' + report.TableUtils.EncodeJsString( comparator.TableLabel + ' (' + comparator.Id + ')') + ';' + 
                      'expression:' + report.TableUtils.EncodeJsString (filter) + 
                      '}';
  
              segments.push ( comparator_expression );
          
          }
          else {
  
              // Add placeholder Content header for Comparatpr (no query will be executed)
  
            var comparator_expression = '[CONTENT]{label:"Hidden: ' + key + ': ' + comparator.Label + ': ' + comparator.TableLabel + '"}';
              segments.push ( comparator_expression );
          }
        } // if historical
      }
      
      return '(' + segments.join('+')  + ')/' + current;
    }

    static function CurrentExTab( report, user, state, hideheader, confirmit) {
		
		var map = ComparatorUtil.ProcessedComparatorsMap ( report, state, user );
      	var map2 = ComparatorUtil.ProcessedComparatorsMap ( report, state, user );
		//---------------------------------------------------------------------------------------
      	//For each of internal comparators - check if should be hidden based on hierarchy setting
      	//Comp 1
      	var supressedValue = DatabaseQuery.ExecQuery(confirmit, 
                                              Config.Hierarchy.SchemaId, 
                                              Config.Hierarchy.TableName, 
                                              Config.Hierarchy.HideScoresColumnName, 
                                              'id', 
                                              map2[Comparators.TotalCompany].Id);
		if(supressedValue[0] == null || supressedValue[0] == 'undefined' || supressedValue[0] == ''){}
        else
          map2[Comparators.TotalCompany].Hidden = true;
      
      	//Comp 2
      	supressedValue = DatabaseQuery.ExecQuery(confirmit, 
                                              Config.Hierarchy.SchemaId, 
                                              Config.Hierarchy.TableName, 
                                              Config.Hierarchy.HideScoresColumnName, 
                                              'id', 
                                              map2[Comparators.LevelUp].Id);
		if(supressedValue[0] == null || supressedValue[0] == 'undefined' || supressedValue[0] == ''){}
        else
          map2[Comparators.LevelUp].Hidden = true;
      
      	//Comp 3
      	supressedValue = DatabaseQuery.ExecQuery(confirmit, 
                                              Config.Hierarchy.SchemaId, 
                                              Config.Hierarchy.TableName, 
                                              Config.Hierarchy.HideScoresColumnName, 
                                              'id', 
                                              map2[Comparators.Level2].Id);
		if(supressedValue[0] == null || supressedValue[0] == 'undefined' || supressedValue[0] == ''){}
        else
          map2[Comparators.Level2].Hidden = true;
      
      	//Comp 4
      	supressedValue = DatabaseQuery.ExecQuery(confirmit, 
                                              Config.Hierarchy.SchemaId, 
                                              Config.Hierarchy.TableName, 
                                              Config.Hierarchy.HideScoresColumnName, 
                                              'id', 
                                              map2[Comparators.Custom1].Id);
		if(supressedValue[0] == null || supressedValue[0] == 'undefined' || supressedValue[0] == ''){}
        else
          map2[Comparators.Custom1].Hidden = true;
      
      	//Comp 5
      	supressedValue = DatabaseQuery.ExecQuery(confirmit, 
                                              Config.Hierarchy.SchemaId, 
                                              Config.Hierarchy.TableName, 
                                              Config.Hierarchy.HideScoresColumnName, 
                                              'id', 
                                              map2[Comparators.Custom2].Id);
		if(supressedValue[0] == null || supressedValue[0] == 'undefined' || supressedValue[0] == ''){}
        else
          map2[Comparators.Custom2].Hidden = true;
  		//End of hierarchy settings check
      	//---------------------------------------------------------------------------------------
      	
		var rtLabels = ResourceText.List(report,'labels');
		var z = [];

		var segments = [];

		// SELF
		var self_expression = HelperUtil.SelfExpression(state, report, user);
		segments.push ( self_expression );   
      
		var current_wave = '[SEGMENT]{' + 
			'label:' + report.TableUtils.EncodeJsString( rtLabels['YourCurrentResults'] ) + ';' + 
			'hideheader:' + (hideheader==true) + ';' + 
			'expression:' + report.TableUtils.EncodeJsString( CurrentWaveExpression() ) + '}';
			
		z.push ( '(' + segments.join('+')  + ')/' + current_wave ); 
      	
		// HISTORICAL COMPS
		if ( !map[ Comparators.Prev ].Hidden )
		  z.push ( Wave.Previous(state, report, user, null, null, map[ Comparators.Prev ].Label) );
		  
		if ( !map[ Comparators.Prev2 ].Hidden )
		  z.push ( Wave.Previous2(state, report, user, null, null, map[ Comparators.Prev2 ].Label) );

		if ( !map[ Comparators.Prev3 ].Hidden )
		  z.push ( Wave.Previous3(state, report, user, null, null, map[ Comparators.Prev3 ].Label) );
      	
      	var segments = [];
		// NON-HISTORICAL COMPS: Top, Parent, ...
		for (var key in map) {
			var comparator = map [ key ];
			if ( !comparator.IsHistorical ) {
				if ( !comparator.Hidden ) {
                    if(map2[key].Hidden){
                      segments.push ( 
                          '[CONTENT]{' + 
                          'label:' + report.TableUtils.EncodeJsString(comparator.TableLabel) + '}'
                       );
                    }
                    else{
                      var filter = 'INHIERARCHY (' + Config.Hierarchy.VariableId + ',"' 
                        			+ comparator.Id + '")';
                      segments.push ( 
                          '[SEGMENT]{' + 
                          'label:' + report.TableUtils.EncodeJsString(comparator.TableLabel) + ';' + 
                          'expression:' + report.TableUtils.EncodeJsString ( filter ) + '}'
                       );
                    }
				}
			}
		}
		if(segments.length > 0)
			z.push ( '(' + segments.join('+')  + ')/' + current_wave ); 
      	
		// NORMS
		var norm_enabled = [];
		for (var i=0; i<Config.Norms.Codes.length; ++i)
			norm_enabled.push ( ParamUtil.Contains (state, 'COMPARATORS_EXTERNAL', 'norm' + (i+1) ) );

		var labels = [];
		var norm_labels = ResourceText.List (report, 'benchmarkset', HelperUtil.GetBenchmarkListLocation (report));
		for (var i=0; i<Config.Norms.Codes.length; ++i)
			labels.push ( norm_labels [ NormUtil.GetNormId (user, i) ] );

		for (var i=0; i<Config.Norms.Codes.length; ++i) {
			if (norm_enabled[i]) {
				z.push ( '[CONTENT]{label:' + report.TableUtils.EncodeJsString ( labels[i] + ' ' + rtLabels['norm'] ) + '}' );
			}
		}

		var expr = z.join('+');
		
		return expr;        
	}
    
}