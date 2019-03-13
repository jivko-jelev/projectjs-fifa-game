function sendingAjaxRequest(url, callbacks) {
    var ajax = createXmlHttpRequestObject();

    function createXmlHttpRequestObject() {
        var xmlHttp;

        // If using Internet Explorer
        if (window.ActiveXObject) {
            try {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                xmlHttp = false;
            }
        }
        // For other browsers
        else {
            try {
                xmlHttp = new XMLHttpRequest();
            } catch (e) {
                xmlHttp = false;
            }
        }

        if (!xmlHttp) {
            alert("Error creating the XMLHttpRequest object.");
        } else {
            return xmlHttp;
        }
    }

    if (ajax.readyState == 4 || ajax.readyState == 0) {
        ajax.open('GET', url);
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    var jsonResponse = JSON.parse(ajax.responseText);
                    callbacks(jsonResponse);
                } else {
                    alert('Error accessing the server: ' + ajax.statusText);
                }
            }
        }
        ajax.send(null);
    }
    else {
        setTimeout('sendingAjaxRequest()', 1000);
    }
}

function SaveDataToLocalStorage(data) {
    var a = [];
    if (localStorage.getItem('session') !== null) {
        a = JSON.parse(localStorage.getItem('session'));
    }
    a.push(data);
    localStorage.setItem('session', JSON.stringify(a));
}
