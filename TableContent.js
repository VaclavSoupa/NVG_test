class TableContent {
    // THIS SECTIONS NEED TO CHANGE IF THE PARAMLIST CALL FOR COMPARATORS_INTERNAL CHANGES 
	static var MAIN_SEGMENT_COUNT = 9;

	static var SELF_INDEX = 0;
	static var TOTAL_COMPANY_INDEX = 1;
	static var LEVELUP_INDEX = 2;
	static var LEVEL2_INDEX = 3;
	static var CUSTOM1_INDEX = 4;
	static var CUSTOM2_INDEX = 5;
    
	static var PREV_INDEX = 6;
  	static var PREV2_INDEX = 7;		// RP-24 Three years of Trends
	static var PREV3_INDEX = 8;
	// END OF SECTION
  
	static function isNotANumber (x) {
		if (x==0) return false;
		return isNaN (x) || (x == null) || (x == '');
	}
}