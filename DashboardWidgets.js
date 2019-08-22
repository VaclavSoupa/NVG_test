//NOTE: THIS SCRIPT CONTAINS VARIOUS CLASSES CORRESPONDING TO DASHBOARD WIDGETS
//This script contains following classes: [CLASS NAME] : [LINE]
//Generic widget abstract class : 19 
//WidgetTopDims : 87
//WidgetStrengths : 173
//WidgetOpps : 260
//WidgetInternalComp : 347
//WidgetTrend : 472
//WidgetNorm : 594
//WidgetKDA : 719
//WidgetCommentThemes : 853
//WidgetENPS : 1206
//WidgetEEF2 : 1273
//WidgetRR : 1457
//WidgetEngEna : 1538
//WidgetTier1 : 1579

//Generic Widget abstract class
abstract class DashboardWidget{
	private var title = 'WIDGET';
  	protected var showButton = true; //if true - "MORE" button should show
  	protected var widgetId = -1; //id of the widget for current user
  	protected var qm : QueryManager = null; //can be used as a handle to QueryManager
  	protected var rtProject : Project = null; //can be used as a handle to RT survey
  	protected var widgetsT = null;
    protected var labelsT = null;
  	protected var idx = 0;
  
  	//Constructor - YOU HAVE TO CALL IT FOR WIDGET TO WORK PROPERLY
  	//Params: id of the widget, list of texts from widgets question from RT, list of texts from labels question from RT,
  	//idx (value from CustomWidget enum) of the current widget
  	public function DashboardWidget(id : int, widgetsTexts, labelsTexts, widgetIdx){
  		widgetId = id;	
      	widgetsT = widgetsTexts;
        labelsT = labelsTexts;
      	idx = widgetIdx;
    }
  
  	//This function should always return HTML body of the widget (main portion of it)
  	abstract function GetBody() : String;
  
  	//Returns title
  	final public function GetTitle(){
    	return title;
    }
  	
  	//Sets the title
  	final public function SetTitle(newTitle : String){
  		title = newTitle;
    }
  
  	//Returns showButton property
  	final public function DoShowButton(){
  		return showButton;	
    }
  
  	//Hides the button
  	final public function HideButton(){
  		showButton = false;
    }
  
  	//Returns Id
  	final public function GetId(){
  		return widgetId;
    }
  	
  	//Returns HTML for the MORE button
  	//Params: label for the button
  	final public function GetButtonHTML(label : String){
      	var output = '';
      	if(showButton){
      		output = '<script>' +
                      'function navigate_' + widgetId + '() {' +
                          'var buttons = document.getElementById("navbuttons").getElementsByTagName("input");' +
                          'buttons[' + idx + '].click();' +
                      '}' +
                      '</script>' +
                      '<input style="width:70px; cursor: pointer" type=button value="' + 
                              label + '" onclick="' + 'javascript:navigate_' + widgetId + '()"' + '>'
        }
      	return output;
    }
}
//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------
//Top survey dimensions widget
class WidgetTopDims extends DashboardWidget{
  	private var m_report : Report = null;
  	private var m_state  : ReportState = null;
  
  	//Constructor
  	//Params: report object, state object, handle to query manager, id of the widget for current user, 
  	//list of texts from widgets question from RT, list of texts from labels question from RT, widgetIdx
  	public function WidgetTopDims(report : Report, state : ReportState, qMan : QueryManager, id : int, widgetsTexts, labelsTexts, widgetIdx){
      	super(id, widgetsTexts, labelsTexts, widgetIdx);
      	qm = qMan;
      	m_report = report;
      	m_state = state;
      	SetTitle(widgetsT['TOP_DIM']);
    }
  	
  	//Return HTML body of the widget (main portion of it)
    public function GetBody(){
      	var dimensions = qm.GetCoreDimensions();
        var sortedDims = dimensions.sort(SortUtil.SortHgDimensionByFav);
      	var favLabel = labelsT['Favorable'].toUpperCase();
      	var o=[];
		
      	var bw = ExecutionMode.isPdfBlackWhite(m_state);
      	
      	//Generate HTML
		o.push ('<style>');
        o.push ('#widgetdimensions .col1 {padding: 0px; margin:0px; text-align:center; width:40px; height: 54px; font-family:arial; font-size:30px; color:white; font-weight: bold}');
		o.push ('#widgetdimensions .col2 {text-align:left; padding-left:12px; color:white; width:160px; font-family:arial; font-size:14px; font-weight: normal}');
        o.push ('#widgetdimensions .col3 {padding: 0px; margin:0px; text-align:center; color:white; text-align:center; width:50px; font-family:arial; font-size:12px; font-weight: bold}');
		o.push ('</style>');
		
      	var colors = [{Light: '#2284C6', Dark: '#0071BB'}, {Light: '#34BFEF', Dark: '#00B2EB'}, {Light: '#D3C8C6', Dark: '#B4B5B8'}];

      	o.push ('<div id=widgetdimensions style="padding-top:16px"><table style="border-collapse:collapse">');
		
      	//Add 3 dimensons
      	for (var i=0; ((i<3) && (i<sortedDims.length)); i++) {
			o.push ('<tr>');
          
         	// Rank Column
			o.push ('<td class=col1 style="background-color: ' + colors[i].Light + '">' + (i+1) + '</td>');
			
          	// Text Column
			o.push ( 
              	bw
                ? '<td class=col2 style="background-color: white; color:black; border:1px solid #c0c0c0">'
                : '<td class=col2 style="background-color: ' + colors[i].Dark + '">'
            );
			o.push (sortedDims[i].GetTitle() + '</td>');
			
          	// Score Column
			o.push ('<td class=col3 style="background-color: ' + colors[i].Light + '">');
          	
          	var score = sortedDims[i].GetScores().fav;
          	if(!sortedDims[i].IsSuppressed())
              var score = score + '%';
          
			o.push (favLabel + '<br>' + score);
			o.push ('</td></tr>');
		}			

		o.push ('</table></div>');
      	var x : String = o.join('\n');
    	return x;
    }
  
  	//Adds all necessary data to pageContext to be used on the slide
  	public static function AddDataForSlideToPageContext(user : User, report : Report, state : ReportState, pageContext : ScriptPageContext){
    	//Get out all dimensions
      	var qm = QueryManager.GetQueryManagerMain(report, state, user, true);
      	var dimensions = qm.GetCoreDimensions();
      
      	//Sort appropriately
  		var sortedDims = dimensions.sort(SortUtil.SortHgDimensionByFav);
      
      	//Get the fav label
      	var favLabel = ResourceText.Text(report, 'labels', 'Favorable').toUpperCase();
      
      	//Add to pageContext
      	pageContext.Items['dimensions'] = sortedDims;
      	pageContext.Items['favLabel'] = favLabel;
    }
}
//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------
//Strengths widget
class WidgetStrengths extends DashboardWidget{
  	private var m_report : Report = null;
  	private var m_state  : ReportState = null;
  
  	//Constructor
  	//Params: report object, state object, handle to query manager, id of the widget for current user
  	public function WidgetStrengths(report : Report, state : ReportState, qMan : QueryManager, id : int, widgetsTexts, labelsTexts, widgetIdx){
      	super(id, widgetsTexts, labelsTexts, widgetIdx);
      	qm = qMan;
      	m_report = report;
      	m_state = state;
      	SetTitle(widgetsT['STRENGTHS']);
    }
  	
  	//Return HTML body of the widget (main portion of it)
    public function GetBody(){
      	//Get questions
      	var sortedQs = Page_RST.GetStrengths(m_report, m_state, null, Config.Widgets.Strengths, qm);
      	var favLabel = labelsT['Favorable'].toUpperCase();
      	var o=[];
		
      	var bw = ExecutionMode.isPdfBlackWhite(m_state);
      	
      	//Generate HTML
		o.push ('<style>');
        o.push ('#widget_list td {border-bottom: 1px solid #F1EEED; padding: 12px}');
		o.push ('#widget_list .eeheading {padding-top: 6px; padding-bottom:2px; text-align: left; margin-bottom: 2px; color: #17B0B6; font-family: arial; font-size: 12px; text-transform: uppercase;}');
		o.push ('#widget_list .eecol1 {margin: 0px; text-align:center; width:40px; height: 38px; font-family:arial; font-size:30px; color:white; font-weight: bold}');
        o.push ('#widget_list .eecol2 {padding: 2px; padding-left: 4px; padding-right: 4px; text-align:left; color:white; width:160px; font-family:arial; font-size: 10px; font-weight: normal}');
		o.push ('#widget_list .eecol3 {margin: 0px; text-align:center; color:white; text-align:center; width:50px; font-family:arial; font-size:12px; font-weight: bold}');
		o.push ('</style>');
		
      	var colors = {Light: '#2284C6', Dark: '#0071BB'};

      	o.push ('<div id=widget_list><table style="border-collapse:collapse">');
		
      	//Add 3 questions
		for (var i=0; i<Config.Widgets.Strengths && i<sortedQs.length; i++) {
			o.push ('<tr>');
          
         	// Rank Column
			o.push ('<td class=eecol1 style="background-color: ' + colors.Light + '">' + (i+1) + '</td>');
			
          	// Text Column
			o.push ( 
              	bw
                ? '<td class=eecol2 style="background-color: white; color:black; border:1px solid #c0c0c0">'
                : '<td class=eecol2 style="background-color: ' + colors.Dark + '">'
            );
			if(sortedQs[i].IsSuppressed())
              	o.push ('-</td>');
            else
				o.push (sortedQs[i].text + '</td>');
			
          	// Score Column
			o.push ('<td class=eecol3 style="background-color: ' + colors.Light + '">');
          	
          	var score = sortedQs[i].GetScores().fav;
          	if(!sortedQs[i].IsSuppressed())
              var score = score + '%';
          
			o.push (favLabel + '<br>' + score);
			o.push ('</td></tr>');
		}			

		o.push ('</table></div>');
      	var x : String = o.join('\n');
    	return x;
    }
  
