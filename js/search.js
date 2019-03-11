function addNewRowToTable(data, index, player, stadium) {
    let column = 0;
    var table = document.getElementById('statistics').getElementsByTagName('tbody')[0];
    var row = table.insertRow(table.rows.length);
    var idCell = row.insertCell(column++);
    idCell.innerText = table.rows.length;

    var homeTeamCell = row.insertCell(column++);
    homeTeamCell.innerHTML = data[index].home_team_country;

    var awayTeamCell = row.insertCell(column++);
    awayTeamCell.innerHTML = data[index].away_team_country;

    function highlightText(source, textToReplace) {
        let startPos = source.toLowerCase().indexOf(textToReplace);
        let strForReplace = source.substr(startPos, textToReplace.length);
        return source.replace(strForReplace, '<span style="background: #94f494; border-radius: 5px;">' + strForReplace + '</span>');
    }

    player.name = toTitleCase(player.name);
    var searchPlayer = document.getElementById('player').value.trim().toLowerCase();

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    var playerCell = row.insertCell(column++);
    playerCell.innerHTML = highlightText(player.name, searchPlayer);

    var playerNumberCell = row.insertCell(column++);
    playerNumberCell.innerHTML = player.shirt_number;

    var stadiumCell = row.insertCell(column++);
    stadiumCell.innerHTML = highlightText(data[index].location, stadium);
}


function start() {
    sendingAjaxRequest('http://worldcup.sfg.io/teams', function (data) {
        let country = document.getElementById('country').value.trim();
        let player = document.getElementById('player').value.trim();
        let stadium = document.getElementById('stadium').value.trim();
        // SaveDataToLocalStorage(['search', Date(), country, player, stadium]);
        SaveDataToLocalStorage({'event' : 'search', 'date': Date(), 'country': country, 'player': player, 'stadium': stadium});
        if (country !== '') {
            let fifaCode;
            for (var i = 0; i < data.length; i++) {
                if (data[i].country.toLowerCase().indexOf(country.toLowerCase()) !== -1) {
                    fifaCode = data[i].fifa_code;
                    break;
                }
            }
            if (fifaCode !== undefined) {
                sendingAjaxRequest('http://worldcup.sfg.io/matches/country?fifa_code=' + fifaCode, function (data) {
                    var table = document.getElementById('statistics').getElementsByTagName('tbody')[0];
                    table.innerHTML = '';
                    for (var i = 0; i < data.length; i++) {
                        var team = data[i].away_team.code === fifaCode
                            ? data[i].away_team_statistics.starting_eleven
                            : data[i].home_team_statistics.starting_eleven;
                        for (let j = 0; j < team.length; j++) {
                            if (team[j].name.toLowerCase().indexOf(player.toLowerCase()) !== -1 &&
                                (data[i].location.toLowerCase().indexOf(stadium.toLowerCase()) !== -1)) {
                                addNewRowToTable(data, i, team[j], stadium);
                            }
                        }
                    }
                });
            } else {
                alert('Invalid name of country!');
            }
        }
    });
}

document.getElementById('search').addEventListener('click', function () {
    start();
})

var country = document.getElementById('country');
var player = document.getElementById('player');
var stadium = document.getElementById('stadium');

document.getElementById('clear-country').addEventListener('click', function () {
    country.value = '';
});

document.getElementById('clear-player').addEventListener('click', function () {
    player.value = '';
});

document.getElementById('clear-stadium').addEventListener('click', function () {
    stadium.value = '';
});

country.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
        start();
    }
});

player.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
        start();
    }
});

stadium.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
        start();
    }
});
