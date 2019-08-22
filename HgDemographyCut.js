//This class is intented to contain all information about one demography cut
//Mainly precode, title and an array containing all core questions and all core dimensions for this demo cut
class HgDemographyCut{
  	private var id : String = '';
  	private var title : String = '';
  	public var questions = [];
  	public var dimensions : HgDimension[] = [];
  
  	//Constructor
  	//Params: precode, title, core questions array, core dimensions array
  	public function HgDemographyCut(newId : String, newTitle : String, questionsArray, dimensionsArray){
  		id = newId;
      	title = newTitle;
      	questions = questionsArray;
      	dimensions = dimensionsArray;
    }
  
  	//Returns the title
  	public function GetTitle() : String{
  		return title;
    }
  	
  	//Returns the id
  	public function GetId() : String{
  		return id;
    }
  
  	//Sets a new questions array
  	public function SetQuestions(newQs){
  		questions = newQs;
    }
  
  	//Sets a new dimensions array
  	public function SetDimensions(newDims){
  		dimensions = newDims;
    }
}