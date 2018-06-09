/**
 * 
 */

//var utilsURL='http://latency-crossanalysis:8081/analysisUI/crossutilsapi';

var utilsURL = 'http://host0114.bom1.gupshup.me:8082/analysisUI/crossutilsapi';

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else
        var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}


function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

String.prototype.startsWith = function (substr) {
    return (this.substring(0, substr.length) == substr);
};

/**filter specific code**/
var cookiePrefix = 'preference_';

function isFilterCookieSet(cookieName)
{
    var c = readCookie(cookiePrefix + cookieName);
    if (c == null || c == '')
        return false;
    else
        return true;
}

function readFilterCookie(cookieName, defaultValue)
{
    var c = readCookie(cookiePrefix + cookieName);
    if (c == null || c == '')
        return defaultValue;
    else
        return c;
}

function createFilterCookie(cookieName, value)
{
    createCookie(cookiePrefix + cookieName, value, 7);
}
function eraseFilterCookie(cookieName, value)
{
    createFilterCookie(cookiePrefix + cookieName, value, -1);
}

function clearCookies() {
    var allCookies = document.cookie.split('; ');
    for (var key in allCookies) {
        var cookieName = allCookies[key].split('=')[0];
        if (cookieName.startsWith(cookiePrefix)) {
            eraseCookie(cookieName);
        }
    }

    for (var i in filters) {
        if (filters.hasOwnProperty(i)) {
            var lst = document.getElementById(i + '_list');
            while (lst.hasChildNodes())
            {
                lst.removeChild(lst.lastChild);
            }
            filters[i].updateList(lst, filters[i].defaultValues);
        }
    }
    filters[current].hide();
    filters[current].fill();
    document.getElementById('clear_list_button').disabled = true;
}
function showDateRange() {

    var listLink = document.getElementById('dr_list');
    if (listLink.hasChildNodes())
        listLink.removeChild(listLink.lastChild);
    var text = document.forms[0].fromDateTime.value + ' ' + "->" + document.forms[0].toDateTime.value;

    listLink.appendChild(document.createTextNode(text));
    enableSetFilterButton();
}


function initFromTime()
{
    $("#datetimepickerfrom").datetimepicker(
            {
                onClose: function (a, b) {
                    initToTime();
                    showDateRange();
                }
            });
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    $("#datetimepickerfrom").datetimepicker('setDate', readFilterCookie('fromDateTime', date));
}
function initToTime() {
    $("#datetimepickerto").datetimepicker('destroy');
    var fromDateTime = $('#datetimepickerfrom').datetimepicker('getDate');
    $("#datetimepickerto").datetimepicker({
        minDate: fromDateTime,
        onClose: function (a, b) {
            showDateRange();
        }
    });
    var toDateTime = $('#datetimepickerto').datetimepicker('getDate');
    if ((toDateTime == '') || (toDateTime == null)) {
        $("#datetimepickerto").datetimepicker('setDate', readFilterCookie('toDateTime', new Date()));

    }
    toDateTime = $('#datetimepickerto').datetimepicker('getDate');
    if (toDateTime < fromDateTime) {
        $("#datetimepickerto").datetimepicker('setDate', fromDateTime);
    }
}

function is_in_array(value, array) {
    if (array == null)
        return false;

    for (var i = 0; i < array.length; i++) {
        if (array[i] == value) {
            return true;
        }
    }
    return false;
}

function p(obj) {
    var s = "{";
    for (var key in obj) {
        s = s + key + ":" + obj[key] + ",";
    }
    return s + "}";
}

function modifyJSON(JSON) {
    for (var key in JSON) {
        var innerJSON = JSON[key];
        JSON[key] = innerJSON["companyName"] + '(' + innerJSON["loginId"] + ')';
    }
    ;
    return JSON;
}

