class UserType {
    
  static var PowerUser = 'PU';
  static var StandardUser = 'SU';
  static var ExecUser = 'M';
  static var Custom1 = 'C1';
  static var Custom2 = 'C2';
  static var HayGroupUser = 'HGU';
  
  static function IsPowerUser(state, user) {
    return user.HasRole ( PowerUser ) || ParamUtil.GetParamCode (state, 'ROLE') == PowerUser;
  }

  static function IsStandardUser(state, user) {
    return user.HasRole ( StandardUser ) || ParamUtil.GetParamCode (state, 'ROLE') == StandardUser;
  }

  static function IsExecUser(state, user) {    
    return user.HasRole ( ExecUser ) || ParamUtil.GetParamCode (state, 'ROLE') == ExecUser;
  }
  
  static function IsCustom1(state, user) {
    return user.HasRole ( Custom1 ) || ParamUtil.GetParamCode (state, 'ROLE') == Custom1;
  }
  
  static function IsCustom2(state, user) {
    return user.HasRole ( Custom2 ) || ParamUtil.GetParamCode (state, 'ROLE') == Custom2;
  }
  
  static function IsHayGroupUser(state, user) {
    var role_code = ParamUtil.GetParamCode (state, 'ROLE');
    return IsCoreHayGroupUser(state, user) && (role_code == HayGroupUser || role_code == null);
  }  
 
  static function IsCoreHayGroupUser(state, user) {
    return user.HasRole ( HayGroupUser ) || (user.UserType == ReportUserType.Confirmit);
  }  
 
  
  static function GetFilters(state, user) {
    var role_based_filters = GetRoleConfig (state, user).Filters;
    var node_id = state.Parameters.GetString('REPORT_BASE_TOP');
    if(IsHayGroupUser(state, user)){
    	return HelperUtil.RemoveDuplicatesFromDemographicsList(role_based_filters);
    }
    else{
    	return HelperUtil.RemoveDuplicatesFromDemographicsList(HelperUtil.FilterDemographicsByHierarchy(role_based_filters, node_id));
    }
  }
  
  static function GetDemographics(state, user) {
	var o = GetRoleConfig (state, user).Demographics;
	var demogr = [];
    for (var i=0; i<o.length; ++i)
      if ( !(HelperUtil.IsVirtualUnitActive ( state ) && Config.Hierarchy.VariableId == o[i]) )
          demogr.push ( o[i] );
    if(IsHayGroupUser(state, user)){
    	return HelperUtil.RemoveDuplicatesFromDemographicsList(demogr);
    }
    else{
    	return HelperUtil.RemoveDuplicatesFromDemographicsList(HelperUtil.FilterDemographicsByHierarchy(demogr, user.PersonalizedReportBase));
    }
  }
  
  static function GetDashboard(state, user) {
	var o = GetRoleConfig (state, user).Dashboard;
	var widgets = [];
	if ( HelperUtil.IsVirtualUnitActive (state) || FilterUtil.AreAnyFiltersApplied(user, state) || HelperUtil.ShouldRRBeHiddenBasedOnPid (state) ) {
		for (var i=0; i<o.length; ++i) {
			var widget = o[i];
			
			switch ( o[i] ) {
			
				// Exclude the following widget types from the dashboard for virtual units
                // JA (template 21.0) - we wan't to exclude it when the PID filter is switched on but nothing is selected as well
				case CustomWidget.ResponseRate:
					break;
			
				default:
					widgets.push ( widget );
			}
		}
	}
	else
		widgets = o;
		
    return widgets;
  }
  
  static function VirtualUnitsEnabled(state, user) {
    return GetRoleConfig (state, user).VirtualUnits.Enabled
  }
  
  static function GetRoleConfig (state, user) {
   	 if (IsPowerUser(state, user)) return Config.Roles.PowerUser;
   	 if (IsStandardUser(state, user)) return Config.Roles.StandardUser;
   	 if (IsExecUser(state, user)) return Config.Roles.ExecUser;
   	 if (IsCustom1(state, user)) return Config.Roles.Custom1;
   	 if (IsCustom2(state, user)) return Config.Roles.Custom2;
   	 if (IsHayGroupUser(state, user)) return Config.Roles.HayGroupUser;
    
  }
  
}