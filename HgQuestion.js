//Class used to store info of one question
//It should be used to move question data around
//It should be used as an output of QueryManager
//It should contain all relevant question information:
//		validN, full-distribution, calculated scores (fav, neu, unfav), 
//		id of a question, Ns and fav scores of all comparators
//It should do the basic min N suppression
class HgQuestion{
  private var id = '';
  private var validN = 0; //WARNING: MINIMUM N DOESN'T GET APPLIED TO THIS VARIABLE BECAUSE THIS ONE IS NEEDED FOR STAT. SIG.; TO GET A DISPLAY N USE tableValidN VARIABLE
  public var tableValidN = '-';
  public var text = '';
  public var distribution = [];
  public var distributionPercent = [];
  private var scores = {fav: '-', neu: '-', unfav: '-'};
  public var norms = []; //TODO: find a better way of storing comparators (proly using some enum)
  public var internalComps = []; //TODO: find a better way of storing comparators (proly using some enum)
  private var strengthScore = 0;
  public var isUnderMinimumN = true;
  public var answerCount = 0;
  private var isKDAflag = false;
  private var wasSOcalculated = false;
  
  //Basic constructor
  //Params: ID of the question
  public function HgQuestion(questionId : String){
  	id = questionId;
  }
  
  //Constructor
  //Params: ID of the question, distributions array
  public function HgQuestion(questionId : String, dist : int[]){
  	id = questionId;
    distribution = dist;
    Calculate();
  }
  
  //Constructor
  //Params: ID of the question, confirmit report object, text of the question, distributions array, confirmit report object
  public function HgQuestion(questionId : String, report, qText : String, dist : int[]){
  	id = questionId;
    text = HelperUtil.ReplaceWildCards(report, qText);
    distribution = dist;
    Calculate();
  }
  
  //Returns S&O score
  //Calculates it if it wasn't calculated before (since we need internal comps for this it cannot be a part of normal calc)
  //Returns - SO score (floating point number) if question is above min N, null in any other case
  public function GetSO(){
    //Check the calculation flag and calculate SO score if needed
    if(!wasSOcalculated){
      //S&O algorithm - we shouldn't bother calculating if the question is under min N
      if(!isUnderMinimumN){
        var favThreshold = 65; //We could make it a property in config if needed
        var unfavThreshold = 19; //We could make it a property in config if needed
        
        //Take fav into account
        if(scores.fav>favThreshold){
        	strengthScore = strengthScore + (scores.fav - favThreshold);
        }
        
        if(scores.fav < favThreshold && scores.unfav>unfavThreshold){
        	//take unfav into account
          	strengthScore = strengthScore + (unfavThreshold - scores.unfav);
        }
        
        //Check first internal hierarchy based comp (it's indexed 0 here if taken out of MAIN table)
        if(internalComps[0].IsSignificant()){
          	var intScore = internalComps[0].GetScore(false);
          	if(!TableContent.isNotANumber(intScore)){
          		strengthScore = strengthScore + intScore;
            }
        }
        
        //Check norm indicated in config
        var normUsedForSO = Config.Algorithm.NormUsed;
        if(norms.length > 0)
          if(normUsedForSO > norms.length - 1)
              throw('You can\'t use norm number: ' + (normUsedForSO+1) + ' for S&O when there are only ' + norms.length + ' norms included. Change Config.Algorithm.NormUsed setting.');
        
        if(norms.length > 0){
          if(norms[normUsedForSO].IsSignificant()){
              var normScore = norms[normUsedForSO].GetScore(false);
              if(!TableContent.isNotANumber(normScore)){
                  strengthScore = strengthScore + normScore;
              }
          }
        }
        
        //Apply KDA multiplier if it's a KDA
        if(isKDAflag){
        	strengthScore = strengthScore * Config.Algorithm.KeyDriverMultiplier;
        }
        
        //Tiebreakers
        //1
        var p = (scores.fav - scores.unfav)/1000;
        if(!TableContent.isNotANumber(p)){
        	strengthScore = strengthScore + p;
        }
        //2
        p = scores.fav/1000000;
        if(!TableContent.isNotANumber(p)){
        	strengthScore = strengthScore + p;
        }
        //3
        p = (1000 - LookupTable.GetQuestionNumberByQuestionId(id))/1000000000;
        if(!TableContent.isNotANumber(p)){
        	strengthScore = strengthScore + p;
        }
      }
      else{
        strengthScore = null;
      }
      wasSOcalculated = true;
    }
    return strengthScore;
  }
  
