//This should handle taking out the proper set of dimensions in a proper order
//For currently selected option on SurveyDimensions
class Page_SurveyDimensions{
  	
  	//Return appropriate set of dimensions based on currently selected option in SORTBY parameter
  	public static function GetSurveyDimensionsDimensions(report : Report, state : ReportState, user : User){
      	//Check which sorting option is applied (needed for sorting)
      	var selected = ParamUtil.Selected(report, state, 'SORTBY', user);
        if (selected == null)
        	selected = ParamLists.Get('SORTBY', state, report, user)[0];
      
      	//Get out all dimensions
      	var qm = QueryManager.GetQueryManagerMain(report, state, user, true);
      	var dimensions = qm.GetCoreDimensions();
      
      	//Sort appropriately
  		var sortedDims = SortDimensions(selected.Code, dimensions);
      
      	//Return sorted array
      	return sortedDims;
    }
  
  	//Sorts the dimension array based on the SortBy option
  	private static function SortDimensions(sortBy, dimensions){
      	switch(sortBy){
          	case SurveyDimensionSortBy.None:
            	return dimensions;
            	break;
          	case SurveyDimensionSortBy.Fav:
            	var sortedArr = dimensions.sort(SortUtil.SortHgDimensionByFav);
            	return sortedArr;
            	break;
            case SurveyDimensionSortBy.Neu:
            	var sortedArr = dimensions.sort(SortUtil.SortHgDimensionByNeu);
            	return sortedArr;
            	break;
            case SurveyDimensionSortBy.Unfav:
            	var sortedArr = dimensions.sort(SortUtil.SortHgDimensionByUnfav);
            	return sortedArr;
            	break;
            case SurveyDimensionSortBy.Trend1:
            	var sortedArr = dimensions.sort(SortUtil.SortHgDimensionByTrend1);
            	return sortedArr;
            	break;
            case SurveyDimensionSortBy.Trend2:
            	var sortedArr = dimensions.sort(SortUtil.SortHgDimensionByTrend2);
            	return sortedArr;
            	break;
            case SurveyDimensionSortBy.Trend3:
            	var sortedArr = dimensions.sort(SortUtil.SortHgDimensionByTrend3);
            	return sortedArr;
            	break;
            case SurveyDimensionSortBy.Internal1:
            	var sortedArr = dimensions.sort(SortUtil.SortHgDimensionByInternal1);
            	return sortedArr;
            	break;
            case SurveyDimensionSortBy.Internal2:
            	var sortedArr = dimensions.sort(SortUtil.SortHgDimensionByInternal2);
            	return sortedArr;
            	break;
            case SurveyDimensionSortBy.Internal3:
            	var sortedArr = dimensions.sort(SortUtil.SortHgDimensionByInternal3);
            	return sortedArr;
            	break;
            case SurveyDimensionSortBy.Internal4:
            	var sortedArr = dimensions.sort(SortUtil.SortHgDimensionByInternal4);
            	return sortedArr;
            	break;
            case SurveyDimensionSortBy.Internal5:
            	var sortedArr = dimensions.sort(SortUtil.SortHgDimensionByInternal5);
            	return sortedArr;
            	break;
            case SurveyDimensionSortBy.Norm1:
            	var sortedArr = dimensions.sort(SortUtil.SortHgDimensionByNorm1);
            	return sortedArr;
            	break;
            case SurveyDimensionSortBy.Norm2:
            	var sortedArr = dimensions.sort(SortUtil.SortHgDimensionByNorm2);
            	return sortedArr;
            	break;
            case SurveyDimensionSortBy.Norm3:
            	var sortedArr = dimensions.sort(SortUtil.SortHgDimensionByNorm3);
            	return sortedArr;
            	break;
            case SurveyDimensionSortBy.Norm4:
            	var sortedArr = dimensions.sort(SortUtil.SortHgDimensionByNorm4);
            	return sortedArr;
            	break;
            case SurveyDimensionSortBy.Norm5:
            	var sortedArr = dimensions.sort(SortUtil.SortHgDimensionByNorm5);
            	return sortedArr;
            	break;
          	default:
            	return dimensions;
        }
      
  		return dimensions;
    }
}