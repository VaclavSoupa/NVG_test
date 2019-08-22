class Page_RankingQuestions {

	static function ValidN( report ) {
		return  report.TableUtils.GetCellValue('N',report.TableUtils.GetColumnValues('N',1).length,1).Value;
	}

	static function PrivacyViolation ( report ) {
		return  ( ValidN( report ) < Config.Privacy.Table.MinN );
	}

	static function t0 ( report, state, table ) {
		table.Caching.Enabled = Config.Caching.Enabled;
		table.Caching.CacheKey = report.CurrentLanguage;
		var Y = [];
		var X = [];

		var ranking_qid = ParamUtil.GetParamCode(state, 'RANKING_QUESTIONS');

		if (ranking_qid) {
		  var selectedCode = ranking_qid;
		} else {
		  var selectedCode = ParamLists.Get('RANKING_QUESTIONS', state, report)[0].Code;
		}

		var project = report.DataSource.GetProject('ds0');
		var question : Question = project.GetQuestion ( selectedCode );

		//with Total column
		//X.push ('[SEGMENT]{label:"' + ResourceText.Text (report, 'nsq', 'TimesSelected') + '"}/[N]{hideheader:true}/[CATEGORIES]');
		//without Total columns - should be used as default
		X.push ('([SEGMENT]{label:"' + ResourceText.Text (report, 'nsq', 'TimesSelected') + '"}/[N]{hideheader:true}/[CATEGORIES]{totals:false})');
      
		var p=[];

		p.push ('totals:false');

		switch (question.QuestionType) {
		  case QuestionType.Multi:
		  case QuestionType.MultiNumeric:
		  case QuestionType.MultiOrdered:
  			p.push ('collapsed: true');
  			break;
			
		  default:
  			p.push ('collapsed: false');
  			break;
		}

		Y.push ( selectedCode + '{' + p.join('; ') + '}' );

		var expr = Y.join('+') + '^' + X.join('+');  	
      
		table.AddHeaders ( report, 'ds0', expr );

		table.Sorting.Rows.Enabled = true;
		table.Sorting.Rows.Position = 1;
		table.Sorting.Rows.Direction = TableSortDirection.Descending;
	}

  static function N ( report, state, table ) {
    table.Caching.Enabled = Config.Caching.Enabled;
    var y;
    var x;
    
    var ranking_qid = ParamUtil.GetParamCode(state, 'RANKING_QUESTIONS');
    if (ranking_qid) {
      var selectedCode = ranking_qid;
    } else {
      var selectedCode = ParamLists.Get('RANKING_QUESTIONS', state, report)[0].Code;
    }
    
    var project = report.DataSource.GetProject('ds0');
    var question : Question = project.GetQuestion ( selectedCode );
    
    switch (question.QuestionType) {
      case QuestionType.Multi:
      case QuestionType.MultiNumeric:
        var answers = question.GetAnswers();
        var filter = 'NOT(ISNULL(' + ranking_qid + '_' + answers[0].Precode + '))';
        x = '[N]';
        y = '[SEGMENT]{expression:' + report.TableUtils.EncodeJsString ( filter ) + '}';
        break;
        
      case QuestionType.MultiOrdered:
        var answers = question.GetAnswers();
        var filter = 'NOT(ISNULL(' + ranking_qid + '_' + answers[0].Precode + '))';
        x = '[FORMULA]{expression:"if( ROW = 1,CELLV(2,1), CELLV(COL,ROW-1)+CELLV(COL+1,ROW))"} + [CATEGORIES]/[N]';
        y = ranking_qid + '{collapsed:true}';
			  break;

	  default:
        var filter = 'NOT(ISNULL(' + ranking_qid + '))';
        x = '[N]';
        y = '[SEGMENT]{expression:' + report.TableUtils.EncodeJsString ( filter ) + '}';
        break;
	}

	var expr = [y, x].join('^');

    table.AddHeaders ( report, 'ds0', expr );
  }
}