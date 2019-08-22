class Page_Dashboard {

  //Generates whole dashboard based on user config
  public static function GenerateDashboardHTML(report : Report, user : User, state : ReportState, pageContext : ScriptPageContext, confirmit : ConfirmitFacade){
    //Get results out
    var qm = QueryManager.GetQueryManagerMain(report, state, user, true);
    var qs = qm.GetAllQuestions();

    //Put qm into page context
    pageContext.Items[PageContextEnum.qm] = qm;

    //Get labels and widgets questions out
    var labels = ResourceText.List(report, 'labels');
    var widgetsT = ResourceText.List(report, 'widgets');
    var moreButton = ResourceText.Text (report, 'buttons', 'More');

    //Get the dashboard for this role
    var dashboard = UserType.GetDashboard(state, user);

    var widgets = [];

    //Iterate over all items and generate them
    for(var i = 0; i<dashboard.length; i++){
      	var buttonHidden = false;
      	switch(dashboard[i]){
          	case CustomWidget.ResponseRate:
            	widgets.push(new WidgetRR(report, state, i, widgetsT, labels, dashboard[i]));
            	buttonHidden = PageHide.ResponseRate(user, state);
            	break;
            case CustomWidget.EE:
            	widgets.push(new WidgetEngEna(report, state, i, widgetsT, labels, dashboard[i]));
            	buttonHidden = PageHide.EngagementAndEnablement(user, state);
            	break;
            case CustomWidget.EffectivenessProfile:
            	widgets.push(new WidgetEEF2(report, state, i, widgetsT, labels, dashboard[i]));
            	buttonHidden = PageHide.EffectivessProfile(user, state);
            	break;
            case CustomWidget.TopDimensions:
            	widgets.push(new WidgetTopDims(report, state, qm, i, widgetsT, labels, dashboard[i], user, confirmit));
            	buttonHidden = PageHide.SurveyDimensions(user, state);
            	break;
            case CustomWidget.QuestionTrend:
            	widgets.push(new WidgetTrend(report, state, qm, i, widgetsT, labels, dashboard[i]));
            	buttonHidden = PageHide.ResultsSortingTool(user, state);
            	break;
            case CustomWidget.InternalComparison:
            	widgets.push(new WidgetInternalComp(report, state, qm, i, widgetsT ,labels, user, dashboard[i]));
            	buttonHidden = PageHide.ResultsSortingTool(user, state);
            	break;
            case CustomWidget.ExternalComparison:
            	widgets.push(new WidgetNorm(report, state, qm, i, widgetsT ,labels, user, dashboard[i]));
            	buttonHidden = PageHide.ResultsSortingTool(user, state);
            	break;
            case CustomWidget.KeyDrivers:
            	widgets.push(new WidgetKDA(report, state, qm, i, widgetsT ,labels, user, dashboard[i]));
            	buttonHidden = PageHide.EngagementAndEnablementDrivers(user, state);
            	break;
            case CustomWidget.TopCommentThemes:
            	widgets.push(new WidgetCommentThemes(report, state, qm, i, widgetsT ,labels, dashboard[i], confirmit, user));
            	buttonHidden = PageHide.Comments(user, state, report, confirmit);
            	break;
            case CustomWidget.Strengths:
            	widgets.push(new WidgetStrengths(report, state, qm, i, widgetsT, labels, dashboard[i]));
            	buttonHidden = PageHide.ResultsSortingTool(user, state);
            	break;
            case CustomWidget.Opportunities:
            	widgets.push(new WidgetOpps(report, state, qm, i, widgetsT, labels, dashboard[i]));
            	buttonHidden = PageHide.ResultsSortingTool(user, state);
            	break;
            case CustomWidget.ENPS:
            	widgets.push(new WidgetENPS(report, state, qm, i, widgetsT ,labels, dashboard[i]));
            	buttonHidden = PageHide.ENPS(user, state);
            	break;
            case CustomWidget.Tier1:
            	widgets.push(new WidgetTier1(report, state, i, widgetsT, labels, dashboard[i]));
            	buttonHidden = PageHide.SurveyDimensions(user, state);
            	break;
          	default:
        }
      	if(buttonHidden || !ExecutionMode.isWeb(state)) widgets[widgets.length-1].HideButton();
    }

    //Generate HTML
    var outputString = '<table class="dashboardtable"><tbody>';
    for(var i=0; i<widgets.length; i++){
      	if(i%3==0){
          	if(i==0)
              	outputString = outputString + '<tr><td class="dashboardWidgetCell">';
            else
      			outputString = outputString + '</tr><tr><td class="dashboardWidgetCell">';

          	outputString = outputString + Page_Dashboard.GetFullWidgetHTML(widgets[i], moreButton);
          	outputString = outputString + '</td>';
        }
      	else{
      		outputString = outputString + '<td class="dashboardWidgetCell">';
          	outputString = outputString + Page_Dashboard.GetFullWidgetHTML(widgets[i], moreButton);
          	outputString = outputString + '</td>';
        }
    }
    outputString = outputString + '</tr>';

    //Create HTML string for all of the widgets
  	return outputString + '</tbody></table>';
  }

  public static function GetFullWidgetHTML(widget : DashboardWidget, moreButton){
  	var output = '<div class=widget><table style="width:100%">'+
    '<tr><td class=WidgetHeading>' + widget.GetTitle() + '</td><td align=right>' + widget.GetButtonHTML(moreButton) +
    '<br></td></tr></table>' + widget.GetBody() + '</div>';

    return output;
  }

  static function LoadTableEEF (report, table, state, user, caching, confirmit) {
		table.Caching.Enabled = true;
      	table.Caching.CacheKey = HelperUtil.GetCacheKeyForT0(user, report, state, '');

		var X=[], Y=[];

		var norm_enabled = [];
		for (var i=0; i<Config.Norms.Codes.length; ++i) {
			norm_enabled.push ( ParamUtil.Contains (state, 'COMPARATORS_EXTERNAL', 'norm' + (i+1) ) );
		}

		X.push ( Config.EffectivenessProfile.VariableId + '{totals:false; hidedata:false}');

		Y.push ( Wave.CurrentExTab(report, user, state, true, confirmit) );

		var y = Y.join('+');
		var x = X.join('+');
        var expr = [y, x].join('^');

		table.AddHeaders(report, 'ds0', expr);

		var visible_comparators = 0;
		var map = ComparatorUtil.ProcessedComparatorsMap ( report, state, user );

        for ( var key in map ) {
          var comparator = map [ key ];
          visible_comparators += (comparator.Hidden ? 0 : 1);
      	}


	  	// populate norm values
		var tableindex_mod = 0;
		for (var i=0; i<Config.Norms.Codes.length; ++i) {
			if (norm_enabled[i]) {

				var norm_id = NormUtil.GetNormId (user, i);
				var distribution = EffectivenessProfileNormsDistribution.GetByNormId ( norm_id );
              	var idx = 1 + visible_comparators + tableindex_mod;

				var hc : HeaderContent = table.RowHeaders[ idx ];

				if (distribution != null) {
					hc.SetCellValue (0, distribution.Effective);
					hc.SetCellValue (1, distribution.Frustrated);
					hc.SetCellValue (2, distribution.Detached);
					hc.SetCellValue (3, distribution.Ineffective);
				}

				tableindex_mod++;
			}
		}
	}

  	static function GenerateWidgetHidingScript (start, end) {
      	var o : String = '<script>' +
          					'window.onload = function () {' +
                              	'var i = void 0;' +
                                'var j = void 0;' +
                                'var k = void 0;' +
                                'var l = void 0;' +
                                'var row_cells = void 0;' +
                                'var all_hidden = true;' +
          						'var widgets = document.getElementsByClassName("widget");' +
                                'var tab_rows = document.getElementsByClassName("dashboardtable")[0].rows;' +
                              	'for (i = 0; i < ' + start + '; i++) {' +
                                	'widgets[i].parentNode.style.display = "none";' +
                             	'}' +
                               	'for (j = (' + end + ' + 1); j < widgets.length; j++) {' +
                                	'widgets[j].parentNode.style.display = "none";' +
                             	'}' +
                                'for (k = 0; k < tab_rows.length; k++) {' +
                                	'row_cells = tab_rows[k].cells;' +
                                    'all_hidden = true;' +
                                    'for (l = 0; l < row_cells.length; l++) {' +
                                    	'if(row_cells[l].style.display.localeCompare("none") != 0) all_hidden = false;' +
                                    '}' +
                                    'if (all_hidden) tab_rows[k].style.display = "none";' +
                             	'}' +
                         	'}' +
                     	 '</script>';

      	return o;
    }
}