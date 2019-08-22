class Page_Comments {
 
  static function ValidN( report ) {
    return  report.TableUtils.GetCellValue('N', 1, 1).Value;
  }
  
  static function PrivacyViolation ( report, user, confirmit ) {
    if(Config.GetCommentQuestionIdsByNodeId(user.PersonalizedReportBase , confirmit).length == 0)
      return true;
    
	return  ( ValidN( report ) < Config.Privacy.Verbatim.MinN );
  }
  
  static function ExpressionValidN ( report, state ) {
    var y;
	var x = '[N]';

	var verbatim_qid = ParamUtil.GetParamCode(state, 'VERBATIM');

    var filter = 'NOT (' + verbatim_qid + '="") AND NOT(ISNULL(' + verbatim_qid + '))';
    y = '[SEGMENT]{expression:' + report.TableUtils.EncodeJsString ( filter ) + '}';

	var expr = [y, x].join('^');
    
    return expr;
  }
}