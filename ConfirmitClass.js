class ConfirmitClass {
  static var conf : ConfirmitFacade ;
  static var lg : Logger;
  
  static function Set(c, log) {
   	conf = c; 
    lg = log;
  }
  
  static function Get() {
    return conf;
  }
  
  static function SendMail (body) {
    try {
      if(lg != null) {
      // lg.LogDebug ( body );
      }
    }
    catch (e) {}
  }

  static function Log (x) {
    try {
    if(lg != null)
    {
		//lg.LogDebug (x);
    }
    }
    catch(e) {}
  }
  
  static function Log2 (x) {
    try {
    if(lg != null)
    {
		//lg.LogDebug (x);
    }
    }
    catch(e) {}
  }
  
  static function Log3 (x) {
    try {
    if(lg != null)
    {
		//lg.LogDebug (x);	// TMP
    }
    }
    catch(e) {}
  }

  static function Log4 (x) {
    try {
    if(lg != null)
    {
		//lg.LogDebug (x);	// TMP
    }
    }
    catch(e) {}
  }

  static function Log5 (x) {
    try {
    if(lg != null)
    {
		//lg.LogDebug (x);	// TMP
    }
    }
    catch(e) {}
  }

}