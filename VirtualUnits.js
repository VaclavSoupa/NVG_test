class VirtualUnits {

	var m_user;
	var m_record;
	var m_store_id = Config.VirtualUnits.ProjectId;
	var m_store;
	const MAX_COUNT = 50;

	
	function VirtualUnits ( user ) {
	
		m_user = user;
	    m_store =  HayGroup.ReportUtil.Persistence.DataStores[ m_store_id ];
      	m_store.ValidInterval = 0;
      
		m_record = m_store[ Key() ];
	}
	
	function FilterExpression( index ) {
		var values = Values ( index );      
        if (values.length == 0) return '1=0'; // "false" filter for VUs with no units
		var o=[];
		for (var i=0; i<values.length; ++i)
			o.push ( 'InHierarchy(' + Config.Hierarchy.VariableId + ',"' + values[i] + '")' );
		
		return '(' + o.join (' OR ') + ')';
	}
	
	function DirectFilterExpression( index ) {
		var values = Values ( index );
        if (values.length == 0) return '1=0'; // "false" filter for VUs with no units
		var o=[];
		for (var i=0; i<values.length; ++i)
			values[i] = '"' + values[i] + '"';
			
		return ( 'In(' + Config.Hierarchy.VariableId + ',' + values.join(',') +  ')' );
	}
	
	function AddNew(report) {
		var index = GetNextAvailableIndex();
		if (index > 0) {
          	var alias = ResourceText.Text(report, 'labels', 'NewVU');//'(New)';
			Save (index, alias, [], false, report);
          return {Index: index, Alias: alias}; 
		}
        return { Index: -1, Alias: 'not available' };
	}
	
    function Alias( index ) {
      return m_record [ 'VIRTUAL_UNIT_ALIAS_' + index ]; 
    }
  
    function Values ( index ) {
		var value = m_record [ 'VIRTUAL_UNIT_' + index ];
		return (value == '') ? [] : value.split(',');
    }
  
	function GetNextAvailableIndex() {
      for (var i=0; i<MAX_COUNT; ++i) {
              var index = (i+1);
              var alias = Alias (index);
              if ( alias == '' || alias == null)
                  return index;
      }
	}

      
      function Key() {
		return [
			Config.Hierarchy.SchemaId,
			Config.Hierarchy.TableName,
			m_user.UserId
		].join('.');
	}
	
  
  function Delete ( index ) {
   	Save (index, null, [], true ); 
  }
  
    function Save( index, alias, values, force_naming, report ) {
        var id = 'VIRTUAL_UNIT_' + index;
        var alias_id = 'VIRTUAL_UNIT_ALIAS_' + index;
        if ( (alias == null || alias == '') && !force_naming ) alias = ResourceText.Text(report, 'labels', 'DefaultVUName');//'(Virtual Unit)'; // default name if left blank
    	m_record [ id ] = values.join(',');
      	m_record [ alias_id ] = alias;
        m_record [ 'UPDATED' ] = '' + new Date();
      	m_store.Flush();
    }
  
	function ParamValues() {
      
      try {
		var o = [];
		for (var i=0; i<MAX_COUNT; ++i) {
			var index = (i+1);
			var id = 'VIRTUAL_UNIT_' + index;
			var alias_id = 'VIRTUAL_UNIT_ALIAS_' + index;
			if ( m_record[alias_id] != '' && m_record[alias_id] != null) {
              	var codes = m_record[id].split(',');
				o.push (
					{
                        Label: m_record[alias_id] + ( (codes.length>1) ? (' (' + codes.length + ')') : ''),
						Code: index,
						Values: codes
					}
				);
			}
		}
        return o.sort ( SortUtil.SortByLabel );
      } catch (e) {
        return [{Code:"0", Label:"ERROR: " + e}]; 
      }
	}

}