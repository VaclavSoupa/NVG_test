class Page_InternalBenchmarkTool {
	
  static function Selection_Export (report, state, user) {
    return ParamUtil.Selected (report, state, 'IBT_PAGED', user);
  }

  static function Selection_BreakBy (report, state, user) {

    var param_values = ParamLists.Get('DEMOGR_PAGED', state, report, user);
    var selected = ParamUtil.Selected (report, state, 'DEMOGR_PAGED', user);
    
	var exp = Page_InternalBenchmarkTool.Selection_Export (report, state, user);
    return (exp == null)
        ? (selected == null) ? param_values[0] : selected
      	: ParamUtil.GetByValue( exp.BreakBy, report, state, 'DEMOGR_PAGED', user);
  }
  
  static function Selection_Rows (report, state, user) {
	var exp = Page_InternalBenchmarkTool.Selection_Export (report, state, user);

    return (exp == null)
		? ParamUtil.Selected (report, state, 'INTERNAL_BENCHMARK_DATA', user)
      	: ParamUtil.GetByValue( exp.Rows, report, state, 'INTERNAL_BENCHMARK_DATA', user);
  }
  
  static function Selection_DisplayCompsAs (report, state, user) {
	var exp = Page_InternalBenchmarkTool.Selection_Export (report, state, user);
    return (exp == null)
		? ParamUtil.Selected (report, state, 'COMPARATOR_VALUETYPE', user)
      	: ParamUtil.GetByValue( exp.DisplayCompsAs, report, state, 'COMPARATOR_VALUETYPE', user);
  }
  
  static function Selection_Metric (report, state, user) {
	var exp = Page_InternalBenchmarkTool.Selection_Export (report, state, user);
    return (exp == null)
		? ParamUtil.Selected (report, state, 'DATA', user)
      	: ParamUtil.GetByValue( exp.Metric, report, state, 'DATA', user);    
  }
	
  //Since we're using QM 3 different times and this particular QM could be a little performance heavy (due to the demography split in parts)
  //we want to add it to the pageContext as soon as we can so we run as little queries to the survey as possible
  static function AddQMToPageContext(confirmit, report, user, state, pageContext){
    var qm = QueryManagerBreakByInterface.GetQM('IBT', confirmit, report, user, state);
    pageContext.Items[PageContextEnum.qm] = qm;
  }
  
  //Generates the table with N counts on IBT page
  static function GenerateNTable(report, user, state, pageContext, table){
	var qm = pageContext.Items[PageContextEnum.qm];
    
	var y = '[N]';
	var x = HelperUtil.SelfExpression(state, report, user, true) + '/(' + qm.m_breakby_expression + ')';

    table.AddHeaders (report, 'ds0', y + '^'  + x);
  }
  
  //Generates the MAIN table on IBT page
  static function GenerateMAINTable(report, pageContext, table){
  	var qm = pageContext.Items[PageContextEnum.qm];
  }
}