  	//Adds data to pageContext for the slide to use
  	public static function AddDataForSlideToPageContext(user, report, state, pageContext : ScriptPageContext){
    	//Get results out
    	var qm = QueryManager.GetQueryManagerMain(report, state, user, true);
      	
        //Sort them by strength
      	var sortedQs = Page_RST.GetStrengths(report, state, null, Config.Widgets.Strengths, qm);
      	var favLabel = ResourceText.Text(report, 'labels', 'Favorable').toUpperCase();
      
      	//Add data to pageContext
      	pageContext.Items['favLabel'] = favLabel;
      	pageContext.Items['strengths'] = sortedQs;
    }
}
//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------
//Opportunitites widget
class WidgetOpps extends DashboardWidget{
  	private var m_report : Report = null;
  	private var m_state  : ReportState = null;
  
  	//Constructor
  	//Params: report object, state object, handle to query manager, id of the widget for current user
  	public function WidgetOpps(report : Report, state : ReportState, qMan : QueryManager, id : int, widgetsTexts, labelsTexts, widgetIdx){
      	super(id, widgetsTexts, labelsTexts, widgetIdx);
      	qm = qMan;
      	m_report = report;
      	m_state = state;
      	SetTitle(widgetsT['OPPS']);
    }
  	
  	//Return HTML body of the widget (main portion of it)
    public function GetBody(){
      	//Get questions
      	var sortedQs = Page_RST.GetOpportunities(m_report, m_state, null, Config.Widgets.Opportunities, qm);
      	var favLabel = labelsT['Favorable'].toUpperCase();
      	var o=[];
		
      	var bw = ExecutionMode.isPdfBlackWhite(m_state);
      	
      	//Generate HTML
		o.push ('<style>');
        o.push ('#widget_list td {border-bottom: 1px solid #F1EEED; padding: 12px}');
		o.push ('#widget_list .eeheading {padding-top: 6px; padding-bottom:2px; text-align: left; margin-bottom: 2px; color: #17B0B6; font-family: arial; font-size: 12px; text-transform: uppercase;}');
		o.push ('#widget_list .eecol1 {margin: 0px; text-align:center; width:40px; height: 38px; font-family:arial; font-size:30px; color:white; font-weight: bold}');
        o.push ('#widget_list .eecol2 {padding: 2px; padding-left: 4px; padding-right: 4px; text-align:left; color:white; width:160px; font-family:arial; font-size: 10px; font-weight: normal}');
		o.push ('#widget_list .eecol3 {margin: 0px; text-align:center; color:white; text-align:center; width:50px; font-family:arial; font-size:12px; font-weight: bold}');
		o.push ('</style>');
		
      	var colors = {Light: '#34BFEF', Dark: '#00B2EB'};

      	o.push ('<div id=widget_list><table style="border-collapse:collapse">');
		
      	//Add 3 questions
		for (var i=0; i<Config.Widgets.Opportunities && i<sortedQs.length; i++) {
			o.push ('<tr>');
          
         	// Rank Column
			o.push ('<td class=eecol1 style="background-color: ' + colors.Light + '">' + (i+1) + '</td>');
			
          	// Text Column
			o.push ( 
              	bw
                ? '<td class=eecol2 style="background-color: white; color:black; border:1px solid #c0c0c0">'
                : '<td class=eecol2 style="background-color: ' + colors.Dark + '">'
            );
			if(sortedQs[i].IsSuppressed())
              	o.push ('-</td>');
            else
				o.push (sortedQs[i].text + '</td>');
			
          	// Score Column
			o.push ('<td class=eecol3 style="background-color: ' + colors.Light + '">');
          	
          	var score = sortedQs[i].GetScores().fav;
          	if(!sortedQs[i].IsSuppressed())
              var score = score + '%';
          
			o.push (favLabel + '<br>' + score);
			o.push ('</td></tr>');
		}			

		o.push ('</table></div>');
      	var x : String = o.join('\n');
    	return x;
    }
  
  	//Adds data to pageContext for the slide to use
  	public static function AddDataForSlideToPageContext(user, report, state, pageContext : ScriptPageContext){
    	//Get results out
    	var qm = QueryManager.GetQueryManagerMain(report, state, user, true);
      	
        //Sort them by strength
      	var sortedQs = Page_RST.GetOpportunities(report, state, null, Config.Widgets.Opportunities, qm);
      	var favLabel = ResourceText.Text(report, 'labels', 'Favorable').toUpperCase();
      
      	//Add data to pageContext
      	pageContext.Items['favLabel'] = favLabel;
      	pageContext.Items['opps'] = sortedQs;
    }
}
//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------
//Internal comparison widget
class WidgetInternalComp extends DashboardWidget{
  	private var m_report : Report = null;
  	private var m_state  : ReportState = null;
  	private var m_user : User = null;
  	private var positiveCount = 0;
  	private var negativeCount = 0;
  
  	//Constructor
  	//Params: report object, state object, handle to query manager, id of the widget for current user
  	public function WidgetInternalComp(report : Report, state : ReportState, qMan : QueryManager, id : int, widgetsTexts, labelsTexts, user : User, widgetIdx){
      	super(id, widgetsTexts, labelsTexts, widgetIdx);
      	qm = qMan;
      	m_report = report;
      	m_state = state;
      	m_user = user;
      	SetTitle(widgetsT['INTERNAL_COMP']);
    }
  	
  	//Return HTML body of the widget (main portion of it)
    public function GetBody(){
      	var o = [];
        var bw = ExecutionMode.isPdfBlackWhite(m_state);
      	CalculateCounts();
      
      	//Prepare the heading
      	var top = ComparatorUtil.Top(m_report, m_user, m_state);
      	var heading = widgetsT['ComparedtoCompany'].split('[BRANCH]').join(top.TableLabel).split('[COMPARATOR]').join(top.TableLabel);
        
      	//Add heading
      	o.push ('<div  style="text-align:left; height:35px; margin-bottom:4px; color: #17B0B6; font-family: arial; font-size: 11px;">' + heading + 
                '</div><table border=0 style="border-collapse:collapse;">');
		
      	o.push ('<tr>');
        
      	//Prepare 2 rows
      	var Positive = {
            Colors: {Light: '#2284C6', Dark: '#0071BB'},
            Text: widgetsT['NumberAbove'],
            ImageUrl: Config.FileFolder + 'Thumb-Up.png',
            Score: positiveCount
        };

        var Negative = {
            Colors: {Light: '#F68A47', Dark: '#F36F23'},
            Text: widgetsT['NumberBelow'],
            ImageUrl: Config.FileFolder + 'Thumb-Down.png',
            Score: negativeCount
        };

        var Rows = [Positive, Negative];
      	
      	//Generate 2 rows
      	for (var i=0; i<Rows.length; ++i) {

            o.push ('<tr>');
            // Image Column
            o.push ('<td style="' + ( bw ? 'border:1px solid #c0c0c0' : '' ) + ';padding:5px; text-align:center; width:60px; height:30px; background-color: ' + 
              		(bw ? '#f0f0f0' : Rows[i].Colors.Light) + '">');
            o.push ('<img style="width:55px" src="' + Rows[i].ImageUrl + '">');
            o.push ('</td>');
          	
          	// Text Column
          	o.push ('<td style="' + ( bw ? 'border:1px solid #c0c0c0' : '' ) + ';text-align:center; font-family: Arial; width: 110px; padding:5px; font-size: 10px;' + 
                   ( bw ? 'background-color: white; color:black;' : ('background-color: ' + Rows[i].Colors.Dark + '; color:white;')) + '">'
            );
            o.push ( Rows[i].Text );
            o.push ('</td>');
          
          	// Score Column
            o.push ('<td style="text-align:center; font-family: Arial; width: 60px; padding:10px; background-color: ' + Rows[i].Colors.Light + '; color:white; font-size: 36px; font-weight: bold">');
            o.push ( Rows[i].Score );
            o.push ('</td>');
          
            o.push ('</tr>');
        }
      	o.push ('</table>');
      
      	var x : String = o.join('\n');
    	return x;
    }
  
