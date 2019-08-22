class ActionPlanning {

  static function LoadHitList (report, state, hitlist, fields, isSearchable, isLink) {

		var pu = new ParamUtil();
		var isCompactView = false;

		var p : Project = report.DataSource.GetProject('ds_ap');
    
    	hitlist.Columns.Clear();
    
		hitlist.ShowSingleView = false;
		hitlist.ExcludeIdColumn = false;
		var columns = [];

		for (var i=0; i<fields.length; ++i) {
			if (true) {
				var variable_id = fields[i];
				var codes = variable_id.split(".");
				var precode = (codes.length>1) ? codes[1] : null;
				var qe = (precode == null)
					? p.CreateQuestionnaireElement(codes[0])
					: p.CreateQuestionnaireElement(codes[0], codes[1]);

				var idx = columns.length;
				columns.push (new HitListColumn());
				columns[idx].QuestionnaireElement = qe;
				
				columns[idx].IsLink = (variable_id != 'url' && isLink); //true;
              
              switch (variable_id.toLowerCase()) {
                  
                // Check for special cases (Local Dimensions)
                case 'topic_improvement':
                case 'item':
                  if ( Config.ActionPlanning.LocalDimensions.Searchable)
                    columns[idx].IsSearchable = YesNoDefaultValue.Yes;
                  else
                    columns[idx].IsSearchable = YesNoDefaultValue.No;
                  break;
                  
                  default:
                    columns[idx].IsSearchable = isSearchable;
              }			  
				columns[idx].IsSortable = YesNoDefaultValue.No;
				hitlist.Columns.Add(columns[idx]);
			}
		}		
	}
  

}