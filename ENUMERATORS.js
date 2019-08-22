class PageContextEnum {
	static var qm = 'qm';
  	static var labels = 'labels';
  	static var selfScoreRR = 'selfScoreRR';
}

class ComparatorType {
	static const Absolute = 1;
	static const Relative = 2; 
}

class GuideIterations{
    static const Trend1 = 'Trend1';
    static const Trend2 = 'Trend2';
    static const Trend3 = 'Trend3';
    static const Internal1 = 'Internal1';
    static const Internal2 = 'Internal2';
    static const Internal3 = 'Internal3';
    static const Internal4 = 'Internal4';
    static const Internal5 = 'Internal5';
    static const Norm1 = 'Norm1';
    static const Norm2 = 'Norm2';
    static const Norm3 = 'Norm3';
    static const Norm4 = 'Norm4';
    static const Norm5 = 'Norm5';
}

class CustomWidget {
  	static var ResponseRate = '0';
  	static var EE = '1';
 	static var EffectivenessProfile = '2';
  	static var TopDimensions = '3';
  	static var QuestionTrend = '4';
  	static var InternalComparison = '5';
  	static var ExternalComparison = '6';
	static var KeyDrivers = '7';
	static var TopCommentThemes = '8';
	static var Strengths = '9';
	static var Opportunities = '10';
	static var ENPS = '11';
	static var Tier1 = '12';
}

class Comparators {
	
	static var GIN = '-1';
	static var HP = '-2';
  
	static var Prev = '001';
  	static var Prev2 = '002';
	static var Prev3 = '003';
  
	static var TotalCompany = '101';
	static var LevelUp = '102';
	static var Level2 = '103';
	static var Custom1 = '104';
	static var Custom2 = '105';
  
}


class ActionStatus {
	static var Planned = '1';
	static var Delayed = '2';
	static var Cancelled = '3';
	static var Overdue = '4';
	static var Ongoing = '5';
	static var Completed = '6';
	static var BestPractice = '7';
}

class Codes {
 static var NoneSelected = '-1';
}

class SortBy {
	static const Strengths = '1';
	static const Opportunities = '2';
	static const KeyDriversEngagement = '3';
	static const KeyDriversEnablement = '4';
	static const TopFav = '5';
	static const BottomFav = '6';
	static const TopUnfav = '7';
	static const BottomUnfav = '8';
	static const TopNeutral = '9';
	static const TopImproved = '10';
  	static const TopImproved2 = '10;2';
	static const TopImproved3 = '10;3';
	static const TopDeclined = '11';
	static const TopVsInternal = '12';
	static const TopVsLevelUp = '12;1';
	static const TopVsLevel2 = '12;2';
	static const TopVsCustom1 = '12;3';
	static const TopVsCustom2 = '12;4';
  
	static const BottomVsInternal = '13';
	static const BottomVsLevelUp = '13;1';
	static const BottomVsLevel2 = '13;2';
	static const BottomVsCustom1 = '13;3';
	static const BottomVsCustom2 = '13;4';
  
  
	static const TopVsExternal = '14';
	static const BottomVsExternal = '15';
//	static const TopVsHP = '16';
//	static const BottomVsHP = '17';
	static const AllVsInternal = '18';
	static const AllVsLevelUp = '18;1';
	static const AllVsExternal = '19';
//	static const AllVsHP = '20';
//	static const AllVsGIN = '21';
	static const AllVsPrevious = '22';
	static const AllVsPrevious2 = '22;2';
	static const AllVsPrevious3 = '22;3';
  
  	static const AllVsLevel2 = '23';
  	static const AllVsCustom1 = '24';
  	static const AllVsCustom2 = '25';
  
    static const FullQFav = '26';
    static const FullQNeutral = '27';
    static const FullQUnfav = '28';
  
}

class ReportItemType {
 
  static var Dimension = '1';
  static var Question = '2';
  static var AllDimensions = '3';
  static var AllQuestions = '4';
  
}

//Enum for SORTBY parameter (used on Survey Dimensions page)
class SurveyDimensionSortBy{
	static const None = 'NONE';
  	static const Fav = 'FAV';
  	static const Neu = 'NEU';
  	static const Unfav = 'UNFAV';
  	static const Trend1 = 'PRIOR';
  	static const Trend2 = 'PRIOR2';
  	static const Trend3 = 'PRIOR3';
  	static const Internal1 = 'INTERNAL';
  	static const Internal2 = 'LEVELUP';
  	static const Internal3 = 'LEVEL2';
  	static const Internal4 = 'CUSTOM1';
  	static const Internal5 = 'CUSTOM2';
  	static const Norm1 = 'norm1';
  	static const Norm2 = 'norm2';
  	static const Norm3 = 'norm3';
  	static const Norm4 = 'norm4';
  	static const Norm5 = 'norm5';
}

