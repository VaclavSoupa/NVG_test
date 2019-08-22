class Page_PSS {
	
  	//Adds QM to the page context due to the fact
  	//that creating QM could be quite costly in case of PSS execution
    public static function AddQMToPageContext(confirmit, report, user, state, pageContext){
      var qm = QueryManagerBreakByInterface.GetQM('PSS', confirmit, report, user, state);
      pageContext.Items[PageContextEnum.qm] = qm;
  	}
}