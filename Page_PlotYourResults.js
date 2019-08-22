class Page_PlotYourResults{
	static function PlotCount ( report, state, user ) {
      var demo = ParamUtil.Selected(report, state, 'DEMOGR', user);
      if (demo.Code != Config.Hierarchy.VariableId)
	 	return report.DataSource.GetProject('ds0').GetQuestion(demo.Code).GetAnswers().length;
      else
        return 0;
  	}
}