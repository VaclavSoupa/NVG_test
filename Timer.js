class Timer{

  private var startTime;
  
  public function Timer(){
    startTime = new Date();
  }
  
  public function GetElapsed(){
    var current = new Date();
    return (current.getTime() - startTime.getTime())/1000;
  }
  
  public static function TimeTable(report, table){
  	var start = new Date();
    
    report.TableUtils.GetCellValue(table, 1,1);
    
    var end = new Date();
    
    var x = table + ' took: ' + ((end.getTime() - start.getTime())/1000) + 's<br/>';
    
    return x;
  }
}