class SigTest {

  static var Codes = {Positive: -1000, Negative: -1001, None: '-', PositiveNoBackgroundColor: -2000, NegativeNoBackgroundColor: -2001};
  
	// Return values:
	// If any of the input values are not numbers, return null
	// If there is a statistical significance, return true
	// else return false
	
	static function Run (varCount1, varValue1, varCount2, varValue2, blnValue2IsDiff, pageContext) {
      if (pageContext) {
       	if (pageContext.Items['sigtest'] == null) pageContext.Items['sigtest'] == '';
      }
          if (pageContext) {pageContext.Items['sigtest'] = pageContext.Items['sigtest'] + '|' + varCount1 + ';' + varValue1 + ';' + varCount2 + ';' + varValue2 + ';' + blnValue2IsDiff, pageContext}
      
      
      
		if (blnValue2IsDiff==null) blnValue2IsDiff=true; // default value
      
		if (isNaN(varCount1) || isNaN(varValue1) || isNaN (varCount2) || isNaN(varValue2)) {
			return null;
		}
		else {
			// All input variables are numbers
			
			var lngCount1 = varCount1;
			var lngValue1 = varValue1;
			var lngCount2 = varCount2;
			var lngValue2 = varValue2;
          
          	var x = fnStatSig_NumberInput(lngCount1, lngValue1, lngCount2, lngValue2, blnValue2IsDiff);
          if (pageContext) {pageContext.Items['sigtest'] = pageContext.Items['sigtest'] + '|' + x + '<br>'}
            return x; 
		}
	}
	
	static function fnStatSig_NumberInput(lngCount1, lngValue1, lngCount2, lngValue2, blnValue2IsDiff) {
		if (blnValue2IsDiff==null) blnValue2IsDiff=true; // default value
		try {
			const csngZLimit = Config.SigTest.Threshold; // typically 1.96
			var lngValue2Final;
			var dblPool;
			var dblZ;
			
			lngValue2Final = blnValue2IsDiff ? (lngValue1 - lngValue2) : (lngValue2);
			dblPool = ((lngCount1 * (lngValue1 / 100)) + (lngCount2 * (lngValue2Final / 100))) / (lngCount1 + lngCount2);
			dblZ = ((lngValue1 / 100) - (lngValue2Final / 100)) / (Math.sqrt(((dblPool * (1 - dblPool)) / lngCount1) + ((dblPool * (1 - dblPool) / lngCount2))));
			
			var output = (Math.abs(dblZ) >= csngZLimit);
			return output;
		}
		catch (e) {
			return false;
		}
	}
}