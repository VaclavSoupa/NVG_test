//Comparator class
//It should contain basic information for a comparator like N and fav score
//It should be able to provide a display value and should be able to calculate it's own stat sig
//It should  be aware of minimum N and should apply it to itself, but additionally it should provide a function for other functions to suppress it's score
//The idea is that this class will only be used inside a question class
class HgComparator{
 
  private var qId = '';
  private var validN = 0;
  private var favAbsolute = 0;
  private var favDifference = 0;
  private var unfavAbsolute = 0;
  private var unfavDifference = 0;
  private var suppressed = false;
  private var statSig = {fav: SigTest.Codes.None, unfav: SigTest.Codes.None};
  public var distribution = [];
  
  //Constructor - provides a suppressed comparator
  //Params: id of the question it compares to
  public function HgComparator(questionId : String){
  	qId = questionId;
    Suppress();
  };
  
  //Constructor
  //Params: id of the question, N of the question it compares to, 
  //fav and unfav of the question it compares to, distribution-data for this comparator, control boolean because we want this contructor to be different than the other one - TODO: FIX
  public function HgComparator(questionId : String, qN : int, qFav : int, qUnfav : int, controlBool : Boolean, dist){
  	qId = questionId;
    distribution = dist;
    Calculate(qN, qFav, qUnfav, dist, controlBool);
  }
  
  //Constructor
  //Params: id of the question, N of the question it compares to, 
  //fav of the question it compares to, n of the comparator, fav of the comparator
  public function HgComparator(questionId : String, qN : int, qFav : int, compN : int, compFav : int){
  	qId = questionId;
    Calculate(qN, qFav, compN, compFav);
  }
  
  //Returns true if a comparator is suppressed
  public function IsSuppressed(){
  	return suppressed;
  }
  
  //Sets the suppress flag
  public function Suppress(){
  	suppressed = true;
    statSig.fav = SigTest.Codes.None;
    statSig.unfav = SigTest.Codes.None;
  }
  
  //Returns valid N
  public function GetValidN(){
  	return validN;
  }
  
  //Returns the fav score
  //Params: boolean value indicating if you want to get the absolute or diff from total score
  public function GetScore(absolute : Boolean){
    if(!suppressed){
      if(absolute){
    	return favAbsolute;
      }
      else{
        return favDifference;
      }
    }
    else
      return '-';
  }
  
  //Returns the unfav score
  //Params: boolean value indicating if you want to get the absolute or diff from total score
  public function GetUnfavScore(absolute : Boolean){
    if(!suppressed){
      if(absolute){
    	return unfavAbsolute;
      }
      else{
        return unfavDifference;
      }
    }
    else
      return '-';
  }
  
  //Returns stat. sig code
  public function GetStatSigCode(){
  	return statSig.fav;
  }
  
  //Returns boolean value indicating if the question is statistically significant or not
  public function IsSignificant(){
  	return (statSig.fav != SigTest.Codes.None);
  }
  
  //Returns display value (score + stat sig) or '-' if suppressed
  //Params: boolean value indicating if you want to get the absolute or diff from total score
  public function GetDisplayValue(absolute : Boolean, unfav : Boolean){
    var s = GetScore(absolute);
    
    if(!suppressed && !TableContent.isNotANumber(s)){
        if(statSig.fav != SigTest.Codes.None){
            return s + Config.SigTest.Suffix;
        }
        else{
            return s;
        }
    }
    else{
    	return '-';
    }
  }
  
  //Calculates absolute fav, n scores based on the distribution,
  //statistical significance and fav difference to the question
  //Params: n of the question it compares to, fav of the question it compares to and
  //comparators distribution
  private function Calculate(qN : int, qFav : int, qUnfav : int, dist, controlBool : Boolean){
    if(dist.length == 0){
      throw('Cannot calculate comparator. Distributions length == 0 for question: ' + qId);
    }
   
    var distMap = Config.GetDistributionIndexes_Singles(qId);
        
    //fav count
    var countFav = 0;
    for(var i = 0; i<distMap.Fav.length; i++){
         countFav += dist[distMap.Fav[i]];
    }
    
    //neu count
    var countNeu = 0;
    for(var i = 0; i<distMap.Neu.length; i++){
         countNeu += dist[distMap.Neu[i]];
    }
      
    //unfav count
    var countUnfav = 0;
    for(var i = 0; i<distMap.Unfav.length; i++){
         countUnfav += dist[distMap.Unfav[i]];
    }
    
    validN = countFav + countNeu + countUnfav;
 
    //Apply min N
    if(validN >= Config.Privacy.Table.MinN){ 
      //fav absolute
      favAbsolute = parseInt((100*countFav/validN).toFixed(0));  
      
      //fav diff
      favDifference = qFav - favAbsolute;
      
      //stat sig fav
      StatSig(qN, qFav);
      
      
      //unfav absolute
      unfavAbsolute = parseInt((100*countUnfav/validN).toFixed(0));  
      
      //unfav diff
      unfavDifference = qUnfav - unfavAbsolute;
      
      //stat sig unfav
      StatSig(qN, qUnfav, false);
    }
    else{
      Suppress();
    }
  }
  
