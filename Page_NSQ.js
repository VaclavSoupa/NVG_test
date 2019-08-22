class Page_NSQ {
 
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
	
		var nsq_qid = ParamUtil.GetParamCode(state, 'NSQ');
	
		if (nsq_qid) {
		  var selectedCode = nsq_qid;
		} else {
		  var selectedCode = ParamLists.Get('NSQ', state, report)[0].Code;
		}
	
		var project = report.DataSource.GetProject('ds0');
		var question : Question = project.GetQuestion ( selectedCode );
		
		if (question.IsInCategory('ranking')) {
		  X.push ('[SEGMENT]{label:"' + ResourceText.Text (report, 'nsq', 'TimesSelected') + '"}/[N]{hideheader:true}/[CATEGORIES]');
		} else {
		  X.push ('[N]{hideheader:true}+[SEGMENT]{label:"Pct"}');
		}
      		
		X.push ('[CHART]{id:barchart; label:"' + ResourceText.Text (report, 'labels', 'Distribution') + '"}');
		
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
		
		var bar : HeaderChartCombo = HelperUtil.GetHeaderById(table, 'barchart');
		
		bar.TypeOfChart = ChartComboType.Bar;
		bar.Size = 300;
		bar.Thickness = "18px";
		   
		var c1 : ChartComboValue = HelperUtil.CCV (ResourceText.Text (report, 'labels', 'Distribution'), '#00b4eb', 'CELLV(col-1,row)');
			
		bar.Values = [c1];
	}  
	
 	 static function N ( report, state, table ) {
		table.Caching.Enabled = Config.Caching.Enabled;
		
		var y;
		var x;
	
		var nsq_qid = ParamUtil.GetParamCode(state, 'NSQ');
	
		if (nsq_qid) {
		  var selectedCode = nsq_qid;
		} else {
		  var selectedCode = ParamLists.Get('NSQ', state, report)[0].Code;
		}
	
		var project = report.DataSource.GetProject('ds0');
		var question : Question = project.GetQuestion ( selectedCode );

        switch (question.QuestionType) {
		  case QuestionType.Multi:
		  case QuestionType.MultiNumeric:
   		    var answers = question.GetAnswers();
		    var filter = 'NOT(ISNULL(' + nsq_qid + '_' + answers[0].Precode + '))';
		    x = '[N]';
			y = '[SEGMENT]{expression:' + report.TableUtils.EncodeJsString ( filter ) + '}';
			break;
			
		  case QuestionType.MultiOrdered:
   		    var answers = question.GetAnswers();
		    var filter = 'NOT(ISNULL(' + nsq_qid + '_' + answers[0].Precode + '))';
            x = '[FORMULA]{expression:"if( ROW = 1,CELLV(2,1), CELLV(COL,ROW-1)+CELLV(COL+1,ROW))"} + [CATEGORIES]/[N]';
            y = nsq_qid + '{collapsed:true}';
			break;
			
		  default:
		    var filter = 'NOT(ISNULL(' + nsq_qid + '))';
		    x = '[N]';
			y = '[SEGMENT]{expression:' + report.TableUtils.EncodeJsString ( filter ) + '}';
			break;
		}
	
		var expr = [y, x].join('^');

        table.AddHeaders ( report, 'ds0', expr );
 	}
  
  
  	//NSQ IBT SECTION
  	static function Selection_Export (report, state, user) {
      return ParamUtil.Selected (report, state, 'NSQIBT_PAGED', user);
    }
  
    static function Selection_BreakBy (report, state, user) {
      var param_values = ParamLists.Get('DEMOGR_PAGED', state, report, user);
      var selected = ParamUtil.Selected (report, state, 'DEMOGR_PAGED', user);
      var exp = Page_NSQ.Selection_Export (report, state, user);
      
      return (exp == null)
          ? (selected == null) ? param_values[0] : selected
          : ParamUtil.GetByValue( exp.BreakBy, report, state, 'DEMOGR_PAGED', user);
    }
    
    static function Selection_Question (report, state, user) {
      var exp = Page_NSQ.Selection_Export (report, state, user);
      if(exp == null){
      	exp = ParamUtil.Selected (report, state, 'NSQ');
        if(exp == null)
    		exp = ParamLists.Get('NSQ', state, report)[0];
      }
      else
        exp = ParamUtil.GetByValue( exp.Question, report, state, 'NSQ', user);
      
      return exp;
    }
    
    static function Selection_DisplayCompsAs (report, state, user) {
      var exp = Page_NSQ.Selection_Export (report, state, user);
      return (exp == null)
          ? ParamUtil.Selected (report, state, 'COMPARATOR_VALUETYPE', user)
          : ParamUtil.GetByValue( exp.DisplayCompsAs, report, state, 'COMPARATOR_VALUETYPE', user);
    }
  
  	//Adds IBT QM to page context
  	public static function AddQMToPageContext(confirmit, report, user, state, pageContext){
        var qm = QueryManagerBreakByInterface.GetQM('NSQIBT', confirmit, report, user, state);
        pageContext.Items[PageContextEnum.qm] = qm;
    }
}