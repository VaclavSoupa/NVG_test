// CLASS ParamLists : 106
// VARIABLE CachedAnswerList : 108
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FUNCTION Get : 114
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Following Parameters don't load their content based on this function:
// 'ERRORMSG' , 'FLAG_SHOWFILTERS' , 'INIT' , 'LAST_VISITED_PAGE' , 'PSS_SERIALIZED' ,
// 'Q' , 'REPORT_BASE_TOP' , 'RUNONCE' , 'VU_EDITOR_ALIAS' , 'VU_EDITOR_LIST' , 'WAVE'
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// case ACTIONPLAN_BREAKBY : 124
// case ACTIONPLAN_CODEDFIELD : 140
// case ACTIONPLAN_CUSTOMFIELD : 155
// case ACTIONPLAN_CUSTOMVALUE : 170
// case COMPARATOR_VALUETYPE : 189
// case COMPARATORS_EXTERNAL : 201
// case COMPARATORS_INTERNAL : 223
// case COMPARATORS_INTERNAL_ALL : 224
// case DASHBOARD_PAGED : 312
// case DATA : 336
// case DEMOGR : 348
// case DEMOGR2 : 349
// case PSS_DEMO : 350
// case PSS_DEMO2 : 351
// case DEMOGR_PAGED : 374
// case DIMENSION : 410
// case DIMENSION_TIER1 : 432
// case DIMENSION_TIER2 : 457
// case DISTRIBUTION : 481
// case EEF_GAP : 493
// case EEF_GAP_PLOT : 508
// case FILTER : 521
// case HIGHLIGHTER_BASIS : 544
// case RSS_PAGED : 555 
// case IBT_PAGED : 556
// case INTERNAL_BENCHMARK_DATA : 715
// case ITEM : 734
// case ITEM_ACTIONPLANNING : 735
// case ITEM_WITH_ENPS : 736
// case ITEM2 : 737
// case LOCAL_DIMENSION : 851
// case MATRIX_DIMENSIONS_PAGED : 883
// case NODE_ID : 912
// case NPS_GAP : 930
// case NSQ : 844
// case NSQ_PAGED : 951
// case NSQIBT_PAGED : 978
// case RANKING_QUESTIONS : 1079
// case PID : 1086
// case PSS : 1136
// case QUESTIONS_SUMMARY_PAGED : 1253
// case REPORTITEM : 1620
// case ROLE : 1629
// case RST : 1645
//      Strengths : 1672
//      Opportunities : 1687
//      Key Drivers - ENGAGEMENT : 1702
//      Key Drivers - ENABLEMENT : 1719
//      Question Trend 1 : 1736
//      Question Trend 2 : 1754
//      Question Trend 3 : 1773
//      Total Company : 1792
//      Level Up : 1811
//      Level 2 : 1830
//      Custom 1 : 1849
//      Custom 2 : 1868
//      External Comparisons : 1887
//      Full question set by Favorable : 1910
//      Full question set by Neutral : 1925
//      Full question set by Unfavorable : 1940
//      Top 10 Most Favorable : 1955
//      Top 10 Least Favorable : 1970
//      Top 10 Most Unfavorable : 1985
//      Top 10 Least Unfavorable : 2000
//      Top 10 Neutral : 2015
//      Top 10 Improved (Trend) : 2030
//      Top 10 Declined (Trend) : 2047
//      Top 10 Above Total Company : 2064
//      Top 10 Below Total Company : 2083
//      Top 10 Above Level Up : 2102
//      Top 10 Below Level Up : 2121
//      Top 10 Above Level 2 : 2140
//      Top 10 Below Level 2 : 2159
//      Top 10 Above Custom 1 : 2178
//      Top 10 Below Custom 1 : 2197
//      Top 10 Above Custom 2 : 2216
//      Top 10 Below Custom 2 : 2235
// case RST_PAGED : 2260
// case SORTBY : 2352
// case SURVEY_DIMENSIONS_PAGED : 2415
// case THEME : 2455
// case VERBATIM : 2484
// case VERBATIM_ITEM_FILTER : 2500
// case VERBATIM_ITEM_SCALE_FILTER : 2511
// case VU_ACTIVE : 2553
// case VU_EDITOR_ITEM : 2554
// case VU_EDITOR_SELECTION : 2565
// case WIDGET : 2587
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FUNCTION AnswerList : 2622
// FUNCTION AnswersToParamValues : 2647
// FUNCTION FilterHeading : 2680
// FUNCTION GetPagedParamListByNodeId : 2693
// FUNCTION GetPagedParamListByQuestionId : 2741
// FUNCTION GetPagedParamListByQuestionIds : 2809
// FUNCTION GetParamListByQuestionIds : 2883
// FUNCTION LoadDefaultValues : 2913
class ParamLists {

