class MatrixReportMetaDataStore {

	static var store_id = Config.MatrixReport.MetaData.ProjectId;
    static var store = null;

	static function Get () {

		if (store == null) {
            store = HayGroup.ReportUtil.Persistence.DataStores[ store_id ];
		}
		return store;
	}
	
	static function Record ( project_id, top_node_id ) {
        var key = [ project_id, top_node_id ].join( '.' );
		return Get()[ key ];
	}
	
}