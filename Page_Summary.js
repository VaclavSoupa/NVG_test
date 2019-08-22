class Page_Summary {

  //Adds data to pageContext for the page to use
  public static function AddDataToPageContext(report : Report, state : ReportState, user : User, pageContext : ScriptPageContext){
  	//Get results out
    ConfirmitClass.lg.LogDebug('starting adding data to context');
    var qm = QueryManager.GetQueryManagerMain(report, state, user, true);
    ConfirmitClass.lg.LogDebug('calculating questions');
    var qs = qm.GetAllQuestions();
    ConfirmitClass.lg.LogDebug('done calculating');
    //Put qm into page context
    pageContext.Items[PageContextEnum.qm] = qm;
  }
  
  //Generates a table used for chart on Summary page for dimensions
  //Params: id of the dimension (0-4), pageContext, table that will be generated
  public static function GenerateDimensionTableForChart(id, pageContext, table){
    //Clear the table
   	table.ColumnHeaders.Clear();
    
    //Disable caching
    table.Caching.Enabled = false;
    
  	//Add content headers - 2 headers to rows, one header to columns
    table.RowHeaders.Add(new HeaderContent());
    table.RowHeaders.Add(new HeaderContent());
    table.ColumnHeaders.Add(new HeaderContent());
    
    //Get the dimension
    var dimension = pageContext.Items[PageContextEnum.qm].GetOneDimensionById(Config.Summary.Dimensions[id]);
    
    //Add dimension data to the table
    if(!dimension.IsSuppressed()){
      var hc : HeaderContent = table.ColumnHeaders[0];
      hc.SetCellValue (0, 100-dimension.GetScores().fav);
      hc.SetCellValue (1, dimension.GetScores().fav);
    }
  }
  
  //Generates one table based on scores for report level and comparator
  //TODO: CLEANUP, THIS FUNCTION NEEDS TO BE LESS COMPLICATED
  public static function RenderTable(object, state){
		var d = [];
		var pdf = false;

		var margin_bottom = 30;
		if (ExecutionMode.isPDF(state)){
			pdf = true;
			margin_bottom = 2;
			d.push ('<style>.chart_placeholder{height: 120px; overflow-y: hidden; position: relative; top: -7px;}</style>');
			d.push ('<style>.mainheader {display:none} </style>');
			d.push ('<style>.IntroText {padding-top:0px; padding-bottom:0px} </style>');
		}
      
	
    /*
    var cols = [
    {
        Label: 'Your Results',
        Score: '75%'
    },
    {
        Label: 'Company Overall',
        Score: '73%'
    }
    ];
    
    var object = {
        Id: 'ABC',
        ChartHtml: html, // optional
        Heading: 'Response Rate',
        SmartText: 'Smart Text',
        Columns: cols
    };
    */

		d.push ('<table style="border-collapse:collapse; width: 100%">');

		// Label Row
		d.push ('<tr>');
        for (var i=0; i<object.Columns.length; ++i) {
              d.push ('<td class=datacell>' + object.Columns[i].Label + '</td>');
              d.push ('<td class="datacell scorecell" style="border-right-width:4px">' + object.Columns[i].Score + '</td>');
        }
		d.push ('</tr>');

			
		// N size Row
		d.push ('<tr>');
		d.push ('<td class=datacell style="border-right-width:4px; width:100%" colspan=' + Math.max(1, 2*object.Columns.length) + '>' + object.SmartText + '</td>');
		d.push ('</tr>');
		d.push ('</table>');

		var o = [];

		o.push ('<style>');
		o.push ('.summaryheader {padding: 12px; background-color:#919191; font-weight: normal; font-family: arial; font-size: 16px; color: white}');
		o.push ('.summarycontent {background-color:#DDDFED; padding: 10px 20px 10px 20px}');
		o.push ('.datacell {color: #000; font-family: arial; font-size:14px; width:200px;  text-align:center; background-color:#fff; padding:10px; border-bottom:4px solid #DFE1DF; border-right:2px solid #DFE1DF}');
		o.push ('.scorecell {font-size: 24px}');
		o.push ('</style>');

      	if(object.WidgetForce != null && object.WidgetForce){
          	o.push ('<div id=summarypage style="max-height:320px; overflow:hidden">');
          o.push ('<table style="border-collapse: collapse; margin-bottom:' + margin_bottom + 'px; width:100%; height:320px;">');
        }
      	else{
			o.push ('<div id=summarypage style="max-height:290px; overflow:hidden">');
			o.push ('<table style="border-collapse: collapse; margin-bottom:' + margin_bottom + 'px; width:100%">');
        }

		// Heading
		o.push ('<tr>');
		
		if (!pdf) {
			
          	if(object.WidgetForce != null && object.WidgetForce)
              o.push ('<td colspan=2 style="padding: 0px; height:48px;">');
          	else
				o.push ('<td colspan=2 style="padding: 0px">');

			o.push ('<table style="max-height:290px; border-collapse: collapse; padding:0px; width:100%"><tr>');
			o.push ('<td class=summaryheader>' + object.Heading + '</td>');
			o.push ('<td style="width:38px; background-color: #919191"></td>');
			o.push ('<td style="width:38px; background-color: #919191"></td>');
			o.push ('</tr></table>');


			o.push ('</td>')

			o.push ('</tr>');


			// Content
			o.push ('<tr>');
		}
		else {
			// PDF rendering
			o.push ('<td class=summaryheader><div style="width:140px;">' + object.Heading + '</div></td>');			
		}
		
		o.push ('<td align=center class="summarycontent" style="padding:0px; width:185px; border-right: 2px solid white">');
		o.push ('<div class="chart_placeholder scaling" id="' + object.Id + '"; style="' + (object.Style == null ? '' : object.Style)  + '">' + 
			  ( object.ChartHtml == null ? '' : ('<div class="widget" style="vertical-align:middle; text-align:center; color:#999; width:280px; height:270px; margin-right:10px">' + object.ChartHtml + '</div>' )) + 
		'</div>');
		o.push ('</td>');

      
      if (object.Columns.length == 0) {
		o.push ('<td align=center class="summarycontent" style="background-color:#f6f6f6; vertical-align:top">');
		o.push ('<div class=SummaryWidget>' + object.SmartText  + '</div>');
      }
      else {
	      o.push ('<td align=center class="summarycontent" style="width:620px">');
		  o.push ( d.join ('\n') );
      }
      
		o.push ('</td>');
		o.push ('</tr>');
		o.push ('</table>');
		o.push ('</div>');

		return ( o.join('\n') );
  }
  
  //Sets additional styling on charts on Summary page in case of PDF execution
  static function ChartPrerender ( chart : Chart, state) {
	if (ExecutionMode.isPDF(state)) {
		chart.Height = 135;
		chart.Width = 135;
	}
  }
}