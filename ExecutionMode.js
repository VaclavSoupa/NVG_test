class ExecutionMode
{
  
  static function isPdfBlackWhite ( state ) {
    return isPDF (state) && Config.Export.PDF.OptimizeForBlackAndWhitePrinting; 
  }


  static function isWeb(state)
  {
    if(state.ReportExecutionMode == ReportExecutionMode.Web)
	{
	  return true;
	}
	else
	{
      return false;
	}
  }

  static function isPowerPoint(state)
  {
    if(state.ReportExecutionMode == ReportExecutionMode.PowerPointExport)
	{
	  return true;
	}
	else
	{
      return false;
	}
  }

  static function isPDF(state)
  {
    if(state.ReportExecutionMode == ReportExecutionMode.PdfExport)
	{
	  return true;
	}
	else
	{
      return false;
	}
  }  
  
  static function isExcel(state)
  {
    if(state.ReportExecutionMode == ReportExecutionMode.ExcelExport)
	{
	  return true;
	}
	else
	{
      return false;
	}
  }
}