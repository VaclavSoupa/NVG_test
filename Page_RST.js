//This should handle taking out the proper set of questions
//For currently selected option on RST (also - dashboard)
class Page_RST{
  	
  	//Return appropriate set of questions based on currently selected option in either RST or RST_PAGED parameter
  	public static function GetRSTQuestions(report : Report, state : ReportState, user : User){
  		//Get currently selected param in either RST or RST_PAGED
      	var selected = ParamUtil.Selected(report, state, 'RST_PAGED', user);

        if (selected == null) {
          selected = ParamUtil.Selected(report, state, 'RST', user);
          if (selected == null)
            selected = ParamLists.Get('RST', state, report, user)[0];
        }
      	else{
          //If we're using paged settings we want to remove the page suffix from the code
          //so that switch() statement will work properly
      	  selected.Code = selected.Code.split('.')[0];
        }
      
      	//Return appropriate set of questions based on that
      	switch(selected.Code){
          case SortBy.Strengths:
            return GetStrengths(report, state, user, Config.ResultsSortingTool.TopAmount);
            break;
		  case SortBy.Opportunities:
            return GetOpportunities(report, state, user, Config.ResultsSortingTool.TopAmount);
            break;
          case SortBy.KeyDriversEngagement:
            return GetKDA(report, state, user, 1);
            break;
          case SortBy.KeyDriversEnablement:
            return GetKDA(report, state, user, 2);
            break;
          case SortBy.FullQFav:
            return GetTopFav(report, state, user, 1000, false);
            break;
          case SortBy.FullQNeutral:
            return GetTopNeutral(report, state, user, 1000, false);
            break;
          case SortBy.FullQUnfav:
            return GetTopUnfav(report, state, user, 1000, false);
            break;
          case SortBy.TopFav:
            return GetTopFav(report, state, user, Config.ResultsSortingTool.TopAmount, false);
            break;
          case SortBy.BottomFav:
            return GetTopFav(report, state, user, Config.ResultsSortingTool.TopAmount, true);
            break;
          case SortBy.TopUnfav:
            return GetTopUnfav(report, state, user, Config.ResultsSortingTool.TopAmount, false);
            break;
          case SortBy.BottomUnfav:
            return GetTopUnfav(report, state, user, Config.ResultsSortingTool.TopAmount, true);
            break;
          case SortBy.TopNeutral:
            return GetTopNeutral(report, state, user, Config.ResultsSortingTool.TopAmount, false);
            break;
          case SortBy.TopImproved:
            return GetTopInternal(report, state, user, Config.ResultsSortingTool.TopAmount, false, 5);
            break;
          case SortBy.TopImproved2:
            return GetTopInternal(report, state, user, Config.ResultsSortingTool.TopAmount, false, 6);
            break;
          case SortBy.TopImproved3:
            return GetTopInternal(report, state, user, Config.ResultsSortingTool.TopAmount, false, 7);
            break;
          case SortBy.TopDeclined:
            return GetTopInternal(report, state, user, Config.ResultsSortingTool.TopAmount, true, 5);
            break;
          case SortBy.TopVsInternal:
            return GetTopInternal(report, state, user, Config.ResultsSortingTool.TopAmount, false, 0);
            break;
          case SortBy.TopVsLevelUp:
            return GetTopInternal(report, state, user, Config.ResultsSortingTool.TopAmount, false, 1);
            break;
          case SortBy.TopVsLevel2:
            return GetTopInternal(report, state, user, Config.ResultsSortingTool.TopAmount, false, 2);
            break;
          case SortBy.TopVsCustom1:
            return GetTopInternal(report, state, user, Config.ResultsSortingTool.TopAmount, false, 3);
            break;
          case SortBy.TopVsCustom2:
            return GetTopInternal(report, state, user, Config.ResultsSortingTool.TopAmount, false, 4);
            break;
          case SortBy.BottomVsInternal:
            return GetTopInternal(report, state, user, Config.ResultsSortingTool.TopAmount, true, 0);
            break;
          case SortBy.BottomVsLevelUp:
            return GetTopInternal(report, state, user, Config.ResultsSortingTool.TopAmount, true, 1);
            break;
          case SortBy.BottomVsLevel2:
            return GetTopInternal(report, state, user, Config.ResultsSortingTool.TopAmount, true, 2);
            break;
          case SortBy.BottomVsCustom1:
            return GetTopInternal(report, state, user, Config.ResultsSortingTool.TopAmount, true, 3);
            break;
          case SortBy.BottomVsCustom2:
            return GetTopInternal(report, state, user, Config.ResultsSortingTool.TopAmount, true, 4);
            break;
          case SortBy.AllVsInternal:
            return GetTopInternal(report, state, user, 1000, false, 0);
            break;
          case SortBy.AllVsLevelUp:
            return GetTopInternal(report, state, user, 1000, false, 1);
            break;
          case SortBy.AllVsPrevious:
            return GetTopInternal(report, state, user, 1000, false, 5);
            break;
          case SortBy.AllVsPrevious2:
            return GetTopInternal(report, state, user, 1000, false, 6);
            break;
          case SortBy.AllVsPrevious3:
            return GetTopInternal(report, state, user, 1000, false, 7);
            break;
          case SortBy.AllVsLevel2:
            return GetTopInternal(report, state, user, 1000, false, 2);
            break;
          case SortBy.AllVsCustom1:
            return GetTopInternal(report, state, user, 1000, false, 3);
            break;
          case SortBy.AllVsCustom2:
            return GetTopInternal(report, state, user, 1000, false, 4);
            break;
          //Norm1
          case SortBy.TopVsExternal+ '_' + 0:
            return GetTopNorm(report, state, user, Config.ResultsSortingTool.TopAmount, false, 0);
            break;
          case SortBy.BottomVsExternal+ '_' + 0:
            return GetTopNorm(report, state, user, Config.ResultsSortingTool.TopAmount, false, 0);
            break;
          case SortBy.AllVsExternal+ '_' + 0:
            return GetTopNorm(report, state, user, 1000, false, 0);
            break;
          //Norm2
          case SortBy.TopVsExternal+ '_' + 1:
            return GetTopNorm(report, state, user, Config.ResultsSortingTool.TopAmount, false, 1);
            break;
          case SortBy.BottomVsExternal+ '_' + 1:
            return GetTopNorm(report, state, user, Config.ResultsSortingTool.TopAmount, false, 1);
            break;
          case SortBy.AllVsExternal+ '_' + 1:
            return GetTopNorm(report, state, user, 1000, false, 1);
            break;
          //Norm3
          case SortBy.TopVsExternal+ '_' + 2:
            return GetTopNorm(report, state, user, Config.ResultsSortingTool.TopAmount, false, 2);
            break;
          case SortBy.BottomVsExternal+ '_' + 2:
            return GetTopNorm(report, state, user, Config.ResultsSortingTool.TopAmount, false, 2);
            break;
          case SortBy.AllVsExternal+ '_' + 2:
            return GetTopNorm(report, state, user, 1000, false, 2);
            break;
          //Norm4
          case SortBy.TopVsExternal+ '_' + 3:
            return GetTopNorm(report, state, user, Config.ResultsSortingTool.TopAmount, false, 3);
            break;
          case SortBy.BottomVsExternal+ '_' + 3:
            return GetTopNorm(report, state, user, Config.ResultsSortingTool.TopAmount, false, 3);
            break;
          case SortBy.AllVsExternal+ '_' + 3:
            return GetTopNorm(report, state, user, 1000, false, 3);
            break;
          //Norm5
          case SortBy.TopVsExternal+ '_' + 4:
            return GetTopNorm(report, state, user, Config.ResultsSortingTool.TopAmount, false, 4);
            break;
          case SortBy.BottomVsExternal+ '_' + 4:
            return GetTopNorm(report, state, user, Config.ResultsSortingTool.TopAmount, false, 4);
            break;
          case SortBy.AllVsExternal+ '_' + 4:
            return GetTopNorm(report, state, user, 1000, false, 4);
            break;
          default:
			return GetStrengths(report, state, user, Config.ResultsSortingTool.TopAmount);            
        }
    }
  
