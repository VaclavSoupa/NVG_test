//Dimension class
//Should contain it's own score, some sort of validN (although I doubt we'll use it) based on the biggest validN found inside any of it's questions
//It should contain a questions array that has HgQuestions objects inside
//It should suppress the data if at least one question is suppressed and suppress comparator score if at least one comp is suppressed
class HgDimension{
	private var id = '';
  	public var questions : HgQuestion[] = [];
  	public var internalComps = [];
  	public var norms = [];
  	public var shouldBeHidden = false;
  	private var scores = {fav: '-', neu: '-', unfav: '-'};
  	private var validN = '-';
  	private var suppressed = false;
  	private var title = '';
  
	//Constructor
  	//Params: Id of the dimension
  	public function HgDimension(dimId : String){
  		id = dimId;
    }
  
  	//Constructor
  	//Params: Id of the dimension, title of the dimension, array of questions that will be a part of this dimension
  	public function HgDimension(dimId : String, dimTitle : String, dimQuestions : HgQuestion[]){
  		id = dimId;
      	questions = dimQuestions;
      	title = dimTitle;
      	Calculate();
    }
  
  	//Returns the title of this dimension
  	public function GetTitle(){
  		return title;
    }
  	
  	//Returns Valid N
  	public function GetValidN(){
  		return validN;
  	}
  
  	//Returns scores
  	public function GetScores(){
  		return scores;
    }
  	
  	//Returns ID
  	public function GetId(){
  		return id;
    }
  
  	//Returns suppressed status
  	public function IsSuppressed(){
  		return suppressed;
    }
  
  	//Lets you assign a set of question to this dimension
  	//Should be used only in case you used the constructor that takes Id as the only parameter
  	public function SetQuestions(dimQuestions : HgQuestion[]){
  		questions = dimQuestions;
      	Calculate();
    }
  
