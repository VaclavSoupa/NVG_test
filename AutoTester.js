class AutoTester {

	var m_project;
	var m_report;
	var m_state;

	function AutoTester (report, state) {
	
		m_report = report;
		m_state = state;
		m_project = report.DataSource.GetProject ( 'ds0' );
	}
	
  	
  function FormattedResults(show_passed) {
   	var a = Analysis();
	var rows = [];
    for (var i=0; i<a.length; ++i) {
		var analysis = a[i];
		if ( show_passed || !analysis.Passed ) {
			var style = 'style="padding:12px; color:white; background-color:' + (analysis.Passed ? 'green' : 'red') + '; font-size:11px;"';
			rows.push ('<tr><td ' + style + '>' + analysis.Label + '</td><td ' + style + '>' + analysis.Details + '</td></tr>');
		}
    }
	
    var o = [];
	if (rows.length > 0) {
		o.push (
			'<div style="padding: 10px; overflow-x: auto; overflow-y: auto; width: 850px; max-height: 300px">',
			'<table width=800 border=0>',
			rows.join ( '\n' ),
			'</table>',
			'</div>'
		);
	}
    
    return o.join('\n');
  }
  
  
	function Analysis() {
	
		var results = [];
		
		// Check Dimensions
		for (var i=0; i<Config.Dimensions.length; ++i) {
			var dim = Config.Dimensions[i];
			results.push (  QuestionAnalysis ( 'Dimension ' + dim.Id, dim.Questions ) );
		}
      
      	// Check Filters for All Roles
		results.push (  
			QuestionAnalysis ( 'Filters for HayGroupUser', Config.Roles.HayGroupUser.Filters ),
			QuestionAnalysis ( 'Filters for ExecUser', Config.Roles.ExecUser.Filters ),
			QuestionAnalysis ( 'Filters for StandardUser', Config.Roles.StandardUser.Filters),
			QuestionAnalysis ( 'Filters for PowerUser', Config.Roles.PowerUser.Filters),
			QuestionAnalysis ( 'Filters for Custom1', Config.Roles.Custom1.Filters),
			QuestionAnalysis ( 'Filters for Custom2', Config.Roles.Custom2.Filters)
		);
		
      	// Check Demographics for All Roles
		results.push (  
			QuestionAnalysis ( 'Demographics for HayGroupUser', Config.Roles.HayGroupUser.Demographics ),
			QuestionAnalysis ( 'Demographics for ExecUser', Config.Roles.ExecUser.Demographics ),
			QuestionAnalysis ( 'Demographics for StandardUser', Config.Roles.StandardUser.Demographics),
			QuestionAnalysis ( 'Demographics for PowerUser', Config.Roles.PowerUser.Demographics),
			QuestionAnalysis ( 'Demographics for Custom1', Config.Roles.Custom1.Demographics),
			QuestionAnalysis ( 'Demographics for Custom2', Config.Roles.Custom2.Demographics)
		);
		
      	// Comments and NSQ
        var commentsQuestions = [];
        for(var i=0; i<Config.Comments.Questions.length; i++){
          commentsQuestions.push(Config.Comments.Questions[i].Id);
        }
      
		results.push (  
			QuestionAnalysis ( 'Comments', commentsQuestions ),
			QuestionAnalysis ( 'Non-standard Questions', Config.NSQ )
		);

      return results;
	}


	function QuestionAnalysis( analysis_name, qids ) {
		var errors = [];
		for (var i=0; i<qids.length; ++i)
			if (!Exists (qids[i]))
				errors.push ( qids[i] );
      
		return {
			Label: analysis_name,
			Passed: (errors.length == 0),
			Details: (errors.length == 0) ? 'OK' : ('Not Found: ' + errors.join(', '))
		};
	}
	
	function Exists ( qid ) {
			try {
				var q = m_project.GetQuestion ( qid );
              	if (q == null) return false;
			}
			catch (e) {
				return false;
			}
		return true;
	}

}