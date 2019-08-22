class Page_EffectivenessProfile {  
  //Returns an object containing boolean values
  //Indicating if particular internal comparator
  //Should be shown
  //TODO: Check if it's even used
  static function ComparatorConfig ( report, user, state ) {
    
	var TOTAL_COMPANY =  ComparatorUtil.ShowTop ( report, user, state ); 
	var LEVELUP =  ComparatorUtil.ShowLevelUp ( report, user, state ); 
    var PREVIOUS =  ParamUtil.Contains (state, 'COMPARATORS_INTERNAL', Comparators.Prev ); 
    var PREVIOUS2 =  ParamUtil.Contains (state, 'COMPARATORS_INTERNAL', Comparators.Prev2 ); 
    var PREVIOUS3 =  ParamUtil.Contains (state, 'COMPARATORS_INTERNAL', Comparators.Prev3 ); 
   
    return {
      TotalCompany: TOTAL_COMPANY,
      LevelUp: LEVELUP,
      Previous: PREVIOUS,
      Previous2: PREVIOUS2,
      Previous3: PREVIOUS3
    };
  }
  
  //Generates t0 table for EEF page
  //This t0 tables contains data (in %) for EEF segmentation
  static function t0 (report, user, state, table, caching) {
	table.Caching.Enabled = caching;
    table.Caching.CacheKey = HelperUtil.GetCacheKeyForT0(user, report, state, 'EEF');
	
	var X=[], Y=[];
	
	var rowLabels = report.TableUtils.GetRowHeaderCategoryTitles('PFAULF:EEF');
	var colLabels = report.TableUtils.GetColumnHeaderCategoryTitles('PFAULF:EEF');
    
	for (var i=0; i<colLabels.length; ++i)
	  X.push ('[CONTENT]{label:"' + colLabels[i]  + '"; hidedata:false}');
	
	X.push ('[CHART]{id:barchart; label:"' + ResourceText.Text(report,'effectiveness_profile','DistributionChart') + '"}');
	
	for (var i=0; i<rowLabels.length; ++i)
	  Y.push ('[CONTENT]{label:"' + rowLabels[i]  + '"; hidedata:false}');
	
	var x = X.join('+'); 
	var y = Y.join('+');
	
	var expr = [y, x].join('^');
	
	table.AddHeaders(report, 'ds0', expr);
	
	for (var i=0; i<rowLabels.length; ++i) {
	  var dataRow = WidgetEEF.GetData (report, state, user, i+1, false, 'PFAULF');
      
	  if (!isNaN(dataRow.effective.Score) && dataRow.effective.Score>0) table.SetContentCellValue(i+1,1,dataRow.effective.Score);
	  if (!isNaN(dataRow.frustrated.Score) && dataRow.frustrated.Score>0) table.SetContentCellValue(i+1,2,dataRow.frustrated.Score);
	  if (!isNaN(dataRow.detached.Score) && dataRow.detached.Score>0) table.SetContentCellValue(i+1,3,dataRow.detached.Score);
	  if (!isNaN(dataRow.least_effective.Score) && dataRow.least_effective.Score>0) table.SetContentCellValue(i+1,4,dataRow.least_effective.Score);
	}

	var norm_enabled = [];
    var norm_count=0;
	for (var i=0; i<Config.Norms.Codes.length; ++i) {
		norm_enabled.push ( ParamUtil.Contains (state, 'COMPARATORS_EXTERNAL', 'norm' + (i+1) ) );
        if (ParamUtil.Contains (state, 'COMPARATORS_EXTERNAL', 'norm' + (i+1) )) norm_count++;
	}
    
    var visible_comparators = ComparatorUtil.Count ( report, user, state );

  // populate norm values
	var tableindex_mod = 0;
	for (var i=0; i<Config.Norms.Codes.length; ++i) {
		if (norm_enabled[i]) {

			var norm_id = NormUtil.GetNormId (user, i);
			var distribution = EffectivenessProfileNormsDistribution.GetByNormId ( norm_id );	  
			var idx = 1 + visible_comparators - norm_count + tableindex_mod;

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
	
	HelperUtil.UpdateBarChart_Profile ( report, HelperUtil.GetHeaderById(table, 'barchart') );
  }
  
  
  //Generates the "nice" EEF output used on main EEF page based on
  //results from t0 table
  static function CustomHTMLBlock (report, state, user) {
	var rowLabels = report.TableUtils.GetRowHeaderCategoryTitles('t0');
	var colLabels = report.TableUtils.GetColumnHeaderCategoryTitles('t0');

    var o=[];
	try {
	
    var data = report.TableUtils.GetRowValues ( 't0', 1 );

	var segments = [ rowLabels[0] ];
	var quadColors = ['#82C341','#F99B1E','#00B7F1','#F03223'];
	var quadrants = [];
	var quadrantOrder = [2,0,3,1];
	  
	quadrants.push({Color: quadColors[2], Label: colLabels[2], Scores: [data[2].Value.toFixed(0)]})
	quadrants.push({Color: quadColors[0], Label: colLabels[0], Scores: [data[0].Value.toFixed(0)]})
	quadrants.push({Color: quadColors[3], Label: colLabels[3], Scores: [data[3].Value.toFixed(0)]})
	quadrants.push({Color: quadColors[1], Label: colLabels[1], Scores: [data[1].Value.toFixed(0)]})
	
	for (var i=1; i<rowLabels.length; ++i) {
	  var data = report.TableUtils.GetRowValues ( 't0', i+1 );
	  segments.push ( rowLabels[i] );
	  for (var j=0; j<quadrantOrder.length; ++j) {
	    quadrants[j].Scores.push(data[quadrantOrder[j]].Value.toFixed(0))        
      }
	}
	
	var x = {
	  AxisLabels: {X: ResourceText.Text(report,'effectiveness_profile','Engagement'), Y: ResourceText.Text(report,'effectiveness_profile','Enablement')},
	  Segments: segments,
	  Quadrants: quadrants
	};
	
	return (Render( x, state ));
	} catch (e) {
       o.push (e);
       return (o.join ('<br>'));
	}
  }
  
  public static function Render( x , state) {
		/*
		var x = {
			AxisLabels: {X: 'Engagement', Y: 'Enablement'},
			Segments: ['Your Score', 'High Performers', 'General Industry Norm'],
			Quadrants: [
				{Color: 'blue', Label:'Detached', Scores: [30, 20, 10]},
				{Color: 'green', Label: 'Most Effective', Scores: [30, 20, 10]},
				{Color: 'red', Label: 'Least Effective', Scores: [60, 40, 20]},
				{Color: 'skyblue', Label: 'Frustrated', Scores: [10, 20, 30]},
			]
		};
		*/      
		var o=[];
		
		// Styling
		o.push ( Css(state) );
      
		// Main Table      	
      	o.push ('<table id="eechart">');
		
		// Headings - Quadrant 1&2 and y-axis label
		o.push ('<tr>');
		o.push ('<td class="chartlabels">' + x.AxisLabels.Y + '</td>');
      	o.push ('<td class="boxheader" id="boxheader_1">' + x.Quadrants[0].Label + '</td>');
      	o.push ('<td id="gap_column"></td>');
		o.push (' <td class="boxheader" id="boxheader_2">' + x.Quadrants[1].Label + '</td>');
		o.push ('</tr>');

      	// Quadrant #1 & #2
		o.push ('<tr>');
      		o.push ('<td colspan="4" style="padding:0px">');      	
      		o.push (GetQuadrant(x.Segments, x.Quadrants[0], x.Quadrants[1]));      		
			o.push ('</td>');
      	o.push ('</tr>');
      
      	//Gap between quadrant 1,2 and quadrant 3,4
      	o.push ('<tr id="gap_row"></tr>');

      	// Headings - Quadrant 3&4
		o.push ('<tr>');
		o.push ('<td class="chartlabels"></td>');
		o.push ('<td class="boxheader" id="boxheader_3">' + x.Quadrants[2].Label + '</td>');
      	o.push ('<td id="gap_column"></td>');
		o.push ('<td class="boxheader" id="boxheader_4">' + x.Quadrants[3].Label + '</td>');
		o.push ('</tr>');

		// Quadrant #3 & #4
		o.push ('<tr>');
      		o.push ('<td colspan="4" style="padding:0px">');
      		o.push (GetQuadrant(x.Segments, x.Quadrants[2], x.Quadrants[3]));			
			o.push ('</td>');
      	o.push ('</tr>');

		//label x-axis label
      	o.push ('<tr>');
        o.push ('<td colspan="3"></td>');
        o.push ('<td id="engagement">' + x.AxisLabels.X + '</td>');
        o.push ('</tr>');
      
      	//drawing x and y axis with arrows
      	o.push('<svg id="axis">');
          o.push('<line x1="17%" y1="0%" x2="17%" y2="95%" class="axis_lines" />');
          o.push('<line x1="17%" y1="0%" x2="16.6%" y2="3%" class="axis_lines" />');
          o.push('<line x1="17%" y1="0%" x2="17.4%" y2="3%" class="axis_lines" />');
          o.push('<line x1="17%" y1="95%" x2="100%" y2="95%" class="axis_lines" />');
          o.push('<line x1="100%" y1="95%" x2="98%" y2="94.3%" class="axis_lines" />');
          o.push('<line x1="100%" y1="95%" x2="98%" y2="95.7%" class="axis_lines" />');
      	o.push('</svg>');
            	      	
		o.push ('</table>');
      
      
      //javascript for settings of the proper attributes (mostly height) of the graphic elements - chart rectangle (used for grey background), svg "container" for chart and svg "container" for axis
      	o.push ('<script>');
     
      //height of the table if there will be a few barchart - table would be too small, we have to set up this to default height 144 px
      	o.push ('if (document.getElementsByClassName("Results")[0].offsetHeight <= 144 || document.getElementsByClassName("Results")[1].offsetHeight <= 144) {');
      		o.push ('document.getElementsByClassName("Results")[0].style.height="144px";');
      		o.push ('document.getElementsByClassName("Results")[1].style.height="144px";');      		
      	o.push ('}');
      
      	//settings of the same height for the chart background rectangle like table Results
      	o.push ('for (i=0; i<4;i++) {')
        	o.push ('document.getElementsByClassName("chart_rectangle")[i].setAttribute("height",document.getElementsByClassName("Results")[0].offsetHeight+"px");');      		      		
      	o.push ('}');
      	
      	//settings of the same height and width for chart_background like table Results - svg chart_background is nested in the table Results
      	o.push ('document.getElementsByClassName("chart_background")[0].style.height=document.getElementsByClassName("Results")[0].offsetHeight+"px";');
      	o.push ('document.getElementsByClassName("chart_background")[0].style.width=document.getElementsByClassName("Results")[0].offsetWidth+"px";');
      	o.push ('document.getElementsByClassName("chart_background")[1].style.height=document.getElementsByClassName("Results")[1].offsetHeight+"px";');
      	o.push ('document.getElementsByClassName("chart_background")[1].style.width=document.getElementsByClassName("Results")[1].offsetWidth+"px";');
      	
      	//this part is for styling in the IE, variables for quadrant    
      	o.push ('var barcharts_Q13 = document.getElementsByClassName("quadrant")');
      	o.push ('var barcharts_Q24 = document.getElementsByClassName("quadrant2")');
      
      	//check if the browser is IE, don't work navigator.appName == "Microsoft Internet Explorer" or other possibilities
      	o.push ('if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) {');            
      
      	//settings of the padding for barcharts in all quadrants
      				o.push ('for (i=0; i<barcharts_Q13.length;i++) {');
      					o.push ('barcharts_Q13[i].style.paddingLeft="31px";');
      					o.push ('barcharts_Q24[i].style.paddingLeft="23px";');
    				o.push ('}');
      	o.push ('}'); 
      
      	//settings of the padding for barcharts in the chrome browser and the align of the boxheaders 1 and 3
      o.push ('if((navigator.userAgent.toLowerCase().indexOf("chrome") > -1) && (navigator.userAgent.toLowerCase().indexOf("safari") > -1) && (navigator.appName == "Netscape")){');
                o.push ('for (i=0; i<barcharts_Q13.length;i++) {');
                                o.push ('barcharts_Q13[i].style.paddingLeft="30px";');
                                o.push ('barcharts_Q24[i].style.paddingLeft="23px";');
                            o.push ('}');
      			o.push ('document.getElementById("boxheader_1").style.position="relative";');
      			o.push ('document.getElementById("boxheader_1").style.left="-1.15px";');
      			o.push ('document.getElementById("boxheader_1").style.width="361px";');      			
      			o.push ('document.getElementById("boxheader_3").style.position="relative";');
      			o.push ('document.getElementById("boxheader_3").style.left="-1.15px";');
      			o.push ('document.getElementById("boxheader_3").style.width="361px";');      		
      	o.push ('}');
      
      	//settings of the height of the axis, according to Inspect element real height of the element is higher (approx. 1.09) than clientHeight or offsetHeight
      o.push ('var EEtable_height = document.getElementById("eechart").offsetHeight;'); 
      o.push ('if (EEtable_height <= 450 ) {');
      	//Decrement of the height because we need label Engagement under the axis.
      		o.push ('document.getElementById("axis").style.height=(EEtable_height-15)+"px";'); 
      o.push ('} else {');
      		o.push ('document.getElementById("axis").style.height=(EEtable_height)+"px";'); 
      o.push ('}');
            
      	o.push ('</script>');
      
		return o.join('\n');
		
	}
  
  	private static function GetQuadrant(labels, data1, data2) {
    	var o=[]; 
      	var barChart_width=0;
      	var barLabel_position=0
      
        //table Results is nested in the tr/td element of the main table eechart
      	o.push ('<table class="Results">');
      	//row for the gap between chart labels/text scale (0, 25, 50, 75, 100) and chart
      	o.push ('<tr style="height:10px"></tr>');
      
      	//for loop for rendering segment labels and barcharts
      	for (var i=0; i<labels.length; i++) {
			o.push ('<tr>');
              	// column for segment labels
         		o.push ('<td class="segmentname">');
				o.push ('<div style="">' + labels[i] + '</div>' );
				o.push ('</td>'); 
            
     
      
              //column for rendering chart for quadrants #1 and #3, every quadrant has got fixed width 330 px (reason why you have to multiple score by 3.3), every barchart has got fixed height 20px
              	o.push ('<td class="quadrant">');
      		
              //display:block is here because without this css style vertical-align:middle for table Results tr/td doesn't work properly              		
              		o.push ('<svg width="330px" height="20px" style="position:relative; display:block">');
              		barChart_width=parseInt(data1.Scores[i]*3.3);
              		
              		//settings for the color of the barchart, only first barchart will be colored
              		if (i==0) {
              				o.push ('<rect x="0px"  y="0" width="'+barChart_width+'px" height="20px" style="fill:'+data1.Color+'" />'); 
                    } else {
                      		o.push ('<rect x="0px"  y="0" width="'+barChart_width+'px" height="20px" style="fill:#c0c0c0" />');	
                    }
              
              		//settings for the position of the reached score
              		if (data1.Scores[i]>=10) {
                			barLabel_position=barChart_width-20;
                      		o.push ('<text x="'+barLabel_position+'px" y="15px" fill="white">'+data1.Scores[i]+'</text>');
              		} else if (data1.Scores[i]>=5 && data1.Scores[i]<10) {
                      		barLabel_position=barChart_width-13;
                      		o.push ('<text x="'+barLabel_position+'px" y="15px" fill="white">'+data1.Scores[i]+'</text>');
                    } else if (data1.Scores[i]>0 && data1.Scores[i]<5){
                      		barLabel_position=barChart_width+5;
                      		o.push ('<text x="'+barLabel_position+'px" y="15px" fill="black">'+data1.Scores[i]+'</text>'); 
                    }              
                                 		            		
              		o.push ('</svg>');              		            
              	o.push ('</td>');
              
              //Gap column between quadrant #1 and #2 (#3 and #4)
      			o.push ('<td id="gap_column"></td>');
              
              //column for rendering barchart for quadrants #2 and #4, every quadrant has got fixed width 330 px (reason why you have to multiple score by 3.3), every barchart has got fixed height 20px
              	o.push ('<td class="quadrant2">');     
              //display:block is here because without this css style vertical-align:middle for table Results tr/td doesn't work properly              	
        		o.push ('<svg width="330px" height="20px" style="position:relative; display:block">');
              		barChart_width=parseInt(data2.Scores[i]*3.3);
              		              		
              		//settings for the color of the barchart, only first barchart will be colored              
              		if (i==0) {
                      o.push ('<rect x="0px"  y="0" width="'+barChart_width+'px" height="20px" style="fill:'+data2.Color+';" />'); 
                    } else {
                      o.push ('<rect x="0px"  y="0" width="'+barChart_width+'px" height="20px" style="fill:#c0c0c0;" />');	
                    }
              
              		//settings for the position of the reached score
              		if (data2.Scores[i]>=10) {
                			barLabel_position=barChart_width-20;
                      		o.push ('<text x="'+barLabel_position+'px" y="15px" fill="white">'+data2.Scores[i]+'</text>');
              		} else if (data2.Scores[i]>=5 && data2.Scores[i]<12) {
                      		barLabel_position=barChart_width-13;
                      		o.push ('<text x="'+barLabel_position+'px" y="15px" fill="white">'+data2.Scores[i]+'</text>');
                    } else if (data2.Scores[i]>0 && data2.Scores[i]<5){
                      		barLabel_position=barChart_width+5;
                      		o.push ('<text x="'+barLabel_position+'px" y="15px" fill="black">'+data2.Scores[i]+'</text>'); 
                    }              
                                 		            		
              		o.push ('</svg>');
        			o.push ('</td>');
     
              	o.push ('</tr>');              
            }
		
      	o.push (QuadrantChartBackground());	
      
      	o.push ('</table>');
      
      	return o.join('\n');
    }
  
  private static function QuadrantChartBackground(){
    	var o=[];
      		    		
    o.push ('<svg class="chart_background">');
    		
    		//this part is for rendering quadrant #1 and #3 - rectangle for background, lines and text
    			o.push ('<rect x="170px"  y="0%" width="364px" height="100%" class="chart_rectangle" />'); 
    			o.push ('<line x1="185px" y1="15px" x2="185px" y2="98%" class="chart_lines" />');     			
                o.push ('<line x1="267.5px" y1="15px" x2="267.5px" y2="98%" class="chart_lines" />');                   			
                o.push ('<line x1="350px" y1="15px" x2="350px" y2="98%" class="chart_lines" />');                
                o.push ('<line x1="432.5px" y1="15px" x2="432.5px" y2="98%" class="chart_lines" />');               
                o.push ('<line x1="515px" y1="15px" x2="515px" y2="98%" class="chart_lines" />');			
    			o.push ('<text x="182px" y="12px" fill="black" class="chartScale">0</text>');	
                o.push ('<text x="260px" y="12px" fill="black" class="chartScale">25</text>');
                o.push ('<text x="344px" y="12px" fill="black" class="chartScale">50</text>');
                o.push ('<text x="426px" y="12px" fill="black" class="chartScale">75</text>');
                o.push ('<text x="504px" y="12px" fill="black" class="chartScale">100</text>');     	 

      
    		//this part is for rendering quadrant #2 and #4 - rectangle for background, lines and text
    			o.push ('<rect x="555px"  y="0%" width="364px" height="100%" class="chart_rectangle" />');
      			o.push ('<line x1="570px" y1="15px" x2="570px" y2="98%" class="chart_lines" />');      			
                o.push ('<line x1="652.5px" y1="15px" x2="652.5px" y2="98%" class="chart_lines" />');                
                o.push ('<line x1="735px" y1="15px" x2="735px" y2="98%" class="chart_lines" />');                
                o.push ('<line x1="817.5px" y1="15px" x2="817.5px" y2="98%" class="chart_lines" />');                
                o.push ('<line x1="900px" y1="15px" x2="900px" y2="98%" class="chart_lines" />');
                o.push ('<text x="566px" y="12px" fill="black" class="chartScale">0</text>');	
                o.push ('<text x="645px" y="12px" fill="black" class="chartScale">25</text>');
                o.push ('<text x="727px" y="12px" fill="black" class="chartScale">50</text>');
                o.push ('<text x="811px" y="12px" fill="black" class="chartScale">75</text>');
                o.push ('<text x="887px" y="12px" fill="black" class="chartScale">100</text>');      		    
    o.push ('</svg>');             	
    	
      	return o.join('\n');
    }
  	// JV (19.1) - restyled for PDF (lines 411 & 412) in order to make the chart work in EOv2
	private static function Css(state) {
		var o=[];
      	var labels_width=150;
      	var quadrant_width=360;
		
		o.push('<style>');
      o.push('#eechart{width: 918px; height:100%; table-layout:fixed; padding:0px; border-spacing:0px; min-height:300px;}');
      	o.push('.chartlabels{width:18.5%;height:26px; color:#999; font-family:arial; font-size:16px; font-weight: bold; padding:3px 0px 3px 0px}');  
     	o.push('.chartScale{font-size:12px;}');
     	o.push('#gap_row{height:20px; padding:0px;}');
      	o.push('#gap_column{width:20px;padding:0px;}');
      	o.push('#engagement{text-align:right;vertical-align:bottom;color:#999; font-family:arial; font-size:16px; font-weight: bold; padding:25px 0px 0px 0px}');     
      	o.push('.segmentname {width:'+labels_width+'px; position:relative; text-align: right;font-family: arial; font-size: 11px; color: #999; padding:10px 10px 10px 0px;}');
      if (ExecutionMode.isPDF(state)) {
        o.push('.quadrant{width:'+quadrant_width+'px; height:100%;position:relative;left:2px;}');
      	o.push('.quadrant2{width:'+quadrant_width+'px; height:100%;position:relative;left:-2px;}');
        o.push('#boxheader_1 {position:relative; left:-1.15px; width:361px;}');
        o.push('#boxheader_3 {position:relative; left:-1.15px; width:361px;}');
      } else {
      	o.push('.quadrant{width:'+quadrant_width+'px; height:100%;position:relative;padding:0px 0px 0px 28.5px;}');
      	o.push('.quadrant2{width:'+quadrant_width+'px; height:100%;position:relative;padding:0px 0px 0px 22px;}');
      }          
      	o.push('.boxheader{width:'+quadrant_width+'px;color:white;text-align:center;vertical-align:middle; font-family:arial; font-size:14px; padding:0px}');
      	o.push('#boxheader_1 {background-color:#00B7F1;}');
        o.push('#boxheader_2 {background-color:#82C341;}');
        o.push('#boxheader_3 {background-color:#F03223; }'); //position:relative; left:-1px
        o.push('#boxheader_4 {background-color:#F99B1E;}');
      	o.push('.chart_background{position:absolute}');
        o.push('.chart_lines{stroke:white;stroke-width:1;}');
      	o.push('.chart_rectangle{fill:#ebebe0;}');
      o.push('#axis{position:absolute;width:918px;}');
        o.push('.axis_lines{stroke:black;stroke-width:1.5px;}');		     	
      o.push('.Results {width:918px}'); 
      	o.push('.Results tr td{vertical-align: middle}');
		o.push('</style>');
		
		return o.join('\n');
	
	}
  
  
  //Returns HTML string containing all of the EEF quadrants
  //graphical output used on main EEF page
  //IT was moved here from EE_Chart class
  /*public static function Render( x ) {	     
	var o=[];
	
	// Styling
	o.push ( Css() );
  
	// Main Table      	
	o.push ('<table id="eechart">');
	
	// Headings - Quadrant 1&2 and y-axis label
	o.push ('<tr>');
	o.push ('<td class="chartlabels">' + x.AxisLabels.Y + '</td>');
	o.push ('<td class="boxheader" id="boxheader_1">' + x.Quadrants[0].Label + '</td>');
	o.push ('<td id="gap_column"></td>');
	o.push (' <td class="boxheader" id="boxheader_2">' + x.Quadrants[1].Label + '</td>');
	o.push ('</tr>');

	// Quadrant #1 & #2
	o.push ('<tr>');
		o.push ('<td colspan="4" style="padding:0px">');      	
		o.push (GetQuadrant(x.Segments, x.Quadrants[0], x.Quadrants[1]));      		
		o.push ('</td>');
	o.push ('</tr>');
  
	//Gap between quadrant 1,2 and quadrant 3,4
	o.push ('<tr id="gap_row"></tr>');

	// Headings - Quadrant 3&4
	o.push ('<tr>');
	o.push ('<td class="chartlabels"></td>');
	o.push ('<td class="boxheader" id="boxheader_3">' + x.Quadrants[2].Label + '</td>');
	o.push ('<td id="gap_column"></td>');
	o.push ('<td class="boxheader" id="boxheader_4">' + x.Quadrants[3].Label + '</td>');
	o.push ('</tr>');

	// Quadrant #3 & #4
	o.push ('<tr>');
		o.push ('<td colspan="4" style="padding:0px">');
		o.push (GetQuadrant(x.Segments, x.Quadrants[2], x.Quadrants[3]));			
		o.push ('</td>');
	o.push ('</tr>');

	//label x-axis label
	o.push ('<tr>');
	o.push ('<td colspan="3"></td>');
	o.push ('<td id="engagement">' + x.AxisLabels.X + '</td>');
	o.push ('</tr>');
  
	//drawing x and y axis with arrows
	o.push('<svg id="axis">');
	  o.push('<line x1="17%" y1="0%" x2="17%" y2="95%" class="axis_lines" />');
	  o.push('<line x1="17%" y1="0%" x2="16.6%" y2="3%" class="axis_lines" />');
	  o.push('<line x1="17%" y1="0%" x2="17.4%" y2="3%" class="axis_lines" />');
	  o.push('<line x1="17%" y1="95%" x2="100%" y2="95%" class="axis_lines" />');
	  o.push('<line x1="100%" y1="95%" x2="98%" y2="94.3%" class="axis_lines" />');
	  o.push('<line x1="100%" y1="95%" x2="98%" y2="95.7%" class="axis_lines" />');
	o.push('</svg>');
					
	o.push ('</table>');
  
  
  //javascript for settings of the proper attributes (mostly height) of the graphic elements - chart rectangle (used for grey background), svg "container" for chart and svg "container" for axis
	o.push ('<script>');
 
  //height of the table if there will be a few barchart - table would be too small, we have to set up this to default height 144 px
	o.push ('if (document.getElementsByClassName("Results")[0].offsetHeight <= 144 || document.getElementsByClassName("Results")[1].offsetHeight <= 144) {');
		o.push ('document.getElementsByClassName("Results")[0].style.height="144px";');
		o.push ('document.getElementsByClassName("Results")[1].style.height="144px";');      		
	o.push ('}');
  
	//settings of the same height for the chart background rectangle like table Results
	o.push ('for (i=0; i<4;i++) {')
		o.push ('document.getElementsByClassName("chart_rectangle")[i].setAttribute("height",document.getElementsByClassName("Results")[0].offsetHeight+"px");');      		      		
	o.push ('}');
	
	//settings of the same height and width for chart_background like table Results - svg chart_background is nested in the table Results
	o.push ('document.getElementsByClassName("chart_background")[0].style.height=document.getElementsByClassName("Results")[0].offsetHeight+"px";');
	o.push ('document.getElementsByClassName("chart_background")[0].style.width=document.getElementsByClassName("Results")[0].offsetWidth+"px";');
	o.push ('document.getElementsByClassName("chart_background")[1].style.height=document.getElementsByClassName("Results")[1].offsetHeight+"px";');
	o.push ('document.getElementsByClassName("chart_background")[1].style.width=document.getElementsByClassName("Results")[1].offsetWidth+"px";');
	
	//this part is for styling in the IE, variables for quadrant    
	o.push ('var barcharts_Q13 = document.getElementsByClassName("quadrant")');
	o.push ('var barcharts_Q24 = document.getElementsByClassName("quadrant2")');
  
	o.push ('if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) {');            
  
	//settings of the padding for barcharts in all quadrants
				o.push ('for (i=0; i<barcharts_Q13.length;i++) {');
					o.push ('barcharts_Q13[i].style.paddingLeft="31px";');
					o.push ('barcharts_Q24[i].style.paddingLeft="23px";');
				o.push ('}');
	o.push ('}');            
  	
    //settings of the paddign for barcharts in the chrome browser
    o.push ('if((navigator.userAgent.toLowerCase().indexOf("chrome") > -1) && (navigator.userAgent.toLowerCase().indexOf("safari") > -1) && (navigator.appName == "Netscape")){');
                o.push ('for (i=0; i<barcharts_Q13.length;i++) {');
                                o.push ('barcharts_Q13[i].style.paddingLeft="30px";');
                                o.push ('barcharts_Q24[i].style.paddingLeft="23px";');
                o.push ('}');
      			o.push ('document.getElementById("boxheader_1").style.position="relative";');
      			o.push ('document.getElementById("boxheader_1").style.left="-1.15px";');
      			o.push ('document.getElementById("boxheader_1").style.width="361px";');      			
      			o.push ('document.getElementById("boxheader_3").style.position="relative";');
      			o.push ('document.getElementById("boxheader_3").style.left="-1.15px";');
      			o.push ('document.getElementById("boxheader_3").style.width="361px";');      		
    o.push ('}');
    
	//settings of the height of the axis, according to Inspect element real height of the element is higher (approx. 1.09) than clientHeight or offsetHeight
  	o.push ('var EEtable_height = document.getElementById("eechart").offsetHeight;'); 
  	o.push ('if (EEtable_height <= 450 ) {');
		//Decrement of the height because we need label Engagement under the axis.
		o.push ('document.getElementById("axis").style.height=(EEtable_height-15)+"px";'); 
  	o.push ('} else {');
		o.push ('document.getElementById("axis").style.height=(EEtable_height)+"px";'); 
  	o.push ('}');
		
	o.push ('</script>');
  
	return o.join('\n');
	
}

private static function GetQuadrant(labels, data1, data2) {
	var o=[]; 
	var barChart_width=0;
	var barLabel_position=0
  
	//table Results is nested in the tr/td element of the main table eechart
	o.push ('<table class="Results">');
	//row for the gap between chart labels/text scale (0, 25, 50, 75, 100) and chart
	o.push ('<tr style="height:10px"></tr>');
  
	//for loop for rendering segment labels and barcharts
	for (var i=0; i<labels.length; i++) {
		o.push ('<tr>');
			// column for segment labels
			o.push ('<td class="segmentname">');
			o.push ('<div style="">' + labels[i] + '</div>' );
			o.push ('</td>'); 
		
 
  
		  //column for rendering chart for quadrants #1 and #3, every quadrant has got fixed width 330 px (reason why you have to multiple score by 3.3), every barchart has got fixed height 20px
			o.push ('<td class="quadrant">');
		
		  //display:block is here because without this css style vertical-align:middle for table Results tr/td doesn't work properly              		
				o.push ('<svg width="330px" height="20px" style="position:relative; display:block">');
				barChart_width=parseInt(data1.Scores[i]*3.3);
				
				//settings for the color of the barchart, only first barchart will be colored
				if (i==0) {
						o.push ('<rect x="0px"  y="0" width="'+barChart_width+'px" height="20px" style="fill:'+data1.Color+'" />'); 
				} else {
						o.push ('<rect x="0px"  y="0" width="'+barChart_width+'px" height="20px" style="fill:#c0c0c0" />');	
				}
		  
				//settings for the position of the reached score
				if (data1.Scores[i]>=10) {
						barLabel_position=barChart_width-20;
						o.push ('<text x="'+barLabel_position+'px" y="15px" fill="white">'+data1.Scores[i]+'</text>');
				} else if (data1.Scores[i]>=5 && data1.Scores[i]<10) {
						barLabel_position=barChart_width-13;
						o.push ('<text x="'+barLabel_position+'px" y="15px" fill="white">'+data1.Scores[i]+'</text>');
				} else if (data1.Scores[i]>0 && data1.Scores[i]<5){
						barLabel_position=barChart_width+5;
						o.push ('<text x="'+barLabel_position+'px" y="15px" fill="black">'+data1.Scores[i]+'</text>'); 
				}              
														
				o.push ('</svg>');              		            
			o.push ('</td>');
		  
		  //Gap column between quadrant #1 and #2 (#3 and #4)
			o.push ('<td id="gap_column"></td>');
		  
		  //column for rendering barchart for quadrants #2 and #4, every quadrant has got fixed width 330 px (reason why you have to multiple score by 3.3), every barchart has got fixed height 20px
			o.push ('<td class="quadrant2">');     
		  //display:block is here because without this css style vertical-align:middle for table Results tr/td doesn't work properly              	
			o.push ('<svg width="330px" height="20px" style="position:relative; display:block">');
				barChart_width=parseInt(data2.Scores[i]*3.3);
									
				//settings for the color of the barchart, only first barchart will be colored              
				if (i==0) {
				  o.push ('<rect x="0px"  y="0" width="'+barChart_width+'px" height="20px" style="fill:'+data2.Color+';" />'); 
				} else {
				  o.push ('<rect x="0px"  y="0" width="'+barChart_width+'px" height="20px" style="fill:#c0c0c0;" />');	
				}
		  
				//settings for the position of the reached score
				if (data2.Scores[i]>=10) {
						barLabel_position=barChart_width-20;
						o.push ('<text x="'+barLabel_position+'px" y="15px" fill="white">'+data2.Scores[i]+'</text>');
				} else if (data2.Scores[i]>=5 && data2.Scores[i]<12) {
						barLabel_position=barChart_width-13;
						o.push ('<text x="'+barLabel_position+'px" y="15px" fill="white">'+data2.Scores[i]+'</text>');
				} else if (data2.Scores[i]>0 && data2.Scores[i]<5){
						barLabel_position=barChart_width+5;
						o.push ('<text x="'+barLabel_position+'px" y="15px" fill="black">'+data2.Scores[i]+'</text>'); 
				}              
														
				o.push ('</svg>');
				o.push ('</td>');
 
			o.push ('</tr>');              
		}
	
	o.push (QuadrantChartBackground());	
  
	o.push ('</table>');
  
	return o.join('\n');
}

private static function QuadrantChartBackground(){
	var o=[];
					
	o.push ('<svg class="chart_background">');
		
	//this part is for rendering quadrant #1 and #3 - rectangle for background, lines and text
	o.push ('<rect x="170px"  y="0%" width="364px" height="100%" class="chart_rectangle" />'); 
	o.push ('<line x1="185px" y1="15px" x2="185px" y2="98%" class="chart_lines" />');     			
	o.push ('<line x1="267.5px" y1="15px" x2="267.5px" y2="98%" class="chart_lines" />');                   			
	o.push ('<line x1="350px" y1="15px" x2="350px" y2="98%" class="chart_lines" />');                
	o.push ('<line x1="432.5px" y1="15px" x2="432.5px" y2="98%" class="chart_lines" />');               
	o.push ('<line x1="515px" y1="15px" x2="515px" y2="98%" class="chart_lines" />');			
	o.push ('<text x="182px" y="12px" fill="black" class="chartScale">0</text>');	
	o.push ('<text x="260px" y="12px" fill="black" class="chartScale">25</text>');
	o.push ('<text x="344px" y="12px" fill="black" class="chartScale">50</text>');
	o.push ('<text x="426px" y="12px" fill="black" class="chartScale">75</text>');
	o.push ('<text x="504px" y="12px" fill="black" class="chartScale">100</text>');     	 

  
	//this part is for rendering quadrant #2 and #4 - rectangle for background, lines and text
	o.push ('<rect x="555px"  y="0%" width="364px" height="100%" class="chart_rectangle" />');
	o.push ('<line x1="570px" y1="15px" x2="570px" y2="98%" class="chart_lines" />');      			
	o.push ('<line x1="652.5px" y1="15px" x2="652.5px" y2="98%" class="chart_lines" />');                
	o.push ('<line x1="735px" y1="15px" x2="735px" y2="98%" class="chart_lines" />');                
	o.push ('<line x1="817.5px" y1="15px" x2="817.5px" y2="98%" class="chart_lines" />');                
	o.push ('<line x1="900px" y1="15px" x2="900px" y2="98%" class="chart_lines" />');
	o.push ('<text x="566px" y="12px" fill="black" class="chartScale">0</text>');	
	o.push ('<text x="645px" y="12px" fill="black" class="chartScale">25</text>');
	o.push ('<text x="727px" y="12px" fill="black" class="chartScale">50</text>');
	o.push ('<text x="811px" y="12px" fill="black" class="chartScale">75</text>');
	o.push ('<text x="887px" y="12px" fill="black" class="chartScale">100</text>');      		    
	o.push ('</svg>');             	
	
	return o.join('\n');
}
	
private static function Css() {
	var o=[];
	var labels_width=150;
	var quadrant_width=360;
	
	o.push('<style>');
  	o.push('#eechart{width: 918px; height:100%; table-layout:fixed; padding:0px; border-spacing:0px; min-height:300px;}');
	o.push('.chartlabels{width:18.5%;height:26px; color:#999; font-family:arial; font-size:16px; font-weight: bold; padding:3px 0px 3px 0px}');  
	o.push('.chartScale{font-size:12px;}');
	o.push('#gap_row{height:20px; padding:0px;}');
	o.push('#gap_column{width:20px;padding:0px;}');
	o.push('#engagement{text-align:right;vertical-align:bottom;color:#999; font-family:arial; font-size:16px; font-weight: bold; padding:25px 0px 0px 0px}');     
	o.push('.segmentname {width:'+labels_width+'px; position:relative; text-align: right;font-family: arial; font-size: 11px; color: #999; padding:10px 10px 10px 0px;}');
	o.push('.quadrant{width:'+quadrant_width+'px; height:100%;position:relative;padding:0px 0px 0px 28.5px;}');
	o.push('.quadrant2{width:'+quadrant_width+'px; height:100%;position:relative;padding:0px 0px 0px 22px;}');
	o.push('.boxheader{width:'+quadrant_width+'px;color:white;text-align:center;vertical-align:middle; font-family:arial; font-size:14px; padding:0px}');
	o.push('#boxheader_1 {background-color:#00B7F1;}');
	o.push('#boxheader_2 {background-color:#82C341;}');
	o.push('#boxheader_3 {background-color:#F03223;}');
	o.push('#boxheader_4 {background-color:#F99B1E;}');
	o.push('.chart_background{position:absolute}');
	o.push('.chart_lines{stroke:white;stroke-width:1;}');
	o.push('.chart_rectangle{fill:#ebebe0;}');
  	o.push('#axis{position:absolute;width:918px;}');
	o.push('.axis_lines{stroke:black;stroke-width:1.5px;}');		     	
  	o.push('.Results {width:918px}'); 
	o.push('.Results tr td{vertical-align: middle}');
	o.push('</style>');
	
	return o.join('\n');

}*/
  
}