function handlerUserSearchBox(ajaxResponse) {
    filters['us'].data = sumJSONData(modifyJSON(ajaxResponse), selectedJSON('us'));
    fillData('datalist', filters['us'].data, 'us', 'checkbox');
}
var userSearchRequest = null;
function searchBox(value) {
    if (current == 'us') {
        if (userSearchRequest != null)
            userSearchRequest.abort();
        if (value == '')
            handlerUserSearchBox({});
        else
            userSearchRequest = $.ajax({url: utilsURL + '?searchUsers=' + value, dataType: 'jsonp', success: handlerUserSearchBox, });
    }
    else {
        var regex = new RegExp(value, "i");
        $("#choose > li").each(function (index) {
            $(this).toggle((regex.test($(this).text())));
        });
        $(":checked").each(function (index) {
            $(this).parent().show();
        });
    }
}

function sumJSONData(newJSON, currentData) {
    var sum = {};
    for (var key in newJSON) {
        sum[key] = newJSON[key];
    }
    for (var key in currentData) {
        if (!(sum.hasOwnProperty(key))) {
            sum[key] = currentData[key];
        }
        ;
    }
    ;
    return sum;
}


function selectedJSON(tag) {
    var selected = {};
    $("#us_list > li").each(function (index) {
        selected[$(this).get(0).id.split('_')[1]] = document.getElementById($(this).get(0).id).childNodes[0].nodeValue;
    });
    return selected;
}

function searchBoxFocus(context) {
    if (context.value == 'Search') {
        context.value = '';
    }
}

function searchBoxBlur(context) {
    if (context.value == '') {
        context.value = 'Search';
    }
}

function is_selected(key) {
    return (document.getElementById(key) != null);
}
function fillData(datadiv, data, tag, type) {
    var datalistdiv = document.getElementById(datadiv);
    var ul = document.getElementById('choose');
    if (ul != null)
        datalistdiv.removeChild(ul);

    var datalist = document.createElement('ul');
    datalist.id = "choose";
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            var li = document.createElement('li');
            var cb = document.createElement('input');
            cb.type = type;
            cb.name = 'advance';
            cb.value = key;
            cb.onchange = function () {
                enableSetFilterButton();
                filters[current].updateSelectionListInner(this.checked, this.value, type);
            };
            cb.checked = is_selected(tag + '_' + key);
            li.appendChild(cb);
            filters[current].appendTextNode(key, li);
            datalist.appendChild(li);
        }
    }
    datalistdiv.appendChild(datalist);
}