  	//Calculates positive and negative thumb counts for this widget
  	private function CalculateCounts(){
  		//Get questions
      	var qs = qm.GetCoreQuestions();
      
      	//Count positive and negative questions
      	for(var i = 0; i<qs.length; i++){
      		if(qs[i].internalComps[0].GetStatSigCode() == SigTest.Codes.Positive || 
               qs[i].internalComps[0].GetStatSigCode() == SigTest.Codes.PositiveNoBackgroundColor)
              	positiveCount++;
          	else if(qs[i].internalComps[0].GetStatSigCode() == SigTest.Codes.Negative || 
                    qs[i].internalComps[0].GetStatSigCode() == SigTest.Codes.NegativeNoBackgroundColor)
              	negativeCount++;
        }
    }
  
  	//Outputs all data into the pagecontext for the slide to use
  	public static function AddDataForSlideToPageContext(user : User, report : Report, state : ReportState, pageContext : ScriptPageContext){
  		//Get results out
    	var qm = QueryManager.GetQueryManagerMain(report, state, user, true);
      
      	//Get questions
      	var qs = qm.GetCoreQuestions();
      
      	//Count positive and negative questions
      	var positiveCount = 0;
      	var negativeCount = 0;
      	for(var i = 0; i<qs.length; i++){
      		if(qs[i].internalComps[0].GetStatSigCode() == SigTest.Codes.Positive || 
               qs[i].internalComps[0].GetStatSigCode() == SigTest.Codes.PositiveNoBackgroundColor)
              	positiveCount++;
          	else if(qs[i].internalComps[0].GetStatSigCode() == SigTest.Codes.Negative || 
                    qs[i].internalComps[0].GetStatSigCode() == SigTest.Codes.NegativeNoBackgroundColor)
              	negativeCount++;
        }
      
      	//Add positive and negative counts to page context
      	pageContext.Items['positiveCount'] = positiveCount;
      	pageContext.Items['negativeCount'] = negativeCount;
    }
}
//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------
//Trend widget
class WidgetTrend extends DashboardWidget{
  	private var m_report : Report = null;
  	private var m_state  : ReportState = null;
  	private var positiveCount = 0;
  	private var negativeCount = 0;
  
  	//Constructor
  	//Params: report object, state object, handle to query manager, id of the widget for current user
  	public function WidgetTrend(report : Report, state : ReportState, qMan : QueryManager, id : int, widgetsTexts, labelsTexts, widgetIdx){
      	super(id, widgetsTexts, labelsTexts, widgetIdx);
      	qm = qMan;
      	m_report = report;
      	m_state = state;
      	SetTitle(widgetsT['Q_TREND']);
    }
  	
  	//Return HTML body of the widget (main portion of it)
    public function GetBody(){
      	var o = [];
        var bw = ExecutionMode.isPdfBlackWhite(m_state);
      	CalculateCounts();
      
      	//Prepare the heading
      	var heading = widgetsT['ChangeSincePrevious'];
        
      	//Add heading
      	o.push ('<div  style="text-align:left; height:35px; margin-bottom:4px; color: #17B0B6; font-family: arial; font-size: 11px;">' + heading + 
                '</div><table border=0 style="border-collapse:collapse;">');
		
      	o.push ('<tr>');
        
      	//Prepare 2 rows
      	var Positive = {
            Colors: {Light: '#2284C6', Dark: '#0071BB'},
            Text: widgetsT['NumberImproved'],
            ImageUrl: Config.FileFolder + 'Thumb-Up.png',
            Score: positiveCount
        };

        var Negative = {
            Colors: {Light: '#F68A47', Dark: '#F36F23'},
            Text: widgetsT['NumberDeclined'],
            ImageUrl: Config.FileFolder + 'Thumb-Down.png',
            Score: negativeCount
        };

        var Rows = [Positive, Negative];
      	
      	//Generate 2 rows
      	for (var i=0; i<Rows.length; ++i) {

            o.push ('<tr>');
            // Image Column
            o.push ('<td style="' + ( bw ? 'border:1px solid #c0c0c0' : '' ) + ';padding:5px; text-align:center; width:60px; height:30px; background-color: ' + 
              		(bw ? '#f0f0f0' : Rows[i].Colors.Light) + '">');
            o.push ('<img style="width:55px" src="' + Rows[i].ImageUrl + '">');
            o.push ('</td>');
          	
          	// Text Column
          	o.push ('<td style="' + ( bw ? 'border:1px solid #c0c0c0' : '' ) + ';text-align:center; font-family: Arial; width: 110px; padding:5px; font-size: 10px;' + 
                   ( bw ? 'background-color: white; color:black;' : ('background-color: ' + Rows[i].Colors.Dark + '; color:white;')) + '">'
            );
            o.push ( Rows[i].Text );
            o.push ('</td>');
          
          	// Score Column
            o.push ('<td style="text-align:center; font-family: Arial; width: 60px; padding:10px; background-color: ' + Rows[i].Colors.Light + '; color:white; font-size: 36px; font-weight: bold">');
            o.push ( Rows[i].Score );
            o.push ('</td>');
          
            o.push ('</tr>');
        }
      	o.push ('</table>');
      
      	var x : String = o.join('\n');
    	return x;
    }
  
  	//Calculates positive and negative thumb counts for this widget
  	private function CalculateCounts(){
  		//Get questions
      	var qs = qm.GetCoreQuestions();
      
      	//Count positive and negative questions
      	for(var i = 0; i<qs.length; i++){
      		if(qs[i].internalComps[5].GetStatSigCode() == SigTest.Codes.Positive || 
               qs[i].internalComps[5].GetStatSigCode() == SigTest.Codes.PositiveNoBackgroundColor)
              	positiveCount++;
          	else if(qs[i].internalComps[5].GetStatSigCode() == SigTest.Codes.Negative || 
                    qs[i].internalComps[5].GetStatSigCode() == SigTest.Codes.NegativeNoBackgroundColor)
              	negativeCount++;
        }
    }
  
  	//Outputs all data into the pagecontext for the slide to use
  	public static function AddDataForSlideToPageContext(user : User, report : Report, state : ReportState, pageContext : ScriptPageContext){
  		//Get results out
    	var qm = QueryManager.GetQueryManagerMain(report, state, user, true);
      
      	//Get questions
      	var qs = qm.GetCoreQuestions();
      
      	//Count positive and negative questions
      	var positiveCount = 0;
      	var negativeCount = 0;
      	for(var i = 0; i<qs.length; i++){
      		if(qs[i].internalComps[5].GetStatSigCode() == SigTest.Codes.Positive || 
               qs[i].internalComps[5].GetStatSigCode() == SigTest.Codes.PositiveNoBackgroundColor)
              	positiveCount++;
          	else if(qs[i].internalComps[5].GetStatSigCode() == SigTest.Codes.Negative || 
                    qs[i].internalComps[5].GetStatSigCode() == SigTest.Codes.NegativeNoBackgroundColor)
              	negativeCount++;
        }
      
      	//Add positive and negative counts to page context
      	pageContext.Items['positiveCount'] = positiveCount;
      	pageContext.Items['negativeCount'] = negativeCount;
    }
}
//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------
//Trend widget
class WidgetNorm extends DashboardWidget{
  	private var m_report : Report = null;
  	private var m_state  : ReportState = null;
  	private var m_user : User = null;
  	private var positiveCount = 0;
  	private var negativeCount = 0;
  
  	//Constructor
  	//Params: report object, state object, handle to query manager, id of the widget for current user
  	public function WidgetNorm(report : Report, state : ReportState, qMan : QueryManager, id : int, widgetsTexts, labelsTexts, user : User, widgetIdx){
      	super(id, widgetsTexts, labelsTexts, widgetIdx);
      	qm = qMan;
      	m_report = report;
      	m_state = state;
      	m_user = user;
      	SetTitle(widgetsT['EXTERNAL_COMP']);
    }
  	
  	//Return HTML body of the widget (main portion of it)
    public function GetBody(){
      	var o = [];
        var bw = ExecutionMode.isPdfBlackWhite(m_state);
      	CalculateCounts();
      
      	//Prepare the heading
      	var normName = ResourceText.Text(m_report, 'benchmarkset', NormUtil.GetNormId(m_user, Config.Widgets.ExternalComparisonNormNumber), 'ds0');
      	var heading = widgetsT['ComparedtoNorm'].split('[NORM]').join(normName);
        
      	//Add heading
      	o.push ('<div  style="text-align:left; height:35px; margin-bottom:4px; color: #17B0B6; font-family: arial; font-size: 11px;">' + heading + 
                '</div><table border=0 style="border-collapse:collapse;">');
		
      	o.push ('<tr>');
        
      	//Prepare 2 rows
      	var Positive = {
            Colors: {Light: '#2284C6', Dark: '#0071BB'},
            Text: widgetsT['NumberAbove'],
            ImageUrl: Config.FileFolder + 'Thumb-Up.png',
            Score: positiveCount
        };

        var Negative = {
            Colors: {Light: '#F68A47', Dark: '#F36F23'},
            Text: widgetsT['NumberBelow'],
            ImageUrl: Config.FileFolder + 'Thumb-Down.png',
            Score: negativeCount
        };

        var Rows = [Positive, Negative];
      	
      	//Generate 2 rows
      	for (var i=0; i<Rows.length; ++i) {

            o.push ('<tr>');
            // Image Column
            o.push ('<td style="' + ( bw ? 'border:1px solid #c0c0c0' : '' ) + ';padding:5px; text-align:center; width:60px; height:30px; background-color: ' + 
              		(bw ? '#f0f0f0' : Rows[i].Colors.Light) + '">');
            o.push ('<img style="width:55px" src="' + Rows[i].ImageUrl + '">');
            o.push ('</td>');
          	
          	// Text Column
          	o.push ('<td style="' + ( bw ? 'border:1px solid #c0c0c0' : '' ) + ';text-align:center; font-family: Arial; width: 110px; padding:5px; font-size: 10px;' + 
                   ( bw ? 'background-color: white; color:black;' : ('background-color: ' + Rows[i].Colors.Dark + '; color:white;')) + '">'
            );
            o.push ( Rows[i].Text );
            o.push ('</td>');
          
          	// Score Column
            o.push ('<td style="text-align:center; font-family: Arial; width: 60px; padding:10px; background-color: ' + Rows[i].Colors.Light + '; color:white; font-size: 36px; font-weight: bold">');
            o.push ( Rows[i].Score );
            o.push ('</td>');
          
            o.push ('</tr>');
        }
      	o.push ('</table>');
      
      	var x : String = o.join('\n');
    	return x;
    }
  