class UGPages{
  	static const Welcome = {
      	PageTitle: 'Welcome',
      	ButtonTitle: null,
      	ButtonId: null
    };
    static const Summary = {
      	PageTitle: 'Summary',
      	ButtonTitle: 'Summary',
      	ButtonId: '0'
    };
  	static const Dashboard = {
      	PageTitle: 'Dashboard',
      	ButtonTitle: 'Dashboard',
      	ButtonId: '1'
    };
  	static const EE = {
      	PageTitle: 'EE',
      	ButtonTitle: null,
      	ButtonId: null
    };
  	static const EEOverview = {
      	PageTitle: 'EEOverview',
      	ButtonTitle: 'EEOverview',
      	ButtonId: '2'
    };
  	static const EEDrivers = {
      	PageTitle: 'EEDrivers',
      	ButtonTitle: 'EEDrivers',
      	ButtonId: '3'
    };
  	static const EProfile = {
      	PageTitle: 'EProfile',
      	ButtonTitle: 'EffectivenessProfile',
      	ButtonId: '4'
    };
  	static const ExploreResults = {
      	PageTitle: 'ExploreResults',
      	ButtonTitle: null,
      	ButtonId: null
    };
  	static const QuestionsSummary = {
      	PageTitle: 'QuestionsSummary',
      	ButtonTitle: 'QuestionSummary',
      	ButtonId: '5'
    };
  	static const ExploreSurveyDimensions = {
      	PageTitle: 'ExploreSurveyDimensions',
      	ButtonTitle: 'SurveyDimensions',
      	ButtonId: '6'
    };
  	static const LocalQuestions = {
      	PageTitle: 'LocalQuestions',
      	ButtonTitle: 'LocalQuestions',
      	ButtonId: '7'
    };
  	static const ResultsSortingTool = {
      	PageTitle: 'ResultsSortingTool',
      	ButtonTitle: 'RST',
      	ButtonId: '8'
    };
  	static const InternalBenchmarkTool = {
      	PageTitle: 'InternalBenchmarkTool',
      	ButtonTitle: 'InternalBM',
      	ButtonId: '9'
    };
  	static const PlotYourResults = {
      	PageTitle: 'PlotYourResults',
      	ButtonTitle: 'PlotYourResults',
      	ButtonId: '10'
    };
  	static const DemographicHighlighter = {
      	PageTitle: 'DemographicHighlighter',
      	ButtonTitle: 'DemoHighlighter',
      	ButtonId: '11'
    };
  	static const NSQ = {
      	PageTitle: 'NSQ',
      	ButtonTitle: 'NSQ',
      	ButtonId: '12'
    };
  	static const NSQ_COMPARATOR = {
      	PageTitle: 'NSQ_COMPARATOR',
      	ButtonTitle: 'NSQComp',
      	ButtonId: '13'
    };
  	static const NSQ_IBT = {
      	PageTitle: 'NSQ_IBT',
      	ButtonTitle: 'NSQ_IBT',
      	ButtonId: '14'
    };
  	static const Comments = {
      	PageTitle: 'Comments',
      	ButtonTitle: 'Comments',
      	ButtonId: '15'
    };
  	static const ENPS = {
      	PageTitle: 'Nps',
      	ButtonTitle: 'NavNPS',
      	ButtonId: '16'
    };
  	static const TakeAction = {
      	PageTitle: 'Action',
      	ButtonTitle: null,
      	ButtonId: null
    };
  	static const Home = {
      	PageTitle: 'ActionHome',
      	ButtonTitle: 'Home',
      	ButtonId: '17'
    };
  	static const CreatePlan = {
      	PageTitle: 'ActionCreate',
      	ButtonTitle: 'CreatePlan',
      	ButtonId: '18'
    };
  	static const ReviewOwnPlans = {
      	PageTitle: 'ActionOwn',
      	ButtonTitle: 'ViewOwnPlan',
      	ButtonId: '19'
    };
  	static const ReviewAllPlans = {
      	PageTitle: 'ActionAll',
      	ButtonTitle: 'ViewAllPlans',
      	ButtonId: '20'
    };
  	static const SharedPlans = {
      	PageTitle: 'ActionBestPractice',
      	ButtonTitle: 'SharedPlans',
      	ButtonId: '21'
    };
  	static const Statistics = {
      	PageTitle: 'ActionStatistics',
      	ButtonTitle: 'Statistics',
      	ButtonId: '22'
    };
  	static const Respondents = {
      	PageTitle: 'Respondents',
      	ButtonTitle: 'Respondents',
      	ButtonId: '23'
    };
}

class PrintQSummary {
  	static const DimensionOnNewPage = 'PQSDONP';
  	static const DimensionHeaderCantBeLastLine = 'PQSDHCBLL';
  	static const WholeDimensionsPerPage = 'PQSWDPP';
  	static const ForcingSwitchedOff = 'PQSFSO';
}

class QsAndDimsHidingOption {
	static const SwitchedOff = '0';
  	static const HideAllUnderMinN = '1';
  	static const HideAllZeros = '2';
}

class DimensionSetType {
	static const Core = '0';
  	static const Local = '1';
  	static const CoreLocal = '2';
}