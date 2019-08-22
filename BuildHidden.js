class BuildHidden {
  static function printSpanPages (report, qid, pageContext) {
    var arrReturn = [];
    var tmpStr='';
    
    var answers = ResourceText.List(report, qid);
    pageContext.Items[qid + '_list_of_all_answers'] = answers;
    for(var k in answers){
      tmpStr = k.split(' ').join('');
      tmpStr = tmpStr.split('.').join('');
      arrReturn.push('<span id="' + tmpStr + '_pages" data-pages="' + answers[k] + '"></span>');
      tmpStr = '';
    }
    return arrReturn.join('\n');
  }
  
  static function printFilterJS (state, user) {
    var arrReturn = [];
    if(!UserType.IsHayGroupUser(state, user)){
      arrReturn.push('<script><!--');
      arrReturn.push('$(document).ready(function () {');
      arrReturn.push('   $("[type=checkbox]").change(function () {');
      arrReturn.push('      var maxAllowed = ' + Config.Comps.MaxConcurrentCount + ';');
      arrReturn.push('      var cnt = $("input:checked").length;');
      arrReturn.push('      if (cnt > maxAllowed)');
      arrReturn.push('      {');
      arrReturn.push('         $(this).prop("checked", "");');
      arrReturn.push('     }');
      arrReturn.push('  });');
      arrReturn.push('});');
      arrReturn.push('--></script>');
    }
    return arrReturn.join('\n');
  }

  static function printJS () {
    var arrReturn = [];
    
    arrReturn.push('<script><!-- ');
    arrReturn.push('(function(){ ');
    arrReturn.push('  var eL = $(\'.yui3-menuitem-content\');  ');
    arrReturn.push('  try {  ');
    arrReturn.push('    if (eL.length>0){  ');
    arrReturn.push('      for (var i=0;i<eL.length;++i){  ');
    arrReturn.push('        var tmpStr = eL[i].text;  ');
    arrReturn.push('        if ($(\'#\' + tmpStr + \'_pages\').length!==0 && tmpStr!==\'\') {   ');
    arrReturn.push('          var newText = $(\'#\' + tmpStr + \'_pages\').attr("data-pages");  ');
    arrReturn.push('          if(newText !== "")  ');
    arrReturn.push('          	eL[i].text = newText;  ');
    arrReturn.push('          tmpStr=\'\';  ');
    arrReturn.push('        }  ');
    arrReturn.push('      }   ');
    arrReturn.push('    } else if (eL.el.length>0){ ');
    arrReturn.push('      for (var i=0;i<eL.el.length;++i){ ');
    arrReturn.push('        var tmpStr = eL.el[i].text; ');
    arrReturn.push('        if ($(\'#\' + tmpStr + \'_pages\').length!==0 && tmpStr!==\'\') {  ');
    arrReturn.push('          eL.el[i].text = $(\'#\' + tmpStr + \'_pages\').attr("data-pages"); ');
    arrReturn.push('          tmpStr=\'\'; ');
    arrReturn.push('        } ');
    arrReturn.push('      }  ');
    arrReturn.push('    } ');
    arrReturn.push('  } catch (e) {}  ');
    arrReturn.push('})(); ');
    
    arrReturn.push(' ');
    arrReturn.push(' ');
    
    arrReturn.push('    var tables = document.getElementsByClassName(\'barchart\');');
    arrReturn.push('    for (var i=0; i<tables.length; ++i) {');
    arrReturn.push('        var cells = tables[i].rows[0].cells;');
    arrReturn.push('        for (var j=0; j<cells.length; ++j) {');
    arrReturn.push('            cells[j].innerHTML = \'\';');
    arrReturn.push('            cells[j].style.padding = \'0px\';');
    arrReturn.push('        }');
    arrReturn.push('    }');
    arrReturn.push('--></script>  ');

    return arrReturn.join('\n');
  }

}