function Filter(tag, name, hasUniqueName) {

    this.tag = tag;
    this.name = name;
    this.data = null;
    this.hasUniqueName = hasUniqueName;
    this.datadiv = 'datalist';
    this.defaultValues = null;
    this.setData = function (datasource, func) {
        if (datasource != null) {
            $.ajax({
                url: utilsURL + '?' + datasource,
                dataType: 'jsonp',
                //async:false,
                context: this,
                success: function (data) {
                    if (func != null)
                        this.data = func(data);
                    else
                        this.data = data;
                    this.onload();
                },
                error: function () {
                    alert('hey, error for ' + this.name);
                }
            });
        }
    };
    this.onload = function () {
        this.appendSelectedList();
    };
    this.showText = function (key) {
        if (this.hasUniqueName) {
            return this.data[key] + ' (' + key + ')';
        }
        return this.data[key];
    };
    this.appendTextNode = function (key, whereToAppend) {
        var text = document.createTextNode(this.showText(key));
        whereToAppend.appendChild(text);
    };
    this.hide = function ()
    {
        var datalist = document.getElementById(this.datadiv);
        datalist.removeChild(datalist.lastChild);
    };

    this.fill = function ()
    {
        fillData(this.datadiv, this.data, this.tag, 'checkbox');
    };
    this.populate = function populate(list) {
        var li = document.createElement('li');
        li.setAttribute('class', 'closed');
        var a = document.createElement('a');
        a.setAttribute('href', '#');
        a.onclick = setFilterValue;
        a.id = "attr_" + tag;
        var textNode = document.createTextNode(name);
        list.appendChild(li);
        li.appendChild(a);
        a.appendChild(textNode);
    };
    this.updateSelectionListInner = function (x, value, type) {
        switch (x) {
            case true:
                var listLink = document.getElementById(this.tag + '_list');
                if (type == 'radio')
                {
                    if (listLink.hasChildNodes())
                        listLink.removeChild(listLink.lastChild);
                }
                var a = document.createElement('li');
                a.id = this.tag + '_' + value;
                this.appendTextNode(value, a);
                listLink.appendChild(a);
                break;
            case false:
                var listLink = document.getElementById(this.tag + '_' + value);
                if (listLink != null) {
                    listLink.parentNode.removeChild(listLink);
                }
                ;

                break;
        }
    };
    this.showSelectionList = function (selection_list_div, selection_list_button) {
        var b = document.createElement('b');
        b.appendChild(document.createTextNode(this.name));
        selection_list_div.insertBefore(b, selection_list_button);

        var uList = document.createElement('ul');
        uList.id = this.tag + "_list";
        //var cookieString=readFilterCookie(this.tag,this.defaultValues);
        //this.updateList(uList,cookieString);
        selection_list_div.insertBefore(uList, selection_list_button);
    };
    this.appendSelectedList = function () {
        var uList = document.getElementById(this.tag + "_list");
        var cookieString = readFilterCookie(this.tag, this.defaultValues);
        if (!(uList.hasChildNodes()))
            this.updateList(uList, cookieString);
    };
    this.updateList = function (uList, listAsString) {
        if (listAsString == null || listAsString.length == 0)
            return;
        var list = listAsString.split(",");
        if (list != null) {
            for (var j = 0; j < list.length; j++) {
                var temp = document.createElement('li');
                temp.id = "" + this.tag + '_' + list[j];
                temp.value = list[j];
                this.appendTextNode(list[j], temp);
                uList.appendChild(temp);
            }
            ;
        }
        ;
    };

    this.updateCookie = function () {
        var selected = document.getElementById(this.tag + "_list");
        var children = selected.getElementsByTagName('li');
        var store_in_cookie = [];

        for (var i = 0; i < children.length; i++) {
            store_in_cookie[i] = children[i].id.split("_")[1];
        }
        createFilterCookie(this.tag, store_in_cookie);
    };
    this.setDisplay = function (disp) {
        document.getElementById(this.datadiv).style.display = disp;
    };

}
setFilterValue = function () {
    var linkid = this.id.substring(5);
    if (linkid == current)
        return false;
    if (current != null)
    {
        filters[current].setDisplay('none');
        filters[current].hide();
    }
    current = linkid;

    var otherLinks = this.parentNode.parentNode.getElementsByTagName('li');
    for (var i = 0; i < otherLinks.length; i++) {
        otherLinks[i].setAttribute("class", 'closed');
    }
    this.parentNode.setAttribute("class", 'open');

    filters[current].setDisplay('block');
    document.getElementById('searchTextBox').value = 'Search';
    filters[current].fill();
    return false;
};
var filters = new Object();
var current = null;
function start() {
    filters['dr'] = new Filter('dr', 'Time Frame', false);
    filters['l'] = new Filter('l', 'Locations', false);
    filters['p'] = new Filter('p', 'Pipes', true);
    filters['c'] = new Filter('c', 'Carriers', false);
    filters['pr'] = new Filter('pr', 'Products', false);
    filters['us'] = new Filter('us', 'Users', false);
    filters['us'].fill = function ()
    {
        fillData('datalist', selectedJSON('us'), 'us', 'checkbox');
    };
    filters['dr'].showSelectionList = function (selection_list_div, selection_list_button) {
        var b = document.createElement('b');
        b.appendChild(document.createTextNode(this.name));
        selection_list_div.insertBefore(b, selection_list_button);

        var lList = document.createElement('ul');
        lList.id = this.tag + "_list";
        if ((isFilterCookieSet('fromDateTime') && isFilterCookieSet('toDateTime'))) {
            var text = readFilterCookie('fromDateTime', null) + ' ->' + readFilterCookie('toDateTime', null);
            var txt = document.createTextNode(text);
            lList.appendChild(txt);
        }
        selection_list_div.insertBefore(lList, selection_list_button);
    };

    filters['dr'].datadiv = 'timeframepicker';
    filters['dr'].updateCookie = function () {
        if (document.getElementById('dr_list').hasChildNodes()) {
            array = document.getElementById('dr_list').childNodes[0].nodeValue.split('->');
            createFilterCookie('fromDateTime', array[0]);
            createFilterCookie('toDateTime', array[1]);
        }
        else
        {
            eraseFilterCookie('fromDateTime');
            eraseFilterCookie('toDateTime');
        }
    };
    filters['dr'].fill = function () {
        ;
    };
    filters['dr'].hide = function () {
        ;
    };
    filters['pr'].defaultValues = 'ENTEPRISE';
    filters['pr'].fill = function () {
        fillData(this.datadiv, this.data, this.tag, 'radio');
    };
}
function enableSetFilterButton() {
    document.getElementById('selection_list_button').disabled = false;
}




