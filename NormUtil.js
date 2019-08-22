class NormUtil {

	static function GetNormId (user, i) { 
		// i = 0..4
		var code = 'norm' + (i+1);
		var res = DatabaseQuery.Exec (ConfirmitClass.Get(), Config.Hierarchy.SchemaId, Config.Hierarchy.TableName, '__l9' + code, 'id', user.PersonalizedReportBase);

		// use override
		var norm_id = (res.length == 1 && res[0] != null && res[0] != 'undefined' && res[0] != '') ? res[0] : Config.Norms.Codes[i];
		return norm_id;
	}
  
	static function Analysis (user, state, breakout_variable_id ) {
	
		var count_filters_with_norm_breakout = 0;
		var count_filters_without_norm_breakout = 0;
		var trigger_message = false;
		
		
      	var filters = FilterUtil.GetFilters (state, user);
		var filter_variables = [];
		
		// loop over all possible filters
		for (var i=0; i<filters.length; ++i) {
			var param_name = 'FILTER' + (i+1);
			var filter_variable_id = filters[i];
			var values = ParamUtil.GetParamCodes ( state, param_name );
			
			switch ( values.length ) {

				case 0:
					// not applied
					break;
			
				case 1:
					if ( IsNormDemo ( filter_variable_id ) )
						count_filters_with_norm_breakout++;
					else
						count_filters_without_norm_breakout++;
					break;
					
				default:
					// means 2 or more values are selected
					trigger_message = true;
					break;
			
			}
			
		}
		
		// -------------  Begin: PSS breakouts here -----------------------
		
		if ( breakout_variable_id != null ) {
			if ( IsNormDemo ( breakout_variable_id ) )
				count_filters_with_norm_breakout++;
			else
				count_filters_without_norm_breakout++;
		}
		
		// -------------  End: PSS Breakouts -----------------------
		
		
		// User Level Filter considerations		
		var pairs =  FilterUtil.ParseExpression ( user.PersonalizedFilterExpression );
		
		for (var i=0; i<pairs.length; ++i) {
		
			if ( IsNormDemo ( pairs[i].Name ) )
				count_filters_with_norm_breakout++;
			else
				count_filters_without_norm_breakout++;
		}

		var total_filters = count_filters_with_norm_breakout + count_filters_without_norm_breakout;
		trigger_message = trigger_message || ( total_filters>1 ) || ( total_filters == 1 && count_filters_without_norm_breakout == 1);
		
		return {
			CountNormFilters: count_filters_with_norm_breakout,
			CountNonNormFilter: count_filters_without_norm_breakout,
			HideNorms: trigger_message
		};
	}
	
	static function IsNormDemo ( variable_id ) {
		variable_id = variable_id.toUpperCase();
		
		for (var i=0; i<Config.NormDemos.length; ++i) {
			var norm_demo = Config.NormDemos[i].toUpperCase();
			if (norm_demo == variable_id) return true; // found it
		}
		return false; // not found
	}
  
  
}