class Verbatims {

	static function ThemesTable (report, table, verbatim_qid) {
        var theme_qid = verbatim_qid + 'Theme';
        var project = report.DataSource.GetProject('ds0');
        var question : Question = project.GetQuestion ( theme_qid );
        
        var properties = [];
        
        properties.push ('totals:false');
        if (question.QuestionType == QuestionType.Multi)
          properties.push ('collapsed:true');

		table.AddHeaders (report, 'ds0', theme_qid + '{' + properties.join(';') + '} ^ [N]{hideheader:true}/[SEGMENT]{label:" "} + [CHART]{id:barchart; Label:" "} + [CONTENT]{label:" "}' );

		// TABLE SORTING
		table.Sorting.Rows.Enabled = true;
		table.Sorting.Rows.Position = 1;
		table.Sorting.Rows.Direction = TableSortDirection.Descending;
      
      	// EXCLUDE LAST OPTION FROM SORTING ("OTHER") IF CONFIG SETTING IS SET TO TRUE
	    table.Sorting.Rows.FixedFromEnd = (Config.Widgets.TopThemes.ExcludeLastTheme == true) ? 1 : 0;

		var bar : HeaderChartCombo = HelperUtil.GetHeaderById(table, 'barchart');

		bar.TypeOfChart = ChartComboType.Bar;
		bar.Size = 300;
		bar.Thickness = "18px";
		   
		var c1 : ChartComboValue = HelperUtil.CCV (ResourceText.Text(report,'labels','Distribution'), '#00b4eb', 'CELLV(col-1,row)');
			
		bar.Values = [c1];
	}

}