  	//Calculates positive and negative thumb counts for this widget
  	private function CalculateCounts(){
  		//Get questions
      	var qs = qm.GetCoreQuestions();
      
      	//Count positive and negative questions
      	for(var i = 0; i<qs.length; i++){
      		if(qs[i].norms[Config.Widgets.ExternalComparisonNormNumber].GetStatSigCode() == SigTest.Codes.Positive || 
               qs[i].norms[Config.Widgets.ExternalComparisonNormNumber].GetStatSigCode() == SigTest.Codes.PositiveNoBackgroundColor)
              	positiveCount++;
          	else if(qs[i].norms[Config.Widgets.ExternalComparisonNormNumber].GetStatSigCode() == SigTest.Codes.Negative || 
                    qs[i].norms[Config.Widgets.ExternalComparisonNormNumber].GetStatSigCode() == SigTest.Codes.NegativeNoBackgroundColor)
              	negativeCount++;
        }
    }
  
  	//Outputs all data into the pagecontext for the slide to use
  	public static function AddDataForSlideToPageContext(user, report, state, pageContext : ScriptPageContext){
  		//Get results out
    	var qm = QueryManager.GetQueryManagerMain(report, state, user, true);
      
      	//Get questions
      	var qs = qm.GetCoreQuestions();
      
      	//Count positive and negative questions
      	var positiveCount = 0;
      	var negativeCount = 0;
      	for(var i = 0; i<qs.length; i++){
      		if(qs[i].norms[Config.Widgets.ExternalComparisonNormNumber].GetStatSigCode() == SigTest.Codes.Positive || 
               qs[i].norms[Config.Widgets.ExternalComparisonNormNumber].GetStatSigCode() == SigTest.Codes.PositiveNoBackgroundColor)
              	positiveCount++;
          	else if(qs[i].norms[Config.Widgets.ExternalComparisonNormNumber].GetStatSigCode() == SigTest.Codes.Negative || 
                    qs[i].norms[Config.Widgets.ExternalComparisonNormNumber].GetStatSigCode() == SigTest.Codes.NegativeNoBackgroundColor)
              	negativeCount++;
        }
      
      	//Add positive and negative counts to page context
      	pageContext.Items['positiveCount'] = positiveCount;
      	pageContext.Items['negativeCount'] = negativeCount;
    }
}
//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------
//KDA widget
class WidgetKDA extends DashboardWidget{
  	private var m_report : Report = null;
  	private var m_state  : ReportState = null;
  	private var m_user : User = null;
  
  	//Constructor
  	//Params: report object, state object, handle to query manager, id of the widget for current user
  	public function WidgetKDA(report : Report, state : ReportState, qMan : QueryManager, id : int, widgetsTexts, labelsTexts, user : User, widgetIdx){
      	super(id, widgetsTexts, labelsTexts, widgetIdx);
      	qm = qMan;
      	m_report = report;
      	m_state = state;
      	m_user = user;
      	SetTitle(widgetsT['KEY_DRIVERS']);
    }
  	
  	//Return HTML body of the widget (main portion of it)
    public function GetBody(){
      	//Get KDAs
      	var kdas = KDA.GetItemsByNodeId(m_user.PersonalizedReportBase, m_state);
     
      	//Get questions from qm
      	var qs = qm.GetCoreQuestions();
      
      	//Translate those into a associative array
      	var qsA = {};
      	for(var i = 0; i<qs.length; i++){
      		qsA[qs[i].GetId()] = qs[i];
        }
      	
      	//Create two arrays - eng and ena, with HgQuestion objects
      	var eng = [];
      	var ena = [];
      	for(var i = 0; i<kdas.length; i++){
          	if(kdas[i].Type == 1){
          		eng.push(qsA[kdas[i].QuestionId]);
            }
          	else{
          		ena.push(qsA[kdas[i].QuestionId]);
            }
        }
      
      	//Legacy code generating HTML
      	var o=[];
        var bw = ExecutionMode.isPdfBlackWhite(m_state);
		o.push ('<style>');
		o.push ('#widgetee .eeheading {padding-top:6px; padding-bottom:2px; text-align: left; margin-bottom: 2px; color: #17B0B6; font-family: arial; font-size: 12px; text-transform: uppercase;}');
		o.push ('#widgetee .eecol1 {padding: 0px; margin:0px; text-align:center; width:40px; height: 38px; font-family:arial; font-size:30px; color:white; font-weight: bold}');
		o.push ('#widgetee .eecol2 {text-align:left; padding:0px; padding-left:12px; padding-top:3px; padding-right:3px; color:white; width:210px; font-family:arial; font-size: 10px; font-weight: normal}');
		o.push ('</style>');
		
		var EngagementDrivers = {
			Heading: widgetsT['EngagementDrivers'],
			Colors: {Light: '#2284C6', Dark: '#0071BB'},
			Data: eng
		}
		
		var EnablementDrivers = {
			Heading: widgetsT['EnablementDrivers'],
			Colors: {Light: '#34BFEF', Dark: '#00B2EB'},
			Data: ena
		}
		
		var dimensions = [EngagementDrivers, EnablementDrivers];

		o.push ('<div id=widgetee style="padding-top:0px">');
		o.push ('<table style="border-collapse:collapse">');

		for (var i=0; i<dimensions.length; ++i) {

			o.push ('<tr>');
			o.push ('<td colspan=3 class=eeheading>' + dimensions[i].Heading + '</td>');
			o.push ('</tr>');

			var data = dimensions[i].Data;
			
			for (var j=0; j<data.length && j<2; ++j) {
				o.push ('<tr>');
				o.push ('<td class=eecol1 style="background-color: ' + dimensions[i].Colors.Light + '">' + (j+1) + '</td>');
              
				o.push (
                  bw ? '<td class=eecol2 style="background-color:white; color:black; border:1px solid #c0c0c0">' : 
                  '<td class=eecol2 style="background-color: ' + dimensions[i].Colors.Dark + '">');
				o.push ( data[j].text );
				o.push ('</td></tr>');
			}
		}

		o.push ('</table></div>');
      
      	var x : String = o.join('\n');
    	return x;
    }
  
  	//Outputs all data into the pagecontext for the slide to use
  	public static function AddDataForSlideToPageContext(user, report, state, pageContext : ScriptPageContext){
    	//Get results out
    	var qm = QueryManager.GetQueryManagerMain(report, state, user, true);
      	
      	//Get KDAs
      	var kdas = KDA.GetItemsByNodeId(user.PersonalizedReportBase, state);
     
      	//Get questions from qm
      	var qs = qm.GetCoreQuestions();
      
      	//Translate those into a associative array
      	var qsA = {};
      	for(var i = 0; i<qs.length; i++){
      		qsA[qs[i].GetId()] = qs[i];
        }
      	
      	//Create two arrays - eng and ena, with HgQuestion objects
      	var eng = [];
      	var ena = [];
      	for(var i = 0; i<kdas.length; i++){
          	if(kdas[i].Type == 1){
          		eng.push(qsA[kdas[i].QuestionId]);
            }
          	else{
          		ena.push(qsA[kdas[i].QuestionId]);
            }
        }
      	
      	//Add data to pageContext
      	for(var i = 0; i<eng.length; i++)
          pageContext.Items['eng'+(i+1)] = eng[i];
      	
      	for(var i = 0; i<ena.length; i++)
          pageContext.Items['ena'+(i+1)] = ena[i];
    }
}
//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------
//Top themes widget
class WidgetCommentThemes extends DashboardWidget{
  	private var m_report : Report = null;
  	private var m_state  : ReportState = null;
  	private var m_user : User = null;
  	private var m_confirmit : ConfirmitFacade = null;
  	private static var qid = Config.Widgets.TopThemes.VariableId;
  
