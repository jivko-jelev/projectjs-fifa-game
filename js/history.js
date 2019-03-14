function pad(number) {
    return number > 9 ? number : '0' + number;
}

function formatDate(date) {
    date = new Date(date);
    let dd = date.getDate();
    let mm = pad(date.getMonth() + 1);
    let yyyy = pad(date.getFullYear());
    return `${dd}.${mm}.${yyyy}`;
}

function formatTime(date) {
    date = new Date(date);
    let hour = pad(date.getHours());
    let minutes = pad(date.getMinutes());
    let seconds = pad(date.getSeconds());
    return `${hour}:${minutes}:${seconds}`;
}

function loadHistoryData() {
    function addRow(index) {
        let column = 0;
        var row = table.insertRow(table.rows.length);
        row.insertCell(column++).innerText = index + 1;
        row.insertCell(column++).innerHTML = storage[index].event;
        row.insertCell(column++).innerHTML = formatDate(storage[index].date);
        row.insertCell(column++).innerHTML = formatTime(storage[index].date);
        var text = '';

        if (typeof Object.keys !== "function") {
            (function () {
                var hasOwn = Object.prototype.hasOwnProperty;
                Object.keys = Object_keys;

                function Object_keys(obj) {
                    var keys = [], name;
                    for (name in obj) {
                        if (hasOwn.call(obj, name)) {
                            keys.push(name);
                        }
                    }
                    return keys;
                }
            })();
        }

        if (storage[index].data !== undefined) {
            for (let j = 0; j < Object.keys(storage[index].data).length; j++) {
                let data = storage[index].data[Object.keys(storage[index].data)[j]];
                text += Object.keys(storage[index].data)[j] + ': <span class="events">' + (data !== '' ? data : '<span class="my-alert">all</span>') + '</span><br>';
            }
            row.insertCell(column++).innerHTML = text;
        } else {
            row.insertCell(column++).innerHTML = '<span class="faded-text">There are no parameters for this operation</span>';
        }
    }

    SaveDataToLocalStorage({
        'event': 'View History',
        'date': Date(),
        'data': {'Order By': document.getElementById('order').options[document.getElementById('order').selectedIndex].text}
    });

    var table = document.getElementById('statistics').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    let storage = JSON.parse(localStorage.getItem('session'));
    let order = document.getElementById('order').value;

    if (storage !== null) {
        if (order === 'newest') {
            for (let i = storage.length - 1; i >= 0; i--) {
                addRow(i);
            }
        } else {
            for (let i = 0; i < storage.length; i++) {
                addRow(i);
            }
        }
    }
}

document.getElementById('order').addEventListener('change', function () {
    loadHistoryData();
});

document.getElementById('delete-history').addEventListener('click', function () {
    localStorage.clear();
    document.getElementById('statistics').getElementsByTagName('tbody')[0].innerHTML = '';
})

loadHistoryData();