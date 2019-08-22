class PowerPointUtil {
	
  static function DashboardIncludes(code) {
    for(var i = 0; i < Config.Default.Dashboard.length; i++) {
      if(Config.Default.Dashboard[i]== code) {
        return true;
      }
    }
    return false;
  }
  
  static function DashboardIncludes_ByRole(code,state,user) {
    var dashboard = UserType.GetDashboard(state, user);
    for(var i = 0; i < dashboard.length; i++) {
      if(dashboard[i]== code) {
        return true;
      }
    }
    return false;
  }
  
  static function HasTrend(report, state, comparator) {
    var index = (comparator) ? comparator : Comparators.Prev;
    if ( ParamUtil.Contains ( state, 'COMPARATORS_INTERNAL', index ) ) 
      return true;
  }

  static function HideInfo(report,strTest) {
    if (!HasInfo(report,strTest)) 
      return true;
  }
  
  static function HideInfoSummary(report,strTest) {
    if (!HasInfoSummary(report,strTest)) 
      return true;
  }
  
  static function HideInfoBody(report,strTest) {
    if (!HasInfoBody(report,strTest)) 
      return true;
  }  

  static function HideInfoBoth(report,strTest) {
    if (!HasInfoBoth(report,strTest)) 
      return true;
  }  

  static function HasInfo(report,strTest) {
    var rtExports = ResourceText.List (report,'exports');
    var strIntro = rtExports['InfoIntro_' + strTest];
    var arrHidden = strIntro.split('[HIDDEN]');

    if (arrHidden.length>1 || strIntro.length==0) 
      return false;
    else
      return true;
  }
  
  static function HasInfoSummary(report,strTest) {
    var rtExports = ResourceText.List (report,'exports');
    var strSummary = rtExports['InfoSummary_' + strTest];
    var arrHidden = strSummary.split('[HIDDEN]');

    if (arrHidden.length>1 || strSummary.length==0) 
      return false;
    else
      return true;
  }

  static function HasInfoBody(report,strTest) {
    var rtExports = ResourceText.List (report,'exports');
    var strBody = rtExports['InfoBody_' + strTest];
    var arrHidden = strBody.split('[HIDDEN]');

    if (arrHidden.length>1 || strBody.length==0) 
      return false;
    else
      return true;
  }

  static function HasInfoBoth(report,strTest) {
    if (HasInfoSummary(report,strTest) && HasInfoBody(report,strTest)) 
      return true;
    else
      return false;
  }

  static function IsNotTop(report, user) {
      if (user.PersonalizedReportBase !== Config.Hierarchy.TopNodeId) {
        return true;
      }
      return false;
  }

  static function instantiateLog( log, confirmit ) {
	ConfirmitClass.Set ( confirmit, log );
	return true;
  }

  static function showENPS( report, state, user, key, log, confirmit ) {
	var testLog = instantiateLog( log, confirmit );
	if (key) 
		var comp = ComparatorUtil.IsHidden( report, state, user, key );
	else
		var comp = false;
		
	var enps = DashboardIncludes_ByRole( CustomWidget.ENPS, state, user );

	return ( testLog && enps && !comp );
  }
}