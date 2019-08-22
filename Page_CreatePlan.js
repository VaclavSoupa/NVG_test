class Page_CreatePlan {
	
  	static var dims;
  	
	static function HeaderRow (headers) {
      var o=[];
      o.push ('<tr>');
      for (var i=0; i<headers.length; ++i)
        o.push ('<td class=hdr>' + headers[i] + '</td>');

      o.push ('</tr>');  
      return o.join('\n');
    }
  	
  	//Generates one row on Create Plan page based on a HgQuestion object
  	static function RowHgQuestion(question : HgQuestion, index, dimensionLabels, report, state, user){
      	  if ((dims == null) || (typeof dims == 'undefined')) {
          	dims = HelperUtil.GetAllDimensionsByNodeId(user.PersonalizedReportBase);
          }
      	  
  		  //Figure out the dimension id for this question so we can get the label
          var dimId = 'DIM_ENG';
      	  var found = false;
          for(var k = 0; k<dims.length; k++){
            if(found)
              break;
            
           	for(var j = 0; j<dims[k].Questions.length; j++){
               	if(dims[k].Questions[j] == question.GetId()){
               		dimId = dims[k].Id;
                  	found = true;
                   	break;
            	}
            }
          }
      
          //Generate HTML
          var o = [];
      	  
          o.push ('<tr>');
          o.push ('<td class=rank>' + index + '</td>');
          o.push ('<td style="text-align: center">' + question.GetDisplayId() + '</td>');
          o.push ('<td>' + question.text + '</td>');
          o.push ('<td style="width:210px">' + dimensionLabels[dimId] + '</td>');
          o.push ('<td style="width:80px; text-align:center">' + question.GetScores().fav + '</td>');
          o.push ("<td style='width:210px'>" + Button(question.GetId(), report, state, user) + "</td>");      
  
          o.push ('</tr>');	
		
          return o.join ('\n');
    }
  
	static function Row (item_result, qid, index, report, state, user, dimension_labels) {
      try {
          var dimension = HelperUtil.GetDimensionByQuestionId( qid, user.PersonalizedReportBase );
          var qno = LookupTable.GetQuestionNumberByQuestionId ( qid );
          // rank, qno, question text, dimension text, button
          var o = [];
          var dimension_label;
          try {
              dimension_label = dimension_labels[dimension.Id];
          }
          catch (e) {
              dimension_label = '-'; 
          }
          o.push ('<tr>');
          o.push ('<td class=rank>' + index + '</td>');
          o.push ('<td style="text-align: center">' + qno + '.</td>');
          o.push ('<td>' + item_result.Text + '</td>');
          o.push ('<td style="width:210px">' + dimension_label + '</td>');
          o.push ('<td style="width:80px; text-align:center">' + item_result.Fav.Pct + '</td>');
          o.push ("<td style='width:210px'>" + Button(qid, report, state, user) + "</td>");      
  
          o.push ('</tr>');	
		
          return o.join ('\n');
      }
      catch (e) {
        return (e);
      }
	}
	
	static function Button(qid, report, state, user) {
		var button_text = ResourceText.Text(report,'labels','AddtoPlan');
      
		//Figure out the dimension id for this question
        var dimension = 'DIM_ENG';
        var dims = HelperUtil.GetAllDimensionsByNodeId(user.PersonalizedReportBase);
      	var found = false;
        for(var k = 0; k<dims.length; k++){
          if(found)
          	break;
              
          for(var j = 0; j<dims[k].Questions.length; j++){
            if(dims[k].Questions[j] == qid){
              dimension = dims[k].Id;
              found = true;
              break;
            }
          }
        }
      
		var params = [];
      	if (dimension != null)
          params.push ("driver_id=" + dimension);

		params.push ("node_id=" + state.Parameters.GetString('REPORT_BASE_TOP'));
		params.push ("item_id=" + qid);
		params.push ("user_id=" + escape(user.UserId) );
		params.push ("l=" + report.CurrentLanguage);

		var url = Config.Server.SurveyUrl + "/wix/" + HelperUtil.GetActionPlanningProjectId ( report )  + ".aspx?" + params.join("&");

      	var o=[];
		o.push ( "<button class=NavButton style='cursor: pointer; text-align:center' onclick='window.open(\"" + url + "\",\"mywindow\",\"scrollbars=1, resizable=1\")'>" + button_text + "</button>");
		return o.join ('\n');
	}

}