  	//Constructor
  	//Params: report object, state object, handle to query manager, id of the widget for current user
  	public function WidgetCommentThemes(report : Report, state : ReportState, qMan : QueryManager, id : int, widgetsTexts, 
                                        labelsTexts, widgetIdx, confirmit : ConfirmitFacade, user : User){
      	super(id, widgetsTexts, labelsTexts, widgetIdx);
      	qm = qMan;
      	m_report = report;
      	m_state = state;
      	m_confirmit = confirmit;
      	m_user = user;
      
      	//Create and set the title
      	var dynamic_text = '<abbr title="' + HelperUtil.TextSubstitution (ResourceText.Text(report, qid, null, 'ds0')) + '">' + 
          					LookupTable.GetQuestionNumberByQuestionId(qid) + '</abbr>';
		var label = widgetsT['TOP_THEMES'].split('[QUESTION]').join (dynamic_text);  
      	SetTitle(label);
    }
  	
  	//Return HTML body of the widget (main portion of it)
    public function GetBody(){
		//Get themes
      	var themeTitles = m_report.TableUtils.GetRowHeaderCategoryTitles('THEMES');
      
      	//Generate HTML
      	var o = [];
		
      	//Styling
      	o.push('<style>'); 
   		o.push('#widgetcomments {width: 250px; height: 200px; position:absolute}'); 
   		o.push('.bubbles {margin:0px; padding:0px; padding-top:0px; position:absolute; background-position:0px -38px; background-size: 150px 150px; font-family:arial; text-align:center; width: 150px; height: 72px; color:white; background-repeat:no-repeat; display:block}');
        o.push('.container {width:150px; height:60px; position:relative; top:10px}');
   		o.push('#largeBubble {width:250px; height:200px; border-radius:12px; background-color:#dddfed; position:relative; display:none}');
        o.push('#largeBubble_index {position:relative; height:180px; width:20px; font-family:arial; color:white; font-size:20px; left:5px; top:10px; float:left}');
        o.push('#largeBubble_text {position:relative; height:200px; width:180px; top:10px; left:10px; margin-left:26px; font-family:arial; color:white; font-size:12px}');
        o.push('.comm_index {width:25%; height:40px; font-family:arial; color:white; font-size:20px; position:absolute; left:5%; top:15%}');
        o.push('.comm_text_long {position:absolute; top:11%; left:3%; margin-left:18%; height:45px; width:100px; font-family:arial; color:white; font-size:12px}');   	      		
      	o.push('.comm_text_middle {position:absolute; top:15%; left:3%; margin-left:18%; height:45px; width:100px; font-family:arial; color:white; font-size:12px}');
      	o.push('.comm_text_short {position:absolute; top:25%; left:7%; margin-left:15%; height:40px; width:100px; font-family:arial; color:white; font-size:12px}');
      	o.push('</style>');	
      
      	var suppress = WidgetCommentThemes.PrivacyViolation(m_report, m_user, m_confirmit);
      
		var Bubble1 = {
			Index: 1, 
			Top: '0px',
			Left: '0px',
			ImageUrl: Config.FileFolder +  'speech-blue_150x150.png',          	
			Color:'#4aabe5',
          	Text: suppress ? '-' : themeTitles[0]          	
		}

		var Bubble2 = {
			Index: 2, 
			Top: '60px',
			Left: '110px',
			ImageUrl: Config.FileFolder +  'speech-purple_150x150.png',
			Color:'#bb2f88',
			Text: suppress ? '-' : themeTitles[1]
		}

		var Bubble3 = {
			Index: 3, 
			Top: '130px',
			Left: '0px',
			ImageUrl: Config.FileFolder + 'speech-orange_150x150.png',
			Color:'#d16715',
			Text: suppress ? '-' : themeTitles[2]
		}


		var Rows = [Bubble1, Bubble2, Bubble3];
		o.push('<div id="widgetcomments" style="">');
      	o.push('<div id="largeBubble" onmouseleave="OutFunction(this)"><div id="largeBubble_index"></div><div id="largeBubble_text"></div></div>');

		for (var i=0; i<Rows.length; ++i) {
          o.push('<div class="bubbles" onmouseenter="OverFunction(this)" style="top:' + Rows[i].Top + '; left: ' + Rows[i].Left + '; background-image: url(' + Rows[i].ImageUrl + ')">');
          o.push('<div class="container" style=""><div class="comm_index">'+Rows[i].Index+'</div><div class="comm_text">' +Rows[i].Text+ '</div></div>');
          o.push('</div>');                          				
		}    
      	o.push('</div>');
      	o.push('<script>');  
      	  o.push('$(document).ready(TextCheck);');
      
      	  o.push ('function TextCheck(jQuery) {');
      			o.push('$(".comm_text").each(function(index) {');
      				o.push('if (($(this).text().length)>31) {');
      					o.push('$(this).removeClass("comm_text").addClass("comm_text_long");');
      					o.push('var result_text=$(this).text().substr(0,29)+"...";');
      					o.push('$(this).text(result_text);');
      				o.push('} else if (($(this).text().length)>20 && ($(this).text().length)<=31) {');
      					o.push('$(this).removeClass("comm_text").addClass("comm_text_middle");');
      				o.push('} else {');
      					o.push('$(this).removeClass("comm_text").addClass("comm_text_short");');
      				o.push('}');
      			o.push('});');
      	  o.push('};');
      
          o.push('function OverFunction(object) {');
      		//in variable curIdx is current index of the shorter comment (class bubbles, possible values 0..2) - it depends where is mouse over
          		o.push('var ClassList=$(".bubbles");');
          		o.push('var curIdx=ClassList.index($(object));');            			
      
          	//getting text and index of the current shorter comment          
          		//o.push('var text=document.getElementsByClassName("comm_text")[curIdx].innerHTML;');
          		o.push('var index=document.getElementsByClassName("comm_index")[curIdx].innerHTML;');
          		            	
      		//different color for whole comment (id largeBubble) according to current shorter comment
          		o.push('if (curIdx==0) {');
      				o.push('var text="'+Rows[0].Text+'";');
          			o.push('document.getElementById("largeBubble").style.backgroundColor="#4aabe5";');
         		o.push('}');
          		o.push('if (curIdx==1) {');
      				o.push('var text="'+Rows[1].Text+'";');
          			o.push('document.getElementById("largeBubble").style.backgroundColor="#bb2f88";');
          		o.push('}');
          		o.push('if (curIdx==2) {');
      				o.push('var text="'+Rows[2].Text+'";');
          			o.push('document.getElementById("largeBubble").style.backgroundColor="#d16715";');
          		o.push('}');
                     
           //fade out and fade in effect for displaying whole comment - firstly fade out for 0,5 s for shorter comment then fade in for 0,3 s for whole comment
      		o.push('$(".bubbles").fadeOut(200, function() {');      
      			o.push('$("#largeBubble").fadeIn(100);');      					
      		o.push('});');      
      
           //inserting text and index to the whole comment - text and index is different according to current shorter comment
      			o.push('document.getElementById("largeBubble_text").innerHTML=text;');
                o.push('document.getElementById("largeBubble_index").innerHTML=index;'); 
            			
          o.push('}');
          
          o.push('function OutFunction(object) {');             		
      			
      		//fade out and fade in effect for hiding whole comment and showing only shorter version - firsly fade out for 0,2 s for whole comment then fade in for 0,1 s for shorter comment
      			o.push('$("#largeBubble").fadeOut(200, function() {');      
      					o.push('$(".bubbles").fadeIn(100);');
      			o.push('});');      
      		o.push('}');                  
      	o.push('</script>');  
      
      	var x : String = o.join('\n');
    	return x;
    }
  
  	//Function that generates the THEMES table on the Dashboard
  	public static function GenerateTable(report, table){
      	table.Caching.Enabled = Config.Caching.Enabled;
  		var theme_qid = qid + 'Theme';
        var project = report.DataSource.GetProject('ds0');
        var question : Question = project.GetQuestion ( theme_qid );
        
        var properties = [];
        
        properties.push ('totals:false');
        if (question.QuestionType == QuestionType.Multi)
          properties.push ('collapsed:true');

      	table.AddHeaders (report, 'ds0', theme_qid + '{' + properties.join(';') + '} ^ [N]{hideheader:true}/[SEGMENT]{label:" "} + [CHART]{id:barchart; Label:" "} + [CONTENT]{label:" "}' );
		
		// TABLE SORTING
		table.Sorting.Rows.Enabled = true;
		table.Sorting.Rows.Position = 1;
		table.Sorting.Rows.Direction = TableSortDirection.Descending;
      
      	// EXCLUDE LAST OPTION FROM SORTING ("OTHER") IF CONFIG SETTING IS SET TO TRUE
	    table.Sorting.Rows.FixedFromEnd = (Config.Widgets.TopThemes.ExcludeLastTheme == true) ? 1 : 0;
    }
  
  	//Generates table for valid N for this widget
  	public static function GenerateNTable(table, report){
  		var y;
        var x = '[N]';
    
        var filter = 'NOT (' + qid + '="") AND NOT(ISNULL(' + qid + '))';
        y = '[SEGMENT]{expression:' + report.TableUtils.EncodeJsString ( filter ) + '}';
    
        var expr = [y, x].join('^');
        
        table.AddHeaders(report, 'ds0', expr);
    }
  
