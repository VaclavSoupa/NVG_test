/*
Following class lets you log things during runtime in View/End-user modes
Logged information can be found in project specified below
*/
class RuntimeLog{
	static var m_store_id = 'p3083145599';
	
  	//Logs something into the log
  	static function Log(message){
  		var store = HayGroup.ReportUtil.Persistence.DataStores[ m_store_id ];
      	var record = store[new Date().getTime().toString()];
      	record['MESSAGE'] = message;
      	store.Flush();
    }
}