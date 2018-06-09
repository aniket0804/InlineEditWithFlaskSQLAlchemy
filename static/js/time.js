/**
 * 
 */


function select_block_number(i, j) {
    return Math.floor(i / j);
}

function find_max_key(jsonObject) {
    var maxBlock = 0;
    for (var key in jsonObject) {
        if (jsonObject.hasOwnProperty(key)) {
            if (parseInt(key) > maxBlock) {
                maxBlock = parseInt(key);
            }
        }
    }
    return maxBlock;
}


function dateTimeValue(value) {
    var today = new Date();
    var hours = Math.floor(value);
    var current_time = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, 0, 0, 0);
    return current_time;
}


function p(obj) {
    var s = "{";
    for (var key in obj) {
        s = s + key + ":" + obj[key] + ",";
    }
    return s + "}";
}
function fiveToFifteen(jsonObject, jsonHeaderAraay) {
    var compactJSON = new Object();
    var maxBlock = Math.floor(find_max_key(jsonObject));
    for (var i = 0; i <= maxBlock; i++) {
        compactJSON[i + ''] = new Object();
        for (var key in jsonHeaderAraay) {
            compactJSON[i + ''][key] = 0;
        }
    }

    for (var key in jsonObject) {
        if (jsonObject.hasOwnProperty(key)) {
            var innerJSONobject = jsonObject[key];
            for (var innerkey in innerJSONobject) {
                if (innerJSONobject.hasOwnProperty(innerkey)) {
                    compactJSON['' + select_block_number(parseInt(key), 1)][innerkey] += parseInt(jsonObject[key][innerkey]);
                }
            }
        }
    }
    return compactJSON;
}


function sum_a_row(jsonObj) {
    var sum = 0;
    for (var key in jsonObj) {
        if (jsonObj.hasOwnProperty(key)) {
            sum += parseInt(jsonObj[key]);
        }
    }
    return sum;
}
function createDataTable(compactJSON, jsonHeaderAraay, showVals) {
    var data = new google.visualization.DataTable();
    data.addColumn('datetime', 'Time');
    data.addColumn('number', 'Total');
    for (var key in jsonHeaderAraay) {
        if (jsonHeaderAraay.hasOwnProperty(key)) {
            data.addColumn('number', jsonHeaderAraay[key].value);
        }
    }
    var num_rows = parseInt(find_max_key(compactJSON));
    data.addRows(num_rows + 1);

    for (var key in compactJSON) {
        if (compactJSON.hasOwnProperty(key)) {

            data.setCell(parseInt(key), 0, dateTimeValue(parseInt(key)));
            data.setCell(parseInt(key), 1, sum_a_row(compactJSON[key]));
            for (var innerkey in jsonHeaderAraay) {
                if (jsonHeaderAraay.hasOwnProperty(innerkey)) {
                    if (showVals == 'percentages') {
                        var total = data.getValue(parseInt(key), 1);
                        var percentage = (total == 0) ? 0 : (parseInt(compactJSON[key][innerkey]) / data.getValue(parseInt(key), 1)) * 100;
                        data.setCell(parseInt(key), parseInt(innerkey) + 2, percentage);
                    }
                    else {
                        data.setCell(parseInt(key), parseInt(innerkey) + 2, parseInt(compactJSON[key][innerkey]));
                    }
                }
            }
        }
    }

    if (showVals == 'percentages') {
        var formatter = new google.visualization.NumberFormat({fractionDigits: 2, suffix: '%'});
        for (var v = 2; v < data.getNumberOfColumns(); v = v + 1)
        {
            formatter.format(data, v);
        }
    }
    return data;
}
function drawTimeLine(visualizationDiv, data, showVals) {
    visualizationDiv.style.display = 'block';
    var annotatedtimeline = new google.visualization.AnnotatedTimeLine(visualizationDiv);
    var options = {'displayAnnotations': true
        , 'displayExactValues': true
        , 'displayRangeSelector': false
        , 'displayZoomButtons': false
    };
    if (showVals == 'percentages') {
        options['scaleColumns'] = [0, 2];
        options['scaleType'] = 'allfixed';
    }
    annotatedtimeline.draw(data, options);
    annotatedtimeline.hideDataColumns(1);
    for (var v = 3; v < data.getNumberOfColumns(); v = v + 1)
    {
        annotatedtimeline.hideDataColumns(v);
    }
}
function drawTable(div, data) {
    var originalVisualization = new google.visualization.Table(div);
    originalVisualization.draw(data, {'allowHtml': true});
}
function makeVisualizationTable(table, jsonObject, jsonHeaderAraay, jsonMetaDataId, jsonMetaDataName, groupby, showVals)
{
    compactJSON = fiveToFifteen(jsonObject, jsonHeaderAraay);
    var data = createDataTable(compactJSON, jsonHeaderAraay, showVals);
    drawTable(table, data);
    drawTimeLine(document.getElementById('visualization'), data, showVals);
}

google.load('visualization', '1', {packages: ['annotatedtimeline', 'table']});
