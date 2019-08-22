class ResponseRate {
  
    static function SelfScores ( report ) {
      if (Config.RRByGroup_PaperPopulation_Hide==false) {
      	var column_values = report.TableUtils.GetColumnValues('rr_overall:ResponseRate', 9);
        var column_valuesPopulation = report.TableUtils.GetColumnValues('rr_overall:ResponseRate', 8);
      	var column_valuesN = report.TableUtils.GetColumnValues('rr_overall:ResponseRate', 7);
      }
      else {
      	var column_values = report.TableUtils.GetColumnValues('rr_overall:ResponseRate', 3);
        var column_valuesPopulation = report.TableUtils.GetColumnValues('rr_overall:ResponseRate', 2);
      	var column_valuesN = report.TableUtils.GetColumnValues('rr_overall:ResponseRate', 1);
      }
	  
      return {
        Self: Math.round (100*column_values[0].Value),
        SelfN: Math.round (column_valuesN[0].Value),
        SelfNPopulation: column_valuesPopulation[0].Value
      }
    }
        
  
    static function Scores ( report ) {      
      
      if (Config.RRByGroup_PaperPopulation_Hide==false) {
      	var column_values = report.TableUtils.GetColumnValues('rr_overall:ResponseRate', 9);
      	var column_valuesPopulation = report.TableUtils.GetColumnValues('rr_overall:ResponseRate', 8);
      	var column_valuesN = report.TableUtils.GetColumnValues('rr_overall:ResponseRate', 7);
	  
      	var comparator_column_values = report.TableUtils.GetColumnValues('rr_overall:ResponseRate_Comparator', 9);
      	var comparator_column_valuesN = report.TableUtils.GetColumnValues('rr_overall:ResponseRate_Comparator', 7);
      }
      else {
        var column_values = report.TableUtils.GetColumnValues('rr_overall:ResponseRate', 3);
      	var column_valuesPopulation = report.TableUtils.GetColumnValues('rr_overall:ResponseRate', 2);
      	var column_valuesN = report.TableUtils.GetColumnValues('rr_overall:ResponseRate', 1);
	  
      	var comparator_column_values = report.TableUtils.GetColumnValues('rr_overall:ResponseRate_Comparator', 3);
      	var comparator_column_valuesN = report.TableUtils.GetColumnValues('rr_overall:ResponseRate_Comparator', 1);
      }
	  
      return {
        Self: Math.round (100*column_values[0].Value),
        SelfN: Math.round (column_valuesN[0].Value),
        SelfNPopulation: column_valuesPopulation[0].Value,
        Internal:  Math.round (100*comparator_column_values[0].Value),
        InternalN:  Math.round (comparator_column_valuesN[0].Value)
      }
    }
        
	static function CompanyOverall_Indirect ( report, user ) {
      
        var filter_expression = 'INHIERARCHY(' + Config.Hierarchy.VariableId + ',"' + Config.Hierarchy.TopNodeId + '")';
     	
		var expr = [
		 '[SEGMENT]{label:' + '"COMPANY OVERALL"' + '; expression:' + report.TableUtils.EncodeJsString( filter_expression ) + '}',
		  HorizontalExpression( report, user, true ) 
		].join('^');

		return expr;
	}

	
	static function TopComparator( report, state, user ) {
      
        var top = ComparatorUtil.Top (report, user, state);
        var filter_expression = 'INHIERARCHY(' + Config.Hierarchy.VariableId + ',"' + top.Id + '")';
     	
		var expr = [
		 '[SEGMENT]{label:' + report.TableUtils.EncodeJsString( top.TableLabel ) + '; expression:' + report.TableUtils.EncodeJsString( filter_expression ) + '}',
		  HorizontalExpression( report, user, true ) 
		].join('^');

		return expr;
	}

	static function Self( report, state, user ) {
      
        //var top = ComparatorUtil.Top (report, user, state);
        //var filter_expression = 'INHIERARCHY(' + Config.Hierarchy.VariableId + ',"' + top.Id + '")';
     	
		var expr = [
          HelperUtil.SelfExpression(state, report, user),
		  HorizontalExpression( report, user ) 
		].join('^');

		return expr;
	}


 	static function Overall( report, user, state ) {
	
		var expr = [
		  HelperUtil.SelfExpressionWithTopparent(state, report, user), 
		  HorizontalExpression( report, user ) 
		].join('^');
		return expr;
	}

	static function ByGroupExpression( report, user, state ) {
      
		var hier_expr = (Config.Hierarchy.Direct)
            ? HelperUtil.SelfExpression(state, report, user)
            : Config.Hierarchy.VariableId + '{self:true; parent:false; topparent:false; children:1; totals:false}';

      var expr = [
		  hier_expr, 
		  HorizontalExpression( report, user ) 
		].join('^');

		ConfirmitClass.Log4 ( expr );
		
      return expr;
	
	}
  
  //function AllGroupExpression - Added 25 March 15 by EJS.  Meant to return all levels of the hierarchy for a response rate.
  static function AllGroupExpression( report, user, state ) {
		var hier_expr = (Config.Hierarchy.Direct)
          	? HelperUtil.SelfExpression(report, user, state)
            : Config.Hierarchy.VariableId + '{self:true; parent:false; topparent:false; children:20; totals:false}'
		
		var expr = [
		  hier_expr, 
		  HorizontalExpression( report, user ) 
		].join('^');

		return expr;
	
	} 
	
  static function HorizontalExpression( report : Report, user : User, force_indirect : boolean ) {
		
    try {
    
		var pid_count = HelperUtil.GetParticipationProjectId ( report ) ;
      	var rtLabels = ResourceText.List (report, 'labels');
		var rtResponseRate = ResourceText.List (report, 'response_rate');
      	var PaperPopulation_Hide = Config.RRByGroup_PaperPopulation_Hide;
      
        var label = {N: rtResponseRate['completed'], Indirect: rtResponseRate['population'], ResponseRate: rtLabels['ResponseRate'] };

      
		var X = [];
		var has_user_level_filter = (user.PersonalizedFilterExpression != null);


		// Benchmark names
		
		var n_field = (Config.Hierarchy.Direct == true && !force_indirect ) ? 'N_Direct' : 'N';
		var paper_n_field = (Config.Hierarchy.Direct == true && !force_indirect ) ? 'Paper_N_Direct' : 'Paper_N';
		var paper_count_field = (Config.Hierarchy.Direct == true && !force_indirect) ? 'Paper_Count_Direct' : 'Paper_Count';
		
		
		// --------- ONLINE COUNTS ------------------------

		var tmp = [];

		// [N]
		tmp.push ('[N]{hidedata:true; hideheader:true}/[SEGMENT]{hidedata:true; label:"' + label.N + '"}');
		
		if (Config.Privacy.ShowBelowThresholdN)
			tmp.push ('[FORMULA]{label:"' + label.N + '"; expression:"CELLV(col-1,row)"}');
		else
			tmp.push ('[FORMULA]{label:"' + label.N + '"; expression:"IF((CELLV(col-1,row)>=' + Config.Privacy.Table.MinN + ' AND CELLV(13,row)!=1), CELLV(col-1,row), EMPTYV())"}');
		

		
		
		
		// N variable from the benchmark survey
		tmp.push (
			has_user_level_filter
				? '[CONTENT]{label:"' + label.Indirect + '"}'
				: n_field + '{hideheader:true; collapsed:true}/[BENCHMARK]{hideheader:true; projectid:' + pid_count + '}/[SEGMENT]{label:"' + label.Indirect + '"}'
		);
		  
		// Response Rate Formula
		tmp.push ('[FORMULA]{decimals:0; label:"' + label.ResponseRate + '"; percent:true; expression:"IF(NOT(CELLV(col-1,row)>0), EMPTYV(), CELLV(col-2,row)/CELLV(col-1,row))"}'); 

      var filter = 'METHODOLOGY = "WEB"';

      X.push ('[SEGMENT]{label:' + report.TableUtils.EncodeJsString( rtResponseRate['online'] ) + '; expression:' + report.TableUtils.EncodeJsString(filter) + '}' + '/' + '(' + tmp.join('+') + ')');


		// --------- PAPER COUNTS ------------------------

		var tmp = [];


		// N_Paper variable from the benchmark survey
		tmp.push ( paper_count_field + '{hidedata:true; hideheader:true; collapsed:true}/[BENCHMARK]{hidedata:true; hideheader:true; projectid:' + pid_count + '}/[SEGMENT]{hidedata:true; label:"' + label.N + '"}');

      // If you want to hide column Paper than has to be var PaperPopulation_Hide true
      	if (PaperPopulation_Hide==false) {
      		if (Config.Privacy.ShowBelowThresholdN)
				tmp.push ('[FORMULA]{label:"' + label.N + '"; expression:"CELLV(col-1,row)"}');
			else
				tmp.push ('[FORMULA]{label:"' + label.N + '"; expression:"IF(CELLV(col-1,row)>=' + Config.Privacy.Table.MinN + ', CELLV(col-1,row), EMPTYV())"}');
          
			// Population_Paper variable from the benchmark survey
			tmp.push (
				has_user_level_filter
					? '[CONTENT]{label:"' + label.Indirect + '"}'
					: paper_n_field + '{hideheader:true; collapsed:true}/[BENCHMARK]{hideheader:true; projectid:' + pid_count + '}/[SEGMENT]{label:"' + label.Indirect + '"}'
			);
		  
			// Response Rate Formula
      		tmp.push ('[FORMULA]{decimals:0;  label:"' + label.ResponseRate + '"; percent:true; expression:"IF(NOT(CELLV(col-1,row)>0), EMPTYV(), CELLV(col-2,row)/CELLV(col-1,row))"}'); 

			X.push ('[SEGMENT]{label:' + report.TableUtils.EncodeJsString( rtResponseRate['paper'] ) + '}' + '/' + '(' + tmp.join('+') + ')');
      	}
      	else {
        	if (Config.Privacy.ShowBelowThresholdN)
          		tmp.push ('[FORMULA]{hidedata:true; label:"' + label.N + '"; expression:"CELLV(col-1,row)"}');
			else
          		tmp.push ('[FORMULA]{hidedata:true; label:"' + label.N + '"; expression:"IF(CELLV(col-1,row)>=' + Config.Privacy.Table.MinN + ', CELLV(col-1,row), EMPTYV())"}');
          
			// Population_Paper variable from the benchmark survey
			tmp.push (
				has_user_level_filter
          			? '[CONTENT]{hidedata:true; label:"' + label.Indirect + '"}'
          			: paper_n_field + '{hideheader:true; hidedata:true;collapsed:true}/[BENCHMARK]{hideheader:true; projectid:' + pid_count + '}/[SEGMENT]{hidedata:true; label:"' + label.Indirect + '"}'
			);
		  
			// Response Rate Formula
			tmp.push ('[FORMULA]{decimals:0; hidedata:true;label:"' + label.ResponseRate + '"; percent:true; expression:"IF(NOT(CELLV(col-1,row)>0), EMPTYV(), CELLV(col-2,row)/CELLV(col-1,row))"}'); 

        	X.push ('[SEGMENT]{hideheader:true; hidedata:true; label:' + report.TableUtils.EncodeJsString( rtResponseRate['paper'] ) + '}' + '/' + '(' + tmp.join('+') + ')');
      	}

		// --------- TOTAL COUNTS ------------------------

		var tmp = [];
		  
		// Total Respondents
		tmp.push ('[FORMULA]{hidedata:true; decimals:0; label:"' + label.N + '"; expression:"CELLV(col-8, row)+CELLV(col-4,row)"}');

		if(PaperPopulation_Hide == false){  
          // Total Respondents
           
          if (Config.Privacy.ShowBelowThresholdN)
              tmp.push ('[FORMULA]{label:"' + label.N + '"; expression:"CELLV(col-1,row)"}');
          else
              tmp.push ('[FORMULA]{label:"' + label.N + '"; expression:"IF((CELLV(col-1,row)>=' + Config.Privacy.Table.MinN + ' AND CELLV(13,row)!=1), CELLV(col-1,row), EMPTYV())"}');
          
          
          // Indirect
          tmp.push ('[FORMULA]{decimals:0; label:"' + label.Indirect + '"; expression:"CELLV(col-8, row)+CELLV(col-4,row)"}');
  
          // Response Rate Formula
          tmp.push ('[FORMULA]{decimals:0; label:"' + label.ResponseRate + '"; percent:true; expression:"IF(NOT(CELLV(col-1,row)>0), EMPTYV(), CELLV(col-2,row)/CELLV(col-1,row))"}'); 
  
                       
          X.push ('[SEGMENT]{label:' + report.TableUtils.EncodeJsString( rtResponseRate['total'] ) + '}' + '/' + '(' + tmp.join('+') + ')');
        
      	}else{
          // Total Respondents
     
          if (Config.Privacy.ShowBelowThresholdN)
            tmp.push ('[FORMULA]{hidedata:true; label:"' + label.N + '"; expression:"CELLV(col-1,row)"}');
          else
            tmp.push ('[FORMULA]{hidedata:true; label:"' + label.N + '"; expression:"IF((CELLV(col-1,row)>=' + Config.Privacy.Table.MinN + ' AND CELLV(13,row)!=1), CELLV(col-1,row), EMPTYV())"}');
          
          
          // Indirect
          tmp.push ('[FORMULA]{decimals:0; hidedata:true; label:"' + label.Indirect + '"; expression:"CELLV(col-8, row)+CELLV(col-4,row)"}');
  
          // Response Rate Formula
          tmp.push ('[FORMULA]{decimals:0; hidedata:true; label:"' + label.ResponseRate + '"; percent:true; expression:"IF(NOT(CELLV(col-1,row)>0), EMPTYV(), CELLV(col-2,row)/CELLV(col-1,row))"}'); 
  
                       
          X.push ('[SEGMENT]{hideheader:true; hidedata:true; label:' + report.TableUtils.EncodeJsString( rtResponseRate['total'] ) + '}' + '/' + '(' + tmp.join('+') + ')');
      	}
		
      	//CONTENT HEADER FOR FORCED SUPPRESSION
		X.push('[CONTENT]{id:hide; hidedata:true; label:"hide"}');
      
		return X.join('+');
    }
    catch (e) {
     //
    }
	}

}