  	//Returns top [numberOf] questions with best strengths score
  	//Last parameter is optional
  	public static function GetStrengths(report : Report, state : ReportState, user : User, numberOf : int, queryMan){
  		//Get all questions from core dimensions
      	if(queryMan == null)
      		var qm = QueryManager.GetQueryManagerMain(report, state, user, true);
      	else
          	var qm = queryMan;
      
      	// JV (19.1) - When unit is below min N (all questions are null), no sorting is applied
        var qs = qm.GetCoreQuestions();
      	//Find out if all Questions are null
        var notEmpty = false;
        for(var i = qs.length - 1; i>=0; i--){
        	if(qs[i].GetSO()!=null){
            	notEmpty = true;
              	break;
            }
        }
             
        if(notEmpty){
          //Sort them by strengths
          var sortedQs = qs.sort(SortUtil.SortHgQuestionByStrength);
        }
        else{
          //If all questions are null don't sort at all
          var sortedQs = qs  
        }
      
      	//Remove all excluded questions from sortedQs array
      	for(var i = sortedQs.length - 1; i>=0; i--){
          	for(var j=0; j<Config.Algorithm.ExcludedQuestions.length; j++){
              	if(sortedQs[i].GetId() == Config.Algorithm.ExcludedQuestions[j]){
              		sortedQs.splice(i, 1);
                  	break;
                }
            }
        }
      
      	//Take out [numberOf] top strengths
      	var returnArr = [];
        for(var i = 0; i<numberOf && i<sortedQs.length; i++){
          returnArr.push(sortedQs[i]);
        }
      	return returnArr;
    }
  	
