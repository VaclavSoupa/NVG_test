/*

Provides an interface for looking up information from Database designer tables 

*/


class DatabaseQuery {
  
    static var Hashtable = {}; // for performance

  	static function Exec (confirmit, schema_id, table_name, select_column_name, where_column_name, where_column_value) {
      	var key = [schema_id, table_name, select_column_name, where_column_name, where_column_value].join('.');
      if ( Hashtable [ key ] == null) {
       	 Hashtable [ key ] = ExecQuery (confirmit, schema_id, table_name, select_column_name, where_column_name, where_column_value);
      }
      return Hashtable [ key ];
    }
  
	static function ExecQuery (confirmit, schema_id, table_name, select_column_name, where_column_name, where_column_value) {
		var schema : DBDesignerSchema = confirmit.GetDBDesignerSchema(schema_id);
		var table : DBDesignerTable = schema.GetDBDesignerTable(table_name);
		var sc : StringCollection  = table.GetColumnValues(select_column_name, where_column_name, where_column_value);
      	var a = StringCollectionToArray(sc);
		return StringCollectionToArray(sc);
	}
	
	static function StringCollectionToArray(sc : StringCollection) {
		var o=[]; for (var s : String in sc) o.push(s); return o;	
	}
}