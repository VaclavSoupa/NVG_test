//This class represents a non-scored question
//It should contain all of the necessary basic information - ID, Text, full distribution, percentage scores
//It should also correctly apply minimum N and hold comparators in
class HgNonScoredQuestion{
  	private var id : String = 'N/A';
  	public var text : String = 'N/A';
  	private var distribution = [];
  	public var distributionTexts = [];
    public var precodes = [];
  	private var percentages = [];
  	public var norms = []; //TODO: find a better way of storing comparators (proly using some enum), 
  						   //the structure should be the following: [{distribution: [array of HgComparator objects - one for each answer option]}, 
  						   //{distribution: [array of HgComparator objects - one for each answer option]}]
  	public var internalComps = []; //TODO: find a better way of storing comparators (proly using some enum)
  								   //the structure should be the following: [{distribution: [array of HgComparator objects - one for each answer option]}, 
  						   		   //{distribution: [array of HgComparator objects - one for each answer option]}]
  	private var validN = 0;
  	private var suppressed = false;
  
  	//Basic constructor
  	//params: id of the question, confirmit report object, text of the question, full distribution array, distribution texts
  	public function HgNonScoredQuestion(id : String, report, text : String, fullDistribution, allAnswersTexts, precodesAll, validN){
  		this.id = id;
      	this.text = HelperUtil.ReplaceWildCards(report, text);
    	this.distribution = fullDistribution;
      	this.distributionTexts = allAnswersTexts;
      	this.precodes = precodesAll;
      	this.validN = validN;
      	Calculate();
    }
  
  	//Returns valid N
  	public function GetValidN(){
  		if(suppressed)
          return '-';
      	else
          return validN;
    }
  	
  	//Returns percentages
  	public function GetPercentages(){
  		return percentages;
    }
  	
  	//Returns distribution
  	public function GetFullDistribution(){
  		return distribution;
    }
  	
  	//Returns ID
  	public function GetId(){
  		return id;
    }
  
  	//Returns a value that can be fed into first column in the table (QID or Qnumber from LookupTable)
    public function GetDisplayId(){
      return LookupTable.GetQuestionNumberByQuestionId(id) + '.';
    }
  
  	//Adds a norm to norms array
  	//Params: dist - array of elements like this: [{n: 5, fav: 5}, {n:6, fav:6}], one for each distribution option
    public function AddNorm(dist){
      if(suppressed){
          var distributionComps = [];
          for(var i=0; i<distribution.length; i++){
              distributionComps.push(new HgComparator(id));
          }
          norms.push({distribution:distributionComps});
      }
      else{
          var distributionComps = [];
          for(var i=0; i<dist.length; i++){
            if(!dist[i].n){
              distributionComps.push(new HgComparator(id));
            }
            else{
              distributionComps.push(new HgComparator(id, validN, percentages[i], dist[i].n, dist[i].fav));
            }
          }
          norms.push({distribution:distributionComps});
      }
    }
    
    //Adds an internal comparator to internalComps array
    //Params: distribution of this internal comparator
    public function AddInternalComp(dist, N){
      if(suppressed){
          var distributionComps = [];
          for(var i=0; i<distribution.length; i++){
              distributionComps.push(new HgComparator(id));
          }
          internalComps.push({distribution:distributionComps});
      }
      else{
          //Recalculate stuff first (distribution and "favs" for each option)
          //Calculate N
          var compValidN = N;
          var distributionComps = [];
          for(var i=0; i<distribution.length; i++){
            if(compValidN>=Config.Privacy.Table.MinN)
          	  distributionComps.push(new HgComparator(id, parseInt(validN), parseInt(percentages[i]), parseInt(dist[i]), parseInt((100*dist[i]/compValidN).toFixed(0))));
            else
              distributionComps.push(new HgComparator(id));
          }
          internalComps.push({distribution:distributionComps});
      }
    }
  	
  	//Calculates percentages and applies minimum N properly
  	private function Calculate(){
  		if(distribution.length == 0){
      		//throw('Cannot calculate question. Full distribution not set for question: ' + id);
    	}
      
      	//Apply minimum N
      	if(validN < Config.Privacy.Table.MinN) {
        	Suppress();
        }
      	else{
      		//Calculate percentages
          	for(var i=0; i<distribution.length; i++){
          		percentages.push(parseInt((100*distribution[i]/validN).toFixed(0)));
            }
        }
    }
  
  	//Suppresses whole question
  	private function Suppress(){
      	suppressed = true;
      	for(var i=0; i<distribution.length; i++){
      		percentages.push('-');
          	distribution[i] = '-';
        }
    }
}