  //set the KDA flag to true
  public function SetKDA(){
  	isKDAflag = true;	
  }
  
  //returns KDA flag
  public function IsKDA(){
  	return isKDAflag;
  }
  
  //Returns suppressed status
  public function IsSuppressed(){
  	return isUnderMinimumN;
  }
  
  //Returns a value that can be fed into first column in the table (QID or Qnumber from LookupTable)
  public function GetDisplayId(){
  	return LookupTable.GetQuestionNumberByQuestionId(id) + '.';
  }
  
  // JA (template 21.0) - function below added so we will be able to get the display number
  //					  in order to sort the questions on IBT properly
  //Returns question number without the dot at the end
  public function GetDisplayNumber(){
  	return LookupTable.GetQuestionNumberByQuestionId(id);
  }
  
  //Adds a norm to norms array
  //Params: norm N, norm fav
  public function AddNorm(normN, normFav){
    if(isUnderMinimumN){
    	norms.push(new HgComparator(id));
    }
    else{
        if(normN == null || normFav == null){
          norms.push(new HgComparator(id));
        }
        else{
          norms.push(new HgComparator(id, validN, scores.fav, normN, normFav));
        }
    }
  }
  
  //Adds an internal comparator to internalComps array
  //Params: distribution of this internal comparator
  public function AddInternalComp(dist){
    if(isUnderMinimumN){
    	internalComps.push(new HgComparator(id));
    }
    else{
  		internalComps.push(new HgComparator(id, validN, scores.fav, scores.unfav, false, dist));
    }
  }
  
  //Sets the distribution and calculates whatever's necessary
  public function SetDistribution(dist : int[]){
  	distribution = dist;
    Calculate();
  }
  
  //Returns scores for this question
  public function GetScores(){
  	return scores;
  }
  
  //Returns Valid N
  public function GetValidN(){
  	return validN;
  }
  
  //Returns Id
  public function GetId(){
  	return id;
  }
  
  //Calculates valid N and scores based on distribution map from Config
  //Applies min N
  private function Calculate(){
    if(distribution.length == 0){
      throw('Cannot calculate question. Full distribution not set for question: ' + id);
    }

    //scores      
    var distMap = Config.GetDistributionIndexes_Singles(id);
      	
    //fav count
	var countFav = 0;
    for(var i = 0; i<distMap.Fav.length; i++){
         countFav += distribution[distMap.Fav[i]];
         answerCount++;
    }
      	
    //neu count
	var countNeu = 0;
    for(var i = 0; i<distMap.Neu.length; i++){
         countNeu += distribution[distMap.Neu[i]];
         answerCount++;
    }
      	
    //unfav count
	var countUnfav = 0;
    for(var i = 0; i<distMap.Unfav.length; i++){
         countUnfav += distribution[distMap.Unfav[i]];
         answerCount++;
    }
      
    //Valid N
    validN = countFav + countNeu + countUnfav;
      	
    //Apply minimum N
    if(validN >= Config.Privacy.Table.MinN){
      	isUnderMinimumN = false;
  
      	//valid N to show in tables
      	tableValidN = validN;
      
      	//Calculate percentiles for full distribution
        for(var i = 0; i<answerCount; i++){
            distributionPercent.push(parseInt((100*distribution[i]/validN).toFixed(0)));
        }
      
      	//Scores
      	scores.fav = parseInt((100*countFav/validN).toFixed(0));
      	scores.neu = parseInt((100*countNeu/validN).toFixed(0));
      	scores.unfav = parseInt((100*countUnfav/validN).toFixed(0));
    }
    else{
    	SuppressScores();
    }
  }
  
  //Sets calculated scores to "-"
  private function SuppressScores(){
  	scores.fav = '-';
    scores.neu = '-';
    scores.unfav = '-';
    tableValidN = '-';
    strengthScore = null;
    isUnderMinimumN = true;
    //Calculate percentiles for full distribution
    distributionPercent = [];
    for(var i = 0; i<distribution.length; i++){
    	distributionPercent.push('-');
    }
    //TODO: Might want to add suppression of comparators here as well in the future
  }
}