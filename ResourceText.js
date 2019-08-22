/*
	
Interface for looking up translated texts from the Resource Database (Datasource ID: ds_res)

*/
class ResourceText {

	static const DataSourceId = 'ds_res';
  	static var RTCache = {};
  
  	static function GetCacheKey(report : Report, ds_id, qid, code, list){
  		var key = '';
      	var listFin = '';
      	if(!list)
          listFin = list;
      	var key = key + listFin + '_';
      	key = key + report.CurrentLanguage + '_';
      	var dsId = ds_id == null? DataSourceId : ds_id;
      	key = key + dsId + '_';
      	key = key + qid + '_';
      	var codeFin = code == null ? '' : code;
      	key = key + codeFin;
      
      	return key;
    }
  
	static function Text(report, qid, code, ds_id) {
      if (ds_id == null) 
          	ds_id = DataSourceId;
      
      //In case we need one text from the whole list
      //we first try to take out the whole list from cache, 
      //if it was cached already there's no need for us to reach into the survey
      if(code != null){
        var cacheKey = GetCacheKey(report, ds_id, qid, null, true);
      	if(RTCache[cacheKey] != null && typeof RTCache[cacheKey] != 'undefined')
          if(RTCache[cacheKey][code] != null && typeof RTCache[cacheKey][code] != 'undefined'){
        	return RTCache[cacheKey][code];
          }
      }
      
      //If list was not cached - we can try the text cache
      var cacheKey = GetCacheKey(report, ds_id, qid, code);
      if(RTCache[cacheKey] != null && typeof RTCache[cacheKey] != 'undefined'){
        return RTCache[cacheKey];
      }
        
      
      //Nothing was found in cache - we need to run the query to the survey and cache the text
      try {
		var project = report.DataSource.GetProject( ds_id );
        if (code == null) {
            var question = project.GetQuestion(qid);
            var returnValue = question.HtmlText;
        }
        else {
            var answer : Answer = project.GetQuestion(qid).GetAnswer(code);
          	var returnValue = answer.HtmlText;    
        }
        
        RTCache[cacheKey] = returnValue;
        return returnValue;
      }
      catch (e) {
        ConfirmitClass.Log5('[MISSING RESOURCE TEXT: ' + qid + '.' + code + ']'); 
        return '[MISSING RESOURCE TEXT: ' + qid + '.' + code + ']'; 
      }
	}
  
	static function HTMLText(report, qid, code, ds_id) {
      
      try {
      
		if (ds_id == null) ds_id = DataSourceId;
		var project = report.DataSource.GetProject( ds_id );
        if (code == null) {
          var question = project.GetQuestion(qid);
          try {return question.HtmlText;}
          catch (e) {
          	return question.Text;
          }
        } else {
          var answer : Answer = project.GetQuestion(qid).GetAnswer(code);
       	  return answer.HtmlText;        
        }
        
      }
      catch (e) {
        ConfirmitClass.Log5('[MISSING RESOURCE TEXT: ' + qid + '.' + code + ']'); 
        return '[MISSING RESOURCE TEXT: ' + qid + '.' + code + ']'; 
      }
	}
  
    static function PreambleText(state, report, qid, code, ds_id) {
		/*var html = HTMLText(report, qid, code, ds_id);
      	if (html == null)*/
        var html = Text(report, qid, code, ds_id);

      	return (
          ExecutionMode.isPowerPoint(state)
                ? HelperUtil.HtmlToText (html)
                : html
        );
    }
  
  
	static function Has(report, qid, code, ds_id) {
      var returnText='';
      try {
      
      if (ds_id == null) ds_id = DataSourceId;
      var project = report.DataSource.GetProject( ds_id );
      
      if (code == null) {
          var question = project.GetQuestion(qid);
          if (question)
        	  returnText=question.Text;
      }
      else {
          var answer = project.GetQuestion(qid).GetAnswer(code);
          if (answer)
        	  returnText=answer.Text;
      }
        
      }
      catch (e) {
        return false; 
      }
      
      if (returnText=='' || returnText == null) {
        return false;
      } else {
        return true;
      }
	}

  	static function List(report, qid, ds_id) {
      var t = new Timer();
      	if (ds_id == null) ds_id = DataSourceId;
      	var cacheKey = GetCacheKey(report, ds_id, qid, null, true);
      	if(RTCache[cacheKey] != null && typeof RTCache[cacheKey] != 'undefined'){
        	return RTCache[cacheKey];
        }
      	
		var list = {};
		var project = report.DataSource.GetProject( ds_id );
        var answers = project.GetQuestion(qid).GetAnswers();
        for (var i=0; i<answers.length; ++i)
          list[answers[i].Precode] = answers[i].HtmlText;
		
      	RTCache[cacheKey] = list;
        return list;
    }

  	static function ArrayList(report, qid, ds_id) {
		if (ds_id == null) ds_id = DataSourceId;
      var list = [];
		var project = report.DataSource.GetProject( ds_id );
        var answers = project.GetQuestion(qid).GetAnswers();
        for (var i=0; i<answers.length; ++i)
          list.push ( answers[i].HtmlText);
        return list;
    }
  
	static function Title(report, qid, ds_id) {
		if (ds_id == null) ds_id = DataSourceId;
      
      	var cacheKey = GetCacheKey(report, ds_id, qid, null, false);
      	cacheKey = cacheKey + '.Title';
      	if(RTCache[cacheKey] != null && RTCache[cacheKey] != 'undefined')
        	return RTCache[cacheKey];
      
		var project = report.DataSource.GetProject( ds_id );
        var question : Question = project.GetQuestion(qid);
      	
      	RTCache[cacheKey] = question.Title;
		return question.Title;
	}
  
	static function Get(report, qid, ds_id) {
		if (ds_id == null) ds_id = DataSourceId;
		var project = report.DataSource.GetProject( ds_id );
		var question = project.GetQuestion(qid);
      	return { 
			Text: question.HtmlText, 
			Title: question.Title 
		};
	}
  
  
}