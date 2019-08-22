class FilterUtil {
  //Returns true if ANY filters are applied
  static function AreAnyFiltersApplied(user, state){
  	var appliedCutsCount = 0;
    var filters = UserType.GetRoleConfig(state, user).Filters;
	for (var i=0; i<filters.length; ++i) {
      var param_name = 'FILTER' + (i+1);	
      var values = ParamUtil.GetParamCodes ( state, param_name );
      if(values.length > 0){
        appliedCutsCount = appliedCutsCount + values.length;
      }
	}
    
    return appliedCutsCount > 0;
  }
  
  static function GetLabelsFromNameValuePairs ( pairs, report ) {
   	var project = report.DataSource.GetProject('ds0');
    var labels = [];
    for (var i=0; i<pairs.length; ++i) {
      	var value_label = ResourceText.Text ( report, pairs[i].Name, pairs[i].Value, 'ds0');
      	labels.push ( value_label );
    }
    return labels;
  }
  

  static function ParseExpression ( e : String) {

    	e = e.toUpperCase();
    
		var o = [];
        if (e != null) {
          var pairs = e.split (' AND ');
          for (var i=0; i<pairs.length; ++i) {
              var pair = pairs[i];
              var parts = pair.split('=');
            
            if (parts.length == 2) {
                var name = Trim ( parts[0] );
              var value = Trim ( parts[1].split('"').join('') );
                o.push (
                    {
                        Name: name,
                        Value: value
                    }
                );
            }
          }
        }
      	return o;

	}

	static function Trim ( str ) {
		return str.replace(/^\s+|\s+$/g, '');
	}

  
  
  static function HideFilter (state, user, idx) {
	return (idx > GetFilters(state, user).length);
  }  
  
  static function GetFilters(state, user) {
    return UserType.GetFilters(state, user); //  Config.Filters;
  }
  
  static function Today() {

		var now = new Date();
		var dt = now.getDate();
		var month = now.getMonth()+1;

		now = [
		  now.getFullYear(),
		  (month<10 ? '0' : '') + month,
		  (dt<10 ? '0' : '') + dt
		].join('-');

		// Example:
		// now = '2013-05-30'

		return 'TODATE("' + now + '")';	
	}

  static function ActionSegmentExpression (status) {
      	const StartDate = 'start_date';
      	const EndDate = 'end_date';
		var e;
		var today = Today();
		
		switch (status) {
			case ActionStatus.Planned:
				e =  [
                  	today + '<' + StartDate,
					'plan_status="1"' // not started
			  ];
				break;
				
			case ActionStatus.Delayed:
				e = [
					today + '>=' + StartDate,
					today + '<=' + EndDate,
					'plan_status="1"' // not started
				];
				break;

			case ActionStatus.Cancelled:
				e = [
					'plan_status="4"' // cancelled
				];
				break;

			case ActionStatus.Overdue:
				e = [
					'IN (plan_status, "1", "2")', // not started + in progress
					today + '>' + EndDate
				];
				break;

			case ActionStatus.Ongoing:
				e = [
					today + '<=' + EndDate,
					'plan_status="2"' // in progress
				];
				break;

			case ActionStatus.Completed:
				e = ['plan_status="3"'];
				break;

			case ActionStatus.BestPractice:
				e = [
					'ANY (flag, "bp")'
				];
				break;

			default:
				e = [''];
				break;
		
		}
		return e;
	}
  
  static function GetParamFilterExpression (user : User, report, state) {
    
    // Note: This Filter Expression includes the User Level Filter
    
      var o = [];
	  if ( user.PersonalizedFilterExpression != '' && user.PersonalizedFilterExpression != null) 
        	o.push ( user.PersonalizedFilterExpression );
    
    var filters = GetFilters(state, user);
      for (var i=0; i<filters.length; ++i) {
          var param_name = 'FILTER' + (i+1);
       	  var qid = (filters[i].Id == null) ? filters[i] : filters[i].Id;
        
        var codes = ParamUtil.GetParamCodes (state, param_name);
        
          // Add Quotes
        for (var j=0; j<codes.length; ++j)
         	codes[j] = '"' + codes[j] + '"'; 

		
		if (codes.length > 0) {
			switch ( qid.toLowerCase() ) {
				case 'virtual_unit':
                	var tmp=[]
                	for (var idx=0; idx<codes.length; ++idx)
						tmp.push ('INHIERARCHY(' + Config.Hierarchy.VariableId + ',' + codes[idx] + ')');
                
                	o.push ( '(' + tmp.join(' OR ') + ')' );
					break;
			
				default:
					o.push ('IN(' + qid + ',' + codes.join(',') + ')');
			}
		}
      }
	  
	  return o.join(' AND ');   	 
  }
  
  
	static function GetParamFilterText (user : User, report, state) {
      
      
		var o = [];
		var project = report.DataSource.GetProject('ds0');		
		
       	var filters = GetFilters(state, user);


      for (var i=0; i<filters.length; ++i) {
        
			var param_name = 'FILTER' + (i+1);
			var qid = (filters[i].Id == null) ? filters[i] : filters[i].Id;
			var codes = ParamUtil.GetParamCodes (state, param_name);
           
		   
			if (codes.length > 0) {
            	var q = project.GetQuestion (qid);
                var label = (filters[i].Label == null) ? q.Title : filters[i].Label;
            	var labels = [];
                for (var j=0; j<codes.length; ++j) {
                  	var code = codes[j];
                    labels.push ( '<span class="FilterAnswerText">' + HelperUtil.RemoveHtml (q.GetAnswer(code).Text)  + '</span>' );
                }
            	
            
            	o.push ('<span class="FilterText">' + HelperUtil.RemoveHtml ( label.toUpperCase() ) + ' = ' + labels.join (' / ') + '</span>');
          }
      }
      
      
	if (o.length>0)
        return '<div class="FilterBackground">' + o.join('<span class=SelectorHeading> ' + ResourceText.Text(report,'labels','AND') + ' </span>') + '</div>' + '<br><br>';
      else
          return '';
  }
  
  static function GetThemeFilter(report, state, user, confirmit) {

      var expr = '';
	  
	  var selected = ParamUtil.Selected (report, state, 'THEME', user, null, null, confirmit);
	  
	  if (selected != null) {
		  var selected_theme_code = selected.Code;
		  var selected_verbatim_code = ParamUtil.GetParamCode (state, 'VERBATIM');
		  
		  if ( selected_theme_code != null && selected_theme_code != '0' ) {
		  
			  // Verify that the selected code actually is present in the current list
			  // This is important if the verbatim question has changed, and the questions have different themes.
			
			  var h = {};
			  var theme_qid = (selected_verbatim_code + 'Theme');
              var q : Question = report.DataSource.GetProject('ds0').GetQuestion(theme_qid);
			  var themes = q.GetAnswers();
			
			  for (var i=0; i<themes.length; ++i)
				  h[themes[i].Precode] = '1';
			
			if ( h[selected_theme_code] == '1') {
			  // Yes, it is present
              switch ( q.QuestionType) {
                case QuestionType.Multi:
                  	expr = 'ANY(' + theme_qid + ',"' + selected_theme_code + '")';
                  	break;
                  
                default:
                  	expr = theme_qid + '="' + selected_theme_code + '"';   
              }
			}
		  }
		}
       return expr;
  }
  
}