  	//Create minimum N filter - minimum N for the widget is applied by suppressing scores for the table in case min N is broken
  	//It's done that way because the same THEMES table (from dashboard) is used in 3 different places throught the report
  	public static function PrivacyViolation(report, user, confirmit){
  		var suppress = false;
      
      	var allQIds = Config.GetCommentQuestionIdsByNodeId(user.PersonalizedReportBase , confirmit);
      	var found = false;
      	for(var i=0; i<allQIds.length; i++){
          	if(qid == allQIds[i]){
              found = true;
              break;
          	}
      	}	
      	suppress = !found;
      
      	if(report.TableUtils.GetCellValue('dashboard:COMMENT_N', 1, 1).Value < Config.Privacy.Verbatim.MinN)
        	suppress = true;
      
      	return suppress;
    }
  
  	//Return HTML body of the widget (main portion of it)
    public function GetBodySummary(){
		//Get themes
      	var themeTitles = m_report.TableUtils.GetRowHeaderCategoryTitles('dashboard:THEMES');
      
      	//Generate HTML
      	var o = [];
		
      	//Styling
      	o.push('<style>'); 
   		o.push('#widgetcomments {width: 250px; height: 200px; position:absolute}'); 
   		o.push('.bubbles {margin:0px; padding:0px; padding-top:0px; position:absolute; background-position:0px -38px; background-size: 150px 150px; font-family:arial; text-align:center; width: 150px; height: 72px; color:white; background-repeat:no-repeat; display:block}');
        o.push('.container {width:150px; height:60px; position:relative; top:10px}');
   		o.push('#largeBubble {width:250px; height:200px; border-radius:12px; background-color:#dddfed; position:relative; display:none}');
        o.push('#largeBubble_index {position:relative; height:180px; width:20px; font-family:arial; color:white; font-size:20px; left:5px; top:10px; float:left}');
        o.push('#largeBubble_text {position:relative; height:200px; width:180px; top:10px; left:10px; margin-left:26px; font-family:arial; color:white; font-size:12px}');
        o.push('.comm_index {width:25%; height:40px; font-family:arial; color:white; font-size:20px; position:absolute; left:5%; top:15%}');
        o.push('.comm_text_long {position:absolute; top:11%; left:3%; margin-left:18%; height:45px; width:100px; font-family:arial; color:white; font-size:12px}');   	      		
      	o.push('.comm_text_middle {position:absolute; top:15%; left:3%; margin-left:18%; height:45px; width:100px; font-family:arial; color:white; font-size:12px}');
      	o.push('.comm_text_short {position:absolute; top:25%; left:7%; margin-left:15%; height:40px; width:100px; font-family:arial; color:white; font-size:12px}');
      	o.push('</style>');	
      
      	var suppress = WidgetCommentThemes.PrivacyViolation(m_report, m_user, m_confirmit);
      
		var Bubble1 = {
			Index: 1, 
			Top: '0px',
			Left: '0px',
			ImageUrl: Config.FileFolder +  'speech-blue_150x150.png',          	
			Color:'#4aabe5',
          	Text: suppress ? '-' : themeTitles[0]          	
		}

		var Bubble2 = {
			Index: 2, 
			Top: '60px',
			Left: '110px',
			ImageUrl: Config.FileFolder +  'speech-purple_150x150.png',
			Color:'#bb2f88',
			Text: suppress ? '-' : themeTitles[1]
		}

		var Bubble3 = {
			Index: 3, 
			Top: '130px',
			Left: '0px',
			ImageUrl: Config.FileFolder + 'speech-orange_150x150.png',
			Color:'#d16715',
			Text: suppress ? '-' : themeTitles[2]
		}


		var Rows = [Bubble1, Bubble2, Bubble3];
		o.push('<div id="widgetcomments" style="">');
      	o.push('<div id="largeBubble" onmouseleave="OutFunction(this)"><div id="largeBubble_index"></div><div id="largeBubble_text"></div></div>');

		for (var i=0; i<Rows.length; ++i) {
          o.push('<div class="bubbles" onmouseenter="OverFunction(this)" style="top:' + Rows[i].Top + '; left: ' + Rows[i].Left + '; background-image: url(' + Rows[i].ImageUrl + ')">');
          o.push('<div class="container" style=""><div class="comm_index">'+Rows[i].Index+'</div><div class="comm_text">' +Rows[i].Text+ '</div></div>');
          o.push('</div>');                          				
		}    
      	o.push('</div>');
      	o.push('<script>');   
      	  o.push('$(document).ready(TextCheck);');
      
      	  o.push ('function TextCheck(jQuery) {');
      			o.push('$(".comm_text").each(function(index) {');
      				o.push('if (($(this).text().length)>31) {');
      					o.push('$(this).removeClass("comm_text").addClass("comm_text_long");');
      					o.push('var result_text=$(this).text().substr(0,29)+"...";');
      					o.push('$(this).text(result_text);');
      				o.push('} else if (($(this).text().length)>20 && ($(this).text().length)<=31) {');
      					o.push('$(this).removeClass("comm_text").addClass("comm_text_middle");');
      				o.push('} else {');
      					o.push('$(this).removeClass("comm_text").addClass("comm_text_short");');
      				o.push('}');
      			o.push('});');
      	  o.push('};');	
      
          o.push('function OverFunction(object) {');
          		
      		//in variable curIdx is current index of the shorter comment (class bubbles, possible values 0..2) - it depends where is mouse over
          		o.push('var ClassList=$(".bubbles");');
          		o.push('var curIdx=ClassList.index($(object));');            			
      
          	//getting text and index of the current shorter comment          
          		//o.push('var text=document.getElementsByClassName("comm_text")[curIdx].innerHTML;');
          		o.push('var index=document.getElementsByClassName("comm_index")[curIdx].innerHTML;');
          		            	
      		//different color for whole comment (id largeBubble) according to current shorter comment
          		o.push('if (curIdx==0) {');
      				o.push('var text="'+Rows[0].Text+'";');
          			o.push('document.getElementById("largeBubble").style.backgroundColor="#4aabe5";');
         		o.push('}');
          		o.push('if (curIdx==1) {');
      				o.push('var text="'+Rows[1].Text+'";');
          			o.push('document.getElementById("largeBubble").style.backgroundColor="#bb2f88";');
          		o.push('}');
          		o.push('if (curIdx==2) {');
      				o.push('var text="'+Rows[2].Text+'";');
          			o.push('document.getElementById("largeBubble").style.backgroundColor="#d16715";');
          		o.push('}');
                     
           //fade out and fade in effect for displaying whole comment - firstly fade out for 0,5 s for shorter comment then fade in for 0,3 s for whole comment
      		o.push('$(".bubbles").fadeOut(200, function() {');      
      			o.push('$("#largeBubble").fadeIn(100);');      					
      		o.push('});');      
      
           //inserting text and index to the whole comment - text and index is different according to current shorter comment
      			o.push('document.getElementById("largeBubble_text").innerHTML=text;');
                o.push('document.getElementById("largeBubble_index").innerHTML=index;'); 
            			
          o.push('}');
          
          o.push('function OutFunction(object) {');             		
      			
      		//fade out and fade in effect for hiding whole comment and showing only shorter version - firsly fade out for 0,2 s for whole comment then fade in for 0,1 s for shorter comment
      			o.push('$("#largeBubble").fadeOut(200, function() {');      
      					o.push('$(".bubbles").fadeIn(100);');
      			o.push('});');      
      		o.push('}');                  
      	o.push('</script>');  
      
      	var x : String = o.join('\n');
    	return x;
    }
  	
  	//Adds all necessary data to pageContext for the slide to use
  	public static function AddDataForSlideToPageContext(report, pageContext : ScriptPageContext, confirmit, user){
  		//Get themes
      	var themeTitles = report.TableUtils.GetRowHeaderCategoryTitles('dashboard:THEMES');
      
      	var suppress = WidgetCommentThemes.PrivacyViolation(report, user, confirmit);
      
      	//Adda data to pageContext
      	pageContext.Items['theme1'] = suppress ? '-' : themeTitles[0];
      	pageContext.Items['theme2'] = suppress ? '-' : themeTitles[1];
      	pageContext.Items['theme3'] = suppress ? '-' : themeTitles[2];
    }
  	
}
//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------
//ENPS widget
class WidgetENPS extends DashboardWidget{
  	private var m_report : Report = null;
  	private var m_state  : ReportState = null;
  
  	//Constructor
  	//Params: report object, state object, handle to query manager, id of the widget for current user
  	public function WidgetENPS(report : Report, state : ReportState, qMan : QueryManager, id : int, widgetsTexts, labelsTexts, widgetIdx){
      	super(id, widgetsTexts, labelsTexts, widgetIdx);
      	qm = qMan;
      	m_report = report;
      	m_state = state;
      	SetTitle(widgetsT['ENPS']);
    }
  	