  	//Calculates Valid N, Fav, Neu, Unfav, Comparators, suppression
  	private function Calculate(){
      	if(questions.length == 0){
      		suppressed = true;
            //Make sure we add comparators here
          	//WTF THIS DOESN'T EVEN WORK DUDE
            /*for(var j = 0; j<questions[i].internalComps.length; j++){
            	internalComps.push(new HgComparator(id));
            }
            for(var j = 0; j<questions[i].norms.length; j++){
            	norms.push(new HgComparator(id));
            }*/
            Suppress();
        }
      
    	//Check if we should even bother to calculate anything - check if any of the questions below is suppressed
      	// JA (template 21.0) - won't do this in case we wan't to calculate the dimension without the suppressed questions
      	if (!Config.GlobalQsAndDimsSettings.ExcludeSuppressedFromDimensionCalculations) {
            for(var i = 0; i<questions.length; i++){
                if(questions[i].isUnderMinimumN){
                  suppressed = true;
                  //Make sure we add comparators here
                  for(var j = 0; j<questions[i].internalComps.length; j++){
                    internalComps.push(new HgComparator(id));
                  }
                  for(var j = 0; j<questions[i].norms.length; j++){
                    norms.push(new HgComparator(id));
                  }
                  Suppress();
                  break;                
                }
            }
        }
      	
      	//Check if we should even bother to calculate anything - check if we specifically said in config we want to suppress this dim
      	var allDims = Config.Dimensions.concat(Config.LocalDimensions);
      	for(var i=0; i<allDims.length; i++){
          	if(allDims[i].Id == id){
              if(allDims[i].SuppressScoring != null && allDims[i].SuppressScoring != 'undefined' 
                 && allDims[i].SuppressScoring == true && questions.length > 0){
              	suppressed = true;
                //Make sure we add comparators here
                for(var j = 0; j<questions[0].internalComps.length; j++){
                  internalComps.push(new HgComparator(id));
                }
                for(var j = 0; j<questions[0].norms.length; j++){
                  norms.push(new HgComparator(id));
                }
                Suppress();
                break;
              }
            }
        }
      
      	if(!suppressed){
      		//We're not suppressed, let's calculate score and comparators
          	//For score we simply add all of the scores for questions and divide by the number of questions
          	//For validN we use the biggest validN we can find
          	//For comparators we do the same thing (scores/numberOfQ and biggestValidN), but in addition to that
          	//We need to check for comp. suppression (if any of comps is suppressed then we suppress it here as well)
          	var favSum = 0;
          	var neuSum = 0;
          	var unfavSum = 0;
          	var biggestN = 0;
          	var uncalculatedQuestionCount = 0;
          	var atLestOneCalculated = false;
          
          	//Create an array indicating which questions should be calculated in this dimension
          	// JA (template 21.0) - part below updated for case we want to calculate dimension without the suppressed questions included
          	var shouldBeCalculated = {};
          	for(var i = 0; i<questions.length; i++){
              	// The question should be calculated until we find a reason to exclude it
          		shouldBeCalculated[questions[i].GetId()] = true;
              	// This has to be here for case we wan't to calculate dimension with suppressed questions
              	// and we just need to exclude those suppressed Qs from calculation
              	if (questions[i].isUnderMinimumN) {
                	shouldBeCalculated[questions[i].GetId()] = false;
                    uncalculatedQuestionCount++;
                }
              	for(var j=0; j<Config.Scoring.Variables.ExcludeDimensionScoring.length; j++){
                  	// In case the question is already exluded we don't want to exclude it again
                  	// as we don't want to increse "uncalculatedQuestionCount" twice for the same question
                  	if ((Config.Scoring.Variables.ExcludeDimensionScoring[j] == questions[i].GetId()) && shouldBeCalculated[questions[i].GetId()]) {
                  		shouldBeCalculated[questions[i].GetId()] = false;
                      	uncalculatedQuestionCount++;
                    }
                }
            }
          
          	//Dimension score
          	for(var i = 0; i<questions.length; i++){
              	if(shouldBeCalculated[questions[i].GetId()]){
                  var s = questions[i].GetScores();
                  atLestOneCalculated = true;
                  favSum = favSum + s.fav;
                  neuSum = neuSum + s.neu;
                  unfavSum = unfavSum + s.unfav;
                  var n = questions[i].GetValidN();
                  if(n>biggestN){
                      biggestN = n;
                  }
                }
            }
          	
          	// JA (template 21.0) - code section below had to be covered by this condition due to the new calculation functionalities
          	if (atLestOneCalculated) {
                //Set scores and N for dimension itself
                scores.fav = parseInt((favSum/(questions.length - uncalculatedQuestionCount)).toFixed(0));
                scores.neu = parseInt((neuSum/(questions.length - uncalculatedQuestionCount)).toFixed(0));
                scores.unfav = parseInt((unfavSum/(questions.length - uncalculatedQuestionCount)).toFixed(0));
                validN = biggestN;
                
                //Comparators
                //Internal
                //Add fav scores and Ns together (or suppress if at least one value in a column is suppressed)
                //Note we're assuming all questions will have the same number of elements in internalComps and norms arrays
                for(var i = 0; i<questions[0].internalComps.length; i++){
                    var shouldBeSuppressed = false;
                    var biggestCompN = 0;
                    var favCompSum = 0;
                    
                    for(var j = 0; j<questions.length; j++){
                        if(shouldBeCalculated[questions[j].GetId()]){
                          //Check suppression
                          if(questions[j].internalComps[i].IsSuppressed()){
                              shouldBeSuppressed = true;
                              break;
                          }
                          else{
                              //Not suppressed - add fav and check if validN is bigger than our biggest
                              favCompSum = favCompSum + questions[j].internalComps[i].GetScore(true);
                              var compN = questions[j].internalComps[i].GetValidN();
                              if(compN > biggestCompN){
                                  biggestCompN = compN;
                              }  
                          }
                        }
                    }
                    
                    //If we should be suppressed then suppress the comp
                    if(shouldBeSuppressed || uncalculatedQuestionCount == questions.length){
                        var c = new HgComparator(id);
                        internalComps.push(c);
                    }
                    else{
                        var compFav = parseInt((favCompSum/(questions.length - uncalculatedQuestionCount)).toFixed(0));
                        var c2 = new HgComparator(id, validN, scores.fav, biggestCompN, compFav);
                        internalComps.push(c2);
                    }
                }
              
                //External
                //Add fav scores and Ns together (or suppress if at least one value in a column is suppressed)
                //Note we're assuming all questions will have the same number of elements in internalComps and norms arrays
                for(var i = 0; i<questions[0].norms.length; i++){
                    var shouldBeSuppressed = false;
                    var biggestCompN = 0;
                    var favCompSum = 0;
                    
                    for(var j = 0; j<questions.length; j++){
                        if(shouldBeCalculated[questions[j].GetId()]){
                          //Check suppression
                          if(questions[j].norms[i].IsSuppressed()){
                              shouldBeSuppressed = true;
                              break;
                          }
                          else{
                              //Not suppressed - add fav and check if validN is bigger than our biggest
                              favCompSum = favCompSum + questions[j].norms[i].GetScore(true);
                              var compN = questions[j].norms[i].GetValidN();
                              if(compN > biggestCompN){
                                  biggestCompN = compN;
                              }  
                          }
                        }
                    }
                    
                    //If we should be suppressed then suppress the comp
                    if(shouldBeSuppressed || uncalculatedQuestionCount == questions.length){
                        var norm = new HgComparator(id);
                        norms.push(norm);
                    }
                    else{
                        var normFav = parseInt((favCompSum/(questions.length - uncalculatedQuestionCount)).toFixed(0));
                        var norm2 = new HgComparator(id, validN, scores.fav, biggestCompN, normFav);
                        norms.push(norm2);
                    }
                }
            }
          	else {
              	// JA (template 21.0) - there's no calculated question in the dimension so we need to run through the standard suppression
            	suppressed = true;
                //Make sure we add comparators here
                for(var j = 0; j<questions[0].internalComps.length; j++){
                  internalComps.push(new HgComparator(id));
                }
                for(var j = 0; j<questions[0].norms.length; j++){
                  norms.push(new HgComparator(id));
                }
                Suppress();
            }
    	}
    }
    
  	
  	//Returns a value that can be fed into first column in the table (QID or Qnumber from LookupTable)
  	public function GetDisplayId(){
  		return '◊';
  	}
  
  	//Suppresses score of the dimension
  	private function Suppress(){
  		scores.fav = '-';
      	scores.neu = '-';
      	scores.unfav = '-';
      	validN = '-';
      	for(var i = 0; i<internalComps.length; i++){
      		internalComps[i].Suppress();
        }
      	for(var i = 0; i<norms.length; i++){
      		norms[i].Suppress();
        }
    }
}