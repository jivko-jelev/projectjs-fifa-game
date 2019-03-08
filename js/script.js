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

// sendingAjaxRequest('https://worldcup.sfg.io/matches/country?fifa_code=RUS', function (data) {
//     for (let i = 0; i < data.length; i++) {
//         console.log(data[i]);
//     }
// });

var matches;

sendingAjaxRequest('https://worldcup.sfg.io/matches', function (data) {
    matches = data;
    var table = document.getElementById('statistics').getElementsByTagName('tbody')[0];
    for (let i = 0; i < data.length; i++) {
        let column = 0;
        var row = table.insertRow(table.rows.length);
        var idCell = row.insertCell(column++);
        idCell.innerText = i + 1;

        var homeTeamCell = row.insertCell(column++);
        homeTeamCell.innerHTML = data[i].home_team_country;

        var awayTeamCell = row.insertCell(column++);
        awayTeamCell.innerHTML = data[i].away_team_country;

        var goalsCell = row.insertCell(column++);
        goalsCell.innerHTML = data[i].home_team.goals + ':' + data[i].away_team.goals;

        var locationCell = row.insertCell(column++);
        locationCell.innerHTML = data[i].location + ' (' + data[i].venue + ')';

        var weatherCell = row.insertCell(column++);
        weatherCell.innerHTML = `<img src="images/${encodeURI(data[i].weather.description)}.png" class="weather" alt="The weather during the match between ${data[i].home_team_country} and ${data[i].away_team_country} is ${data[i].weather.description.toLowerCase()}" title="${data[i].weather.description}">`;

        var tempCell = row.insertCell(column++);
        tempCell.innerHTML = data[i].weather.temp_celsius + '°C';
    }

    function startingEleven(data) {
        return `${data.shirt_number} ${data.name}` + (data.captain ? '(CAP)' : '') + '<br>';
    }

    function addRowHandlers() {
        var rows = table.getElementsByTagName("tr");
        for (i = 0; i < rows.length; i++) {
            var currentRow = table.rows[i];
            var createClickHandler = function (row) {
                return function () {
                    var cell = row.getElementsByTagName("td")[0];
                    var id = cell.innerHTML;
                    modal.style.display = "block";
                    document.getElementById('modal-header').innerText = `${data[id - 1].home_team_country} - ${data[id - 1].away_team_country} ${data[id - 1].home_team.goals}:${data[id - 1].away_team.goals}`;
                    var modalBody = document.getElementById('modal-body');
                    modalBody.innerHTML = 'Starting Elevens\n<table><thead><tr><th>Home Team</th><th>Away Team</th></tr></thead><tbody id="tbody">';
                    var tbody = document.getElementById('tbody');
                    for (let i = 0; i < 11; i++) {
                        tbody.innerHTML += `<tr>
                            <td>${startingEleven(data[id - 1].home_team_statistics.starting_eleven[i])}</td>
                            <td>${startingEleven(data[id - 1].away_team_statistics.starting_eleven[i])}</td>
                            </tr>`;
                    }
                    modalBody.innerHTML += '</tbody>';
                    console.log(data[id - 1]);
                };
            };
            currentRow.onclick = createClickHandler(currentRow);
        }
    }

    addRowHandlers();

    var modal = document.getElementById('myModal');


// Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];


// When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

// When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});


var teams;

var searchByCountry = document.getElementById('search-by-country');
searchByCountry.addEventListener('focus', function () {
    if (teams === undefined) {
        sendingAjaxRequest('https://worldcup.sfg.io/teams', function (data) {
            teams = data;
        });
    }
    searchForCountry();
    document.getElementById('country-list').style.left = searchByCountry.style.left;
    document.getElementById('country-list').style.display = 'inherit';
});

searchByCountry.addEventListener('blur', function (e) {
    if (e.relatedTarget === null || e.relatedTarget.id !== 'country-list') {
        document.getElementById('country-list').style.display = 'none';
    }
});

searchByCountry.addEventListener('keyup', function () {
    searchForCountry();
});

function searchForCountry() {
    var countryList = document.getElementById('country-list');
    document.getElementById('country-list').style.display = 'inherit';
    if (searchByCountry.value.trim() !== '') {
        countryList.innerHTML = '';
        for (let i = 0; i < teams.length; i++) {
            if (teams[i].country.toLowerCase().indexOf(searchByCountry.value.toLowerCase().trim()) !== -1) {
                var option = document.createElement("option");
                option.text = teams[i].country;
                option.value = teams[i].fifa_code;
                countryList.add(option);
            }
        }
        countryList.addEventListener('change', function (e) {
            function getSelectedText() {
                if (countryList.selectedIndex == -1)
                    return null;
                return countryList.options[countryList.selectedIndex].text;
            }

            searchByCountry.value = getSelectedText();
            document.getElementById('country-list').style.display = 'none';
            document.getElementById('search').scrollIntoView(true);
        }, false);
    } else {
        countryList.innerHTML = '';
    }
}