  	//Return HTML body of the widget (main portion of it)
    public function GetBody(){
      	var question = qm.GetOneQuestion(Config.ENPS.VariableId);
      	var scores = question.GetScores();
      	
      	var o = [];
      	o.push ('<style>');
		o.push ('#npschart {margin-top: 15px}');
		o.push ('#npschart .mathtext{color:#646466; height:30px; text-align:center; width:30px; font-family:arial; font-size:40px; font-weight:bold}');
		o.push ('#npschart .main  {width:250px; height:130px;  background-image: url(https://survey.confirmit.com/isa/BDJPFRDMEYBPBKLVADAYFQCDAVIOEQJR/HayGroup/NPS_Model_Widget_2.png); background-repeat:no-repeat; }'); 
		o.push ('#npschart td {padding:0px}');
		o.push ('#npschart .subtext {text-align: center; font-family:arial; font-size:10px; text-transform: uppercase; color: #999}');
		o.push ('#npschart table {margin:0px; padding:0px; border-collapse: collapse;}');
		o.push ('#npschart .figure {width:65px; font-family:arial; font-size:14px; font-weight: bold; padding-bottom:4px; color:white; text-align:center; height:100px;}');
		o.push ('#npschart .symbol {width:25px;}');
		o.push ('</style>');
	  
		o.push ('<div id=npschart><div class=main><table style="">')		
		// Data Row
		o.push ('<tr><td class=figure>' + scores.fav + '%</td><td class=symbol></td>');
		o.push ('<td class=figure>' + scores.unfav + '%</td><td class=symbol></td>');
      
      	var enpsScore = question.IsSuppressed() ? '-' : (scores.fav - scores.unfav);
		o.push ('<td class=figure>' + enpsScore + '</td></tr>');
      
		// Subtext Row
		o.push ('');

		o.push ('<tr><td class=subtext style="color: #8DC641">' + labelsT['Promoters'] + '</td><td></td>');
		o.push ('<td class=subtext style="color: #F47820">' + labelsT['Detractors'] + '</td><td></td>');
		o.push ('<td class=subtext style="color: #BD3C96">' + labelsT['ENPS'] + '</td></tr>');
      
		o.push ('</table></div></div>');
      
      	var x : String = o.join('\n');
    	return x;
    }
  	
  	//Adds data to pageContext for the slide to use
  	public static function AddDataForSlideToPageContext(user, report, state, pageContext : ScriptPageContext){
    	//Get results out
    	var qm = QueryManager.GetQueryManagerMain(report, state, user, true);
      	
      	//Get the question
      	var question = qm.GetOneQuestion(Config.ENPS.VariableId);
      
      	//Add the question to pageContext
      	pageContext.Items['enps'] = question;
    }
}
//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------
//EEF widget
class WidgetEEF2 extends DashboardWidget{
  	private var m_report : Report = null;
  	private var m_state  : ReportState = null;
  
  	//Constructor
  	//Params: report object, state object, handle to query manager, id of the widget for current user
  	public function WidgetEEF2(report : Report, state : ReportState, id : int, widgetsTexts, labelsTexts, widgetIdx){
      	super(id, widgetsTexts, labelsTexts, widgetIdx);
      	m_report = report;
      	m_state = state;
      	SetTitle(widgetsT['EFF_PROFILE']);
    }
  	
  	//Return HTML body of the widget (main portion of it)
    public function GetBody(){
      	//Get data
      	var d = {};
		var data = m_report.TableUtils.GetRowValues('PFAULF:EEF', 1);
      	var labels = m_report.TableUtils.GetColumnHeaderCategoryTitles('PFAULF:EEF');
      	//Calculate N
        var N=0;
        for (var i=0; i<data.length; ++i) {
          if (!isNaN(data[i].Value))
              N += data[i].Value;
        }
      	//Calculate percentiles
      	var pct = [];
		if (N>0) {
          for (var i=0; i<data.length; ++i) {
				pct.push ( (data[i].Value/N) );
          }
		} else {
			pct = [null, null, null, null]; 
		}
		
      	d.effective = {Pct: pct[0], Label: labels[0][0]};
        d.frustrated = {Pct: pct[1], Label: labels[1][0]};
        d.detached = {Pct: pct[2], Label: labels[2][0]};
		d.least_effective = {Pct: pct[3], Label: labels[3][0]};
		if (N < Config.Privacy.Table.MinN) {
			d.effective.Score = '-';
			d.frustrated.Score = '-';
			d.detached.Score = '-';
			d.least_effective.Score = '-';
        } else {
			d.effective.Score = (100*d.effective.Pct).toFixed(0) + '%';
			d.frustrated.Score = (100*d.frustrated.Pct).toFixed(0) + '%';
			d.detached.Score = (100*d.detached.Pct).toFixed(0) + '%';
			d.least_effective.Score = (100*d.least_effective.Pct).toFixed(0) + '%';
        }
      	
      	//Generate HTML - TODO: cleanup
      	var n = [];
      	var o = [];
      	var rtEffPro = ResourceText.List(m_report,'effectiveness_profile');
      	
      	// CSS styling
		n.push ('<style>');
		n.push ('#widget_eef .mathsign{font-size:20px; text-weight: bold; color: #17B0B6; font-family: arial}');
		n.push ('#widget_eef td{padding: 0px; margin: 0px; text-align:center; }');
		n.push ('#widget_eef table{table-collapse: collapse}');
		n.push ('.verticaltext {');
		n.push ('position: relative; top:-167px; left:-62px;');
		n.push ('width:200px; height:20px;');
      	n.push ('filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);'); // IE8
		n.push ('-ms-transform:rotate(270deg); /* IE 9 */');
		n.push ('-moz-transform:rotate(270deg); /* Firefox */');
		n.push ('-webkit-transform:rotate(270deg); /* Safari and Chrome */');
		n.push ('-o-transform:rotate(270deg); /* Opera */');
		n.push ('}');
		n.push ('.widgetaxis {text-align:center; vertical-align:middle; font-family:arial; color:#17B0B6; text-transform:uppercase; font-size:11px }');
		n.push ('</style>');
      
      	o.push ('<table border=0 style="border-collapse: collapse"><tr>');
        o.push ('<td style="padding:0px">' + '<div class="eef eef_detached"><div style="height:20px">' + d.detached.Label + '</div><span class=eef_score>' + d.detached.Score + '</span></div></td>')
		o.push ('<td style="padding:0px">' + '<div class="eef eef_effective"><div style="height:20px">' + d.effective.Label + '</div><span class=eef_score>' + d.effective.Score + '</span></div></td>')
		o.push ('</tr><tr>');
		o.push ('<td style="padding:0px">' + '<div class="eef eef_leasteffective"><div style="height:20px">' + d.least_effective.Label + '</div><span class=eef_score>' + d.least_effective.Score + '</span></div></td>')
		o.push ('<td style="padding:0px">' + '<div class="eef eef_frustrated"><div style="height:20px">' + d.frustrated.Label + '</div><span class=eef_score>' + d.frustrated.Score + '</span></div></td>')
		o.push ('</tr></table>');
    
        // IE8 hack
        n.push ('<!--[if IE 8]>');
        n.push ('<style type="text/css">.verticaltext {top:-240px; left:23px}</style>');
        n.push ('<![endif]-->');      

		// MAIN WIDGET

		n.push ('<div id=widget_eef style="position: relative; top:-10px">');
		n.push ('<table border=0>');
		n.push ('<tr>');
		n.push ('<td rowspan=2 style="text-align:center; width:20px;">');
		n.push ('<table border=0 style="width:20px; height:240px"><tr><td class=mathsign style="vertical-align:top; padding-top:14px;">+</td></tr><tr><td class=mathsign style="vertical-align: bottom; padding-bottom: 70px">-</td></tr></table>');
		n.push ('</td>');
		n.push ('<td>');

		n.push ('<table style="border-left:2px solid #17B0B6; border-bottom:2px solid #17B0B6">');
		n.push ('<tr>');
		n.push ('<td class="widgetaxis" rowspan=2 ><div style="width:16px"></div></td>');
		n.push ('<td>');

		// QUADRANT    
		n.push ( o.join ('\n') );

		// HORIZONTAL AXIS TITLE
		n.push ('<td>');
		n.push ('</tr>');
		n.push ('<tr>');
		n.push ('<td class=widgetaxis style="height:20px;">');
		n.push (rtEffPro['Engagement']);
		n.push ('</td>');
		n.push ('</tr>');
		n.push ('</table>');

		n.push ('</td>');
		n.push ('</tr>');
		n.push ('<tr>');
		n.push ('<td>');

		// X AXIS - PLUS/MINUS
		n.push ('<table border=0 style="width:220px; position:relative; ' + 
                'top:-' + ( m_state.ReportExecutionMode == ReportExecutionMode.PdfExport ? '4' : '20' ) + 'px;' + 
          		'left:' + ( m_state.ReportExecutionMode == ReportExecutionMode.PdfExport ? '10' : '0' ) + 'px;' + 
                  'width:220px"><tr><td class=mathsign style="padding-left:30px; text-align:left">-</td><td class=mathsign style="text-align: right; padding-right:10px">+</td></tr></table>');
		n.push ('</td>');
		n.push ('</tr>');
		n.push ('</table>');

		// VERTICAL AXIS TITLE
      	n.push ('<div class="widgetaxis verticaltext" style="">'); // IE8 hack
      
    
		n.push (rtEffPro['Enablement']);
		n.push ('</div>');
		n.push ('</div>');
      	
      	var x : String = '<div class=scaling style="text-align:center; margin-top:0px">' + n.join('\n') + '</div>';
    	return x;
    }
  
