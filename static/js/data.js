/**
 * javascript used by data.php
 */

var cookiePrefix='preference_';


function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}


function sumFields(jsonObject,showVals,show){
	var total=0;
	for(var key in jsonObject){
		if(jsonObject.hasOwnProperty(key)){
			total=total+jsonObject[key];
		}
	}
	 if(groupby == 'pipe' && showVals != 'numbers' && show == 'status'){
		 if(jsonObject.hasOwnProperty(key)){
				total=total-jsonObject[12];
			}
	 }
	return total;
}

function formatNumber (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

function allMessages(jsonObject,showVals,show){
	var total=0;
	for(var key in jsonObject){
		if(jsonObject.hasOwnProperty(key)){
			total=total+sumFields(jsonObject[key],showVals,show);
		}
	}
	return total;
}

function print_a_row(row,headerArray,table_row,total,showVals){
	for(var key in headerArray){
		var value=row.hasOwnProperty(key)?row[key]:0;
		createTH(table_row, formatValue(value, total, showVals));
	}
}

function json_to_2Darray(json,groupby,showVals,show){
 var arr= new Array();
 for(var key in json){
	 var inner_arr= new Array();
	 var innerJSON= json[key];
	 //initialization of the inner array;
	 for(var i=0;i<jsonHeaderAraay.length;i++){
		 if(showVals=='numbers'){inner_arr[i]=0;}
		 else if(showVals=='percentages'){inner_arr[i]='0.00%';}
		 else inner_arr[i]="0<br />(0.00%)";
	 }
	 for(var innerkey in innerJSON){
		 //inner_arr.push(innerJSON[innerkey]);
		 inner_arr[parseInt(innerkey)]=innerJSON[innerkey];
	 }
	 inner_arr.unshift('X');
	 //inner_arr.unshift('All');
	 inner_arr.unshift(sumFields(jsonObject[key],showVals,show));
	 
	 jsonMetaDataName[key]!=undefined?inner_arr.unshift(jsonMetaDataName[key]):inner_arr.unshift('unDispatched');
	 jsonMetaDataId[key]!=undefined?inner_arr.unshift(makeLink(jsonMetaDataId[key], groupby)):inner_arr.unshift('unDispatched');

	 arr.push(inner_arr);
 }
 return arr;
}


function header_input(){
	var jsonHeaderArr=new Array();
	for(var i=0;i<jsonHeaderAraay.length;i++){
		var temp= new Object();
		temp['sTitle']=jsonHeaderAraay[i]['value'].replace(/_/g," ");
		jsonHeaderArr[i]=temp;
	};
	
	jsonHeaderArr.unshift(make_stitle('Scrubbed'));
	jsonHeaderArr.unshift(make_stitle('All'));
	var name;
	groupby=='userId'?name='Company Name':name=groupby+' Name';
	jsonHeaderArr.unshift(make_stitle(name));
	name=groupby;
	jsonHeaderArr.unshift(make_stitle(name));
	return jsonHeaderArr;
};

function make_stitle(text){
	var temp=new Object();
	temp['sTitle']=text;
	return temp;
}

function makeLink(metaDataId,groupby){
	if(metaDataId==undefined) return 'UnDispatched';
	if(groupby=='userId'){
		return '<a style="color:#871b12" href=userSummary.php?login='+ metaDataId+'>'+ metaDataId+ '</a>';}
	else if(groupby=='pipe'){
		if(metaDataId=='ALL'){return '<a href=pipeSummary.php>'+metaDataId+'</a>';}
		return '<a style="color:#871b12" href=pipeSummary.php?pipe='+metaDataId+'>'+metaDataId+'</a>';}
	else
		return metaDataId;
}

function createTH(row,thText,id)
{
	var th=document.createElement('th');
	if(id!=null){th.id=id;};
	th.innerHTML=thText;
	row.appendChild(th);
}

function formatValue(value,total,showVals)
{
	if(showVals=='percentages')
	{
		if(total==0)
			return "0%";
		return ((value*100)/total).toFixed(2)+"%";
	}
	else if (showVals=='numbers')
		return value;
	else{
		if(total==0)
			return value+"<br />(0%)";
		else
			return value+"<br />("+((value*100)/total).toFixed(2)+"%)";
	}
}


function cloneObject(obj) {
    var clone = {};
    for(var i in obj) {
        if(typeof(obj[i])=="object")
            clone[i] = cloneObject(obj[i]);
        else
            clone[i] = obj[i];
    }
    return clone;
}

function total_row(json){
	var total=new Array();
	for(var key in json){
		if(json.hasOwnProperty(key)){
			var innerJsonObject=json[key];
			for(var innerkey in innerJsonObject){
				if(innerJsonObject.hasOwnProperty(innerkey)){
					total[innerkey]=0;
				}
			}
		}
	};
	for(var key in json){	       
		if(json.hasOwnProperty(key)){
			var innerJsonObject=json[key];

			for(var innerkey in innerJsonObject){

				if(innerJsonObject.hasOwnProperty(innerkey)){

					total[innerkey]=total[innerkey]+innerJsonObject[innerkey];

				}
			}

		}
	}
	return total;
}



function adapt_showVal_json(showVals,show){
	var json=cloneObject(jsonObject);
	var total_arr=total_row(jsonObject);
	for(var key in json){
		innerJSON=json[key];
		for(var innerkey in innerJSON){
			innerJSON[innerkey]=formatValue(innerJSON[innerkey],sumFields(jsonObject[key],showVals,show),showVals);
		}
	}
	return json;
}

function target_array(){
	var target_arr= new Array();
	for(var i=0;i<jsonHeaderAraay.length+2;i++){
		target_arr[i]=i+2;
		}
	return target_arr;
}

function makeTable(table,jsonObject,jsonHeaderAraay,jsonMetaDataId,jsonMetaDataName,groupby,showVals,show){
    
    var total_array = total_row(jsonObject);
    console.log(total_array);
    var footer = document.createElement('tFoot');
    table.appendChild(footer);
    var row = footer.insertRow(0);
    row.id = 'footer_row';
    createTH(row, makeLink("ALL", groupby));
    createTH(row, "ALL");
    var total = allMessages(jsonObject, showVals, show);
    createTH(row, total);
    createTH(row, "X");
    var idealHeight = $(window).height() - $("#topline").height() - $("#submenu").height() - 290;
    print_a_row(total_array, jsonHeaderAraay, row, total, showVals);
    //header_rows=[];
    header_rows = header_input();

	
	//if($(':table').length!=0)$('#myTable').dataTable().fnDestroy();
	var target_arr=target_array();
	
	var table = $('#myTable').dataTable( {
		"sPaginationType": "full_numbers",
		"aaData":json_to_2Darray(adapt_showVal_json(showVals,show),groupby,showVals,show),
		"aoColumns":header_rows,
		"aaSorting": [[2,'desc']],
		"bAutoWidth":true,
		 "sDom": '<"export"T><"H"lfr>t<"F"ip>', // this adds TableTool in the center of the header
        "oTableTools": {
        	"aButtons":[
        	            //{ "sExtends":"csv", "sFieldBoundary":"\"","sFieldSeperator": "\t"},
        	            { "sExtends":"xls", "sButtonText":'Export to csv'}
        	],
            "sSwfPath": "swf/copy_cvs_xls.swf",
        },
		"bSortClasses":false,
		"bJQueryUI":true,
//		"sScrollY":idealHeight,
		"bProcessing":true,
		"bScrollCollapse":true,
		"sScrollX":"100%",
		"bPaginate": true,
		"iDisplayLength": 10,
        "aoColumnDefs": [{ "sType": "value_percentage", "aTargets": target_arr },
                         {"bSearchable": false, "aTargets":target_arr},
                         { "sWidth": "100px", "aTargets": [ 1 ] }

        ],
	} );
	//hiding Pending On Sender in Pipe Analysis View for percentage calculations
	if(groupby == 'pipe' && showVals != 'numbers' && show == 'status'){
		table.fnSetColumnVis(16, false );
	}
}
