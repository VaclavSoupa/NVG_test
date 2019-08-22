class SortUtil {

  static function SortByLabel (a, b) {
		if (a.Label > b.Label) return 1;
		if (a.Label == b.Label) return 0;
		if (a.Label < b.Label) return -1;
	}
  
  static function SortById (a, b) {
		if (a.Id > b.Id) return 1;
		if (a.Id == b.Id) return 0;
		if (a.Id < b.Id) return -1;
	}

	static function SortByQuestionNumber (a, b) {
		if (a.QuestionNumber > b.QuestionNumber) return 1;
		if (a.QuestionNumber == b.QuestionNumber) return 0;
		if (a.QuestionNumber < b.QuestionNumber) return -1;
	}

	static function SortByStrength (a, b) {
		if (a.Strength > b.Strength) return 1;
        if (a.Strength == b.Strength) {
          if (a.Index > b.Index) return 1;
          if (a.Index == b.Index) return 0;
          if (a.Index < b.Index) return -1;
        }
		if (a.Strength < b.Strength) return -1;
	}
  	
  	//---------------------------------------------HgQuestion-----------------------------------------------
  	//------------------------------------------------------------------------------------------------------
  	//Used for HgQuestion class sorting - compare function
  	//Sorts by display id
  	//It will sort the array to be in descending order by display id score
  	static function SortHgQuestionByDisplayId(a, b){
  		var aScore = a.GetDisplayId();
      	var bScore = b.GetDisplayId();
      	if(aScore>bScore) return 1;
      	if(bScore>aScore) return -1;
      	
      	//any other case
      	return 0;
    }
  	
  	// JA (template 21.0) - function below added so we will be able to sort the questions by display ids
  	//						considered as integer values
  	static function SortHgQuestionByDisplayNumber(a, b){
               var aScore = Int32.Parse(a.GetDisplayNumber());
               var bScore = Int32.Parse(b.GetDisplayNumber());
               if(aScore>bScore) return 1;
               if(bScore>aScore) return -1;
              
               //any other case
               return 0;
    }
  
  	//Used for HgQuestion class sorting - compare function
  	//Sorts by strength score where nulls are moved to the end of the array and biggest score is at the top of it
  	//It will sort the array to be in descending order by strength score
  	static function SortHgQuestionByStrength(a, b){
  		var aScore = a.GetSO();
      	var bScore = b.GetSO();
      	if(aScore==null) return 1;
      	if(bScore==null) return -1;
      	if(aScore>bScore) return -1;
      	if(bScore>aScore) return 1;
      	
      	//any other case
      	return 0;
    }
  
  	//Used for HgQuestion class sorting - compare function
  	//Sorts by strength score where nulls are moved to the end of the array and lowest score is at the top of it
  	//It will sort the array to be in ascending order
  	static function SortHgQuestionByOpportunities(a, b){
  		var aScore = a.GetSO();
      	var bScore = b.GetSO();
      	if(aScore==null) return 1;
      	if(bScore==null) return -1;
      	if(aScore>bScore) return 1;
      	if(bScore>aScore) return -1;
      	
      	//any other case
      	return 0;
    }
  
  	//Used for HgQuestion class sorting - compare function
  	//Sorts by fav score where "-" are moved to the end of the array and lowest score is at the top of it
  	//It will sort the array to be in ascending order
  	static function SortHgQuestionByFavAsc(a, b){
  		var aScore = a.GetScores().fav;
      	var bScore = b.GetScores().fav;
        if(aScore==bScore){
        	if(a.GetDisplayId() > b.GetDisplayId()) return 1;
      		if(a.GetDisplayId() < b.GetDisplayId()) return -1;
        }
        else{
          	if(aScore=='-') return 1;
          	if(bScore=='-') return -1;
          	if(aScore>bScore) return 1;
          	if(bScore>aScore) return -1;
        }
      	//any other case
      	return 0;
    }
  
  	//Used for HgQuestion class sorting - compare function
  	//Sorts by fav score where "-" are moved to the end of the array and lowest score is at the top of it
  	//It will sort the array to be in descending order
  	static function SortHgQuestionByFavDesc(a, b){
  		var aScore = a.GetScores().fav;
      	var bScore = b.GetScores().fav;
      	if(aScore==bScore){
        	if(a.GetDisplayId() > b.GetDisplayId()) return 1;
      		if(a.GetDisplayId() < b.GetDisplayId()) return -1;
        }
        else{
            if(aScore=='-') return 1;
            if(bScore=='-') return -1;
            if(aScore>bScore) return -1;
            if(bScore>aScore) return 1;
        }
      	//any other case
      	return 0;
    }
  
  	//Used for HgQuestion class sorting - compare function
  	//Sorts by unfav score where "-" are moved to the end of the array and lowest score is at the top of it
  	//It will sort the array to be in ascending order
  	static function SortHgQuestionByUnfavAsc(a, b){
  		var aScore = a.GetScores().unfav;
      	var bScore = b.GetScores().unfav;
      	if(aScore==bScore){
        	if(a.GetDisplayId() > b.GetDisplayId()) return 1;
      		if(a.GetDisplayId() < b.GetDisplayId()) return -1;
        }
        else{
            if(aScore=='-') return 1;
            if(bScore=='-') return -1;
            if(aScore>bScore) return 1;
            if(bScore>aScore) return -1;
        }
      	//any other case
      	return 0;
    }
  
  	//Used for HgQuestion class sorting - compare function
  	//Sorts by unfav score where "-" are moved to the end of the array and lowest score is at the top of it
  	//It will sort the array to be in descending order
  	static function SortHgQuestionByUnfavDesc(a, b){
  		var aScore = a.GetScores().unfav;
      	var bScore = b.GetScores().unfav;
      	if(aScore==bScore){
        	if(a.GetDisplayId() > b.GetDisplayId()) return 1;
      		if(a.GetDisplayId() < b.GetDisplayId()) return -1;
        }
        else{
            if(aScore=='-') return 1;
            if(bScore=='-') return -1;
            if(aScore>bScore) return -1;
            if(bScore>aScore) return 1;
        }
      	//any other case
      	return 0;
    }
  
  	//Used for HgQuestion class sorting - compare function
  	//Sorts by neutral score where "-" are moved to the end of the array and lowest score is at the top of it
  	//It will sort the array to be in ascending order
  	static function SortHgQuestionByNeuAsc(a, b){
  		var aScore = a.GetScores().neu;
      	var bScore = b.GetScores().neu;
      	if(aScore==bScore){
        	if(a.GetDisplayId() > b.GetDisplayId()) return 1;
      		if(a.GetDisplayId() < b.GetDisplayId()) return -1;
        }
        else{
            if(aScore=='-') return 1;
            if(bScore=='-') return -1;
            if(aScore>bScore) return 1;
            if(bScore>aScore) return -1;
        }
      	//any other case
      	return 0;
    }
  
  	//Used for HgQuestion class sorting - compare function
  	//Sorts by neutral score where "-" are moved to the end of the array and lowest score is at the top of it
  	//It will sort the array to be in descending order
  	static function SortHgQuestionByNeuDesc(a, b){
  		var aScore = a.GetScores().neu;
      	var bScore = b.GetScores().neu;
      	if(aScore==bScore){
        	if(a.GetDisplayId() > b.GetDisplayId()) return 1;
      		if(a.GetDisplayId() < b.GetDisplayId()) return -1;
        }
        else{
            if(aScore=='-') return 1;
            if(bScore=='-') return -1;
            if(aScore>bScore) return -1;
            if(bScore>aScore) return 1;
        }
      	//any other case
      	return 0;
    }
  
  	//Used for HgQuestion class sorting - compare function
  	//Sorts by norm difference score where "-" are moved to the end of the array and lowest score is at the top of it
  	//It will sort the array to be in ascending order
  	static function SortHgQuestionByNormAsc(normNumber : int){
      	return function(a, b){
          var aScore = a.norms[normNumber].GetScore(false);
          var bScore = b.norms[normNumber].GetScore(false);
          if(aScore==bScore){
        	if(a.GetDisplayId() > b.GetDisplayId()) return 1;
      		if(a.GetDisplayId() < b.GetDisplayId()) return -1;
          }
          else{
            if(aScore=='-') return 1;
            if(bScore=='-') return -1;
            if(aScore>bScore) return 1;
            if(bScore>aScore) return -1;
          }
          //any other case
          return 0;
        }
    }
  
  	//Used for HgQuestion class sorting - compare function
  	//Sorts by norm difference score where "-" are moved to the end of the array and lowest score is at the top of it
  	//It will sort the array to be in descending order
  	static function SortHgQuestionByNormDesc(normNumber : int){
  		return function(a, b){
          var aScore = a.norms[normNumber].GetScore(false);
          var bScore = b.norms[normNumber].GetScore(false);
          if(aScore==bScore){
        	if(a.GetDisplayId() > b.GetDisplayId()) return 1;
      		if(a.GetDisplayId() < b.GetDisplayId()) return -1;
          }
          else{
            if(aScore=='-') return 1;
            if(bScore=='-') return -1;
            if(aScore>bScore) return -1;
            if(bScore>aScore) return 1;
          }
          //any other case
          return 0;
        }
    }
  
  	//Used for HgQuestion class sorting - compare function
  	//Sorts by internal comp difference score where "-" are moved to the end of the array and lowest score is at the top of it
  	//It will sort the array to be in ascending order
  	static function SortHgQuestionByInternalAsc(compNumber : int){
      	return function(a, b){
          var aScore = a.internalComps[compNumber].GetScore(false);
          var bScore = b.internalComps[compNumber].GetScore(false);
          if(aScore==bScore){
        	if(a.GetDisplayId() > b.GetDisplayId()) return 1;
      		if(a.GetDisplayId() < b.GetDisplayId()) return -1;
          }
          else{
            if(aScore=='-') return 1;
            if(bScore=='-') return -1;
            if(aScore>bScore) return 1;
            if(bScore>aScore) return -1;
          }
          //any other case
          return 0;
        }
    }
  
  	//Used for HgQuestion class sorting - compare function
  	//Sorts by internal comp difference score where "-" are moved to the end of the array and lowest score is at the top of it
  	//It will sort the array to be in descending order
  	static function SortHgQuestionByInternalDesc(compNumber : int){
  		return function(a, b){
          var aScore = a.internalComps[compNumber].GetScore(false);
          var bScore = b.internalComps[compNumber].GetScore(false);
          if(aScore==bScore){
        	if(a.GetDisplayId() > b.GetDisplayId()) return 1;
      		if(a.GetDisplayId() < b.GetDisplayId()) return -1;
          }
          else{
            if(aScore=='-') return 1;
            if(bScore=='-') return -1;
            if(aScore>bScore) return -1;
            if(bScore>aScore) return 1;
          }
          //any other case
          return 0;
        }
    }
  	
  	//---------------------------------------------HgDimension----------------------------------------------
  	//------------------------------------------------------------------------------------------------------
  	//Compare function that should be used to sort an array of dimensions by fav score
  	static function SortHgDimensionByFav(a, b){
  		var aFav = a.GetScores().fav;
      	var bFav = b.GetScores().fav;
        if(aFav==bFav){
          	if(a.GetId() > b.GetId()) return 1;
      		if(a.GetId() < b.GetId()) return -1;
        }
      	else{
            if(aFav == '-') return 1;
            if(bFav == '-') return -1;
            if(aFav > bFav) return -1;
            if(bFav > aFav) return 1;
        }
      	return 0;
    }
  
  	//Compare function that should be used to sort an array of dimensions by neu score
  	static function SortHgDimensionByNeu(a, b){
  		var aFav = a.GetScores().neu;
      	var bFav = b.GetScores().neu;
      	if(aFav==bFav){
          	if(a.GetId() > b.GetId()) return 1;
      		if(a.GetId() < b.GetId()) return -1;
        }
      	else{
            if(aFav == '-') return 1;
            if(bFav == '-') return -1;
            if(aFav > bFav) return -1;
            if(bFav > aFav) return 1;
        }
      	return 0;
    }
  
  	//Compare function that should be used to sort an array of dimensions by unfav score
  	static function SortHgDimensionByUnfav(a, b){
  		var aFav = a.GetScores().unfav;
      	var bFav = b.GetScores().unfav;
      	if(aFav==bFav){
          	if(a.GetId() > b.GetId()) return 1;
      		if(a.GetId() < b.GetId()) return -1;
        }
      	else{
            if(aFav == '-') return 1;
            if(bFav == '-') return -1;
            if(aFav > bFav) return -1;
            if(bFav > aFav) return 1;
        }
      	return 0;
    }
  
  	//Compare function that should be used to sort an array of dimensions by trend1 score
  	static function SortHgDimensionByTrend1(a, b){
  		var aFav = a.internalComps[5].GetScore(false);
      	var bFav = b.internalComps[5].GetScore(false);
      	if(aFav==bFav){
          	if(a.GetId() > b.GetId()) return 1;
      		if(a.GetId() < b.GetId()) return -1;
        }
      	else{
            if(aFav == '-') return 1;
            if(bFav == '-') return -1;
            if(aFav > bFav) return -1;
            if(bFav > aFav) return 1;
        }
      	return 0;
    }
  	
  	//Compare function that should be used to sort an array of dimensions by trend2 score
  	static function SortHgDimensionByTrend2(a, b){
  		var aFav = a.internalComps[6].GetScore(false);
      	var bFav = b.internalComps[6].GetScore(false);
      	if(aFav==bFav){
          	if(a.GetId() > b.GetId()) return 1;
      		if(a.GetId() < b.GetId()) return -1;
        }
      	else{
            if(aFav == '-') return 1;
            if(bFav == '-') return -1;
            if(aFav > bFav) return -1;
            if(bFav > aFav) return 1;
        }
      	return 0;
    }
  	
  	//Compare function that should be used to sort an array of dimensions by trend3 score
  	static function SortHgDimensionByTrend3(a, b){
  		var aFav = a.internalComps[7].GetScore(false);
      	var bFav = b.internalComps[7].GetScore(false);
      	if(aFav==bFav){
          	if(a.GetId() > b.GetId()) return 1;
      		if(a.GetId() < b.GetId()) return -1;
        }
      	else{
            if(aFav == '-') return 1;
            if(bFav == '-') return -1;
            if(aFav > bFav) return -1;
            if(bFav > aFav) return 1;
        }
      	return 0;
    }
  	
  	//Compare function that should be used to sort an array of dimensions by int1 score
  	static function SortHgDimensionByInternal1(a, b){
  		var aFav = a.internalComps[0].GetScore(false);
      	var bFav = b.internalComps[0].GetScore(false);
      	if(aFav==bFav){
          	if(a.GetId() > b.GetId()) return 1;
      		if(a.GetId() < b.GetId()) return -1;
        }
      	else{
            if(aFav == '-') return 1;
            if(bFav == '-') return -1;
            if(aFav > bFav) return -1;
            if(bFav > aFav) return 1;
        }
      	return 0;
    }
  	
  	//Compare function that should be used to sort an array of dimensions by int2 score
  	static function SortHgDimensionByInternal2(a, b){
  		var aFav = a.internalComps[1].GetScore(false);
      	var bFav = b.internalComps[1].GetScore(false);
      	if(aFav==bFav){
          	if(a.GetId() > b.GetId()) return 1;
      		if(a.GetId() < b.GetId()) return -1;
        }
      	else{
            if(aFav == '-') return 1;
            if(bFav == '-') return -1;
            if(aFav > bFav) return -1;
            if(bFav > aFav) return 1;
        }
      	return 0;
    }
  	
  	//Compare function that should be used to sort an array of dimensions by int3 score
  	static function SortHgDimensionByInternal3(a, b){
  		var aFav = a.internalComps[2].GetScore(false);
      	var bFav = b.internalComps[2].GetScore(false);
      	if(aFav==bFav){
          	if(a.GetId() > b.GetId()) return 1;
      		if(a.GetId() < b.GetId()) return -1;
        }
      	else{
            if(aFav == '-') return 1;
            if(bFav == '-') return -1;
            if(aFav > bFav) return -1;
            if(bFav > aFav) return 1;
        }
      	return 0;
    }
  	
  	//Compare function that should be used to sort an array of dimensions by int4 score
  	static function SortHgDimensionByInternal4(a, b){
  		var aFav = a.internalComps[3].GetScore(false);
      	var bFav = b.internalComps[3].GetScore(false);
      	if(aFav==bFav){
          	if(a.GetId() > b.GetId()) return 1;
      		if(a.GetId() < b.GetId()) return -1;
        }
      	else{
            if(aFav == '-') return 1;
            if(bFav == '-') return -1;
            if(aFav > bFav) return -1;
            if(bFav > aFav) return 1;
        }
      	return 0;
    }
  	
  	//Compare function that should be used to sort an array of dimensions by int5 score
  	static function SortHgDimensionByInternal5(a, b){
  		var aFav = a.internalComps[4].GetScore(false);
      	var bFav = b.internalComps[4].GetScore(false);
      	if(aFav==bFav){
          	if(a.GetId() > b.GetId()) return 1;
      		if(a.GetId() < b.GetId()) return -1;
        }
      	else{
            if(aFav == '-') return 1;
            if(bFav == '-') return -1;
            if(aFav > bFav) return -1;
            if(bFav > aFav) return 1;
        }
      	return 0;
    }
  
  	//Compare function that should be used to sort an array of dimensions by norm1 score
  	static function SortHgDimensionByNorm1(a, b){
  		var aFav = a.norms[0].GetScore(false);
      	var bFav = b.norms[0].GetScore(false);
      	if(aFav==bFav){
          	if(a.GetId() > b.GetId()) return 1;
      		if(a.GetId() < b.GetId()) return -1;
        }
      	else{
            if(aFav == '-') return 1;
            if(bFav == '-') return -1;
            if(aFav > bFav) return -1;
            if(bFav > aFav) return 1;
        }
      	return 0;
    }
  
  	//Compare function that should be used to sort an array of dimensions by norm2 score
  	static function SortHgDimensionByNorm2(a, b){
  		var aFav = a.norms[1].GetScore(false);
      	var bFav = b.norms[1].GetScore(false);
      	if(aFav==bFav){
          	if(a.GetId() > b.GetId()) return 1;
      		if(a.GetId() < b.GetId()) return -1;
        }
      	else{
            if(aFav == '-') return 1;
            if(bFav == '-') return -1;
            if(aFav > bFav) return -1;
            if(bFav > aFav) return 1;
        }
      	return 0;
    }
  
  	//Compare function that should be used to sort an array of dimensions by norm3 score
  	static function SortHgDimensionByNorm3(a, b){
  		var aFav = a.norms[2].GetScore(false);
      	var bFav = b.norms[2].GetScore(false);
      	if(aFav==bFav){
          	if(a.GetId() > b.GetId()) return 1;
      		if(a.GetId() < b.GetId()) return -1;
        }
      	else{
            if(aFav == '-') return 1;
            if(bFav == '-') return -1;
            if(aFav > bFav) return -1;
            if(bFav > aFav) return 1;
        }
      	return 0;
    }
  
  	//Compare function that should be used to sort an array of dimensions by norm1 score
  	static function SortHgDimensionByNorm4(a, b){
  		var aFav = a.norms[3].GetScore(false);
      	var bFav = b.norms[3].GetScore(false);
      	if(aFav==bFav){
          	if(a.GetId() > b.GetId()) return 1;
      		if(a.GetId() < b.GetId()) return -1;
        }
      	else{
            if(aFav == '-') return 1;
            if(bFav == '-') return -1;
            if(aFav > bFav) return -1;
            if(bFav > aFav) return 1;
        }
      	return 0;
    }
  
  	//Compare function that should be used to sort an array of dimensions by norm1 score
  	static function SortHgDimensionByNorm5(a, b){
  		var aFav = a.norms[4].GetScore(false);
      	var bFav = b.norms[4].GetScore(false);
      	if(aFav==bFav){
          	if(a.GetId() > b.GetId()) return 1;
      		if(a.GetId() < b.GetId()) return -1;
        }
      	else{
            if(aFav == '-') return 1;
            if(bFav == '-') return -1;
            if(aFav > bFav) return -1;
            if(bFav > aFav) return 1;
        }
      	return 0;
    }
  
}