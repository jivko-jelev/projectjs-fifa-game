var matches;

sendingAjaxRequest('http://worldcup.sfg.io/matches', function (data) {
    matches = data;
    var table = document.getElementById('statistics').getElementsByTagName('tbody')[0];
    for (let i = 0; i < data.length; i++) {
        let column = 0;
        var row = table.insertRow(table.rows.length);
        var idCell = row.insertCell(column++);
        idCell.innerText = i + 1;

        row.insertCell(column++).innerHTML = data[i].home_team_country;
        row.insertCell(column++).innerHTML = data[i].away_team_country;
        row.insertCell(column++).innerHTML = data[i].home_team.goals + ':' + data[i].away_team.goals;
        row.insertCell(column++).innerHTML = data[i].location + ' (' + data[i].venue + ')';
        row.insertCell(column++).innerHTML = `<img src="images/${encodeURI(data[i].weather.description)}.png" class="weather" alt="The weather during the match between ${data[i].home_team_country} and ${data[i].away_team_country} is ${data[i].weather.description.toLowerCase()}" title="${data[i].weather.description}">`;
        row.insertCell(column++).innerHTML = data[i].weather.temp_celsius + '°C';
    }

    // After filtering does not change the width of the columns in the table
    let ths = document.getElementById('statistics').getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th');
    for (let i = 0; i < ths.length; i++) {
        ths[i].setAttribute('width', ths[i].offsetWidth);
    }

    function getCardsForPlayer(player, team) {
        text = '';
        for (let i = 0; i < team.length; i++) {
            if (team[i].player === player && team[i].type_of_event === 'yellow-card' || team[i].type_of_event === 'red-card') {
                text += `<img src="images/${team[i].type_of_event}.png" alt="${team[i].type_of_event}" class="flags">`;
            }
        }
        return text;
    }

    function startingElevenHomeTeam(data) {
        return `${data.shirt_number} ${data.name}` + (data.captain ? ' (CAP)' : '');
    }

    function startingElevenAwayTeam(data) {
        return `${data.name}` + (data.captain ? ' (CAP) ' : ' ') + data.shirt_number;
    }

    function loadDialogWithStatistics(row) {

        function getGoals() {
            function getGoalsForTeam(team, otherTeam) {
                var text = '';
                for (let i = 0; i < team.length; i++) {
                    if (team[i].type_of_event == 'goal' || team[i].type_of_event == 'goal-penalty') {
                        let penaltyGoal = team[i].type_of_event == 'goal-penalty' ? '(P)' : '';
                        text += `${team[i].player} ${team[i].time}${penaltyGoal}<br>`;
                    }
                }
                for (let i = 0; i < otherTeam.length; i++) {
                    if (otherTeam[i].type_of_event == 'goal-own') {
                        text += `${otherTeam[i].player} ${otherTeam[i].time}(AG)<br>`;
                    }
                }
                return text;
            }

            var homeTeamGoals = `<div style="position: relative; margin-top: -30px;"><p>${getGoalsForTeam(data[id].home_team_events, data[id].away_team_events)}</p>`;
            var awayTeamGoals = `<div class="pull-right"><p class="away-team">${getGoalsForTeam(data[id].away_team_events, data[id].home_team_events)}</p></div></div>`;
            return `<div class="goals">${homeTeamGoals}${awayTeamGoals}</div>`;
        }

        var cell = row.getElementsByTagName("td")[0];
        var id = cell.innerHTML - 1;
        modal.style.display = "block";
        document.getElementById('modal-header').innerText = `${data[id].home_team_country} - ${data[id].away_team_country}`;
        var modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `<h2>${data[id].home_team.goals} - ${data[id].away_team.goals}</h2>`;
        modalBody.innerHTML += '<img src="images/soccer-ball-retina.png" class="fifa-ball" alt="soccer ball retina">';
        modalBody.innerHTML += getGoals();
        modalBody.innerHTML += `<table id="starting-eleven-for-match">
                                    <thead>
                                        <tr><th colspan="2"><h4>Starting Elevens</h4></th></tr>
                                        <tr>
                                            <th>${data[id].home_team_country}</th>
                                            <th>${data[id].away_team_country}</th>
                                        </tr>
                                    </thead>
                                <tbody id="tbody">`;
        var tbody = document.getElementById('tbody');
        for (let i = 0; i < 11; i++) {
            tbody.innerHTML += `<tr>
                            <td>${startingElevenHomeTeam(data[id].home_team_statistics.starting_eleven[i])}${getCardsForPlayer(data[id].home_team_statistics.starting_eleven[i].name, data[id].home_team_events)}</td>
                            <td>${getCardsForPlayer(data[id].away_team_statistics.starting_eleven[i].name, data[id].away_team_events)}${startingElevenAwayTeam(data[id].away_team_statistics.starting_eleven[i])}</td>
                            </tr>`;
        }
        modalBody.innerHTML += '</tbody>';

        modalBody.innerHTML += `<h4>Statistics</h4>\n
                                <table id="statistics-for-match">
                                    <thead>
                                        <tr>
                                            <th>${data[id].home_team_country}</th>
                                            <th></th>
                                            <th>${data[id].away_team_country}</th>
                                        </tr>
                                    </thead>
                                <tbody id="statistics-for-current-match">`;
        var statistics = document.getElementById('statistics-for-current-match');

        function getStatisticsFor(key, suffix = '') {
            return `<tr>
                        <td>${data[id].home_team_statistics[key]}${suffix}</td>
                        <td class="center-text">${key.split('_').join(' ')}</td>
                        <td>${data[id].away_team_statistics[key]}${suffix}</td>
                    </tr>`;
        }

        statistics.innerHTML += getStatisticsFor('attempts_on_goal');
        statistics.innerHTML += getStatisticsFor('on_target');
        statistics.innerHTML += getStatisticsFor('off_target');
        statistics.innerHTML += getStatisticsFor('corners');
        statistics.innerHTML += getStatisticsFor('pass_accuracy', '%');
        statistics.innerHTML += getStatisticsFor('offsides');
        statistics.innerHTML += getStatisticsFor('ball_possession', '%');
        statistics.innerHTML += getStatisticsFor('yellow_cards');
        statistics.innerHTML += getStatisticsFor('red_cards');
        modalBody.innerHTML += '</tbody>';

        SaveDataToLocalStorage({
            'event': 'View Match',
            'date': Date(),
            'data': {
                'Teams': `${data[id].home_team_country} - ${data[id].away_team_country}`,
                'Result' : `${data[id].home_team.goals} - ${data[id].away_team.goals}`,
            }
        });
    }

    function addRowHandlers() {
        var rows = table.getElementsByTagName("tr");
        for (i = 0; i < rows.length; i++) {
            var currentRow = table.rows[i];
            var createClickHandler = function (row) {
                return function () {
                    loadDialogWithStatistics(row);
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

    window.onkeyup= function(event){
       if(event.key === 'Escape' && modal.style.display !== "none"){
           modal.style.display = "none";
       }
    };
    SaveDataToLocalStorage({
        'event': 'View All Matches',
        'date': Date(),
    });
});


var teams;
var countryList = document.getElementById('country-list');
var searchByCountry = document.getElementById('search-by-country');

searchByCountry.addEventListener('focus', function () {
    if (teams === undefined) {
        sendingAjaxRequest('http://worldcup.sfg.io/teams', function (data) {
            teams = data;
        });
    }
    searchForCountry();
    countryList.style.display = searchByCountry.value === '' ? 'none' : 'inherit';
});

searchByCountry.addEventListener('blur', function (e) {
    if (e.relatedTarget === null || e.relatedTarget.id !== 'country-list') {
        countryList.style.display = 'none';
    }
});

document.getElementById('country-list').addEventListener('blur', function (e) {
    if (e.relatedTarget === null || e.relatedTarget.id !== 'country-list') {
        countryList.style.display = 'none';
    }
});

searchByCountry.addEventListener('keyup', function (e) {
    if(e.key === 'Escape'){
        countryList.style.display = "none";
    }else {
        searchForCountry();
    }
});

document.getElementById('clear-filter-by-country').addEventListener('click', function () {
    searchByCountry.value = '';
    searchForCountry();
    countryList.style.display = 'none';
});

function searchForCountry() {
    function filterListByCountry(country) {
        country = country.toLowerCase();
        let table = document.getElementById('statistics');
        let tbody = table.getElementsByTagName("tbody")[0];
        for (let i = 0; i < tbody.rows.length; i++) {
            let trs = tbody.getElementsByTagName("tr")[i];
            let cellValueForHomeTeam = trs.cells[1];
            let cellValueForAwayTeam = trs.cells[2];
            if (cellValueForHomeTeam.innerHTML.toLowerCase().indexOf(country) !== -1 ||
                cellValueForAwayTeam.innerHTML.toLowerCase().indexOf(country) !== -1) {
                trs.style.display = '';
            } else {
                trs.style.display = 'none';
            }
        }
    }

    let countryList = document.getElementById('country-list');
    countryList.style.display = 'inherit';
    countryList.style.width = searchByCountry.offsetWidth + 'px';

    if (searchByCountry.value.trim() !== '') {
        countryList.innerHTML = '';
        for (let i = 0; i < teams.length; i++) {
            if (teams[i].country.toLowerCase().indexOf(searchByCountry.value.toLowerCase().trim()) !== -1) {
                let option = document.createElement("option");
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
            filterListByCountry(countryList.options[countryList.selectedIndex].text);
            countryList.style.display = 'none';
        }, false);
    } else {
        countryList.innerHTML = '';
    }
    filterListByCountry(searchByCountry.value);
}