  	//Outputs all data into the pagecontext for the slide to use
  	public static function AddDataForSlideToPageContext(user, report, pageContext : ScriptPageContext){
      	//Get data
      	var d = {};
		var data = report.TableUtils.GetRowValues('PFAULF:EEF', 1);
      	var labels = report.TableUtils.GetColumnHeaderCategoryTitles('PFAULF:EEF');
      	//Calculate N
        var N=0;
        for (var i=0; i<data.length; ++i) {
          if (!isNaN(data[i].Value))
              N += data[i].Value;
        }
      	//Calculate percentiles
      	var pct = [];
		if (N>0) {
          for (var i=0; i<data.length; ++i) {
				pct.push ( (data[i].Value/N) );
          }
		} else {
			pct = [null, null, null, null]; 
		}
		
      	d.effective = {Pct: pct[0], Label: labels[0][0]};
        d.frustrated = {Pct: pct[1], Label: labels[1][0]};
        d.detached = {Pct: pct[2], Label: labels[2][0]};
		d.least_effective = {Pct: pct[3], Label: labels[3][0]};
		if (N < Config.Privacy.Table.MinN) {
			d.effective.Score = '-';
			d.frustrated.Score = '-';
			d.detached.Score = '-';
			d.least_effective.Score = '-';
        } else {
			d.effective.Score = (100*d.effective.Pct).toFixed(0) + '%';
			d.frustrated.Score = (100*d.frustrated.Pct).toFixed(0) + '%';
			d.detached.Score = (100*d.detached.Pct).toFixed(0) + '%';
			d.least_effective.Score = (100*d.least_effective.Pct).toFixed(0) + '%';
        }
      	
      	pageContext.Items['data'] = d;
    }
}
//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------
//RR widget
class WidgetRR extends DashboardWidget{
  	private var m_report : Report = null;
  	private var m_state  : ReportState = null;
  
  	//Constructor
  	//Params: report object, state object, handle to query manager, id of the widget for current user
  	public function WidgetRR(report : Report, state : ReportState, id : int, widgetsTexts, labelsTexts, widgetIdx){
      	super(id, widgetsTexts, labelsTexts, widgetIdx);
      	m_report = report;
      	m_state = state;
      	SetTitle(widgetsT['RESPONSE_RATE']);
    }
  	
  	//Return HTML body of the widget (main portion of it)
    public function GetBody(){
      	var x : String = '<div id="widget_piechart"></div>';
    	return x;
    }
  
  	//Generates the table used for chart
  	public static function GenerateTable(report, state, table, user, pageContext : ScriptPageContext){
  		table.Caching.Enabled = false;
      	table.ColumnHeaders.Clear();
      	var scores = ResponseRate.SelfScores ( report, user );
    	var rtWidgets = ResourceText.List (report, 'widgets');
    	var expr = '[SEGMENT]{label:' + report.TableUtils.EncodeJsString(rtWidgets['NoResponse'] + ' (' + (scores.SelfNPopulation - scores.SelfN) + ')') + 
          			'}+[SEGMENT]{label:' + report.TableUtils.EncodeJsString( rtWidgets['CompletedRespondents'] + ' (' + scores.SelfN + ')') + 
                      '}^[CONTENT]{percent:true; label:"Pct"}';
    
    	table.AddHeaders (report, 'ds0', expr);
    	var hc : HeaderContent = table.ColumnHeaders[0];
    	
      	//Set the selfScores in the page context for retrieval later on
      	pageContext.Items[PageContextEnum.selfScoreRR] = scores;
        hc.SetCellValue(0, 1-scores.Self/100);  
        hc.SetCellValue(1, scores.Self/100);
    }
  
  	//Additional function used on a RR chart
  	public static function GenerateChart(state, chart){
  		var bw = ExecutionMode.isPdfBlackWhite  ( state );
        if (bw) {
          chart.BackColor = '#FFF'; 
          chart.ChartArea.BackColor = '#FFF';
        }
    }
  
  	//Outputs all data into the pagecontext for the slide to use
  	public static function AddDataForSlideToPageContext(user, report, pageContext : ScriptPageContext){
      	var scores = ResponseRate.Scores(report, user);
    	pageContext.Items['selfScore'] = scores.Self;
      	pageContext.Items['selfScoreN'] = scores.SelfN;
      	pageContext.Items['selfScoreNPopulation'] = scores.SelfNPopulation;
        pageContext.Items['compScore'] = scores.Internal;
      	pageContext.Items['hideChart'] = TableContent.isNotANumber(scores.Self) ? true : false;
      	pageContext.Items['fullRRScores'] = scores;
    }
  
  	//Generates the table for the PPT slide
  	public static function GenerateTableForSlide(report, state, table, user, pageContext : ScriptPageContext){
  		table.Caching.Enabled = false;
      	table.ColumnHeaders.Clear();
      	var scores = pageContext.Items['selfScore'];
      	var selfN = pageContext.Items['selfScoreN'];
      	var selfNPopulation = pageContext.Items['selfScoreNPopulation'];
    	var rtWidgets = ResourceText.List (report, 'widgets');
    	var expr = '[SEGMENT]{label:' + report.TableUtils.EncodeJsString( rtWidgets['NoResponse'] + ' (' + (selfNPopulation - selfN) + ')') + 
          			'}+[SEGMENT]{label:' + report.TableUtils.EncodeJsString( rtWidgets['CompletedRespondents'] + ' (' + selfN + ')') + 
                      '}^[CONTENT]{percent:true; label:"Pct"}';
    
    	table.AddHeaders (report, 'ds0', expr);
    	var hc : HeaderContent = table.ColumnHeaders[0];
    	
      	
        hc.SetCellValue(0, 1-scores/100);  
        hc.SetCellValue(1, scores/100);
    }
}
//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------
//Eng and Ena widget
class WidgetEngEna extends DashboardWidget{
  	private var m_report : Report = null;
  	private var m_state  : ReportState = null;
  
  	//Constructor
  	//Params: report object, state object, handle to query manager, id of the widget for current user
  	public function WidgetEngEna(report : Report, state : ReportState, id : int, widgetsTexts, labelsTexts, widgetIdx){
      	super(id, widgetsTexts, labelsTexts, widgetIdx);
      	m_report = report;
      	m_state = state;
      	SetTitle(widgetsT['EE']);
    }
  	
  	//Return HTML body of the widget (main portion of it)
    public function GetBody(){
      	var x : String = '<div id="widget_ee"></div>';
    	return x;
    }
  
  	//Generates the EE table on Dashboard page
  	public static function GenerateTable(report, user, state, table, qm){
  	  table.Caching.Enabled = Config.Caching.T0Caching;

      var tB = new TableBuilder(user, report, state, qm);
      tB.GenerateEEMainForChart(table);
    }
  
  	//Generates additional things for EE chart on Dashboard
  	public static function GenerateChart(report, state, chart){
  	  chart.Title.Text = ResourceText.Text(report,'widgets','EEChartTitle');
    
      if ( ExecutionMode.isPdfBlackWhite ( state ) ) {
          chart.BackColor = '#FFF';
          chart.ChartArea.BackColor = '#FFF';
          chart.Legend.BackColor = '#FFF';
      }
    }
}
//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------
//Tier1 widget
class WidgetTier1 extends DashboardWidget{
  	private var m_report : Report = null;
  	private var m_state  : ReportState = null;
  
  	//Constructor
  	//Params: report object, state object, handle to query manager, id of the widget for current user
  	public function WidgetTier1(report : Report, state : ReportState, id : int, widgetsTexts, labelsTexts, widgetIdx){
      	super(id, widgetsTexts, labelsTexts, widgetIdx);
      	m_report = report;
      	m_state = state;
      	SetTitle(widgetsT['TIER1']);
    }
  	
  	//Return HTML body of the widget (main portion of it)
    public function GetBody(){
      	var x : String = '<div id="widget_tier1"></div>';
    	return x;
    }
  
  	//Generates the EE table on Dashboard page
  	public static function GenerateTable(report, user, state, table, qm){
      //Clear the table
      table.RowHeaders.Clear();
      table.ColumnHeaders.Clear();
      
      //Set caching
  	  table.Caching.Enabled = Config.Caching.T0Caching;
		
      //Generate table
      var tB = new TableBuilder(user, report, state, qm);
      tB.GenerateTier1ForChart(table);
    }
  
  	//Generates additional things for EE chart on Dashboard
  	public static function GenerateChart(report, state, chart){
  	  chart.Title.Text = ResourceText.Text(report,'widgets','Tier1ChartTitle');
    
      if ( ExecutionMode.isPdfBlackWhite ( state ) ) {
          chart.BackColor = '#FFF';
          chart.ChartArea.BackColor = '#FFF';
          chart.Legend.BackColor = '#FFF';
      }
    }
}
//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------