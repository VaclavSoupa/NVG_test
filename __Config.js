class Config {
  	//SmartHub project IDs
  	static var Hub = {
  	  Norms: {
    	ProjectId: 'p1875006290'
  		},
      Participation: {
      	ProjectId: 'p1873258503'
   		},
      ActionPlanning: {
      	ProjectId: 'p1873258590'
   		}    
	}
        
    // Virtual Units
    static var VirtualUnits = {
      MaxCombinedUnits: 500,
      MaxRowsInEditor: 2000, 
      //ProjectId: 'p3075874600' //US Template - Change for your project
      ProjectId: 'p1846493589' //EURO Template - Change for your project
      //ProjectId: 'p1846926900' //EURO-GER Template - Change for your project 
    }
    
    //MX
    static var MatrixReport = {
      //ProjectId: 'p3090195870', //US Template - Change for your project
      ProjectId: 'p1872054980', //EURO Template - Change for your project
      //ProjectId: 'p1873296218', //EURO-GER Template - Change for your project
      MaxDimensionsPerPage: 5,
      MetaData: { 
        //ProjectId: 'p3075404764' //US - DO NOT change for your project
        ProjectId: 'p1848850749' //EURO - DO NOT change for your project
        //ProjectId: 'p3075404764' //EURO-GER - DO NOT change for your project
      }
    }
        
   	//Hierarchy settings
    static var Hierarchy = {
 		//SchemaId: 5078, //US - Change for your project
		SchemaId: 3857, //EURO SERVER - Change for your project
		//SchemaId: 4237, //EURO-GER SERVER - Change for your project
      	ParentRelationName: 'parent', // *** NOTE: Case sensitive ***
		TableName: 'Korn Ferry Report new',
     	VariableId: 'Orgcode', 
      	TopNodeId: '1000',
        Direct: false,
     	HideSelector: false,
      	HideScoresColumnName: '__l9hide'
    };
  	
  	//PID settings
  	//This option should be used only if the navigator is based on data collected from multiple surveys
    static var PID = {
      	Enabled: false,
      	PidVariableName: 'pid',
      	PnameVariableName: 'pname',
      	// DO NOT CHANGE THE PROPERTY BELOW
      	PidListSourceTableLocation: 'PFAULF:PID'
    };
  
  	// Respondent Privacy
    static var Privacy = {
      Table: {MinN: 5},
      Verbatim: {MinN: 30},
      RemainderRule: {MinN: 0}, //0 means turned off - that's the default value
      RemainderRuleTieHideLast: true,
	  ShowBelowThresholdN: false
    };
  
  	// Wave (for Historical Data)
    static var Wave = {
      PreviousWaveCount: 3, // number of PREVIOUS waves to show (supported range 0-3)
      VariableId: 'Wave',
	  //UPDATED THE BELOW TO REFLECT WAVE CODE VALUES IN SURVEY FOR YOUR PROJECT
      //Codes: { Current: '2016', Previous: '2015', Previous2: '2014', Previous3: '2013'}
      Codes: { Current: '2016', Previous: '2015', Previous2: '2014', Previous3: '2013'} // RP-24 Three years of Trends
    };
  
  	//If set to true the Navigator will be in RR site mode (all pages except for Respondents hidden)
  	static var RREnabled = false;
  
    //If set to true the column Paper Population will be hidden on the RR by Group page.
    static var RRByGroup_PaperPopulation_Hide = false;
      
  	//======================================================================================================================================================
  
  	// Logos for top of page (both are optional, set to null if not in use)
    static var Logos = {
	  //CLIENT LOGO - Change for project
      //Left: '/isa/DYCQABDXPXAFCQDXFVCVMKGHPVFBHBOQ/HayGroup_SalesDemo/ABC%20Corporation%20Final_Small.png', //US Server - Change for client project
	  Left: '/isa/AAJQAQPHABIRFIKAERKQOVDREIIXJHMV/HayGroup_SalesDemo/ABC%20Corporation%20Final_Small.png', //EURO Server - Change for client project
      	
	  //HAY GROUP LOGO - Should NOT change or remove for client project without RPC Approval
	  //Right: '/isa/DYCQABDXPXAFCQDXFVCVMKGHPVFBHBOQ/REPORTAL%20REBRAND/Green%20Korn%20Ferry%20JPG.jpg'  //US Server
      Right: '/isa/AAJQAQPHABIRFIKAERKQOVDREIIXJHMV/REPORTAL%20REBRAND/Green%20Korn%20Ferry%20JPG.jpg'//EURO Server
    };
  
  	// Banner image path
    static var Banner = {
      //JV: New setting - Option - controls the banner, there are 6 options:
      //1 - Field
      //2 - Bikes
      //3 - Canyon
      //4 - Trees
      //5 - Buildings
      //6 - Multi
      Option: 1,
           
      //MR: Banner map, assigns option numbers to links to banners
      BannerMap: {
       '1': 'https://survey.confirmit.com/isa/DYCQABDXPXAFCQDXFVCVMKGHPVFBHBOQ/REPORTAL%20REBRAND/Field-175x1000.jpg',
       '2': 'https://survey.confirmit.com/isa/DYCQABDXPXAFCQDXFVCVMKGHPVFBHBOQ/REPORTAL%20REBRAND/Bikes-175x1000.jpg',
       '3': 'https://survey.confirmit.com/isa/DYCQABDXPXAFCQDXFVCVMKGHPVFBHBOQ/REPORTAL%20REBRAND/Canyon-175x1000.jpg',
       '4': 'https://survey.confirmit.com/isa/DYCQABDXPXAFCQDXFVCVMKGHPVFBHBOQ/REPORTAL%20REBRAND/Trees-175x1000.jpg',
       '5': 'https://survey.confirmit.com/isa/DYCQABDXPXAFCQDXFVCVMKGHPVFBHBOQ/REPORTAL%20REBRAND/Buildings-175x1000.jpg',
       '6': 'https://survey.confirmit.com/isa/DYCQABDXPXAFCQDXFVCVMKGHPVFBHBOQ/REPORTAL%20REBRAND/Multi-175x1000.jpg'
      },
              
      //MR: Property below should not be used anymore
      FileFolder: '/isa/BDJPFRDMEYBPBKLVADAYFQCDAVIOEQJR/HayGroup_Banners/' // Pointing to US server
    };
  
  	//Welcome page settings
  	static var WelcomePage = {
      //Bubble image path
      //BubbleImagePath: '/isa/DYCQABDXPXAFCQDXFVCVMKGHPVFBHBOQ/HayGroup_ReportTemplate/WelcomeImage350.png', //US SERVER
      BubbleImagePath: '/isa/AAJQAQPHABIRFIKAERKQOVDREIIXJHMV/HayGroup_ReportTemplate/WelcomeImage350.png', //EURO & GER SERVER
      
      //User Guide
      UserGuide: {Enabled: true},
      
      //Hiding/showing of role-specific text
      ShowRoleSpecificText: true
    };
  
  	// Contact Info (for Welcome Page)
	static var Contact = {Email: 'youremail@here.com'};
  
    //======================================================================================================================================================
  
  	//External Norms (References to benchmark set IDs in the Norms database)
    static var Norms = {
          Codes: ['AllCompany_A_16TO18_Avg','USA_A_16TO18_P75','G25_A_16TO18_Avg','NORAM_X9001_A_16TO18_P90','GBR_G402_A_16TO18_P90']
    }; 
  
  	//Comparator settings
  	static var Comps = {
      	Guide: {
          Enabled: true,
          UseInternalHeadersFromHierarchy: true, //controls if the header for internal comparators are taken based on the label on Filters&Comparators page, 
          										  //or based on the headers in tables (which reflect the name of unit, which is compared to your current level). 
          										  //True means that it will be based on the unit names
          Descriptions: [ //Commenting out options here will hide them in the comparator guide
            GuideIterations.Trend1,
            GuideIterations.Trend2,
            GuideIterations.Trend3,
            GuideIterations.Internal1,
            GuideIterations.Internal2,
            GuideIterations.Internal3,
            GuideIterations.Internal4,
            GuideIterations.Internal5,
            GuideIterations.Norm1,
            GuideIterations.Norm2,
            GuideIterations.Norm3,
            GuideIterations.Norm4,
            GuideIterations.Norm5
          ]
        },
		MaxConcurrentCount: 5,
      
      	// Internal count excludes historical comparators
      	// Range = 0-5
        Internal: {
          Count: 5 // 1: Top, 2: Parent, 3: Level 2, 4: Custom1, 5: Custom2
        },
      
      	DefaultValues: {
			// 'norm1', 'norm2', 'norm3', 'norm4', 'norm5'
			External: [ 'norm1', 'norm2' ],
          
			// Comparators.Prev, Comparators.Prev2, Comparators.Prev3, Comparators.TotalCompany, 
          	//Comparators.LevelUp, Comparators.Level2, Comparators.Custom1, Comparators.Custom2
			Internal: [ Comparators.Prev, Comparators.TotalCompany ] 
		}
    };
  	
  	//======================================================================================================================================================
  
  	//Default options for demos, filters and dashboard
    static var Default = {
      
      	Filters: ['Segment_EEF','intenttostay','Gender','Country','Region','Graduate','Disability','White_Blue_Collar',
                  'Band','Manager','Occupation','Ethnicity','exemptnon','unionnon','wage_status','Age','Worker','Tenure',
                  'FullTime','Expat','Headquarters','job_function','performance_rating','Site'],
      
      	Demographics: ['Orgcode', 'Segment_EEF','intenttostay','Gender','Country','Region','Graduate',
                       'Disability','White_Blue_Collar','Band','Manager','Occupation','Ethnicity','exemptnon',
                       'unionnon','wage_status','Age','Worker','Tenure','FullTime','Expat','Headquarters',
                       'job_function','performance_rating','Site'],
      
		Dashboard: [
  			CustomWidget.ResponseRate,
			CustomWidget.EE,
  			CustomWidget.Tier1,
          	CustomWidget.EffectivenessProfile,
            CustomWidget.TopDimensions,
            CustomWidget.QuestionTrend,
            CustomWidget.InternalComparison,
            CustomWidget.ExternalComparison,
            CustomWidget.KeyDrivers,
			CustomWidget.TopCommentThemes,
            CustomWidget.Strengths,
            CustomWidget.Opportunities,
			CustomWidget.ENPS
        ]
    };
  
  	// Role Specific Filters
    // HayGroupUser - HGU
    // ExecUser (Manager) - M
    // StandardUser - SU
    // PowerUser - PU
    // Custom Role 1 - C1
    // Custom Role 1 - C2
  	static var Roles = {
      /* Example setup for specific demographics/filters by role
          StandardUser: {
            Filters: ['Special_Requests','Work_State','Employee_Class','Leader_Profile','Job_Family','Tenure','Age','Flexible_Working','Gender','segment_eef'],
            Demographics: ['Work_State', 'Gender', 'Age', 'Employee_Class', 'Leader_Profile', 'Job_Family', 'Tenure', 'Flexible_Working', 'segment_eef', 'Special_Requests'],
            Dashboard:  Config.Default.Dashboard,
            VirtualUnits: {Enabled: false} 
      	  }
	  */
      HayGroupUser: {
          Filters:  Config.Default.Filters, 
          Demographics:  Config.Default.Demographics,
          Dashboard:  Config.Default.Dashboard,
          VirtualUnits: {Enabled: true}
      },
      PowerUser: {
          Filters:  Config.Default.Filters, 
          Demographics:  Config.Default.Demographics,
          Dashboard:  Config.Default.Dashboard,
          VirtualUnits: {Enabled: true}
      },
      StandardUser: {
          Filters:  Config.Default.Filters, 
          Demographics:  Config.Default.Demographics,
          Dashboard:  Config.Default.Dashboard,
          VirtualUnits: {Enabled: true}
      },
      ExecUser: {
          Filters:  Config.Default.Filters, 
          Demographics:  Config.Default.Demographics,
          Dashboard:  Config.Default.Dashboard,
          VirtualUnits: {Enabled: false}
      },
      Custom1: {
          Filters:  Config.Default.Filters, 
          Demographics:  Config.Default.Demographics,
          Dashboard:  Config.Default.Dashboard,
          VirtualUnits: {Enabled: false}
      },
      Custom2: {
          Filters: Config.Default.Filters,
          Demographics:  Config.Default.Demographics,
          Dashboard:  Config.Default.Dashboard,
          VirtualUnits: {Enabled: false} 
      }
  	};
  
  	//Update for Demographic Variables that should only be available in a subset of the hierarchy
    //These demographics will only be availble if the active node is at the specified NodeId or below. 
    //NOTE: Variable Ids are CASE SENSITIVE
    static var DemographicHierarchyAccess = {
     //   'Age': ['201000'],
     //   'Gender': ['201000', '651000']
	};
  
  	//======================================================================================================================================================
  
  	//Dimensions & Questions  -- The Dimension ID is used as a lookup to get to the correct label/translation.
	//Example:  
    //{ Id:'DIM_TEST1', Questions: ['OM12', 'OM01', 'OS02', 'OM06', 'OM11'],Tier:1} ,
    //{ Id:'DIM_TEST2', Questions: ['WE08', 'WE12', 'JS05', 'JS02'],SuppressScoring:true}
	static var Dimensions = [
      //{ Id:'DIM_ENG', Questions: [ 'OM12', /* 'OM01' ,*/ 'OS02', 'OM06', 'OM11'], Tier:2 } ,
      	{ Id:'DIM_ENG', Questions: ['OM11','OM12','OM01','OM06'],Tier:2},
        { Id:'DIM_ENA', Questions: ['WE08','WE12','JS05','JS02'],Tier:2},
		{ Id:'DIM_N51', Questions: ['SD03','SD04','SD05','GP07'],Tier:1}, //Clear and promising direction
		{ Id:'DIM_N53', Questions: ['SD05','GP12','LD04','LD09'],Tier:1}, //Confidence in leaders
        { Id:'DIM_N50', Questions: ['IV04','DM02','VC04'],Tier:2},
        { Id:'DIM_N61', Questions: ['PE03','PE06','PE09','CP14'],Tier:2},
        { Id:'DIM_N52', Questions: ['GP09','TW06','TW04'],Tier:2},
        { Id:'DIM_N65', Questions: ['GP10','WL01','ER01','RC01'],Tier:2},
        { Id:'DIM_N67', Questions: ['ST01','IV02','WE01'],Tier:2},
        { Id:'DIM_N64', Questions: ['WS03','DC11','RE01'],Tier:2},
        { Id:'DIM_N63', Questions: ['QS02','QS01','QS03','QS16','OS02'],Tier:2},
        { Id:'DIM_N66', Questions: ['TR01','TR09','TR04'],Tier:2},
        { Id:'DIM_N54', Questions: ['AV15','AV09','SP12'],Tier:2},
        { Id:'DIM_N60', Questions: ['CP11','CP12','BN01'],Tier:2},
      	{ Id:'DIM_ENPS', Questions: ['NP01'], SuppressScoring:false,Tier:2}
  	];  

    //Local Questions
    static var LocalDimensions = [
        { Id:'DIM_C16', Questions: ['CQ50','CQ51','CQ52','CQ53'], NodeIds: null /*setting this to null should make it show those questions to everyone*/, Tier:1} ,
        { Id:'DIM_C17', Questions: ['CQ54','CQ55','CQ56','CQ57'], NodeIds: ['1001'] , Tier:2},
        { Id:'DIM_C18', Questions: ['CQ58','CQ59','CQ60','CQ61'], NodeIds: ['1000', '1001'], SuppressScoring:true , Tier:2}
    ];
  	
  	//New Global Questions and Dimensions Option
  	//'ExcludeSuppressedFromDimensionCalculations' allows you to make all the dimensions based on the non-suppressed questions only
  	static var GlobalQsAndDimsSettings = {
      	ExcludeSuppressedFromDimensionCalculations: false
  	};
  
  	//New GRID lookup
    //If a question is a part of a grid - set the Id to the id of GRID question and add the quetion to Qs array
    //If a question is NOT a part of a grid (e.g. OM06 or NP01) - set only the Id for it and set Qs array to null
    //Order is very important here, it must match perfectly with what's in the survey
    static var QuestionsGridStructure = [
              {Id: 'GRID1', Qs: ['SD03',	'SD04',	'SD05',	'GP07',	'GP12',	'LD04',	'LD09',	'IV04',	
                   'DM02',	'VC04',	'PE03',	'PE06',	'PE09',	'CP14',	'GP09',	'TW06',	
                   'TW04',	'GP10',	'WL01',	'ER01',	'RC01',	'ST01',	'IV02',	'WE01',	
                   'WS03',	'DC11',	'RE01',	'QS02',	'QS01',	'QS03',	'QS16',	'TR01',	
                   'TR09',	'TR04',	'AV15',	'AV09',	'SP12',	'CP11',	'CP12',	'BN01',	
                   'WE08',	'WE12',	'JS05',	'JS02',	'OM11',	'OM12',	'OS02',	'OM01',	
                   'CQ50',	'CQ51',	'CQ52',	'CQ53',	'CQ54',	'CQ55',	'CQ56',	'CQ57',	
                   'CQ58',	'CQ59',	'CQ60',	'CQ61'], NumberOfAnswers: 6},
              {Id: 'OM06', Qs:null, NumberOfAnswers: 4},
              {Id: 'NP01', Qs:null, NumberOfAnswers: 11}
    ];
  
  	// Comments Questions
    static var Comments = {
      Questions: [{Id:'Comm1', NodeIds: null /*['1001']*/},
                  {Id:'Comm2', NodeIds: null/*['1002']*/}, 
                  {Id:'Comm3', NodeIds: null/*['1001','1048']*/}],
      UseVerbatimComponent: false, // if false show typical view which has a HitList component. This limits response text to 4K characters 
      IncludeThemesInCommentsTable: true //controls inclusion/exclusion comment themes next to the actual comment in comments table
    };
  
  	// Non-standard questions 
	static var NSQ = ['CQ62', 'WE12'];
  
    // Ranking questions
    static var RankingQuestions = [];
	
  	// Employee Net Promoter (ENPS) Settings
    static var ENPS = {
      Enabled: true,
      VariableId: 'NP01'
    };
  	
  	//Scales function
  	static function GetDistributionIndexes_Singles (qid) {
		switch (qid) {

			// Questions with non-standard scales
			case 'OM06':
				return { Fav:[3], Neu:[2], Unfav:[0,1], TopBox: 3};  
				break;
            
			//ENPS EXAMPLE
			case 'NP01':
				return { Fav:[9,10], Neu:[7,8], Unfav:[0,1,2,3,4,5,6], TopBox: 10};  
				break;
            
			// Negatively worded questions (reverse scale)
			/*case 'XXXX':
				return { Fav:[3,4], Neu:[2], Unfav:[0,1], TopBox: 4};    
				break;
			*/

		  // Default recoding  (normal scale)
		  default:
			return { Fav:[0,1], Neu:[2], Unfav:[3,4], TopBox: 0};  
		}
    };
  	
  	//Scoring
    static var Scoring = {
      Variables: {
        ExcludeDimensionScoring: [] // list of question ID references
      }
    };
  
  	// Norm overrides
  	/* EXAMPLE  
        'AV09': 'AV09',
        'CQ51': 'AV09'
	*/
    static var Maps = {
      QuestionIdToNormVariableId: {}
    };
  
  	//======================================================================================================================================================
  
  	// Summary Page settings  
    static var Summary = {
          ResponseRate: {Enabled: true},
          Dimensions: ['DIM_ENG','DIM_ENA','DIM_N53','DIM_N61','DIM_N52'],  // Max 5 dimensions
          Widget: CustomWidget.EffectivenessProfile  
    }; 
  	
  	// Widgets
    static var Widgets = {
		TopThemes: {
          VariableId: 'Comm1',
		  ExcludeLastTheme: false // If "OTHER" is the last option in the Theme list and you want this excluded from the widget, set this value to true.
        },
		Strengths: 3,
	    Opportunities: 3,
      	ExternalComparisonNormNumber: 0 //MR - Values: 0-4. Controls which norm is used in the External Comparison widget

    };
  	
  	//Results Sorting Tool
    static var ResultsSortingTool = {
      //Comment out whatever you don't need in your project - it will get hidden on RST page
      //It is also connected to RST iterations for PPT and PDF by default (can be overriden)
      SortingOptions:[
      			SortBy.Strengths, 
				SortBy.Opportunities,
				SortBy.KeyDriversEngagement,
				SortBy.KeyDriversEnablement,
				SortBy.AllVsPrevious,
				SortBy.AllVsPrevious2,
				SortBy.AllVsPrevious3,
				SortBy.AllVsInternal, 
				SortBy.AllVsLevelUp,
              	SortBy.AllVsLevel2,
                SortBy.AllVsCustom1,
                SortBy.AllVsCustom2,
        		SortBy.AllVsExternal + '_' + 0,
        		SortBy.AllVsExternal + '_' + 1,
        		SortBy.AllVsExternal + '_' + 2,
        		SortBy.AllVsExternal + '_' + 3,
        		SortBy.AllVsExternal + '_' + 4,
              	SortBy.FullQFav,
              	SortBy.FullQNeutral,
              	SortBy.FullQUnfav,
				SortBy.TopFav, 
				SortBy.BottomFav, 
				SortBy.TopUnfav, 
				SortBy.BottomUnfav,
        		SortBy.TopNeutral,
				SortBy.TopImproved, 
				SortBy.TopDeclined,
				SortBy.TopVsInternal, 
				SortBy.BottomVsInternal, 
				SortBy.TopVsLevelUp, 
				SortBy.BottomVsLevelUp,
              	SortBy.TopVsLevel2,
              	SortBy.BottomVsLevel2,
              	SortBy.TopVsCustom1,
              	SortBy.BottomVsCustom1,
              	SortBy.TopVsCustom2,
              	SortBy.BottomVsCustom2
      ],
      
      //Indicate how many questions do you want to display for options on the RST page
      //Controls the amount of Strengths/Opportunities as well as all Top X/ Bottom X sorting options
      TopAmount: 10
  	};
  
  	// Internal Benchmark Tool
    static var InternalBenchmarkTool = {
      MaxColumnCount: 7,
      ExcelMaxColumnCount: 7
    };
  
  	// Action Planning
    static var ActionPlanning = {
      Strengths: 5,
      Opportunities: 5,
	  LocalDimensions: {
			Enabled: true,
			Searchable: true
	  }
    };
  
  	//EEF Gap Analysis
  	static var EEFGap = {
      HideEE: false //Allows you to hide all Engagement and Enablement items (both dimensions and questions) from EEF Gap page
    };
  
  	//======================================================================================================================================================
	
  	//Wildcard replacements
    //Format:
    //	[TEXT TO BE REPLACED] : {DataSource: [ID OF THE DATA SOURCE (ds0/ds_res)], ReplacementText: '[QUESTION ID.ANSWER ID]'}
    //
    //Example usage - replaces all occurrences of ^ClientName()^ in questions with 
    //text taken out of ClientName answer in CustomTexts question in the main survey (ds0):
    //	'^ClientName()^'  : {DataSource: 'ds0', ReplacementText: 'CustomTexts.ClientName'}
    //
    static var WildCardReplacement = {
      '^ClientName()^'  : {DataSource: 'ds0', ReplacementText: 'CustomTexts.ClientName'},
      '^ClientName2()^'  : {DataSource: 'ds0', ReplacementText: 'CustomTexts.ClientName'},
      '^change()^'  : {DataSource: 'ds0', ReplacementText: 'CustomTexts.change'},
      '^change2()^'  : {DataSource: 'ds0', ReplacementText: 'CustomTexts.change2'}
    };
  
  	// For S&O scoring algorithm
	static var Algorithm = {
		KeyDriverMultiplier: 1.0,
      	NormUsed: 0, //MR - 0-4, depending on the norm that should be used for S&O algorithm
      	ExcludedQuestions: [] //Allows to exclude some questions from S&O algoritm. Example setup: ['SD03', 'CP14', 'TW06' ,'OM06']
	}
        
    // Calculation Framework: Significance Testing 
  	static var SigTest = {
      	Threshold: 1.96,
		BackgroundColor: {Enabled: true},
		Suffix: ' *'
	}
  	
    //======================================================================================================================================================
  	//--------------------------------------------------------------------------- 																		   *
    //All stuff we're not configuring on a daily basis goes below: 																						   *
    //--------------------------------------------------------------------------- 																		   *
    //======================================================================================================================================================
    //Link to the ExportSettings class
    static var Export = ExportSettings.Export;
    static var ExportNSQComparator = ExportSettings.ExportNSQComparator;
      
    //If set to true the export table on welcome page will be visible
    static var HighVolumeExportsEnabled = false;

  	static var Help = {
      Enabled: true, 
      Url: 'https://kornferry.sharepoint.com/sites/InsightDP/ProductDev/ReportalInfo/_layouts/15/start.aspx#/Reportal%20Guide',
      FileExtension: 'aspx'
  	};

  	//static var ThirdPartyIncludeFileFolder = '/isa/DYCQABDXPXAFCQDXFVCVMKGHPVFBHBOQ/INCLUDE/';  //US Server   
  	static var ThirdPartyIncludeFileFolder = '/isa/AAJQAQPHABIRFIKAERKQOVDREIIXJHMV/INCLUDE/';  //EURO Server 
   
	// Do not change
    static var Caching = {Enabled: true, T0Caching: false};

  	// Server settings (will be different for US and Euro environments)
  	//static var Server = { SurveyUrl: 'https://survey.confirmit.com' }; //US Server
	static var Server = { SurveyUrl: 'https://survey.euro.confirmit.com' }; //EURO Server
  	
  	//static var FileFolder = '/isa/DYCQABDXPXAFCQDXFVCVMKGHPVFBHBOQ/HayGroup_ReportTemplate/'; //US Server
    static var FileFolder = '/isa/AAJQAQPHABIRFIKAERKQOVDREIIXJHMV/HayGroup_ReportTemplate/'; //EURO Server

  	// Client
    static var Client = {
      Name: 'ABC Corporation'
    };

  	//Effectiveness Profile
  	static var EffectivenessProfile = {
      VariableId: 'Segment_EEF'
  	};

    // Menu
    static var Menu = {
      BackgroundColor: '#919191' 
    };

  	// Toolbox
    static var Toolbox = {
      BackgroundColor: '#DDDFED' 
    };
  
  	// Button
    static var Button = {
      BackgroundColor: '#17B0B6'
    };

    //Returns a simple array containing all ids of comment questions for a particular level
    //in following format: ['ID1', 'ID2']
    static function GetCommentQuestionIdsByNodeId(nodeId, confirmitFacade){
      var questions = Comments.Questions;
      var outputArray = [];
      for(var i=0; i<questions.length; i++){
          var commentQ = questions[i];
        
          //Check if this particular question should be visible for this particular node id
          if(commentQ.NodeIds == null || commentQ.NodeIds == 'undefined' || commentQ.NodeIds.length == 0){
              //If not specified - assume it should be visible
              outputArray.push(commentQ.Id);
          }
          else{
              //If specified - check if we should get direct/indirect access based on mapping
              var nodes = commentQ.NodeIds;
              for(var j=0; j<nodes.length; j++){
                  if (HelperUtil.IsChildOf(nodeId, nodes[j], confirmitFacade)){
                      outputArray.push(commentQ.Id);    
                      break;
                  }
              }
          } 	
      }
      
      return outputArray;
    }
  	
    static function GetLocalDimensionsByNodeId ( node_id, confirmit ) {
      var o = [];
      for (var i=0; i<LocalDimensions.length; ++i) {
          var dimension = LocalDimensions[i];
          if ( dimension.NodeIds == null || dimension.NodeIds == 'undefined' ) 
            o.push ( dimension );
          else {
             var node_ids = dimension.NodeIds;
             for (var j=0; j<node_ids.length; ++j)
               if (HelperUtil.IsChildOf ( node_id, node_ids[j], confirmit )){
                 o.push ( dimension );    
                 break;
               }
          }
      }
      return o;
    }
 
    // Color and Branding
    // Note this is only partially used throughout the report, a lot of colors are hard-coded based on later specs
    static public var Colors = {
      DefaultColor: '#1570a6',  
      Green1: '#0FAF4B',
      Green2: '#82c341',
      Green3: '#82c341',
      GreenAlternative: '#8DC444',
      Blue1: '#0073BE',
      Blue2: '#00B4EB',
      Blue3: '#00B7F1',
      BlueAlternative: '#1B91CE',
      Purple1: '#913291',
      Purple2: '#D73C96',
      Orange1: '#F03223',
      Orange2: '#F56E23',
      Orange3: '#F99B1E',
      OrangeAlternative: '#F79B23',
      DarkGrey1: '#1E2328',
      DarkGrey2: '#323C41',
      LightGrey1: '#AFB4B4',
      LightGrey2: '#E6E6E6',
      LightGreyAlternative: '#d9dbd9',
      Red: '#DB2032',
      Red3: '#F03223'
    };
   
    // Misc settings
    static var Breadcrumbs = {Enabled: true};
  
  	// DO NOT CHANGE ----------------------------------------
  	//ORDER OF DEMOS HERE HAS TO MATCH WITH WHAT'S IN THE NORMS DB (DUE TO THE KEY FOR SERIALIZED DATA)
	static var NormDemos  = [
      'Occupation',
      'Tenure',
      'Gender',
      'Age',
      'ExemptNon',
      'UnionNon',
      'Job_Function',
      'Segment_EEF',
      'FullTime',
      'Expat',
      'Headquarters',
      'Performance_Rating',
      'Wage_Status',
      'Worker',
      'IntentToStay',
      'EthnicityUS',
      'EthnicityUK',
      'LGBTMember'
    ];
}