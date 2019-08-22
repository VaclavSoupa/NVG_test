class PageTemplate {
  
  static function Process (page, report, state, page_id, user, titleId) {
    if (page_id != null) 
      ParamUtil.Save(state, report, 'LAST_VISITED_PAGE', page_id);
    
    switch (page.SubmitSource) {        
      case 'ClearFilters':
        ClearFilters ( state );        
        break;

      case 'ClearVirtualUnits':
        ClearVirtualUnits ( state );
        if ( page_id != null)
          page.NextPageId = page_id;
        break;

    }
    
    if(titleId != null && typeof(titleId) != 'undefined')
      DoPageTitle (page, report, state, user, page_id, titleId);
  }

  //Sets the title of a page (slide) based on the titleId provided
  //Lookup is done in the widgets question in RT database
  static function SetSlideTitle(page, report, titleId){
  	var pageText = ResourceText.Text(report, 'widgets', titleId, 'ds_res');
    if(titleId == 'TOP_THEMES')
      pageText = pageText.split('[QUESTION]').join('');
    
    for (var i=0; i<page.Title.Texts.Count; i++) 
      page.Title.Texts[i].Text = pageText;
  }
  
  //Sets the title of a button based on the titleId provided
  //Lookup is done in the buttons question in RT database
  //Last parameter is optional and if provided - it should contain an associative array with codes and texts for all buttons
  //(It's used mainly on UserGuide)
  static function SetButtonTitle(button, report, titleId, buttonsAssocArray){
  	var buttonText = '';
    if(buttonsAssocArray == null){
      	buttonText = ResourceText.Text(report, 'buttons', titleId, 'ds_res');
    }
    else{
    	buttonText = buttonsAssocArray[titleId];
    }
    
    var currLang = report.CurrentLanguage;
    for (var i=0; i<button.Label.Texts.Count; i++){
      if(button.Label.Texts[i].Language == currLang)
        button.Label.Texts[i].Text = buttonText;
    }
  }
  
  static function DoPageTitle (page, report, state, user, page_id, titleId) {  
    var pageText = ResourceText.Text(report, 'pages', titleId, 'ds_res');
    var extraText = '';

    if (ExecutionMode.isExcel(state)){
      switch (page_id) {
        
        case 'dim_questions':
          var dimension = HelperUtil.CurrentDimension ( report, state );
          if (!dimension) 
            dimension = ParamLists.Get('DIMENSION', state, report)[0];
            extraText = ': '+ dimension.Label;
          break;
        
        case 'sorting_tool':
          var selected = ParamUtil.Selected(report, state, 'RST_PAGED', user);
          
          if (!selected) {
            selected = ParamUtil.Selected(report, state, 'RST', user);
            if (selected == null)
              selected = ParamLists.Get('RST', state, report, user)[0];
          }
          
          if (selected) 
            extraText = ': '+ selected.Label;
          break;
         
        case 'local_questions':
          var strAppend = ParamUtil.Selected(report, state, 'LOCAL_DIMENSION', user);  
          if (strAppend)
            extraText = ': '+ strAppend.Label;
          break;
          
        case 'nsq_comp':
          //Get the NSQ_PAGED or NSQ option
          var currentNSQId = null;
          var selectedQ = ParamUtil.Selected(report, state, 'NSQ_PAGED', user);
          
          if(selectedQ == null){
            selectedQ = ParamUtil.Selected (report, state, 'NSQ', user);
            if(selectedQ == null){
              selectedQ = ParamLists.Get('NSQ', state, report)[0].Code;
            }
          }
          else{
            selectedQ = ParamUtil.GetByCode(report, state, 'NSQ', selectedQ.Code.split(".")[0]);
          }
          extraText = ": " + selectedQ.Label;
          break;
          
        case 'nsq_ibt':
          var selectedDemo = Page_NSQ.Selection_BreakBy(report, state, user);
          
          var selectedQ = Page_NSQ.Selection_Question(report, state, user);
          extraText = ": " + selectedQ.Label + " - " + selectedDemo.Label;
          break;
          
        case 'internal_bm':
          var ibtDemo = Page_InternalBenchmarkTool.Selection_BreakBy (report, state, user);
          var ibtRows = Page_InternalBenchmarkTool.Selection_Rows (report, state, user);
          
          extraText = ": " + ibtRows.Label + " - " + ibtDemo.Label;
          break;
          
        case 'rr_segment':
          var rr_segment_demo = ParamUtil.Selected(report, state, 'DEMOGR', user);
          if (rr_segment_demo == null)            
            rr_segment_demo = ParamLists.Get('DEMOGR', state, report, user)[0];
          if (rr_segment_demo) 
            extraText = ': '+ rr_segment_demo.Label;
          break;

      }
    }
    pageText=pageText+extraText;        
    var currLang = report.CurrentLanguage;
    for (var i=0; i<page.Title.Texts.Count; i++){
      if(page.Title.Texts[i].Language == currLang)
        page.Title.Texts[i].Text = pageText;
    }
  }
  
  static function ClearFilters( state ) {
    for (var i=0; i<30; ++i) {
      var param_name = 'FILTER' + (i+1);
      try {
        state.Parameters[param_name] = null;
      }catch (e) {}
    }    
  }
  
  static function ClearVirtualUnits ( state ) {
    try {
      state.Parameters['VU_ACTIVE'] = null;
    } catch (e) {}    
  }
}