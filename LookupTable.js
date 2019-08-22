class LookupTable {
 
  // Exception Handler for NormId mapping

  
  // Mapping between Question ID and Question No

  private static var QuestionIdToQuestionNumberMap = {
		'SD03':1,
        'SD04':2,
        'SD05':3,
        'GP07':4,
        'GP12':5,
        'LD04':6,
        'LD09':7,
        'IV04':8,
        'DM02':9,
        'VC04':10,
        'PE03':11,
        'PE06':12,
        'PE09':13,
        'CP14':14,
        'GP09':15,
        'TW06':16,
        'TW04':17,
        'GP10':18,
        'WL01':19,
        'ER01':20,
        'RC01':21,
        'ST01':22,
        'IV02':23,
        'WE01':24,
        'WS03':25,
        'DC11':26,
        'RE01':27,
        'QS02':28,
        'QS01':29,
        'QS03':30,
        'QS16':31,
        //'QS02':32,
        'TR01':33,
        'TR09':34,
        'TR04':35,
        'AV15':36,
        'AV09':37,
        'SP12':38,
        'CP11':39,
        'CP12':40,
        'BN01':41,
        'WE08':42,
        'WE12':43,
        'JS05':44,
        'JS02':45,
        'OM11':46,
        'OM12':47,
        'OS02':48,
        'OM01':49,
        'OM06':50,
        'CQ50':51,
        'CQ51':52,
        'CQ52':53,
        'CQ53':54,
        'CQ54':55,
        'CQ55':56,
        'CQ56':57,
        'CQ57':58,
        'CQ58':59,
        'CQ59':60,
        'CQ60':61,
        'CQ61':62,
        'CQ62_1':63,
        'CQ62_2':63,
        'CQ62_3':63,
        'CQ62_4':63,
        'CQ62_5':63,
        'CQ62_6':63,
        'CQ62_7':63,
        'CQ62_8':63,
        'CQ62_9':63,
        'CQ62_10':63,
        'CQ62_11':63,
        'CQ62_12':63,
        'CQ62_13':63,
        'CQ62_14':63,
        'CQ62_15':63,
        'CQ62_16':63,
        'CQ62_17':63,
        'CQ62_18':63,
        'CQ62_19':63,
        'CQ62_20':63,
        'CQ62_21':63,
        'CQ62_22':63,
        'CQ63':64,
        'Comm1':65,
        'Comm1Theme':66,
        'Comm2':67,
        'Comm2Theme':68,
        'Comm3':69,
        'Comm3Theme':70,
        'CQ64':71,
        'NP01':72
	};
  
  static function GetNormVariableIdByQuestionId (qid) {
  	var norm_id = Config.Maps.QuestionIdToNormVariableId [qid];
    return (norm_id == null) ? qid : norm_id;
  }
 
  static function GetQuestionNumberByQuestionId (qid) {
    
	var qno = QuestionIdToQuestionNumberMap [qid];
	return (qno ==  null) ? qid : qno;
  
	}
}