  	//Returns top [numberOf] questions with worst strengths score
  	//Last parameter is optional
  	public static function GetOpportunities(report : Report, state : ReportState, user : User, numberOf : int, queryMan){
  		//Get all questions from core dimensions
      	if(queryMan == null)
      		var qm = QueryManager.GetQueryManagerMain(report, state, user, true);
      	else
          	var qm = queryMan;
      
      	// JV (19.1) - When unit is below min N (all questions are null), no sorting is applied
        var qs = qm.GetCoreQuestions();
      	//Find out if all Questions are null
        var notEmpty = false;
        for(var i = qs.length - 1; i>=0; i--){
        	if(qs[i].GetSO()!=null){
            	notEmpty = true;
              	break;
            }
        }
             
        if(notEmpty){
          //Sort them by Opportunities
          var sortedQs = qs.sort(SortUtil.SortHgQuestionByOpportunities);
        }
        else{
          //If all questions are null don't sort at all
          var sortedQs = qs  
        }

      
      	//Remove all excluded questions from sortedQs array
      	for(var i = sortedQs.length - 1; i>=0; i--){
          	for(var j=0; j<Config.Algorithm.ExcludedQuestions.length; j++){
              	if(sortedQs[i].GetId() == Config.Algorithm.ExcludedQuestions[j]){
              		sortedQs.splice(i, 1);
                  	break;
                }
            }
        }
      
      	//Take out [numberOf] top opps
      	var returnArr = [];
        for(var i = 0; i<numberOf && i<sortedQs.length; i++){
          returnArr.push(sortedQs[i]);
        }
      	return returnArr;
    }
  
  	//Returns all questions that are KDAs of Engagement
  	//Last parameter is optional
  	public static function GetKDA(report : Report, state : ReportState, user : User, type, queryMan){
  		//Get all questions from core dimensions
      	if(queryMan == null)
      		var qm = QueryManager.GetQueryManagerMain(report, state, user, true);
      	else
          	var qm = queryMan;
      
        var qs = qm.GetCoreQuestions();
      
      	//Translate questions into an associative array
      	var questionsArr = {};
      	for(var i = 0; i<qs.length; i++){
      		questionsArr[qs[i].GetId()] = qs[i];	
        }
      
      	//Get KDAs
      	var KDAs = KDA.GetItemsByNodeId(user.PersonalizedReportBase, state);
      	var returnArr = [];
      
      	//Map KDAs of Eng to return array
      	//TODO: CLEANUP
      	var kdaFinal = [];
      	var kdaAddedMap = {};
      	for(var i = 0; i<KDAs.length; i++){
          	if(!kdaAddedMap[KDAs[i].QuestionId] && KDAs[i].Type == type){
          		kdaAddedMap[KDAs[i].QuestionId] = true;
              	returnArr.push(questionsArr[KDAs[i].QuestionId]);
            }
        }
      
      	return returnArr;
    }
  
  	//Returns top [numberOf] questions sorted by fav (asc/desc)
  	//Last parameter is optional
  	public static function GetTopFav(report : Report, state : ReportState, user : User, numberOf : int, ascending : Boolean, queryMan){
  		//Get all questions from core dimensions
      	if(queryMan == null)
      		var qm = QueryManager.GetQueryManagerMain(report, state, user, true);
      	else
          	var qm = queryMan;
      
        var qs = qm.GetCoreQuestions();
      
      	//Sort them by fav (asc or desc)
      	var sortedQs = null;
      	if(ascending)
          sortedQs = qs.sort(SortUtil.SortHgQuestionByFavAsc);
        else
          sortedQs = qs.sort(SortUtil.SortHgQuestionByFavDesc);
      	
      	//Take out 10 top fav
      	var returnArr = [];
        for(var i = 0; i<numberOf && i<sortedQs.length; i++){
          returnArr.push(sortedQs[i]);
        }
      	return returnArr;
    }
  
