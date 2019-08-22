class KDA {

  	// NODEID:1 = Engagement Drivers
  	// NODEID:2 = Enablement Drivers
  
  	// Drivers (items) must be listed according to rank (highest rank first)
	
	
	static var LookupTable = {

      '1000:1':['AV15', 'GP10', 'SD05', 'BN01'],
      '1000:2':['AV15', 'RE01', 'VC04', 'ST01'],
      '1001:1':['AV15', 'GP09', 'SD04', 'SD03'],
      '1001:2':['VC04', 'AV15', 'GP10', 'WL01'],
      '1027:1':['AV15', 'TW06', 'SD04', 'ER01'],
      '1027:2':['RE01', 'AV15', 'TW06', 'WL01'],
      '1048:1':['GP10', 'TW06', 'SD04', 'SD05'],
      '1048:2':['RE01', 'AV15', 'VC04', 'ST01']
      
	};
	
  
  	static var KeyDriverMap = {};
   
	static function GetMapByNodeId(node_id, state) {
      
      var id = [node_id, HelperUtil.IsVirtualUnitActive ( state ) ].join('|');
      
      if (KeyDriverMap[ id ] == null) {
        KeyDriverMap[ id ] = {};
        var items = GetItemsByNodeId(node_id, state);
        for (var i=0; i<items.length; ++i) {
          KeyDriverMap[ id ] [ items[i].QuestionId ] = "1";
        }
      }
      return KeyDriverMap [ id ];
    }
  
	static function GetItemsByNodeId(id, state) {
      var o=[];
      
      // Virtual Units should revert back to Top Node analsis
      if ( HelperUtil.IsVirtualUnitActive ( state ) )
		id =  Config.Hierarchy.TopNodeId;
      
		// Check for Engagement Drivers
		var eng_drivers =LookupTable[id + ':1' ];
		if (eng_drivers != null) {
			for (var j=0; j<eng_drivers.length; ++j)
				o.push (
					{
						NodeId: id, 
						Type: 1, 
						QuestionId: eng_drivers[j], 
						Score: null
					}
				)
		}
		
		// Check for Enablement Drivers
		var ena_drivers =LookupTable[id + ':2' ];
		if (ena_drivers != null) {
			for (var j=0; j<ena_drivers.length; ++j)
				o.push (
					{
						NodeId: id, 
						Type: 2, 
						QuestionId: ena_drivers[j], 
						Score: null
					}
				)
		}
		
      	if (o.length>0) 
          	return o;
      
      if ( id == Config.Hierarchy.TopNodeId )
          	return [];
      else {
		// Not found, look to parent for KDA info
		var parent_id =  ComparatorUtil.GetFieldValue ( 'parent', id, true );
		return GetItemsByNodeId(parent_id, state);
      }
	}
  
	static function GetItemCountsByNodeId(id, state) {
		var items = GetItemsByNodeId(id, state);
		var count_engagement = 0;
		var count_enablement = 0;
		
		for (var i=0; i<items.length; ++i) {
			switch (items[i].Type) {
				
				case 1:
					count_engagement++;
					break;
				
				case 2:
					count_enablement++;
					break;
			}
		}
		return {Enablement: count_enablement, Engagement: count_engagement};
	}

}