//This class only contains configuration options for export packages
class ExportSettings{
  static var ExportNSQComparator = {
      Questions: Config.NSQ, //DO NOT EVER CHANGE!
      RowsPerPage: 8,
      ExportAs: 'diff' //'abs' for absolute, 'diff' for difference
  }
  
  static var Export = {
      // PDF settings
      PDF: {
                
          // B/W
          OptimizeForBlackAndWhitePrinting: false,
  		
          // Dashboard
       	  // PLEASE USE VALUES WHERE
          // (NUMBER % 3) == 0
          Dashboard: {
            MaxWidgetsPerPage: 9
          },
        
          // Questions Summary
          // PLEASE COMMENT OUT ONLY ONE PAGINGTYPE OPTION BELOW
          Summary: {
              MaxRowsPerPage: 17,
              //PagingType: PrintQSummary.DimensionOnNewPage
			  PagingType: PrintQSummary.DimensionHeaderCantBeLastLine
			  //PagingType: PrintQSummary.WholeDimensionsPerPage
			  //PagingType: PrintQSummary.ForcingSwitchedOff
          },
          
          // Survey Dimensions
          SurveyDims: {
            MaxRowsPerPage: 22
          },
  
          // Results Sorting Tool
          ResultsSortingTool:{
              MaxRowsPerPage: 15,
              Iterations: [
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
              ]
          },
  
          // Internal Benchmark Tool
          InternalBenchmarkTool: {
              MaxRowsPerPage: { Questions: 12, Dimensions: 17 },
              Iterations: [
  
                  // Usage
                  // {
                  //  Rows: "1" = All Dimensions | "2" = All Questions | "3" = All Questions Ordered By Dimension | <dimension_id> for specific dimension
                  //  BreakBy: [ <demographic_qid1>, ..., <demographic_qidn> ], example: ["Work_State", "Age"]
                  //  Metric: "fav" | "unfav",
                  //  DisplayCompsAs: "abs" | "diff"
                  // }
  
  
                  // Iteration #1
                  {
                      Rows: "1",
                      BreakBy: ["Orgcode"],
                      Metric: "fav",
                      DisplayCompsAs: "abs"
                  },
  
                  // Iteration #2
                  {
                      Rows: "2",
                      BreakBy: ["Orgcode"],
                      Metric: "fav",
                      DisplayCompsAs: "abs"
                  },
  
                  // Iteration #3
                  {
                      Rows: "3",
                      BreakBy: ["Orgcode"],
                      Metric: "fav",
                      DisplayCompsAs: "abs"
                  },
                
                // Iteration #4
                  {
                      Rows: "DIM_N63",
                      BreakBy: ["Orgcode"],
                      Metric: "fav",
                      DisplayCompsAs: "abs"
                  }
              ]
          },
        	
          // NSQ Benchmark Tool
          NSQIBT:
          {
              MaxRowsPerPage: 22,
              Iterations: [
              	  // Usage
                  // {
                  //  Question: specific NSQ question you'd want to export, example: "CQ62"
                  //  BreakBy: [ <demographic_qid1>, ..., <demographic_qidn> ], example: ["Work_State", "Age"]
                  //  DisplayCompsAs: "abs" | "diff"
                  // }
  
  
                  // Iteration #1
                  {
                      Question: "CQ62",
                      BreakBy: ["Orgcode"],
                      DisplayCompsAs: "abs"
                  },
                  {
                      Question: "WE12",
                      BreakBy: ["Orgcode", "Segment_EEF", "Country"],
                      DisplayCompsAs: "abs"
                  }
              ]
          }
      },
  	
      // PowerPoint settings
      PowerPoint: {
          TableSettings: {
              HideBarChart: false,
              HideNeutral: false,
              HideUnfavorable: false
          },
  		  
          // Questions Summary
          // PLEASE COMMENT OUT ONLY ONE PAGINGTYPE OPTION BELOW
          Summary: {
              MaxRowsPerPage: 9,
              //PagingType: PrintQSummary.DimensionOnNewPage
			  PagingType: PrintQSummary.DimensionHeaderCantBeLastLine
			  //PagingType: PrintQSummary.WholeDimensionsPerPage
			  //PagingType: PrintQSummary.ForcingSwitchedOff
          },
          
          // Survey Dimensions
          SurveyDims: {
            MaxRowsPerPage: 8
          },
          
          // Results Sorting Tool
          ResultsSortingTool:{
              MaxRowsPerPage: 10,
              Iterations: [
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
              ]
          },
  
          // Internal Benchmark Tool
          InternalBenchmarkTool: {
              MaxRowsPerPage: { Questions: 10, Dimensions: 12 },
              Iterations: [
  
                  // Usage
                  // {
                  //  Rows: "1" = All Dimensions | "2" = All Questions | "3" = All Questions Ordered By Dimension | <dimension_id> for specific dimension
                  //  BreakBy: [ <demographic_qid1>, ..., <demographic_qidn> ], example: ["Work_State", "Age"]
                  //  Metric: "fav" | "unfav",
                  //  DisplayCompsAs: "abs" | "diff"
                  // }
  
  
                  // Iteration #1
                  {
                      Rows: "1",
                      BreakBy: ["Orgcode"],
                      Metric: "fav",
                      DisplayCompsAs: "abs"
                  },
  
                  // Iteration #2
                  {
                      Rows: "2",
                      BreakBy: ["Orgcode"],
                      Metric: "fav",
                      DisplayCompsAs: "abs"
                  },
  
                  // Iteration #3
                  {
                      Rows: "3",
                      BreakBy: ["Orgcode"],
                      Metric: "fav",
                      DisplayCompsAs: "abs"
                  },
                
                // Iteration #4
                  {
                      Rows: "DIM_N63",
                      BreakBy: ["Orgcode"],
                      Metric: "fav",
                      DisplayCompsAs: "abs"
                  }
              ]
          },
          
          // NSQ Benchmark Tool
          NSQIBT:
          {
              MaxRowsPerPage: 8,
              Iterations: [
              	  // Usage
                  // {
                  //  Question: specific NSQ question you'd want to export, example: "CQ62"
                  //  BreakBy: [ <demographic_qid1>, ..., <demographic_qidn> ], example: ["Work_State", "Age"]
                  //  DisplayCompsAs: "abs" | "diff"
                  // }
  
  
                  // Iteration #1
                  {
                      Question: "CQ62",
                      BreakBy: ["Orgcode"],
                      DisplayCompsAs: "abs"
                  },
                  {
                      Question: "WE12",
                      BreakBy: ["Orgcode", "Segment_EEF", "Country"],
                      DisplayCompsAs: "abs"
                  }
              ]
          }
      },
	      
      Excel: {
		  
          // Results Sorting Tool
          ResultsSortingTool:{
              MaxRowsPerPage: 1000,
              Iterations: [
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
              ]
          },
                
          // Internal Benchmark Tool
          InternalBenchmarkTool: {
              MaxRowsPerPage: { Questions: 1000, Dimensions: 1000 },
              Iterations: [
  
                  // Usage
                  // {
                  //  Rows: "1" = All Dimensions | "2" = All Questions | "3" = All Questions Ordered By Dimension | <dimension_id> for specific dimension
                  //  BreakBy: [ <demographic_qid1>, ..., <demographic_qidn> ], example: ["Work_State", "Age"]
                  //  Metric: "fav" | "unfav",
                  //  DisplayCompsAs: "abs" | "diff"
                  // }
  
  
                  // Iteration #1
                  {
                      Rows: "1",
                      BreakBy: ["Orgcode"],
                      Metric: "fav",
                      DisplayCompsAs: "abs"
                  },
  
                  // Iteration #2
                  {
                      Rows: "2",
                      BreakBy: ["Orgcode"],
                      Metric: "fav",
                      DisplayCompsAs: "abs"
                  },
  
                  // Iteration #3
                  {
                      Rows: "3",
                      BreakBy: ["Orgcode"],
                      Metric: "fav",
                      DisplayCompsAs: "abs"
                  },
                
                // Iteration #4
                  {
                      Rows: "DIM_N63",
                      BreakBy: ["Orgcode"],
                      Metric: "fav",
                      DisplayCompsAs: "abs"
                  }
              ]
          },
          
          // NSQ Benchmark Tool
          NSQIBT:
          {
              MaxRowsPerPage: 1000,
              Iterations: [
              	  // Usage
                  // {
                  //  Question: specific NSQ question you'd want to export, example: "CQ62"
                  //  BreakBy: [ <demographic_qid1>, ..., <demographic_qidn> ], example: ["Work_State", "Age"]
                  //  DisplayCompsAs: "abs" | "diff"
                  // }
  
  
                  // Iteration #1
                  {
                      Question: "CQ62",
                      BreakBy: ["Orgcode"],
                      DisplayCompsAs: "abs"
                  },
                  {
                      Question: "WE12",
                      BreakBy: ["Orgcode", "Segment_EEF", "Country"],
                      DisplayCompsAs: "abs"
                  }
              ]
          }
      }
    };
}