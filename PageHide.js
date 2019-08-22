class PageHide {
  	// ============== ROLE CHECKING FUNCTIONS TO BE USED ====================
  	//
	// UserType.IsHayGroupUser(state, user)
  	// UserType.IsPowerUser(state, user)
  	// UserType.IsStandardUser(state,user)
  	// UserType.IsExecUser(state,user)
  	// UserType.IsCustom1(state, user)
  	// UserType.IsCustom2(state, user)
  	//
  	//
  
  	//Menu Item: SUMMARY
	static function Summary (user, state) {
		return Config.RREnabled;
	}
  	
  	//Menu Item: DASHBOARD
  	static function Dashboard (user, state) {
		return Config.RREnabled;
	}
  
  	//Menu Item: ENGAGEMENT & ENABLEMENT
  	static function EngagementAndEnablement (user, state) {
      	return Config.RREnabled;
	}
  	
  	static function EngagementAndEnablementDrivers (user, state) {
		return Config.RREnabled;
	}
  	
  	static function EffectivessProfile (user, state) {
		return Config.RREnabled;
	}
  
  	static function EngagementAndEnablementDetails(user,state) {
      	return false;
    }
  
  	static function EffectivessProfileDetails(user,state) {
      	return false;
    }
  
	static function EffectivessProfileGap(user,state) {
      	return false;
    }
  
  	//Menu Item: EXPLORE RESULTS
	static function QuestionsSummary (user, state, report, confirmit) {
		return Config.RREnabled;
	}

	static function SurveyDimensions (user, state) {
		return Config.RREnabled;
	}

	static function LocalQuestions (user, state, confirmit, report) { 
      	//DO NOT REMOVE LocalQuestionsByNode FUNCTION BELOW!
		return Config.RREnabled || (!LocalQuestionsByNode(user, state, confirmit, report));
    }
  
  	static function ResultsSortingTool (user, state) {
		return Config.RREnabled;
	}	
  
	static function InternalBenchmarkTool (user, state) {
		return Config.RREnabled;
    }	
	
	static function PlotYourResults (user, state) {
		return Config.RREnabled;
    }
  
	static function DemographicHighlighter (user, state) {
		return Config.RREnabled;
    }

	static function NonStandardQuestions (user, state, report) {
		return Config.RREnabled || (Config.NSQ.length==0);
	}
  
  	static function NSQComparator (user, state, report) {
		return Config.RREnabled || (Config.NSQ.length==0);
	}
  
  	static function NSQIBT(user, state, report){
  		return Config.RREnabled || (Config.NSQ.length==0);
    }
  
    static function RankingQuestions (user, state, report) {
    	return Config.RREnabled || (Config.RankingQuestions.length==0);
    }
  
  	static function QuestionsByDimension(user,state) {
      	return false;
    }
  
	static function QuestionDetails(user,state) {
      	return false;
    }
  
  	static function DimensionDetails(user, state){
        return false;
    }
  
  	//Menu Item: COMMENTS
  	static function Comments (user, state, report, confirmit) {
      	//DO NOT REMOVE CommentsByNode FUNCTION BELOW!
		return Config.RREnabled || (!CommentsByNode(user, state, confirmit, report));
	}
  	
  	//Menu Item: ENPS
  	static function ENPS (user, state) {
		return Config.RREnabled || !Config.ENPS.Enabled;
	}
  
  	static function ENPSDetails(user, state) {
      	return false;
    }
  
	static function ENPSGap(user, state) {
      	return false;
    }
  
  	static function ENPSScale(user, state) {
      	return false;
    }
  
  	//Menu Item: TAKE ACTION
    //If set to true, all AP related pages will be hidden
    static var APAllPages = Config.RREnabled;
  
  	static function APHome(user,state) {
      	return APAllPages;
    }
  
	static function APCreatePlan(user,state) {
      	return APAllPages;
    }
  
	static function APReviewOwnPlans(user,state) {
      	return APAllPages;
    }
  
	static function APReviewAllPlans(user,state) {
      	return APAllPages;
    }
  
	static function APSharedPlans(user,state) {
      	return APAllPages;
    }
  
	static function APStatistics(user,state) {
      	return APAllPages;
    }

  	//Menu Item: RESPONDENTS
    static function ResponseRate (user, state) {
		return false;
	}
  	
  	static function ResponseRateByGroup (user,state) {
      	return false;
    }
  
	static function ResponseRateBySegment(user,state) {
      	return false;
    }	
  
  	
  	//========================================================================================================
  	//==================================Do not edit functions below===========================================
  	//========================================================================================================
  
  	static function AllActionPlanningPagesDisabled(user,state){
  		return (APHome(user,state) && APCreatePlan(user,state) && APReviewOwnPlans(user,state) && APReviewAllPlans(user,state) && APSharedPlans(user,state) && APStatistics(user,state));
    }
  
  	static function AllEEPagesDisabled(user, state, report, confirmit){
  		return (EngagementAndEnablement(user, state) && EngagementAndEnablementDrivers(user, state) && EffectivessProfile(user, state));
    }
  
  	static function AllExploreResultsPagesDisabled(user, state, confirmit, report){
  		return (QuestionsSummary(user, state) && SurveyDimensions(user, state) && LocalQuestions(user, state, confirmit, report) &&
          		ResultsSortingTool(user, state) && InternalBenchmarkTool(user, state) && PlotYourResults(user, state) && 
                DemographicHighlighter(user, state) && NonStandardQuestions(user, state, report));
    }
  
  	static function LocalQuestionsByNode(user, state, confirmit, report){
  		// JV (19.1) - Workaround no longer needed, solvede on a platform level
        /*if (!ExecutionMode.isWeb (state)) {
            var code = ParamUtil.GetParamCode(state, 'LOCAL_DIMENSION');
            if (code == '-1' )
                return false;
          
            var list = ParamLists.Get('LOCAL_DIMENSION', state, report, user);
            if (list.length == 1 && list[0].Code == '-1')
              return false;      
        }*/
      	// End workaround
      
		var show_local_dimensions = false;
		var top_node_access_id = state.Parameters.GetString('REPORT_BASE_TOP');
		for (var i=0; (i<Config.LocalDimensions.length && show_local_dimensions == false); ++i) {
			
			// If a Local Dimension without access control exists, then the page should be shown 
			if (Config.LocalDimensions[i].NodeIds == null)
				show_local_dimensions = true;
			else {
				// If there's a chance the current user may drill down to a node where a 
				// Local Dimension exists, then the page should be shown -- even if not available at the active node
				var node_ids = Config.LocalDimensions[i].NodeIds;
				for (var j=0; j<node_ids.length; ++j) {
					if (
                      HelperUtil.IsChildOf( node_ids[j], top_node_access_id, confirmit) ||
                      HelperUtil.IsChildOf( top_node_access_id, node_ids[j], confirmit)
                    )
                      show_local_dimensions = true;				
				}
			}
		}
      
      	return show_local_dimensions;
    }
  
  	static function CommentsByNode(user, state, confirmit, report){
  		//First a simple workaround in case someone iterates through VERBATIM in exports
      	//If no comment questions exist for this node then we should not show this page in exports
      	//FOR PPTs ONLY - If comment questions exist BUT comment theme doesn't - we also don't want to show this page
        if (!ExecutionMode.isWeb (state)) {
            var code = ParamUtil.GetParamCode(state, 'VERBATIM');
            if (code == '-1' )
                return false;
          
            var list = ParamLists.Get('VERBATIM', state, report, user, null, confirmit);
            if (list.length == 1 && list[0].Code == '-1')
              return false;   
          	// JV (19.1) - Comments without teams will only show online or Excel
          	if(!(ExecutionMode.isWeb (state) || ExecutionMode.isExcel (state))){
          		//Check if theme exists and if not - don't show this page in PPT or PDF
              	var q = report.DataSource.GetProject('ds0').GetQuestion(code + 'Theme');
              	if(q == null)
                  return false;
            }
        }
      
		var showComments = false;
		var top_node_access_id = state.Parameters.GetString('REPORT_BASE_TOP');
		for (var i=0; (i<Config.Comments.Questions.length && showComments == false); ++i) {
			//If a comment question without access control exists, then the page should be shown 
			if (Config.Comments.Questions[i].NodeIds == null 
                || Config.Comments.Questions[i].NodeIds == 'undefined' 
                || Config.Comments.Questions[i].NodeIds.length == 0){
				showComments = true;
          		break;
        	}
			else {
				//If there's a chance the current user may drill down to a node where a 
				//comment exists, then the page should be shown -- even if not available at the active node
				var node_ids = Config.Comments.Questions[i].NodeIds;
				for (var j=0; j<node_ids.length; ++j) {
					if (HelperUtil.IsChildOf( node_ids[j], top_node_access_id, confirmit) ||
                        HelperUtil.IsChildOf( top_node_access_id, node_ids[j], confirmit)){
                    	showComments = true;	
                      	break;
                    }
				}
			}
		}
      
      	return showComments;
    }
  	
	// JA (template 21.0) - new function below returns true if the navigator is using dynamic hiding of questions and dimensions
  	static function ShouldEEBeHiddenBasedOnHiddingOption () {
      	switch (Config.GlobalQsAndDimsSettings.GlobalHiddingOption) {
                case QsAndDimsHidingOption.HideAllUnderMinN:
                case QsAndDimsHidingOption.HideAllZeros:
                    return true;
                    
                    break;
                    
                default:
                    return false;
            }
	}
}