//This class is intented to contain information about a demography
//It should contain the basic information like name, id, democuts, etc.
class HgDemography{
	private var id : String = '';
  	private var title : String = '';
  	public var cuts : HgDemographyCut[] = []; //Array of HgDemographyCut objects containing all of the standard demo cuts
  	public var overall : HgDemographyCut = null;
  
	//Constructor
  	//Parameters: id of the demography, title of the demography, one demo cut corresponding to overall scores, array containing demo cuts
  	public function HgDemography(newId : String, newTitle: String, overallCut : HgDemographyCut, cutsArray){
  		id = newId;
      	title = newTitle;
      	cuts = cutsArray;
      	overall = overallCut;
    }
  
  	//Returns the title
  	public function GetTitle() : String{
  		return title;
    }
  
  	//Returns the id
  	public function GetId() : String{
  		return id;
    }
}