	static var CachedAnswerList = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////FUNCTION SEPARATOR/////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	static function Get (param_name, state, report, optional, optional2, confirmitFacade) {
		try {
			var rtLabels = ResourceText.List (report, 'drop_downs');

			switch (param_name.toUpperCase()) {

            // Start of the switch inside of the Get function
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'ACTIONPLAN_BREAKBY':
                    var project : Project = report.DataSource.GetProject ('ds0');
                    var question : Question = project.GetQuestion ( Config.Hierarchy.VariableId );

                    var param_values = [
                        {Code: "0", Label: ResourceText.Text(report,'labels','ShowAll')},
                        //{Code: "1", Label: ResourceText.Text(report,'labels','ByStatus')},
                        {Code: "2", Label: question.Title}
                    ];

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'ACTIONPLAN_CODEDFIELD':
                    var param_values = [];

                    var fields = ['topic_improvement', 'item', 'is_new', 'cost', 'objectives_met', 'flag'];
                    var project = report.DataSource.GetProject('ds_ap');

                    for (var i = 0; i < fields.length; ++i)
                        param_values.push ( {Code: fields[i], Label: project.GetQuestion(fields[i]).Title} );

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'ACTIONPLAN_CUSTOMFIELD':
                    var param_values = [];

                    var fields = ['is_new', 'cost', 'objectives_met', 'flag'];
                    var project = report.DataSource.GetProject('ds_ap');

                    for (var i = 0; i < fields.length; ++i)
                        param_values.push ( {Code: fields[i], Label: project.GetQuestion(fields[i]).Title} );

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'ACTIONPLAN_CUSTOMVALUE':
                    var param_values = [];

                    var custom_field = ParamUtil.GetParamCode (state, 'ACTIONPLAN_CUSTOMFIELD');

                    if (custom_field != null) {
                        var question = report.DataSource.GetProject('ds_ap').GetQuestion( custom_field );
                        var answers = question.GetAnswers();

                        for (var i = 0; i < answers.length; ++i)
                            param_values.push ( {Code: question.QuestionId + '.' + answers[i].Precode, Label: answers[i].Text, Question: question} );
                    }

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'COMPARATOR_VALUETYPE':
                    var param_values = [
                        {Code:'abs', Label: rtLabels['AbsoluteValue'], IsDiff: false},
                        {Code:'diff', Label: rtLabels['DifferencetoTotal'], IsDiff: true}
                    ];

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'COMPARATORS_EXTERNAL':
                    var param_values = [];

                    var question = report.DataSource.GetProject(HelperUtil.GetBenchmarkListLocation (report)).GetQuestion('benchmarkset');

                    for (var i = 0; i < Config.Norms.Codes.length; ++i) {
                        var norm_id = NormUtil.GetNormId (optional, i);

                        param_values.push (
                            {
                                Code: 'norm' + (i+1),
                                Label: question.GetAnswer( norm_id ).Text
                            }
                        );
                    }

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'COMPARATORS_INTERNAL':
                case 'COMPARATORS_INTERNAL_ALL':
                    var param_values = [];

                    var showall = (param_name.toUpperCase() == 'COMPARATORS_INTERNAL_ALL');

                    // RP-24 Three years of Trends
                    if ( Config.Wave.PreviousWaveCount>0 || showall )
                        param_values.push ( {Code: Comparators.Prev, Label:rtLabels['PriorResults'], IsHistorical: true, ColIndexId: 'previous'} );

                    if ( Config.Wave.PreviousWaveCount>1 || showall )
                        param_values.push ( {Code: Comparators.Prev2, Label:rtLabels['PriorResults2'], IsHistorical: true, ColIndexId: 'previous2'} );

                    if ( Config.Wave.PreviousWaveCount>2 || showall )
                        param_values.push ( {Code: Comparators.Prev3, Label:rtLabels['PriorResults3'], IsHistorical: true, ColIndexId: 'previous3'} );

                    var user = optional;

                    // INTERNAL: TOP LEVEL COMPARATOR
                    param_values.push (
                        {
                            Code: Comparators.TotalCompany,
                            Label: ResourceText.Text(report, 'labels', 'InternalComp1'),
                            OverrideField: 'internal1',
                            Type: ComparatorType.Absolute,
                            Level: 0,
                            IsHistorical: false,
                            ColIndexId: 'internal'
                        }
                    );

                    // INTERNAL: PARENT COMPARATOR
                    param_values.push (
                        {
                            Code: Comparators.LevelUp,
                            Label: ResourceText.Text(report, 'labels', 'InternalComp2'),
                            OverrideField: 'internal2',
                            Type: ComparatorType.Relative,
                            Level: 1,
                            IsHistorical: false,
                            ColIndexId: 'levelup'
                        }
                    );

                    // INTERNAL: 2ND LEVEL COMPARATOR
                    param_values.push (
                        {
                            Code: Comparators.Level2,
                            Label: ResourceText.Text(report, 'labels', 'InternalComp3'),
                            OverrideField: 'internal3',
                            Type: ComparatorType.Absolute,
                            Level: 1,
                            IsHistorical: false,
                            ColIndexId: 'level2'
                        }
                    );

                    // INTERNAL: CUSTOM #1
                    param_values.push (
                        {
                            Code: Comparators.Custom1,
                            Label: ResourceText.Text(report, 'labels', 'InternalComp4'),
                            OverrideField: 'internal4',
                            Type: ComparatorType.Absolute,
                            Level: 0,
                            IsHistorical: false,
                            ColIndexId: 'custom1'
                        }
                    );

                    // INTERNAL: CUSTOM #2
                    param_values.push (
                        {
                            Code: Comparators.Custom2,
                            Label: ResourceText.Text(report, 'labels', 'InternalComp5'),
                            OverrideField: 'internal5',
                            Type: ComparatorType.Absolute,
                            Level: 0,
                            IsHistorical: false,
                            ColIndexId: 'custom2'
                        }
                    );

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

              	case 'DASHBOARD_PAGED':
                	var param_values = [];

                	var i;
                	var page_count = 0;
                	var widgetsLength = (UserType.GetDashboard(state, optional)).length;
                	var pages = HelperUtil.GetPagedRowSettings(widgetsLength, Config.Export.PDF.Dashboard.MaxWidgetsPerPage);

                	for (i = 0; i < pages.length; ++i) {
                    	param_values.push (
                            {
                                Code: page_count++,
                                StartIndex: pages[i].StartIndex,
                                EndIndex: pages[i].EndIndex
                            }
                        );
                    }

                	return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

              	case 'DATA':
                    var param_values = [
                        {Code:'fav', Label:rtLabels['PercentFavorable'], HighIsFavorable: true},
                        {Code:'unfav', Label:rtLabels['PercentUnfavorable'], HighIsFavorable: false}
                    ];

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'DEMOGR':
                case 'DEMOGR2':
                case 'PSS_DEMO':
                case 'PSS_DEMO2':
                    var user = optional;
                    var qids = UserType.GetDemographics (state, user);
                    var param_list = GetParamListByQuestionIds ( report, qids, true, false );

                    // Sort List
                    var list1 = [], list2 = [];

                    // Always have OrgCode at top of list
                    for (var i = 0; i < param_list.length; ++i)
                        if (param_list[i].Code == Config.Hierarchy.VariableId) {
                            if (!Config.Hierarchy.Direct)
                                list1.push(param_list[i]);
                        }
                        else
                            list2.push ( param_list[i] );

                    return list1.concat(list2);
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'DEMOGR_PAGED':
                    var user = optional;
                    var qids = UserType.GetDemographics (state, user);
                	var max_column_count;

                	switch (state.ReportExecutionMode) {
                        // Excel
                        case ReportExecutionMode.ExcelExport:
                        	max_column_count = Config.InternalBenchmarkTool.ExcelMaxColumnCount;

                            break;

                        default:
                        	max_column_count = Config.InternalBenchmarkTool.MaxColumnCount;
                    }

                    var param_list = GetPagedParamListByQuestionIds ( user, report, qids, max_column_count, true, false );

                    // Sort List
                    var list1 = [], list2 = [];

                    // Always have OrgCode at top of list
                    for (var i = 0; i < param_list.length; ++i)
                        if (param_list[i].QuestionId == Config.Hierarchy.VariableId) {
                            if (!Config.Hierarchy.Direct)
                                list1.push(param_list[i])
                        }
                        else
                            list2.push ( param_list[i] );

                    return list1.concat(list2);
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'DIMENSION':
                    var param_values = [];

                    var dimensions = Config.Dimensions;
                    var rtDimensions = ResourceText.List(report, 'dimensions');

                    for (var i = 0; i < dimensions.length; ++i)
                        param_values.push (
                            {
                              Code: dimensions[i].Id,
                              Label: rtDimensions [ dimensions[i].Id ],
                              Questions: dimensions[i].Questions,
                              ReportItemType: ReportItemType.Dimension
                            }
                        );

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'DIMENSION_TIER1':
                    var param_values = [];

                    var user = optional;
                    var dimensions = HelperUtil.GetAllDimensionsByNodeId( user.PersonalizedReportBase );
                    var rtDimensions = ResourceText.List(report, 'dimensions');

                    for (var i = 0; i < dimensions.length; ++i) {
                        if ( dimensions[i].Tier == 1 )
                            param_values.push (
                                {
                                  Code: dimensions[i].Id,
                                  Label: rtDimensions [ dimensions[i].Id ],
                                  Questions: dimensions[i].Questions,
                                  ReportItemType: ReportItemType.Dimension
                                }
                            );
                    }

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'DIMENSION_TIER2':
                    var param_values = [];

                    var dimensions = Config.Dimensions;
                    var rtDimensions = ResourceText.List(report, 'dimensions');

                    for (var i = 0; i < dimensions.length; ++i) {
                        if ( dimensions[i].Tier == 2 || dimensions[i].Tier == null ) // THIS IS THE DEFAULT TIER
                            param_values.push (
                                {
                                  Code: dimensions[i].Id,
                                  Label: rtDimensions [ dimensions[i].Id ],
                                  Questions: dimensions[i].Questions,
                                  ReportItemType: ReportItemType.Dimension
                                }
                            );
                    }

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'DISTRIBUTION':
                    var param_values = [
                        {Code: '1', Label: rtLabels['Exclude'], ShowDistribution: false},
                        {Code: '2', Label: rtLabels['Include'], ShowDistribution: true}
                    ];

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'EEF_GAP':
                    var rtEffPro = ResourceText.List (report, Config.EffectivenessProfile.VariableId, 'ds0');

                    var param_values = [
                        {Label: rtEffPro['902'].toUpperCase(), Code:'902', Color: Config.Colors.Orange3},
                        {Label: rtEffPro['903'].toUpperCase(), Code:'903',  Color: Config.Colors.Blue3},
                        {Label: rtEffPro['904'].toUpperCase(), Code:'904', Color: Config.Colors.Red3}
                    ];

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'EEF_GAP_PLOT':
                    var param_values = [
                        {Code: '1', Label: rtLabels['AllDimensions'], TopN: false, ShowQuestions: false, ShowDimensions: true},
                        {Code: '2', Label: rtLabels['Top10Questions'], TopN: 10, ShowQuestions: true, ShowDimensions: false},
                        {Code: '3', Label: rtLabels['AllQuestions'], TopN: false, ShowQuestions: true, ShowDimensions: false}
                    ];

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'FILTER':
                    var index = optional.Index;

                    try {
                        var tmp = FilterUtil.GetFilters(state, optional.User)[index-1];
                        var qid = (tmp.Id == null) ? tmp : tmp.Id;
                        var label = (tmp.Id == null) ? null : tmp.Label;

                        return AnswersToParamValues(report, qid, label);
                    }
                    catch (e) {
                        return {
                            Code: -1,
                            Label: e
                        }
                        return []; // Invalid filter index (if less than max # of filters is being used)
                    }

                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'HIGHLIGHTER_BASIS':
                    var param_values = [
                        {Code: '1', Label: rtLabels['ReportTotal']} //,
                        //{Code: '2', Label: rtLabels['Demographic Total']}
                    ];

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
	case 'RSS_PAGED':
          var user = optional;
          var qids = UserType.GetDemographics (state, user);
              var max_rows_per_page;

              switch (state.ReportExecutionMode) {
                  // PowerPoint
                  case ReportExecutionMode.PowerPointExport:
                      max_rows_per_page = Config.Export.PowerPoint.ResultsSortingTool.MaxRowsPerPage;

                      break;

                  // Excel
                  case ReportExecutionMode.ExcelExport:
                      max_rows_per_page = Config.Export.Excel.ResultsSortingTool.MaxRowsPerPage;

                      break;

                  // The default is PDF
                  default:
                      max_rows_per_page = Config.Export.PDF.ResultsSortingTool.MaxRowsPerPage;
              }

              var param_list = GetPagedParamListByQuestionIds(  user, report, qids, max_rows_per_page, true, false  );
                   // Sort List
                   var list1 = [], list2 = [];

                   // Always have OrgCode at top of list
                   for (var i = 0; i < param_list.length; ++i)
                       if (param_list[i].Code == Config.Hierarchy.VariableId) {
                           if (!Config.Hierarchy.Direct)
                               list1.push(param_list[i]);
                       }
                       else
                           list2.push ( param_list[i] );

                   return list1.concat(list2);
                   break;
             //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
             
                case 'IBT_PAGED':
                    var param_values = [];

                    var continued_label = '(' + ResourceText.Text(report, 'exports', 'Continued') + ')';

                    // STEP 1: Expand BreakBy array into individual itermations.
                    var iterations_collapsed = [];

                    if(ExecutionMode.isPowerPoint(state)){
                        iterations_collapsed = Config.Export.PowerPoint.InternalBenchmarkTool.Iterations;
                    }
                    else if(ExecutionMode.isExcel(state)){
                        iterations_collapsed = Config.Export.Excel.InternalBenchmarkTool.Iterations;
                    }
                    else{
                        iterations_collapsed = Config.Export.PDF.InternalBenchmarkTool.Iterations;
                    }

                    var iterations = [];

                    // Expanded for each BreakBy
                    for (var i = 0; i < iterations_collapsed.length; ++i) {
                        var breaks =  iterations_collapsed[i].BreakBy;
                        for (var j = 0; j < breaks.length; ++j) {
                            iterations.push (
                                {
                                    Rows: iterations_collapsed[i].Rows,
                                    BreakBy: breaks[j],
                                    Metric: iterations_collapsed[i].Metric,
                                    DisplayCompsAs: iterations_collapsed[i].DisplayCompsAs
                                }
                            );
                        }
                    }

                    // At this point the demographic BreakBy array has been expanded into separate iterations.

                    // STEP 2: Remove iterations refering to BreakBy QIDs that are not accessible to the user.
                    var demogr_paged = Get('DEMOGR_PAGED', state, report, optional, optional2);
                    var page_count = 0;

                    for (var i = 0; i < iterations.length; ++i) {
                        // Bring in the Horizontal Values
                        // This will also automatically EXCLUDE demographic question IDs
                        // that the current user does not have access to
                        var demographic_qid = iterations[i].BreakBy;

                        // Find matching qids in the paged demographic list
                        for (var j = 0; j < demogr_paged.length; ++j) {
                            var prefix = demogr_paged[j].Code.split('.')[0];

                            // Look for match between BreakBy QID and available QID
                            if (prefix == demographic_qid) {
                                // Found match
                                var label = [
                                    iterations[i].Rows,
                                    demogr_paged[j].Code,
                                    iterations[i].Metric,
                                    iterations[i].DisplayCompsAs
                                ].join('; ');

                                var row_count;
                                var max_rows_per_page;

                                switch ( iterations[i].Rows ) {

                                    // All Dimensions
                                    case '1':
                                        row_count = Config.Dimensions.length;
                                        max_rows_per_page = 1;

                                        if(ExecutionMode.isPowerPoint(state))
                                            max_rows_per_page = Config.Export.PowerPoint.InternalBenchmarkTool.MaxRowsPerPage.Dimensions;
                                        else if(ExecutionMode.isExcel(state))
                                            max_rows_per_page = Config.Export.Excel.InternalBenchmarkTool.MaxRowsPerPage.Dimensions;
                                        else
                                            max_rows_per_page = Config.Export.PDF.InternalBenchmarkTool.MaxRowsPerPage.Dimensions;

                                        break;

                                    // All Questions
                                    case '2':
                                        row_count = ParamLists.Get('ITEM', state, report).length;
                                        max_rows_per_page = 1;

                                        if(ExecutionMode.isPowerPoint(state))
                                            max_rows_per_page = Config.Export.PowerPoint.InternalBenchmarkTool.MaxRowsPerPage.Questions;
                                        else if(ExecutionMode.isExcel(state))
                                            max_rows_per_page = Config.Export.Excel.InternalBenchmarkTool.MaxRowsPerPage.Questions;
                                        else
                                            max_rows_per_page = Config.Export.PDF.InternalBenchmarkTool.MaxRowsPerPage.Questions;

                                        break;

                                    // All Questions ordered by dimension
                                    case '3':
                                        row_count = 0;
                                        var dimsConf = Config.Dimensions;

                                        //Go through all dimensions and count how many questions is there
                                        for (var k = 0; k<dimsConf.length;k++) {
                                            // + 1 due to the dimension summmary on the first row
                                            row_count = row_count + dimsConf[k].Questions.length+1;
                                        }

                                        if(ExecutionMode.isPowerPoint(state))
                                            max_rows_per_page = Config.Export.PowerPoint.InternalBenchmarkTool.MaxRowsPerPage.Questions;
                                        else if(ExecutionMode.isExcel(state))
                                            max_rows_per_page = Config.Export.Excel.InternalBenchmarkTool.MaxRowsPerPage.Questions;
                                        else
                                            max_rows_per_page = Config.Export.PDF.InternalBenchmarkTool.MaxRowsPerPage.Questions;

                                        break;

                                    //case ReportItemType.Dimension:
                                    default:
                                        // One dimension, count the questions
                                        var dimension_id = iterations[i].Rows;

                                        // + 1 due to the dimension summmary on the first row
                                        row_count = HelperUtil.GetDimensionById ( dimension_id ).Questions.length + 1;
                                        max_rows_per_page = 1;

                                        if(ExecutionMode.isPowerPoint(state))
                                            max_rows_per_page = Config.Export.PowerPoint.InternalBenchmarkTool.MaxRowsPerPage.Questions;
                                        else if(ExecutionMode.isExcel(state))
                                            max_rows_per_page = Config.Export.Excel.InternalBenchmarkTool.MaxRowsPerPage.Questions;
                                        else
                                            max_rows_per_page = Config.Export.PDF.InternalBenchmarkTool.MaxRowsPerPage.Questions;
                                }

                                var pages = HelperUtil.GetPagedRowSettings( row_count, max_rows_per_page );

                                for (var z = 0; z < pages.length; ++z) {
                                    param_values.push (
                                        {
                                            Code: page_count++,
                                            StartIndex: pages[z].StartIndex,
                                            EndIndex: pages[z].EndIndex,
                                            Label: ('Page ' + page_count + ': ' + label),
                                            Rows: iterations[i].Rows,
                                            BreakBy: demogr_paged[j].Code,
                                            Metric: iterations[i].Metric,
                                            DisplayCompsAs: iterations[i].DisplayCompsAs,
                                            RowCount: row_count,
                                            Suffix: (z==0) ? '' : (' ' + continued_label )
                                        }
                                    );
                                }
                            }
                        }
                    }

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'INTERNAL_BENCHMARK_DATA':
                    var dimension_values = Get('DIMENSION', state, report);

                    // Prefix them
                    for (var i = 0; i < dimension_values.length; ++i)
                        dimension_values[i].Label = rtLabels['DIMENSION'] + ' ' + dimension_values[i].Label;

                    var param_values = [
                        { Label: rtLabels['AllDimensions'], Code: "1", ReportItemType: ReportItemType.AllDimensions },
                        { Label: rtLabels['AllQuestions'], Code: "2", ReportItemType: ReportItemType.AllQuestions },
                        { Label: rtLabels['AllQuestionsOrdByDimension'], Code: "3", ReportItemType: ReportItemType.AllQuestions }
                    ].concat ( dimension_values );

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'ITEM':
                case 'ITEM_ACTIONPLANNING':
                case 'ITEM_WITH_ENPS':
                case 'ITEM2':
                    var param_values = [];

                    var added = {};
                    var project = report.DataSource.GetProject ('ds0');
                    var action_planning = (param_name.toUpperCase() == 'ITEM_ACTIONPLANNING');
                    var dimensions = Config.Dimensions;

                    // Add applicable Local Dimensions
                    if ( action_planning && Config.ActionPlanning.LocalDimensions.Enabled ) {
                        var local_dimensions = [];
                        var top_node_access_id = state.Parameters.GetString('REPORT_BASE_TOP');
                        for (var i = 0; i < Config.LocalDimensions.length; ++i) {
                            var show_local_dimension = false;

                            // If a Local Dimension without access control exists,
                            // then the Local Dimension should be included
                            if (Config.LocalDimensions[i].NodeIds == null)
                                show_local_dimension = true;
                            else {
                                // If the Local Dimension is active in a subset of the user's top level access,
                                // then that Local Dimension should be included
                                var node_ids = Config.LocalDimensions[i].NodeIds;

                                for (var j = 0; j < node_ids.length; ++j) {
                                    if (HelperUtil.IsChildOf( node_ids[j], top_node_access_id, confirmit) || HelperUtil.IsChildOf( top_node_access_id, node_ids[j], confirmit) )
                                        show_local_dimension = true;
                                }
                            }

                            if (show_local_dimension)
                                local_dimensions.push ( Config.LocalDimensions[i] );
                        }

                        dimensions = dimensions.concat ( local_dimensions );
                    }

                    // Handler for ITEM_WITH_ENPS
                    if ( Config.ENPS.Enabled && (param_name.toUpperCase() == 'ITEM_WITH_ENPS' || action_planning) )
                        dimensions = dimensions.concat ( {Id:'ENPS', Questions:[Config.ENPS.VariableId]} );

                    //In order to have all translations in one, clear place (GRID questions) - let's take out the labels and we'll always first go through
                    //our labels array before we take out text from the survey itself
                    var textArray = [];
                    var qMap = Config.QuestionsGridStructure;

                    for(var i = 0; i < qMap.length; i++){
                        var list = {};

                        if(qMap[i].Qs != null){
                            //Get all answers for the GRID question
                            list = ResourceText.List(report, qMap[i].Id, 'ds0');
                        }

                        //Put all of the texts into text array in a format of {Id: qid, Text: text}
                        for(var k in list){
                            textArray.push({Id: k, Text: HelperUtil.ReplaceWildCards(report, list[k])});
                        }
                    }

                    for (var i = 0; i < dimensions.length; ++i) {
                        for (var j = 0; j < dimensions[i].Questions.length; ++j) {
                            var qid = dimensions[i].Questions[j];

                            if ( added [qid] != '1' ) {
                                var question = project.GetQuestion(qid);

                                if (question == null) {
                                    param_values.push (
                                        {
                                            QuestionNumber: qid,
                                            Code: qid,
                                            Label: qid + ': NOT FOUND',
                                            ReportItemType: ReportItemType.Question
                                        }
                                    );
                                }
                                else {
                                    //Let's try finding the text for this question first
                                    var finalText = null;

                                    for(var o = 0; o < textArray.length; o++){
                                        if(qid == textArray[o].Id){
                                            finalText = textArray[o].Text;

                                            break;
                                        }
                                    }

                                    finalText = finalText == null ? HelperUtil.ReplaceWildCards(report, question.Text) : finalText;
                                    var qno = LookupTable.GetQuestionNumberByQuestionId(qid);
                                    ConfirmitClass.Log5 ( qid + ' => ' + qno );

                                    param_values.push (
                                        {
                                            QuestionNumber: qno,
                                            Code: qid,
                                            Label: qno + '. ' + HelperUtil.RemoveHtml(finalText),
                                            ReportItemType: ReportItemType.Question
                                        }
                                    );
                                }

                                added [ qid ] = '1';
                            }
                        }
                    }

                    return param_values.sort ( SortUtil.SortByQuestionNumber );
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'LOCAL_DIMENSION':
                    var param_values = [];

                    var user = optional;
                    var dimensions = Config.GetLocalDimensionsByNodeId( user.PersonalizedReportBase );
                    var rtDimensions = ResourceText.List(report, 'dimensions');

                    for (var i = 0; i < dimensions.length; ++i)
                        param_values.push (
                            {
                                Code: dimensions[i].Id,
                                Label: rtDimensions [ dimensions[i].Id ],
                                Questions: dimensions[i].Questions,
                                ReportItemType: ReportItemType.Dimension
                            }
                        );

                    // Workaround (REP-1608) -> REMOVED FOR TEMPLATE 20.0
                    /*if (param_values.length == 0 && !ExecutionMode.isWeb (state))
                        param_values.push (
                            {
                                Code:'-1',
                                Label:'Dummy iteration for REP-1608'
                            }
                        );*/

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'MATRIX_DIMENSIONS_PAGED':
                    var param_values = [];

                    var user = optional;
                    //var dimensions = Config.Dimensions.concat ( Config.LocalDimensions );
                    var dimensions = HelperUtil.GetAllDimensionsByNodeId( user.PersonalizedReportBase );
                    var page_count = Math.ceil (dimensions.length / Config.MatrixReport.MaxDimensionsPerPage);

                    for (var i = 0; i < page_count; ++i) {
                        var start_index = i*Config.MatrixReport.MaxDimensionsPerPage;
                        var end_index = Math.min ( (i+1)*Config.MatrixReport.MaxDimensionsPerPage, dimensions.length);
                        var paged_dimensions = dimensions.slice ( start_index, end_index );

                        param_values.push (
                            {
                                Code: (i+''),
                                Label: 'Page ' + (i+1) + ' of ' + page_count + ': ' + paged_dimensions.join('; '),
                                Dimensions: paged_dimensions,
                                DimensionStartIndex: start_index
                            }
                        );
                    }

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'NODE_ID':
                    var param_values = [];

                	var user = optional;
                	var confirmit = optional2;

                    // Only Hay Group users should be able to load values for this parameter
                    if ( UserType.IsHayGroupUser (state, user)  ) {
                        // Always execute from top level
                        param_values = MatrixReportUtil.GetParamValuesByTopNodeId ( report, confirmit, Config.Hierarchy.TopNodeId );
                    }

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'NPS_GAP':
                    var codes = Page_NetPromoterDetails.GetCodes( report );

                    var param_values = [
                        {Label:rtLabels['Detractors'], Code:'1', FilterCodes: codes.Detractors, Color: Config.Colors.OrangeAlternative},
                        {Label:rtLabels['Passives'], Code:'2', FilterCodes: codes.Passives, Color: Config.Colors.LightGreyAlternative}
                    ];

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'NSQ':
                    return GetParamListByQuestionIds ( report, Config.NSQ );
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'NSQ_PAGED':
                    var param_values = [];

                    var returnValues = GetParamListByQuestionIds(report, Config.ExportNSQComparator.Questions);

                    for(var i = 0; i < returnValues.length; i++){
                        var rowCount = report.DataSource.GetProject('ds0').GetQuestion(returnValues[i].Code).GetAnswers().length;
                        var pages = HelperUtil.GetPagedRowSettings(rowCount, Config.ExportNSQComparator.RowsPerPage);

                        for(var j = 0; j < pages.length; j++){
                            param_values.push(
                                {
                                    Code: returnValues[i].Code + "." + j,
                                    Label: returnValues[i].Label + " [" + (pages[j].StartIndex + 1) + " - " + (pages[j].EndIndex + 1) + "]",
                                    StartIndex: pages[j].StartIndex,
                                    EndIndex: pages[j].EndIndex
                                }
                            );
                        }
                    }

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'NSQIBT_PAGED':
                    var param_values = [];

                    var continued_label = '(' + ResourceText.Text(report, 'exports', 'Continued') + ')';

                    // STEP 1: Expand BreakBy array into individual itermations.
                    var iterations_collapsed = [];

                    if(ExecutionMode.isPowerPoint(state)){
                        iterations_collapsed = Config.Export.PowerPoint.NSQIBT.Iterations;
                    }
                    else if(ExecutionMode.isExcel(state)){
                        iterations_collapsed = Config.Export.Excel.NSQIBT.Iterations;
                    }
                    else{
                        iterations_collapsed = Config.Export.PDF.NSQIBT.Iterations;
                    }

                    // Expanded for each BreakBy
                    var iterations = [];

                    for (var i = 0; i < iterations_collapsed.length; ++i) {
                        var breaks = iterations_collapsed[i].BreakBy;
                        for (var j = 0; j < breaks.length; ++j) {
                            iterations.push (
                                {
                                    Question: iterations_collapsed[i].Question,
                                    BreakBy: breaks[j],
                                    DisplayCompsAs: iterations_collapsed[i].DisplayCompsAs
                                }
                            );
                        }
                    }

                    // At this point the demographic BreakBy array has been expanded into separate iterations.
                    // STEP 2: Remove iterations refering to BreakBy QIDs that are not accessible to the user.
                    var demogr_paged = Get('DEMOGR_PAGED', state, report, optional, optional2);
                    var page_count = 0;

                    for (var i = 0; i < iterations.length; ++i) {
                        // Bring in the Horizontal Values
                        // This will also automatically EXCLUDE demographic question IDs
                        // that the current user does not have access to
                        var demographic_qid = iterations[i].BreakBy;

                        // Find matching qids in the paged demographic list
                        for (var j = 0; j < demogr_paged.length; ++j) {
                            var prefix = demogr_paged[j].Code.split('.')[0];

                            // Look for match between BreakBy QID and available QID
                            if (prefix == demographic_qid) {
                                // Found match
                                var label = [
                                    iterations[i].Question,
                                    demogr_paged[j].Code,
                                    iterations[i].DisplayCompsAs
                                ].join('; ');

                                var row_count;
                                var max_rows_per_page;

                                // Figure out max rows per page
                                var nsqId = iterations[i].Question;
                                row_count = report.DataSource.GetProject('ds0').GetQuestion(nsqId).GetAnswers().length;
                                max_rows_per_page = 1;

                                if(ExecutionMode.isPowerPoint(state))
                                    max_rows_per_page = Config.Export.PowerPoint.NSQIBT.MaxRowsPerPage;
                                else if(ExecutionMode.isExcel(state))
                                    max_rows_per_page = Config.Export.Excel.NSQIBT.MaxRowsPerPage;
                                else
                                    max_rows_per_page = Config.Export.PDF.NSQIBT.MaxRowsPerPage;

                                // Create pages based on rows per page setting
                                var pages = HelperUtil.GetPagedRowSettings( row_count, max_rows_per_page );

                                for (var z = 0; z < pages.length; ++z) {
                                    param_values.push (
                                        {
                                            Code: page_count++,
                                            StartIndex: pages[z].StartIndex,
                                            EndIndex: pages[z].EndIndex,
                                            Label: ('Page ' + page_count + ': ' + label),
                                            Question: iterations[i].Question,
                                            BreakBy: demogr_paged[j].Code,
                                            DisplayCompsAs: iterations[i].DisplayCompsAs,
                                            RowCount: row_count,
                                            Suffix: (z==0) ? '' : (' ' + continued_label )
                                        }
                                    );
                                }
                            }
                        }
                    }

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'RANKING_QUESTIONS':
                    return GetParamListByQuestionIds ( report, Config.RankingQuestions );
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

              	case 'PID':
                    var param_values = [];

                	// Dummy iteration which will switch the filter to display all the data
                	param_values.push (
                    	{
                   			Code: '',
                      		Label: ''
                    	}
                   	);

                	if (Config.PID.Enabled) {
                        // We will load all the used PIDs and PNAMEs based on our helper table
                        var rh = report.TableUtils.GetRowHeaderCategoryTitles(Config.PID.PidListSourceTableLocation);
                        var ch = report.TableUtils.GetColumnHeaderCategoryTitles(Config.PID.PidListSourceTableLocation);
                        var i, j, currPid, currPname, cellVal;

                        // Now we want to map the appropriate PNAMEs to the appropriate PIDs
                        for (i = 0; i < rh.length; i++) {
                            currPid = rh[i];
                            currPname = '';

                            for (j = 0; j < ch.length; j++) {
                                cellVal = Int32.Parse(report.TableUtils.GetCellValue(Config.PID.PidListSourceTableLocation,(i+1),(j+1)).AsString);

                                if (cellVal > 0) {
                                    currPname = ch[j];

                                    break;
                                }
                            }

                            // And always push one iteration where
                            //   Code == PID
                            //   Label == PNAME
                            param_values.push (
                                {
                                    Code: currPid,
                                    Label: currPname
                                }
                            );
                        }
                    }

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'PSS':
                    var param_values = [];

                	var user = optional;
                	var confirmit = optional2;
                    var project = report.DataSource.GetProject('ds0');

                    // PSS - Overall
                    param_values.push (
                        {
                            Code: '0',
                            Label: rtLabels['Overall'],
                            Config:
                                {
                                    HideChart:true,
                                    ShowDistribution:true
                                },
                            BreakByVariableId: null
                        }
                    );

                    // PSS - Extentded Analysis
                    var codes = ParamUtil.GetParamCodes(state, 'PSS_DEMO', user, confirmit);
                    var codeLabels = GetParamListByQuestionIds ( report, codes, true, false )

                    var config = {
                        HideChart: true,
                        HideValidN: false,
                        ShowDistribution:false,
                        HeaderNestLevels: 2,
                        ExtendedPSSAnalysis: true
                    };

                    var page_size = Config.InternalBenchmarkTool.MaxColumnCount;

                    for (var i = 0; i < codes.length; ++i) {
                        var qid = codes[i];

                        switch (qid) {

                            case Config.Hierarchy.VariableId:
                                var node_id = optional.PersonalizedReportBase;
                                confirmit = optional2;
                                param_values = param_values.concat ( GetPagedParamListByNodeId( report, confirmit, node_id, page_size, config, '|full', (' ' + rtLabels['fulldetails']) ) );

                                break;

                            default:
                                param_values = param_values.concat (
                                    GetPagedParamListByQuestionId (
                                        report,
                                        qid,
                                        page_size,
                                        true,
                                        false,
                                        config,
                                        '|full',
                                        (' ' + rtLabels['fulldetails'])
                                    )
                                );
                        }
                    }

                    // PSS - Compact
                    var codes = ParamUtil.GetParamCodes(state, 'PSS_DEMO2');
                    var codeLabels = GetParamListByQuestionIds ( report, codes, true, false )
                    var config = {
                        OverrideInternal: false,
                        OverridePrevious: false,
                        OverrideNorm1: false,
                        OverrideNorm2: false,
                        OverrideNorm3: false,
                        OverrideNorm4: false,
                        OverrideNorm5: false,
                        HideNeutral: true,
                        HideUnfavorable: true,
                        HideChart: true,
                        HideValidN: false,
                        HeaderNestLevels: 2,
                        ExtendedPSSAnalysis: false
                    };

                    for (var i = 0; i < codes.length; ++i) {
                        var qid = codes[i];

                        switch (qid) {

                            case Config.Hierarchy.VariableId:
                                var page_size = Config.InternalBenchmarkTool.MaxColumnCount;
                                var node_id = optional.PersonalizedReportBase;
                                var confirmit = optional2;
                                param_values = param_values.concat ( GetPagedParamListByNodeId( report, confirmit, node_id, page_size, config, '|compact', (' ' + rtLabels['compact']) ) );

                                break;

                            default:
                                param_values = param_values.concat (
                                    GetPagedParamListByQuestionId (
                                        report,
                                        qid,
                                        page_size,
                                        true,
                                        false,
                                        config,
                                        '|compact',
                                        (' ' + rtLabels['compact'])
                                    )
                                );
                        }
                    }

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'QUESTIONS_SUMMARY_PAGED':
					var param_values = [];

					var max_items_per_page, paging_type, i, j, key, num_of_pages;
                	var start_index, end_index, limit_counter, remaining_space, num_of_dims;
                	var rowsCount = 0;
                	var currentIndex = 0;
                	var page_count = 0;
                	var dimensions = [];
					var rows = [];
                	var contained_dimensions = [];
                	var contained_dim_ids = [];
            		var dimension_labels = ResourceText.List(report, 'dimensions');
                    var continued_label = '(' + ResourceText.Text(report, 'exports', 'Continued') + ')';

                	// First we wan't to find out what are the basic settings
            		switch (state.ReportExecutionMode) {
                        // PowerPoint
                        case ReportExecutionMode.PowerPointExport:
                            max_items_per_page = Config.Export.PowerPoint.Summary.MaxRowsPerPage;
                        	paging_type = Config.Export.PowerPoint.Summary.PagingType;

                            break;

                        // Should be used by the PDF only
                        default:
                            max_items_per_page = Config.Export.PDF.Summary.MaxRowsPerPage;
                        	paging_type = Config.Export.PDF.Summary.PagingType;
                    }

                	// Having less than 2 lines per page doesn't make sense so if the limit is lower we just change
                	// the maximum to 2
                	if (max_items_per_page < 2) {
                    	max_items_per_page = 2;
                    }

                	// Now we want to prepare all information we need for the page splitting
					for (i = 0; i < Config.Dimensions.length; ++i) {
                      	// In case we found any empty dimension we will just end the function and return
                      	// a dummy iteration
                      	if (Config.Dimensions[i].Questions.length == 0) {
                          	return [
                            	{
                              		Code: -1,
                              		Label: 'Empty dimension in the mapping occured!',
                              		StartIndex: 0,
                                	EndIndex: 0
                            	}
                            ];
                        }

                      	// This hastable will contain all important information about the core dimensions
                      	// It will be used in both cases (dimensions_on_new_page = true/false)
                       	dimensions[Config.Dimensions[i].Id] = {
                        	Dimension: Config.Dimensions[i].Id,
               				StartIndex: currentIndex,
         					EndIndex: (currentIndex + Config.Dimensions[i].Questions.length),
                            DimensionLength: (Config.Dimensions[i].Questions.length + 1),
                            Questions: Config.Dimensions[i].Questions,
                          	IsLastDimension: (i == (Config.Dimensions.length - 1)) ? true : false,
                          	DimensionAdded: false,
                          	DimensionPrinted: false
                        };

                      	currentIndex += (Config.Dimensions[i].Questions.length + 1);

						// From this point, we will always fill in only the variables we need
                       	if ((paging_type == PrintQSummary.DimensionHeaderCantBeLastLine) || (paging_type == PrintQSummary.ForcingSwitchedOff)) {
                            rows.push (
                                {
                                    Type: 1,
                                    Dimension: Config.Dimensions[i].Id
                                }
                            );

                      		if (paging_type == PrintQSummary.ForcingSwitchedOff) rowsCount++;

                            for (j = 0; j < Config.Dimensions[i].Questions.length; ++j) {
                             	rows.push (
                                	{
                                 		Type: 0,
                             			Dimension: Config.Dimensions[i].Id
                          			}
                          		);

                              	if (paging_type == PrintQSummary.ForcingSwitchedOff) rowsCount++;
							}
						}
                    }

                	switch (paging_type) {
                        // In this case, we'll always force the dimension to start on a new page
                      	case PrintQSummary.DimensionOnNewPage:
                        	// Iterating over the hastable
                            for (key in dimensions) {
                                // In case the dimension's length isn't over the limit we can just add a iteration which will
                                // cover the whole dimension
                                if (dimensions[key].DimensionLength <= max_items_per_page) {
                                    param_values.push(
                                        {
                                            Code: page_count++,
                                            Label: dimension_labels[key],
                                            StartIndex: dimensions[key].StartIndex,
                                            EndIndex: dimensions[key].EndIndex
                                        }
                                    );
                                }
                                // In case the dimension's length is over the limit we need to split it into multiple pages
                                else {
                                    num_of_pages = Math.ceil (dimensions[key].DimensionLength / max_items_per_page);

                                    for (i = 0; i < num_of_pages; ++i) {
                                        start_index = (dimensions[key].StartIndex + (i * max_items_per_page));

                                        param_values.push(
                                            {
                                                Code: page_count++,
                                                Label: (i == 0) ? dimension_labels[key] : (dimension_labels[key] + ' ' + continued_label),
                                                StartIndex: start_index,
                                                EndIndex: ((start_index + max_items_per_page - 1) < dimensions[key].EndIndex) ? (start_index + max_items_per_page - 1) : dimensions[key].EndIndex
                                            }
                                        );
                                    }
                                }
                            }

                        	break;

                        // In this case, we will split based on the MaxRowsPerPage with a limitation that the
                        // dimension header can't be a last line on the page
                      	case PrintQSummary.DimensionHeaderCantBeLastLine:
                        	start_index = 0;
                            limit_counter = 0;

                            // Iterating over the array with all rows (dimensions + questions in the appropriate order)
                            for (i = 0; i < rows.length; ++i) {
                                limit_counter++;

                                // Adding the dimension label without (cont'd) in case we find it
                                if (rows[i].Type == 1) {
                                    contained_dimensions.push(dimension_labels[rows[i].Dimension]);
                                }
                                // Adding the dimension lable with (cont's) in case the first line on a new page is a question
                                else if ((rows[i].Type == 0) && (limit_counter == 1)) {
                                    contained_dimensions.push(dimension_labels[rows[i].Dimension] + ' ' + continued_label);
                                }

                                // In case the current line should be the last one on the page and it's not
                                // a dimension header we just push a new page
                                if ((limit_counter == max_items_per_page) && (rows[i].Type != 1)) {
                                    param_values.push(
                                        {
                                            Code: page_count++,
                                            Label: contained_dimensions.join('; '),
                                            StartIndex: start_index,
                                            EndIndex: i
                                        }
                                    );

                                    // And (re)set the important values
                                    start_index = (i + 1);
                                    limit_counter = 0;
                                    contained_dimensions = [];
                                }
                                // In case the current line should be the last one on the page and it is a dimension header
                                // we push a new page with a length (limit - 1) and set the dimension header as a start of the new page
                                else if ((limit_counter == max_items_per_page) && (rows[i].Type == 1)) {
                                    // We don't want to print a label of the dimension which won't be on the page
                                    contained_dimensions.pop();

                                    param_values.push(
                                        {
                                            Code: page_count++,
                                            Label: contained_dimensions.join('; '),
                                            StartIndex: start_index,
                                            EndIndex: (i - 1)
                                        }
                                    );

                                    // And also (re)set the important values
                                    start_index = i;
                                    limit_counter = 1;
                                    contained_dimensions = [];

                                    // And we mustn't forget that the dimension label should be pushed to the
                                    // array for the next page
                                    contained_dimensions.push(dimension_labels[rows[i].Dimension]);
                                }

                                // In case we are at the end of the rows and the last pushed page didn't cover
                                // the outstanding lines we want to add them
                                if ((i == (rows.length - 1)) && (start_index != (i + 1))) {
                                    param_values.push(
                                        {
                                            Code: page_count++,
                                            Label: contained_dimensions.join('; '),
                                            StartIndex: start_index,
                                            EndIndex: i
                                        }
                                    );
                                }
                            }

                        	break;

                        // In this case we will print as many whole dimensions on a page as possible
                        // In case a dimension's length is over the MaxRowsPerPage it will just split it
                       	// into multiple pages the same way as for the DimensionOnNewPage case
                      	case PrintQSummary.WholeDimensionsPerPage:
                        	start_index = 0;
                        	end_index = 0;
                        	num_of_dims = 0;
                        	remaining_space = max_items_per_page;

                        	// Iterating over the hastable
                            for (key in dimensions) {
                              	// We want to iterate over a dimension until we put it into a iteration that will be pushed
                              	while (!dimensions[key].DimensionAdded) {
                                  	// If the dimension's length isn't over the limit we just "add" it to the list
                                  	// of dimensions which should be pushed when the limit will be reached
                                    if (dimensions[key].DimensionLength <= remaining_space) {
                                      	end_index = dimensions[key].EndIndex;
                                        num_of_dims++;
                                        remaining_space -= dimensions[key].DimensionLength;
                                        contained_dimensions.push(dimension_labels[key]);
                                      	contained_dim_ids.push(key);

                                      	// Every dimension which was "added" needs to be marked
                                      	dimensions[key].DimensionAdded = true;
                                    }
                                  	// The dimensions length's over the limit
                                    else {
                                      	// In case it would be the first dimension on the page and it's over the limit we need
                                      	// to split it same way as for the DimensionOnNewPage case
                                        if (num_of_dims == 0) {
                                            num_of_pages = Math.ceil (dimensions[key].DimensionLength / max_items_per_page);

                                            for (i = 0; i < num_of_pages; ++i) {
                                              	start_index = (dimensions[key].StartIndex + (i * max_items_per_page));

                                              	// We don't want to push the last page at this moment, let's just
                                              	// wait if another dimension would fit on it
                                              	if (i != (num_of_pages - 1)) {
                                                	param_values.push(
                                                        {
                                                            Code: page_count++,
                                                            Label: (i == 0) ? dimension_labels[key] : (dimension_labels[key] + ' ' + continued_label),
                                                            StartIndex: start_index,
                                                            EndIndex: ((start_index + max_items_per_page - 1) < dimensions[key].EndIndex) ? (start_index + max_items_per_page - 1) : dimensions[key].EndIndex
                                                        }
                                                    );
                                                }
                                            }

                                          	// We need to mark the dimension as "added"...
                                          	dimensions[key].DimensionAdded = true;

                                          	// ...and (re)set the important values
                                          	end_index = dimensions[key].EndIndex;
                                          	num_of_dims++;
                                        	remaining_space = (max_items_per_page - (end_index - start_index + 1));
                                          	contained_dimensions.push(dimension_labels[key] + ' ' + continued_label);
                                      		contained_dim_ids.push(key);
                                        }
                                      	// The dimension isn't the first one on that page -> we'll push everything what was
                                      	// already added and let the dimension go through again
                                        else if (num_of_dims > 0) {
                                            param_values.push(
                                                {
                                                    Code: page_count++,
                                                    Label: contained_dimensions.join('; '),
                                                    StartIndex: start_index,
                                                    EndIndex: end_index
                                                }
                                            );

                                          	// All dimensions which were just pushed are marked as "printed" again...
                                          	for (i = 0; i < contained_dim_ids.length; ++i) {
                                                dimensions[contained_dim_ids[i]].DimensionPrinted = true;
                                            }

                                          	// ...and the important values are (re)set as well
                                          	start_index = dimensions[key].StartIndex;
                                          	num_of_dims = 0;
                                          	remaining_space = max_items_per_page;
                                            contained_dimensions = [];
                                          	contained_dim_ids = [];

                                          	// We didn't mark this dimension as "added" which means that it will start again
                                          	// from the beginning of the while cycle with the different important values
                                        }
                                    }
                                }

                              	// The current dimension is the last one and it wasn't printed which means that we need
                              	// to push all outstanding dimensions which are already prepared but weren't pushed
                              	// because the limit wasn't reached
                              	if (dimensions[key].IsLastDimension && (!dimensions[key].DimensionPrinted)) {
                                	param_values.push(
                                    	{
                                    		Code: page_count++,
                                    		Label: contained_dimensions.join('; '),
                                    		StartIndex: start_index,
                                    		EndIndex: end_index
                                    	}
                                    );
                                }
                            }

                        	break;

                        // In this case, we just want to make the page breaker when the limit was reached without any other limitations
                      	default:
                        	start_index = 0;
                            limit_counter = 0;

                            // Iterating over the array with all rows (dimensions + questions in the appropriate order)
                            for (i = 0; i < rows.length; ++i) {
                                limit_counter++;

                                // Adding the dimension label without (cont'd) in case we find it
                                if (rows[i].Type == 1) {
                                    contained_dimensions.push(dimension_labels[rows[i].Dimension]);
                                }
                              	// Adding the dimension lable with (cont's) in case the first line on a new page is a question
                                else if ((rows[i].Type == 0) && (limit_counter == 1)) {
                                    contained_dimensions.push(dimension_labels[rows[i].Dimension] + ' ' + continued_label);
                                }

                                // In case the current line should be the last one on the page
                                if (limit_counter == max_items_per_page) {
                                    param_values.push(
                                        {
                                            Code: page_count++,
                                            Label: contained_dimensions.join('; '),
                                            StartIndex: start_index,
                                            EndIndex: i
                                        }
                                    );

                                    // And (re)set the important values
                                    start_index = (i + 1);
                                    limit_counter = 0;
                                    contained_dimensions = [];
                                }

                                // In case we are at the end of the rows and the last pushed page didn't cover
                                // the outstanding lines we want to add them
                                if ((i == (rows.length - 1)) && (start_index != (i + 1))) {
                                    param_values.push(
                                        {
                                            Code: page_count++,
                                            Label: contained_dimensions.join('; '),
                                            StartIndex: start_index,
                                            EndIndex: i
                                        }
                                    );
                                }
                            }
                    }

            		return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'REPORTITEM':
                    var param_values = Get('DIMENSION', state, report).concat( Get('ITEM', state, report) );

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'ROLE':
                    var param_values = [
                        {Label: 'Korn Ferry User', Code: UserType.HayGroupUser},
                        {Label: 'Power User', Code: UserType.PowerUser},
                      	{Label: 'Standard User', Code: UserType.StandardUser},
                        {Label: 'Exec User', Code: UserType.ExecUser},
                        {Label: 'Custom Role 1', Code: UserType.Custom1},
                        {Label: 'Custom Role 2', Code: UserType.Custom2}
                    ];

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'RST':
                    var param_values = [];

                	var i, j, k, comparator;
                	var user = optional;
                    var norm_enabled = [];
                    var norm_labels = [];
                	var included_sorting_options = Config.ResultsSortingTool.SortingOptions;
                	var rst_drop_down_labels = ResourceText.List (report, 'rst_drop_down');
                	var map = ComparatorUtil.ProcessedComparatorsMap (report, state, user);
                	var question_count = Get ('ITEM', state, report, user, optional2).length;
                	var kda_counts = KDA.GetItemCountsByNodeId (user.PersonalizedReportBase, state);
                    var benchmarkset_question = report.DataSource.GetProject (HelperUtil.GetBenchmarkListLocation (report)).GetQuestion ('benchmarkset');

                	for (i = 0; i < Config.Norms.Codes.length; i++) {
                        norm_enabled.push (ParamUtil.Contains (state, 'COMPARATORS_EXTERNAL', ('norm' + (i + 1))));
                        norm_labels.push (benchmarkset_question.GetAnswer (NormUtil.GetNormId (user, i)).Text);
                    }

                	for (j in rst_drop_down_labels) {
                    	rst_drop_down_labels[j] = rst_drop_down_labels[j].split('[N]').join(Config.ResultsSortingTool.TopAmount);
                    }

                	for (k = 0; k < included_sorting_options.length; k++) {
                    	switch (included_sorting_options[k]) {
                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                    		// Strengths
                          	case SortBy.Strengths:
                            	param_values.push(
                                    {
                                        Code: SortBy.Strengths,
                                        Label: rst_drop_down_labels['Strengths'],
                                        RowCount: Math.min(question_count, Config.ResultsSortingTool.TopAmount)
                                    }
                                );

                            	break;
                            // End of Strengths
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Opportunities
                      			case SortBy.Opportunities:
                      			param_values.push(
                                    {
                                        Code: SortBy.Opportunities,
                                        Label: rst_drop_down_labels['Opportunities'],
                                        RowCount: Math.min(question_count, Config.ResultsSortingTool.TopAmount)
                                    }
                                );

                      			break;
                            // End of Opportunities
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                      		// Key Drivers - ENGAGEMENT
                      			case SortBy.KeyDriversEngagement:
                            	if(!(PageHide.EngagementAndEnablementDrivers (user, state))) {
                                	param_values.push(
                                        {
                                            Code: SortBy.KeyDriversEngagement,
                                            Label: rst_drop_down_labels['KeyDriversofEngagement'],
                                            RowCount: kda_counts.Engagement
                                        }
                                    );
                                }

                            	break;
                            // End of Key Drivers - ENGAGEMENT
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Key Drivers - ENABLEMENT
                          	case SortBy.KeyDriversEnablement:
                            	if(!(PageHide.EngagementAndEnablementDrivers (user, state))) {
                                	param_values.push(
                                        {
                                            Code: SortBy.KeyDriversEnablement,
                                            Label: rst_drop_down_labels['KeyDriversofEnablement'],
                                            RowCount: kda_counts.Enablement
                                        }
                                    );
                                }

                            	break;
                            // End of Key Drivers - ENABLEMENT
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Question Trend 1
                          	case SortBy.AllVsPrevious:
                            	comparator = map [ Comparators.Prev ];

                            	if (!comparator.Hidden) {
                                	param_values.push (
                                        {
                                            Code: SortBy.AllVsPrevious,
                                            Label: rst_drop_down_labels['QuestionTrend'],
                                            RowCount: question_count
                                        }
                                    );
                                }

                            	break;
                            // End of Question Trend 1
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                          	case SortBy.AllVsPrevious2:
                            	comparator = map [ Comparators.Prev2 ];

                            	if (!comparator.Hidden) {
                                	param_values.push (
                                        {
                                            Code: SortBy.AllVsPrevious2,
                                            Label: rst_drop_down_labels['QuestionTrend2'],
                                            RowCount: question_count
                                        }
                                    );
                                }

                            	break;
                            // End of Question Trend 2
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Question Trend 3
                          	case SortBy.AllVsPrevious3:
                            	comparator = map [ Comparators.Prev3 ];

                            	if (!comparator.Hidden) {
                                	param_values.push (
                                        {
                                            Code: SortBy.AllVsPrevious3,
                                            Label: rst_drop_down_labels['QuestionTrend3'],
                                            RowCount: question_count
                                        }
                                    );
                                }

                            	break;
                            // End of Question Trend 3
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Total Company
                          	case SortBy.AllVsInternal:
                            	comparator = map [ Comparators.TotalCompany ];

                            	if (!comparator.Hidden) {
                                	param_values.push (
                                        {
                                            Code: SortBy.AllVsInternal,
                                            Label: comparator.TableLabel,
                                            RowCount: question_count
                                        }
                                    );
                                }

                            	break;
                            // End of Total Company
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Level Up
                          	case SortBy.AllVsLevelUp:
                            	comparator = map [ Comparators.LevelUp ];

                            	if (!comparator.Hidden) {
                                	param_values.push (
                                        {
                                            Code: SortBy.AllVsLevelUp,
                                            Label: comparator.TableLabel,
                                            RowCount: question_count
                                        }
                                    );
                                }

                            	break;
                            // End of Level Up
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Level 2
                          	case SortBy.AllVsLevel2:
                            	comparator = map [ Comparators.Level2 ];

                                if (!comparator.Hidden) {
                                    param_values.push (
                                        {
                                            Code: SortBy.AllVsLevel2,
                                            Label: comparator.TableLabel,
                                            RowCount: question_count
                                        }
                                    );
                                }

                            	break;
                            // End of Level 2
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Custom 1
                          	case SortBy.AllVsCustom1:
                            	comparator = map [ Comparators.Custom1 ];

                                if (!comparator.Hidden) {
                                    param_values.push (
                                        {
                                            Code: SortBy.AllVsCustom1,
                                            Label: comparator.TableLabel,
                                            RowCount: question_count
                                        }
                                    );
                                }

                            	break;
                            // End of Custom 1
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Custom 2
                          	case SortBy.AllVsCustom2:
                            	comparator = map [ Comparators.Custom2 ];

                                if (!comparator.Hidden) {
                                    param_values.push (
                                        {
                                            Code: SortBy.AllVsCustom2,
                                            Label: comparator.TableLabel,
                                            RowCount: question_count
                                        }
                                    );
                                }

                            	break;
                            // End of Custom 2
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // External Comparisons
                            case (SortBy.AllVsExternal + '_' + 0):
                            case (SortBy.AllVsExternal + '_' + 1):
                            case (SortBy.AllVsExternal + '_' + 2):
                            case (SortBy.AllVsExternal + '_' + 3):
                            case (SortBy.AllVsExternal + '_' + 4):
                            	comparator = Int32.Parse(included_sorting_options[k].split('_')[1]);

                            	if (norm_enabled[comparator]) {
                                    param_values.push (
                                        {
                                            Code: SortBy.AllVsExternal + '_' + comparator,
                                            Label: rst_drop_down_labels['ExternalComparison'].split('[NORM]').join(norm_labels[comparator]),
                                            RowCount: question_count
                                        }
                                    );
                                }

                            	break;
                            // End of External Comparisons
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Full question set by Favorable
                          	case SortBy.FullQFav:
                            	param_values.push (
                                    {
                                        Code: SortBy.FullQFav,
                                        Label: rst_drop_down_labels['FullQFav'],
                                        RowCount: question_count
                                    }
                                );

                            	break;
                            // End of Full question set by Favorable
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Full question set by Neutral
                          	case SortBy.FullQNeutral:
                            	param_values.push (
                                    {
                                        Code: SortBy.FullQNeutral,
                                        Label: rst_drop_down_labels['FullQNeutral'],
                                        RowCount: question_count
                                    }
                                );

                            	break;
                            // End of Full question set by Neutral
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Full question set by Unfavorable
                          	case SortBy.FullQUnfav:
                            	param_values.push (
                                    {
                                        Code: SortBy.FullQUnfav,
                                        Label: rst_drop_down_labels['FullQUnfav'],
                                        RowCount: question_count
                                    }
                                );

                            	break;
                            // End of Full question set by Unfavorable
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Top 10 Most Favorable
                          	case SortBy.TopFav:
                            	param_values.push (
                                    {
                                        Code: SortBy.TopFav,
                                        Label: rst_drop_down_labels['Top10MostFavorable'],
                                        RowCount: Math.min(question_count, Config.ResultsSortingTool.TopAmount)
                                    }
                                );

                            	break;
                            // End of Top 10 Most Favorable
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Top 10 Least Favorable
                          	case SortBy.BottomFav:
                            	param_values.push (
                                    {
                                        Code: SortBy.BottomFav,
                                        Label: rst_drop_down_labels['Top10LeastFavorable'],
                                        RowCount: Math.min(question_count, Config.ResultsSortingTool.TopAmount)
                                    }
                                );

                            	break;
                            // End of Top 10 Least Favorable
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Top 10 Most Unfavorable
                          	case SortBy.TopUnfav:
                            	param_values.push (
                                    {
                                        Code: SortBy.TopUnfav,
                                        Label: rst_drop_down_labels['Top10MostUnfavorable'],
                                        RowCount: Math.min(question_count, Config.ResultsSortingTool.TopAmount)
                                    }
                                );

                            	break;
                            // End of Top 10 Most Unfavorable
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Top 10 Least Unfavorable
                          	case SortBy.BottomUnfav:
                            	param_values.push (
                                    {
                                        Code: SortBy.BottomUnfav,
                                        Label: rst_drop_down_labels['Top10LeastUnfavorable'],
                                        RowCount: Math.min(question_count, Config.ResultsSortingTool.TopAmount)
                                    }
                                );

                            	break;
                            // End of Top 10 Least Unfavorable
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Top 10 Neutral
                          	case SortBy.TopNeutral:
                            	param_values.push (
                                    {
                                        Code: SortBy.TopNeutral,
                                        Label: rst_drop_down_labels['Top10Neutral'],
                                        RowCount: Math.min(question_count, Config.ResultsSortingTool.TopAmount)
                                    }
                                );

                            	break;
                            // End of Top 10 Neutral
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Top 10 Improved (Trend)
                          	case SortBy.TopImproved:
                            	if (!map[Comparators.Prev].Hidden) {
                                    param_values.push (
                                        {
                                            Code: SortBy.TopImproved,
                                            Label: rst_drop_down_labels['Top10Improved'],
                                            RowCount: Math.min(question_count, Config.ResultsSortingTool.TopAmount)
                                        }
                                    );
                                }

                            	break;
                            // End of Top 10 Improved (Trend)
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Top 10 Declined (Trend)
                          	case SortBy.TopDeclined:
                            	if (!map[Comparators.Prev].Hidden) {
                                    param_values.push (
                                        {
                                            Code: SortBy.TopDeclined,
                                            Label: rst_drop_down_labels['Top10Declined'],
                                            RowCount: Math.min(question_count, Config.ResultsSortingTool.TopAmount)
                                        }
                                    );
                                }

                            	break;
                            // End of Top 10 Declined (Trend)
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Top 10 Above Total Company
                          	case SortBy.TopVsInternal:
                            	comparator = map[Comparators.TotalCompany];

                            	if (!comparator.Hidden) {
                                    param_values.push (
                                        {
                                            Code: SortBy.TopVsInternal,
                                            Label: rst_drop_down_labels['Top10Above'] + ' ' + comparator.TableLabel,
                                            RowCount: Math.min(question_count, Config.ResultsSortingTool.TopAmount)
                                        }
                                    );
                                }

                            	break;
                            // End of Top 10 Above Total Company
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Top 10 Below Total Company
                          	case SortBy.BottomVsInternal:
                            	comparator = map[Comparators.TotalCompany];

                            	if (!comparator.Hidden) {
                                    param_values.push (
                                        {
                                            Code: SortBy.BottomVsInternal,
                                            Label: rst_drop_down_labels['Top10Below'] + ' ' + comparator.TableLabel,
                                            RowCount: Math.min(question_count, Config.ResultsSortingTool.TopAmount)
                                        }
                                    );
                                }

                            	break;
                            // End of Top 10 Below Total Company
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Top 10 Above Level Up
                          	case SortBy.TopVsLevelUp:
                            	comparator = map [Comparators.LevelUp];

                            	if (!comparator.Hidden) {
                                    param_values.push (
                                        {
                                            Code: SortBy.TopVsLevelUp,
                                            Label: rst_drop_down_labels['Top10Above'] + ' ' + comparator.TableLabel,
                                            RowCount: Math.min(question_count, Config.ResultsSortingTool.TopAmount)
                                        }
                                    );
                                }

                            	break;
                            // End of Top 10 Above Level Up
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Top 10 Below Level Up
                          	case SortBy.BottomVsLevelUp:
                            	comparator = map [Comparators.LevelUp];

                            	if (!comparator.Hidden) {
                                    param_values.push (
                                        {
                                            Code: SortBy.BottomVsLevelUp,
                                            Label: rst_drop_down_labels['Top10Below'] + ' ' + comparator.TableLabel,
                                            RowCount: Math.min(question_count, Config.ResultsSortingTool.TopAmount)
                                        }
                                    );
                                }

                            	break;
                            // End of Top 10 Below Level Up
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Top 10 Above Level 2
                          	case SortBy.TopVsLevel2:
                            	comparator = map[Comparators.Level2];

                            	if (!comparator.Hidden) {
                                    param_values.push (
                                        {
                                            Code: SortBy.TopVsLevel2,
                                            Label: rst_drop_down_labels['Top10Above'] + ' ' + comparator.TableLabel,
                                            RowCount: Math.min(question_count, Config.ResultsSortingTool.TopAmount)
                                        }
                                    );
                                }

                            	break;
                            // End of Top 10 Above Level 2
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Top 10 Below Level 2
                          	case SortBy.BottomVsLevel2:
                            	comparator = map[Comparators.Level2];

                            	if (!comparator.Hidden) {
                                    param_values.push (
                                        {
                                            Code: SortBy.BottomVsLevel2,
                                            Label: rst_drop_down_labels['Top10Below'] + ' ' + comparator.TableLabel,
                                            RowCount: Math.min(question_count, Config.ResultsSortingTool.TopAmount)
                                        }
                                    );
                                }

                            	break;
                            // End of Top 10 Below Level 2
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Top 10 Above Custom 1
                          	case SortBy.TopVsCustom1:
                            	comparator = map[Comparators.Custom1];

                            	if (!comparator.Hidden) {
                                    param_values.push (
                                        {
                                            Code: SortBy.TopVsCustom1,
                                            Label: rst_drop_down_labels['Top10Above'] + ' ' + comparator.TableLabel,
                                            RowCount: Math.min(question_count, Config.ResultsSortingTool.TopAmount)
                                        }
                                    );
                                }

                            	break;
                            // End of Top 10 Above Custom 1
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Top 10 Below Custom 1
                          	case SortBy.BottomVsCustom1:
                            	comparator = map[Comparators.Custom1];

                            	if (!comparator.Hidden) {
                                    param_values.push (
                                        {
                                            Code: SortBy.BottomVsCustom1,
                                            Label: rst_drop_down_labels['Top10Below'] + ' ' + comparator.TableLabel,
                                            RowCount: Math.min(question_count, Config.ResultsSortingTool.TopAmount)
                                        }
                                    );
                                }

                            	break;
                            // End of Top 10 Below Custom 1
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Top 10 Above Custom 2
                          	case SortBy.TopVsCustom2:
                            	comparator = map[Comparators.Custom2];

                            	if (!comparator.Hidden) {
                                    param_values.push (
                                        {
                                            Code: SortBy.TopVsCustom2,
                                            Label: rst_drop_down_labels['Top10Above'] + ' ' + comparator.TableLabel,
                                            RowCount: Math.min(question_count, Config.ResultsSortingTool.TopAmount)
                                        }
                                    );
                                }

                            	break;
                            // End of Top 10 Above Custom 2
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

                            // ˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇˇ
                            // Top 10 Below Custom 2
                          	case SortBy.BottomVsCustom2:
                            	comparator = map[Comparators.Custom2];

                            	if (!comparator.Hidden) {
                                    param_values.push (
                                        {
                                            Code: SortBy.BottomVsCustom2,
                                            Label: rst_drop_down_labels['Top10Below'] + ' ' + comparator.TableLabel,
                                            RowCount: Math.min(question_count, Config.ResultsSortingTool.TopAmount)
                                        }
                                    );
                                }

                            	break;
                            // End of Top 10 Below Custom 2
                            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                        }
                    }

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'RST_PAGED':
                    var param_values = [];

                    var continued_label = '(' + ResourceText.Text(report, 'exports', 'Continued') + ')';
                    var rst = Get('RST', state, report, optional, optional2);
                    var map = {};

                    for (var i = 0; i < rst.length; ++i)
                        map [ rst[i].Code ] = rst[i];

                	var iterations;

                	switch (state.ReportExecutionMode) {
                        // PowerPoint
                        case ReportExecutionMode.PowerPointExport:
                            iterations = Config.Export.PowerPoint.ResultsSortingTool.Iterations;

                            break;

                        // Excel
                        case ReportExecutionMode.ExcelExport:
                        	iterations = Config.Export.Excel.ResultsSortingTool.Iterations;

                            break;

                        // The default is PDF
                        default:
                            iterations = Config.Export.PDF.ResultsSortingTool.Iterations;
                    }

                    var tmp = [];

                    for (var i = 0; i < iterations.length; ++i) {
                        var code = iterations[i];

                        if (map[ code ] != null)
                            tmp.push ( map[ code ] );
                    }

                    // Now we have list of items filtered by the same dropdown set available in the UI.
                    // Next we need to expand the views that need paging.
                    for (var i = 0; i < tmp.length; ++i) {
                        var item = tmp[i];

                      	var max_rows_per_page;

                      	switch (state.ReportExecutionMode) {
                            // PowerPoint
                            case ReportExecutionMode.PowerPointExport:
                                max_rows_per_page = Config.Export.PowerPoint.ResultsSortingTool.MaxRowsPerPage;

                                break;

                            // Excel
                            case ReportExecutionMode.ExcelExport:
                                max_rows_per_page = Config.Export.Excel.ResultsSortingTool.MaxRowsPerPage;

                                break;

                            // The default is PDF
                            default:
                                max_rows_per_page = Config.Export.PDF.ResultsSortingTool.MaxRowsPerPage;
                        }

                        var pages = HelperUtil.GetPagedRowSettings( tmp[i].RowCount, max_rows_per_page );

                        for (var j = 0; j < pages.length; ++j) {
                            var page = pages[j];

                            // Give temp the original obj's constructor
                            var param_value = {};

                            for (var key in tmp[i])
                                param_value[key] = tmp[i][key];

                            param_value.Code = param_value.Code + '.' + j;
                            param_value.StartIndex = page.StartIndex;
                            param_value.EndIndex = page.EndIndex;

                            // (cont'd)
                            if (j>0) param_value.Label += ' ' + continued_label;

                            param_values.push ( param_value );
                        }
                    }

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'SORTBY':
                    var param_values = [
                        {Code:'NONE', Label:rtLabels['NoSorting']},
                        {Code:'FAV', Label:rtLabels['PercentFavorable'], ColIndexId:'fav'},
                        {Code:'NEU', Label:rtLabels['PercentNeutral'], ColIndexId:'neu'},
                        {Code:'UNFAV', Label:rtLabels['PercentUnfavorable'], ColIndexId:'unfav'}
                    ];

                    // INTERNAL COMPARATORS
                    var user = optional;
                    var map = ComparatorUtil.ProcessedComparatorsMap ( report, state, user );

                    if ( !map[ Comparators.Prev ].Hidden )
                        param_values.push ({Code:'PRIOR', Label: map[Comparators.Prev].Label, ColIndexId:'previous'});

                    if ( !map[ Comparators.Prev2 ].Hidden )
                        param_values.push ({Code:'PRIOR2', Label: map[Comparators.Prev2].Label, ColIndexId:'previous2'});

                    if ( !map[ Comparators.Prev3 ].Hidden )
                        param_values.push ({Code:'PRIOR3', Label: map[Comparators.Prev3].Label, ColIndexId:'previous3'});

                    var comparator = map[ Comparators.TotalCompany ]
                    if ( !comparator.Hidden )
                        param_values.push ({Code:'INTERNAL', Label: comparator.TableLabel, ColIndexId:'internal'});

                    var comparator = map[ Comparators.LevelUp ]
                    if ( !comparator.Hidden )
                        param_values.push ({Code:'LEVELUP', Label: comparator.TableLabel, ColIndexId:'levelup'});

                    var comparator = map[ Comparators.Level2 ]
                    if ( !comparator.Hidden )
                        param_values.push ({Code:'LEVEL2', Label: comparator.TableLabel, ColIndexId:'level2'});

                    var comparator = map[ Comparators.Custom1 ]
                    if ( !comparator.Hidden )
                        param_values.push ({Code:'CUSTOM1', Label: comparator.TableLabel, ColIndexId:'custom1'});

                    var comparator = map[ Comparators.Custom2 ]
                    if ( !comparator.Hidden )
                        param_values.push ({Code:'CUSTOM2', Label: comparator.TableLabel, ColIndexId:'custom2'});

                    // EXTERNAL COMPARATORS
                    var question = report.DataSource.GetProject(HelperUtil.GetBenchmarkListLocation (report)).GetQuestion('benchmarkset');
                    for (var i = 0; i < Config.Norms.Codes.length; ++i) {
                        var param_name = 'norm' + (i+1);
                        var norm_enabled = ParamUtil.Contains ( state, 'COMPARATORS_EXTERNAL', param_name );

                        if (norm_enabled) {
                            //MR CUSTOM FIX FOR DROPDOWN
                            var norm_id = NormUtil.GetNormId (user, i);
                            var label = question.GetAnswer( norm_id ).Text + ' ' + rtLabels['norm'];
                            //MR END OF CUSTOM FIX

                            param_values.push ({Code: param_name, Label: label, ColIndexId: param_name});
                        }
                    }

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'SURVEY_DIMENSIONS_PAGED':
                    var param_values = [];

                    var continued_label = '(' + ResourceText.Text(report, 'exports', 'Continued') + ')';
                    var dimensions_length = Config.Dimensions.length;
                    var max_items_per_page;
                    var pages;
                    var page_count = 0;

                    switch (state.ReportExecutionMode) {
                        // PowerPoint
                        case ReportExecutionMode.PowerPointExport:
                            max_items_per_page = Config.Export.PowerPoint.SurveyDims.MaxRowsPerPage;

                            break;

                        // The default is PDF
                        default:
                            max_items_per_page = Config.Export.PDF.SurveyDims.MaxRowsPerPage;
                    }

                    pages = HelperUtil.GetPagedRowSettings( dimensions_length, max_items_per_page );

                    for (var i = 0; i < pages.length; ++i) {
                        param_values.push (
                            {
                                Code: page_count++,
                                StartIndex: pages[i].StartIndex,
                                EndIndex: pages[i].EndIndex,
                                Suffix: (i==0) ? '' : (' ' + continued_label )
                            }
                        );
                    }

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'THEME':
                    var param_values = [
                        {Code:0, Label:rtLabels['all']}
                    ];

                    try {
                        var selected = ParamUtil.Selected (report, state, 'VERBATIM', optional, null, null, confirmitFacade);
                        var theme_qid = selected.Code + 'Theme';
                        var theme_question = report.DataSource.GetProject('ds0').GetQuestion(theme_qid);
                        var themes = theme_question.GetAnswers();

                        for (var i = 0; i < themes.length; ++i)
                            param_values.push (
                                {
                                    Code: themes[i].Precode,
                                    Label: themes[i].Text
                                }
                            );
                    }
                    catch (e) {
                        // Means Theme doesn't exist (which is OK)
                    }

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'VERBATIM':
                    var user = optional;
                    var questions = Config.GetCommentQuestionIdsByNodeId(user.PersonalizedReportBase, confirmitFacade);

                    var param_values = GetParamListByQuestionIds(report, questions);

                    if(param_values.length == 0 && !ExecutionMode.isWeb(state)){
                        param_values.push({Code:'-1', Label:'Dummy iteration'});
                    }

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'VERBATIM_ITEM_FILTER':
                    var param_values = [
                        {Code:'0', Label: rtLabels['none']}
                    ].concat( Get('ITEM', state, report) );

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'VERBATIM_ITEM_SCALE_FILTER':
                    var param_values = [];

                    var selected = ParamUtil.Selected (report, state, 'VERBATIM_ITEM_FILTER');

                    if (selected.Code != '0' || selected != null) {
                        //Find out which answers are used in Navi
                        var distIndexes = Config.GetDistributionIndexes_Singles(selected.Code);
                        var allRelevantIndexes = distIndexes.Fav.concat(distIndexes.Neu).concat(distIndexes.Unfav);

                        //Get the answers from the question and add appropriate ones to the parametere
                        var q = report.DataSource.GetProject('ds0').GetQuestion(selected.Code);
                        var items = q.GetAnswers();

                        for (var i = 0; i < items.length; ++i) {
                            //Check if we're using this particular item in Navi
                            var found = false;

                            for(var j = 0; j < allRelevantIndexes.length; j++){
                                if(allRelevantIndexes[j] == i){
                                    found = true;
                                }
                            }

                            //If yes - add it to the parameter
                            if(found){
                                param_values.push (
                                    {
                                        Code: items[i].Precode,
                                        Label: HelperUtil.RemoveHtml ( items[i].Text )
                                    }
                                );
                            }
                        }
                    }

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'VU_ACTIVE':
                case 'VU_EDITOR_ITEM':
                    var vu = new VirtualUnits ( optional );

                    var param_values =  vu.ParamValues();

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'VU_EDITOR_SELECTION':
                    var param_values = [];

                    var table_name = 'hierarchy';
                    var node_ids = report.TableUtils.GetRowHeaderCategoryIds( table_name );
                    var titles = report.TableUtils.GetRowHeaderCategoryTitles ( table_name );

                    for (var i = 0; i < node_ids.length; ++i) {
                        param_values.push (
                            {
                                Code: node_ids[i].toString().toUpperCase(),
                                Label: node_ids[i] + '. ' + titles[i]
                            }
                        );
                    }

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------

                case 'WIDGET':
                    var param_values = [
                        {Code: '2', Label: 'Effectiveness Profile', SmartText: ResourceText.Get(report, 'effectiveness_profile') },
                        {Code: '3', Label: 'Top Dimensions', SmartText: ResourceText.Get(report, 'top_dimensions_widget') },
                        {Code: '4', Label: 'Question Trend', SmartText: ResourceText.Get(report, 'rst_questiontrend') },
                        {Code: '5', Label: 'Internal Comparison', SmartText: ResourceText.Get(report, 'rst_internalcomparison') },
                        {Code: '6', Label: 'External Comparison', SmartText: ResourceText.Get(report, 'rst_externalcomparison') },
                        {Code: '7', Label: 'Key Drivers', SmartText: ResourceText.Get(report, 'key_drivers') },
                        {Code: '8', Label: 'Top Comment Themes', SmartText: ResourceText.Get(report, 'comments_widget') },
                        {Code: '9', Label: 'Strengths', SmartText: ResourceText.Get(report, 'rst_strengths') },
                        {Code: '10', Label: 'Opportunities', SmartText: ResourceText.Get(report, 'rst_opportunities') },
                        {Code: '11', Label: 'ENPS', SmartText: ResourceText.Get(report, 'net_promoter') }
                    ];

                    return param_values;
                    break;

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------
            // End of the switch inside of the Get function

			}
		}
		catch (e) {
			ConfirmitClass.Log4 ('Error loading Param Values for ' + param_name + ': ' + e);

			return [{Code:-1, Label: e}];
			// return [];
		}
	}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////FUNCTION SEPARATOR//////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	static function AnswerList (param_name, state, report) {
		var param_values = [];

		var project = report.DataSource.GetProject('ds0');
		var param_prefix = param_name.split('_')[0]; // e.g. L1
		var question_id = ParamUtil.GetParamCode(state, param_prefix);
		var question : Question = project.GetQuestion(question_id);
		var answers = question.GetAnswers();

		for (var i = 0; i < answers.length; ++i) {
			param_values.push (
				{
					Code: question_id + '.' + answers[i].Precode,
					Label: answers[i].Text
				}
			);
		}

		return param_values;
	}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////FUNCTION SEPARATOR/////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	static function AnswersToParamValues (report, qid, label) {
		var o = [];

		var key = qid + '_' + report.CurrentLanguage;

		if(CachedAnswerList[key] != null)
			return CachedAnswerList[key];

		var project = report.DataSource.GetProject('ds0');
		var question = project.GetQuestion(qid);

		//if (label == null) label = question.Title;

		var answers = question.GetAnswers();

		for (var i = 0; i < answers.length; ++i) {
			o.push (
				{
					Label: answers[i].Text,
					Code: answers[i].Precode
				}
			);
		}

		CachedAnswerList[key] = o;

		return o;
	}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////FUNCTION SEPARATOR/////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	static function FilterHeading (state, user, report, text) {
		var idx = parseInt (text.Name.toUpperCase().split('FILTER')[1]);
		var qid = FilterUtil.GetFilters(state, user)[idx-1];
		var project = report.DataSource.GetProject('ds0');
		var question = project.GetQuestion(qid);

		return question.Title;
	}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////FUNCTION SEPARATOR/////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	static function GetPagedParamListByNodeId (report, confirmit, node_id, page_size, config, suffix_code, suffix_label) {
		var param_values = [];

		var parent_relation_name = Config.Hierarchy.ParentRelationName;
		var param_list = [];
		var ids = DatabaseQuery.ExecQuery (confirmit, Config.Hierarchy.SchemaId, Config.Hierarchy.TableName, 'id', parent_relation_name, node_id);
		var labels = DatabaseQuery.ExecQuery (confirmit, Config.Hierarchy.SchemaId, Config.Hierarchy.TableName, '__l9', parent_relation_name, node_id);
		var length = ids.length;
		var qid = Config.Hierarchy.VariableId;
		var page_count = Math.ceil( length / page_size );

		for (var page_idx = 0; page_idx < page_count; ++page_idx) {
			var start_idx = page_idx * page_size;
			var end_idx = Math.min ( (page_idx+1)*page_size-1, length -1 );
			var e = [];

			for (var i = start_idx; i <= end_idx; ++i) {
				e.push (
					'[SEGMENT]{' +
					'label:' + report.TableUtils.EncodeJsString( labels[i] ) + ';' +
					'expression:' + report.TableUtils.EncodeJsString( 'INHIERARCHY(' + qid + ',"' + ids[i] + '")') +
					'}'
				);
			}

			var breakby = e.join('+');

			param_values.push (
				{
					Code: qid + '.' + page_idx + suffix_code,
					QuestionId: qid,
					Label: qid + ' [' + (page_idx+1) + '/' + page_count + ']' + suffix_label,
					StartIndex: start_idx, // Zero indexed
					EndIndex: end_idx,
					BreakBy : breakby,
					Config: config,
					BreakByVariableId: null
				}
			);
		}

		return param_values;
	}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////FUNCTION SEPARATOR/////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	static function GetPagedParamListByQuestionId (report, qid, page_size, useTitle, useText, config, suffix_code, suffix_label) {
		var param_values = [];

		if (!useText && !useTitle) useText = true; // fallback

		var project = report.DataSource.GetProject('ds0');
		var question_title = project.GetQuestion(qid).Title;
        var outer_expression = '[SEGMENT]{label:' + report.TableUtils.EncodeJsString(question_title) + '}';
		var question = project.GetQuestion ( qid );
		var o = [];

		if (useTitle) o.push ( HelperUtil.RemoveHtml (HelperUtil.TextSubstitution (question.Title)) );

		if (useText) o.push ( HelperUtil.RemoveHtml (HelperUtil.TextSubstitution (question.Text)) );

		var answer_count = question.AnswerCount;
		var page_count = Math.ceil ( answer_count / page_size );
		var answers = question.GetAnswers();
		var codes = [];

		for (var i = 0; i < answers.length; ++i) {
			codes.push ( answers[i].Precode );
		}

		if ( page_count <= 1 ) {
			param_values.push (
				{
					Code: question.QuestionId,
					Label: o.join(': ') + suffix_label,
					QuestionId: question.QuestionId,
					Config: config,
					BreakBy: outer_expression + '/(' + qid + '{totals:false}' + ')',
					BreakByVariableId: question.QuestionId
				}
			);
		}
		else {
			for (var j = 0; j < page_count; ++j) {
				var start_index = (j*page_size);
				var end_index = Math.min ( (j+1)*page_size-1, answer_count -1 );
				var qid = question.QuestionId;
				var label_suffix = suffix_label + ' [' + (j+1) + '/' + page_count + ']';
				var mask = codes.slice(start_index, end_index+1);
				var expression = qid + '{totals:false; mask:' + mask + '}';

				param_values.push (
					{
						Code: qid + '.' + j + suffix_code,
						QuestionId: qid,
						Label: o.join(': ') + label_suffix,
						StartIndex: start_index, // Zero indexed
						EndIndex: end_index,
						BreakBy: outer_expression + '/(' + expression + ')',
						Config: config,
						BreakByVariableId: qid,
						Mask: mask
					}
				);
			}
		}

		return param_values;
	}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////FUNCTION SEPARATOR/////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	static function GetPagedParamListByQuestionIds (user, report, qids, page_size, useTitle, useText) {
		var param_values = [];

		// Fallback
		if (!useText && !useTitle) useText = true;

		var project = report.DataSource.GetProject('ds0');

		for (var i = 0; i < qids.length; ++i) {
			var question = project.GetQuestion ( qids[i] );
			var o = [];

			if (useTitle) o.push ( HelperUtil.RemoveHtml (HelperUtil.TextSubstitution (question.Title)) );

			if (useText) o.push ( HelperUtil.RemoveHtml (HelperUtil.TextSubstitution (question.Text)) );

			var answer_count;

			if (qids[i] == Config.Hierarchy.VariableId) {
				// Hierarchy Question
				// Look up how many child nodes exist
				var ids = DatabaseQuery.ExecQuery (
					ConfirmitClass.Get(),
					Config.Hierarchy.SchemaId,
					Config.Hierarchy.TableName,
					'id',
					Config.Hierarchy.ParentRelationName,
					user.PersonalizedReportBase
				);

				answer_count = ids.length;
			}
			else {
				// Not Hierarchy Question
			    answer_count =  question.AnswerCount;
			}

			var page_count = Math.ceil ( answer_count / page_size );

			if ( page_count <= 1 ) {
				param_values.push (
					{
						Code: question.QuestionId,
						Label: o.join(': '),
						QuestionId: question.QuestionId
					}
				);
			}
			else {
				for (var j = 0; j < page_count; ++j) {
					var start_index = (j*page_size);
					var end_index = Math.min ( (j+1)*page_size-1, answer_count -1 );
                  	var qid = question.QuestionId;

					param_values.push (
						{
							Code: qid + '.' + j,
							QuestionId: qid,
							Label: o.join(': ') + ' [' + (start_index+1) + ' - ' + (end_index+1) + ']',
							StartIndex: start_index, // Zero indexed
							EndIndex: end_index
						}
					);
				}
			}
		}

		return param_values;
	}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////FUNCTION SEPARATOR/////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	static function GetParamListByQuestionIds (report, qids, useTitle, useText) {
		var param_values = [];

		if (!useText && !useTitle) useText = true; // fallback

		var project = report.DataSource.GetProject('ds0');

		for (var i = 0; i < qids.length; ++i) {
			var question = project.GetQuestion ( qids[i] );
			var o = [];

			if (useTitle) o.push ( HelperUtil.RemoveHtml (HelperUtil.ReplaceWildCards (report, question.Title)) );

			if (useText) o.push ( HelperUtil.RemoveHtml (HelperUtil.ReplaceWildCards (report, question.Text)) );

			param_values.push (
				{
					Code: question.QuestionId,
					Label: o.join(': ')
				}
			);
		}

		return param_values;
	}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////FUNCTION SEPARATOR/////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	static function LoadDefaultValues (report, user, state) {
		if (state.Parameters.GetString('RUNONCE') != '1') {
			ParamUtil.Save ( state, report, 'REPORT_BASE_TOP', user.PersonalizedReportBase );

			var item_param_values = ParamLists.Get('ITEM', state, report);
			var item_with_enps_param_values = ParamLists.Get('ITEM_WITH_ENPS', state, report);
			var demo_param_values = ParamLists.Get('DEMOGR', state, report, user);
			var demo_paged_param_values = ParamLists.Get('DEMOGR_PAGED', state, report, user);

			var defaultParameterValues = [
				//['RST', ParamLists.Get('RST', state, report, user)[0].Code],
                ['DATA', ParamLists.Get('DATA', state, report)[0].Code],
                ['INTERNAL_BENCHMARK_DATA', ParamLists.Get('INTERNAL_BENCHMARK_DATA', state, report)[0].Code],
				['THEME', '0'],
				['WIDGET', Config.Summary.Widget],
				['RUNONCE', '1']
			];

            if (demo_param_values.length > 0) {
				defaultParameterValues.push ( ['DEMOGR', demo_param_values[0].Code] );
            }

			if ( demo_paged_param_values.length > 0) {
				defaultParameterValues.push ( ['DEMOGR_PAGED', demo_paged_param_values[0].Code] );
			}

			if (item_param_values.length > 0) {
				defaultParameterValues.push ( ['ITEM', item_param_values[0].Code] );

				if (item_param_values.length > 1)
					defaultParameterValues.push ( ['ITEM2', item_param_values[1].Code] );
				else
					defaultParameterValues.push ( ['ITEM2', item_param_values[0].Code] );
			}

			if (item_with_enps_param_values.length > 0)
				defaultParameterValues.push ( ['ITEM_WITH_ENPS', item_with_enps_param_values[0].Code] );

			for (var i = 0; i < defaultParameterValues.length; i++) {
				var parameterID = defaultParameterValues[i][0];

				if (state.Parameters.IsNull(parameterID))
					ParamUtil.Save (state, report, defaultParameterValues[i][0], defaultParameterValues[i][1]);
			}

			// Comparators
			ParamUtil.SaveMulti (state, report, 'COMPARATORS_EXTERNAL', Config.Comps.DefaultValues.External);
			ParamUtil.SaveMulti (state, report, 'COMPARATORS_INTERNAL', Config.Comps.DefaultValues.Internal);
		}
	}
}