function updateCookies() {
    for (var key in filters) {
        if (filters.hasOwnProperty(key)) {
            filters[key].updateCookie();
        }
        ;
    }
    document.getElementById('selection_list_button').disabled = true;
    document.getElementById('clear_list_button').disabled = false;
}

function populateFilterList()
{
    var list = document.getElementById('filter_link_list');
    var selection_list_button = document.getElementById('selection_list_button');
    var selection_list_div = document.getElementById('selection_list');
    for (var i in filters) {
        if (filters.hasOwnProperty(i)) {
            filters[i].populate(list);
            filters[i].showSelectionList(selection_list_div, selection_list_button);
        }
    }
}
function create_popup_headers(selection_list_div) {
    while (selection_list_div.hasChildNodes())
    {
        selection_list_div.removeChild(selection_list_div.lastChild);
    }
    for (var i in filters) {
        if (filters.hasOwnProperty(i)) {
            filters[i].showSelectionList(selection_list_div, null);
        }
    }
}
function prepare_popup(linkselecter) {
    start();
    var d = document.createElement("div");
    d.id = 'popup_div';
    document.body.appendChild(d);
    var link = $(linkselecter);
    var popupdiv = $("#popup_div");
    popupdiv.dialog({autoOpen: false,
        closeOnEscape: true,
        title: 'Selected Filters',
        open: function (event, ui) {
            create_popup_headers(popupdiv.get(0));
            loadFiltersData();
            $(".ui-dialog-titlebar-close", ui.dialog).hide();
        },
        position: {my: 'left top', at: 'left bottom', of: link},
        width: 350
    });

    link.mouseover(function () {
        popupdiv.dialog('open');
    });
    link.mouseout(function () {
        popupdiv.dialog('close');
    });
    link.attr('href', '#');
}
function loadFiltersData() {
    filters['pr'].data = {"ENTEPRISE": "ENTERPRISE", "GUPSHUP": "SMSGUPSHUP", "CHAT": "CHAT", "ALL": "All Products"};
    filters['l'].setData('listlocations');
    filters['p'].setData('listpipes');
    filters['c'].setData('listcarriers');
    var usersCookie = readFilterCookie('us', null);
    var userDataSource = null;
    if (usersCookie != null)
        userDataSource = 'getUsers=' + usersCookie;
    filters['us'].setData(userDataSource, modifyJSON);
    filters['pr'].onload();
    filters['dr'].onload();
}
function onLoadFunction() {
    $.datepicker.setDefaults({
        dateFormat: 'yy-mm-dd'
    });
    $.timepicker.setDefaults({
        timeFormat: 'hh:mm',
        stepMinute: 5
    });
    initFromTime();
    initToTime();
    start();
    populateFilterList();
    loadFiltersData();
    document.getElementById('attr_dr').onclick();
}