  //Sets absolute fav, n scores and calculates
  //statistical significance and fav difference to the question
  //Params: n of the question it compares to, fav of the question it compares,
  //N of the comparator, fav of the comparator
  private function Calculate(qN : int, qFav : int, compN, compFav : int){
    //ValidN
    validN = compN;
	
    //Apply min N
    //if(validN >= Config.Privacy.Table.MinN){
      //fav absolute
      favAbsolute = compFav;  
      
      //fav diff
      favDifference = qFav - favAbsolute;
      
      //stat sig
      StatSig(qN, qFav);
    /*}
    else{
      Suppress();
    }*/
  }
  
  //Calculates stat sig for this comparator
  //Params: n of the question we compare to, fav of the question we compare to, boolean value indicating if fav or unfav sig should be calculated
  private function StatSig(qN : int, qFav : int, fav){
    if(fav == null || typeof fav == 'undefined')
      fav = true;
    
  	//stat sig
    if(fav){
      var isStatSignificant = SigTest.Run(qN, qFav, parseInt(validN), parseInt(favAbsolute), false);
      if(isStatSignificant){
        if(Config.SigTest.BackgroundColor.Enabled){
          if(favAbsolute > qFav){
              statSig.fav = SigTest.Codes.Negative;
          }
          else{
              statSig.fav = SigTest.Codes.Positive;
          }
        }
        else{
          if(favAbsolute > qFav){
              statSig.fav = SigTest.Codes.NegativeNoBackgroundColor;
          }
          else{
              statSig.fav = SigTest.Codes.PositiveNoBackgroundColor;
          }
        }
      }
    }
    else{
      var isStatSignificant = SigTest.Run(qN, qFav, parseInt(validN), parseInt(unfavAbsolute), false);
      if(isStatSignificant){
        if(Config.SigTest.BackgroundColor.Enabled){
          if(unfavAbsolute < qFav){
              statSig.unfav = SigTest.Codes.Negative;
          }
          else{
              statSig.unfav = SigTest.Codes.Positive;
          }
        }
        else{
          if(unfavAbsolute < qFav){
              statSig.unfav = SigTest.Codes.NegativeNoBackgroundColor;
          }
          else{
              statSig.unfav = SigTest.Codes.PositiveNoBackgroundColor;
          }
        }
      }
    }
  }
  
  //Calculates stat sig for a set of data provided
  //Params: n of the question we compare to, fav of the question we compare to, boolean value indicating if fav or unfav sig should be calculated
  public static function StatSig(qN : int, qFav : int, qUnfav, compN, compFav, compUnfav, fav : Boolean){
    if(fav == null || typeof fav == 'undefined')
      fav = true;
    
    var returnCode = SigTest.Codes.None;
  	//stat sig
    if(fav){
      var isStatSignificant = SigTest.Run(qN, qFav, parseInt(compN), parseInt(compFav), false);
      if(isStatSignificant){
        if(Config.SigTest.BackgroundColor.Enabled){
          if(compFav > qFav){
              returnCode = SigTest.Codes.Negative;
          }
          else{
              returnCode = SigTest.Codes.Positive;
          }
        }
        else{
          if(compFav > qFav){
              returnCode = SigTest.Codes.NegativeNoBackgroundColor;
          }
          else{
              returnCode = SigTest.Codes.PositiveNoBackgroundColor;
          }
        }
      }
    }
    else{
      var isStatSignificant = SigTest.Run(qN, qUnfav, parseInt(compN), parseInt(compUnfav), false);
      if(isStatSignificant){
        if(Config.SigTest.BackgroundColor.Enabled){
          if(compUnfav < qUnfav){
              returnCode = SigTest.Codes.Negative;
          }
          else{
              returnCode = SigTest.Codes.Positive;
          }
        }
        else{
          if(compUnfav < qUnfav){
              returnCode = SigTest.Codes.NegativeNoBackgroundColor;
          }
          else{
              returnCode = SigTest.Codes.PositiveNoBackgroundColor;
          }
        }
      }
    }
    
    return returnCode;
  }
  
}