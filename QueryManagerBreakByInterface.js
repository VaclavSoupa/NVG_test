//This class should be able to return a querymanager object for pages that are broken by demographics
class QueryManagerBreakByInterface{
	//Returns appropriate query manager based on parameters used on a particular page
  	//pageCase param indicates for which page should QM be returned
  	public static function GetQM(pageCase, confirmit, report, user, state){
      	switch(pageCase){
          case 'QDETAILS':
            var demo = ParamUtil.Selected(report, state, 'DEMOGR', user);
            if (demo == null)
              demo = ParamLists.Get('DEMOGR', state, report, user)[0];
            
            var item = ParamUtil.Selected(report, state, 'ITEM', user);
            if (item == null)
              item = ParamLists.Get('ITEM', state, report, user)[0];
            
            var qs = [];
            qs.push(item.Code);
            
            var qm = QueryManager.GetQueryManagerMainBreakBy(confirmit, report, state, user, qs, demo.Code);
            
            return qm;
            break;
            
          case 'DDETAILS':        
            //Get selected demo                                 
            var demo = ParamUtil.Selected(report, state, 'DEMOGR', user);                        
            if (demo == null)
              demo = ParamLists.Get('DEMOGR', state, report, user)[0];
            
         	//Get currently selected dimension - if null, revert to the first item we can find
            var selected = HelperUtil.CurrentDimension(report, state);
            if (selected == null)
                selected = ParamLists.Get('DIMENSION', state, report, user)[0];
            var dimId = selected.Code;	  
                    
           	var dimsConf = Config.Dimensions;
            var qs=[];
            
            for(var i=0; i<dimsConf.length; i++){
              	if (dimsConf[i].Id == dimId) {  
                  	qs = dimsConf[i].Questions;
                }                  
            }                 	           
                
            var qm = QueryManager.GetQueryManagerMainBreakBy(confirmit, report, state, user, qs, demo.Code);           
            return qm;
            break;
            
          case 'PLOTYOURRESULTS':
            var item1 = ParamUtil.GetParamCode(state, 'ITEM');
			var item2 = ParamUtil.GetParamCode(state, 'ITEM2');
            var demo = ParamUtil.GetParamCode(state, 'DEMOGR');
            var qs = [];
            qs.push(item1);
            if(item1 != item2);
            	qs.push(item2);
            var qm = QueryManager.GetQueryManagerMainBreakBy(confirmit, report, state, user, qs, demo);
            return qm;
            break;
          
          case 'ENPSDETAILS':
            var demo = ParamUtil.Selected(report, state, 'DEMOGR', user);
            if (demo == null)
              demo = ParamLists.Get('DEMOGR', state, report, user)[0];
            
            var qs = [];
            qs.push(Config.ENPS.VariableId);
            
            var qm = QueryManager.GetQueryManagerMainBreakBy(confirmit, report, state, user, qs, demo.Code);
            
            return qm;
            break;
          case 'EEFGAP':
            var qm = QueryManager.GetQueryManagerMainBreakBy(confirmit, report, state, user, null, Config.EffectivenessProfile.VariableId);
            return qm;
            break;
          case 'DEMOHIGHLIGHTER':
            //Get questions
            var report_item = ParamUtil.Selected (report, state, 'REPORTITEM');
            var qs = [];
            switch (report_item.ReportItemType) {
                case ReportItemType.Question:
                    qs.push(report_item.Code);
                    break;
                    
                case ReportItemType.Dimension:
                	var allDims = Config.Dimensions;
                	for(var i=0; i<allDims.length; i++){
                      	if(allDims[i].Id == report_item.Code){
                      		qs = allDims[i].Questions;
                        }
                    }
                    break;
            }
            //Get selected demo
            var demo = ParamUtil.GetParamCode(state, 'DEMOGR');
            
            var qm = QueryManager.GetQueryManagerMainBreakBy(confirmit, report, state, user, qs, demo);
            return qm;
            break;
            
          case 'ENPSGAP':
            //Create arrays with codes
            var detractors = [], promoters = [], passives = [];
            
            var project = report.DataSource.GetProject ('ds0');
            var enps = project.GetQuestion ( Config.ENPS.VariableId );
            var answers = enps.GetAnswers();
            var indexes = Config.GetDistributionIndexes_Singles ( Config.ENPS.VariableId );
            
            for (var i=0; i<indexes.Fav.length; ++i)
                promoters.push ( answers[ indexes.Fav[i] ].Precode );
        
            for (var i=0; i<indexes.Neu.length; ++i)
                passives.push ( answers[ indexes.Neu[i] ].Precode );
        
            for (var i=0; i<indexes.Unfav.length; ++i)
                detractors.push ( answers[ indexes.Unfav[i] ].Precode );
        
            var codes = {Detractors: detractors, Passives: passives, Promoters: promoters};
            var ENPS_variable_id = Config.ENPS.VariableId;
            
            //Create breakby expression
            // PROMOTERS
            var promoter_codes = [];
            for (var i=0; i<codes.Promoters.length; ++i)
              promoter_codes.push ('"' + codes.Promoters[i] + '"'); 
            
            var promoter_expression = '[SEGMENT]{expression:' + report.TableUtils.EncodeJsString ('IN(' + ENPS_variable_id + ',' + promoter_codes.join(',') + ')' )  + '}';   
            
            // COMPARATOR  
            var selected = ParamUtil.Selected (report, state, 'NPS_GAP');
            var comparator_codes = [];
            for (var i=0; i<selected.FilterCodes.length; ++i)
              comparator_codes.push ('"' + selected.FilterCodes[i] + '"'); 
            
            var comparator_expression = '[SEGMENT]{expression:' + report.TableUtils.EncodeJsString ('IN(' + ENPS_variable_id + ',' + comparator_codes.join(',') + ')' )  + '}';   
            var breakby_expression = [comparator_expression, promoter_expression].join('+');
            
            var qm = QueryManager.GetQueryManagerMainBreakBy(confirmit, report, state, user, null, Config.ENPS.VariableId, 2, breakby_expression, null, true);
            return qm;
            break;
          
          case 'IBT':
            //Check the demography selection and apply proper mask
            var demo = Page_InternalBenchmarkTool.Selection_BreakBy (report, state, user);
      		
            var qid = demo.Code.split('.')[0];
            var mask = [];
      		var answerCount = 0;
            var X = [];
       	
            if (demo.StartIndex != null && qid != Config.Hierarchy.VariableId) {
              var question = report.DataSource.GetProject('ds0').GetQuestion ( qid );
              var answers = question.GetAnswers();
              for (var i=demo.StartIndex; i<=demo.EndIndex; ++i)
                mask.push ( answers[i].Precode );
              
              answerCount = demo.EndIndex - demo.StartIndex + 1;
            }
            else if(demo.StartIndex == null && qid != Config.Hierarchy.VariableId){
              answerCount = report.DataSource.GetProject('ds0').GetQuestion(qid).AnswerCount;
            }
         
            var mask_expression = (mask.length>0) ? ('mask:' + mask.join(',') + ';') : '';
         
            if (qid == Config.Hierarchy.VariableId) {
              var currentLanguage = report.CurrentLanguage;
              var segments = [];
              var node_id = user.PersonalizedReportBase;
              var ids = DatabaseQuery.ExecQuery (confirmit, Config.Hierarchy.SchemaId, Config.Hierarchy.TableName, 'id', Config.Hierarchy.ParentRelationName, node_id);
              var labels = DatabaseQuery.ExecQuery (confirmit, Config.Hierarchy.SchemaId, Config.Hierarchy.TableName, '__l'+currentLanguage, Config.Hierarchy.ParentRelationName, node_id);
      
              
              if (ids.length == 0){
                 segments.push ( '[FORMULA]{label:"-"; expression:"ABS(0)"}' ); // No child nodes exist
              	 answerCount = 1;
              }
              else {
              
                 var StartIndex = 0;
                 var EndIndex = ids.length-1;
                    
                 if(demo.StartIndex != null) {
                   StartIndex = demo.StartIndex;
                   EndIndex = demo.EndIndex;
                 }
                 
                 answerCount = EndIndex - StartIndex + 1;
                
                 // Create SEGMENTS for the specific child nodes to be included
                 for (var i= StartIndex; i <= EndIndex; ++i) {
                   var e = '[SEGMENT]{' + 
                           'label:' + report.TableUtils.EncodeJsString( labels[i] ) + ';' + 
                           'expression:' + report.TableUtils.EncodeJsString ('INHIERARCHY(' + qid + ',"' + ids[i] + '")' ) + '}';
                            
                   segments.push(e);
                 }		
              }
              
              X.push ( segments.join('+') );
            }
            else
             X.push (qid + '{' + mask_expression + 'totals:false}' );
     
            var fullBreakBy = X.join('+');
            
            //Check what questions should be included (either all or a particular dimension)
            //var selectedQs = Page_InternalBenchmarkTool.Selection_Rows(report, state, user);
            var qsArr = null;

            /*if(selectedQs.Code != "1" && selectedQs.Code != "2"){
              //this means we only have 1 dimension included so we want to put less questions in
              var allDims = Config.Dimensions;
              for(var i=0; i<allDims.length; i++){
                if(allDims[i].Id == selectedQs.Code){
                	qsArr = allDims[i].Questions;
                }
              }
            }*/
            
            var qm = QueryManager.GetQueryManagerMainBreakBy(confirmit, report, state, user, qsArr, qid, answerCount, fullBreakBy, null, false);
            return qm;
            break;
            
          case 'NSQIBT':
            //Check the demography selection and apply proper mask
            var demo = Page_NSQ.Selection_BreakBy(report, state, user);
      		//RuntimeLog.Log("QMBreakByInterface1");
            var qid = demo.Code.split('.')[0];
            var mask = [];
      		var answerCount = 0;
            var X = [];
       	
            if (demo.StartIndex != null && qid != Config.Hierarchy.VariableId) {
              var question = report.DataSource.GetProject('ds0').GetQuestion ( qid );
              var answers = question.GetAnswers();
              for (var i=demo.StartIndex; i<=demo.EndIndex; ++i)
                mask.push ( answers[i].Precode );
              
              answerCount = demo.EndIndex - demo.StartIndex + 1;
            }
            else if(demo.StartIndex == null && qid != Config.Hierarchy.VariableId){
              answerCount = report.DataSource.GetProject('ds0').GetQuestion(qid).AnswerCount;
            }
         	
            var mask_expression = (mask.length>0) ? ('mask:' + mask.join(',') + ';') : '';
         	
            if (qid == Config.Hierarchy.VariableId) {
              var currentLanguage = report.CurrentLanguage;
              var segments = [];
              var node_id = user.PersonalizedReportBase;
              var ids = DatabaseQuery.ExecQuery (confirmit, Config.Hierarchy.SchemaId, Config.Hierarchy.TableName, 'id', Config.Hierarchy.ParentRelationName, node_id);
              var labels = DatabaseQuery.ExecQuery (confirmit, Config.Hierarchy.SchemaId, Config.Hierarchy.TableName, '__l'+currentLanguage, Config.Hierarchy.ParentRelationName, node_id);
      
              
              if (ids.length == 0){
                 segments.push ( '[FORMULA]{label:"-"; expression:"ABS(0)"}' ); // No child nodes exist
              	 answerCount = 1;
              }
              else {
              
                 var StartIndex = 0;
                 var EndIndex = ids.length-1;
                    
                 if(demo.StartIndex != null) {
                   StartIndex = demo.StartIndex;
                   EndIndex = demo.EndIndex;
                 }
                 
                 answerCount = EndIndex - StartIndex + 1;
                
                 // Create SEGMENTS for the specific child nodes to be included
                 for (var i= StartIndex; i <= EndIndex; ++i) {
                   var e = '[SEGMENT]{' + 
                           'label:' + report.TableUtils.EncodeJsString( labels[i] ) + ';' + 
                           'expression:' + report.TableUtils.EncodeJsString ('INHIERARCHY(' + qid + ',"' + ids[i] + '")' ) + '}';
                            
                   segments.push(e);
                 }		
              }
              
              X.push ( segments.join('+') );
            }
            else
             X.push (qid + '{' + mask_expression + 'totals:false}' );
     
            var fullBreakBy = X.join('+');
            //RuntimeLog.Log("QMBreakByInterface2");
            //Get the NSQ_PAGED or NSQ option
            var selectedQ = Page_NSQ.Selection_Question(report, state, user);
            //RuntimeLog.Log("QMBreakByInterface3");
            var currentNSQId = selectedQ.Code;
            //RuntimeLog.Log("QMBreakByInterface4");										
            var qm = QueryManager.GetQueryManagerMainNSQBreakBy(confirmit, report, state, user, currentNSQId, qid, answerCount, fullBreakBy);
            return qm;
            break;
            
          case 'PSS':
            var pss = ParamUtil.Selected (report, state, 'PSS', user, confirmit);
            var breakBy = '';
            var qid = pss.Code.split('.')[0];
            var answerCount = 0;
            var skipRemainder = false;
            
            if(qid == "0"){
            	breakBy = '[FORMULA]{label:"-"; expression:"ABS(0)"}'; //Overall, we don't really want any demo there
              	qid = Config.Hierarchy.VariableId;
              	answerCount = 1;
              	skipRemainder = true;
            }
            else{
              breakBy = pss.BreakBy;
              if(pss.StartIndex != null){
                  answerCount = pss.EndIndex - pss.StartIndex + 1;
              }
              else{
                  answerCount = report.DataSource.GetProject('ds0').GetQuestion(qid).AnswerCount;
              }
            }
            var maskCodes = (pss.Mask == null || typeof pss.Mask == 'undefined') ? null : pss.Mask;
            var qm = QueryManager.GetQueryManagerMainBreakBy(confirmit, report, state, user, null, qid, answerCount, breakBy, maskCodes, skipRemainder);
            return qm;
            break;
          default:
            return null;
        }
    }
}