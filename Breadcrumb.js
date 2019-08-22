class Breadcrumb {
  private static const PATH = 'path';
  private static const TITLE = 'title';
  public static const Pages = {
    Welcome: 'Welcome',
    Respondents: 'Respondents',
    RespondentsTrend: 'RespondentsTrend',
    ResponsesByGroup: 'ResponsesByGroup',
    ResponsesBySegment: 'ResponsesBySegment',
    Comments: 'Comments',
    Dashboard: 'Dashboard',
    Summary: 'Summary',
    EE: 'EE',
    EEOverview: 'EEOverview',
    EEDetails: 'EEDetails',
    EEDrivers: 'EEDrivers',
    EProfile: 'EProfile',
    EProfileDetails: 'EProfileDetails',
    EProfileGap : 'EProfileGap',
    ExploreResults: 'ExploreResults',
    ExploreSurveyDimensions: 'ExploreSurveyDimensions',
    LocalQuestions: 'LocalQuestions',			// RP-07 – Local Questions
    QuestionsSummary: 'QuestionsSummary',
    QuestionsByDimension: 'QuestionsByDimension',
    QuestionDetails: 'QuestionDetails',
    Action: 'Action',
    ActionHome: 'ActionHome',
    ActionCreate: 'ActionCreate',
    ActionAll: 'ActionAll',
    ActionOwn: 'ActionOwn',
    ActionBestPractice: 'ActionBestPractice',
    ActionStatistics: 'ActionStatistics',
    Nps: 'Nps',
    NpsScale: 'NpsScale',
    NpsGap: 'NPSGapTool',
    NpsDetails: 'NpsDetails',
    ResultsSortingTool: 'ResultsSortingTool',
    InternalBenchmarkTool: 'InternalBenchmarkTool',
    PlotYourResults: 'PlotYourResults',
    DemographicHighlighter: 'DemographicHighlighter',
    NSQ: 'NSQ',
    PssTableGenerator: 'PssTableGenerator',
    GeneratingPssTable: 'GeneratingPssTable',
    PssTableComplete: 'PssTableComplete',
    DimDetails: 'DimDetails', 
    NSQ_COMPARATOR: 'NSQ_COMPARATOR',
    NSQ_IBT: 'NSQ_IBT',
    RankingQuestions: 'RankingQuestions'
  };
  
  
  static function GetInnerPath ( page_context ) {
    return page_context.Items['inner_path'];
  }
  
  static function SetPath ( page_context, path_array, report, disable_help ) {

    var flag_show_help = (disable_help == true) ? '0' : '1';
    
    page_context.Items['flag_show_help'] = flag_show_help;
    
    page_context.Items['inner_path'] = path_array[path_array.length-1];
    
    
    //var pageList = ResourceText.List(report, 'pages');
    //page_context.Items[TITLE] = pageList[path_array[path_array.length-1]];
  
    for (var i=0;i<path_array.length;++i){
      path_array[i] = ResourceText.Text(report, 'pages', path_array[i]);//pageList[path_array[i]];
    }
    page_context.Items[PATH] = ResourceText.Text(report, 'ui', 'breadcrumb') + ' ' + path_array.join(' > ');
    
  }
      
  static function GetTitle ( page_context ) {
    if (page_context.Items[TITLE] != null) {
      return page_context.Items[TITLE];
    } else {
      return '';
    }
  }
  static function GetPath ( page_context ) {
    if (page_context.Items[PATH] != null) {
      return page_context.Items[PATH];
    } else {
      return '';
    }
  }
}