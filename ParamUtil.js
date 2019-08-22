/// DO NOT TOUCH!!! ELSE KANCHAN WILL HURT YOU
class ParamUtil 
{
  // Summary:
  // LoadParameter is used to add possible values to a string response parameter.
  //
  // Parameter inputs:
  //   * report - The Reportal scripting report object
  //   * parameter - The parameter the possible values will be added to 
  //   * parameter_values - An array of objects with a property Code and a property Label.
  //        Example: [{Code: "1", Label: "Answer 1"}, {Code: "2", Label: "Answer 2"}]
  // Returns:
  //   * Nothing returned
  //
  static function LoadParameter (report, parameter, parameter_values) 
  {
    for (var i=0; i<parameter_values.length; ++i) 
    {   
      var a : ParameterValueResponse = new ParameterValueResponse(); 
      var code = (parameter_values[i].Code == null) ? parameter_values[i].Label : parameter_values[i].Code;
      a.StringKeyValue = code;
      
      var labels : LanguageTextCollection = new LanguageTextCollection(); 
      labels.Add(new LanguageText(report.CurrentLanguage, parameter_values[i].Label)); 
      
      a.LocalizedLabel = new Label(labels);
      a.StringValue = parameter_values[i].Label;
      
      parameter.Items.Add(a);
    }
  }
 
  
  static function ClearParameters(state, clear_parameters) {
    for (var i=0; i<clear_parameters.length; ++i)
      state.Parameters[ clear_parameters[i] ] = null;    
  }
 
 
  static function Selected(report, state, parameterName, optional, optional2, bool_default_to_first_value, confirmitFacade)
  {
    var paramValues = ParamLists.Get(parameterName, state, report, optional, optional2, confirmitFacade); //ParameterList(report, dataSourceNodeId, parameterName, state);
    var currentCode = GetParamCode(state, parameterName);
    for(var i = 0; i < paramValues.length; i++)
    {
      if(paramValues[i].Code == currentCode)
        return paramValues[i];    
    }
    
    if (bool_default_to_first_value && paramValues.length>0)
      return paramValues[0];
    
    return null;
  }
  
  static function GetByValue(value, report, state, parameterName, optional, optional2)
  {
    var paramValues = ParamLists.Get(parameterName, state, report, optional, optional2);
    for(var i = 0; i < paramValues.length; i++)
    {
      if(paramValues[i].Code == value)
        return paramValues[i];    
    }
  }
  
  
    static function HideOptions(state, param_name) {
      
      	var is_question_selected = (ParamUtil.GetParamCode(state, param_name) != null);
      	var is_show_all_selected = (ParamUtil.GetParamCode(state, param_name + '_options') == '1');
      	var hide = !is_question_selected || is_show_all_selected;
      
        return hide;
    }
        
  
	static function Save (state, report, param_name, value) {

		var a : ParameterValueResponse = new ParameterValueResponse();	
		a.StringKeyValue = value;

		var lbls : LanguageTextCollection = new LanguageTextCollection(); 
		lbls.Add(new LanguageText(report.CurrentLanguage, value)); 
		a.LocalizedLabel = new Label(lbls);
		a.StringValue = value;

		state.Parameters[param_name] = a;

	}  
 
	static function SaveMulti  (state, report, param_name, values) {
		var pvcb : ParameterValueMultiSelect; 

		// CHECK INTERNAL COMPARATORS
		pvcb = new ParameterValueMultiSelect ();
		for (var i=0; i<values.length; ++i) {
		  var pvr : ParameterValueResponse = new ParameterValueResponse();
		  pvr.StringKeyValue = values[i];
		  pvr.StringValue = values[i];
		  pvcb.Add ( pvr );
		}
		state.Parameters[ param_name ] = pvcb;
	}  
  
  // Summary:
  // GetParamCode is used to get the current code value of a given string response parameter
  // where the string response parameter has an associated list of selectable items.
  //
  // Parameter inputs:
  //   * state - The Reportal scripting state object.
  //   * parameter_name - The name of the string response parameter to get the value from.
  // Returns:
  //   * The string code value of the given parameter. If the parameter does not have a string
  //     code value null is returned.
  //
  static function GetParamCode (state, parameter_name)
  {
    if (state.Parameters.IsNull(parameter_name)) 
      return null;
    
    var pvr : ParameterValueResponse = state.Parameters[parameter_name];
   
    return pvr.StringKeyValue;
  }
 

  // Summary:
  // GetParamCodes is used to get the code values of a given multi select parameter.
  //
  // Parameter inputs:
  //   * state - The Reportal scripting state object.
  //   * parameter_name - The name of the string response multi select parameter to get the 
  //     value from.
  // Returns:
  //   * An array of string values with the selected items of the multi select parameter passed
  //     in the the function. If no string values are selected an empty array is returned.
  //
  static function GetParamCodes (state, parameter_name)
  {
    var p : ParameterValueMultiSelect = state.Parameters[parameter_name];
    var o = [];
    if (p != null) 
    {
      for (var enumerator : Enumerator = new Enumerator(p) ; !enumerator.atEnd(); enumerator.moveNext())
      {
        var pvr : ParameterValueResponse = enumerator.item();
        o.push (pvr.StringKeyValue);
      }
    }
  
    return o;
  }
  
  static function Contains (state, parameter_name, code) {
  	var codes =  GetParamCodes (state, parameter_name);
    for (var i=0; i<codes.length; ++i)
      	if (codes[i].toUpperCase() == code.toUpperCase())
          	return true;

    return false;
  }
  

  static function GetByCode(report, state, parameterName, code)
  {
    var paramValues = ParamLists.Get(parameterName, state, report); 
    for(var i = 0; i < paramValues.length; i++)
    {
      if(paramValues[i].Code == code)
        return paramValues[i];    
    }
  }
  
	static function VerifyWithReset (param_name, report, state, user, optional) {   
		var selected = ParamUtil.Selected (report, state, param_name, user, optional);
		if (selected == null)
			ParamUtil.UpdateParameterToFirstAvilableValue ( param_name, state, report, user, optional);
	}
  
  
  	static function UpdateParameterToFirstAvilableValue ( param_name, state, report, user, optional) {
		var list = ParamLists.Get(param_name, state, report, user, optional);
		if (list.length == 0) return null;
		ParamUtil.Save (state, report, param_name, list[0].Code);  
	}
  
}