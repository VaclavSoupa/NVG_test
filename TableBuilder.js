// CLASS TableBuilder : 53
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// public FUNCTION TableBuilder : 67
// public static FUNCTION AssocArrayContainsTrue : 78
// private FUNCTION GetStandardHeaderConfig : 89
// private FUNCTION AddStandardColumnHeaders : 140
// private FUNCTION AddStandardDimensionRow : 417
// private FUNCTION AddStandardQuestionRow : 564
// private FUNCTION AddChartColumnHeaders : 709
// private FUNCTION AddChartDimensionRow : 848
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// public FUNCTION GenerateEEMainForChart : 955
// public FUNCTION GenerateTier1ForChart : 984
// public FUNCTION GenerateKDA : 1013
// private FUNCTION AddKDAColumnHeaders : 1091
// private FUNCTION AddKDAQuestionRow : 1330
// public FUNCTION GenerateEEDetails : 1468
// public FUNCTION GenerateEEFGap : 1504
// public FUNCTION GenerateQuestionSummary : 1645
// public FUNCTION GenerateSurveyDimensions : 1675
// public FUNCTION GenerateLocalQuestions : 1702
// public FUNCTION GenerateRST : 1735
// public FUNCTION GenerateIBT : 1770
// private FUNCTION AddIBTColumnHeaders : 1793
// private FUNCTION AddIBTRows : 1850
// private FUNCTION AddIBTDimensionRow : 1917
// private FUNCTION AddIBTQuestionRow : 1972
// public FUNCTION GeneratePlotYourResults : 2035
// public FUNCTION GenerateNSQComparator : 2159
// private FUNCTION AddNSQComparatorHeaders : 2225
// private FUNCTION AddNSQComparatorPrecodeRow : 2513
// public FUNCTION GenerateNSQIBT : 2637
// private FUNCTION AddNSQIBTColumnHeaders : 2661
// private FUNCTION AddNSQIBTPrecode : 2718
// public FUNCTION GenerateDimensionDetails : 2768
// private FUNCTION AddDimDetailsHeaders : 2821
// private FUNCTION AddDimDetailsRow : 3088
// public FUNCTION GenerateQuestionByDimension : 3243
// public FUNCTION GenerateQuestionDetails : 3276
// private FUNCTION AddQuestionDetailsHeaders : 3333
// private FUNCTION AddQuestionDetailsRow : 3622
// public FUNCTION GenerateENPSGap : 3775
// public FUNCTION GenerateENPSDetails : 3895
// public FUNCTION GenerateLocalQuestionsAll : 4042
// public FUNCTION GeneratePSS : 4082
// private FUNCTION AddPSSOverallHeaders : 4143
// private FUNCTION AddPSSOverallDataRow : 4339
// private FUNCTION AddPSSDemoHeaders : 4473
// private FUNCTION AddPSSDemoDataRow : 4670
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//This class should be able to generate different tables
//that are based on calculated results we get from QueryManager
class TableBuilder{
  	var debug = false; //Setting this to true unhides all of the hidden sigtest columns
  	var m_report : Report = null; //handle to a Report object
  	var m_state : ReportState = null; //handle to a ReportState object
  	var m_user : User = null; //handle to a User object
  	var m_qm = null; //query manager - optional
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Constructor
  	//Params: Report object, ReportState object, User object, optional: query manager
  	//Optional parameter QueryManager can be used in a situation where you already did the calculation and have
  	//access to the QM object and don't want to calculate data from scratch (e.g. in case of Dashboard we put the QM object
  	//into the pageContext so we can later on retreive it for EE table)
  	public function TableBuilder(user : User, report : Report, state : ReportState, queryManager){
  		m_report = report;
      	m_state = state;
      	m_user = user;
      	if(queryManager != null && typeof queryManager != 'undefined')
          m_qm = queryManager;
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Returns true if there's at least one true value in an array
  	public static function AssocArrayContainsTrue(arr){
      	for(var key in arr){
      		if(arr[key] == true)
              return true;
        }
      	return false;
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	  
  	//Returns a config based on: execution mode, comparators selected
  	private function GetStandardHeaderConfig(){
  		var config = {
          Item: true,
          ValidN: true,
          Fav: true,
          Neu: true,
          Unfav: true,
          DistributionChart: true,
          CompsInternal: {"Trend1": true, "Trend2": true, "Trend3": true, "Internal1": true,
                          "Internal2": true, "Internal3": true, "Internal4": true, "Internal5": true},
          CompsExternal: {"Norm1": true, "Norm2": true, "Norm3": true, "Norm4": true, "Norm5": true}
		};

      	//Create a map of internal comps
      	var internal_comparators = ComparatorUtil.ProcessedComparators (m_report, m_state, m_user );
		var comparators_map = {};
		for (var i=0; i<internal_comparators.length; ++i)
            comparators_map [ internal_comparators[i].Code ] = internal_comparators[i];

      	//Set internal comps config vars
      	config.CompsInternal["Trend1"] = !comparators_map[Comparators.Prev].Hidden;
      	config.CompsInternal["Trend2"] = !comparators_map[Comparators.Prev2].Hidden;
      	config.CompsInternal["Trend3"] = !comparators_map[Comparators.Prev3].Hidden;
      	config.CompsInternal["Internal1"] = !comparators_map[Comparators.TotalCompany].Hidden;
      	config.CompsInternal["Internal2"] = !comparators_map[Comparators.LevelUp].Hidden;
      	config.CompsInternal["Internal3"] = !comparators_map[Comparators.Level2].Hidden;
      	config.CompsInternal["Internal4"] = !comparators_map[Comparators.Custom1].Hidden;
      	config.CompsInternal["Internal5"] = !comparators_map[Comparators.Custom2].Hidden;

      	//Get enabled norms
		for (var i=0; i<Config.Norms.Codes.length; ++i) {
			var enabled = ParamUtil.Contains (m_state, 'COMPARATORS_EXTERNAL', 'norm' + (i+1) );
			config.CompsExternal["Norm" + (i+1)] = enabled;
		}

      	//Hide columns based on execution mode (we want to hide stuff for PPTs)
      	if(ExecutionMode.isPowerPoint(m_state)){
          	config.Item = false;
      	  	config.DistributionChart = !Config.Export.PowerPoint.TableSettings.HideBarChart;
          	config.Neu = !Config.Export.PowerPoint.TableSettings.HideNeutral;
          	config.Unfav = !Config.Export.PowerPoint.TableSettings.HideUnfavorable;
        }

      	return config;
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Adds standard column headers to a table based on config provided
  	//Can add following columns: HighlighRowFlag(hidden header), Item, ValidN, Fav, Neu, Unfav, Distribution-chart, Comps/Internal+External comps
  	//Optional parameter (last one) is processedComparators, needed for comparators, can be optained using ComparatorUtil.ProcessedComaprators() function
  	private function AddStandardColumnHeaders(table : Table, config, processedComparators){
		/*config = {
          Item: boolean,
          ValidN: boolean,
          Fav: boolean,
          Neu: boolean,
          Unfav: boolean,
          DistributionChart: boolean,
          CompsInternal: {"Trend1": true, "Trend2": true, "Trend3": true, "Internal1": true,
                          "Internal2": true, "Internal3": true, "Internal4": true, "Internal5": true},
          CompsExternal: {"Norm1": true, "Norm2": true, "Norm3": true, "Norm4": true, "Norm5": true}
		};*/

      	//Get out labels from RT
      	var labels = ResourceText.List(m_report,'labels');
      	var currentLanguage = m_report.CurrentLanguage;

      	//Add highlight row column
        var hC : HeaderContent = new HeaderContent();
        hC.Title = new Label(currentLanguage, 'HighlighRowFlag');
        hC.HideData = true;
      	table.ColumnHeaders.Add(hC);

      	//Item
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['Item']);
      	if(!config.Item){
          hC.HideData = true;
        }
        table.ColumnHeaders.Add(hC);


      	//ValidN
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['ValidN']);
      	if(!config.ValidN){
        	hC.HideData = true;
        }
        table.ColumnHeaders.Add(hC);


      	//Fav
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['PercentFav']);
        hC.HeaderId = 'fav';
      	if(!config.Fav){
          hC.HideData = true;
        }
        table.ColumnHeaders.Add(hC);


      	//Neu
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['PercentNeu']);
        hC.HeaderId = 'neu';
      	if(!config.Neu){
        	hC.HideData = true;
        }
        table.ColumnHeaders.Add(hC);


