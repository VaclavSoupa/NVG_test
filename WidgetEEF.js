class WidgetEEF {
	static function GetData (report, state, user, data_row, show_pcts, test_page) {
		var o=[];
            
		if (!data_row)
          data_row = 1;
      
		if (!test_page)
          test_page = 'ULF';
      
		if (show_pcts!==false)
          show_pcts = true;

        var table_name = test_page + ':EEF';
      
		var data = report.TableUtils.GetRowValues ( table_name, data_row );

        var N=0;
      
        for (var i=0; i<data.length; ++i) {
          if (!isNaN(data[i].Value))
              N += data[i].Value;
        }

        var labels = report.TableUtils.GetColumnHeaderCategoryTitles ( table_name );
      	var pct = [];
            
		if (N>0) {
          for (var i=0; i<data.length; ++i) {
				pct.push ( (data[i].Value/N) );
          }
		} else {
			pct = [null, null, null, null]; 
		}

      	o.effective = {Pct: pct[0], Label: labels[0][0]};
        o.frustrated = {Pct: pct[1], Label: labels[1][0]};
        o.detached = {Pct: pct[2], Label: labels[2][0]};
		o.least_effective = {Pct: pct[3], Label: labels[3][0]};
        if (show_pcts) {
          if (N < Config.Privacy.Table.MinN) {
	  		o.effective.Score = '-';
			o.frustrated.Score = '-';
			o.detached.Score = '-';
			o.least_effective.Score = '-';
          } else {
			o.effective.Score = (100*o.effective.Pct).toFixed(0) + '%';
			o.frustrated.Score = (100*o.frustrated.Pct).toFixed(0) + '%';
			o.detached.Score = (100*o.detached.Pct).toFixed(0) + '%';
			o.least_effective.Score = (100*o.least_effective.Pct).toFixed(0) + '%';
          }
        } else {
          if (N < Config.Privacy.Table.MinN) {
	  		o.effective.Score = '-';
			o.frustrated.Score = '-';
			o.detached.Score = '-';
			o.least_effective.Score = '-';
          } else {
            if (!isNaN(o.effective.Pct)) o.effective.Score = o.effective.Pct*100;
            if (!isNaN(o.frustrated.Pct)) o.frustrated.Score = o.frustrated.Pct*100;
            if (!isNaN(o.detached.Pct)) o.detached.Score = o.detached.Pct*100;
            if (!isNaN(o.least_effective.Pct)) o.least_effective.Score = o.least_effective.Pct*100;
          }
        }
		return o;
	}
	
	static function Render (report, state, user) {
		var o=[];
		var data = GetData (report, state, user);
		var rtEffPro = ResourceText.List(report,'effectiveness_profile');
        
        o.push ('<table border=0 style="border-collapse: collapse"><tr>');
        o.push ('<td style="padding:0px">' + '<div class="eef eef_detached"><div style="height:20px">' + data.detached.Label + '</div><span class=eef_score>' + data.detached.Score + '</span></div></td>')
		o.push ('<td style="padding:0px">' + '<div class="eef eef_effective"><div style="height:20px">' + data.effective.Label + '</div><span class=eef_score>' + data.effective.Score + '</span></div></td>')
		o.push ('</tr><tr>');
		o.push ('<td style="padding:0px">' + '<div class="eef eef_leasteffective"><div style="height:20px">' + data.least_effective.Label + '</div><span class=eef_score>' + data.least_effective.Score + '</span></div></td>')
		o.push ('<td style="padding:0px">' + '<div class="eef eef_frustrated"><div style="height:20px">' + data.frustrated.Label + '</div><span class=eef_score>' + data.frustrated.Score + '</span></div></td>')
		o.push ('</tr></table>');
    
		var n = [];

		// CSS styling
		n.push ('<style>');
		n.push ('#widget_eef .mathsign{font-size:20px; text-weight: bold; color: #17B0B6; font-family: arial}');
		n.push ('#widget_eef td{padding: 0px; margin: 0px; text-align:center; }');
		n.push ('#widget_eef table{table-collapse: collapse}');
		n.push ('.verticaltext {');
		n.push ('position: relative; top:-167px; left:-62px;');
		n.push ('width:200px; height:20px;');
      	n.push ('filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);'); // IE8
		n.push ('-ms-transform:rotate(270deg); /* IE 9 */');
		n.push ('-moz-transform:rotate(270deg); /* Firefox */');
		n.push ('-webkit-transform:rotate(270deg); /* Safari and Chrome */');
		n.push ('-o-transform:rotate(270deg); /* Opera */');
		n.push ('}');
		n.push ('.widgetaxis {text-align:center; vertical-align:middle; font-family:arial; color:#17B0B6; text-transform:uppercase; font-size:11px }');
		n.push ('</style>');
      
        // IE8 hack
        n.push ('<!--[if IE 8]>');
        n.push ('<style type="text/css">.verticaltext {top:-240px; left:23px}</style>');
        n.push ('<![endif]-->');      

		// MAIN WIDGET

		n.push ('<div id=widget_eef style="position: relative; top:-10px">');
		n.push ('<table border=0>');
		n.push ('<tr>');
		n.push ('<td rowspan=2 style="text-align:center; width:20px;">');
		n.push ('<table border=0 style="width:20px; height:240px"><tr><td class=mathsign style="vertical-align:top; padding-top:14px;">+</td></tr><tr><td class=mathsign style="vertical-align: bottom; padding-bottom: 70px">-</td></tr></table>');
		n.push ('</td>');
		n.push ('<td>');

		n.push ('<table style="border-left:2px solid #17B0B6; border-bottom:2px solid #17B0B6">');
		n.push ('<tr>');
		n.push ('<td class="widgetaxis" rowspan=2 ><div style="width:16px"></div></td>');
		n.push ('<td>');

		// QUADRANT    
		n.push ( o.join ('\n') );

		// HORIZONTAL AXIS TITLE
		n.push ('<td>');
		n.push ('</tr>');
		n.push ('<tr>');
		n.push ('<td class=widgetaxis style="height:20px;">');
		n.push (rtEffPro['Engagement']);
		n.push ('</td>');
		n.push ('</tr>');
		n.push ('</table>');

		n.push ('</td>');
		n.push ('</tr>');
		n.push ('<tr>');
		n.push ('<td>');

		// X AXIS - PLUS/MINUS
		n.push ('<table border=0 style="width:220px; position:relative; ' + 
                'top:-' + ( state.ReportExecutionMode == ReportExecutionMode.PdfExport ? '4' : '20' ) + 'px;' + 
          		'left:' + ( state.ReportExecutionMode == ReportExecutionMode.PdfExport ? '10' : '0' ) + 'px;' + 
                  'width:220px"><tr><td class=mathsign style="padding-left:30px; text-align:left">-</td><td class=mathsign style="text-align: right; padding-right:10px">+</td></tr></table>');
		n.push ('</td>');
		n.push ('</tr>');
		n.push ('</table>');

		// VERTICAL AXIS TITLE
      n.push ('<div class="widgetaxis verticaltext" style="">'); // IE8 hack
      
    
		n.push (rtEffPro['Enablement']);
		n.push ('</div>');
		n.push ('</div>');

		return ('<div class=scaling style="text-align:center; margin-top:0px">' + n.join('\n') + '</div>');    
	}
  
}