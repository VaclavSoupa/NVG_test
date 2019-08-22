class Page_NetPromoterDetails {
	
    static var Codes = null;
	
	static function GetCodes ( report ) {
      
      if ( Codes == null) {
	
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
	
		Codes = {
			Detractors: detractors,
	        Passives: passives,
			Promoters: promoters
		};
      }
      return Codes;
	}
}