      	//Unfav
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['PercentUnfav']);
        hC.HeaderId = 'unfav';
      	if(!config.Unfav){
        	hC.HideData = true;
        }
        table.ColumnHeaders.Add(hC);


      	//DistributionChart
        var hChart : HeaderChartCombo = new HeaderChartCombo();
        hChart.Title = new Label(currentLanguage, labels['Distribution']);
        hChart.HeaderId = 'barchart';
      	//Set formulas and colors for the chart
        HelperUtil.UpdateBarChart(m_report, hChart);

      	//In case of PPT or Excel execution mode we want to put another header segment above it due to
      	//some awkward styling
      	if(ExecutionMode.isPowerPoint(m_state) || ExecutionMode.isExcel(m_state)){
          var hSegAboveChart : HeaderSegment = new HeaderSegment();
          hSegAboveChart.DataSourceNodeId = 'ds0';
          hSegAboveChart.Label = new Label(currentLanguage, labels['Distribution']);
          hChart.HideHeader = true;

          if(!config.DistributionChart){
        	hChart.HideData = true;
            hSegAboveChart.HideData = true;
          }
          hSegAboveChart.SubHeaders.Add(hChart);
          table.ColumnHeaders.Add(hSegAboveChart);
      	}
      	else{
          if(!config.DistributionChart){
        	hChart.HideData = true;
          }
      	  table.ColumnHeaders.Add(hChart);
        }


      	//Let's check if we want to add comparator headers at all
      	var addCompsHeaders = (TableBuilder.AssocArrayContainsTrue(config.CompsInternal) || TableBuilder.AssocArrayContainsTrue(config.CompsExternal));

      	if(addCompsHeaders){
          	//Header above all comps
          	var hSegment : HeaderSegment = new HeaderSegment();
          	//we need to set DataSourceNodeId, but we really don't care about having this set
          	//since we're using content headers below this one anyway
          	hSegment.DataSourceNodeId = 'ds0';
          	hSegment.Label = new Label(currentLanguage, labels['FavvsComparator']);

          	//Internal comps
          	// WATCH OUT FOR THE ORDER OF THOSE!!
          	// Create Map of internal Comparators
          	var internal_comparators;
          	if(processedComparators == null){
            	internal_comparators = ComparatorUtil.ProcessedComparators (m_report, m_state, m_user );
            }
          	else{
          		internal_comparators = processedComparators;
            }
			var comparators_map = {};
			for (var i=0; i<internal_comparators.length; ++i)
            	comparators_map [ internal_comparators[i].Code ] = internal_comparators[i];

          	//Trend1
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
           	hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Prev].Label);
            if(!config.CompsInternal["Trend1"]){
              hC.HideData = true;
           	}
            hSegment.SubHeaders.Add(hC);


          	//Trend2
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Prev2].Label);
          	if(!config.CompsInternal["Trend2"]){
              hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Trend3
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Prev3].Label);
          	if(!config.CompsInternal["Trend3"]){
              hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal1
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.TotalCompany].TableLabel);
          	if(!config.CompsInternal["Internal1"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal2
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.LevelUp].TableLabel);
          	if(!config.CompsInternal["Internal2"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal3
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Level2].TableLabel);
          	if(!config.CompsInternal["Internal3"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal4
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Custom1].TableLabel);
          	if(!config.CompsInternal["Internal4"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal5
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Custom2].TableLabel);
          	if(!config.CompsInternal["Internal5"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//External comps
          	var benchmarksetQ = m_report.DataSource.GetProject('ds0').GetQuestion('benchmarkset');
          	for(var i = 0; i<Config.Norms.Codes.length; i++){

                //Sigtest - hidden header used for stat. sig
                hC = new HeaderContent();
                hC.Title = new Label(currentLanguage, 'statsig');
                hC.HideData = !debug;
                hSegment.SubHeaders.Add(hC);

              	//Normal header
              	//Get Norm id
                var normId = NormUtil.GetNormId(m_user, i);
                var normName = benchmarksetQ.GetAnswer(normId).Text + ' ' + labels['norm'];
                hC = new HeaderContent();
                hC.Title = new Label(currentLanguage, normName);
              	if(!config.CompsExternal["Norm" + (i + 1)]){
                	hC.HideData = true;
                }
                hSegment.SubHeaders.Add(hC);
            }

          	//Add all to the table
          	table.ColumnHeaders.Add(hSegment);
        }
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Adds a standard dimension header (can be found e.g. on question summary, question by dimension, local questions pages)
  	//Can add following info: HighlighRowFlag(hidden header), Item, ValidN, Fav, Neu, Unfav, Distribution-chart, Comps/Internal+External comps
  	private function AddStandardDimensionRow(table : Table, config, dimension : HgDimension, titleInHeader){
  		/*config = {
          Item: boolean,
          ValidN: boolean,
          Fav: boolean,
          Neu: boolean,
          Unfav: boolean,
          DistributionChart: boolean,
          CompsInternal: {"Trend1": true, "Trend2": true, "Trend3": true, "Internal1": true,
                          "Internal2": true, "Internal3": true, "Internal4": true, "Internal5": true},
          CompsExternal: {"Norm1": true, "Norm2": true, "Norm3": true, "Norm4": true, "Norm5": true}
		};*/

      	var currentLanguage = m_report.CurrentLanguage;

      	//Add row to the table column
        var hC : HeaderContent = new HeaderContent();
      	if(titleInHeader == null)
          	titleInHeader = false;
      	var headerTitle = titleInHeader ? dimension.GetTitle() : dimension.GetDisplayId();
      	hC.Title = new Label(currentLanguage, headerTitle);

        //Set Highlight row flag
      	var highFlag = titleInHeader && !ExecutionMode.isPowerPoint(m_state)? 0 : 1;
      	hC.SetCellValue(0, highFlag);

      	var currentColumn = 1;
      	//Item
      	if(config.Item){
      		hC.SetCellValue(currentColumn, dimension.GetTitle());
        }
      	currentColumn++;

      	//ValidN
      	//We don't want to show it for dimensions, so we'll put a blank string there
      	if(config.ValidN){
      		hC.SetCellValue(currentColumn, '');
        }
      	currentColumn++;

      	//Get scores out
      	var scores = dimension.GetScores();

      	//Fav
      	if(config.Fav){
      		hC.SetCellValue(currentColumn, scores.fav);
        }
      	currentColumn++;

      	//Neu
      	if(config.Neu){
      		hC.SetCellValue(currentColumn, scores.neu);
        }
        currentColumn++;

      	//Unfav
      	if(config.Unfav){
      		hC.SetCellValue(currentColumn, scores.unfav);
        }
      	currentColumn++;

      	//DistributionChart
      	//We don't need to fill anything for the distribution chart,
      	//but we want to increment currentColumn if it's included
      	currentColumn++;

      	//Let's check if we want to add comparator headers at all
      	//and if yes - add them
      	if(TableBuilder.AssocArrayContainsTrue(config.CompsInternal) || TableBuilder.AssocArrayContainsTrue(config.CompsExternal)){
          	//Internal comps
          	// WATCH OUT FOR THE ORDER OF THOSE!!

          	//Trend1
         	if(config.CompsInternal["Trend1"]){
              	hC.SetCellValue(currentColumn, dimension.internalComps[5].GetStatSigCode());
              	hC.SetCellValue(currentColumn + 1, dimension.internalComps[5].GetDisplayValue(false));

          	}
          	currentColumn = currentColumn + 2;

          	//Trend2
         	if(config.CompsInternal["Trend2"]){
              	hC.SetCellValue(currentColumn, dimension.internalComps[6].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, dimension.internalComps[6].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Trend3
         	if(config.CompsInternal["Trend3"]){
              	hC.SetCellValue(currentColumn, dimension.internalComps[7].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, dimension.internalComps[7].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal1
         	if(config.CompsInternal["Internal1"]){
              	hC.SetCellValue(currentColumn, dimension.internalComps[0].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, dimension.internalComps[0].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal2
         	if(config.CompsInternal["Internal2"]){
              	hC.SetCellValue(currentColumn, dimension.internalComps[1].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, dimension.internalComps[1].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal3
         	if(config.CompsInternal["Internal3"]){
              	hC.SetCellValue(currentColumn, dimension.internalComps[2].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, dimension.internalComps[2].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal4
         	if(config.CompsInternal["Internal4"]){
              	hC.SetCellValue(currentColumn, dimension.internalComps[3].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, dimension.internalComps[3].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal5
         	if(config.CompsInternal["Internal5"]){
              	hC.SetCellValue(currentColumn, dimension.internalComps[4].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, dimension.internalComps[4].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//External comps
          	for(var i = 0; i<Config.Norms.Codes.length; i++){
              	if(config.CompsExternal["Norm" + (i + 1)]){
              		hC.SetCellValue(currentColumn, dimension.norms[i].GetStatSigCode());
          			hC.SetCellValue(currentColumn + 1, dimension.norms[i].GetDisplayValue(false));
                }
              	currentColumn = currentColumn + 2;
            }
        }

      	//Add row to the table
      	table.RowHeaders.Add(hC);
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Adds standard question row header to a table including data based on config provided
  	//Can add following information: HighlighRowFlag(hidden header), Item, ValidN, Fav, Neu, Unfav, Distribution-chart, Comps/Internal+External comps
  	private function AddStandardQuestionRow(table : Table, config, question : HgQuestion, titleInHeader){
  		/*config = {
          Item: boolean,
          ValidN: boolean,
          Fav: boolean,
          Neu: boolean,
          Unfav: boolean,
          DistributionChart: boolean,
          CompsInternal: {"Trend1": true, "Trend2": true, "Trend3": true, "Internal1": true,
                          "Internal2": true, "Internal3": true, "Internal4": true, "Internal5": true},
          CompsExternal: {"Norm1": true, "Norm2": true, "Norm3": true, "Norm4": true, "Norm5": true}
		};*/

      	var currentLanguage = m_report.CurrentLanguage;

      	//Add row to the table column
        var hC : HeaderContent = new HeaderContent();
      	if(titleInHeader == null)
          	titleInHeader = false;
      	var headerTitle = titleInHeader ? question.GetDisplayId() + ' ' + question.text : question.GetDisplayId();
      	hC.Title = new Label(currentLanguage, headerTitle);

        //Set Highlight row flag
      	hC.SetCellValue(0, 0);

      	var currentColumn = 1;
      	//Item
      	if(config.Item){
      		hC.SetCellValue(currentColumn, question.text);
        }
      	currentColumn++;

      	//ValidN
      	if(config.ValidN){
      		hC.SetCellValue(currentColumn, question.tableValidN);
        }
      	currentColumn++;

      	//Get scores out
      	var scores = question.GetScores();

      	//Fav
      	if(config.Fav){
      		hC.SetCellValue(currentColumn, scores.fav);
        }
      	currentColumn++;

      	//Neu
      	if(config.Neu){
      		hC.SetCellValue(currentColumn, scores.neu);
        }
        currentColumn++;

      	//Unfav
      	if(config.Unfav){
      		hC.SetCellValue(currentColumn, scores.unfav);
        }
      	currentColumn++;

      	//DistributionChart
      	//We don't need to fill anything for the distribution chart,
      	//but we want to increment currentColumn if it's included
      	currentColumn++;

      	//Let's check if we want to add comparator headers at all
      	//and if yes - add them
      	if(TableBuilder.AssocArrayContainsTrue(config.CompsInternal) || TableBuilder.AssocArrayContainsTrue(config.CompsExternal)){
          	//Internal comps
          	// WATCH OUT FOR THE ORDER OF THOSE!!

          	//Trend1
         	if(config.CompsInternal["Trend1"]){
              	hC.SetCellValue(currentColumn, question.internalComps[5].GetStatSigCode());
              	hC.SetCellValue(currentColumn + 1, question.internalComps[5].GetDisplayValue(false));

          	}
          	currentColumn = currentColumn + 2;

          	//Trend2
         	if(config.CompsInternal["Trend2"]){
              	hC.SetCellValue(currentColumn, question.internalComps[6].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[6].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Trend3
         	if(config.CompsInternal["Trend3"]){
              	hC.SetCellValue(currentColumn, question.internalComps[7].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[7].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal1
         	if(config.CompsInternal["Internal1"]){
              	hC.SetCellValue(currentColumn, question.internalComps[0].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[0].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal2
         	if(config.CompsInternal["Internal2"]){
              	hC.SetCellValue(currentColumn, question.internalComps[1].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[1].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal3
         	if(config.CompsInternal["Internal3"]){
              	hC.SetCellValue(currentColumn, question.internalComps[2].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[2].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal4
         	if(config.CompsInternal["Internal4"]){
              	hC.SetCellValue(currentColumn, question.internalComps[3].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[3].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal5
         	if(config.CompsInternal["Internal5"]){
              	hC.SetCellValue(currentColumn, question.internalComps[4].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[4].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//External comps
          	for(var i = 0; i<Config.Norms.Codes.length; i++){
              	if(config.CompsExternal["Norm" + (i + 1)]){
              		hC.SetCellValue(currentColumn, question.norms[i].GetStatSigCode());
          			hC.SetCellValue(currentColumn + 1, question.norms[i].GetDisplayValue(false));
                }
              	currentColumn = currentColumn + 2;
            }
        }

      	//Add row to the table
      	table.RowHeaders.Add(hC);
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Adds column headers that are usually used to generate charts in different parts of the Navigator (e.g. Dashboard, EE, etc.)
  	//Adds folowing headers: fav (your current results), padding header, comparators
    private function AddChartColumnHeaders(table : Table, config, processedComparators){
      	/*config = {
          Item: boolean,
          ValidN: boolean,
          Fav: boolean,
          Neu: boolean,
          Unfav: boolean,
          DistributionChart: boolean,
          CompsInternal: {"Trend1": true, "Trend2": true, "Trend3": true, "Internal1": true,
                          "Internal2": true, "Internal3": true, "Internal4": true, "Internal5": true},
          CompsExternal: {"Norm1": true, "Norm2": true, "Norm3": true, "Norm4": true, "Norm5": true}
		};*/

      	//Get out labels from RT
      	var labels = ResourceText.List(m_report,'labels');
      	var currentLanguage = m_report.CurrentLanguage;

		//Fav
      	var hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['YourCurrentResults']);
        hC.HeaderId = 'fav';
        table.ColumnHeaders.Add(hC);

		/*hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, 'PADDING');
      	table.ColumnHeaders.Add(hC);*/

		//Let's check if we want to add comparator headers at all
      	var addCompsHeaders = (TableBuilder.AssocArrayContainsTrue(config.CompsInternal) || TableBuilder.AssocArrayContainsTrue(config.CompsExternal));

      	if(addCompsHeaders){
          	//Internal comps
          	// WATCH OUT FOR THE ORDER OF THOSE!!
          	// Create Map of internal Comparators
          	var internal_comparators;
          	if(processedComparators == null){
            	internal_comparators = ComparatorUtil.ProcessedComparators (m_report, m_state, m_user );
            }
          	else{
          		internal_comparators = processedComparators;
            }
			var comparators_map = {};
			for (var i=0; i<internal_comparators.length; ++i)
            	comparators_map [ internal_comparators[i].Code ] = internal_comparators[i];

          	//Trend1
          	//Normal header
           	hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Prev].Label);
            if(!config.CompsInternal["Trend1"]){
              hC.HideData = true;
           	}
            table.ColumnHeaders.Add(hC);

          	//Trend2
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Prev2].Label);
          	if(!config.CompsInternal["Trend2"]){
              hC.HideData = true;
            }
            table.ColumnHeaders.Add(hC);

          	//Trend3
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Prev3].Label);
          	if(!config.CompsInternal["Trend3"]){
              hC.HideData = true;
            }
            table.ColumnHeaders.Add(hC);

          	//Internal1
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.TotalCompany].TableLabel);
          	if(!config.CompsInternal["Internal1"]){
            	hC.HideData = true;
            }
            table.ColumnHeaders.Add(hC);

          	//Internal2
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.LevelUp].TableLabel);
          	if(!config.CompsInternal["Internal2"]){
            	hC.HideData = true;
            }
            table.ColumnHeaders.Add(hC);

          	//Internal3
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Level2].TableLabel);
          	if(!config.CompsInternal["Internal3"]){
            	hC.HideData = true;
            }
            table.ColumnHeaders.Add(hC);

          	//Internal4
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Custom1].TableLabel);
          	if(!config.CompsInternal["Internal4"]){
            	hC.HideData = true;
            }
            table.ColumnHeaders.Add(hC);

          	//Internal5
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Custom2].TableLabel);
          	if(!config.CompsInternal["Internal5"]){
            	hC.HideData = true;
            }
            table.ColumnHeaders.Add(hC);

          	//External comps
          	var benchmarksetQ = m_report.DataSource.GetProject('ds0').GetQuestion('benchmarkset');
          	for(var i = 0; i<Config.Norms.Codes.length; i++){
              	//Normal header
              	//Get Norm id
                var normId = NormUtil.GetNormId(m_user, i);
                var normName = benchmarksetQ.GetAnswer(normId).Text + ' ' + labels['norm'];
                hC = new HeaderContent();
                hC.Title = new Label(currentLanguage, normName);
              	if(!config.CompsExternal["Norm" + (i + 1)]){
                	hC.HideData = true;
                }
                table.ColumnHeaders.Add(hC);
            }
        }
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Adds a dimension header used in t0 tables that are connected to charts
  	//Adds dimension name into the row header label and data based on config
  	//Connected with AddChartColumnHeaders function
  	private function AddChartDimensionRow(table: Table, config, processedComparators, dimension : HgDimension){
  		/*config = {
          Item: boolean,
          ValidN: boolean,
          Fav: boolean,
          Neu: boolean,
          Unfav: boolean,
          DistributionChart: boolean,
          CompsInternal: {"Trend1": true, "Trend2": true, "Trend3": true, "Internal1": true,
                          "Internal2": true, "Internal3": true, "Internal4": true, "Internal5": true},
          CompsExternal: {"Norm1": true, "Norm2": true, "Norm3": true, "Norm4": true, "Norm5": true}
		};*/

      	var currentLanguage = m_report.CurrentLanguage;

      	//Add row to the table column
        var hC : HeaderContent = new HeaderContent();
      	hC.Title = new Label(currentLanguage, dimension.GetTitle());

      	var currentColumn = 0;

      	//Fav
      	if(config.Fav){
      		hC.SetCellValue(currentColumn, dimension.GetScores().fav);
        }
      	currentColumn++;

      	//DistributionChart
      	//We don't need to fill anything for the distribution chart,
      	//but we want to increment currentColumn if it's included
      	//currentColumn++;

      	//Let's check if we want to add comparator headers at all
      	//and if yes - add them
      	if(TableBuilder.AssocArrayContainsTrue(config.CompsInternal) || TableBuilder.AssocArrayContainsTrue(config.CompsExternal)){
          	//Internal comps
          	// WATCH OUT FOR THE ORDER OF THOSE!!

          	//Trend1
         	if(config.CompsInternal["Trend1"]){
              	hC.SetCellValue(currentColumn, dimension.internalComps[5].GetScore(true));

          	}
          	currentColumn++;

          	//Trend2
         	if(config.CompsInternal["Trend2"]){
          		hC.SetCellValue(currentColumn, dimension.internalComps[6].GetScore(true));
          	}
          	currentColumn++;

          	//Trend3
         	if(config.CompsInternal["Trend3"]){
          		hC.SetCellValue(currentColumn, dimension.internalComps[7].GetScore(true));
          	}
          	currentColumn++;

          	//Internal1
         	if(config.CompsInternal["Internal1"]){
          		hC.SetCellValue(currentColumn, dimension.internalComps[0].GetScore(true));
          	}
          	currentColumn++;

          	//Internal2
         	if(config.CompsInternal["Internal2"]){
          		hC.SetCellValue(currentColumn, dimension.internalComps[1].GetScore(true));
          	}
          	currentColumn++;

          	//Internal3
         	if(config.CompsInternal["Internal3"]){
          		hC.SetCellValue(currentColumn, dimension.internalComps[2].GetScore(true));
          	}
          	currentColumn++;

          	//Internal4
         	if(config.CompsInternal["Internal4"]){
          		hC.SetCellValue(currentColumn, dimension.internalComps[3].GetScore(true));
          	}
          	currentColumn++;

          	//Internal5
         	if(config.CompsInternal["Internal5"]){
          		hC.SetCellValue(currentColumn, dimension.internalComps[4].GetScore(true));
          	}
          	currentColumn++;

          	//External comps
          	for(var i = 0; i<Config.Norms.Codes.length; i++){
              	if(config.CompsExternal["Norm" + (i + 1)]){
          			hC.SetCellValue(currentColumn, dimension.norms[i].GetScore(true));
                }
              	currentColumn++;
            }
        }

      	//Add row to the table
      	table.RowHeaders.Add(hC);
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////END OF GENERALLY USED FUNCTIONS///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////BEGINNING OF PAGE SPECIFIC FUNCTIONS////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Generates t0 table with Engagement and Enablement scores that can be used to create a chart
  	public function GenerateEEMainForChart(table : Table){
      	//Get the config
       	var config = GetStandardHeaderConfig();

  		//It needs a pretty specific set of headers, so we'll not be adding standard ones here
      	AddChartColumnHeaders(table, config);

      	//Get the Engagement dimension
      	var qm = null;
      	if(m_qm == null){
        	qm = QueryManager.GetQueryManagerMain(m_report, m_state, m_user, true);
        }
      	else{
      		qm = m_qm;
        }

        var dimensionEng = qm.GetOneDimensionById('DIM_ENG');

      	//Get the Enablement dimension
        var dimensionEna = qm.GetOneDimensionById('DIM_ENA');

      	//Add both dims using custom function
      	AddChartDimensionRow(table, config, null, dimensionEng);
        AddChartDimensionRow(table, config, null, dimensionEna);
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Generates t0 table with all Tier 1 dimensions scores that can be used to create a chart
  	public function GenerateTier1ForChart(table : Table){
      	//Get the config
       	var config = GetStandardHeaderConfig();

  		//It needs a pretty specific set of headers, so we'll not be adding standard ones here
      	AddChartColumnHeaders(table, config);

      	//Get the Engagement dimension
      	var qm = null;
      	if(m_qm == null){
        	qm = QueryManager.GetQueryManagerMain(m_report, m_state, m_user, true);
        }
      	else{
      		qm = m_qm;
        }

      	//Run through all dimensions and find tier1 ones
      	var dims = Config.Dimensions.concat(Config.LocalDimensions);
      	for(var i = 0; i<dims.length; i++){
          	if(dims[i].Tier.toString() == '1'){
          		var d = qm.GetOneDimensionById(dims[i].Id);
              	AddChartDimensionRow(table, config, null, d);
            }
        }
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Generates the KDA table
  	public function GenerateKDA(table : Table){
      	table.Caching.Enabled = false;

  		//Get the config
      	var config = GetStandardHeaderConfig();

      	//Force the item property of config to true
      	config.Item = true;

      	//Add KDA headers
      	AddKDAColumnHeaders(table, config);

      	//Get questions
      	var qm = QueryManager.GetQueryManagerMain(m_report, m_state, m_user, true);
      	var questions = qm.GetAllQuestions();

      	//Translate questions into an associative array
      	var questionsArr = {};
      	for(var i = 0; i<questions.length; i++){
      		questionsArr[questions[i].GetId()] = questions[i];
        }

      	//Get KDAs
      	var KDAs = KDA.GetItemsByNodeId(m_user.PersonalizedReportBase, m_state);

      	//Map KDAs
      	//TODO: CLEANUP
      	var kdaFinal = [];
      	var engEnaMap = {};
      	var kdaAddedMap = {};
      	var engCount = 1;
      	var enaCount = 1;
      	for(var i = 0; i<KDAs.length; i++){
          	if(!kdaAddedMap[KDAs[i].QuestionId]){
          		kdaAddedMap[KDAs[i].QuestionId] = true;
              	kdaFinal.push(questionsArr[KDAs[i].QuestionId]);
            }
          	if(KDAs[i].Type == 1){
              	engEnaMap[KDAs[i].QuestionId] = {eng: engCount, ena: 0};
              	engCount++;
            }
          	if(KDAs[i].Type == 2){
          		if(engEnaMap[KDAs[i].QuestionId] == null)
          		  engEnaMap[KDAs[i].QuestionId] = {eng: 0, ena: enaCount};
              	else
                  engEnaMap[KDAs[i].QuestionId].ena = enaCount;
              	enaCount++;
            }
        }

      	var dimLabels = ResourceText.List(m_report, 'dimensions');

      	//Add KDAs as rows to the table
      	for(var i = 0; i<kdaFinal.length; i++){
          	//Figure out the dimension id for this question so we can get the label
          	var dimId = 'DIM_ENG';
			var found = false;

          	for(var k = 0; k<Config.Dimensions.length; k++){

				if(found)
					break;

              	for(var j = 0; j<Config.Dimensions[k].Questions.length; j++){
                  	if(Config.Dimensions[k].Questions[j] == kdaFinal[i].GetId()){
                  		dimId = Config.Dimensions[k].Id;
						found = true;
                      	break;
                    }
                }
            }
        	AddKDAQuestionRow(table, config, kdaFinal[i], engEnaMap[kdaFinal[i].GetId()].eng, engEnaMap[kdaFinal[i].GetId()].ena, dimLabels[dimId]);
        }
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Generates the KDA headers
  	private function AddKDAColumnHeaders(table : Table, config, processedComparators){
		/*config = {
          Item: boolean,
          ValidN: boolean,
          Fav: boolean,
          Neu: boolean,
          Unfav: boolean,
          DistributionChart: boolean,
          CompsInternal: {"Trend1": true, "Trend2": true, "Trend3": true, "Internal1": true,
                          "Internal2": true, "Internal3": true, "Internal4": true, "Internal5": true},
          CompsExternal: {"Norm1": true, "Norm2": true, "Norm3": true, "Norm4": true, "Norm5": true}
		};*/

      	//Get out labels from RT
      	var labels = ResourceText.List(m_report,'labels');
      	var currentLanguage = m_report.CurrentLanguage;

      	//Add highlight row column
        var hC : HeaderContent = new HeaderContent();
        hC.Title = new Label(currentLanguage, 'HighlighRowFlag');
        hC.HideData = true;
      	table.ColumnHeaders.Add(hC);

      	//Item
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['Item']);
      	if(!config.Item){
          hC.HideData = true;
        }
        table.ColumnHeaders.Add(hC);

      	//Dimension
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['DimensionLabel']);
        table.ColumnHeaders.Add(hC);

      	//Impact on engagement
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['ImpactonEngagement']);
        table.ColumnHeaders.Add(hC);

      	//Impact on enablement
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['ImpactonEnablement']);
        table.ColumnHeaders.Add(hC);

      	//ValidN
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['ValidN']);
      	if(!config.ValidN){
        	hC.HideData = true;
        }
        table.ColumnHeaders.Add(hC);

      	//Fav
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['PercentFav']);
        hC.HeaderId = 'fav';
      	if(!config.Fav){
          hC.HideData = true;
        }
        table.ColumnHeaders.Add(hC);

      	//Let's check if we want to add comparator headers at all
      	var addCompsHeaders = (TableBuilder.AssocArrayContainsTrue(config.CompsInternal) || TableBuilder.AssocArrayContainsTrue(config.CompsExternal));

      	if(addCompsHeaders){
          	//Header above all comps
          	var hSegment : HeaderSegment = new HeaderSegment();
          	//we need to set DataSourceNodeId, but we really don't care about having this set
          	//since we're using content headers below this one anyway
          	hSegment.DataSourceNodeId = 'ds0';
          	hSegment.Label = new Label(currentLanguage, labels['FavvsComparator']);

          	//Internal comps
          	// WATCH OUT FOR THE ORDER OF THOSE!!
          	// Create Map of internal Comparators
          	var internal_comparators;
          	if(processedComparators == null){
            	internal_comparators = ComparatorUtil.ProcessedComparators (m_report, m_state, m_user );
            }
          	else{
          		internal_comparators = processedComparators;
            }
			var comparators_map = {};
			for (var i=0; i<internal_comparators.length; ++i)
            	comparators_map [ internal_comparators[i].Code ] = internal_comparators[i];

          	//Trend1
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
           	hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Prev].Label);
            if(!config.CompsInternal["Trend1"]){
              hC.HideData = true;
           	}
            hSegment.SubHeaders.Add(hC);



          	//Trend2
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Prev2].Label);
          	if(!config.CompsInternal["Trend2"]){
              hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Trend3
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Prev3].Label);
          	if(!config.CompsInternal["Trend3"]){
              hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal1
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.TotalCompany].TableLabel);
          	if(!config.CompsInternal["Internal1"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal2
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.LevelUp].TableLabel);
          	if(!config.CompsInternal["Internal2"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal3
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Level2].TableLabel);
          	if(!config.CompsInternal["Internal3"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal4
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Custom1].TableLabel);
          	if(!config.CompsInternal["Internal4"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal5
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Custom2].TableLabel);
          	if(!config.CompsInternal["Internal5"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//External comps
          	var benchmarksetQ = m_report.DataSource.GetProject('ds0').GetQuestion('benchmarkset');
          	for(var i = 0; i<Config.Norms.Codes.length; i++){

                //Sigtest - hidden header used for stat. sig
                hC = new HeaderContent();
                hC.Title = new Label(currentLanguage, 'statsig');
                hC.HideData = !debug;
                hSegment.SubHeaders.Add(hC);

              	//Normal header
              	//Get Norm id
                var normId = NormUtil.GetNormId(m_user, i);
                var normName = benchmarksetQ.GetAnswer(normId).Text + ' ' + labels['norm'];
                hC = new HeaderContent();
                hC.Title = new Label(currentLanguage, normName);
              	if(!config.CompsExternal["Norm" + (i + 1)]){
                	hC.HideData = true;
                }
                hSegment.SubHeaders.Add(hC);
            }

          	//Add all to the table
          	table.ColumnHeaders.Add(hSegment);
        }
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Adds a question row to KDA table
  	private function AddKDAQuestionRow(table : Table, config, question : HgQuestion, impactOnEngagement : int, impactOnEnablement : int, dimensionLabel : String){
  		/*config = {
          Item: boolean,
          ValidN: boolean,
          Fav: boolean,
          Neu: boolean,
          Unfav: boolean,
          DistributionChart: boolean,
          CompsInternal: {"Trend1": true, "Trend2": true, "Trend3": true, "Internal1": true,
                          "Internal2": true, "Internal3": true, "Internal4": true, "Internal5": true},
          CompsExternal: {"Norm1": true, "Norm2": true, "Norm3": true, "Norm4": true, "Norm5": true}
		};*/

      	var currentLanguage = m_report.CurrentLanguage;

      	//Add row to the table column
        var hC : HeaderContent = new HeaderContent();
      	hC.Title = new Label(currentLanguage, question.GetDisplayId());

        //Set Highlight row flag
      	hC.SetCellValue(0, 0);

      	var currentColumn = 1;
      	//Item
      	if(config.Item){
      		hC.SetCellValue(currentColumn, question.text);
        }
      	currentColumn++;

      	//Dimension
      	hC.SetCellValue(currentColumn, dimensionLabel);
      	currentColumn++;

      	//Impact on Engagement
      	if(impactOnEngagement > 0)
          hC.SetCellValue(currentColumn, impactOnEngagement);
      	currentColumn++;

      	//Impact on Enablement
      	if(impactOnEnablement > 0)
          hC.SetCellValue(currentColumn, impactOnEnablement);
      	currentColumn++;

      	//ValidN
      	if(config.ValidN){
      		hC.SetCellValue(currentColumn, question.tableValidN);
        }
      	currentColumn++;

      	//Get scores out
      	var scores = question.GetScores();

      	//Fav
      	if(config.Fav){
      		hC.SetCellValue(currentColumn, scores.fav);
        }
      	currentColumn++;

      	//Let's check if we want to add comparator headers at all
      	//and if yes - add them
      	if(TableBuilder.AssocArrayContainsTrue(config.CompsInternal) || TableBuilder.AssocArrayContainsTrue(config.CompsExternal)){
          	//Internal comps
          	// WATCH OUT FOR THE ORDER OF THOSE!!

          	//Trend1
         	if(config.CompsInternal["Trend1"]){
              	hC.SetCellValue(currentColumn, question.internalComps[5].GetStatSigCode());
              	hC.SetCellValue(currentColumn + 1, question.internalComps[5].GetDisplayValue(false));

          	}
          	currentColumn = currentColumn + 2;

          	//Trend2
         	if(config.CompsInternal["Trend2"]){
              	hC.SetCellValue(currentColumn, question.internalComps[6].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[6].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Trend3
         	if(config.CompsInternal["Trend3"]){
              	hC.SetCellValue(currentColumn, question.internalComps[7].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[7].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal1
         	if(config.CompsInternal["Internal1"]){
              	hC.SetCellValue(currentColumn, question.internalComps[0].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[0].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal2
         	if(config.CompsInternal["Internal2"]){
              	hC.SetCellValue(currentColumn, question.internalComps[1].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[1].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal3
         	if(config.CompsInternal["Internal3"]){
              	hC.SetCellValue(currentColumn, question.internalComps[2].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[2].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal4
         	if(config.CompsInternal["Internal4"]){
              	hC.SetCellValue(currentColumn, question.internalComps[3].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[3].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal5
         	if(config.CompsInternal["Internal5"]){
              	hC.SetCellValue(currentColumn, question.internalComps[4].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[4].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//External comps
          	for(var i = 0; i<Config.Norms.Codes.length; i++){
              	if(config.CompsExternal["Norm" + (i + 1)]){
              		hC.SetCellValue(currentColumn, question.norms[i].GetStatSigCode());
          			hC.SetCellValue(currentColumn + 1, question.norms[i].GetDisplayValue(false));
                }
              	currentColumn = currentColumn + 2;
            }
        }

      	//Add row to the table
      	table.RowHeaders.Add(hC);
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Generates Engagement and Enablement details page
  	public function GenerateEEDetails(table : Table){
  		//Get the config
       	var config = GetStandardHeaderConfig();

      	var titlesInRowHeaders = false;
      	//In case of PPTs
      	if(ExecutionMode.isPowerPoint(m_state)){
        	titlesInRowHeaders = true;
        }

      	//Let's add our standard content headers
      	AddStandardColumnHeaders(table, config);

      	//Get the Engagement dimension
      	var qm = QueryManager.GetQueryManagerMain(m_report, m_state, m_user, true);
        var dimensionEng = qm.GetOneDimensionById('DIM_ENG');

      	//Get the Enablement dimension
        var dimensionEna = qm.GetOneDimensionById('DIM_ENA');

      	//Add the data to the table
      	//Engagement
      	AddStandardDimensionRow(table, config, dimensionEng, titlesInRowHeaders);
      	for(var j = 0; j<dimensionEng.questions.length; j++){
        	AddStandardQuestionRow(table, config, dimensionEng.questions[j], titlesInRowHeaders);
        }
      	//Enablement
      	AddStandardDimensionRow(table, config, dimensionEna, titlesInRowHeaders);
      	for(var j = 0; j<dimensionEna.questions.length; j++){
        	AddStandardQuestionRow(table, config, dimensionEna.questions[j], titlesInRowHeaders);
        }
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Generates EEF Gap t0 table
  	public function GenerateEEFGap(table : Table, confirmit){
    	table.Caching.Enabled = false;

      	//Get the demo
      	var qm = null;
      	if(m_qm == null)
      		var qm = QueryManagerBreakByInterface.GetQM('EEFGAP', confirmit, m_report, m_user, m_state);
      	else
          	qm = m_qm;

      	var demo = qm.GetCurrentDemoCore(Config.EEFGap.HideEE);

      	//Check what information we're looking for - dimensions, questions or top 10 questions?
      	// CONTENT
		var content = ParamUtil.Selected (m_report, m_state, 'EEF_GAP_PLOT');

      	//Take out dimensions or questions based on selection
      	// DEMOGRAPHY
		var selected = ParamUtil.Selected (m_report, m_state, 'EEF_GAP', m_user);
      	var firstCode = '901';
      	var secondCode = selected.Code;

      	var usingDims = false;
      	var data = {firstCut : null, secondCut : null};
      	var cutLabels = {firstCut : null, secondCut : null};
      	switch(content.Code){
          case '1': //All dimensions
            usingDims = true;
            for(var i=0; i<demo.cuts.length; i++){
              	if(demo.cuts[i].GetId() == firstCode){
                  data.firstCut = demo.cuts[i].dimensions;
              	  cutLabels.firstCut = demo.cuts[i].GetTitle();
                }
                if(demo.cuts[i].GetId() == secondCode){
                  data.secondCut = demo.cuts[i].dimensions;
                  cutLabels.secondCut = demo.cuts[i].GetTitle();
                }
            }
            break;
          case '2': //Top 10 questions sorted by EEF GAP score
            table.Sorting.Rows.TopN = content.TopN;

            for(var i=0; i<demo.cuts.length; i++){
              	if(demo.cuts[i].GetId() == firstCode){
                  data.firstCut = demo.cuts[i].questions;
              	  cutLabels.firstCut = demo.cuts[i].GetTitle();
                }
                if(demo.cuts[i].GetId() == secondCode){
                  data.secondCut = demo.cuts[i].questions;
                  cutLabels.secondCut = demo.cuts[i].GetTitle();
                }
            }
            break;
          case '3': //All questions
            for(var i=0; i<demo.cuts.length; i++){
              	if(demo.cuts[i].GetId() == firstCode){
                  data.firstCut = demo.cuts[i].questions;
              	  cutLabels.firstCut = demo.cuts[i].GetTitle();
                }
                if(demo.cuts[i].GetId() == secondCode){
                  data.secondCut = demo.cuts[i].questions;
                  cutLabels.secondCut = demo.cuts[i].GetTitle();
                }
            }
            break;
          default:

        }

      	//Add column headers
      	//Get out labels from RT
      	var labels = ResourceText.List(m_report,'labels');
      	var currentLanguage = m_report.CurrentLanguage;

      	//Add Item column
        var hC : HeaderContent = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['Item']);
      	table.ColumnHeaders.Add(hC);

      	//Add fav and chart with a header for first cut
      	var hS : HeaderSegment = new HeaderSegment();
      	hS.DataSourceNodeId = 'ds0';
      	hS.Label = new Label(currentLanguage, ResourceText.Text(m_report,'effectiveness_profile','DataFavorably').split('[COMPANY]').join(cutLabels.secondCut.toUpperCase()));
      	  //Fav
          hC = new HeaderContent();
          hC.Title = new Label(currentLanguage, labels['PercentFav']);
          hS.SubHeaders.Add(hC);
          //Chart
          var hCC = new HeaderChartCombo();
          hCC.Title = new Label(currentLanguage, labels['Chart']);
          HelperUtil.UpdateBarChart100(m_report, hCC, selected.Color);
          hS.SubHeaders.Add(hCC);

        table.ColumnHeaders.Add(hS);

      	//Add fav and chart with a header for second cut
      	hS  = new HeaderSegment();
      	hS.DataSourceNodeId = 'ds0';
      	hS.Label = new Label(currentLanguage, ResourceText.Text(m_report,'effectiveness_profile','DataFavorably').split('[COMPANY]').join(cutLabels.firstCut.toUpperCase()));
      	  //Fav
          hC = new HeaderContent();
          hC.Title = new Label(currentLanguage, labels['PercentFav']);
          hS.SubHeaders.Add(hC);
          //Chart
          hCC = new HeaderChartCombo();
          hCC.Title = new Label(currentLanguage, labels['Chart']);
      	  HelperUtil.UpdateBarChart100(m_report, hCC, Config.Colors.GreenAlternative);
          hS.SubHeaders.Add(hCC);

        table.ColumnHeaders.Add(hS);

      	//Add the gap header
        var hF : HeaderFormula = new HeaderFormula();
      	hF.Type = FormulaType.Expression;
        hF.HeaderId = 'diff';
      	hF.Title = new Label(currentLanguage, ResourceText.Text(m_report, 'net_promoter_gap', 'PercentFavgap'));
      	hF.Expression = 'CELLV(col-2,row)-CELLV(col-4,row)';

      	table.ColumnHeaders.Add(hF);

      	//Add rows and fill in data
      	for(var i=0; i<data.firstCut.length; i++){
          	var rowHeader : HeaderContent= new HeaderContent();
          	rowHeader.Title = usingDims ? new Label(currentLanguage, '◊') : new Label(currentLanguage, data.firstCut[i].GetDisplayId());
          	var item = usingDims ? data.firstCut[i].GetTitle() : data.firstCut[i].text;
          	rowHeader.SetCellValue(0, item);
          	rowHeader.SetCellValue(1, data.secondCut[i].GetScores().fav);
          	rowHeader.SetCellValue(3, data.firstCut[i].GetScores().fav);
          	table.RowHeaders.Add(rowHeader);
        }

      	//Sort the table
        table.Sorting.Rows.SortByType = TableSortByType.Header;
        table.Sorting.Rows.SortByHeaderId = 'diff';
        table.Sorting.Rows.Direction = TableSortDirection.Descending;
      	table.Sorting.Rows.Enabled = true;
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
	//Generates a table that we can see on question summary
 	public function GenerateQuestionSummary(table : Table){
      	//Get the config
       	var config = GetStandardHeaderConfig();
      
      	var titlesInRowHeaders = false;
      	//In case of PPTs
      	if(ExecutionMode.isPowerPoint(m_state)){
        	titlesInRowHeaders = true;
        }
       	
       	//Let's add our standard content headers   	
      	AddStandardColumnHeaders(table, config);
      	
       	//Let's add dimensions/questions + data
       	var qm = QueryManager.GetQueryManagerMain(m_report, m_state, m_user, true);
      	var dimensions = qm.GetCoreDimensions();
      	
       	//ConfirmitClass.lg.LogDebug('We got data');
       	for(var i = 0; i< dimensions.length; i++){
       		AddStandardDimensionRow(table, config, dimensions[i], titlesInRowHeaders);
          	var questions = dimensions[i].questions;
          	for(var j = 0; j<questions.length; j++){
          		AddStandardQuestionRow(table, config, questions[j], titlesInRowHeaders);
            }	 
       	}
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Generates Survey Dimensions page
  	public function GenerateSurveyDimensions(table : Table){
  		//Get the config and hide Valid N column
      	var config = GetStandardHeaderConfig();
      	config.Item = false;
      	config.ValidN = false;

      	//Let's add our standard content headers
      	AddStandardColumnHeaders(table, config);

      	//Get dimensions out
      	var dimensions = Page_SurveyDimensions.GetSurveyDimensionsDimensions(m_report, m_state, m_user);

      	//Add dimensions to this table
      	for(var i = 0; i<dimensions.length; i++){
      		AddStandardDimensionRow(table, config, dimensions[i], true);
        }

      	var selected = ParamUtil.Selected(m_report, m_state, 'SURVEY_DIMENSIONS_PAGED', m_user);
        if (selected != null) {
          table.RowsActiveRange.Start = selected.StartIndex;
          table.RowsActiveRange.End = selected.EndIndex;
        }
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Generates Local Questions page
  	public function GenerateLocalQuestions(table : Table){
		//Get the config
       	var config = GetStandardHeaderConfig();

      	var titlesInRowHeaders = false;
      	//In case of PPTs
      	if(ExecutionMode.isPowerPoint(m_state)){
        	titlesInRowHeaders = true;
        }

      	//Let's add our standard content headers
      	AddStandardColumnHeaders(table, config);

      	//Get currently selected dimension - if null, revert to the first item we can find
      	var selected = ParamUtil.Selected(m_report, m_state, 'LOCAL_DIMENSION', m_user);
        if (selected == null)
           	selected = ParamLists.Get('LOCAL_DIMENSION', m_state, m_report, m_user)[0];
      	var dimId = selected.Code;

      	//Get the dimension
      	var qm = QueryManager.GetQueryManagerMain(m_report, m_state, m_user, true);
        var dimension = qm.GetOneDimensionById(dimId);

      	//Add the data to the table
      	AddStandardDimensionRow(table, config, dimension, titlesInRowHeaders);
      	for(var j = 0; j<dimension.questions.length; j++){
        	AddStandardQuestionRow(table, config, dimension.questions[j], titlesInRowHeaders);
        }
  	}
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Generates RST
  	public function GenerateRST(table : Table){
  		//Get the config
       	var config = GetStandardHeaderConfig();

      	var titlesInRowHeaders = false;
      	//In case of PPTs we want to hide the distribution chart by force
      	if(ExecutionMode.isPowerPoint(m_state)){
        	config.DistributionChart = false;
        	titlesInRowHeaders = true;
        }

      	//Let's add our standard content headers
      	AddStandardColumnHeaders(table, config);

      	//Get appropriate set of questions
      	var qs = Page_RST.GetRSTQuestions(m_report, m_state, m_user);

      	//Add those to the table
      	for(var j = 0; j<qs.length; j++){
          		AddStandardQuestionRow(table, config, qs[j], titlesInRowHeaders);
        }

      	//If we're using RST_PAGED param - apply paging
      	//Get currently selected param in either RST or RST_PAGED
      	var selected = ParamUtil.Selected(m_report, m_state, 'RST_PAGED', m_user);

        if (selected != null) {
          	table.RowsActiveRange.Start = selected.StartIndex;
  			table.RowsActiveRange.End = selected.EndIndex;
        }
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Generates IBT t0 table
  	public function GenerateIBT(table : Table){
      	table.Caching.Enabled = false;

      	//Get out the demo
      	var demo = m_qm.GetCurrentDemoCore();

      	//Set up the column headers
      	AddIBTColumnHeaders(table, demo);

      	//Set up row headers
      	AddIBTRows(table, demo);

        // Apply row masking
        var selected = ParamUtil.Selected(m_report, m_state, 'IBT_PAGED', m_user);
        if (selected != null) {
          table.RowsActiveRange.Start = selected.StartIndex;
          table.RowsActiveRange.End = selected.EndIndex;
        }
  	}
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Adds headers to IBT t0 table
  	private function AddIBTColumnHeaders(table, demo){
      	var currentLanguage = m_report.CurrentLanguage;

      	//Get out N values
      	var validNs = m_report.TableUtils.GetRowValues('N', 1);

  		//Overall
      	var hS : HeaderSegment = new HeaderSegment();
      	hS.DataSourceNodeId = 'ds0';
      	hS.Label = new Label(currentLanguage, demo.overall.GetTitle());

      	var hS2 : HeaderSegment = new HeaderSegment();
      	hS2.DataSourceNodeId = 'ds0';
      	var nLabel = 'N=';
      	var nLabel = validNs[0].Value < Config.Privacy.Table.MinN ? '-' : nLabel + validNs[0].Value; //APPLY MINIMUM N
      	hS2.Label = new Label(currentLanguage, nLabel);

      	hS.SubHeaders.Add(hS2);
      	table.ColumnHeaders.Add(hS);

      	//Demo label above all cuts
      	var selected = Page_InternalBenchmarkTool.Selection_BreakBy(m_report, m_state, m_user);
      	hS = new HeaderSegment();
      	hS.DataSourceNodeId = 'ds0';
      	hS.Label = new Label(currentLanguage, selected.Label);

      	//Add all cuts under this one
        for(var i = 0; i<demo.cuts.length; i++){
          //Hidden stat sig
          var hSig : HeaderSegment = new HeaderSegment();
          hSig.DataSourceNodeId = 'ds0';
          hSig.Label = new Label(currentLanguage, 'sig');
          hSig.HideData = true;
          hS.SubHeaders.Add(hSig);

          //Label for the demo cut
          hS2 = new HeaderSegment();
          hS2.DataSourceNodeId = 'ds0';
          hS2.Label = new Label(currentLanguage, demo.cuts[i].GetTitle());

          //N information for the demo cut
          var hS3 : HeaderSegment = new HeaderSegment();
          hS3.DataSourceNodeId = 'ds0';
          nLabel = 'N=';
          nLabel = validNs[i+1].Value < Config.Privacy.Table.MinN ? '-' : nLabel + validNs[i+1].Value; //APPLY MINIMUM N
          hS3.Label = new Label(currentLanguage, nLabel);

          hS2.SubHeaders.Add(hS3);
          hS.SubHeaders.Add(hS2);
        }

      	table.ColumnHeaders.Add(hS);
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Adds rows to IBT t0 table
  	private function AddIBTRows(table, demo){
      	var currentLanguage = m_report.CurrentLanguage;

      	//Check what;s the metric - fav or unfav - .Code 'fav' and 'unfav'
      	var metric = Page_InternalBenchmarkTool.Selection_Metric(m_report, m_state, m_user);

      	//Check if we want difference or absolute value - .Code 'abs' and 'diff'
      	var displayAs = Page_InternalBenchmarkTool.Selection_DisplayCompsAs(m_report, m_state, m_user);

      	//Check what should be included - questions, dimensions or one dimension and add to table
      	var data = Page_InternalBenchmarkTool.Selection_Rows(m_report, m_state, m_user);
      	switch(data.Code){
          case "1":

            var dimsConf = Config.Dimensions;

           	for(var i=0; i<dimsConf.length; i++){
              	//add to table
              	ConfirmitClass.lg.LogDebug('Before Adding IBTDIM');
              	AddIBTDimensionRow(table, demo, i, currentLanguage, displayAs, metric);
            }
            break;
          case "2":
            //Iterate over all questions and add to the table
            //Sort all by display id
            var charFound : Boolean = false;
            for(var j = 0; j<demo.overall.questions.length; j++){
            	if (isNaN(demo.overall.questions[j].GetDisplayNumber())){
                	charFound=true;
                	break;
            	} 
           	}

            if(charFound){
            	demo.overall.questions = demo.overall.questions.sort(SortUtil.SortHgQuestionByDisplayId);
           		for(var j = 0; j<demo.cuts.length; j++){
               		demo.cuts[j].questions = demo.cuts[j].questions.sort(SortUtil.SortHgQuestionByDisplayId);
               	} 
            }
            else {
            	demo.overall.questions = demo.overall.questions.sort(SortUtil.SortHgQuestionByDisplayNumber);
            	for(var j = 0; j<demo.cuts.length; j++){
               		demo.cuts[j].questions = demo.cuts[j].questions.sort(SortUtil.SortHgQuestionByDisplayNumber);
            	}
          	}

            //Add to table
            for(var i = 0; i<demo.overall.questions.length; i++){
              	AddIBTQuestionRow(table, demo, demo.overall.questions[i].GetId(), currentLanguage, displayAs, metric);
            }
            break;

          case "3":
             //Iterate over all dimensions and add to the table
            for(var i = 0; i<demo.overall.dimensions.length; i++){
              	AddIBTDimensionRow(table, demo, i, currentLanguage, displayAs, metric);
              	//Iterate over all questions in the dimension and add to the table
                for(var j = 0; j<demo.overall.dimensions[i].questions.length; j++){
                   AddIBTQuestionRow(table, demo, demo.overall.dimensions[i].questions[j].GetId(), currentLanguage, displayAs, metric);
                  }
            }

            break;

          default:
            //Take out one dim and add to the table
            //Iterate over all dimensions and add to the table
            for(var i = 0; i<demo.overall.dimensions.length; i++){
              	if(demo.overall.dimensions[i].GetId() == data.Code){
                     AddIBTDimensionRow(table, demo, i, currentLanguage, displayAs, metric);

                  //Now add all questions from this dimension
                  for(var j = 0; j<demo.overall.dimensions[i].questions.length; j++){
                    AddIBTQuestionRow(table, demo, demo.overall.dimensions[i].questions[j].GetId(), currentLanguage, displayAs, metric);
                  }

                  break;
            	}
            }
        }
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	private function AddIBTDimensionRow(table, demo, dimIndex, language, display, metric) {
      	var expr = [];
      	var hC : HeaderContent = new HeaderContent();
        hC.Title = new Label(language, demo.overall.dimensions[dimIndex].GetTitle());

        //Add overall score
        var columnOffset = 0;
        var score = metric.Code == 'fav' ? demo.overall.dimensions[dimIndex].GetScores().fav : demo.overall.dimensions[dimIndex].GetScores().unfav;

        hC.SetCellValue(columnOffset, score);
        columnOffset++;

      	//Add score for all cuts
        for(var i = 0; i<demo.cuts.length; i++){
                  	score = '-';
                  	var sigCode = SigTest.Codes.None;

                  	if(metric.Code == 'fav'){
                      if(!demo.overall.dimensions[dimIndex].IsSuppressed() && !demo.cuts[i].dimensions[dimIndex].IsSuppressed()){
                        score = display.Code == 'abs' ? demo.cuts[i].dimensions[dimIndex].GetScores().fav :
                          		demo.cuts[i].dimensions[dimIndex].GetScores().fav - demo.overall.dimensions[dimIndex].GetScores().fav;

                      	sigCode = HgComparator.StatSig(demo.cuts[i].dimensions[dimIndex].GetValidN(), demo.cuts[i].dimensions[dimIndex].GetScores().fav,
                                                       demo.cuts[i].dimensions[dimIndex].GetScores().unfav, demo.overall.dimensions[dimIndex].GetValidN(),
                                                       demo.overall.dimensions[dimIndex].GetScores().fav, demo.overall.dimensions[dimIndex].GetScores().unfav, true);
                      }
                    }
                  	else{

                  	  if(!demo.overall.dimensions[dimIndex].IsSuppressed() && !demo.cuts[i].dimensions[dimIndex].IsSuppressed()){
                        score = display.Code == 'abs' ? demo.cuts[i].dimensions[dimIndex].GetScores().unfav :
                          		demo.cuts[i].dimensions[dimIndex].GetScores().unfav - demo.overall.dimensions[dimIndex].GetScores().unfav;

                      	sigCode = HgComparator.StatSig(demo.cuts[i].dimensions[dimIndex].GetValidN(), demo.cuts[i].dimensions[dimIndex].GetScores().fav,
                                                       demo.cuts[i].dimensions[dimIndex].GetScores().unfav, demo.overall.dimensions[dimIndex].GetValidN(),
                                                       demo.overall.dimensions[dimIndex].GetScores().fav, demo.overall.dimensions[dimIndex].GetScores().unfav, false);
                      }
                    }

                  	if(sigCode != SigTest.Codes.None){
                  		score = score + Config.SigTest.Suffix;
                    }

                  	hC.SetCellValue(columnOffset, sigCode);
              		columnOffset++;

                  	hC.SetCellValue(columnOffset, score);
              		columnOffset++;
                }

              	table.RowHeaders.Add(hC);
  	}
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	private function AddIBTQuestionRow(table, demo, QID, language, display, metric) {
     	 		//Add whole question to the table
      			//Find the INDEX of the questio
      			var QIndex = 0;
      			for(var i=0; i<demo.overall.questions.length; i++){
                  	if(demo.overall.questions[i].GetId() == QID){
                  		QIndex = i;
                      	break;
                    }
                }

              	var hC : HeaderContent = new HeaderContent();
              	hC.Title = new Label(language, demo.overall.questions[QIndex].GetDisplayId() + ' ' + demo.overall.questions[QIndex].text);

              	//Add overall score
              	var columnOffset = 0;
              	var score = metric.Code == 'fav' ? demo.overall.questions[QIndex].GetScores().fav : demo.overall.questions[QIndex].GetScores().unfav;
              	hC.SetCellValue(columnOffset, score);
              	columnOffset++;

              	//Add score for all cuts
              	for(var i = 0; i<demo.cuts.length; i++){
                  	score = '-';
                  	var sigCode = SigTest.Codes.None;
                  	if(metric.Code == 'fav'){
                      if(!demo.overall.questions[QIndex].IsSuppressed() && !demo.cuts[i].questions[QIndex].IsSuppressed()){
                        score = display.Code == 'abs' ? demo.cuts[i].questions[QIndex].GetScores().fav :
                          		demo.cuts[i].questions[QIndex].GetScores().fav - demo.overall.questions[QIndex].GetScores().fav;

                      	sigCode = HgComparator.StatSig(demo.cuts[i].questions[QIndex].GetValidN(), demo.cuts[i].questions[QIndex].GetScores().fav,
                                                       demo.cuts[i].questions[QIndex].GetScores().unfav, demo.overall.questions[QIndex].GetValidN(),
                                                       demo.overall.questions[QIndex].GetScores().fav, demo.overall.questions[QIndex].GetScores().unfav, true);
                      }
                    }
                  	else{
                  	  if(!demo.overall.questions[QIndex].IsSuppressed() && !demo.cuts[i].questions[QIndex].IsSuppressed()){
                        score = display.Code == 'abs' ? demo.cuts[i].questions[QIndex].GetScores().unfav :
                          		demo.cuts[i].questions[QIndex].GetScores().unfav - demo.overall.questions[QIndex].GetScores().unfav;

                      	sigCode = HgComparator.StatSig(demo.cuts[i].questions[QIndex].GetValidN(), demo.cuts[i].questions[QIndex].GetScores().fav,
                                                       demo.cuts[i].questions[QIndex].GetScores().unfav, demo.overall.questions[QIndex].GetValidN(),
                                                       demo.overall.questions[QIndex].GetScores().fav, demo.overall.questions[QIndex].GetScores().unfav, false);
                      }
                    }

                  	if(sigCode != SigTest.Codes.None){
                  		score = score + Config.SigTest.Suffix;
                    }

                  	hC.SetCellValue(columnOffset, sigCode);
              		columnOffset++;

                  	hC.SetCellValue(columnOffset, score);
              		columnOffset++;
                }

              	//add to table
              	table.RowHeaders.Add(hC);
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Generates Plot your results table (used for chart)
    public function GeneratePlotYourResults(table : Table, confirmit){
    	table.Caching.Enabled = false;

      	//Clean the table
      	table.ColumnHeaders.Clear();
      	table.RowHeaders.Clear();

      	//Get the demo
      	var qm = null;
      	if(m_qm == null)
      		var qm = QueryManagerBreakByInterface.GetQM('PLOTYOURRESULTS', confirmit, m_report, m_user, m_state);
      	else
          	qm = m_qm;

      	var demo = qm.GetCurrentDemo();

      	//Build the table - two columns and X rows, where X is the nubmer of demo cuts
      	//Columns
      	//Get the first Q
      	var item1 = ParamUtil.GetParamCode(m_state, 'ITEM');
		var item2 = ParamUtil.GetParamCode(m_state, 'ITEM2');

        var q1st = null;
      	for(var i=0; i<demo.overall.questions.length; i++){
          if(demo.overall.questions[i].GetId() == item1)
          	q1st = demo.overall.questions[i];
          }

        //Get the second Q
        var q2nd = null;
        for(var i=0; i<demo.overall.questions.length; i++){
          if(demo.overall.questions[i].GetId() == item2)
            q2nd = demo.overall.questions[i];
        }

      	var hS : HeaderSegment = new HeaderSegment();
      	hS.DataSourceNodeId = 'ds0';
      	hS.Label = new Label(m_report.CurrentLanguage, '1.');
      	var hC : HeaderContent = new HeaderContent();
      	hC.Title = new Label(m_report.CurrentLanguage, q1st.text);
      	hS.SubHeaders.Add(hC);
      	table.ColumnHeaders.Add(hS);

      	hS = new HeaderSegment();
      	hS.DataSourceNodeId = 'ds0';
      	hS.Label = new Label(m_report.CurrentLanguage, '2.');
      	hC = new HeaderContent();
      	hC.Title = new Label(m_report.CurrentLanguage, q2nd.text);
      	hS.SubHeaders.Add(hC);
      	table.ColumnHeaders.Add(hS);

      	//Rows - fill out the data too
      	//If we're working with Orgcode - add overall as the first one
      	var data = ParamUtil.GetParamCode(m_state, 'DATA');
      	var secondIndex = 1;

      	if(item1 == item2)
          	secondIndex = 0;

        if(demo.GetId() == Config.Hierarchy.VariableId){
          //Get the first Q
          var q = null;
          for(var j=0; j<demo.overall.questions.length; j++){
          	if(demo.overall.questions[j].GetId() == item1)
              q = demo.overall.questions[j];
          }

          //Get the second Q
          var q2 = null;
          for(var j=0; j<demo.overall.questions.length; j++){
          	if(demo.overall.questions[j].GetId() == item2)
              q2 = demo.overall.questions[j];
          }

          //Add the first question
          hC = new HeaderContent();
          hC.Title = new Label(m_report.CurrentLanguage, demo.overall.GetTitle());
          var score = 0;
          if(secondIndex != 0){
            score = data == 'fav' ? q.GetScores().fav : q.GetScores().unfav;
            if(!TableContent.isNotANumber(score))
            	hC.SetCellValue(0, score);
          }
          score = data == 'fav' ? q2.GetScores().fav : q2.GetScores().unfav;
          if(!TableContent.isNotANumber(score))
          	hC.SetCellValue(1, score);

          table.RowHeaders.Add(hC);
        }
      	for(var i = 0; i<demo.cuts.length; i++){
          //Get the first Q
          var q = null;
          for(var j=0; j<demo.cuts[i].questions.length; j++){
          	if(demo.cuts[i].questions[j].GetId() == item1)
              q = demo.cuts[i].questions[j];
          }

          //Get the second Q
          var q2 = null;
          for(var j=0; j<demo.cuts[i].questions.length; j++){
          	if(demo.cuts[i].questions[j].GetId() == item2)
              q2 = demo.cuts[i].questions[j];
          }

          //Add the first question
      	  hC = new HeaderContent();
          hC.Title = new Label(m_report.CurrentLanguage, demo.cuts[i].GetTitle());
          var score = 0;
          if(secondIndex != 0){
            score = data == 'fav' ? q.GetScores().fav : q.GetScores().unfav;
            if(!TableContent.isNotANumber(score))
            	hC.SetCellValue(0, score);
          }
          score = data == 'fav' ? q2.GetScores().fav : q2.GetScores().unfav;
          if(!TableContent.isNotANumber(score))
          	hC.SetCellValue(1, score);

          table.RowHeaders.Add(hC);
        }
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Generates NSQ Comparator
    public function GenerateNSQComparator(table : Table, confirmit){
    	table.Caching.Enabled = false;

  		//Get the config
      	var config = GetStandardHeaderConfig();

      	//Get the NSQ_PAGED or NSQ option
      	var displayAs = null;
      	var currentNSQId = null;
        var selectedQ = ParamUtil.Selected(m_report, m_state, 'NSQ_PAGED', m_user);

      	if(selectedQ == null){
          selectedQ = ParamUtil.Selected (m_report, m_state, 'NSQ', m_user);
      	  if(selectedQ == null)
      	  	currentNSQId = ParamLists.Get('NSQ', m_state, m_report)[0].Code;
          else
            currentNSQId = selectedQ.Code;
      	}
      	else{
      	  currentNSQId = selectedQ.Code.split(".")[0];
        }

      	//Get all NSQ questions from QM
      	var qm = QueryManager.GetQueryManagerMainNSQ(m_report, m_state, m_user, currentNSQId);
      	var allQs = qm.GetAllNSQ();

      	//Find appropriate question
      	var currentQuestion = null;
      	for(var i=0; i<allQs.length; i++){
          if(currentNSQId == allQs[i].GetId()){
          	currentQuestion = allQs[i];
            break;
          }
        }

      	//Add headers
      	AddNSQComparatorHeaders(table, config);

      	//Figure out if we want to show absolute or difference scores (if not predefined for NSQ_PAGED)
      	if(!ExecutionMode.isWeb(m_state))
          displayAs = Config.ExportNSQComparator.ExportAs;

        if(displayAs == null){
          displayAs = ParamUtil.GetParamCode(m_state, 'COMPARATOR_VALUETYPE');
        }
      	if(displayAs == null){
		  displayAs = ParamLists.Get('COMPARATOR_VALUETYPE', m_state, m_report)[0].Code;
		}

      	var displayAsAbsolute = displayAs == 'abs';

      	//Add precodes one by one
        for(var i=0; i<currentQuestion.precodes.length; i++){
          AddNSQComparatorPrecodeRow(table, config, i, currentQuestion, displayAsAbsolute);
        }

      	//Apply pagination
      	var selected = ParamUtil.Selected(m_report, m_state, 'NSQ_PAGED', m_user);
        if (selected != null) {
          table.RowsActiveRange.Start = selected.StartIndex;
          table.RowsActiveRange.End = selected.EndIndex;
        }
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
    private function AddNSQComparatorHeaders(table : Table, config, processedComparators){
      	/*config = {
          Item: boolean,
          ValidN: boolean,
          Fav: boolean,
          Neu: boolean,
          Unfav: boolean,
          DistributionChart: boolean,
          CompsInternal: {"Trend1": true, "Trend2": true, "Trend3": true, "Internal1": true,
                          "Internal2": true, "Internal3": true, "Internal4": true, "Internal5": true},
          CompsExternal: {"Norm1": true, "Norm2": true, "Norm3": true, "Norm4": true, "Norm5": true}
		};*/

      	//Get out labels from RT
      	var labels = ResourceText.List(m_report,'labels');
      	var currentLanguage = m_report.CurrentLanguage;

      	//Add highlight row column
        var hC : HeaderContent = new HeaderContent();
        hC.Title = new Label(currentLanguage, 'HighlighRowFlag');
        hC.HideData = true;
      	table.ColumnHeaders.Add(hC);

      	//Item
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['Item']);
  		hC.HideData = true;
        table.ColumnHeaders.Add(hC);

      	//ValidN
      	var hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, "N");
      	if(!config.ValidN){
        	hC.HideData = true;
        }
        table.ColumnHeaders.Add(hC);


      	//Pct
      	hC = new HeaderContent();
      	hC.Title = new Label(currentLanguage, "Pct");
        hC.HeaderId = 'fav';
      	if(!config.Fav){
          hC.HideData = true;
        }
        table.ColumnHeaders.Add(hC);

      	//Neu
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['PercentNeu']);
        hC.HeaderId = 'neu';
      	hC.HideData = true;
        table.ColumnHeaders.Add(hC);


      	//Unfav
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['PercentUnfav']);
        hC.HeaderId = 'unfav';
      	hC.HideData = true;
        table.ColumnHeaders.Add(hC);

      	//DistributionChart
        var hChart : HeaderChartCombo = new HeaderChartCombo();
        hChart.Title = new Label(currentLanguage, labels['Distribution']);
        hChart.HeaderId = 'barchart';

      	//Set formulas and colors for the chart
        hChart.TypeOfChart = ChartComboType.Bar;
		hChart.Size = 300;
		hChart.Thickness = "18px";
		var c1 : ChartComboValue = HelperUtil.CCV(labels['Distribution'], '#00b4eb', 'CELLV(col-4,row)');
		hChart.Values = [c1];

      	//In case of PPT or Excel execution mode we want to put another header segment above it due to
      	//some awkward styling
      	if(ExecutionMode.isPowerPoint(m_state) || ExecutionMode.isExcel(m_state)){
          var hSegAboveChart : HeaderSegment = new HeaderSegment();
          hSegAboveChart.DataSourceNodeId = 'ds0';
          hSegAboveChart.Label = new Label(currentLanguage, labels['Distribution']);
          hChart.HideHeader = true;

          if(!config.DistributionChart){
        	hChart.HideData = true;
            hSegAboveChart.HideData = true;
          }
          hSegAboveChart.SubHeaders.Add(hChart);
          table.ColumnHeaders.Add(hSegAboveChart);
      	}
      	else{
          if(!config.DistributionChart){
        	hChart.HideData = true;
          }
      	  table.ColumnHeaders.Add(hChart);
        }


      	//Let's check if we want to add comparator headers at all
      	var addCompsHeaders = (TableBuilder.AssocArrayContainsTrue(config.CompsInternal) || TableBuilder.AssocArrayContainsTrue(config.CompsExternal));

      	if(addCompsHeaders){
          	//Header above all comps
          	var hSegment : HeaderSegment = new HeaderSegment();
          	//we need to set DataSourceNodeId, but we really don't care about having this set
          	//since we're using content headers below this one anyway
          	hSegment.DataSourceNodeId = 'ds0';

          	//Figure out the label
          	var displayAs = null;

          	if(!ExecutionMode.isWeb(m_state))
              displayAs = Config.ExportNSQComparator.ExportAs;

            if(displayAs == null){
              displayAs = ParamUtil.GetParamCode(m_state, 'COMPARATOR_VALUETYPE');
            }
            if(displayAs == null){
              displayAs = ParamLists.Get('COMPARATOR_VALUETYPE', m_state, m_report)[0].Code;
            }

            var displayAsParam = ParamUtil.GetByValue(displayAs, m_report, m_state, 'COMPARATOR_VALUETYPE');

          	hSegment.Label = new Label(currentLanguage, displayAsParam.Label);

          	//Internal comps
          	// WATCH OUT FOR THE ORDER OF THOSE!!
          	// Create Map of internal Comparators
          	var internal_comparators;
          	if(processedComparators == null){
            	internal_comparators = ComparatorUtil.ProcessedComparators (m_report, m_state, m_user );
            }
          	else{
          		internal_comparators = processedComparators;
            }
			var comparators_map = {};
			for (var i=0; i<internal_comparators.length; ++i)
            	comparators_map [ internal_comparators[i].Code ] = internal_comparators[i];

          	//Trend1
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
           	hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Prev].Label);
            if(!config.CompsInternal["Trend1"]){
              hC.HideData = true;
           	}
            hSegment.SubHeaders.Add(hC);



          	//Trend2
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Prev2].Label);
          	if(!config.CompsInternal["Trend2"]){
              hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Trend3
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Prev3].Label);
          	if(!config.CompsInternal["Trend3"]){
              hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal1
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.TotalCompany].TableLabel);
          	if(!config.CompsInternal["Internal1"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal2
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.LevelUp].TableLabel);
          	if(!config.CompsInternal["Internal2"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal3
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Level2].TableLabel);
          	if(!config.CompsInternal["Internal3"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal4
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Custom1].TableLabel);
          	if(!config.CompsInternal["Internal4"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal5
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Custom2].TableLabel);
          	if(!config.CompsInternal["Internal5"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//External comps
          	var benchmarksetQ = m_report.DataSource.GetProject('ds0').GetQuestion('benchmarkset');
          	for(var i = 0; i<Config.Norms.Codes.length; i++){

                //Sigtest - hidden header used for stat. sig
                hC = new HeaderContent();
                hC.Title = new Label(currentLanguage, 'statsig');
                hC.HideData = !debug;
                hSegment.SubHeaders.Add(hC);

              	//Normal header
              	//Get Norm id
                var normId = NormUtil.GetNormId(m_user, i);
                var normName = benchmarksetQ.GetAnswer(normId).Text + ' ' + labels['norm'];
                hC = new HeaderContent();
                hC.Title = new Label(currentLanguage, normName);
              	if(!config.CompsExternal["Norm" + (i + 1)]){
                	hC.HideData = true;
                }
                hSegment.SubHeaders.Add(hC);
            }

          	//Add all to the table
          	table.ColumnHeaders.Add(hSegment);
        }
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	private function AddNSQComparatorPrecodeRow(table : Table, config, precodeIndex, question, displayCompsAsAbsolute){
      	/*config = {
          Item: boolean,
          ValidN: boolean,
          Fav: boolean,
          Neu: boolean,
          Unfav: boolean,
          DistributionChart: boolean,
          CompsInternal: {"Trend1": true, "Trend2": true, "Trend3": true, "Internal1": true,
                          "Internal2": true, "Internal3": true, "Internal4": true, "Internal5": true},
          CompsExternal: {"Norm1": true, "Norm2": true, "Norm3": true, "Norm4": true, "Norm5": true}
		};*/

      	var currentLanguage = m_report.CurrentLanguage;

      	//Add row to the table column
        var hC : HeaderContent = new HeaderContent();
      	var headerTitle = question.distributionTexts[precodeIndex];
      	hC.Title = new Label(currentLanguage, headerTitle);


      	var currentColumn = 2;

      	//ValidN
      	if(config.ValidN){
      		hC.SetCellValue(currentColumn, question.GetFullDistribution()[precodeIndex]);
        }
      	currentColumn++;

      	//Fav
      	if(config.Fav){
      		hC.SetCellValue(currentColumn, question.GetPercentages()[precodeIndex] + "%");
        }
      	currentColumn++;

      	//Padding - NEU and UNFAV options

      	currentColumn++;
      	currentColumn++;
      	//DistributionChart
      	//We don't need to fill anything for the distribution chart,
      	//but we want to increment currentColumn if it's included
      	currentColumn++;

      	//Let's check if we want to add comparator headers at all
      	//and if yes - add them
      	if(TableBuilder.AssocArrayContainsTrue(config.CompsInternal) || TableBuilder.AssocArrayContainsTrue(config.CompsExternal)){
          	//Internal comps
          	// WATCH OUT FOR THE ORDER OF THOSE!!

          	//Trend1
         	if(config.CompsInternal["Trend1"]){
              	hC.SetCellValue(currentColumn, question.internalComps[5].distribution[precodeIndex].GetStatSigCode());
              	hC.SetCellValue(currentColumn + 1, question.internalComps[5].distribution[precodeIndex].GetDisplayValue(displayCompsAsAbsolute));

          	}
          	currentColumn = currentColumn + 2;

          	//Trend2
         	if(config.CompsInternal["Trend2"]){
              	hC.SetCellValue(currentColumn, question.internalComps[6].distribution[precodeIndex].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[6].distribution[precodeIndex].GetDisplayValue(displayCompsAsAbsolute));
          	}
          	currentColumn = currentColumn + 2;

          	//Trend3
         	if(config.CompsInternal["Trend3"]){
              	hC.SetCellValue(currentColumn, question.internalComps[7].distribution[precodeIndex].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[7].distribution[precodeIndex].GetDisplayValue(displayCompsAsAbsolute));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal1
         	if(config.CompsInternal["Internal1"]){
              	hC.SetCellValue(currentColumn, question.internalComps[0].distribution[precodeIndex].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[0].distribution[precodeIndex].GetDisplayValue(displayCompsAsAbsolute));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal2
         	if(config.CompsInternal["Internal2"]){
              	hC.SetCellValue(currentColumn, question.internalComps[1].distribution[precodeIndex].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[1].distribution[precodeIndex].GetDisplayValue(displayCompsAsAbsolute));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal3
         	if(config.CompsInternal["Internal3"]){
              	hC.SetCellValue(currentColumn, question.internalComps[2].distribution[precodeIndex].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[2].distribution[precodeIndex].GetDisplayValue(displayCompsAsAbsolute));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal4
         	if(config.CompsInternal["Internal4"]){
              	hC.SetCellValue(currentColumn, question.internalComps[3].distribution[precodeIndex].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[3].distribution[precodeIndex].GetDisplayValue(displayCompsAsAbsolute));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal5
         	if(config.CompsInternal["Internal5"]){
              	hC.SetCellValue(currentColumn, question.internalComps[4].distribution[precodeIndex].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[4].distribution[precodeIndex].GetDisplayValue(displayCompsAsAbsolute));
          	}
          	currentColumn = currentColumn + 2;

          	//External comps
          	for(var i = 0; i<Config.Norms.Codes.length; i++){
              	if(config.CompsExternal["Norm" + (i + 1)]){
              		hC.SetCellValue(currentColumn, question.norms[i].distribution[precodeIndex].GetStatSigCode());
          			hC.SetCellValue(currentColumn + 1, question.norms[i].distribution[precodeIndex].GetDisplayValue(displayCompsAsAbsolute));
                }
              	currentColumn = currentColumn + 2;
            }
        }

      	//Add row to the table
      	table.RowHeaders.Add(hC);
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Generates NSQ IBT
    public function GenerateNSQIBT(table : Table, confirmit){
      	var demo = m_qm.GetAllNSQBreakBy();

      	//Set up the column headers
      	AddNSQIBTColumnHeaders(table, demo);

      	//Add each precode to the table
      	var displayAs = Page_NSQ.Selection_DisplayCompsAs(m_report, m_state, m_user).Code;
        for(var i=0; i<demo.overall.questions[0].precodes.length; i++){

          AddNSQIBTPrecode(table, demo, i, displayAs);
        }

      	//Apply pagination
      	var selected = ParamUtil.Selected(m_report, m_state, 'NSQIBT_PAGED', m_user);
        if (selected != null) {
          table.RowsActiveRange.Start = selected.StartIndex;
          table.RowsActiveRange.End = selected.EndIndex;
        }
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Ads all headers for NSQ IBT page
    private function AddNSQIBTColumnHeaders(table : Table, demo){
      	var currentLanguage = m_report.CurrentLanguage;

      	//Get out N values
      	var validNs = m_report.TableUtils.GetRowValues('N', 1);

  		//Overall
      	var hS : HeaderSegment = new HeaderSegment();
      	hS.DataSourceNodeId = 'ds0';
      	hS.Label = new Label(currentLanguage, demo.overall.GetTitle());

      	var hS2 : HeaderSegment = new HeaderSegment();
      	hS2.DataSourceNodeId = 'ds0';
      	var nLabel = 'N=';
      	var nLabel = validNs[0].Value < Config.Privacy.Table.MinN ? '-' : nLabel + validNs[0].Value; //APPLY MINIMUM N
      	hS2.Label = new Label(currentLanguage, nLabel);

      	hS.SubHeaders.Add(hS2);
      	table.ColumnHeaders.Add(hS);

      	//Demo label above all cuts
      	var selected = Page_NSQ.Selection_BreakBy(m_report, m_state, m_user);
      	hS = new HeaderSegment();
      	hS.DataSourceNodeId = 'ds0';
      	hS.Label = new Label(currentLanguage, selected.Label);

      	//Add all cuts under this one
        for(var i = 0; i<demo.cuts.length; i++){
          //Hidden stat sig
          var hSig : HeaderSegment = new HeaderSegment();
          hSig.DataSourceNodeId = 'ds0';
          hSig.Label = new Label(currentLanguage, 'sig');
          hSig.HideData = true;
          hS.SubHeaders.Add(hSig);

          //Label for the demo cut
          hS2 = new HeaderSegment();
          hS2.DataSourceNodeId = 'ds0';
          hS2.Label = new Label(currentLanguage, demo.cuts[i].GetTitle());

          //N information for the demo cut
          var hS3 : HeaderSegment = new HeaderSegment();
          hS3.DataSourceNodeId = 'ds0';
          nLabel = 'N=';
          nLabel = validNs[i+1].Value < Config.Privacy.Table.MinN ? '-' : nLabel + validNs[i+1].Value; //APPLY MINIMUM N
          hS3.Label = new Label(currentLanguage, nLabel);

          hS2.SubHeaders.Add(hS3);
          hS.SubHeaders.Add(hS2);
        }

      	table.ColumnHeaders.Add(hS);
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Adds one precode from a demography to the table
    private function AddNSQIBTPrecode(table : Table, demo, precodeIndex, showDiffAs){
   		var currentLanguage = m_report.CurrentLanguage;

      	//Add row to the table column
        var hC : HeaderContent = new HeaderContent();
      	var headerTitle = demo.overall.questions[0].distributionTexts[precodeIndex];
      	hC.Title = new Label(currentLanguage, headerTitle);


      	//Add overall score
        var columnOffset = 0;
        var score = demo.overall.questions[0].GetPercentages()[precodeIndex];
        hC.SetCellValue(columnOffset, score);
        columnOffset++;

        //Add score for all cuts
        for(var i = 0; i<demo.cuts.length; i++){
            score = '-';
            var sigCode = SigTest.Codes.None;

          	score = showDiffAs == 'abs' ? demo.cuts[i].questions[0].GetPercentages()[precodeIndex] :
                    demo.cuts[i].questions[0].GetPercentages()[precodeIndex] - demo.overall.questions[0].GetPercentages()[precodeIndex];

            if(demo.cuts[i].questions[0].GetPercentages()[precodeIndex] != '-' && demo.overall.questions[0].GetPercentages()[precodeIndex]!= '-')
              sigCode = HgComparator.StatSig(demo.cuts[i].questions[0].GetValidN(), demo.cuts[i].questions[0].GetPercentages()[precodeIndex],
                                             0, demo.overall.questions[0].GetValidN(), demo.overall.questions[0].GetPercentages()[precodeIndex], 0, true);

          	if(TableContent.isNotANumber(score)){
              	score = '-';
              	sigCode = SigTest.Codes.None;
          	}

            if(sigCode != SigTest.Codes.None){
            	score = score + Config.SigTest.Suffix;
            }

            hC.SetCellValue(columnOffset, sigCode);
            columnOffset++;

            hC.SetCellValue(columnOffset, score);
            columnOffset++;
        }

      	//Add row to the table
      	table.RowHeaders.Add(hC);
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Generates the Dimension details
  	public function GenerateDimensionDetails(table : Table, confirmit){
  		table.Caching.Enabled = false;

  		//Get the config
      	var config = GetStandardHeaderConfig();

      	//Get demography from QM
      	var qm = QueryManagerBreakByInterface.GetQM('DDETAILS', confirmit, m_report, m_user, m_state);
      	var demo = qm.GetCurrentDemoCore();

      	//If we are looking at the orgcode - hide all internal columns - it's a part of specifications
      	if(demo.GetId() == Config.Hierarchy.VariableId){
      	  config.CompsInternal["Internal1"] = false;
          config.CompsInternal["Internal2"] = false;
          config.CompsInternal["Internal3"] = false;
          config.CompsInternal["Internal4"] = false;
          config.CompsInternal["Internal5"] = false;
        }

      	//Add headers
      	AddDimDetailsHeaders(table, config, demo);

        //Add overall row
      	AddDimDetailsRow(table, config, demo.overall, null);

      	//Add demo header
        if(demo.GetId() == Config.Hierarchy.VariableId){
          //If orgcode is used we only want to put normal rows in
          for(var i=0; i<demo.cuts.length; i++){
              	AddDimDetailsRow(table, config, demo.cuts[i], null);
          }
        }
      	else{
          //If any other demo is used we want to put a header with the demo name in and stack all cuts under it
          var demoHeader : HeaderSegment = new HeaderSegment();
          demoHeader.DataSourceNodeId = 'ds0';
          demoHeader.Label = new Label(m_report.CurrentLanguage, demo.GetTitle());

          //Put cut headers under demo header
          for(var i=0; i<demo.cuts.length; i++){
            	AddDimDetailsRow(table, config, demo.cuts[i], demoHeader);
          }

          //Add the demo header to the table
          table.RowHeaders.Add(demoHeader);
        }
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Adds dimension details column headers to a table based on config provided
  	//Can add following columns: Fav, Neu, Unfav, Distribution-chart, Comps/Internal+External comps
  	//Optional parameter (last one) is processedComparators, needed for comparators, can be optained using ComparatorUtil.ProcessedComaprators() function
  	private function AddDimDetailsHeaders(table : Table, config, demo, processedComparators){
  		/*config = {
		  FullDistribution : boolean,
          Item: boolean,
          ValidN: boolean,
          Fav: boolean,
          Neu: boolean,
          Unfav: boolean,
          DistributionChart: boolean,
          CompsInternal: {"Trend1": true, "Trend2": true, "Trend3": true, "Internal1": true,
                          "Internal2": true, "Internal3": true, "Internal4": true, "Internal5": true},
          CompsExternal: {"Norm1": true, "Norm2": true, "Norm3": true, "Norm4": true, "Norm5": true}
		};*/

      	//Get out labels from RT
      	var labels = ResourceText.List(m_report,'labels');
      	var currentLanguage = m_report.CurrentLanguage;

    	//Add highlight row column
        var hC : HeaderContent = new HeaderContent();
        hC.Title = new Label(currentLanguage, 'HighlighRowFlag');
        hC.HideData = true;
      	table.ColumnHeaders.Add(hC);

      	//ValidN
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['ValidN']);
        hC.HideData = true;
        table.ColumnHeaders.Add(hC);

      	//Fav
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['PercentFav']);
        hC.HeaderId = 'fav';
      	if(!config.Fav){
          hC.HideData = true;
        }
        table.ColumnHeaders.Add(hC);


      	//Neu
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['PercentNeu']);
        hC.HeaderId = 'neu';
      	if(!config.Neu){
        	hC.HideData = true;
        }
        table.ColumnHeaders.Add(hC);


      	//Unfav
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['PercentUnfav']);
        hC.HeaderId = 'unfav';
      	if(!config.Unfav){
        	hC.HideData = true;
        }
        table.ColumnHeaders.Add(hC);


      	//DistributionChart
        var hChart : HeaderChartCombo = new HeaderChartCombo();
        hChart.Title = new Label(currentLanguage, labels['Distribution']);
        hChart.HeaderId = 'barchart';
      	//Set formulas and colors for the chart
        HelperUtil.UpdateBarChart(m_report, hChart);

      	//In case of PPT or Excel execution mode we want to put another header segment above it due to
      	//some awkward styling
      	if(ExecutionMode.isPowerPoint(m_state) || ExecutionMode.isExcel(m_state)){
          var hSegAboveChart : HeaderSegment = new HeaderSegment();
          hSegAboveChart.DataSourceNodeId = 'ds0';
          hSegAboveChart.Label = new Label(currentLanguage, labels['Distribution']);
          hChart.HideHeader = true;

          if(!config.DistributionChart){
        	hChart.HideData = true;
            hSegAboveChart.HideData = true;
          }
          hSegAboveChart.SubHeaders.Add(hChart);
          table.ColumnHeaders.Add(hSegAboveChart);
      	}
      	else{
          if(!config.DistributionChart){
        	hChart.HideData = true;
          }
      	  table.ColumnHeaders.Add(hChart);
        }

      	//Let's check if we want to add comparator headers at all
      	var addCompsHeaders = (TableBuilder.AssocArrayContainsTrue(config.CompsInternal) || TableBuilder.AssocArrayContainsTrue(config.CompsExternal));

      	if(addCompsHeaders){
          	//Header above all comps
          	var hSegment : HeaderSegment = new HeaderSegment();
          	//we need to set DataSourceNodeId, but we really don't care about having this set
          	//since we're using content headers below this one anyway
          	hSegment.DataSourceNodeId = 'ds0';
          	hSegment.Label = new Label(currentLanguage, labels['FavvsComparator']);

          	//Internal comps
          	// WATCH OUT FOR THE ORDER OF THOSE!!
          	// Create Map of internal Comparators
          	var internal_comparators;
          	if(processedComparators == null){
            	internal_comparators = ComparatorUtil.ProcessedComparators (m_report, m_state, m_user );
            }
          	else{
          		internal_comparators = processedComparators;
            }
			var comparators_map = {};
			for (var i=0; i<internal_comparators.length; ++i)
            	comparators_map [ internal_comparators[i].Code ] = internal_comparators[i];

          	//Trend1
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = true;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
           	hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Prev].Label);
            if(!config.CompsInternal["Trend1"]){
              hC.HideData = true;
           	}
            hSegment.SubHeaders.Add(hC);



          	//Trend2
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = true;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Prev2].Label);
          	if(!config.CompsInternal["Trend2"]){
              hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Trend3
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = true;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Prev3].Label);
          	if(!config.CompsInternal["Trend3"]){
              hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal1
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = true;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.TotalCompany].TableLabel);
          	if(!config.CompsInternal["Internal1"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal2
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = true;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.LevelUp].TableLabel);
          	if(!config.CompsInternal["Internal2"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal3
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = true;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Level2].TableLabel);
          	if(!config.CompsInternal["Internal3"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal4
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = true;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Custom1].TableLabel);
          	if(!config.CompsInternal["Internal4"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal5
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = true;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Custom2].TableLabel);
          	if(!config.CompsInternal["Internal5"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//External comps
          	var benchmarksetQ = m_report.DataSource.GetProject('ds0').GetQuestion('benchmarkset');
          	for(var i = 0; i<Config.Norms.Codes.length; i++){

                //Sigtest - hidden header used for stat. sig
                hC = new HeaderContent();
                hC.Title = new Label(currentLanguage, 'statsig');
                hC.HideData = true;
                hSegment.SubHeaders.Add(hC);

              	//Normal header
              	//Get Norm id
                var normId = NormUtil.GetNormId(m_user, i);
                var normName = benchmarksetQ.GetAnswer(normId).Text + ' ' + labels['norm'];
                hC = new HeaderContent();
                hC.Title = new Label(currentLanguage, normName);
              	if(!config.CompsExternal["Norm" + (i + 1)]){
                	hC.HideData = true;
                }
                hSegment.SubHeaders.Add(hC);
            }

          	//Add all to the table
          	table.ColumnHeaders.Add(hSegment);
        }
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Adds a row of data (demoCut) to DimensionDetails page
  	//Adds folowing data: Valid N, fav, neu, unfav, chart, comparators
  	//Last comparator is optional and when provided - this function will add a row under this passed header, not in the table itself
    private function AddDimDetailsRow(table, config, demoCut, headerToBeAddedUnder){
      	/*config = {
          Item: boolean,
          ValidN: boolean,
          Fav: boolean,
          Neu: boolean,
          Unfav: boolean,
          DistributionChart: boolean,
          CompsInternal: {"Trend1": true, "Trend2": true, "Trend3": true, "Internal1": true,
                          "Internal2": true, "Internal3": true, "Internal4": true, "Internal5": true},
          CompsExternal: {"Norm1": true, "Norm2": true, "Norm3": true, "Norm4": true, "Norm5": true}
		};*/
      	var currentLanguage = m_report.CurrentLanguage;

      	//Get currently selected dimension - if null, revert to the first item we can find
        var selected = HelperUtil.CurrentDimension(m_report, m_state);
        if (selected == null)
            selected = ParamLists.Get('DIMENSION', m_state, m_report, m_user)[0];
        var dimId = selected.Code;

      	//Add row to the table column
        var hC : HeaderContent = new HeaderContent();
      	hC.Title = new Label(currentLanguage, demoCut.GetTitle());

      	var currentColumn = 0;
      	var dimension = demoCut.dimensions;

      	for(var i=0; i<dimension.length; i++){
          	if (dimension[i].GetId() == dimId)
              	var dimIndex = i;
      	}

      	//Highlight row flag
      	hC.SetCellValue(currentColumn, 0);
      	currentColumn++

      	//ValidN
      	if(config.ValidN){
      		hC.SetCellValue(currentColumn, dimension[dimIndex].GetValidN());
        }
      	currentColumn++;

      	//We have to get the score of the required dimension
      	var scores=dimension[dimIndex].GetScores();

      	//Fav
      	if(config.Fav){
      		hC.SetCellValue(currentColumn, scores.fav);
        }
      	currentColumn++;

      	//Neu
      	if(config.Neu){
      		hC.SetCellValue(currentColumn, scores.neu);
        }
        currentColumn++;

      	//Unfav
      	if(config.Unfav){
      		hC.SetCellValue(currentColumn, scores.unfav);
        }
      	currentColumn++;

      	//DistributionChart
      	//We don't need to fill anything for the distribution chart,
      	//but we want to increment currentColumn if it's included
      	currentColumn++;

      	//Let's check if we want to add comparator headers at all
      	//and if yes - add them
      	if(TableBuilder.AssocArrayContainsTrue(config.CompsInternal) || TableBuilder.AssocArrayContainsTrue(config.CompsExternal)){
          	//Internal comps
          	// WATCH OUT FOR THE ORDER OF THOSE!!

          	//Trend1
          	var trend1=0;

         	if(config.CompsInternal["Trend1"]){
              	hC.SetCellValue(currentColumn, dimension[dimIndex].internalComps[5].GetStatSigCode());
              	hC.SetCellValue(currentColumn + 1, dimension[dimIndex].internalComps[5].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Trend2
         	if(config.CompsInternal["Trend2"]){
              	hC.SetCellValue(currentColumn, dimension[dimIndex].internalComps[6].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, dimension[dimIndex].internalComps[6].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Trend3
         	if(config.CompsInternal["Trend3"]){
              	hC.SetCellValue(currentColumn, dimension[dimIndex].internalComps[7].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, dimension[dimIndex].internalComps[7].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal1
         	if(config.CompsInternal["Internal1"]){
              	hC.SetCellValue(currentColumn, dimension[dimIndex].internalComps[0].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, dimension[dimIndex].internalComps[0].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal2
         	if(config.CompsInternal["Internal2"]){
              	hC.SetCellValue(currentColumn, dimension[dimIndex].internalComps[1].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, dimension[dimIndex].internalComps[1].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal3
         	if(config.CompsInternal["Internal3"]){
              	hC.SetCellValue(currentColumn, dimension[dimIndex].internalComps[2].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, dimension[dimIndex].internalComps[2].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal4
         	if(config.CompsInternal["Internal4"]){
              	hC.SetCellValue(currentColumn, dimension[dimIndex].internalComps[3].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, dimension[dimIndex].internalComps[3].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal5
         	if(config.CompsInternal["Internal5"]){
              	hC.SetCellValue(currentColumn, dimension[dimIndex].internalComps[4].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, dimension[dimIndex].internalComps[4].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//External comps
          	for(var i = 0; i<Config.Norms.Codes.length; i++){
              	var norm=0;
              	if(config.CompsExternal["Norm" + (i + 1)]){
              		hC.SetCellValue(currentColumn, dimension[dimIndex].norms[i].GetStatSigCode());
          			hC.SetCellValue(currentColumn + 1, dimension[dimIndex].norms[i].GetDisplayValue(false));
                }
              	currentColumn = currentColumn + 2;
            }
        }

      	//Add row to the table
      	if(headerToBeAddedUnder != null){
      		headerToBeAddedUnder.SubHeaders.Add(hC);
        }
        else{
          	table.RowHeaders.Add(hC);
        }
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Generates Questions by Dimension
  	public function GenerateQuestionByDimension(table : Table){
		//Get the config
       	var config = GetStandardHeaderConfig();

      	var titlesInRowHeaders = false;
      	//In case of PPTs
      	if(ExecutionMode.isPowerPoint(m_state)){
        	titlesInRowHeaders = true;
        }

      	//Let's add our standard content headers
      	AddStandardColumnHeaders(table, config);

      	//Get currently selected dimension - if null, revert to the first item we can find
      	var selected = HelperUtil.CurrentDimension(m_report, m_state);
        if (selected == null)
           	selected = ParamLists.Get('DIMENSION', m_state, m_report, m_user)[0];
      	var dimId = selected.Code;

      	//Get the dimension
      	var qm = QueryManager.GetQueryManagerMain(m_report, m_state, m_user, true);
        var dimension = qm.GetOneDimensionById(dimId);

      	//Add the data to the table
      	AddStandardDimensionRow(table, config, dimension, titlesInRowHeaders);
      	for(var j = 0; j<dimension.questions.length; j++){
        	AddStandardQuestionRow(table, config, dimension.questions[j], titlesInRowHeaders);
        }
  	}
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Generates Question Detail table
  	public function GenerateQuestionDetails(table : Table, confirmit){
  		table.Caching.Enabled = false;

  		//Get the config
      	var config = GetStandardHeaderConfig();

      	//Get demography from QM
      	var qm = QueryManagerBreakByInterface.GetQM('QDETAILS', confirmit, m_report, m_user, m_state);
      	var demo = qm.GetCurrentDemo();

      	//Add the full distribution property to the config - it's a unique property only used on QuestionDetails page
      	var distribution = ParamUtil.Selected(m_report, m_state, 'DISTRIBUTION');
      	config['FullDistribution'] = distribution == null ? false : distribution.ShowDistribution;

      	//If we are looking at the orgcode - hide all internal columns - it's a part of specifications
      	if(demo.GetId() == Config.Hierarchy.VariableId){
      	  config.CompsInternal["Internal1"] = false;
          config.CompsInternal["Internal2"] = false;
          config.CompsInternal["Internal3"] = false;
          config.CompsInternal["Internal4"] = false;
          config.CompsInternal["Internal5"] = false;
        }

      	//Add headers
      	AddQuestionDetailsHeaders(table, config, demo);

      	//Add overall row
      	AddQuestionDetailsRow(table, config, demo.overall, null);

      	//Add demo header
        if(demo.GetId() == Config.Hierarchy.VariableId){
          //If orgcode is used we only want to put normal rows in
          for(var i=0; i<demo.cuts.length; i++){
              AddQuestionDetailsRow(table, config, demo.cuts[i], null);
          }
        }
      	else{
          //If any other demo is used we want to put a header with the demo name in and stack all cuts under it
          var demoHeader : HeaderSegment = new HeaderSegment();
          demoHeader.DataSourceNodeId = 'ds0';
          demoHeader.Label = new Label(m_report.CurrentLanguage, demo.GetTitle());

          //Put cut headers under demo header
          for(var i=0; i<demo.cuts.length; i++){
              AddQuestionDetailsRow(table, config, demo.cuts[i], demoHeader);
          }

          //Add the demo header to the table
          table.RowHeaders.Add(demoHeader);
        }
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Adds question details column headers to a table based on config provided
  	//Can add following columns: full distribution, ValidN, Fav, Neu, Unfav, Distribution-chart, Comps/Internal+External comps
  	//Optional parameter (last one) is processedComparators, needed for comparators, can be optained using ComparatorUtil.ProcessedComaprators() function
  	private function AddQuestionDetailsHeaders(table : Table, config, demo, processedComparators){
  		/*config = {
		  FullDistribution : boolean,
          Item: boolean,
          ValidN: boolean,
          Fav: boolean,
          Neu: boolean,
          Unfav: boolean,
          DistributionChart: boolean,
          CompsInternal: {"Trend1": true, "Trend2": true, "Trend3": true, "Internal1": true,
                          "Internal2": true, "Internal3": true, "Internal4": true, "Internal5": true},
          CompsExternal: {"Norm1": true, "Norm2": true, "Norm3": true, "Norm4": true, "Norm5": true}
		};*/

      	//Get out labels from RT
      	var labels = ResourceText.List(m_report,'labels');
      	var currentLanguage = m_report.CurrentLanguage;

    	//Add highlight row column
        var hC : HeaderContent = new HeaderContent();
        hC.Title = new Label(currentLanguage, 'HighlighRowFlag');
        hC.HideData = true;
      	table.ColumnHeaders.Add(hC);

		//Full distribution
      	if(config['FullDistribution']){
          	//Create the header above R1-R5 options
          	var hSDist : HeaderSegment = new HeaderSegment();
          	hSDist.DataSourceNodeId = 'ds0';
          	hSDist.Label = new Label(currentLanguage, labels['PercentDistribution']);

      		var count = demo.overall.questions[0].answerCount;
          	for(var i =0; i<count; i++){
          		hC = new HeaderContent();
        		hC.Title = new Label(currentLanguage, 'R'+ (i + 1));
              	hC.HideData = false;
              	hSDist.SubHeaders.Add(hC);
            }

          	//Add all to the table
          	table.ColumnHeaders.Add(hSDist);
        }

      	//ValidN
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['ValidN']);
      	if(!config.ValidN){
        	hC.HideData = true;
        }
        table.ColumnHeaders.Add(hC);


      	//Fav
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['PercentFav']);
        hC.HeaderId = 'fav';
      	if(!config.Fav){
          hC.HideData = true;
        }
        table.ColumnHeaders.Add(hC);


      	//Neu
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['PercentNeu']);
        hC.HeaderId = 'neu';
      	if(!config.Neu){
        	hC.HideData = true;
        }
        table.ColumnHeaders.Add(hC);


      	//Unfav
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['PercentUnfav']);
        hC.HeaderId = 'unfav';
      	if(!config.Unfav){
        	hC.HideData = true;
        }
        table.ColumnHeaders.Add(hC);


      	//DistributionChart
        var hChart : HeaderChartCombo = new HeaderChartCombo();
        hChart.Title = new Label(currentLanguage, labels['Distribution']);
        hChart.HeaderId = 'barchart';
      	//Set formulas and colors for the chart
        HelperUtil.UpdateBarChart(m_report, hChart);

      	//In case of PPT or Excel execution mode we want to put another header segment above it due to
      	//some awkward styling
      	if(ExecutionMode.isPowerPoint(m_state) || ExecutionMode.isExcel(m_state)){
          var hSegAboveChart : HeaderSegment = new HeaderSegment();
          hSegAboveChart.DataSourceNodeId = 'ds0';
          hSegAboveChart.Label = new Label(currentLanguage, labels['Distribution']);
          hChart.HideHeader = true;

          if(!config.DistributionChart){
        	hChart.HideData = true;
            hSegAboveChart.HideData = true;
          }
          hSegAboveChart.SubHeaders.Add(hChart);
          table.ColumnHeaders.Add(hSegAboveChart);
      	}
      	else{
          if(!config.DistributionChart){
        	hChart.HideData = true;
          }
      	  table.ColumnHeaders.Add(hChart);
        }

      	//Let's check if we want to add comparator headers at all
      	var addCompsHeaders = (TableBuilder.AssocArrayContainsTrue(config.CompsInternal) || TableBuilder.AssocArrayContainsTrue(config.CompsExternal));

      	if(addCompsHeaders){
          	//Header above all comps
          	var hSegment : HeaderSegment = new HeaderSegment();
          	//we need to set DataSourceNodeId, but we really don't care about having this set
          	//since we're using content headers below this one anyway
          	hSegment.DataSourceNodeId = 'ds0';
          	hSegment.Label = new Label(currentLanguage, labels['FavvsComparator']);

          	//Internal comps
          	// WATCH OUT FOR THE ORDER OF THOSE!!
          	// Create Map of internal Comparators
          	var internal_comparators;
          	if(processedComparators == null){
            	internal_comparators = ComparatorUtil.ProcessedComparators (m_report, m_state, m_user );
            }
          	else{
          		internal_comparators = processedComparators;
            }
			var comparators_map = {};
			for (var i=0; i<internal_comparators.length; ++i)
            	comparators_map [ internal_comparators[i].Code ] = internal_comparators[i];

          	//Trend1
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
           	hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Prev].Label);
            if(!config.CompsInternal["Trend1"]){
              hC.HideData = true;
           	}
            hSegment.SubHeaders.Add(hC);



          	//Trend2
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Prev2].Label);
          	if(!config.CompsInternal["Trend2"]){
              hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Trend3
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Prev3].Label);
          	if(!config.CompsInternal["Trend3"]){
              hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal1
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.TotalCompany].TableLabel);
          	if(!config.CompsInternal["Internal1"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal2
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.LevelUp].TableLabel);
          	if(!config.CompsInternal["Internal2"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal3
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Level2].TableLabel);
          	if(!config.CompsInternal["Internal3"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal4
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Custom1].TableLabel);
          	if(!config.CompsInternal["Internal4"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal5
          	//Sigtest - hidden header used for stat. sig
          	hC = new HeaderContent();
          	hC.Title = new Label(currentLanguage, 'statsig');
          	hC.HideData = !debug;
          	hSegment.SubHeaders.Add(hC);
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Custom2].TableLabel);
          	if(!config.CompsInternal["Internal5"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//External comps
          	var benchmarksetQ = m_report.DataSource.GetProject('ds0').GetQuestion('benchmarkset');
          	for(var i = 0; i<Config.Norms.Codes.length; i++){

                //Sigtest - hidden header used for stat. sig
                hC = new HeaderContent();
                hC.Title = new Label(currentLanguage, 'statsig');
                hC.HideData = !debug;
                hSegment.SubHeaders.Add(hC);

              	//Normal header
              	//Get Norm id
                var normId = NormUtil.GetNormId(m_user, i);
                var normName = benchmarksetQ.GetAnswer(normId).Text + ' ' + labels['norm'];
                hC = new HeaderContent();
                hC.Title = new Label(currentLanguage, normName);
              	if(!config.CompsExternal["Norm" + (i + 1)]){
                	hC.HideData = true;
                }
                hSegment.SubHeaders.Add(hC);
            }

          	//Add all to the table
          	table.ColumnHeaders.Add(hSegment);
        }
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Adds a row of data (demoCut) to QuestionDetails page
  	//Adds folowing data: full distribution (optional), Valid N, fav, neu, unfav, chart, comparators
  	//Last comparator is optional and when provided - this function will add a row under this passed header, not in the table itself
    private function AddQuestionDetailsRow(table, config, demoCut, headerToBeAddedUnder){
      	/*config = {
          Item: boolean,
          ValidN: boolean,
          Fav: boolean,
          Neu: boolean,
          Unfav: boolean,
          DistributionChart: boolean,
          CompsInternal: {"Trend1": true, "Trend2": true, "Trend3": true, "Internal1": true,
                          "Internal2": true, "Internal3": true, "Internal4": true, "Internal5": true},
          CompsExternal: {"Norm1": true, "Norm2": true, "Norm3": true, "Norm4": true, "Norm5": true}
		};*/

      	var currentLanguage = m_report.CurrentLanguage;

      	//Add row to the table column
        var hC : HeaderContent = new HeaderContent();
      	hC.Title = new Label(currentLanguage, demoCut.GetTitle());

      	var currentColumn = 0;
      	var question = demoCut.questions[0];

      	//Highlight row flag
      	hC.SetCellValue(currentColumn, 0);
      	currentColumn++

      	//Full distribution
      	if(config['FullDistribution']){
      		var count = question.answerCount;
          	for(var i =0; i<count; i++){
              	var scoreDist = question.distributionPercent[i];
          		hC.SetCellValue(currentColumn, scoreDist);
              	currentColumn++;
            }
        }

      	//ValidN
      	if(config.ValidN){
      		hC.SetCellValue(currentColumn, question.tableValidN);
        }
      	currentColumn++;

      	//Get scores out
      	var scores = question.GetScores();

      	//Fav
      	if(config.Fav){
      		hC.SetCellValue(currentColumn, scores.fav);
        }
      	currentColumn++;

      	//Neu
      	if(config.Neu){
      		hC.SetCellValue(currentColumn, scores.neu);
        }
        currentColumn++;

      	//Unfav
      	if(config.Unfav){
      		hC.SetCellValue(currentColumn, scores.unfav);
        }
      	currentColumn++;

      	//DistributionChart
      	//We don't need to fill anything for the distribution chart,
      	//but we want to increment currentColumn if it's included
      	currentColumn++;

      	//Let's check if we want to add comparator headers at all
      	//and if yes - add them
      	if(TableBuilder.AssocArrayContainsTrue(config.CompsInternal) || TableBuilder.AssocArrayContainsTrue(config.CompsExternal)){
          	//Internal comps
          	// WATCH OUT FOR THE ORDER OF THOSE!!

          	//Trend1
         	if(config.CompsInternal["Trend1"]){
              	hC.SetCellValue(currentColumn, question.internalComps[5].GetStatSigCode());
              	hC.SetCellValue(currentColumn + 1, question.internalComps[5].GetDisplayValue(false));

          	}
          	currentColumn = currentColumn + 2;

          	//Trend2
         	if(config.CompsInternal["Trend2"]){
              	hC.SetCellValue(currentColumn, question.internalComps[6].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[6].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Trend3
         	if(config.CompsInternal["Trend3"]){
              	hC.SetCellValue(currentColumn, question.internalComps[7].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[7].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal1
         	if(config.CompsInternal["Internal1"]){
              	hC.SetCellValue(currentColumn, question.internalComps[0].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[0].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal2
         	if(config.CompsInternal["Internal2"]){
              	hC.SetCellValue(currentColumn, question.internalComps[1].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[1].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal3
         	if(config.CompsInternal["Internal3"]){
              	hC.SetCellValue(currentColumn, question.internalComps[2].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[2].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal4
         	if(config.CompsInternal["Internal4"]){
              	hC.SetCellValue(currentColumn, question.internalComps[3].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[3].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//Internal5
         	if(config.CompsInternal["Internal5"]){
              	hC.SetCellValue(currentColumn, question.internalComps[4].GetStatSigCode());
          		hC.SetCellValue(currentColumn + 1, question.internalComps[4].GetDisplayValue(false));
          	}
          	currentColumn = currentColumn + 2;

          	//External comps
          	for(var i = 0; i<Config.Norms.Codes.length; i++){
              	if(config.CompsExternal["Norm" + (i + 1)]){
              		hC.SetCellValue(currentColumn, question.norms[i].GetStatSigCode());
          			hC.SetCellValue(currentColumn + 1, question.norms[i].GetDisplayValue(false));
                }
              	currentColumn = currentColumn + 2;
            }
        }

      	//Add row to the table
      	if(headerToBeAddedUnder != null){
      		headerToBeAddedUnder.SubHeaders.Add(hC);
        }
        else{
          	table.RowHeaders.Add(hC);
        }
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Generates ENPS Gap t0 table
  	public function GenerateENPSGap(table : Table, confirmit){
    	table.Caching.Enabled = false;

      	//Get the demo
      	var qm = null;
      	if(m_qm == null)
      		var qm = QueryManagerBreakByInterface.GetQM('ENPSGAP', confirmit, m_report, m_user, m_state);
      	else
          	qm = m_qm;

      	var demo = qm.GetCurrentDemoCore();

      	//Get out labels from RT
      	var labels = ResourceText.List(m_report,'labels');

      	//Check what information we're looking for - dimensions, questions or top 10 questions?
      	// CONTENT
		var content = ParamUtil.Selected (m_report, m_state, 'EEF_GAP_PLOT');
      	var selected = ParamUtil.Selected (m_report, m_state, 'NPS_GAP');

      	//Take out dimensions or questions based on selection
      	var usingDims = false;
      	var data = {firstCut : null, secondCut : null};
      	var cutLabels = {firstCut : null, secondCut : null};
      	switch(content.Code){
          case '1': //All dimensions
            usingDims = true;
            data.firstCut = demo.cuts[1].dimensions;
            data.secondCut = demo.cuts[0].dimensions;
            cutLabels.firstCut = labels['Promoters'];
            cutLabels.secondCut = (selected.Label+'');
            break;
          case '2': //Top 10 questions sorted by EEF GAP score
            table.Sorting.Rows.TopN = content.TopN;

            data.firstCut = demo.cuts[1].questions;
            data.secondCut = demo.cuts[0].questions;
            cutLabels.firstCut = labels['Promoters'];
            cutLabels.secondCut = (selected.Label+'');
            break;
          case '3': //All questions
            data.firstCut = demo.cuts[1].questions;
            data.secondCut = demo.cuts[0].questions;
            cutLabels.firstCut = labels['Promoters'];
            cutLabels.secondCut = (selected.Label+'');
            break;
          default:

        }

      	//Add column headers
      	var currentLanguage = m_report.CurrentLanguage;

      	//Add Item column
        var hC : HeaderContent = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['Item']);
      	table.ColumnHeaders.Add(hC);

      	//Add fav and chart with a header for first cut
      	var hS : HeaderSegment = new HeaderSegment();
      	hS.DataSourceNodeId = 'ds0';
      	hS.Label = new Label(currentLanguage, ResourceText.Text(m_report,'effectiveness_profile','DataFavorably').split('[COMPANY]').join(cutLabels.secondCut.toUpperCase()));
      	  //Fav
          hC = new HeaderContent();
          hC.Title = new Label(currentLanguage, labels['PercentFav']);
          hS.SubHeaders.Add(hC);
          //Chart
          var hCC = new HeaderChartCombo();
          hCC.Title = new Label(currentLanguage, labels['Chart']);
          HelperUtil.UpdateBarChart100(m_report, hCC, selected.Color);
          hS.SubHeaders.Add(hCC);

        table.ColumnHeaders.Add(hS);

      	//Add fav and chart with a header for second cut
      	hS  = new HeaderSegment();
      	hS.DataSourceNodeId = 'ds0';
      	hS.Label = new Label(currentLanguage, ResourceText.Text(m_report,'effectiveness_profile','DataFavorably').split('[COMPANY]').join(cutLabels.firstCut.toUpperCase()));
      	  //Fav
          hC = new HeaderContent();
          hC.Title = new Label(currentLanguage, labels['PercentFav']);
          hS.SubHeaders.Add(hC);
          //Chart
          hCC = new HeaderChartCombo();
          hCC.Title = new Label(currentLanguage, labels['Chart']);
      	  HelperUtil.UpdateBarChart100(m_report, hCC, Config.Colors.GreenAlternative);
          hS.SubHeaders.Add(hCC);

        table.ColumnHeaders.Add(hS);

      	//Add the gap header
        var hF : HeaderFormula = new HeaderFormula();
      	hF.Type = FormulaType.Expression;
        hF.HeaderId = 'diff';
      	hF.Title = new Label(currentLanguage, ResourceText.Text(m_report, 'net_promoter_gap', 'PercentFavgap'));
      	hF.Expression = 'CELLV(col-2,row)-CELLV(col-4,row)';

      	table.ColumnHeaders.Add(hF);

      	//Add rows and fill in data
      	for(var i=0; i<data.firstCut.length; i++){
          	var rowHeader : HeaderContent= new HeaderContent();
          	rowHeader.Title = usingDims ? new Label(currentLanguage, '◊') : new Label(currentLanguage, data.firstCut[i].GetDisplayId());
          	var item = usingDims ? data.firstCut[i].GetTitle() : data.firstCut[i].text;
          	rowHeader.SetCellValue(0, item);
          	rowHeader.SetCellValue(1, data.secondCut[i].GetScores().fav);
          	rowHeader.SetCellValue(3, data.firstCut[i].GetScores().fav);
          	table.RowHeaders.Add(rowHeader);
        }

      	//Sort the table
        table.Sorting.Rows.SortByType = TableSortByType.Header;
        table.Sorting.Rows.SortByHeaderId = 'diff';
        table.Sorting.Rows.Direction = TableSortDirection.Descending;
      	table.Sorting.Rows.Enabled = true;
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Generates ENPS details t0 table
    public function GenerateENPSDetails(table : Table, confirmit){
      	table.Caching.Enabled = false;

      	//Get the demo
      	var qm = null;
      	if(m_qm == null)
      		var qm = QueryManagerBreakByInterface.GetQM('ENPSDETAILS', confirmit, m_report, m_user, m_state);
      	else
          	qm = m_qm;

      	var demo = qm.GetCurrentDemo();

      	//We need to add following headers: highlight flag, N, Promoters, passives, detractors, chart, ENPS score
      	//Get out labels from RT
      	var labels = ResourceText.List(m_report,'labels');
      	var currentLanguage = m_report.CurrentLanguage;

    	//Add highlight row column
        var hC : HeaderContent = new HeaderContent();
        hC.Title = new Label(currentLanguage, 'HighlighRowFlag');
        hC.HideData = true;
      	table.ColumnHeaders.Add(hC);

      	//ValidN
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['ValidN']);
        table.ColumnHeaders.Add(hC);

      	//Segment header above passives, etc.
        var hS : HeaderSegment = new HeaderSegment();
      	hS.DataSourceNodeId = 'ds0';
      	hS.Label = new Label(currentLanguage, labels['PercentDistribution']);

      	//Fav
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['Promoters']);
        hC.HeaderId = 'fav';
        hS.SubHeaders.Add(hC);

      	//Neu
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['Passives']);
        hC.HeaderId = 'neu';
        hS.SubHeaders.Add(hC);

      	//Unfav
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['Detractors']);
        hC.HeaderId = 'unfav';
      	hS.SubHeaders.Add(hC);
        table.ColumnHeaders.Add(hS);

      	//DistributionChart
      	var hChart : HeaderChartCombo = new HeaderChartCombo();
        hChart.Title = new Label(currentLanguage, labels['Distribution']);
        hChart.HeaderId = 'barchart';
        //Set formulas and colors for the chart
        HelperUtil.UpdateBarChart(m_report, hChart);

      	//In case of PPT or Excel execution mode we want to put another header segment above it due to
      	//some awkward styling
      	if(ExecutionMode.isPowerPoint(m_state) || ExecutionMode.isExcel(m_state)){
          var hSegAboveChart : HeaderSegment = new HeaderSegment();
          hSegAboveChart.DataSourceNodeId = 'ds0';
          hSegAboveChart.Label = new Label(currentLanguage, labels['Distribution']);
          hChart.HideHeader = true;
          hSegAboveChart.SubHeaders.Add(hChart);
          table.ColumnHeaders.Add(hSegAboveChart);
      	}
      	else{
      	  table.ColumnHeaders.Add(hChart);
        }

      	//ENPS column
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['ENPS']);
        table.ColumnHeaders.Add(hC);

      	//Fill out the data
      	//If we are not using Orgcode then we have to add a row with total score
      	if(demo.GetId() != Config.Hierarchy.VariableId){
          hC = new HeaderContent();
          hC.Title = new Label(currentLanguage, demo.overall.GetTitle());
          var q = demo.overall.questions[0];
          //Set Highlight flag, Valid N, Fav, Neu, Unfav and ENPS score
          hC.SetCellValue(0,0);
          hC.SetCellValue(1, q.tableValidN);
          hC.SetCellValue(2, q.GetScores().fav);
          hC.SetCellValue(3, q.GetScores().neu);
          hC.SetCellValue(4, q.GetScores().unfav);
          var ENPSScore = '-';
          if(!q.IsSuppressed())
          	hC.SetCellValue(6, q.GetScores().fav - q.GetScores().unfav);
          else
            hC.SetCellValue(6, ENPSScore);
          table.RowHeaders.Add(hC);
        }

      	//We now need to add a normal row with only demo name
      	hS = new HeaderSegment();
      	hS.DataSourceNodeId = 'ds0';
      	hS.Label = new Label(currentLanguage, demo.GetTitle());

      	//If we are using orgcode - we need to add the current level here
      	if(demo.GetId() == Config.Hierarchy.VariableId){
          hC = new HeaderContent();
          hC.Title = new Label(currentLanguage, demo.overall.GetTitle());
          var q = demo.overall.questions[0];
          //Set Highlight flag, Valid N, Fav, Neu, Unfav and ENPS score
          hC.SetCellValue(0,0);
          hC.SetCellValue(1, q.tableValidN);
          hC.SetCellValue(2, q.GetScores().fav);
          hC.SetCellValue(3, q.GetScores().neu);
          hC.SetCellValue(4, q.GetScores().unfav);
          var ENPSScore = '-';
          if(!q.IsSuppressed())
          	hC.SetCellValue(6, q.GetScores().fav - q.GetScores().unfav);
          else
            hC.SetCellValue(6, ENPSScore);
          hS.SubHeaders.Add(hC);
        }

      	//Last thing - adding all cuts
      	for(var i=0; i<demo.cuts.length; i++){
      	  hC = new HeaderContent();
          hC.Title = new Label(currentLanguage, demo.cuts[i].GetTitle());
          var q = demo.cuts[i].questions[0];
          //Set Highlight flag, Valid N, Fav, Neu, Unfav and ENPS score
          hC.SetCellValue(0,0);
          hC.SetCellValue(1, q.tableValidN);
          hC.SetCellValue(2, q.GetScores().fav);
          hC.SetCellValue(3, q.GetScores().neu);
          hC.SetCellValue(4, q.GetScores().unfav);
          var ENPSScore = '-';
          if(!q.IsSuppressed())
          	hC.SetCellValue(6, q.GetScores().fav - q.GetScores().unfav);
          else
            hC.SetCellValue(6, ENPSScore);
          hS.SubHeaders.Add(hC);
        }

      	table.RowHeaders.Add(hS);
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Generates Local Questions ALL page (intended for checking purposes only)
  	public function GenerateLocalQuestionsAll(table : Table){
		//Get the config
       	var config = GetStandardHeaderConfig();

      	var titlesInRowHeaders = false;
      	//In case of PPTs
      	if(ExecutionMode.isPowerPoint(m_state)){
        	titlesInRowHeaders = true;
        }

      	//Let's add our standard content headers
      	AddStandardColumnHeaders(table, config);

      	//Add one additional header
        var newHeader : HeaderContent = new HeaderContent();
      	newHeader.Title = new Label(m_report.CurrentLanguage, "Hierarchy Mapping");
      	table.ColumnHeaders.Add(newHeader);

      	//Get the dimension
      	var offset = 0;
      	var qm = QueryManager.GetQueryManagerMain(m_report, m_state, m_user, true);
        for(var i=0; i<Config.LocalDimensions.length; i++){
          var dimension = qm.GetOneDimensionById(Config.LocalDimensions[i].Id);

          //Add the data to the table
          AddStandardDimensionRow(table, config, dimension, titlesInRowHeaders);
          var nodeIds = Config.LocalDimensions[i].NodeIds == null ? "-" : Config.LocalDimensions[i].NodeIds.join(', ');
          newHeader.SetCellValue(offset, nodeIds);
          offset++;
          for(var j = 0; j<dimension.questions.length; j++){
              AddStandardQuestionRow(table, config, dimension.questions[j], titlesInRowHeaders);
              newHeader.SetCellValue(offset, "-");
              offset++;
          }
        }
  	}
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  		
  	//Generates the PSS table
  	public function GeneratePSS(table : Table, confirmit){
  		table.Caching.Enabled = false;

      	//Get the selection out first
      	var pss = ParamUtil.Selected(m_report, m_state, 'PSS', m_user, confirmit);

        //Get the demo out
        var demo = m_qm.GetCurrentDemoCore();

      	//Get the config
       	var config = GetStandardHeaderConfig();

      	//Add headers and data based on current item
      	var qid = pss.Code.split('.')[0];
      	if(qid == "0"){
          	//Check what's the maximum amount of R distributions in all questions
          	var rLen = 0;
          	for(var i = 0; i<demo.overall.dimensions.length; i++){
              	for(var j = 0; j<demo.overall.dimensions[i].questions.length; j++){
              		if(rLen < demo.overall.dimensions[i].questions[j].distributionPercent.length)
                      rLen = demo.overall.dimensions[i].questions[j].distributionPercent.length;
                }
            }

          	AddPSSOverallHeaders(table, config, demo, rLen);
          	//Add all dimensions/questions
          	for(var i = 0; i<demo.overall.dimensions.length; i++){
          		AddPSSOverallDataRow(table, config, demo.overall.dimensions[i], 1, rLen);
              	for(var j = 0; j<demo.overall.dimensions[i].questions.length; j++){
              		AddPSSOverallDataRow(table, config, demo.overall.dimensions[i].questions[j], 0, rLen);
                }
            }

      	}
      	else{
          	if(pss.Config.ExtendedPSSAnalysis){
              AddPSSDemoHeaders(table, true, config, demo);
              //Add all dimensions/questions
              for(var i = 0; i<demo.overall.dimensions.length; i++){
                  AddPSSDemoDataRow(table, true, config, demo, i, 0, 1);
                  for(var j = 0; j<demo.overall.dimensions[i].questions.length; j++){
                      AddPSSDemoDataRow(table, true, config, demo, i, j, 0);
                  }
              }
          	}
          	else{
              AddPSSDemoHeaders(table, false, config, demo);
              //Add all dimensions/questions
              for(var i = 0; i<demo.overall.dimensions.length; i++){
                  AddPSSDemoDataRow(table, false, config, demo, i, 0, 1);
                  for(var j = 0; j<demo.overall.dimensions[i].questions.length; j++){
                      AddPSSDemoDataRow(table, false, config, demo, i, j, 0);
                  }
              }
            }
        }
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Adds column headers to PSS table for the overall level
  	private function AddPSSOverallHeaders(table : Table, config, demo, rLen){
  		/*config = {
          Item: boolean,
          ValidN: boolean,
          Fav: boolean,
          Neu: boolean,
          Unfav: boolean,
          DistributionChart: boolean,
          CompsInternal: {"Trend1": true, "Trend2": true, "Trend3": true, "Internal1": true,
                          "Internal2": true, "Internal3": true, "Internal4": true, "Internal5": true},
          CompsExternal: {"Norm1": true, "Norm2": true, "Norm3": true, "Norm4": true, "Norm5": true}
		};*/

      	//Get out labels from RT
      	var labels = ResourceText.List(m_report,'labels');
      	var currentLanguage = m_report.CurrentLanguage;

      	//Add highlight row column
        var hC : HeaderContent = new HeaderContent();
        hC.Title = new Label(currentLanguage, 'HighlighRowFlag');
        hC.HideData = true;
      	table.ColumnHeaders.Add(hC);

      	//Item
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['Item']);
      	if(!config.Item){
          hC.HideData = true;
        }
        table.ColumnHeaders.Add(hC);

      	//ValidN
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['ValidN']);
      	if(!config.ValidN){
        	hC.HideData = true;
        }
        table.ColumnHeaders.Add(hC);

      	//R1-R5 - TODO: Check out if this shouldn't be rather fixed to include all distributions, not only 1-5
      	for(var i = 0; i<rLen; i++){
      		hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, 'R'+(i+1));
            table.ColumnHeaders.Add(hC);
        }

      	//Fav
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['PercentFav']);
        hC.HeaderId = 'fav';
      	if(!config.Fav){
          	hC.HideData = true;
        }
        table.ColumnHeaders.Add(hC);

      	//Neu
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['PercentNeu']);
        hC.HeaderId = 'neu';
      	if(!config.Neu){
        	hC.HideData = true;
        }
        table.ColumnHeaders.Add(hC);

      	//Unfav
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['PercentUnfav']);
        hC.HeaderId = 'unfav';
      	if(!config.Unfav){
        	hC.HideData = true;
        }
        table.ColumnHeaders.Add(hC);

      	//Let's check if we want to add comparator headers at all
      	var addCompsHeaders = (TableBuilder.AssocArrayContainsTrue(config.CompsInternal) || TableBuilder.AssocArrayContainsTrue(config.CompsExternal));

      	if(addCompsHeaders){
          	//Header above all comps
          	var hSegment : HeaderSegment = new HeaderSegment();
          	//we need to set DataSourceNodeId, but we really don't care about having this set
          	//since we're using content headers below this one anyway
          	hSegment.DataSourceNodeId = 'ds0';
          	hSegment.Label = new Label(currentLanguage, labels['FavvsComparator']);

          	//Internal comps
          	// WATCH OUT FOR THE ORDER OF THOSE!!
          	// Create Map of internal Comparators
          	var internal_comparators = ComparatorUtil.ProcessedComparators(m_report, m_state, m_user);
			var comparators_map = {};
			for (var i=0; i<internal_comparators.length; ++i)
            	comparators_map [ internal_comparators[i].Code ] = internal_comparators[i];

          	//Trend1
          	//Normal header
           	hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Prev].Label);
            if(!config.CompsInternal["Trend1"]){
              hC.HideData = true;
           	}
            hSegment.SubHeaders.Add(hC);

          	//Trend2
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Prev2].Label);
          	if(!config.CompsInternal["Trend2"]){
              hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Trend3
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Prev3].Label);
          	if(!config.CompsInternal["Trend3"]){
              hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);

          	//Internal1
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.TotalCompany].TableLabel);
          	if(!config.CompsInternal["Internal1"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal2
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.LevelUp].TableLabel);
          	if(!config.CompsInternal["Internal2"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal3
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Level2].TableLabel);
          	if(!config.CompsInternal["Internal3"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal4
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Custom1].TableLabel);
          	if(!config.CompsInternal["Internal4"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//Internal5
          	//Normal header
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, comparators_map[Comparators.Custom2].TableLabel);
          	if(!config.CompsInternal["Internal5"]){
            	hC.HideData = true;
            }
            hSegment.SubHeaders.Add(hC);


          	//External comps
          	var benchmarksetQ = m_report.DataSource.GetProject('ds0').GetQuestion('benchmarkset');
          	for(var i = 0; i<Config.Norms.Codes.length; i++){
              	//Normal header
              	//Get Norm id
                var normId = NormUtil.GetNormId(m_user, i);
                var normName = benchmarksetQ.GetAnswer(normId).Text + ' ' + labels['norm'];
                hC = new HeaderContent();
                hC.Title = new Label(currentLanguage, normName);
              	if(!config.CompsExternal["Norm" + (i + 1)]){
                	hC.HideData = true;
                }
                hSegment.SubHeaders.Add(hC);
            }

          	//Add all to the table
          	table.ColumnHeaders.Add(hSegment);
        }
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Adds rows to PSS table for the overall level
  	//data can either be a question or a dimension
  	//highlight flag indicates if we're dealing with a question or with a dimension
  	//1 = dimension, 0 = question
  	private function AddPSSOverallDataRow(table : Table, config, data, highlightFlag, rLen){
    	var currentLanguage = m_report.CurrentLanguage;

      	//Add row to the table column
        var hC : HeaderContent = new HeaderContent();
      	var headerTitle = data.GetDisplayId();
      	hC.Title = new Label(currentLanguage, headerTitle);

        //Set Highlight row flag
      	hC.SetCellValue(0, highlightFlag);

      	var currentColumn = 1;
      	//Item
      	var text = highlightFlag ? data.GetTitle() : data.text;
      	if(config.Item){
      		hC.SetCellValue(currentColumn, text);
        }
      	currentColumn++;

      	//ValidN
      	//We don't want to show it for dimensions, so we'll put a blank string there
      	var validN = highlightFlag ? '' : data.tableValidN;
      	if(config.ValidN){
      		hC.SetCellValue(currentColumn, validN);
        }
      	currentColumn++;

      	//Get scores out
      	var scores = data.GetScores();

      	//R1 - R5
      	for(var i = 0; i<rLen; i++){
          	var r = '';
          	if(!highlightFlag){
              if(i < data.distributionPercent.length){
                r = data.distributionPercent[i];
              }
              else{
              	r = '-';
              }
            }
      		hC.SetCellValue(currentColumn, r);
          	currentColumn++;
        }

      	//Fav
      	if(config.Fav){
      		hC.SetCellValue(currentColumn, scores.fav);
        }
      	currentColumn++;

      	//Neu
      	if(config.Neu){
      		hC.SetCellValue(currentColumn, scores.neu);
        }
        currentColumn++;

      	//Unfav
      	if(config.Unfav){
      		hC.SetCellValue(currentColumn, scores.unfav);
        }
      	currentColumn++;

      	//Let's check if we want to add comparator headers at all
      	//and if yes - add them
      	if(TableBuilder.AssocArrayContainsTrue(config.CompsInternal) || TableBuilder.AssocArrayContainsTrue(config.CompsExternal)){
          	//Internal comps
          	// WATCH OUT FOR THE ORDER OF THOSE!!

          	//Trend1
         	if(config.CompsInternal["Trend1"]){
              	hC.SetCellValue(currentColumn, data.internalComps[5].GetScore(false));

          	}
          	currentColumn++;

          	//Trend2
         	if(config.CompsInternal["Trend2"]){
          		hC.SetCellValue(currentColumn, data.internalComps[6].GetScore(false));
          	}
          	currentColumn++;

          	//Trend3
         	if(config.CompsInternal["Trend3"]){
          		hC.SetCellValue(currentColumn, data.internalComps[7].GetScore(false));
          	}
          	currentColumn++;

          	//Internal1
         	if(config.CompsInternal["Internal1"]){
          		hC.SetCellValue(currentColumn, data.internalComps[0].GetScore(false));
          	}
          	currentColumn++;

          	//Internal2
         	if(config.CompsInternal["Internal2"]){
          		hC.SetCellValue(currentColumn, data.internalComps[1].GetScore(false));
          	}
          	currentColumn++;

          	//Internal3
         	if(config.CompsInternal["Internal3"]){
          		hC.SetCellValue(currentColumn, data.internalComps[2].GetScore(false));
          	}
          	currentColumn++;

          	//Internal4
         	if(config.CompsInternal["Internal4"]){
          		hC.SetCellValue(currentColumn, data.internalComps[3].GetScore(false));
          	}
          	currentColumn++;

          	//Internal5
         	if(config.CompsInternal["Internal5"]){
          		hC.SetCellValue(currentColumn, data.internalComps[4].GetScore(false));
          	}
          	currentColumn++;

          	//External comps
          	for(var i = 0; i<Config.Norms.Codes.length; i++){
              	if(config.CompsExternal["Norm" + (i + 1)]){
          			hC.SetCellValue(currentColumn, data.norms[i].GetScore(false));
                }
              	currentColumn++;
            }
        }

      	//Add row to the table
      	table.RowHeaders.Add(hC);
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Adds column headers to PSS table for the demography level
  	private function AddPSSDemoHeaders(table : Table, extendedAnalysisEnabled : Boolean, config, demo){
  		/*config = {
          Item: boolean,
          ValidN: boolean,
          Fav: boolean,
          Neu: boolean,
          Unfav: boolean,
          DistributionChart: boolean,
          CompsInternal: {"Trend1": true, "Trend2": true, "Trend3": true, "Internal1": true,
                          "Internal2": true, "Internal3": true, "Internal4": true, "Internal5": true},
          CompsExternal: {"Norm1": true, "Norm2": true, "Norm3": true, "Norm4": true, "Norm5": true}
		};*/

      	//Get out labels from RT
      	var labels = ResourceText.List(m_report,'labels');
      	var currentLanguage = m_report.CurrentLanguage;

      	//Add highlight row column
        var hC : HeaderContent = new HeaderContent();
        hC.Title = new Label(currentLanguage, 'HighlighRowFlag');
        hC.HideData = true;
      	table.ColumnHeaders.Add(hC);

      	//Item
      	hC = new HeaderContent();
        hC.Title = new Label(currentLanguage, labels['Item']);
      	if(!config.Item){
          hC.HideData = true;
        }
        table.ColumnHeaders.Add(hC);

      	//For each cut we need to create a few different headers: N, fav, neu, unfav and comparators
      	for(var i = 0; i<demo.cuts.length; i++){
      		//Create a header above all of the other ones
          	var demoSegmentHeader : HeaderSegment = new HeaderSegment();
          	demoSegmentHeader.Label = new Label(currentLanguage, demo.GetTitle() + ': ' + demo.cuts[i].GetTitle());
          	demoSegmentHeader.DataSourceNodeId = 'ds0';

          	//Create sub headers
          	//ValidN
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, labels['ValidN']);
            if(!config.ValidN){
                hC.HideData = true;
            }
            demoSegmentHeader.SubHeaders.Add(hC);

            //Fav
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, labels['PercentFav']);
            hC.HeaderId = 'fav';
            if(!config.Fav){
                hC.HideData = true;
            }
            demoSegmentHeader.SubHeaders.Add(hC);

            //Neu
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, labels['PercentNeu']);
            hC.HeaderId = 'neu';
            if(!config.Neu || !extendedAnalysisEnabled){
                hC.HideData = true;
            }
            demoSegmentHeader.SubHeaders.Add(hC);

            //Unfav
            hC = new HeaderContent();
            hC.Title = new Label(currentLanguage, labels['PercentUnfav']);
            hC.HeaderId = 'unfav';
            if(!config.Unfav || !extendedAnalysisEnabled){
                hC.HideData = true;
            }
            demoSegmentHeader.SubHeaders.Add(hC);

            //Let's check if we want to add comparator headers at all
            var addCompsHeaders = (TableBuilder.AssocArrayContainsTrue(config.CompsInternal) || TableBuilder.AssocArrayContainsTrue(config.CompsExternal));

            if(addCompsHeaders && extendedAnalysisEnabled){
                //Header above all comps
                var hSegment : HeaderSegment = new HeaderSegment();
                //we need to set DataSourceNodeId, but we really don't care about having this set
                //since we're using content headers below this one anyway
                hSegment.DataSourceNodeId = 'ds0';
                hSegment.Label = new Label(currentLanguage, labels['FavvsComparator']);

                //Internal comps
                // WATCH OUT FOR THE ORDER OF THOSE!!
                // Create Map of internal Comparators
                var internal_comparators = ComparatorUtil.ProcessedComparators(m_report, m_state, m_user);
                var comparators_map = {};
                for (var j=0; j<internal_comparators.length; ++j)
                    comparators_map [ internal_comparators[j].Code ] = internal_comparators[j];

                //Trend1
                //Normal header
                hC = new HeaderContent();
                hC.Title = new Label(currentLanguage, comparators_map[Comparators.Prev].Label);
                if(!config.CompsInternal["Trend1"]){
                  hC.HideData = true;
                }
                hSegment.SubHeaders.Add(hC);

                //Trend2
                //Normal header
                hC = new HeaderContent();
                hC.Title = new Label(currentLanguage, comparators_map[Comparators.Prev2].Label);
                if(!config.CompsInternal["Trend2"]){
                  hC.HideData = true;
                }
                hSegment.SubHeaders.Add(hC);


                //Trend3
                //Normal header
                hC = new HeaderContent();
                hC.Title = new Label(currentLanguage, comparators_map[Comparators.Prev3].Label);
                if(!config.CompsInternal["Trend3"]){
                  hC.HideData = true;
                }
                hSegment.SubHeaders.Add(hC);

                //Internal1
                //Normal header
                hC = new HeaderContent();
                hC.Title = new Label(currentLanguage, comparators_map[Comparators.TotalCompany].TableLabel);
                if(!config.CompsInternal["Internal1"]){
                    hC.HideData = true;
                }
                hSegment.SubHeaders.Add(hC);


                //Internal2
                //Normal header
                hC = new HeaderContent();
                hC.Title = new Label(currentLanguage, comparators_map[Comparators.LevelUp].TableLabel);
                if(!config.CompsInternal["Internal2"]){
                    hC.HideData = true;
                }
                hSegment.SubHeaders.Add(hC);


                //Internal3
                //Normal header
                hC = new HeaderContent();
                hC.Title = new Label(currentLanguage, comparators_map[Comparators.Level2].TableLabel);
                if(!config.CompsInternal["Internal3"]){
                    hC.HideData = true;
                }
                hSegment.SubHeaders.Add(hC);


                //Internal4
                //Normal header
                hC = new HeaderContent();
                hC.Title = new Label(currentLanguage, comparators_map[Comparators.Custom1].TableLabel);
                if(!config.CompsInternal["Internal4"]){
                    hC.HideData = true;
                }
                hSegment.SubHeaders.Add(hC);


                //Internal5
                //Normal header
                hC = new HeaderContent();
                hC.Title = new Label(currentLanguage, comparators_map[Comparators.Custom2].TableLabel);
                if(!config.CompsInternal["Internal5"]){
                    hC.HideData = true;
                }
                hSegment.SubHeaders.Add(hC);


                //External comps
                var benchmarksetQ = m_report.DataSource.GetProject('ds0').GetQuestion('benchmarkset');
                for(var j = 0; j<Config.Norms.Codes.length; j++){
                    //Normal header
                    //Get Norm id
                    var normId = NormUtil.GetNormId(m_user, j);
                    var normName = benchmarksetQ.GetAnswer(normId).Text + ' ' + labels['norm'];
                    hC = new HeaderContent();
                    hC.Title = new Label(currentLanguage, normName);
                    if(!config.CompsExternal["Norm" + (j + 1)]){
                        hC.HideData = true;
                    }
                    hSegment.SubHeaders.Add(hC);
                }

              	demoSegmentHeader.SubHeaders.Add(hSegment);
            }

          	//Add all to the table
        	table.ColumnHeaders.Add(demoSegmentHeader);
        }
    }
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	//Adds rows to PSS table for the demography level
  	private function AddPSSDemoDataRow(table : Table, extendedAnalysisEnabled : Boolean, config, demo, dimensionId, questionId, highlightFlag){
    	var currentLanguage = m_report.CurrentLanguage;

      	//Add row to the table column
        var hC : HeaderContent = new HeaderContent();
      	var headerTitle = highlightFlag ? demo.overall.dimensions[dimensionId].GetDisplayId() :
            				demo.overall.dimensions[dimensionId].questions[questionId].GetDisplayId();
      	hC.Title = new Label(currentLanguage, headerTitle);

        //Set Highlight row flag
      	hC.SetCellValue(0, highlightFlag);

      	var currentColumn = 1;
      	//Item
      	var text = highlightFlag ? demo.overall.dimensions[dimensionId].GetTitle() : demo.overall.dimensions[dimensionId].questions[questionId].text;
      	if(config.Item){
      		hC.SetCellValue(currentColumn, text);
        }
      	currentColumn++;

      	for(var i = 0; i<demo.cuts.length; i++){
          var data = highlightFlag ? demo.cuts[i].dimensions[dimensionId] : demo.cuts[i].dimensions[dimensionId].questions[questionId];

          //ValidN
          //We don't want to show it for dimensions, so we'll put a blank string there
          var validN = highlightFlag ? '' : data.tableValidN;
          if(config.ValidN){
              hC.SetCellValue(currentColumn, validN);
          }
          currentColumn++;

          //Get scores out
          var scores = data.GetScores();

          //Fav
          if(config.Fav){
              hC.SetCellValue(currentColumn, scores.fav);
          }
          currentColumn++;

          //Neu
          if(config.Neu || extendedAnalysisEnabled){
              hC.SetCellValue(currentColumn, scores.neu);
          }
          currentColumn++;

          //Unfav
          if(config.Unfav || extendedAnalysisEnabled){
              hC.SetCellValue(currentColumn, scores.unfav);
          }
          currentColumn++;

          //Let's check if we want to add comparator headers at all
          //and if yes - add them
          if((TableBuilder.AssocArrayContainsTrue(config.CompsInternal) || TableBuilder.AssocArrayContainsTrue(config.CompsExternal)) && extendedAnalysisEnabled){
              //Internal comps
              // WATCH OUT FOR THE ORDER OF THOSE!!

              //Trend1
              if(config.CompsInternal["Trend1"]){
                  hC.SetCellValue(currentColumn, data.internalComps[5].GetScore(false));

              }
              currentColumn++;

              //Trend2
              if(config.CompsInternal["Trend2"]){
                  hC.SetCellValue(currentColumn, data.internalComps[6].GetScore(false));
              }
              currentColumn++;

              //Trend3
              if(config.CompsInternal["Trend3"]){
                  hC.SetCellValue(currentColumn, data.internalComps[7].GetScore(false));
              }
              currentColumn++;

              //Internal1
              if(config.CompsInternal["Internal1"]){
                  hC.SetCellValue(currentColumn, data.internalComps[0].GetScore(false));
              }
              currentColumn++;

              //Internal2
              if(config.CompsInternal["Internal2"]){
                  hC.SetCellValue(currentColumn, data.internalComps[1].GetScore(false));
              }
              currentColumn++;

              //Internal3
              if(config.CompsInternal["Internal3"]){
                  hC.SetCellValue(currentColumn, data.internalComps[2].GetScore(false));
              }
              currentColumn++;

              //Internal4
              if(config.CompsInternal["Internal4"]){
                  hC.SetCellValue(currentColumn, data.internalComps[3].GetScore(false));
              }
              currentColumn++;

              //Internal5
              if(config.CompsInternal["Internal5"]){
                  hC.SetCellValue(currentColumn, data.internalComps[4].GetScore(false));
              }
              currentColumn++;

              //External comps
              for(var j = 0; j<Config.Norms.Codes.length; j++){
                  if(config.CompsExternal["Norm" + (j + 1)]){
                      hC.SetCellValue(currentColumn, data.norms[j].GetScore(false));
                  }
                  currentColumn++;
              }
          }
        }

        //Add row to the table
        table.RowHeaders.Add(hC);
    }
}