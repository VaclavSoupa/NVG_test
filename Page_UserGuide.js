class Page_UserGuide{
  	
  	// Change the structure to reflect the pages which should be included into separated steps
  	public static var NavigatorSteps = {
      	Step1: [
        	UGPages.Summary,
          	UGPages.Dashboard,
          	UGPages.EEOverview,
          	UGPages.EEDrivers,
          	UGPages.EProfile,
          	UGPages.QuestionsSummary,
          	UGPages.ENPS,
          	UGPages.Respondents
        ],
      	Step2: [
      		UGPages.ExploreSurveyDimensions,
            UGPages.LocalQuestions,
          	UGPages.ResultsSortingTool,
          	UGPages.InternalBenchmarkTool,
          	UGPages.PlotYourResults,
          	UGPages.DemographicHighlighter,
          	UGPages.NSQ,
          	UGPages.NSQ_COMPARATOR,
            UGPages.NSQ_IBT,
          	UGPages.Comments
      	],
      	Step3: [
        	UGPages.Home,
          	UGPages.CreatePlan,
          	UGPages.ReviewOwnPlans,
          	UGPages.ReviewAllPlans,
          	UGPages.SharedPlans,
          	UGPages.Statistics
        ]
    };
  	
  	// Change the structure to reflect the actual position of pages across the navigator
  	public static var NavigatorStructureMap = {
      	Welcome: {
          	Id: UGPages.Welcome.PageTitle,
          	Pages: null
      	},
        Summary: {
          	Id: UGPages.Summary.PageTitle,
          	Pages: null
        },
      	Dashboard: {
          	Id: UGPages.Dashboard.PageTitle,
          	Pages: null
        },
      	EE: {
          	Id: UGPages.EE.PageTitle,
          	Pages: [
                UGPages.EEOverview.PageTitle,
                UGPages.EEDrivers.PageTitle,
                UGPages.EProfile.PageTitle
            ]
        },
        ExploreResults: {
          	Id: UGPages.ExploreResults.PageTitle,
          	Pages: [
                UGPages.QuestionsSummary.PageTitle,
                UGPages.ExploreSurveyDimensions.PageTitle,
                UGPages.LocalQuestions.PageTitle,
                UGPages.ResultsSortingTool.PageTitle,
                UGPages.InternalBenchmarkTool.PageTitle,
                UGPages.PlotYourResults.PageTitle,
                UGPages.DemographicHighlighter.PageTitle,
                UGPages.NSQ.PageTitle,
                UGPages.NSQ_COMPARATOR.PageTitle,
                UGPages.NSQ_IBT.PageTitle
            ]
        },
        Comments: {
          	Id: UGPages.Comments.PageTitle,
          	Pages: null
        },
        Nps: {
          	Id: UGPages.ENPS.PageTitle,
          	Pages: null
        },
        Action: {
          	Id: UGPages.TakeAction.PageTitle,
          	Pages: [
                UGPages.Home.PageTitle,
                UGPages.CreatePlan.PageTitle,
              	UGPages.ReviewOwnPlans.PageTitle,
              	UGPages.ReviewAllPlans.PageTitle,
                UGPages.SharedPlans.PageTitle,
                UGPages.Statistics.PageTitle
            ]
        },
        Respondents: {
          	Id: UGPages.Respondents.PageTitle,
          	Pages: null
        }
    };
  	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////DO NOT CHANGE FUNCTIONS BELOW/////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	// This function generates all CSS necessary for the formatting of the User Guide page
  	public static function GenerateUserGuideCSS () {
		
		var o = [];

		o.push ('<style>');
      	
      	o.push ('.first_table {border-collapse: collapse}');
      	o.push ('.step {font-weight:bold; color:#FFC949; font-family:arial; font-size:14px; padding:4px; padding-left:12px; padding-bottom: 0px}');
      	o.push ('.step_headers {padding: 0px; background-repeat: no-repeat; height: 64px}');
		o.push ('.step_head_area {color:white; font-family:arial; font-size:16px; width: 294px; padding-right:25px}');
      	o.push ('.highlight {padding-left:30px;}');
        o.push ('.explore {padding-left:80px;}');
		o.push ('.action {padding-left:57px;}');
      	o.push ('.step_descriptions {padding-bottom: 5px; vertical-align: top}');
      	o.push ('.step_des_area {min-height: 70px; padding:12px; width:250px; font-size:12px; font-family:arial; background-color:#666; color:white}');
      	o.push ('.button_cells {padding-bottom: 0px; width: 315px; padding-right: 0px; padding-top: 0px}');
      	o.push ('.buttons_area {background-color: #f0f0f0; min-height: 340px; width: 250px; margin-right: 62px; padding-top: 8px}');
      	o.push ('.second_table {background-color:#f0f0f0; margin-top:30px; border-collapse: collapse; width: 892px}');
      	o.push ('.structure_headers {border-bottom:1px solid #c0c0c0; padding:8px; background-color:#3FA9F5; color:white}');
      	o.push ('.allcols {border-bottom:1px solid #c0c0c0; padding:8px; width:295px;}');
        o.push ('.col0 {font-weight:bold; text-transform: uppercase;}');
        o.push ('.col1 {text-transform: uppercase;}');
        o.push ('.col2 {}');
      	
		o.push ('</style>');
      	
      	// In case that the area with the step descriptions or the area with buttons should be higher than is usual
      	// this script will resize those areas based on the highest element so everything would have the same height
      	var f =	'<script>' +
          			'function SetHeight(){' +
                		'var Heights = document.getElementsByClassName("step_des_area");' +
                     	'var maxHeight = 0;' +
                       	'for(var i = 0; i < Heights.length; i++){' +
                        	'if(Heights[i].clientHeight > maxHeight) maxHeight = Heights[i].clientHeight;' +
                      	'}' +
                        'var Heights2 = document.getElementsByClassName("buttons_area");' +
                     	'var maxHeight2 = 0;' +
                       	'for(var i = 0; i < Heights2.length; i++){' +
                        	'if(Heights2[i].clientHeight > maxHeight2) maxHeight2 = Heights2[i].clientHeight;' +
                      	'}' +
                     	'$(".step_des_area").height(maxHeight - 24);' +
                        '$(".buttons_area").height(maxHeight2 - 8);' +
                	'}' +
                 	'window.onload = SetHeight;' +
         		'</script>';
        
        o.push(f);
      	
		return o.join ('\n');
	}
  	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	// This function generates HTML for the whole table which contains the three steps sections of the User Guide page
  	public static function GenerateThreeStepsHTML (user : User, state : ReportState, confirmit : ConfirmitFacade, report : Report){
    	var o = [];

        var descriptions = ResourceText.List (report, 'ug_headers_desciptions', 'ds_res');
        var buttons = ResourceText.List (report, 'buttons', 'ds_res');
        
        o.push('<table class="first_table" border="0">');
        o.push('<tbody>');
        
      	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      	// Start of the first table rows
      	// Adding the first row
      	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      	o.push('<tr>');
        
      	if( NavigatorSteps.Step1.length != 0 ){
        	o.push ('<td><div class="step">' + descriptions['step'] + ' 1</div></td>' );
        }
      	if( NavigatorSteps.Step2.length != 0 ){
        	o.push ('<td style="padding-left: 10px"><div class="step">' + descriptions['step'] + ' 2</div></td>' );
        }
        if( (!PageHide.AllActionPlanningPagesDisabled (user, state)) && (NavigatorSteps.Step3.length != 0) ){
            o.push ('<td style="padding-left: 17px"><div class="step">' + descriptions['step'] + ' 3</div></td>' );
        }
        
      	o.push('</tr>');
        
      	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      	// Adding the second row with the "arrow" pictures as a background(s)
      	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      	o.push('<tr>');
      	
      	if( NavigatorSteps.Step1.length != 0 ){
        	o.push ('<td class="step_headers" style="background-image: url(' + Config.FileFolder + 'UG_Chevron1.png)"><div class="step_head_area highlight">' + descriptions['highlights'] + '</div></td>');
        }
      	if( NavigatorSteps.Step2.length != 0 ){
        	o.push ('<td class="step_headers" style="background-image: url(' + Config.FileFolder + 'UG_Chevron2.png)"><div class="step_head_area explore">' + descriptions['explore'] + '</div></td>');
        }
        if( (!PageHide.AllActionPlanningPagesDisabled (user, state)) && (NavigatorSteps.Step3.length != 0) ){
          	o.push ('<td class="step_headers" style="background-image: url(' + Config.FileFolder + 'UG_Chevron3.png); background-position-x: 7px"><div class="step_head_area action">' + descriptions['actionplanning'] + '</div></td>');
        }
        
      	o.push('</tr>');
        
      	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      	// Adding the third row with the step descriptions
      	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      	o.push('<tr>');
      	
      	if( NavigatorSteps.Step1.length != 0 ){
        	o.push ('<td class="step_descriptions" style="padding-left:0px"><div class="step_des_area">' + descriptions['linkheader1'] + '</div></td>');
        }  
      	if( NavigatorSteps.Step2.length != 0 ){
        	o.push ('<td class="step_descriptions" style="padding-left: 9px"><div class="step_des_area">' + descriptions['linkheader2'] + '</div></td>');
        }
        if( (!PageHide.AllActionPlanningPagesDisabled (user, state)) && (NavigatorSteps.Step3.length != 0) ){
            o.push ('<td class="step_descriptions" style="padding-left: 9px"><div class="step_des_area">' + descriptions['linkheader3'] + '</div></td>'); 
        }
        
      	o.push('</tr>');
        
      	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      	// Adding the fourth row which contains all buttons
      	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        o.push('<tr>');
      	
      	// Step1 buttons
      	if( NavigatorSteps.Step1.length != 0 ){
        	o.push('<td class="button_cells" style="padding-left: 0px" valign="top">');
            o.push('<div class="buttons_area">');
            
            var step1 = Page_UserGuide.NavigatorSteps.Step1;
            
            for(var i = 0; i < step1.length; i++){
              	// Adding the button only if the page has a hidden button already prepared on the page
              	if(step1[i].ButtonId != null){
                	o.push ( Page_UserGuide.GenerateButtonHTML (step1[i], buttons[step1[i].ButtonTitle], user, state, confirmit, report) );
                }
            }
            
            o.push('</div></td>');
        }
        
      	// Step2 buttons
      	if( NavigatorSteps.Step2.length != 0 ){
        	o.push('<td class="button_cells" style="padding-left: 9px" valign="top">');
            o.push('<div class="buttons_area">');
            
            var step2 = Page_UserGuide.NavigatorSteps.Step2;
            
            for (var i = 0; i < step2.length; i++){
              	// Adding the button only if the page has a hidden button already prepared on the page
              	if(step2[i].ButtonId != null){
                	o.push( Page_UserGuide.GenerateButtonHTML (step2[i], buttons[step2[i].ButtonTitle], user, state, confirmit, report) );
                }
            }
            
            o.push('</div></td>');
        }
        
      	// Step3 buttons
      	if( (!PageHide.AllActionPlanningPagesDisabled (user, state)) && (NavigatorSteps.Step3.length != 0) ){
        	o.push('<td class="button_cells" style="padding-left: 9px" valign="top">');
            o.push('<div class="buttons_area">');
            
            var step3 = Page_UserGuide.NavigatorSteps.Step3;
            
            for (var i = 0; i < step3.length; i++){
              	// Adding the button only if the page has a hidden button already prepared on the page
              	if(step3[i].ButtonId != null){
                	o.push( Page_UserGuide.GenerateButtonHTML (step3[i], buttons[step3[i].ButtonTitle], user, state, confirmit, report) );
                }
            }
            
            o.push('</div></td>');
        }
      	
        o.push('</tr>');
      	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      	// End of the first table rows
      	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        o.push('</tbody>');
        o.push('</table>');
      	
      	return o.join ('\n');
    }
  	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	// This functions generate a HTML for one button specified by the PageElement variable
  	// If the page should be hidden it will return an empty string only
  	public static function GenerateButtonHTML (PageElement, label : String, user : User, state : ReportState, confirmit : ConfirmitFacade, report : Report){
      	var o : String = '';
      	
      	// Generating the button HTML only if the page should not be hidden
      	if ( !( GetPageHide (PageElement.PageTitle, user, state, confirmit, report) ) ){
        	o = '<script>' +
             		'function navigate_' + PageElement.ButtonId + '() {' +
             		'var buttons = document.getElementById("buttons").getElementsByTagName("input");' +
             		'buttons[' + PageElement.ButtonId + '].click();}' +
             	'</script>' +
             	'<input class="LinkButton" cursor: pointer" type=button value="' + label + '" onclick="javascript:navigate_' + PageElement.ButtonId + '()">';
        }
		 
      	return o;
    }
  	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	// This function generates the HTML for the whole second table on the User Guide page using the other function necessary
  	// to print the whole navigator structure with the section descriptions
  	public static function GenerateUserGuideTable (user : User, state : ReportState, confirmit : ConfirmitFacade, report : Report){
    	var o = [];
      	var NaviTree = CreateNavigatorTree (user, state, confirmit, report);
      	var descriptions = ResourceText.List (report, 'ug_headers_desciptions', 'ds_res');
      
      	o.push ('<table class="second_table" border="0">');
      	
      	o.push ('<tr>');
      	o.push ('<td class="structure_headers">' + descriptions["area"] + '</td>');
      	o.push ('<td class="structure_headers">' + descriptions["subarea"] + '</td>');
      	o.push ('<td class="structure_headers">' + descriptions["description"] + '</td>');
       	o.push ('</tr>');
      	
      	o.push ( Print(NaviTree) );
      
      	o.push ('</table>');
      
      	return o.join ('\n');
    }
  	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	// This function will create and return a more complex navigator structure variable based on the simplified one
  	// It is using the CreateNewPageElement function
  	public static function CreateNavigatorTree (user : User, state : ReportState, confirmit : ConfirmitFacade, report : Report){
    	var labels = ResourceText.List (report, 'pages', 'ds_res');
    	var descriptions = ResourceText.List (report, 'ug_headers_desciptions', 'ds_res');
    	
      	var PageMap = [];
      	
      	var Simplified = NavigatorStructureMap;
      	
   		var parent = null;
      	var children = null;
      	
      	for(var key in Simplified){
          	parent = CreateNewPageElement (Simplified[key].Id, labels[Simplified[key].Id], descriptions[Simplified[key].Id + '_Des'], 1, false, user, state, confirmit, report);
          	if(Simplified[key].Pages != null){
              	children = [];
              	for(var i = 0; i < Simplified[key].Pages.length; i++){
                  	if(i == 0){
                    	children.push ( CreateNewPageElement (Simplified[key].Pages[i], labels[Simplified[key].Pages[i]], descriptions[Simplified[key].Pages[i] + '_Des'], 2, true, user, state, confirmit, report) );
                    }
                  	else{
                    	children.push ( CreateNewPageElement (Simplified[key].Pages[i], labels[Simplified[key].Pages[i]], descriptions[Simplified[key].Pages[i] + '_Des'], 2, false, user, state, confirmit, report) );
                    }
                }
              	parent.Pages = children;
            }
          	PageMap.push ( parent );
        }
          
    	return PageMap;
   	}
  	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	// This function is using a recursion
  	// It will print the whole navigator structure table with the section decriptions based on the complex navigator structure
  	// variable in an appropriate format
  	public static function Print (Pages){
        var o = [];
      	var CurrentPage = null;
        for(var i = 0; i < Pages.length; i++){
            CurrentPage = Pages[i];
          	if(CurrentPage.Show){
            	if(CurrentPage.Level == 1){
                    o.push ('<tr><td class="allcols col0">' + CurrentPage.Label + '</td>');
                    if(CurrentPage.Pages != null){
                        o.push ( Print(CurrentPage.Pages) );
                    }
                    else{
                        o.push ('<td class="allcols col1"></td><td class="allcols col2">' + CurrentPage.Description + '</td></tr>');
                    }
                }
                else if(CurrentPage.Level == 2){
                    if(CurrentPage.First){
                        o.push ('<td class="allcols col1">' + CurrentPage.Label + '</td><td class="allcols col2">' + CurrentPage.Description + '</td></tr>');
                    }
                    else{
                        o.push ('<tr><td class="allcols col0"></td><td class="allcols col1">' + CurrentPage.Label + '</td><td class="allcols col2">' + CurrentPage.Description + '</td></tr>');
                    }
                }
            }
          	else if((!CurrentPage.Show) && (CurrentPage.Level == 2) && (CurrentPage.First)){
              	if((i + 1) < Pages.length){
                	Pages[i+1].First = true;
                }
            }
        }
      
      	return o.join ('\n');
    }
  	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	// This function will create one new page element with all information necessary for the print the page in the
  	// second User Guide table
  	public static function CreateNewPageElement (id : String, label : String, descr : String, level : int, first : Boolean, user : User, state : ReportState, confirmit : ConfirmitFacade, report : Report){
      	var show = GetPageHide (id, user, state, confirmit, report);
      	
      	descr = (typeof(descr) === 'undefined') ? '[MISSING DESCRIPTION]' : descr;
      	
      	var PageElement = {
          	Label: label,
          	Description: descr,
          	Level: level,
          	Show: !show,
          	Pages: null,
          	First: first
        };
            
        return PageElement;
    }
  	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
  	// This function will return true or false based on the PageHide function of an appropriate page
  	// It is in line with the PageHide functions - true means that the page should be hidden
  	public static function GetPageHide (id : String, user : User, state : ReportState, confirmit : ConfirmitFacade, report : Report){
    	var m_hide : Boolean = true;
      	
      	switch(id){
        	case UGPages.Welcome.PageTitle:
            	m_hide = false;
            	break;
            case UGPages.Summary.PageTitle:
            	m_hide = PageHide.Summary (user, state);
            	break;
            case UGPages.Dashboard.PageTitle:
            	m_hide = PageHide.Dashboard (user, state);
            	break;
            case UGPages.EE.PageTitle:
            	m_hide = PageHide.AllEEPagesDisabled(user, state);
            	break;
            case UGPages.EEOverview.PageTitle:
            	m_hide = PageHide.EngagementAndEnablement (user, state);
            	break;
            case UGPages.EEDrivers.PageTitle:
            	m_hide = PageHide.EngagementAndEnablementDrivers (user, state);
            	break;
            case UGPages.EProfile.PageTitle:
            	m_hide = PageHide.EffectivessProfile (user, state);
            	break;
            case UGPages.ExploreResults.PageTitle:
            	m_hide = PageHide.AllExploreResultsPagesDisabled(user, state, confirmit, report);
            	break;
            case UGPages.QuestionsSummary.PageTitle:
            	m_hide = PageHide.QuestionsSummary (user, state);
            	break;
            case UGPages.ExploreSurveyDimensions.PageTitle:
            	m_hide = PageHide.SurveyDimensions (user, state);
            	break;
            case UGPages.LocalQuestions.PageTitle:
            	m_hide = PageHide.LocalQuestions (user, state, confirmit, report);
            	break;
            case UGPages.ResultsSortingTool.PageTitle:
            	m_hide = PageHide.ResultsSortingTool (user, state);
            	break;
            case UGPages.InternalBenchmarkTool.PageTitle:
            	m_hide = PageHide.InternalBenchmarkTool (user, state);
            	break;
            case UGPages.PlotYourResults.PageTitle:
            	m_hide = PageHide.PlotYourResults (user, state);
            	break;
            case UGPages.DemographicHighlighter.PageTitle:
            	m_hide = PageHide.DemographicHighlighter (user, state);
            	break;
            case UGPages.NSQ.PageTitle:
            	m_hide = PageHide.NonStandardQuestions (user, state, report);
            	break;
            case UGPages.NSQ_COMPARATOR.PageTitle:
            	m_hide = PageHide.NSQComparator (user, state, report);
            	break;
            case UGPages.NSQ_IBT.PageTitle:
            	m_hide = PageHide.NSQIBT (user, state, report);
            	break;
            case UGPages.Comments.PageTitle:
            	m_hide = PageHide.Comments (user, state, report, confirmit);
            	break;
            case UGPages.ENPS.PageTitle:
            	m_hide = PageHide.ENPS (user, state);
            	break;
            case UGPages.TakeAction.PageTitle:
            	m_hide = PageHide.AllActionPlanningPagesDisabled (user, state);
            	break;
            case UGPages.Home.PageTitle:
            	m_hide = PageHide.APHome (user, state);
            	break;
            case UGPages.CreatePlan.PageTitle:
            	m_hide = PageHide.APCreatePlan (user, state);
            	break;
            case UGPages.ReviewOwnPlans.PageTitle:
            	m_hide = PageHide.APReviewOwnPlans (user, state);
            	break;
            case UGPages.ReviewAllPlans.PageTitle:
            	m_hide = PageHide.APReviewAllPlans (user, state);
            	break;
            case UGPages.SharedPlans.PageTitle:
            	m_hide = PageHide.APSharedPlans (user, state);
            	break;
            case UGPages.Statistics.PageTitle:
            	m_hide = PageHide.APStatistics (user, state);
            	break;
            case UGPages.Respondents.PageTitle:
            	m_hide = PageHide.ResponseRate (user, state);
            	break;
        }
      
      	return m_hide;
    }  	
}