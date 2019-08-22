class ProjectIdUtil {
  	public static function LoadProjectIdListTable (report, table, ds_id) {
    	// CACHING
        table.Caching.Enabled = Config.Caching.Enabled;
      	
      	var x;
        
      	if (Config.PID.Enabled) {
        	x = Config.PID.PidVariableName + '{total:false; title:false}^' + Config.PID.PnameVariableName + '{total:false; title:false}';
        }
      	else {
        	x = '[CONTENT]{id: PID_OFF; label: "PID FILTER SWITCHED OFF"}';
        }
      	
        table.AddHeaders(report, ds_id, x);	
    }
  	
  	public static function LoadProjectIdFilterExpression (report, state, filter) {
    	if (Config.PID.Enabled) {
            var my_pid = ParamUtil.Selected(report, state, 'PID');
          	
          	if (my_pid == null)
           		my_pid = ParamLists.Get('PID', state, report)[0];
            
            if(my_pid.Code != '')
                filter.Expression = Config.PID.PidVariableName + ' = "' + my_pid.Code + '"';
            else
                filter.Expression = '';
        }
      	else {
        	filter.Expression = '';
        }
    }
}