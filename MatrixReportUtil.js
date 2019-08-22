class MatrixReportUtil {

    static var Cache = {};

	static function Hide(confirmit, report, state, user) {
		var mr = new MatrixReport( confirmit, report, state, user, null);
		mr.Save();
        return true;
	//	return (state.ReportExecutionMode != ReportExecutionMode.Web); // hide page in exports
	}

	static function ListsToHtml( report, user ) {

		var o = [];
		var added_question_flag = {};

		var dimensions = Config.Dimensions.concat(Config.LocalDimensions);//HelperUtil.GetAllDimensionsByNodeId ( user.PersonalizedReportBase );
      
		for (var i=0; i<dimensions.length; ++i) {
          var dimension = dimensions[i];
		  for (var j=0; j<dimension.Questions.length; ++j) {
			
			var qid = dimension.Questions[j];
			if (! added_question_flag[qid] == '1' ) {
			  o.push ( {
					QuestionId: qid,
					QuestionNumber: LookupTable.GetQuestionNumberByQuestionId (qid)
				}
			  );
			  added_question_flag[qid] = '1';
			}
		  }
		  
		}

		// SORT THEM BY Q #
		var sorted_list = o.sort ( SortUtil.SortByQuestionNumber );

		var project = report.DataSource.GetProject('ds0');
		var o=[];


      	o.push ('<strong>items</strong>');
      
		o.push ('<table class=CopyTable>');
		
      	//In order to have all translations in one, clear place (GRID questions) - let's take out the labels and we'll always first go through
        //Our labels array before we take out text from the survey itself
        var textArray = [];
        var qMap = Config.QuestionsGridStructure;
        for(var i = 0; i<qMap.length; i++){
          var list = {};
          if(qMap[i].Qs != null){
            //Get all answers for the GRID question
            list = ResourceText.List(report, qMap[i].Id, 'ds0');
          }
          //Put all of the texts into text array in a format of {Id: qid, Text: text}
          for(var k in list){
            textArray.push({Id: k, Text: HelperUtil.ReplaceWildCards(report, list[k])});
          }
        }
      
		for (var i=0; i<sorted_list.length; ++i) {
          //Let's try finding the text for this question first
          var finalText = null;
          for(var k=0; k<textArray.length; k++){
            if(sorted_list[i].QuestionId == textArray[k].Id){
              finalText = textArray[k].Text;
              break;
            }
          }
          finalText = finalText == null ? project.GetQuestion(sorted_list[i].QuestionId).Text : finalText;
          
		  var label = HelperUtil.ReplaceWildCards(report, finalText);
		  o.push ('<tr><td>' + label + '</td><td>' + sorted_list[i].QuestionNumber + '</td></tr>');
		}
		o.push ('</table>');


		//var dimensions = Config.Dimensions;
		var labels = ResourceText.List (report, 'dimensions');

		o.push ('<p>');
      	o.push ('<strong>dimensions</strong>');
		o.push ('<table class=CopyTable>');

		for (var i=0; i<dimensions.length; ++i) {
		  var dimension_id = dimensions[i].Id;
		  o.push ('<tr><td>' + labels[dimension_id] + '</td><td>' + (i+1) + '</td></tr>');
		}
		o.push ('</table>');


		return ( o.join('\n') );
	}
  
	static function GetParamValuesByTopNodeId ( report, confirmit, top_node_id ) {

      
      	var param_values = [];

        var project_id = report.DataSource.GetProject ('ds0').ProjectId;
        var control = MatrixReportMetaDataStore.Record ( project_id, Config.MatrixReport.ProjectId );
      
      
        var last_processed_id = control ['LAST_PROCESSED_ID'];
        var timestamp = control ['UPDATED'];
		var execute = true;
      
		
		if (timestamp != null && timestamp != '' && timestamp != 'undefined' ) {
          	timestamp = parseInt(timestamp);
			var last_processed_timestamp = new Date (timestamp);
			var now = new Date();
 			var diff_in_minutes = (now.getTime() - last_processed_timestamp.getTime() ) / (1000*60);
 			execute = ( diff_in_minutes > 2 );
		}
 		
		
		// If less than 2 minutes since record was updated, 
		// assume there is another task running --> don't do anything
		if ( execute ) {
          var ids = GetValues ( confirmit, top_node_id );
          var found =  (last_processed_id==null);
          
          for (var i=0; i<ids.length; ++i) {
            var id = ids[i];
            if (id == last_processed_id) found = true;
            if (found)
              param_values.push ( {Code: id, Label: id } );
          }
		}
      
 		return param_values;
	}

  
  static function GetValues ( confirmit, top_node_id ) {
    
    var values = [];
    var nodes = {};
    
    var ids = DatabaseQuery.Exec (
      confirmit, 
      Config.Hierarchy.SchemaId, 
      Config.Hierarchy.TableName, 
      'id', 
      null, 
      null
    );
    
    var parent_ids = DatabaseQuery.Exec (
      confirmit, 
      Config.Hierarchy.SchemaId, 
      Config.Hierarchy.TableName, 
      'parent', 
      null, 
      null
    );
    
    for (var i=0; i<ids.length; ++i) {
      var id = ids[i];
      var parent_id = parent_ids[i];
      nodes[ id ] = {
        Include:false, 
        ParentId: parent_id 
      };
    }

    // Sow the seed 
    nodes [ top_node_id ].Include = true;
    

    // Process all nodes and identify all child nodes
    var stable_state = false;
    
    while ( !stable_state ) {
      stable_state = true; // no additions yet
      
      for (var i=0; i<ids.length; ++i) {
        
        var id = ids[i];
        var parent_id = parent_ids[i];
        
        var parent_is_null = (parent_id == '') || (parent_id == null) || (parent_id == 'undefined');
        
        if ( !parent_is_null && nodes[ parent_id ].Include == true) {
          // Parent is included, hence so must child
          if ( nodes[id].Include == false) {
            // If child not already identified, change now
            nodes[id].Include = true;
            stable_state = false; // additional node identified
          }
        }
      }
    }
    
    for (var i=0; i<ids.length; ++i) {
      var id = ids[i];
      if ( nodes[id].Include == true )
        values.push ( id );
    }
    
	return values;        
  }
  
}