  	//Returns top [numberOf] questions sorted by neutral (asc/desc)
  	//Last parameter is optional
  	public static function GetTopNeutral(report : Report, state : ReportState, user : User, numberOf : int, ascending : Boolean, queryMan){
  		//Get all questions from core dimensions
      	if(queryMan == null)
      		var qm = QueryManager.GetQueryManagerMain(report, state, user, true);
      	else
          	var qm = queryMan;
      
        var qs = qm.GetCoreQuestions();
      
      	//Sort them by fav (asc or desc)
      	var sortedQs = null;
      	if(ascending)
          sortedQs = qs.sort(SortUtil.SortHgQuestionByNeuAsc);
        else
          sortedQs = qs.sort(SortUtil.SortHgQuestionByNeuDesc);
      	
      	//Take out 10 top neutral
      	var returnArr = [];
        for(var i = 0; i<numberOf && i<sortedQs.length; i++){
          returnArr.push(sortedQs[i]);
        }
      	return returnArr;
    }
  	
  	//Returns top [numberOf] questions sorted by unfav (asc/desc)
  	//Last parameter is optional
  	public static function GetTopUnfav(report : Report, state : ReportState, user : User, numberOf : int, ascending : Boolean, queryMan){
  		//Get all questions from core dimensions
      	if(queryMan == null)
      		var qm = QueryManager.GetQueryManagerMain(report, state, user, true);
      	else
          	var qm = queryMan;
      
        var qs = qm.GetCoreQuestions();
      
      	//Sort them by fav (asc or desc)
      	var sortedQs = null;
      	if(ascending)
          sortedQs = qs.sort(SortUtil.SortHgQuestionByUnfavAsc);
        else
          sortedQs = qs.sort(SortUtil.SortHgQuestionByUnfavDesc);
      	
      	//Take out 10 top unfav 
      	var returnArr = [];
        for(var i = 0; i<numberOf && i<sortedQs.length; i++){
          returnArr.push(sortedQs[i]);
        }
      	return returnArr;
    }
  
  	//Returns top [numberOf] questions sorted by norm difference
  	//Last parameter is optional
  	public static function GetTopNorm(report : Report, state : ReportState, user : User, numberOf : int, ascending : Boolean, normNumber : int, queryMan){
  		//Get all questions from core dimensions
      	if(queryMan == null)
      		var qm = QueryManager.GetQueryManagerMain(report, state, user, true);
      	else
          	var qm = queryMan;
      
        var qs = qm.GetCoreQuestions();
      
      	//Sort them by fav (asc or desc)
      	var sortedQs = null;
      	if(ascending)
          sortedQs = qs.sort(SortUtil.SortHgQuestionByNormAsc(normNumber));
        else
          sortedQs = qs.sort(SortUtil.SortHgQuestionByNormDesc(normNumber));
      	
      	//Take out 10 top unfav 
      	var returnArr = [];
        for(var i = 0; i<numberOf && i<sortedQs.length; i++){
          returnArr.push(sortedQs[i]);
        }
      	return returnArr;
    }
  
  	//Returns top [numberOf] questions sorted by internal comp difference
  	//Last parameter is optional
  	public static function GetTopInternal(report : Report, state : ReportState, user : User, numberOf : int, ascending : Boolean, compNumber : int, queryMan){
  		//Get all questions from core dimensions
      	if(queryMan == null)
      		var qm = QueryManager.GetQueryManagerMain(report, state, user, true);
      	else
          	var qm = queryMan;
      
        var qs = qm.GetCoreQuestions();
      
      	//Sort them by fav (asc or desc)
      	var sortedQs = null;
      	if(ascending)
          sortedQs = qs.sort(SortUtil.SortHgQuestionByInternalAsc(compNumber));
        else
          sortedQs = qs.sort(SortUtil.SortHgQuestionByInternalDesc(compNumber));
      	
      	//Take out [numberOf] questions 
      	var returnArr = [];
        for(var i = 0; i<numberOf && i<sortedQs.length; i++){
          returnArr.push(sortedQs[i]);
        }
      	return returnArr;
    }
  
}