////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CLASS QueryManager : 57
//===================================================================================
//=================================== CONSTRUCTOR ===================================
//===================================================================================
// FUNCTION QueryManager : 97
//===================================================================================
//======= GET FUNCTIONS RETURNING A NEW QUERY MANAGER WITH A SPECIFIC CONTENT =======
//===================================================================================
// static FUNCTION GetQueryManagerMain : 130
// static FUNCTION GetQueryManagerMainBreakBy : 189
// static FUNCTION GetQueryManagerMainNSQ : 442
// static FUNCTION GetQueryManagerMainNSQBreakBy : 499
// static FUNCTION GetQueryManagerMainMX : 650
//===================================================================================
//============================== MAIN TABLE GENERATION ==============================
//===================================================================================
// FUNCTION Execute : 668
// private FUNCTION GetExpression : 675
//===================================================================================
//=============================== REMAINDER FUNCTIONS ===============================
//===================================================================================
// public static FUNCTION GetRemainderRuleCodes : 788
// public static FUNCTION ReturnReminderFilter : 863
// public static FUNCTION RunRemainderTable : 877
//===================================================================================
//====================================== UTILS ======================================
//===================================================================================
// FUNCTION AddItem : 898
// FUNCTION GetItems : 907
//===================================================================================
//=========================== CORE QUESTIONS (NO BREAKBY) ===========================
//===================================================================================
// public FUNCTION GetAllDimensions : 920
// public FUNCTION GetAllQuestions : 955
// public FUNCTION GetCoreDimensions : 1097
// public FUNCTION GetCoreQuestions : 1133
// public FUNCTION GetOneDimensionById : 1172
// public FUNCTION GetOneQuestion : 1209
//===================================================================================
//=========================== CORE QUESTIONS WITH BREAKBYS ==========================
//===================================================================================
// public FUNCTION GetCurrentDemo : 1230
// public FUNCTION GetCurrentDemoCore : 1430
//===================================================================================
//==================================== NSQ STUFF ====================================
//===================================================================================
// public FUNCTION GetAllNSQ : 1558
// public FUNCTION GetAllNSQBreakBy : 1719
// public FUNCTION RunNTable : 1864
//===================================================================================
//=================================== CUSTOM STUFF ==================================
//===================================================================================
// public FUNCTION GetAllDimensionsByColumnIndex : 2020
// private FUNCTION GetAllQuestionsByColumnIndex : 2052
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class QueryManager {
	var m_report;
	var m_state;
	var m_user;
	var m_source_table_main;
	var m_basic_q_array = [];	// Needed to take out texts and answercounts for different questions
	var m_items = [];
	var m_hashtable_items_added = {};	// Used for grids
	var m_breakByNotAllQs = false;	// Used only in case QM is broken by demo and not all questions are included
	var m_all_nsquestions = null;
	var m_all_questions = null;
	var m_breakByQMap = null;	// Replaces the standard qmap in case QM is broken by demo and not all questions are included
	var m_questions_expression = null;	// Needed for GRID questions approach
	public var m_breakby_expression;
	public var m_breakByDemoCutCount = 0;
	public var m_breakByDemoId = '';
	public var m_customBreakByFlag = false;
	private var m_segment_distribution_data = {};
	private var m_currentDemo = null;
	private var m_mask = null;
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//==================================================================================================================================
  	//=========================================================== CONSTRUCTOR ==========================================================
  	//==================================================================================================================================
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// Summary:
  	// Constructor for QueryManager object; this object is used to control how raw data is taken out of the survey
  	// and provides information (positions and offsets) as to how data are structured in MAIN/NORM tables
  	//
    // Parameter inputs:
    //   * report - the Reportal scripting report object
    //   * state - current ReportState object
    //   * breakby_expression - demographic expression that data should be broken by
  	//	 * user - current report user
    //   * source_table_main - table that should serve as a source for data taken out of the main survey
  	//	 * source_table_norm - table that should serve as a source for data taken out of the norms survey
	function QueryManager (report, state, breakby_expression, user, source_table_main) {
		m_report = report;
        m_state = state;
      	m_user = user;

        if (source_table_main == null || (source_table_main+'') == 'undefined')
			m_source_table_main = 'MAIN';
        else
			m_source_table_main = source_table_main;

      	if (breakby_expression)
	      	m_breakby_expression = breakby_expression;
	}
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
	//==================================================================================================================================
  	//=============================== GET FUNCTIONS RETURNING A NEW QUERY MANAGER WITH A SPECIFIC CONTENT ==============================
  	//==================================================================================================================================
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
    // Summary:
    // GetQueryManagerMain is used to get new QueryManager object containing all possible questions from all dimensions + ENPS question
    //
    // Parameter inputs:
    //   * report - the Reportal scripting report object
    //   * state - current ReportState object
    //   * user - current report user
    // Returns:
    //   * QueryManager object that contains all possible questions from all dimensions (including Local) + ENPS question
    //   * NO BREAKBY INCLUDED
    //
    static function GetQueryManagerMain (report, state, user) {
		var qm;
		
		// Get Query manager
		qm = new QueryManager (report, state, null, user, 'PFAULF_NEW:MAIN');
		
		// Add all questions from GridStructure to QueryManager and build the vertical expression for MAIN table
		var qMap = Config.QuestionsGridStructure;
		var exprVars = [];
		
		for (var i = 0; i < qMap.length; i++) {
			// Add this question to our m_basic_q_array so that we're able to quickly take out texts/answer scales later on
			qm.m_basic_q_array.push(qMap[i].Id);
			
			// Add questions to the queryManager so it knows
			// The structure of MAIN table
			if (qMap[i].Qs == null) {
				// Non-GRID question
				qm.AddItem (qMap[i].Id);
              	
				// Add the GRID/single question to our vertical expression that we'll use in MAIN table
				exprVars.push (qMap[i].Id + '{title:true; totals:false}');
			}
			else {
				// GRID question
				for (var j = 0; j < qMap[i].Qs.length; j++) {
					qm.AddItem (qMap[i].Qs[j]);
				}
              	
				// Add the GRID/single question to our vertical expression that we'll use in MAIN table
				exprVars.push (qMap[i].Id + '{title:false; totals:false}');
			}
		}
		
		qm.m_questions_expression = exprVars.join ('+');
		
		return qm;
	}
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
  	// Summary:
    // GetQueryManagerMainBreakBy is used to get new QueryManager object containing a selection of questions or all questions + ENPS
    // broken by a demography provided as a parameter
    // Parameter inputs:
  	//   * confirmit - confirmit facade
    //   * report - the Reportal scripting report object
    //   * state - current ReportState object
    //   * user - current report user
  	//   * qsArr - array containing IDs of questions that should be used here - if null all core questions + ENPS will be included
  	//   * demogr - ID of a demography that data should be broken by
  	//   * numberOfCuts - optional, overrides number of counts for a demo
  	//   * breakbyForce - optional, if you want to have your own breakby, not generated automatically, you can provide it here
  	//   * mask - array of demo codes that will be included in this QM
  	//   * dontApplyRemainder - if set to true the remainder will not be applied
    // Returns:
    //   * QueryManager object that contains a selection of questions or all questions + ENPS
    //   * BREAKBY DEMOGRAPHY INCLUDED
    //
  	static function GetQueryManagerMainBreakBy (confirmit, report, state, user, qsArr, demogr, numberOfCuts, breakbyForce, mask, dontApplyRemainder) {
		//=======================================================================================
		//FORCE HIDING OF ORGCODE DEMO CUTS IF SPECIFIED IN HIERARCHY FOR ORGCODE DEMO
		//FORCE HIDING OF DEMO CUTS BASED ON REMAINDER RULE
		//=======================================================================================
		var additionalMaskStart = '';
		var additionalMaskEnd = '';
		
		if (demogr == Config.Hierarchy.VariableId) {
			//=================================
			//VIOLATOR PART (ORGCODE DEMO ONLY)
			//=================================
			// Get out all children of current node
			var allChildren = DatabaseQuery.Exec (confirmit,
                                                  Config.Hierarchy.SchemaId,
                                                  Config.Hierarchy.TableName,
                                                  'id',
                                                  Config.Hierarchy.ParentRelationName,
                                                  user.PersonalizedReportBase);
			
			// Run through all children and see which ones should be supressed - could cause performance problems?
			var supressedCodes = [];
          	
			for (var i = 0; i < allChildren.length; i++) {
				var supressThisCode = DatabaseQuery.Exec (confirmit,
                                                          Config.Hierarchy.SchemaId,
                                                          Config.Hierarchy.TableName,
                                                          Config.Hierarchy.HideScoresColumnName,
                                                          'id',
                                                          allChildren[i]);
              	
				if (supressThisCode[0] == null || supressThisCode[0] == 'undefined' || supressThisCode[0] == '') {}
				else {
					supressedCodes.push (allChildren[i]);
				}
			}
			
			if (supressedCodes.length > 0) {
				var syntaxArray = [];
              	
				for (var i = 0; i < supressedCodes.length; i++) {
					var finalSyntax = 'NOT(INHIERARCHY(' + Config.Hierarchy.VariableId + ',"' + supressedCodes[i] + '"))';
					syntaxArray.push (finalSyntax);
				}
              	
				additionalMaskStart = '[SEGMENT]{label: ""; hideheader:true; expression:' + report.TableUtils.EncodeJsString (syntaxArray.join (' AND ')) + '}/(';
				additionalMaskEnd = ')';
			}
		}
		else {
			//====================================
			//REMAINDER PART (ALL BUT ORGCODE DEMO)
			//====================================
			if (dontApplyRemainder != null && typeof dontApplyRemainder != 'undefined' && dontApplyRemainder != false) {}
			else {
				var remainderRuleCodes = GetRemainderRuleCodes(report, demogr);
              	
				if (remainderRuleCodes.length > 0) {
					additionalMaskStart = '[SEGMENT]{label: ""; hideheader: true; expression:' +
                      					  report.TableUtils.EncodeJsString ('NOT(IN(' + demogr + ',"' + remainderRuleCodes.join ('","') + '"))') + '}/(';
					additionalMaskEnd = ')';
				}
			}
		}
		//=======================================================================================
		//END OF FORCE HIDING OF ORGCODE DEMO CUTS IF SPECIFIED IN HIERARCHY FOR ORGCODE DEMO
		//END OF FORCE HIDING OF DEMO CUTS BASED ON REMAINDER RULE
		//=======================================================================================
		
		var qm;
		
		// Create the breakby expression based on demogr parameter
		var breakby;
		var demoCutCount = 0;
		var selected_vu = ParamUtil.Selected (report, state, 'VU_ACTIVE', user);
		var label = (selected_vu != null) ? selected_vu.Label :  user.PersonalizedReportBaseText;
		
		if (demogr == Config.Hierarchy.VariableId) {
			var levelDowns = DatabaseQuery.Exec (confirmit,
                                                 Config.Hierarchy.SchemaId,
                                                 Config.Hierarchy.TableName,
                                                 'id',
                                                 Config.Hierarchy.ParentRelationName,
                                                 user.PersonalizedReportBase);
			demoCutCount = levelDowns.length + 1;
			breakby = '[SEGMENT]{label:' + report.TableUtils.EncodeJsString (label)  + '} + ' +
              		  additionalMaskStart + demogr + '{self:true; children:1; totals:false}' + additionalMaskEnd;
		}
		else {
			demoCutCount = report.DataSource.GetProject ('ds0').GetQuestion (demogr).AnswerCount;
			breakby = '[SEGMENT]{label:' + report.TableUtils.EncodeJsString (label)  + '} + ' + additionalMaskStart + demogr +
              		  '{title:true; totals:false}' + additionalMaskEnd;
		}
		
		// Check for demo cut count override
		if (numberOfCuts != null)
			demoCutCount = numberOfCuts;
		
		// Check for breakby override
		if (breakbyForce != null)
			breakby = '[SEGMENT]{label:' + report.TableUtils.EncodeJsString (label) + '} + ' + additionalMaskStart + breakbyForce + additionalMaskEnd;
		
		// Get Query manager
		qm = new QueryManager (report, state, breakby, user, 'MAIN');
		qm.m_breakByDemoId = demogr;
		qm.m_breakByDemoCutCount = demoCutCount;
		
		if (breakbyForce != null)
			qm.m_customBreakByFlag = true;
		
		if (mask != null && typeof mask != 'undefined') {
			qm.m_mask = mask;
		}
		
		if (qsArr == null) {
			// Add all questions from GridStructure to QueryManager and build the vertical expression for MAIN table
			// Prepare a GRID map
			var qMap = Config.QuestionsGridStructure;
			
			// Add mask arrays to each GRID
			// Add Used property to all questions in our map
			for (var i = 0; i < qMap.length; i++) {
				if (qMap[i].Qs != null) {
					qMap[i].Mask = [];
					qMap[i].QsUsed = [];
                  	
					for (var j = 0; j < qMap[i].Qs.length; j++) {
						qMap[i].QsUsed.push (true);
					}
				}
              	
				qMap[i].Used = true;
			}
			
			var exprVars = [];
			
			for (var i = 0; i < qMap.length; i++) {
				// Add this question to our m_basic_q_array so that we're able to quickly take out texts/answer scales later on
				qm.m_basic_q_array.push (qMap[i].Id);
				
				// Add questions to the queryManager so it knows
				// The structure of MAIN table
				if (qMap[i].Qs == null) {
					// Non-GRID question
					qm.AddItem (qMap[i].Id);
                  	
					// Add the GRID/single question to our vertical expression that we'll use in MAIN table
					exprVars.push (qMap[i].Id + '{title:true; totals:false}');
				}
				else {
					// GRID question
					for (var j = 0; j < qMap[i].Qs.length; j++) {
						qm.AddItem (qMap[i].Qs[j]);
					}
                  	
					// Add the GRID/single question to our vertical expression that we'll use in MAIN table
					exprVars.push (qMap[i].Id + '{title:false; totals:false}');
				}
			}
          	
			qm.m_breakByQMap = qMap;
			qm.m_questions_expression = exprVars.join ('+');
		}
		else {
			qm.m_breakByNotAllQs = true;
			
			// Prepare a GRID map
			var qMap = Config.QuestionsGridStructure;
			
			// Add mask arrays to each GRID
			// Add Used property to all questions in our map
			for (var i = 0; i < qMap.length; i++) {
				if (qMap[i].Qs != null) {
					qMap[i].Mask = [];
					qMap[i].QsUsed = [];
                  	
					for(var j = 0; j < qMap[i].Qs.length; j++) {
						qMap[i].QsUsed.push (false);
					}
				}
              	
				qMap[i].Used = false;
			}
			
			for (var i = 0; i < qsArr.length; i++) {
				// Find each question in the GRID mapping, and indicate in GRIDs array the GRID it falls to
				var q = qsArr[i];
				
				// Try finding it in the GRID mapping
				for (var j = 0; j < qMap.length; j++) {
					if (qMap[j].Qs != null) {
						for (var k = 0; k < qMap[j].Qs.length; k++) {
							if (qMap[j].Qs[k] == q) {
								qMap[j].Used = true;
								qMap[j].QsUsed[k] = true;
								qMap[j].Mask.push(q);
                              	
								break;
							}
						}
					}
					else if (qMap[j].Id == q) {
						qMap[j].Used = true;
					}
				}
			}
			
			// Finally separate GRIDs from additional questions,
			// Build the Q expression, add everything to items, etc.
			var exprVars = [];
          	
			for (var i = 0; i < qMap.length; i++) {
				if (qMap[i].Used) {
					if (qMap[i].Qs != null) {
						// GRID question
						for (var j = 0; j < qMap[i].Qs.length; j++) {
							if (qMap[i].QsUsed[j]) {
								qm.AddItem (qMap[i].Qs[j]);
							}
						}
                      	
						// Add the GRID/single question to our vertical expression that we'll use in MAIN table
						exprVars.push(qMap[i].Id + '{title:false; totals:false; mask:' + qMap[i].Mask.join(',') + '}');
					}
					else {
						// Non-GRID question
						qm.AddItem (qMap[i].Id);
                      	
						// Add the GRID/single question to our vertical expression that we'll use in MAIN table
						exprVars.push (qMap[i].Id + '{title:true; totals:false}');
					}
				}
			}
          	
			qm.m_breakByQMap = qMap;
			qm.m_questions_expression = exprVars.join ('+');
		}
      	
		return qm;
	}
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
  	// Summary:
    // GetQueryManagerMainNSQ is used to get new QueryManager object containing a specific NSQ question
    //
    // Parameter inputs:
    //   * report - the Reportal scripting report object
    //   * state - current ReportState object
    //   * user - current report user
    // Returns:
    //   * QueryManager object that contains NSQ questions
    //   * NO BREAKBY INCLUDED
	static function GetQueryManagerMainNSQ (report, state, user, qid) {
		var qm;
		
		// Get Query manager
		qm = new QueryManager (report, state, null, user, 'MAIN');
		
		// Add the appropriate NSQ to QueryManager and build the vertical expression for MAIN table
		var qMap = [qid];
		var exprVars = [];
		var project = report.DataSource.GetProject ('ds0');

		for (var i = 0; i < qMap.length; i++) {
			// Add this question to our m_basic_q_array so that we're able to quickly take out texts/answer scales later on
			qm.m_basic_q_array.push (qMap[i]);
			
			// Non-GRID question
			qm.AddItem(qMap[i]);
			
			var question : Question = project.GetQuestion (qMap[i]);
			
			// Add the GRID/single question to our vertical expression that we'll use in MAIN table
			switch (question.QuestionType) {
				case QuestionType.Multi:
				case QuestionType.MultiNumeric:
				case QuestionType.MultiOrdered:
					exprVars.push (qMap[i] + '{title:true; totals:false; collapsed:true}');
                	
					break;
                
				default:
					exprVars.push (qMap[i] + '{title:true; totals:false}');
                	
					break;
			}
		}
		
		qm.m_questions_expression = exprVars.join ('+');
		
		return qm;
	}
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
  	// Summary:
    // GetQueryManagerMainNSQBreakBy is used to get new QueryManager object containing a specific NSQ question with a breakby demographic
    //
    // Parameter inputs:
    //   * report - the Reportal scripting report object
    //   * state - current ReportState object
    //   * user - current report user
  	//   * demogr - ID of a demography that data should be broken by
  	//   * numberOfCuts - optional, overrides number of counts for a demo
  	//   * breakbyForce - optional, if you want to have your own breakby, not generated automatically, you can provide it here
  	//   * mask - array of demo codes that will be included in this QM
    // Returns:
    //   * QueryManager object that contains NSQ questions
    //   * BREAKBY INCLUDED
  	static function GetQueryManagerMainNSQBreakBy (confirmit, report, state, user, qid, demogr, numberOfCuts, breakbyForce, mask) {
		//=======================================================================================
		//FORCE HIDING OF ORGCODE DEMO CUTS IF SPECIFIED IN HIERARCHY FOR ORGCODE DEMO
		//=======================================================================================
		var additionalMaskStart = '';
		var additionalMaskEnd = '';
      	
		if (demogr == Config.Hierarchy.VariableId) {
			// Get out all children of current node
			var allChildren = DatabaseQuery.Exec (confirmit,
                                                  Config.Hierarchy.SchemaId,
                                                  Config.Hierarchy.TableName,
                                                  'id',
                                                  Config.Hierarchy.ParentRelationName,
                                                  user.PersonalizedReportBase);
			
			// Run through all children and see which ones should be supressed - could cause performance problems?
			var supressedCodes = [];
          	
			for (var i = 0; i < allChildren.length; i++) {
				var supressThisCode = DatabaseQuery.Exec (confirmit,
                                                          Config.Hierarchy.SchemaId,
                                                          Config.Hierarchy.TableName,
                                                          Config.Hierarchy.HideScoresColumnName,
                                                          'id',
                                                          allChildren[i]);
              	
				if (supressThisCode[0] == null || supressThisCode[0] == 'undefined' || supressThisCode[0] == '') {}
				else {
					supressedCodes.push (allChildren[i]);
				}
			}
			
			if (supressedCodes.length > 0) {
				var syntaxArray = [];
              	
				for (var i = 0; i < supressedCodes.length; i++) {
					var finalSyntax = 'NOT(INHIERARCHY(' + Config.Hierarchy.VariableId + ',"' + supressedCodes[i] + '"))';
					syntaxArray.push (finalSyntax);
				}
              	
				additionalMaskStart = '[SEGMENT]{label: ""; hideheader:true; expression:' + report.TableUtils.EncodeJsString (syntaxArray.join (' AND ')) + '}/(';
				additionalMaskEnd = ')';
			}
		}
		else {
			var remainderRuleCodes = GetRemainderRuleCodes (report, demogr);
          	
			if (remainderRuleCodes.length > 0) {
				additionalMaskStart = '[SEGMENT]{label: ""; hideheader: true; expression:' +
                  					  report.TableUtils.EncodeJsString('NOT(IN(' + demogr + ',"' + remainderRuleCodes.join('","') + '"))') + '}/(';
				additionalMaskEnd = ')';
			}
		}
		//=======================================================================================
		//END OF FORCE HIDING OF ORGCODE DEMO CUTS IF SPECIFIED IN HIERARCHY FOR ORGCODE DEMO
		//=======================================================================================
		
		var qm;
		
		// Create the breakby expression based on demogr parameter
		var breakby;
		var demoCutCount = 0;
		var selected_vu = ParamUtil.Selected(report, state, 'VU_ACTIVE', user);
		var label = (selected_vu != null) ? selected_vu.Label :  user.PersonalizedReportBaseText;
		
		if (demogr == Config.Hierarchy.VariableId) {
			var levelDowns = DatabaseQuery.Exec (confirmit,
                                                 Config.Hierarchy.SchemaId,
                                                 Config.Hierarchy.TableName,
                                                 'id',
                                                 Config.Hierarchy.ParentRelationName,
                                                 user.PersonalizedReportBase);
			demoCutCount = levelDowns.length + 1;
			breakby = '[SEGMENT]{label:' + report.TableUtils.EncodeJsString(label)  + '} + ' +
              		  additionalMaskStart + demogr + '{self:true; children:1; totals:false}' + additionalMaskEnd;
		}
		else {
			demoCutCount = report.DataSource.GetProject('ds0').GetQuestion(demogr).AnswerCount;
			breakby = '[SEGMENT]{label:' + report.TableUtils.EncodeJsString(label)  + '} + ' + additionalMaskStart + demogr + '{title:true; totals:false}' + additionalMaskEnd;
		}
		
		// Check for demo cut count override
		if (numberOfCuts != null)
			demoCutCount = numberOfCuts;
		
		// Check for breakby override
		if (breakbyForce != null)
			breakby = '[SEGMENT]{label:' + report.TableUtils.EncodeJsString(label) + '} + ' + additionalMaskStart + breakbyForce + additionalMaskEnd;
		
		// Get Query manager
		qm = new QueryManager (report, state, breakby, user, 'MAIN');
		qm.m_breakByDemoId = demogr;
		qm.m_breakByDemoCutCount = demoCutCount;
		
		if (breakbyForce != null)
			qm.m_customBreakByFlag = true;
		
		if (mask != null && typeof mask != 'undefined') {
			qm.m_mask = mask;
		}
		
		// Add the appropriate NSQ to QueryManager and build the vertical expression for MAIN table
		var qMap = [qid];
		var exprVars = [];
		var project = report.DataSource.GetProject ('ds0');
		
		for (var i = 0; i < qMap.length; i++) {
			// Add this question to our m_basic_q_array so that we're able to quickly take out texts/answer scales later on
			qm.m_basic_q_array.push (qMap[i]);
			
			// Non-GRID question
			qm.AddItem (qMap[i]);
			
			var question : Question = project.GetQuestion (qMap[i]);
			
			// Add the GRID/single question to our vertical expression that we'll use in MAIN table
			switch (question.QuestionType) {
				case QuestionType.Multi:
				case QuestionType.MultiNumeric:
				case QuestionType.MultiOrdered:
					exprVars.push (qMap[i] + '{title:true; totals:false; collapsed:true}');
                	
					break;
                
				default:
					exprVars.push (qMap[i] + '{title:true; totals:false}');
                	
					break;
			}
		}
		
		qm.m_questions_expression = exprVars.join ('+');
		qm.m_breakByQMap = qMap;
      	
		return qm;
	}
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
    // Summary:
    // GetQueryManagerMainMX is used to get new QueryManager object containing all possible questions from all dimensions + ENPS question
    //
    // Parameter inputs:
    //   * report - the Reportal scripting report object
    //   * state - current ReportState object
    //   * user - current report user
    // Returns:
    //   * QueryManager object that contains all possible questions from all dimensions (including Local) + ENPS question
    //   * NO BREAKBY INCLUDED
    //
	static function GetQueryManagerMainMX (report, state, user) {
		var qm;
		
		qm = QueryManager.GetQueryManagerMain (report, state, user);
		
		qm.m_source_table_main = 'MAIN';
		
		return qm;
	}
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
  	//==================================================================================================================================
  	//===================================================== MAIN TABLE GENERATION ======================================================
  	//==================================================================================================================================
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
	function Execute (table, ds_id, force, confirmit) {
		table.AddHeaders (m_report, ds_id, GetExpression (force, confirmit));
		table.Caching.CacheKey = HelperUtil.CacheKey (m_state, m_user);
	}
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
  	private function GetExpression (force, confirmit) {
		var comparators_map = ComparatorUtil.ProcessedComparatorsMap (m_report, m_state, m_user);
		
		// Force Internal 1 and Trend 1 in order to properly show widgets on the Dashboard
		comparators_map[Comparators.TotalCompany].Hidden = false;
		comparators_map[Comparators.Prev].Hidden = false;
		
		//------------------------------------------------------------------------------------------------------------------------------
		// For each of internal comparators - check if should be hidden based on hierarchy setting
		// Internal 1
		var supressedValue = DatabaseQuery.ExecQuery (confirmit,
                                                      Config.Hierarchy.SchemaId,
                                                      Config.Hierarchy.TableName,
                                                      Config.Hierarchy.HideScoresColumnName,
                                                      'id',
                                                      comparators_map[Comparators.TotalCompany].Id);
      	
		if (supressedValue[0] == null || supressedValue[0] == 'undefined' || supressedValue[0] == '') {}
		else
			comparators_map[Comparators.TotalCompany].Hidden = true;
		
		// Internal 2
		supressedValue = DatabaseQuery.ExecQuery (confirmit,
                                                  Config.Hierarchy.SchemaId,
                                                  Config.Hierarchy.TableName,
                                                  Config.Hierarchy.HideScoresColumnName,
                                                  'id',
                                                  comparators_map[Comparators.LevelUp].Id);
      	
		if (supressedValue[0] == null || supressedValue[0] == 'undefined' || supressedValue[0] == '') {}
		else
			comparators_map[Comparators.LevelUp].Hidden = true;
		
		// Internal 3
		supressedValue = DatabaseQuery.ExecQuery (confirmit,
                                                  Config.Hierarchy.SchemaId,
                                                  Config.Hierarchy.TableName,
                                                  Config.Hierarchy.HideScoresColumnName,
                                                  'id',
                                                  comparators_map[Comparators.Level2].Id);
      	
		if (supressedValue[0] == null || supressedValue[0] == 'undefined' || supressedValue[0] == '') {}
		else
			comparators_map[Comparators.Level2].Hidden = true;
		
		// Internal 4
		supressedValue = DatabaseQuery.ExecQuery (confirmit,
                                                  Config.Hierarchy.SchemaId,
                                                  Config.Hierarchy.TableName,
                                                  Config.Hierarchy.HideScoresColumnName,
                                                  'id',
                                                  comparators_map[Comparators.Custom1].Id);
      	
		if (supressedValue[0] == null || supressedValue[0] == 'undefined' || supressedValue[0] == '') {}
		else
			comparators_map[Comparators.Custom1].Hidden = true;
		
		// Internal 5
		supressedValue = DatabaseQuery.ExecQuery (confirmit,
                                                  Config.Hierarchy.SchemaId,
                                                  Config.Hierarchy.TableName,
                                                  Config.Hierarchy.HideScoresColumnName,
                                                  'id',
                                                  comparators_map[Comparators.Custom2].Id);
      	
		if (supressedValue[0] == null || supressedValue[0] == 'undefined' || supressedValue[0] == '') {}
		else
			comparators_map[Comparators.Custom2].Hidden = true;
		// End of hierarchy settings check
		//------------------------------------------------------------------------------------------------------------------------------
		
		var X = [], Y = [];
		
		if (!m_questions_expression) {
			throw ("You did not set up your m_question_expression based on grids. Check your setup");
		}
		else {
			Y.push ('(' + m_questions_expression + ')');
		}
		
		var current = Wave.Current (m_report,
                                    m_user,
                                    m_state,
                                    comparators_map,
                                    null,	// TOTAL_COMPANY_FORCE,
                                    false);
		
		// Your results
		X.push ( (m_breakby_expression == null) ? (current + '/[N]') : (current + '/[N]{hideheader:true}/(' + m_breakby_expression + ')') );
		
		// Last Years' results
		var previous = Wave.Previous (m_state, m_report, m_user, false, comparators_map[Comparators.Prev].Hidden);
		var previous2 = Wave.Previous2 (m_state, m_report, m_user, false, comparators_map[Comparators.Prev2].Hidden);
		var previous3 = Wave.Previous3 (m_state, m_report, m_user, false, comparators_map[Comparators.Prev3].Hidden);
		
		var waves = [previous, previous2, previous3];
		
		for (var i = 0; i < waves.length; ++i)
			X.push ( (m_breakby_expression == null) ? (waves[i] + '/[N]') : (waves[i] + '/[N]{hideheader:true}/(' + m_breakby_expression + ')') );
		
		var expr = [Y.join ('+'), X.join ('+')].join ('^');
		
		return expr;
	}
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
  	//==================================================================================================================================
  	//====================================================== REMAINDER FUNCTIONS =======================================================
  	//==================================================================================================================================
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	public static function GetRemainderRuleCodes (report, breakByVariable) {
		// Get scores from REMAINDER table
		var scores = report.TableUtils.GetColumnValues ('REMAINDER', 1);
		
		// Match them with cuts from the demography
		var allCuts = [];
		var demoCuts = report.DataSource.GetProject ('ds0').GetQuestion (breakByVariable).GetAnswers ();
      	
		for (var i = 0; i < demoCuts.length; i++) {
			allCuts.push ({code: demoCuts[i].Precode, N:scores[i].Value, remainderApplied: false, positionInQuestion: i});
		}
		
		// Figure out the total N of all cuts under minimum N + the not-coded cut
		var remainderValidN = scores[scores.length - 1].Value;	// Start out with the not-coded cut
		var isAtLeastOneCutBelowMinN = false;
      	
		for (var i = 0; i < allCuts.length; i++) {
			if (allCuts[i].N < Config.Privacy.Table.MinN) {
				remainderValidN = remainderValidN + allCuts[i].N;
				isAtLeastOneCutBelowMinN = true;
			}
		}
		
		// Sort by N number (code used as a tiebreaker)
		allCuts.sort (function (a,b) {
			if (a.N == b.N) {
				if (Config.Privacy.RemainderRuleTieHideLast) {
					if (parseInt (a.positionInQuestion) > parseInt (b.positionInQuestion)) return -1;
					if (parseInt (a.positionInQuestion) < parseInt (b.positionInQuestion)) return 1;
				}
				else {
					if (parseInt (a.positionInQuestion) > parseInt (b.positionInQuestion)) return 1;
					if (parseInt (a.positionInQuestion) < parseInt (b.positionInQuestion)) return -1;
				}
			}
			else {
				if (a.N > b.N) return 1;
				if (a.N < b.N) return -1;
			}
          	
			// Any other case
			return 0;
		});
		
		// If we are not above remainder N - suppress the next cut - do this until we're >= RemainderRuleN
		var returnCodes = [];
		var noCutsRemaining = false;
      	
		while (remainderValidN < Config.Privacy.RemainderRule.MinN && !noCutsRemaining && isAtLeastOneCutBelowMinN) {
			//RuntimeLog.Log(remainderValidN);
          	
			// Take the next cut above minimum N and suppress it
			var foundAtLeastOneCut = false;
			
			for (var i = 0; i < allCuts.length; i++) {
				if (allCuts[i].N >= Config.Privacy.Table.MinN && allCuts[i].remainderApplied == false) {
					allCuts[i].remainderApplied = true;
					remainderValidN = remainderValidN + allCuts[i].N;
					returnCodes.push(allCuts[i].code);
					foundAtLeastOneCut = true;
                  	
					break;
				}
			}
			
			noCutsRemaining = !foundAtLeastOneCut;
		}
		
		// If we are above remainder N - return the array of codes that should get suppressed
		// Note we don't include codes that are under minimum N as it's simply not necessary
		return returnCodes;
	}
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	public static function ReturnReminderFilter (report, demogr) {
		var remainderRuleCodes = GetRemainderRuleCodes (report, demogr);
		var additionalMask = '';
      	
		if (remainderRuleCodes.length > 0) {
			additionalMask = '[SEGMENT]{label: ""; hideheader: true; expression:' +
              				  report.TableUtils.EncodeJsString ('NOT(IN(' + demogr + ',"' + remainderRuleCodes.join ('","') + '"))') + '}';
		}
		
		return additionalMask;
	}
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	public static function RunRemainderTable (breakByVariable, table, report) {
		// If the breakByVariable is Orgcode just run a dummy content table as we don't use reminder on Orgcode variable
		if (breakByVariable == Config.Hierarchy.VariableId) {
			table.AddHeaders (report, 'ds0', '[CONTENT] ^ [CONTENT]');
		}
		else {
			table.AddHeaders (report, 'ds0', breakByVariable + '{total:false} + [SEGMENT]{label: "NOT CODED"; expression:' +
                              report.TableUtils.EncodeJsString ('ISNULL(' + breakByVariable  + ')') + '} ^ [N]');
		}
		
		table.Caching.Enabled = false;
	}
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//==================================================================================================================================
	//============================================================= UTILS ==============================================================
	//==================================================================================================================================
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
	function AddItem (item_id) {
		if (m_hashtable_items_added[item_id] == null) {
			m_hashtable_items_added[item_id] = '1';
			m_items.push ({Id: item_id});
		};
	}
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function GetItems () {
		return m_items;
	}
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//==================================================================================================================================
	//================================================== CORE QUESTIONS (NO BREAKBY) ===================================================
	//==================================================================================================================================
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
	// Returns all dimensions - local and core
	public function GetAllDimensions () {
		var qs = GetAllQuestions ();
		var qmap = {};
		
		// Set our qmap (needed because we sometimes include one question in multiple dimensions)
		for (var i = 0; i < qs.length; i++) {
			qmap[qs[i].GetId ()] = qs[i];
		}
		
		// Create dimensions
		var dimensionLabels = ResourceText.List (m_report, 'dimensions');
		var dimensionsArray = [];
		var dimsConf = Config.Dimensions.concat (Config.LocalDimensions);
      	
		for (var i = 0; i < dimsConf.length; i++) {
			var qs = [];
          	
			for (var j = 0; j < dimsConf[i].Questions.length; j++) {
				var qid = dimsConf[i].Questions[j];
              	
				if (qmap[qid] == null)
					throw ("Couldn't find question: " + qid + ". Check your GRID mapping in config.");
              	
				qs.push (qmap[qid]);
			}
          	
			dimensionsArray.push (new HgDimension (dimsConf[i].Id, dimensionLabels[dimsConf[i].Id], qs));
		}

		return dimensionsArray;
	}
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
  	// Returns all questions in an array (including ENPS + Local ones)
	public function GetAllQuestions () {
		if (m_all_questions == null) {
			var questions = [];
			var qIds = [];
			var offset = 0;
			
			// Get KDAs (needed for questions to calculate S&O)
			var KDAs = KDA.GetMapByNodeId (m_user.PersonalizedReportBase, m_state);
			
			// Push all questions and scores for report level into questions array
			// Include distribution and text in the first run, no comparators
			var scores = m_report.TableUtils.GetColumnValues (m_source_table_main, 1);
			var items = GetItems();
			
			// Prepare question texts and answer counts
			var qTextsFromTable = m_report.TableUtils.GetRowHeaderCategoryTitles (m_source_table_main);
			var answerCounts = [];
			var texts = [];
			var qMap = Config.QuestionsGridStructure;
			var answerOffset = 0;
          	
			for (var i = 0; i < qMap.length; i++) {
				if (qMap[i].Qs == null) {
					//Non GRID question
					//Add text
					texts.push (qTextsFromTable[answerOffset][1]);
                  	
					//Add answer count
					answerCounts.push (qMap[i].NumberOfAnswers);
					answerOffset = answerOffset + qMap[i].NumberOfAnswers;
				}
				else {
					// GRID question
					for (var j = 0; j < qMap[i].Qs.length; j++) {
						//Add text
						texts.push (qTextsFromTable[answerOffset][1]);
						
						//Add answer count
						answerCounts.push (qMap[i].NumberOfAnswers);
						answerOffset = answerOffset + qMap[i].NumberOfAnswers;
					}
				}
			}
			
			// Report level
			for (var i = 0; i < items.length; i++) {
				//Get the basic info - question text, id, etc.
				var qid = items[i].Id;
				
				// Add the id to qIds array - we'll need that later on for norms
				// Note this qId array contains NORMCODES (takes norms override into account)
				if (Config.Maps.QuestionIdToNormVariableId[qid] != null)
					qIds.push (Config.Maps.QuestionIdToNormVariableId[qid]);
				else
					qIds.push (qid);
				
				var text = texts[i];
				var answerC = answerCounts[i];
				
				// Get counts for all answers
				var distribution = [];
				
				for (var j = 0; j < answerC; j++) {
					distribution.push (scores[offset + j].Value);
				}
              	
				offset += answerC;
				
				// Create the question and set the KDA flag
				var newQ : HgQuestion = new HgQuestion (qid, m_report, text, distribution);
              	
				if(KDAs[qid] == "1")
					newQ.SetKDA ();
				
				// Add a new question object to our questions array
				questions.push (newQ);
			}
			
			// Set all internal comparators
			for (var k = 1; k < TableContent.MAIN_SEGMENT_COUNT; k++) {
				offset = 0;
				
				// Take out scores
				var sc = m_report.TableUtils.GetColumnValues (m_source_table_main, k+1);
				
				// Add that to our m_segment_distribution_data associative array
				m_segment_distribution_data[k] = sc;
				
				for (var i = 0; i < items.length; i++) {
					// Get the basic info - question text, id, etc.
					var qid2 = items[i].Id;
					var answerC2 = answerCounts[i];
					
					// Get counts for all answers
					var distribution2 = [];
                  	
					for (var j = 0; j < answerC2; j++) {
						distribution2.push (sc[offset + j].Value);
					}
                  	
					offset += answerC2;
					
					// Add a new question object to our questions array
					questions[i].AddInternalComp (distribution2);
				}
			}
			
			// Set all external comparators
			// Get all norms
			var normsManager = new NormsDataManager (m_user);
			var normsData = [];
          	
			for (var i = 0; i < Config.Norms.Codes.length; i++) {
				var normId = NormUtil.GetNormId (m_user, i);
				normsData.push (normsManager.GetNormForQuestions (normId, qIds, m_state, m_report));
			}
			
			// Set norms for every question
			for (var i = 0; i < questions.length; i++) {
				for (var j = 0; j < normsData.length; j++) {
					if (normsData[j]) {
						questions[i].AddNorm (normsData[j][i*2], normsData[j][1+i*2]);
					}
					else {
						questions[i].AddNorm (null, null);
					}
				}
			}
			
			m_all_questions = questions;
          	
			// Return our questions array
			return questions;
		}
		else {
			return m_all_questions;
		}
	}
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// Returns all core dimensions
	public function GetCoreDimensions () {
		var qs = GetAllQuestions ();
		var qmap = {};
		
		// Set our qmap (needed because we sometimes include one question in multiple dimensions)
		for (var i = 0; i < qs.length; i++) {
			qmap[qs[i].GetId ()] = qs[i];
		}
		
		// Create dimensions
		var dimensionLabels = ResourceText.List (m_report, 'dimensions');
		var dimensionsArray = [];
		var dimsConf = Config.Dimensions;
      	
		for (var i = 0; i < dimsConf.length; i++) {
			var qs = [];
          	
			for (var j = 0; j < dimsConf[i].Questions.length; j++) {
				var qid = dimsConf[i].Questions[j];
              	
				if (qmap[qid] == null)
					throw ("Couldn't find question: " + qid + ". Check your GRID mapping in config.");
              	
				qs.push (qmap[qid]);
			}
          	
			dimensionsArray.push (new HgDimension(dimsConf[i].Id, dimensionLabels[dimsConf[i].Id], qs));
		}
		
		return dimensionsArray;
	}
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// Returns an array containing only questions that are a part of core dimension
	// It's crucial this returns a simple array
	public function GetCoreQuestions () {
		var qs = GetAllQuestions ();
		var qmap = {};
		
		// Set our qmap (needed because we sometimes include one question in multiple dimensions)
		for (var i = 0; i < qs.length; i++) {
			qmap[qs[i].GetId ()] = qs[i];
		}
		
		// Go through dims and pick only questions that are needed
		var dimsConf = Config.Dimensions;
		var qFromDims = {};
      	
		for (var i = 0; i < dimsConf.length; i++) {
			for (var j = 0; j < dimsConf[i].Questions.length; j++) {
				var qid = dimsConf[i].Questions[j];
              	
				if (qmap[qid] == null)
					throw ("Couldn't find question: " + qid + ". Check your GRID mapping in config.");
              	
				if (qFromDims[qid] == null)
					qFromDims[qid] = qmap[qid];
			}
		}
		
		// Throw those into a normal array now
		var returnArr = [];
      	
		for (var key in qFromDims) {
			returnArr.push (qFromDims[key]);
		}
		
		return returnArr;
	}
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// Returns one dimension based on ID provided
	// Can return both core and local ones; returns a HgDimension object
	public function GetOneDimensionById (dimId : String) {
		var qs = GetAllQuestions ();
		var qmap = {};
		
		// Set our qmap (needed because we sometimes include one question in multiple dimensions)
		for (var i = 0; i < qs.length; i++) {
			qmap[qs[i].GetId ()] = qs[i];
		}
		
		// Find the dimension we want and create a HgDimension object
		var dimensionLabels = ResourceText.List (m_report, 'dimensions');
		var dimsConf = Config.Dimensions.concat (Config.LocalDimensions);
		var ourDim = null;
      	
		for (var i = 0; i < dimsConf.length; i++) {
			if (dimsConf[i].Id == dimId) {
				var qs = [];
				
				for (var j = 0; j < dimsConf[i].Questions.length; j++) {
					var qid = dimsConf[i].Questions[j];
                  	
					if (qmap[qid] == null)
						throw ("Couldn't find question: " + qid + ". Check your GRID mapping in config.");
                  	
					qs.push (qmap[qid]);
				}
              	
				ourDim = new HgDimension (dimsConf[i].Id, dimensionLabels[dimsConf[i].Id], qs);
			}
		}
		
		return ourDim;
	}
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// Returns one question
	public function GetOneQuestion (qid : String) {
		var qs = GetAllQuestions ();
      	
		for (var i = 0; i < qs.length; i++) {
			if(qs[i].GetId () == qid)
				return qs[i];
		}
		
		// Question not found
		throw ('Question: ' + qid + ' was not found. Source: QueryManager.GetOneQuestion()');
	}
  	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
  	//==================================================================================================================================
  	//================================================= CORE QUESTIONS WITH BREAKBYS ===================================================
  	//==================================================================================================================================
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
	// Returns whole demography
	public function GetCurrentDemo () {
		if (m_currentDemo == null) {
			// Get KDAs (needed for questions to calculate S&O
			var KDAs = KDA.GetMapByNodeId (m_user.PersonalizedReportBase, m_state);
			
			var items = GetItems ();
			
			// Prepare question texts and answer counts
			var qTextsFromTable = m_report.TableUtils.GetRowHeaderCategoryTitles (m_source_table_main);
			var answerCounts = [];
			var texts = [];
			var qMap = m_breakByQMap;
			var answerOffset = 0;
          	
			for (var i = 0; i < qMap.length; i++) {
				if (qMap[i].Used) {
					if (qMap[i].Qs == null) {
						// Non GRID question
						// Add text
						texts.push (qTextsFromTable[answerOffset][1]);
                      	
						// Add answer count
						answerCounts.push (qMap[i].NumberOfAnswers);
						answerOffset = answerOffset + qMap[i].NumberOfAnswers;
					}
					else {
						// GRID question
						for (var j = 0; j < qMap[i].Qs.length; j++) {
							if (qMap[i].QsUsed[j]) {
								// Add text
								texts.push (qTextsFromTable[answerOffset][1]);
                              	
								// Add answer count
								answerCounts.push (qMap[i].NumberOfAnswers);
								answerOffset = answerOffset + qMap[i].NumberOfAnswers;
							}
						}
					}
				}
			}
			
			// Iterate through all demo columns and prepare demogrphic cuts objects
			var overallCut : HgDemographyCut = null;
			var demoCuts = [];
			var precodes = [];
			
			// Prepare precodes and labels first
			if (m_breakByDemoId == Config.Hierarchy.VariableId) {
				precodes.push ('overall');
              	
				for (var i=0; i < m_breakByDemoCutCount; i++) {
					precodes.push ('orgcode');
				}
			}
			else {
				var allAnswers = m_report.DataSource.GetProject ('ds0').GetQuestion (m_breakByDemoId).GetAnswers ();
				precodes.push ('overall');
              	
				if (m_mask == null) {
					for (var i = 0; i < allAnswers.length; i++) {
						precodes.push (allAnswers[i].Precode);
					}
				}
				else {
					precodes = precodes.concat (m_mask);
				}
			}
          	
			var allColumnLabels = m_report.TableUtils.GetColumnHeaderCategoryTitles (m_source_table_main);
			
			for (var o = 0; o < m_breakByDemoCutCount+1; o++) {
				// Iterate through all of the demo cuts - we ignore cut with index 1 in case of Orgcode execution due to various reasons
				// but only in a case of standard demo execution - if a custom one is provided then we don't really know what's there so
				// we don't ignore anything
				if (m_breakByDemoId == Config.Hierarchy.VariableId && o == 1 && m_customBreakByFlag == false) {}
				else {
					var questions = [];
					var qIds = [];
					var offset = 0;
					
					// Push all questions and scores for report level into questions array
					// Include distribution and text in the first run, no comparators
					var columnNumber = o + 1;
					var scores = m_report.TableUtils.GetColumnValues (m_source_table_main, columnNumber);
					
					// Report level
					for (var i = 0; i < items.length; i++) {
						// Get the basic info - question text, id, etc.
						var qid = items[i].Id;
						
						// Add the id to qIds array - we'll need that later on for norms
						// Note this qId array contains NORMCODES (takes norms override into account)
						if (Config.Maps.QuestionIdToNormVariableId[qid] != null)
							qIds.push (Config.Maps.QuestionIdToNormVariableId[qid]);
						else
							qIds.push (qid);
						
						var text = texts[i];
						var answerC = answerCounts[i];
						
						// Get counts for all answers
						var distribution = [];
                      	
						for (var j = 0; j < answerC; j++) {
							distribution.push (scores[offset + j].Value);
						}
                      	
						offset += answerC;
						
						// Create the question and set the KDA flag
						var newQ : HgQuestion = new HgQuestion (qid, m_report, text, distribution);
                      	
						if (KDAs[qid] == "1")
							newQ.SetKDA ();
						
						// Add a new question object to our questions array
						questions.push (newQ);
					}
					
					// Set all internal comparators
					for (var k = 1; k < TableContent.MAIN_SEGMENT_COUNT; k++) {
						offset = 0;
						var sc = m_report.TableUtils.GetColumnValues (m_source_table_main, (k * (m_breakByDemoCutCount+1)) + columnNumber);
                      	
						for (var i = 0; i < items.length; i++) {
							// Get the basic info - question text, id, etc.
							var qid2 = items[i].Id;
							var answerC2 = answerCounts[i];
							
							// Get counts for all answers
							var distribution2 = [];
                          	
							for (var j = 0; j < answerC2; j++)	{
								distribution2.push (sc[offset + j].Value);
							}
                          	
							offset += answerC2;
							
							// Add a new question object to our questions array
							questions[i].AddInternalComp (distribution2);
						}
					}
					
					// Set all external comparators
					// Get all norms
					var normsManager = new NormsDataManager (m_user);
					var normsData = [];
                  	
					for (var i = 0; i < Config.Norms.Codes.length; i++) {
						var normId = NormUtil.GetNormId (m_user, i);
						var currentNorm = null;
                      	
						if (m_breakByDemoId == Config.Hierarchy.VariableId || o==0) {
							currentNorm = normsManager.GetNormForQuestions (normId, qIds, m_state, m_report);
						}
						else {
							currentNorm = normsManager.GetNormForQuestionsByDemo (normId, qIds, m_state, m_report, m_breakByDemoId, precodes[o]);
						}
                      	
						normsData.push(currentNorm);
					}
					
					// Set norms for every question
					for (var i = 0; i < questions.length; i++) {
						for (var j = 0; j < normsData.length; j++) {
							if (normsData[j]) {
								questions[i].AddNorm (normsData[j][i*2], normsData[j][1+i*2]);
							}
							else {
								questions[i].AddNorm (null, null);
							}
						}
					}
					
					if (o==0) {
						// Set the overall cut
						overallCut = new HgDemographyCut (precodes[o], allColumnLabels[o][0], questions, []);
					}
					else {
						demoCuts.push (new HgDemographyCut (precodes[o], allColumnLabels[o][0], questions, []));
					}
				}
			}
			
			// Create and return a demography object
			var finalDemo = new HgDemography (m_breakByDemoId, ResourceText.Title (m_report, m_breakByDemoId, 'ds0'), overallCut, demoCuts);
			m_currentDemo = finalDemo;
          	
			// Return our demo
			return finalDemo;
		}
		else {
			return m_currentDemo;
		}
	}
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// Returns the demography containing only core questions + core dimensions
	// This should only be used in case you have QM broken by demography
	public function GetCurrentDemoCore (skipEE) {
		var demo = GetCurrentDemo ();
		var qMap = Config.Dimensions;
		
		// Overall level
		var newQs = [];
		var allQs = {};
      	
		for (var i = 0; i < demo.overall.questions.length; i++) {
			var q : HgQuestion = demo.overall.questions[i];
			var found = false;
			
			for (var j = 0; j < qMap.length; j++) {
				if (skipEE == false || typeof skipEE == 'undefined' || (qMap[j].Id != 'DIM_ENG' && qMap[j].Id != 'DIM_ENA')) {
					for (var k = 0; k<qMap[j].Questions.length; k++) {
						if(q.GetId () == qMap[j].Questions[k]) {
							found = true;
                          	
							break;
						}
					}
				}
			}
          	
			if (q.GetId () == Config.ENPS.VariableId)
				found = true;
          	
			// If not found in core dimensions - splice it
			if (found)
				newQs.push (q);
			
			// Add ever q to an associative array so we're able to build dimensions from it
			if (allQs[q.GetId()] == null) {
				allQs[q.GetId()] = q;
			}
		}
		
		// Create dimensions
		var dimensionLabels = ResourceText.List (m_report, 'dimensions');
		var dimensionsArray = [];
		var dimsConf = Config.Dimensions;
      	
		for (var i = 0; i < dimsConf.length; i++) {
			if (skipEE == false || typeof skipEE == 'undefined' || (dimsConf[i].Id != 'DIM_ENG' && dimsConf[i].Id != 'DIM_ENA')) {
				var qs = [];
              	
				for (var j = 0; j < dimsConf[i].Questions.length; j++) {
					var qid = dimsConf[i].Questions[j];
                  	
					if (allQs[qid] != null)
						qs.push (allQs[qid]);
				}
              	
				dimensionsArray.push (new HgDimension(dimsConf[i].Id, dimensionLabels[dimsConf[i].Id], qs));
			}
		}
      	
		demo.overall.SetDimensions (dimensionsArray);
		demo.overall.SetQuestions (newQs);
		
		// Demo cuts
		for (var o = 0; o < demo.cuts.length; o++) {
			newQs = [];
			var allQs2 = {};
          	
			for (var i = 0; i < demo.cuts[o].questions.length; i++) {
				var q = demo.cuts[o].questions[i];
				var found = false;
              	
				for (var j = 0; j < qMap.length; j++) {
					if (skipEE == false || typeof skipEE == 'undefined' || (qMap[j].Id != 'DIM_ENG' && qMap[j].Id != 'DIM_ENA')) {
						for(var k = 0; k < qMap[j].Questions.length; k++) {
							if (q.GetId () == qMap[j].Questions[k]) {
								found = true;
                              	
								break;
							}
						}
					}
				}
              	
				if (q.GetId () == Config.ENPS.VariableId)
					found = true;
              	
				// If not found in core dimensions - splice it
				if (found)
					newQs.push (q);
				
				// Add ever q to an associative array so we're able to build dimensions from it
				if (allQs2[q.GetId ()] == null) {
					allQs2[q.GetId ()] = q;
				}
			}
			
			// Create dimensions
			dimensionsArray = [];
          	
			for (var i = 0; i < dimsConf.length; i++) {
				if (skipEE == false || typeof skipEE == 'undefined' || (dimsConf[i].Id != 'DIM_ENG' && dimsConf[i].Id != 'DIM_ENA')) {
					var qs = [];
                  	
					for (var j = 0; j < dimsConf[i].Questions.length; j++) {
						var qid = dimsConf[i].Questions[j];
                      	
						if (allQs2[qid] != null)
							qs.push (allQs2[qid]);
					}
                  	
					dimensionsArray.push (new HgDimension(dimsConf[i].Id, dimensionLabels[dimsConf[i].Id], qs));
				}
			}
          	
			demo.cuts[o].SetDimensions (dimensionsArray);
			demo.cuts[o].SetQuestions (newQs);
			demo.cuts[o].SetQuestions (newQs);
		}
      	
		return demo;
	}
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//==================================================================================================================================
	//=========================================================== NSQ STUFF ============================================================
	//==================================================================================================================================
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	public function GetAllNSQ () {
		if (m_all_nsquestions == null) {
			var questions = [];
			var qIds = [];
			var offset = 0;
			
			// Push all questions and scores for report level into questions array
			// Include distribution and text in the first run, no comparators
			var scores = m_report.TableUtils.GetColumnValues(m_source_table_main, 1);
			var items = GetItems ();
			
			// Prepare question texts and answer counts
			var qTextsFromTable = m_report.TableUtils.GetRowHeaderCategoryTitles (m_source_table_main);
			var answerCounts = [];
			var texts = [];
			var answerTextsAll = [];
			var answerOffset = 0;
			var precodesAll = [];
			var project = m_report.DataSource.GetProject('ds0');
			
			for (var i = 0; i < items.length; i++) {
				// Non-GRID question
				// Add text
				texts.push (qTextsFromTable[answerOffset][1]);
				
				// Add answer count
				var question = project.GetQuestion (items[i].Id);
				var answerCount = 0;
				answerCount = question.GetAnswers ().length;
				answerCounts.push (answerCount);
				//RuntimeLog.Log ('Answer count: '+ answerCount);
				answerOffset = answerOffset + answerCount;
				
				// Get answer texts
				var answerTexts = [];
				var precodesOneQ = [];
				var answers = question.GetAnswers ();
              	
				for (var j = 0; j < answers.length; j++) {
					answerTexts.push (answers[j].Text);
					precodesOneQ.push(answers[j].Precode);
				}
				
				precodesAll.push (precodesOneQ);
				answerTextsAll.push (answerTexts);
			}
			
			// Report level
			for (var i = 0; i < items.length; i++) {
				// Get the basic info - question text, id, etc.
				var qid = items[i].Id;
				
				// Add the id to qIds array - we'll need that later on for norms
				// Note this qId array contains NORMCODES (takes norms override into account)
				if (Config.Maps.QuestionIdToNormVariableId[qid] != null)
					qIds.push (Config.Maps.QuestionIdToNormVariableId[qid]);
				else
					qIds.push (qid);
				
				var text = texts[i];
				var answerC = answerCounts[i];
				
				// Get counts for all answers
				var distribution = [];
              	
				for (var j = 0; j < answerC; j++) {
					distribution.push (scores[offset + j].Value);
				}
              	
				offset += answerC;
				
				// Get Valid N
				var validN = m_report.TableUtils.GetCellValue('N',1,1).Value;
				
				// Create the question and set the KDA flag
				var newQ : HgNonScoredQuestion = new HgNonScoredQuestion (qid, m_report, text, distribution, answerTextsAll[i], precodesAll[i], validN);
				
				// Add a new question object to our questions array
				questions.push (newQ);
			}
			
			// Set all internal comparators
			for (var k = 1; k < TableContent.MAIN_SEGMENT_COUNT; k++) {
				offset = 0;
				
				// Take out scores
				var sc = m_report.TableUtils.GetColumnValues (m_source_table_main, k+1);
				
				// Add that to our m_segment_distribution_data associative array
				m_segment_distribution_data[k] = sc;
				
				for (var i = 0; i < items.length; i++) {
					// Get the basic info - question text, id, etc.
					var qid2 = items[i].Id;
					var answerC2 = answerCounts[i];
					
					// Get counts for all answers
					var distribution2 = [];
                  	
					for (var j = 0; j < answerC2; j++) {
						distribution2.push (sc[offset + j].Value);
					}
                  	
					offset += answerC2;
					
					// Get Valid N
					var validN = m_report.TableUtils.GetCellValue ('N',1,k+1).Value;
					
					// Add a new comparator
					questions[i].AddInternalComp (distribution2, validN);
				}
			}
			
			// Set all external comparators
			// Prepare QID array
			var normRetreiveQuestionsArray = [];
          	
			for (var i = 0; i < questions.length; i++) {
				for (var j = 0; j < questions[i].precodes.length; j++) {
					normRetreiveQuestionsArray.push (questions[i].GetId () + "_" + questions[i].precodes[j]);
				}
			}
			
			// Get all norms
			var normsManager = new NormsDataManager (m_user);
			var normsData = [];
          	
			for (var i = 0; i < Config.Norms.Codes.length; i++) {
				var normId = NormUtil.GetNormId (m_user, i);
				normsData.push (normsManager.GetNormForQuestions (normId, normRetreiveQuestionsArray, m_state, m_report));
			}
			
			// Set norms for every question
			var offset = 0;
          	
			for (var i = 0; i < questions.length; i++) {
				for(var k = 0; k < normsData.length; k++) {
					var distArray = [];
                  	
					for(var j = 0; j < questions[i].precodes.length; j++) {
						distArray.push ({n: normsData[k][offset + j*2], fav: normsData[k][offset + j*2 + 1]});
					}
                  	
					questions[i].AddNorm (distArray);
				}
				
				offset = offset + questions[i].precodes.length * 2;
			}
			
			m_all_nsquestions = questions;
          	
			// Return our questions array
			return questions;
		}
		else {
			return m_all_nsquestions;
		}
	}
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	public function GetAllNSQBreakBy () {
		if (m_currentDemo == null) {
			var questions = [];
			var qIds = [];
			var offset = 0;
			var items = GetItems();
			
			// Prepare question texts and answer counts
			var qTextsFromTable = m_report.TableUtils.GetRowHeaderCategoryTitles (m_source_table_main);
			var answerCounts = [];
			var texts = [];
			var answerTextsAll = [];
			var answerOffset = 0;
			var precodesAll = [];
			var project = m_report.DataSource.GetProject ('ds0');
			
			for (var i = 0; i < items.length; i++) {
				// Non-GRID question
				// Add text
				texts.push (qTextsFromTable[answerOffset][1]);
				
				// Add answer count
				var question = project.GetQuestion (items[i].Id);
				var answerCount = 0;
				answerCount = question.GetAnswers ().length;
				answerCounts.push (answerCount);
				//RuntimeLog.Log ('Answer count: '+ answerCount);
				answerOffset = answerOffset + answerCount;
				
				// Get answer texts
				var answerTexts = [];
				var precodesOneQ = [];
				var answers = question.GetAnswers ();
              	
				for (var j = 0; j < answers.length; j++) {
					answerTexts.push (answers[j].Text);
					precodesOneQ.push (answers[j].Precode);
				}
				
				precodesAll.push (precodesOneQ);
				answerTextsAll.push (answerTexts);
			}
			
			// Iterate through all demo columns and prepare demogrphic cuts objects
			var overallCut : HgDemographyCut = null;
			var demoCuts = [];
			var precodes = [];
			
			// Prepare precodes and labels first
			if (m_breakByDemoId == Config.Hierarchy.VariableId) {
				precodes.push ('overall');
              	
				for (var i = 0; i < m_breakByDemoCutCount; i++) {
					precodes.push ('orgcode');
				}
			}
			else {
				var allAnswers = m_report.DataSource.GetProject ('ds0').GetQuestion (m_breakByDemoId).GetAnswers ();
				precodes.push ('overall');
              	
				if (m_mask == null) {
					for (var i = 0; i < allAnswers.length; i++) {
						precodes.push (allAnswers[i].Precode);
					}
				}
				else {
					precodes = precodes.concat (m_mask);
				}
			}
          	
			var allColumnLabels = m_report.TableUtils.GetColumnHeaderCategoryTitles (m_source_table_main);
			
			for (var o = 0; o < m_breakByDemoCutCount+1; o++) {
				// Iterate through all of the demo cuts - we ignore cut with index 1 in case of Orgcode execution due to various reasons
				// but only in a case of standard demo execution - if a custom one is provided then we don't really know what's there so
				// we don't ignore anything
				if (m_breakByDemoId == Config.Hierarchy.VariableId && o == 1 && m_customBreakByFlag == false) {}
				else {
					var questions = [];
					var qIds = [];
					var offset = 0;
					
					// Push all questions and scores for report level into questions array
					// Include distribution and text in the first run, no comparators
					var columnNumber = o + 1;
					var scores = m_report.TableUtils.GetColumnValues (m_source_table_main, columnNumber);
					
					// Report level
					for (var i = 0; i < items.length; i++) {
						// Get the basic info - question text, id, etc.
						var qid = items[i].Id;
						
						// Add the id to qIds array - we'll need that later on for norms
						// Note this qId array contains NORMCODES (takes norms override into account)
						if (Config.Maps.QuestionIdToNormVariableId[qid] != null)
							qIds.push (Config.Maps.QuestionIdToNormVariableId[qid]);
						else
							qIds.push (qid);
						
						var text = texts[i];
						var answerC = answerCounts[i];
						
						// Get counts for all answers
						var distribution = [];
                      	
						for (var j = 0; j < answerC; j++) {
							distribution.push (scores[offset + j].Value);
						}
                      	
						offset += answerC;
						
						// Get Valid N
						var validN = m_report.TableUtils.GetCellValue ('N',1,columnNumber).Value;
						
						// Create the question and set the KDA flag
						var newQ : HgNonScoredQuestion = new HgNonScoredQuestion (qid, m_report, text, distribution, answerTextsAll[i], precodesAll[i], validN);
						
						// Add a new question object to our questions array
						questions.push (newQ);
					}

					if (o==0) {
						// Set the overall cut
						overallCut = new HgDemographyCut (precodes[o], allColumnLabels[o][0], questions, []);
					}
					else {
						demoCuts.push (new HgDemographyCut(precodes[o], allColumnLabels[o][0], questions, []));
					}
				}
			}
          	
			// Create and return a demography object
			var finalDemo = new HgDemography (m_breakByDemoId, ResourceText.Title (m_report, m_breakByDemoId, 'ds0'), overallCut, demoCuts);
			m_currentDemo = finalDemo;
          	
			// Return our demo
			return finalDemo;
		}
		else {
			return m_currentDemo;
		}
	}
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	public function RunNTable (table, confirmit, customQID) {
		var comparators_map = ComparatorUtil.ProcessedComparatorsMap (m_report, m_state, m_user);
		
		// Force internal 1 and trend 1 in order to properly show widgets on the dashboard
		comparators_map[Comparators.TotalCompany].Hidden = false;
		comparators_map[Comparators.Prev].Hidden = false;
		
		//---------------------------------------------------------------------------------------
		// For each of internal comparators - check if should be hidden based on hierarchy setting
      	// Internal 1
		var supressedValue = DatabaseQuery.ExecQuery (confirmit,
                                                      Config.Hierarchy.SchemaId,
                                                      Config.Hierarchy.TableName,
                                                      Config.Hierarchy.HideScoresColumnName,
                                                      'id',
                                                      comparators_map[Comparators.TotalCompany].Id);
		if (supressedValue[0] == null || supressedValue[0] == 'undefined' || supressedValue[0] == '') {}
		else
			comparators_map[Comparators.TotalCompany].Hidden = true;
		
		// Internal 2
		supressedValue = DatabaseQuery.ExecQuery (confirmit,
                                                  Config.Hierarchy.SchemaId,
                                                  Config.Hierarchy.TableName,
                                                  Config.Hierarchy.HideScoresColumnName,
                                                  'id',
                                                  comparators_map[Comparators.LevelUp].Id);
		if (supressedValue[0] == null || supressedValue[0] == 'undefined' || supressedValue[0] == '') {}
		else
			comparators_map[Comparators.LevelUp].Hidden = true;
		
		// Internal 3
		supressedValue = DatabaseQuery.ExecQuery (confirmit,
                                                  Config.Hierarchy.SchemaId,
                                                  Config.Hierarchy.TableName,
                                                  Config.Hierarchy.HideScoresColumnName,
                                                  'id',
                                                  comparators_map[Comparators.Level2].Id);
		if (supressedValue[0] == null || supressedValue[0] == 'undefined' || supressedValue[0] == '') {}
		else
			comparators_map[Comparators.Level2].Hidden = true;
		
		// Internal 4
		supressedValue = DatabaseQuery.ExecQuery (confirmit,
                                                  Config.Hierarchy.SchemaId,
                                                  Config.Hierarchy.TableName,
                                                  Config.Hierarchy.HideScoresColumnName,
                                                  'id',
                                                  comparators_map[Comparators.Custom1].Id);
		if (supressedValue[0] == null || supressedValue[0] == 'undefined' || supressedValue[0] == '') {}
		else
			comparators_map[Comparators.Custom1].Hidden = true;
		
		// Internal 5
		supressedValue = DatabaseQuery.ExecQuery (confirmit,
                                                  Config.Hierarchy.SchemaId,
                                                  Config.Hierarchy.TableName,
                                                  Config.Hierarchy.HideScoresColumnName,
                                                  'id',
                                                  comparators_map[Comparators.Custom2].Id);
		if (supressedValue[0] == null || supressedValue[0] == 'undefined' || supressedValue[0] == '') {}
		else
			comparators_map[Comparators.Custom2].Hidden = true;
		// End of hierarchy settings check
		//---------------------------------------------------------------------------------------
		
		var X = [];
		var Y = [];
		
		// Your results + hierarchy based comps
		var current = Wave.Current (m_report,
                                    m_user,
                                    m_state,
                                    comparators_map,
                                    null,	// TOTAL_COMPANY_FORCE,
                                    false);
		
		X.push ( (m_breakby_expression == null) ? (current + '/[N]') : (current + '/[N]{hideheader:true}/(' + m_breakby_expression + ')') );
		
		// Last Years' results
		var previous = Wave.Previous (m_state, m_report, m_user, false, comparators_map[Comparators.Prev].Hidden);
		var previous2 = Wave.Previous2 (m_state, m_report, m_user, false, comparators_map[Comparators.Prev2].Hidden);
		var previous3 = Wave.Previous3 (m_state, m_report, m_user, false, comparators_map[Comparators.Prev3].Hidden);
		
		var waves = [previous, previous2, previous3];
		
		for (var i = 0; i < waves.length; ++i)
			X.push ( (m_breakby_expression == null) ? (waves[i] + '/[N]') : (waves[i] + '/[N]{hideheader:true}/(' + m_breakby_expression + ')') );
		
		// Question Expression
		// Get the NSQ_PAGED or NSQ option
		var currentNSQId = ParamUtil.GetParamCode (m_state, 'NSQ_PAGED');
		
		if (!currentNSQId) {
			currentNSQId = ParamUtil.GetParamCode (m_state, 'NSQ');
		}
		else {
			currentNSQId = currentNSQId.split (".")[0];
		}
		
		if (!currentNSQId) {
			currentNSQId = ParamLists.Get ('NSQ', m_state, m_report)[0].Code;
		}
		
		if (customQID != null && typeof customQID != 'undefined')
			currentNSQId = customQID;
		
		var selectedCode = currentNSQId;
		var nsq_qid = currentNSQId;
		var project = m_report.DataSource.GetProject ('ds0');
		var question : Question = project.GetQuestion (selectedCode);
		
		switch (question.QuestionType) {
			case QuestionType.Multi:
			case QuestionType.MultiNumeric:
				var answers = question.GetAnswers ();
				var filter = 'NOT(ISNULL(' + nsq_qid + '_' + answers[0].Precode + '))';
				Y = '[SEGMENT]{expression:' + m_report.TableUtils.EncodeJsString (filter) + '}';
            	
				break;
            
			case QuestionType.MultiOrdered:
				var answers = question.GetAnswers ();
				var filter = 'NOT(ISNULL(' + nsq_qid + '_' + answers[0].Precode + '))';
				Y = nsq_qid + '{collapsed:true}';
            	
				break;
            
			default:
				var filter = 'NOT(ISNULL(' + nsq_qid + '))';
				Y = '[SEGMENT]{expression:' + m_report.TableUtils.EncodeJsString (filter) + '}';
            	
				break;
		}
		
		var expr = [Y, X.join ('+')].join ('^');
		
		table.AddHeaders (m_report, 'ds0', expr);
	}
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//==================================================================================================================================
	//========================================================== CUSTOM STUFF ==========================================================
	//==================================================================================================================================
  	
	//==================================================================================================================================
	//======================== BELOW IS A CUSTOM SECTION THAT IS ABLE TO RETURN SCORES FOR DIFFERENT COMPARATORS =======================
	//================================================ AS IF THOSE WERE THE REPORT LEVEL ===============================================
	//======================= SHOULD ONLY BE USED UNDER SPECIAL CIRCUMSTANCES (E.G. ON SUMMARY PAGE FOR TOP LEVEL) =====================
	//==================================================================================================================================
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	
	// Returns all dimensions for specified index
	// Index should be based on indexes from TableContent script
	public function GetAllDimensionsByColumnIndex (index) {
		var qsAll = GetAllQuestionsByColumnIndex (index);
		var qmap = {};
		
		// Set our qmap (needed because we sometimes include one question in multiple dimensions)
		for (var i = 0; i < qsAll.length; i++) {
			qmap[qsAll[i].GetId ()] = qsAll[i];
		}
		
		// Create dimensions
		var dimensionLabels = ResourceText.List (m_report, 'dimensions');
		var dimensionsArray = [];
		var dimsConf = Config.Dimensions.concat (Config.LocalDimensions);
      	
		for (var i = 0; i < dimsConf.length; i++) {
			var qs = [];
          	
			for (var j = 0; j < dimsConf[i].Questions.length; j++) {
				var qid = dimsConf[i].Questions[j];
				qs.push (qmap[qid]);
			}
          	
			dimensionsArray.push (new HgDimension (dimsConf[i].Id, dimensionLabels[dimsConf[i].Id], qs));
		}
		
		return dimensionsArray;
	}
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// Returns all question for specified index
	// Index should be based on indexes from TableContent script
	private function GetAllQuestionsByColumnIndex (index) {
		var questions = [];
      	
		if (m_all_questions == null) {
			questions = GetAllQuestions ();
		}
		else {
			questions = m_all_questions;
		}
		
		var qAsArr = {};
      	
		for (var i = 0; i < questions.length; i++) {
			qAsArr[questions[i].GetId ()] = questions[i];
		}
		
		var scores = m_segment_distribution_data[index];
		var returnQuestions = [];
		var items = GetItems ();
		var answerCounts = [];
		var qMap = Config.QuestionsGridStructure;
		
		for (var i = 0; i < qMap.length; i++) {
			if (qMap[i].Qs == null) {
				// Non-GRID question
				// Add answer count
				answerCounts.push (qMap[i].NumberOfAnswers);
			}
			else {
				// GRID question
				for (var j = 0; j < qMap[i].Qs.length; j++) {
					// Add answer count
					answerCounts.push (qMap[i].NumberOfAnswers);
				}
			}
		}
		
		var offset = 0;
      	
		// Report level
		for (var i = 0; i < items.length; i++) {
			// Get the basic info - question text, id, etc.
			var qid = items[i].Id;
			var text = qAsArr[qid].text;
			var answerC = answerCounts[i];
			
			// Get counts for all answers
			var distribution = [];
          	
			for (var j = 0; j < answerC; j++) {
				distribution.push (scores[offset + j].Value);
			}
          	
			offset += answerC;
			
			// Create the question and set the KDA flag
			var newQ : HgQuestion= new HgQuestion (qid, m_report, text, distribution);
			
			// Add a new question object to our questions array
			returnQuestions.push (newQ);
		}
		
		return returnQuestions;
	}
}