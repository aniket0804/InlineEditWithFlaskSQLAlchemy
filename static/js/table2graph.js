function table2graph() {

    /* variables */
    var triggerClass = 'tochart';
    var chartClass = 'fromtable';
    var hideClass = 'hidden';
    var chartColor = '00FF00,0000FF,FF0000';//'339933';
    var chartSize = '370x135';
    var chartSizeBig = '715x135';

    var toTableClass = 'totable';
    var tableClass = 'generatedfromchart';
    /* end variables */

    var tables = document.getElementsByTagName('table');
    var sizeCheck = /\s?size([^\s]+)/;
    var colCheck = /\s?color([^\s]+)/;
    for (var i = 0; tables[i]; i++) {
        var t = tables[i];
        var c = t.className;
        var max = 0;
        var data = [];
        var labels = [];
        if (c.indexOf(triggerClass) !== -1) {
            var size = sizeCheck.exec(c);
            size = size ? size[1] : chartSize;
            var col = colCheck.exec(c);
            col = col ? col[1] : chartColor;
            var charturl = 'http://chart.apis.google.com/chart?cht=p&chco=' + col + '&chs=' + size + '&chd=t:';
            t.className += ' ' + hideClass;
            var tds = t.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
            for (var j = 0; tds[j]; j++) {
                var td = tds[j].getElementsByTagName('td');

                var d = parseInt(td[1].innerHTML);
                if (d != 0)
                {
                    labels.push(td[0].innerHTML);
                    data.push(d);
                    if (d > max)
                        max = d;
                }
            }
            ;
            var chart = document.createElement('img');
            chart.setAttribute('src', charturl + data.join(',') + '&chl=' + labels.join('|') + "&chds=0," + max);
            chart.setAttribute('alt', t.getAttribute('summary'));
            chart.setAttribute('align', 'middle');

            chart.className = chartClass;
            t.parentNode.insertBefore(chart, t);
        }
        else if (c.indexOf('bvg') !== -1) {
            var data2 = [];
            var data3 = [];
            var size = sizeCheck.exec(c);
            size = size ? size[1] : chartSize;
            var col = colCheck.exec(c);
            col = col ? col[1] : chartColor;
            var charturl = 'http://chart.apis.google.com/chart?cht=ls&chco=FF0000,00FF00,0000FF&chs=750x400&chbh=a&chdl=Pending|Requested|Dispatched&chxt=x,y&chd=t:';
            var tds = t.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
            for (var j = 0; tds[j]; j++) {
                var td = tds[j].getElementsByTagName('td');
                labels.push(td[0].innerHTML);
                var d = parseInt(td[1].innerHTML);
                data.push(d);
                if (d > max)
                    max = d;
                var d2 = parseInt(td[2].innerHTML);
                data2.push(d2);
                if (d2 > max)
                    max = d2;
                var d3 = parseInt(td[3].innerHTML);
                data3.push(d3);
                if (d3 > max)
                    max = d3;
            }
            ;


            var chart = document.createElement('img');
            chart.setAttribute('src', charturl + data.join(',') + '|' + data2.join(',') + '|' + data3.join(',') + '&chxl=0:|' + labels.join('|') + '|1:|0|' + max + "&chds=0," + max);
            chart.setAttribute('alt', t.getAttribute('summary'));
            chart.setAttribute('align', 'middle');

            chart.className = chartClass;
            t.parentNode.insertBefore(chart, t);
        }
        if (c.indexOf('chart2') !== -1) {
            var size = sizeCheck.exec(c);
            size = size ? size[1] : chartSizeBig;
            var col = colCheck.exec(c);
            col = col ? col[1] : chartColor;
            var charturl = 'http://chart.apis.google.com/chart?cht=p&chco=' + col + '&chs=' + size + '&chd=t:';
            t.className += ' ' + hideClass;
            var tds = t.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
            for (var j = 0; tds[j]; j++) {
                var td = tds[j].getElementsByTagName('td');

                var d = parseInt(td[1].innerHTML);
                if (d != 0)
                {
                    labels.push(td[0].innerHTML);
                    data.push(d);
                    if (d > max)
                        max = d;
                }
            }
            ;
            var chart = document.createElement('img');
            chart.setAttribute('src', charturl + data.join(',') + '&chl=' + labels.join('|') + "&chds=0," + max);
            chart.setAttribute('alt', t.getAttribute('summary'));
            chart.setAttribute('align', 'right');

            chart.className = chartClass;
            t.parentNode.insertBefore(chart, t);
        }
        ;
    }
    ;

    /* convert charts to tables */
    var charts = document.getElementsByTagName('img');
    for (var i = 0; charts[i]; i++) {
        if (charts[i].className.indexOf(toTableClass) !== -1) {
            var t = document.createElement('table');
            var tbody = document.createElement('tbody');
            var data = charts[i].getAttribute('src');
            var th, td, tr;
            var values = data.match(/chd=t:([^&]+)&?/)[1];
            var labels = data.match(/chl=([^&]+)&?/)[1];
            var l = labels.split('|');
            var v = values.split(',');
            for (var j = 0; l[j]; j++) {
                tr = document.createElement('tr');
                th = document.createElement('th');
                th.appendChild(document.createTextNode(l[j]));
                th.setAttribute('scope', 'row');
                td = document.createElement('td');
                td.appendChild(document.createTextNode(v[j]));
                tr.appendChild(th);
                tr.appendChild(td);
                tbody.appendChild(tr);
            }
            ;
            t.appendChild(tbody);
            t.setAttribute('summary', charts[i].getAttribute('alt'));
            charts[i].parentNode.insertBefore(t, charts[i]);
            charts[i].setAttribute('alt', '');
            t.className = tableClass;
        }
        ;
    }
    ;

}
