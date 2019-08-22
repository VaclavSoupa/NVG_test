class HierarchyUtil {
	
	static var full_path_map = {};

	static function GetPathByNodeId( node_id, confirmit ) {
		//returns an array of node IDs starting with the specified node_id and ending with the top node
      
		if ( full_path_map[node_id] == null ) {
			var parent_id = HelperUtil.GetParentId (node_id, confirmit);

          	full_path_map [ node_id ] = ( parent_id == null || parent_id == 'undefined' )
              ? [ node_id ]
              : [ node_id ].concat (
					GetPathByNodeId( parent_id, confirmit )
				);			
		}
		
      	// return a copy of the array to prevent it from being changed after it's returned
		return full_path_map[node_id].slice(0,full_path_map[node_id].length);
		//return full_path_map[node_id];
	}
}