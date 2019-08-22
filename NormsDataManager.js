class NormsDataManager{
	var m_user;
	var m_record;
	static var m_store_id = Config.Hub.Norms.ProjectId;
	var m_store;
	
  	static var questionDataStructure = [
      'AV01_N','AV01_FAV','AV01_NEU','AV01_UFV','AV02_N',
      'AV02_FAV','AV02_NEU','AV02_UFV','AV05_N','AV05_FAV',
      'AV05_NEU','AV05_UFV','AV08_N','AV08_FAV','AV08_NEU',
      'AV08_UFV','AV09_N','AV09_FAV','AV09_NEU','AV09_UFV',
      'AV13_N','AV13_FAV','AV13_NEU','AV13_UFV','AV15_N',
      'AV15_FAV','AV15_NEU','AV15_UFV','BN01_N','BN01_FAV',
      'BN01_NEU','BN01_UFV','BN02_N','BN02_FAV','BN02_NEU',
      'BN02_UFV','BN04_N','BN04_FAV','BN04_NEU','BN04_UFV',
      'BN09_N','BN09_FAV','BN09_NEU','BN09_UFV','BN11_N',
      'BN11_FAV','BN11_NEU','BN11_UFV','CP01_N','CP01_FAV',
      'CP01_NEU','CP01_UFV','CP11_N','CP11_FAV','CP11_NEU',
      'CP11_UFV','CP12_N','CP12_FAV','CP12_NEU','CP12_UFV',
      'CP14_N','CP14_FAV','CP14_NEU','CP14_UFV','CP16_N',
      'CP16_FAV','CP16_NEU','CP16_UFV','CP19_N','CP19_FAV',
      'CP19_NEU','CP19_UFV','CP26_N','CP26_FAV','CP26_NEU',
      'CP26_UFV','DC01_N','DC01_FAV','DC01_NEU','DC01_UFV',
      'DC03_N','DC03_FAV','DC03_NEU','DC03_UFV','DC08_N',
      'DC08_FAV','DC08_NEU','DC08_UFV','DC09_N','DC09_FAV',
      'DC09_NEU','DC09_UFV','DC11_N','DC11_FAV','DC11_NEU',
      'DC11_UFV','DC21_N','DC21_FAV','DC21_NEU','DC21_UFV',
      'DC29_N','DC29_FAV','DC29_NEU','DC29_UFV','DI01_N',
      'DI01_FAV','DI01_NEU','DI01_UFV','DI03_N','DI03_FAV',
      'DI03_NEU','DI03_UFV','DI04_N','DI04_FAV','DI04_NEU',
      'DI04_UFV','DI09_N','DI09_FAV','DI09_NEU','DI09_UFV',
      'DM01_N','DM01_FAV','DM01_NEU','DM01_UFV','DM02_N',
      'DM02_FAV','DM02_NEU','DM02_UFV','DM04_N','DM04_FAV',
      'DM04_NEU','DM04_UFV','DM05_N','DM05_FAV','DM05_NEU',
      'DM05_UFV','DM18_N','DM18_FAV','DM18_NEU','DM18_UFV',
      'DM20_N','DM20_FAV','DM20_NEU','DM20_UFV','EQ01_N',
      'EQ01_FAV','EQ01_NEU','EQ01_UFV','ER01_N','ER01_FAV',
      'ER01_NEU','ER01_UFV','ER02_N','ER02_FAV','ER02_NEU',
      'ER02_UFV','ER03_N','ER03_FAV','ER03_NEU','ER03_UFV',
      'ER05_N','ER05_FAV','ER05_NEU','ER05_UFV','ER08_N',
      'ER08_FAV','ER08_NEU','ER08_UFV','GP02_N','GP02_FAV',
      'GP02_NEU','GP02_UFV','GP03_N','GP03_FAV','GP03_NEU',
      'GP03_UFV','GP06_N','GP06_FAV','GP06_NEU','GP06_UFV',
      'GP07_N','GP07_FAV','GP07_NEU','GP07_UFV','GP08_N',
      'GP08_FAV','GP08_NEU','GP08_UFV','GP09_N','GP09_FAV',
      'GP09_NEU','GP09_UFV','GP10_N','GP10_FAV','GP10_NEU',
      'GP10_UFV','GP11_N','GP11_FAV','GP11_NEU','GP11_UFV',
      'GP12_N','GP12_FAV','GP12_NEU','GP12_UFV','GP13_N',
      'GP13_FAV','GP13_NEU','GP13_UFV','GP18_N','GP18_FAV',
      'GP18_NEU','GP18_UFV','GP19_N','GP19_FAV','GP19_NEU',
      'GP19_UFV','GP20_N','GP20_FAV','GP20_NEU','GP20_UFV',
      'GP21_N','GP21_FAV','GP21_NEU','GP21_UFV','GP22_N',
      'GP22_FAV','GP22_NEU','GP22_UFV','IV02_N','IV02_FAV',
      'IV02_NEU','IV02_UFV','IV03_N','IV03_FAV','IV03_NEU',
      'IV03_UFV','IV04_N','IV04_FAV','IV04_NEU','IV04_UFV',
      'IV05_N','IV05_FAV','IV05_NEU','IV05_UFV','JS01_N',
      'JS01_FAV','JS01_NEU','JS01_UFV','JS02_N','JS02_FAV',
      'JS02_NEU','JS02_UFV','JS03_N','JS03_FAV','JS03_NEU',
      'JS03_UFV','JS05_N','JS05_FAV','JS05_NEU','JS05_UFV',
      'JS07_N','JS07_FAV','JS07_NEU','JS07_UFV','JS09_N',
      'JS09_FAV','JS09_NEU','JS09_UFV','LD01_N','LD01_FAV',
      'LD01_NEU','LD01_UFV','LD04_N','LD04_FAV','LD04_NEU',
      'LD04_UFV','LD05_N','LD05_FAV','LD05_NEU','LD05_UFV',
      'LD07_N','LD07_FAV','LD07_NEU','LD07_UFV','LD09_N',
      'LD09_FAV','LD09_NEU','LD09_UFV','LD10_N','LD10_FAV',
      'LD10_NEU','LD10_UFV','LD11_N','LD11_FAV','LD11_NEU',
      'LD11_UFV','LD20_N','LD20_FAV','LD20_NEU','LD20_UFV',
      'MV02_N','MV02_FAV','MV02_NEU','MV02_UFV','MV04_N',
      'MV04_FAV','MV04_NEU','MV04_UFV','MV06_N','MV06_FAV',
      'MV06_NEU','MV06_UFV','MV07_N','MV07_FAV','MV07_NEU',
      'MV07_UFV','MV08_N','MV08_FAV','MV08_NEU','MV08_UFV',
      'NP01_N','NP01_FAV','NP01_NEU','NP01_UFV','OM01_N',
      'OM01_FAV','OM01_NEU','OM01_UFV','OM02_N','OM02_FAV',
      'OM02_NEU','OM02_UFV','OM04_N','OM04_FAV','OM04_NEU',
      'OM04_UFV','OM05_N','OM05_FAV','OM05_NEU','OM05_UFV',
      'OM06_N','OM06_FAV','OM06_NEU','OM06_UFV','OM10_N',
      'OM10_FAV','OM10_NEU','OM10_UFV','OM11_N','OM11_FAV',
      'OM11_NEU','OM11_UFV','OM12_N','OM12_FAV','OM12_NEU',
      'OM12_UFV','OM13_N','OM13_FAV','OM13_NEU','OM13_UFV',
      'OM16_N','OM16_FAV','OM16_NEU','OM16_UFV','OS01_N',
      'OS01_FAV','OS01_NEU','OS01_UFV','OS02_N','OS02_FAV',
      'OS02_NEU','OS02_UFV','OS03_N','OS03_FAV','OS03_NEU',
      'OS03_UFV','PE01_N','PE01_FAV','PE01_NEU','PE01_UFV',
      'PE02_N','PE02_FAV','PE02_NEU','PE02_UFV','PE03_N',
      'PE03_FAV','PE03_NEU','PE03_UFV','PE04_N','PE04_FAV',
      'PE04_NEU','PE04_UFV','PE05_N','PE05_FAV','PE05_NEU',
      'PE05_UFV','PE06_N','PE06_FAV','PE06_NEU','PE06_UFV',
      'PE07_N','PE07_FAV','PE07_NEU','PE07_UFV','PE08_N',
      'PE08_FAV','PE08_NEU','PE08_UFV','PE09_N','PE09_FAV',
      'PE09_NEU','PE09_UFV','PE10_N','PE10_FAV','PE10_NEU',
      'PE10_UFV','PE11_N','PE11_FAV','PE11_NEU','PE11_UFV',
      'PE12_N','PE12_FAV','PE12_NEU','PE12_UFV','PE14_N',
      'PE14_FAV','PE14_NEU','PE14_UFV','PE21_N','PE21_FAV',
      'PE21_NEU','PE21_UFV','PE23_N','PE23_FAV','PE23_NEU',
      'PE23_UFV','QS01_N','QS01_FAV','QS01_NEU','QS01_UFV',
      'QS02_N','QS02_FAV','QS02_NEU','QS02_UFV','QS03_N',
      'QS03_FAV','QS03_NEU','QS03_UFV','QS04_N','QS04_FAV',
      'QS04_NEU','QS04_UFV','QS09_N','QS09_FAV','QS09_NEU',
      'QS09_UFV','QS13_N','QS13_FAV','QS13_NEU','QS13_UFV',
      'QS16_N','QS16_FAV','QS16_NEU','QS16_UFV','RC01_N',
      'RC01_FAV','RC01_NEU','RC01_UFV','RC03_N','RC03_FAV',
      'RC03_NEU','RC03_UFV','RE01_N','RE01_FAV','RE01_NEU',
      'RE01_UFV','SD01_N','SD01_FAV','SD01_NEU','SD01_UFV',
      'SD02_N','SD02_FAV','SD02_NEU','SD02_UFV','SD03_N',
      'SD03_FAV','SD03_NEU','SD03_UFV','SD04_N','SD04_FAV',
      'SD04_NEU','SD04_UFV','SD05_N','SD05_FAV','SD05_NEU',
      'SD05_UFV','SD06_N','SD06_FAV','SD06_NEU','SD06_UFV',
      'SD12_N','SD12_FAV','SD12_NEU','SD12_UFV','SD14_N',
      'SD14_FAV','SD14_NEU','SD14_UFV','SP02_N','SP02_FAV',
      'SP02_NEU','SP02_UFV','SP03_N','SP03_FAV','SP03_NEU',
      'SP03_UFV','SP04_N','SP04_FAV','SP04_NEU','SP04_UFV',
      'SP06_N','SP06_FAV','SP06_NEU','SP06_UFV','SP07_N',
      'SP07_FAV','SP07_NEU','SP07_UFV','SP08_N','SP08_FAV',
      'SP08_NEU','SP08_UFV','SP09_N','SP09_FAV','SP09_NEU',
      'SP09_UFV','SP11_N','SP11_FAV','SP11_NEU','SP11_UFV',
      'SP12_N','SP12_FAV','SP12_NEU','SP12_UFV','SP13_N',
      'SP13_FAV','SP13_NEU','SP13_UFV','SP16_N','SP16_FAV',
      'SP16_NEU','SP16_UFV','SP20_N','SP20_FAV','SP20_NEU',
      'SP20_UFV','SP22_N','SP22_FAV','SP22_NEU','SP22_UFV',
      'SP24_N','SP24_FAV','SP24_NEU','SP24_UFV','SP37_N',
      'SP37_FAV','SP37_NEU','SP37_UFV','SP40_N','SP40_FAV',
      'SP40_NEU','SP40_UFV','SP41_N','SP41_FAV','SP41_NEU',
      'SP41_UFV','SP45_N','SP45_FAV','SP45_NEU','SP45_UFV',
      'SP47_N','SP47_FAV','SP47_NEU','SP47_UFV','SP48_N',
      'SP48_FAV','SP48_NEU','SP48_UFV','SP49_N','SP49_FAV',
      'SP49_NEU','SP49_UFV','SP50_N','SP50_FAV','SP50_NEU',
      'SP50_UFV','SP53_N','SP53_FAV','SP53_NEU','SP53_UFV',
      'SP57_N','SP57_FAV','SP57_NEU','SP57_UFV','SP58_N',
      'SP58_FAV','SP58_NEU','SP58_UFV','SP61_N','SP61_FAV',
      'SP61_NEU','SP61_UFV','SP62_N','SP62_FAV','SP62_NEU',
      'SP62_UFV','SP65_N','SP65_FAV','SP65_NEU','SP65_UFV',
      'SP67_N','SP67_FAV','SP67_NEU','SP67_UFV','SP68_N',
      'SP68_FAV','SP68_NEU','SP68_UFV','SP71_N','SP71_FAV',
      'SP71_NEU','SP71_UFV','SP72_N','SP72_FAV','SP72_NEU',
      'SP72_UFV','SR01_N','SR01_FAV','SR01_NEU','SR01_UFV',
      'SR03_N','SR03_FAV','SR03_NEU','SR03_UFV','SR05_N',
      'SR05_FAV','SR05_NEU','SR05_UFV','SR07_N','SR07_FAV',
      'SR07_NEU','SR07_UFV','SR08_N','SR08_FAV','SR08_NEU',
      'SR08_UFV','SR09_N','SR09_FAV','SR09_NEU','SR09_UFV',
      'ST01_N','ST01_FAV','ST01_NEU','ST01_UFV','ST05_N',
      'ST05_FAV','ST05_NEU','ST05_UFV','SV02_N','SV02_FAV',
      'SV02_NEU','SV02_UFV','SV03_N','SV03_FAV','SV03_NEU',
      'SV03_UFV','SV04_N','SV04_FAV','SV04_NEU','SV04_UFV',
      'SV05_N','SV05_FAV','SV05_NEU','SV05_UFV','SY01_N',
      'SY01_FAV','SY01_NEU','SY01_UFV','TR01_N','TR01_FAV',
      'TR01_NEU','TR01_UFV','TR02_N','TR02_FAV','TR02_NEU',
      'TR02_UFV','TR04_N','TR04_FAV','TR04_NEU','TR04_UFV',
      'TR06_N','TR06_FAV','TR06_NEU','TR06_UFV','TR09_N',
      'TR09_FAV','TR09_NEU','TR09_UFV','TW02_N','TW02_FAV',
      'TW02_NEU','TW02_UFV','TW03_N','TW03_FAV','TW03_NEU',
      'TW03_UFV','TW04_N','TW04_FAV','TW04_NEU','TW04_UFV',
      'TW06_N','TW06_FAV','TW06_NEU','TW06_UFV','VC01_N',
      'VC01_FAV','VC01_NEU','VC01_UFV','VC02_N','VC02_FAV',
      'VC02_NEU','VC02_UFV','VC04_N','VC04_FAV','VC04_NEU',
      'VC04_UFV','VC07_N','VC07_FAV','VC07_NEU','VC07_UFV',
      'VC10_N','VC10_FAV','VC10_NEU','VC10_UFV','WE01_N',
      'WE01_FAV','WE01_NEU','WE01_UFV','WE02_N','WE02_FAV',
      'WE02_NEU','WE02_UFV','WE03_N','WE03_FAV','WE03_NEU',
      'WE03_UFV','WE07_N','WE07_FAV','WE07_NEU','WE07_UFV',
      'WE08_N','WE08_FAV','WE08_NEU','WE08_UFV','WE12_N',
      'WE12_FAV','WE12_NEU','WE12_UFV','WK01_N','WK01_FAV',
      'WK01_NEU','WK01_UFV','WK02_N','WK02_FAV','WK02_NEU',
      'WK02_UFV','WK03_N','WK03_FAV','WK03_NEU','WK03_UFV',
      'WK04_N','WK04_FAV','WK04_NEU','WK04_UFV','WK05_N',
      'WK05_FAV','WK05_NEU','WK05_UFV','WK06_N','WK06_FAV',
      'WK06_NEU','WK06_UFV','WK09_N','WK09_FAV','WK09_NEU',
      'WK09_UFV','WK11_N','WK11_FAV','WK11_NEU','WK11_UFV',
      'WL01_N','WL01_FAV','WL01_NEU','WL01_UFV','WL02_N',
      'WL02_FAV','WL02_NEU','WL02_UFV','WL03_N','WL03_FAV',
      'WL03_NEU','WL03_UFV','WS01_N','WS01_FAV','WS01_NEU',
      'WS01_UFV','WS03_N','WS03_FAV','WS03_NEU','WS03_UFV',
      'WS04_N','WS04_FAV','WS04_NEU','WS04_UFV','WS05_N',
      'WS05_FAV','WS05_NEU','WS05_UFV'
	];
    
  	//Constructor
  	//Params: current user
	public function NormsDataManager(user) {
		m_user = user;
	    m_store =  HayGroup.ReportUtil.Persistence.DataStores[ m_store_id ];
	}
  
  	//Returns an object containing norms for questions (N and FAV scores for each of the question)
  	//specified in qIdArray in exactly the same order qIdArray is for the specified cut, 
  	//- if a question does not exist in the norms db nulls will be inserted in it's place (for N and FAV)
  	//- if the demo combination is not found or any filter is applied this function will return false
  	//Params: 
  	//* normId - id of the norm to be taken out of the system
  	//* qIdArray - array containing IDs of the questions we want data for
  	//* state - reportal scripting state object (needed to check filters)
  	//* report - reportal scripting report object (needed to check democuts)
  	//* demo - demography variable data should be based on
  	//* demoCut - cut from the demography data should be based on
  	//Return val:
  	//if norm was found - array containing twice as many items as qIdArray, it will contain N and FAV for every question (e.g. [AV09_N, AV09_FAV, OM06_N, OM06_FAV]
  	//if norm was not found due to e.g. filters applied - will return false
  	public function GetNormForQuestionsByDemo(normId : String, qIdArray, state, report, demo, demoCut){
      //Run through all Filters to see if we should show norms
      var filters = FilterUtil.GetFilters (state, m_user);
      
      //Check how many filters are applied (we only support having one cut from one demo selected or no cuts selected at all)
      //We also want to get stuff like applied filter ID or cut that's selected in case there's only one cut selected from one demo
      var appliedCutsCount = 0;
      var appliedFilterId = 0;
      var selectedCut = '';
	  for (var i=0; i<filters.length; ++i) {
		var param_name = 'FILTER' + (i+1);
			
		var values = ParamUtil.GetParamCodes ( state, param_name );
       	if(values.length > 0){
       		appliedCutsCount = appliedCutsCount + values.length;
           	selectedCut = values[0];
           	appliedFilterId = i;
        }
	  }
      
      if(NormsDataManager.IsNormDemoCut(demo, demoCut, report) && appliedCutsCount == 0){
      	var normData = GetNormData(NormsDataManager.GetNormKey(normId, demo, demoCut));
        var returnArray = [];
        if(normData){
          for(var i = 0; i<qIdArray.length; i++){
              var qN = normData[qIdArray[i] + '_N'];
              var qFav = normData[qIdArray[i] + '_FAV'];
              if((qN != null && qFav != null) && (qN != '' && qFav != '')){
                  returnArray.push(qN);
                  returnArray.push(qFav);
              }
              else{
                  returnArray.push(null);
                  returnArray.push(null);
              }
          }
          return returnArray;
      	}
        else{
          return false;
        }
      }
      else{
      	return false;
      }
    }
    
  	//Returns an object containing norms for questions (N and FAV scores for each of the question)
  	//specified in qIdArray in exactly the same order qIdArray is, 
  	//- if a question does not exist in the norms db nulls will be inserted in it's place (for N and FAV)
  	//- if the filters combination is not found in the db this function will return false
  	//Params: 
  	//* normId - id of the norm to be taken out of the system
  	//* qIdArray - array containing IDs of the questions we want data for
  	//* state - reportal scripting state object (needed to check filters)
  	//* report - reportal scripting report object (needed to check democuts)
  	//Return val:
  	//if norm was found - array containing twice as many items as qIdArray, it will contain N and FAV for every question (e.g. [AV09_N, AV09_FAV, OM06_N, OM06_FAV]
  	//if norm was not found due to e.g. filters applied - will return false
  	public function GetNormForQuestions(normId : String, qIdArray, state, report){
  		//Run through all Filters to see if we should show norms
      	var filters = FilterUtil.GetFilters (state, m_user);
		
      	//Check how many filters are applied (we only support having one cut from one demo selected or no cuts selected at all)
      	//We also want to get stuff like applied filter ID or cut that's selected in case there's only one cut selected from one demo
      	var appliedCutsCount = 0;
      	var appliedFilterId = 0;
      	var selectedCut = '';
		for (var i=0; i<filters.length; ++i) {
			var param_name = 'FILTER' + (i+1);
			
			var values = ParamUtil.GetParamCodes ( state, param_name );
          	if(values.length > 0){
          		appliedCutsCount = appliedCutsCount + values.length;
              	selectedCut = values[0];
              	appliedFilterId = i;
            }
		}
      	
      	//If there is more than one cut applied then we return false because we won't be able to get a norm for it
      	var normData;
      	switch(appliedCutsCount){
          case 0:
            //get overall norm
            normData = GetNormData(NormsDataManager.GetNormKey(normId));
            break;
          case 1:
            //get norm cut by one demo in a case it's normed - if not - return false - note that taking out this cut does not have to be successfull
            if(NormsDataManager.IsNormDemoCut(filters[appliedFilterId], selectedCut, report)){
            	normData = GetNormData(NormsDataManager.GetNormKey(normId, filters[appliedFilterId], selectedCut));
            }
            else{
              return false;
            }
            break;
          default:
            //return false, norm couldn't be taken out because there are too many filters applied
            return false;
        }
      	
      	//Match norms data to the questions we got
      	var returnArray = [];
      	
      	if(normData){
          for(var i = 0; i<qIdArray.length; i++){
              var qN = normData[qIdArray[i] + '_N'];
              var qFav = normData[qIdArray[i] + '_FAV'];
              if((qN != null && qFav != null) && (qN != '' && qFav != '')){
                  returnArray.push(qN);
                  returnArray.push(qFav);
              }
              else{
                  returnArray.push(null);
                  returnArray.push(null);
              }
          }
      	}
        else{
          return false;
        }
          
      	return returnArray;
    }
  	
  	//Returns deserialized norm data in a form of an associative array
  	//Returns false if key couldn't be found for some reason
  	//It looks like this (but contains all of the questions from norms db): {AV09_N : 2000, AV09_FAV : 50}
  	//It's exact structure is defined by questionDataStructure array that can be found above in this class
  	//Params: normKey to be looked up in the database
  	function GetNormData(normKey : String){
  		//Get it out of the store
      	m_record = m_store[normKey];
      	
      	//get a record and check if we got it and return false if not
      	var dataString = m_record['DATA'];
      	if(!dataString){
      		return false;
        }
      	
      	//We got a record, let's work with it
      	var dataArray = dataString.split(',');
      	
      	//Check if the data has the same amount of cells included
      	if(dataArray.length != NormsDataManager.questionDataStructure.length){
      		throw('Number of datapoints taken out of the norms database does not match question data structure specified in NormsDataManager class. Please check your setup');
        }
      	
      	var returnData = {}; 
      	//De-serialize
      	for(var i = 0; i<dataArray.length; i++){
          	returnData[NormsDataManager.questionDataStructure[i]] = dataArray[i]; 	
        }
      	
      	//Return data object
      	return returnData;
    }
  
  	//Returns an overall normkey based on norm id
  	//Params: norm id
  	private static function GetNormKey(normId : String){
    	var returnString = normId;
      	for(var i = 0; i<Config.NormDemos.length; i++){
      		returnString = returnString + ',';
        }
      	return returnString;
    }
  
	//Returns a demo-filtered normkey based on norm id, demo code and democut code
  	//Params: norm id, demo id, democut id
  	private static function GetNormKey(normId : String, demoId : String, demoCut : String){
  		var returnString = normId;
      	for(var i = 0; i<Config.NormDemos.length; i++){
      		returnString = returnString + ',';	
          	if(demoId.ToUpper() == Config.NormDemos[i].ToUpper()){
          		returnString = returnString + demoCut;
            }
        }
      	return returnString;
    }
  
	//Checks if the demo is normed
  	//Params: demo id
  	//Returns: boolean value indicating if the demo is normed or not
  	private static function IsNormDemo ( demoId : String ) {
		demoId = demoId.toUpperCase();
		
		for (var i=0; i<Config.NormDemos.length; ++i) {
			var norm_demo = Config.NormDemos[i].toUpperCase();
			if (norm_demo == demoId) return true; // found it
		}
		return false; // not found
	}
  
  	//Checks if the demo cut is normed based on ds_norm data source
  	//Params: demoId, demoCut, report object
  	//Returns: boolean value indicating if the demo cut is normed or not
  	public static function IsNormDemoCut(demoId : String, demoCut : String, report : Report){
      	//Check if whole demo is normed
        if(NormsDataManager.IsNormDemo(demoId)){
          	//Demo is normed - check if the cut exists in the answerlist of that normed demo
          	var answers = report.DataSource.GetProject('ds_norm').GetQuestion(demoId).GetAnswers();
          	for(var i = 0; i<answers.length; i++){
              	if(answers[i].Precode == demoCut){
              		return true;
              	}
            }
        }
      	
      	return false;
    }
}