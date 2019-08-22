class ComparatorUtil {

	static var FieldNamePrefix = '__l9';
  
    static function IsHidden ( report, state, user, key ) {
      return ProcessedComparatorsMap ( report, state, user )[key].Hidden;
    }
  
	static function ProcessedComparatorsMap ( report, state, user ) {      
		var comparators = ProcessedComparators ( report, state, user );
        var comparators_map = {};
        for (var i=0; i<comparators.length; ++i)
          comparators_map [ comparators[i].Code  ] = comparators[i];
      
		return comparators_map;
	}
	
  
	static function ProcessedComparators ( report, state, user ) {
      	
		// Read the definitions
      
        var param_values = ParamLists.Get('COMPARATORS_INTERNAL_ALL', state, report, user);
      
		// Process the definitions: Add the associated Id, Hidden and TableLabel properties
		// Id: pointer to node for comparator
		// Hidden: true if Id is null or if a previous comparator points to the same node id
		// TableLabel: Label associated with Node (Id)
		
		var o = [];
		var virtual_unit_active = HelperUtil.IsVirtualUnitActive ( state ); //( ParamUtil.GetParamCode(state, 'VU_ACTIVE') != null );
      
      	// Map of selected codes
        var codes = ParamUtil.GetParamCodes ( state, 'COMPARATORS_INTERNAL');     
		
        var selected_codes_map = {};
      	for ( var i=0; i<codes.length; ++i )
          selected_codes_map [ codes[i] ] = 1;
      
      
        // Self node already showing
		var node_exists_map = {};
		if (!virtual_unit_active)
	      	node_exists_map [ user.PersonalizedReportBase ] = 1;
	      
		for (var i=0; i<param_values.length; ++i) {
          var code =  param_values[i].Code;          
          if ( param_values[i].IsHistorical ) {
            
              // Historical Comparator            
              o.push ( 
                {
                  Code: code,
                  Label: param_values[i].Label,
                  IsHistorical: true,
                  Hidden: !ParamUtil.Contains( state, 'COMPARATORS_INTERNAL', code)
                } 
              );
          }
          else {
            // Not Historical Comparator
            
				var id = null;
				
				// Check to see if there is an override for this comparator
				if ( virtual_unit_active ) {
					  id = Config.Hierarchy.TopNodeId;
				}
				else {
				  
					var override_field = param_values[i].OverrideField;
						  
					var override_result = (override_field == null)
						  ? null
						  : GetFieldValue ( override_field, user.PersonalizedReportBase, false );
										  
					if ( override_result == null || override_result == 'undefined' ) {
						var full_path = HierarchyUtil.GetPathByNodeId ( user.PersonalizedReportBase, ConfirmitClass.Get() );
						var level = param_values[i].Level;
						
						switch ( param_values[i].Type ) {
							
							case ComparatorType.Absolute:
								// Need to make sure that the full path is deep enough to be able to pull from the specified level.
								id = ( full_path.length > level )
									? full_path.reverse()[level]
									: null;
									
								break;
								
							case ComparatorType.Relative:
								// Need to make sure that the full path is deep enough to be able to pull from the specified level.
								id = ( full_path.length > level )
									? full_path[level]
									: null;									
									
								break;
							
						  default:                                
						} 
					}
					else {
						// Use Override value
						id = override_result;					
					}
					
					// Fallback
					if (id == null || id == 'undefined' ) id = Config.Hierarchy.TopNodeId; // why do we need this
				}
				
			  
				// Look up branch name
				var table_label = ( id == null || id == 'undefined' ) ? 'N/A' : GetLabelById( report, id );
				var is_hidden;
				var is_selected =  ( selected_codes_map [ param_values[i].Code ] != null );                  
			  
				// Turn on HIDDEN if ID is not set, or not checked
				if ( id == null || id == 'undefined' || !is_selected ) {
					is_hidden = true;
				}
				else {
					var already_added = (node_exists_map[ id ] == 1);
				  
					// Turn on HIDDEN if the node ID has already been used
					is_hidden = ( already_added );
				  
					// Mark code (node id) as used so we don't add it again later
				  if (is_selected)  {                        
					  node_exists_map[ id ] = 1;
				  }
				}
			  
				o.push ( 
				  {
					Code: code,
					Label: param_values[i].Label,
					Id: id,
					TableLabel: table_label,
					Hidden: is_hidden,
					IsHistorical: false,
					ColIndexId: param_values[i].ColIndexId
				  } 
				);
            }
          	
		} // end for
        
      
		return o;		
	}

	
	static function Cfg ( report, user, state ) {		
		// For testing only
		var comparators_map = ProcessedComparatorsMap ( report, state, user );
      
		return {
			Top: comparators_map [ Comparators.TotalCompany ],
			LevelUp: comparators_map [ Comparators.LevelUp ],
			Level2: comparators_map [ Comparators.Level2 ],
			Custom1: comparators_map [ Comparators.Custom1 ],
			Custom2: comparators_map [ Comparators.Custom2 ]
		};
	}
	
	static function GetLabelById( report, id ) {
      
      try {
          var result = DatabaseQuery.Exec (
              ConfirmitClass.Get(), 
              Config.Hierarchy.SchemaId, 
              Config.Hierarchy.TableName, 
              '__l' + report.CurrentLanguage, 
              'id', 
              id
          );
          return result[0];
      }
      catch (e) {
        return '[Missing Language in Schema ' + Config.Hierarchy.SchemaId + '.' + Config.Hierarchy.TableName + ' : LANGUAGE ID=' + report.CurrentLanguage + ']'; 
      }
	}
	
    static function Count ( report, user, state ) {
		var map = ComparatorUtil.ProcessedComparatorsMap ( report, state, user );
		var countReturn = 0;

		for ( var key in map )
			if ( !map [key].Hidden) countReturn++;

		for  (var i=0; i<Config.Norms.Codes.length; ++i) {
			var param_name = 'norm' + (i+1);
			var norm_enabled = ParamUtil.Contains ( state, 'COMPARATORS_EXTERNAL', param_name );
			if (norm_enabled) {
			  countReturn++;
			}
		}

		return countReturn;
	}

	static function NotNull ( res ) {
		return (res != '' && res != null && res != 'undefined');
	}
	
	
	static function Top( report, user, state ) {
      
		var map = ProcessedComparatorsMap ( report, state, user );
      	return map [ Comparators.TotalCompany ];
	}
	
	static function GetFieldValue ( field_name, report_base, exclude_prefix ) {
            
        var prefix = exclude_prefix ? '' : FieldNamePrefix;
		var result = DatabaseQuery.Exec (
			ConfirmitClass.Get(), 
			Config.Hierarchy.SchemaId, 
			Config.Hierarchy.TableName, 
			prefix + field_name, 
			'id', 
			report_base
		);
      
      
		if ( NotNull (result) ) 
          	return result[0]; 
      	else
          	return null;	
	}
  
	static function ShowLevelUp ( report, user, state ) {
		var levelup = ProcessedComparatorsMap ( report, state, user )[ Comparators.LevelUp ];
		return !levelup.Hidden;
	}
  
	static function ShowTop ( report, user, state ) {
  		var top = ProcessedComparatorsMap ( report, state, user )[ Comparators.TotalCompany ];
		return !top.Hidden;
	}

}