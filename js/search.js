function addNewRowToTable(data, index, player, stadium) {
    let column = 0;
    var table = document.getElementById('statistics').getElementsByTagName('tbody')[0];
    var row = table.insertRow(table.rows.length);
    row.insertCell(column++).innerText = table.rows.length;
    row.insertCell(column++).innerHTML = data[index].home_team_country;
    row.insertCell(column++).innerHTML = data[index].away_team_country;

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

    row.insertCell(column++).innerHTML = highlightText(player.name, searchPlayer);
    row.insertCell(column++).innerHTML = player.shirt_number;
    row.insertCell(column++).innerHTML = highlightText(data[index].location, stadium);
}

function start() {
    sendingAjaxRequest('http://worldcup.sfg.io/teams', function (data) {
        let country = document.getElementById('country-name1').value.trim();
        let player = document.getElementById('player').value.trim();
        let stadium = document.getElementById('stadium').value.trim();
        if (country !== '') {
            SaveDataToLocalStorage({
                'event': 'Search',
                'date': Date(),
                'data': {'Country': country, 'Player': player, 'Stadium': stadium}
            });

            let fifaCode;
            for (var i = 0; i < data.length; i++) {
                if (data[i].country.toLowerCase() === country.toLowerCase()) {
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
                    if (table.rows.length ==0){
                        showMessageWithFadeEffect('No matches were found based on this criteria!');
                    }
                });
            } else {
                showMessageWithFadeEffect('Invalid Name of Country!');
            }
        }else{
            showMessageWithFadeEffect('You must enter name of country!');
        }
    });
}

function showMessageWithFadeEffect(message){
    var fadeTarget = document.getElementById("message-invalid-country");
    fadeTarget.innerText = message;
    fadeTarget.style.display = 'inherit';
    fadeTarget.style.opacity = 1;
    var fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.005;
        } else {
            clearInterval(fadeEffect);
        }
    }, 50);}

document.getElementById('search').addEventListener('click', function () {
    start();
})

var searchByCountry = document.getElementById('country-name1');
var country = document.getElementById('country-list1');
var player = document.getElementById('player');
var stadium = document.getElementById('stadium');

document.getElementById('clear-country').addEventListener('click', function () {
    searchByCountry.focus();
    searchByCountry.value = '';
});

document.getElementById('clear-player').addEventListener('click', function () {
    player.value = '';
    player.focus();
});

document.getElementById('clear-stadium').addEventListener('click', function () {
    stadium.value = '';
    stadium.focus();
});

searchByCountry.addEventListener('keyup', function (e) {
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


var teams;

function showListWithCountries() {
    if (teams !== undefined) {
        country.innerHTML = '';
        for (let i = 0; i < teams.length; i++) {
            if (teams[i].country.toLowerCase().indexOf(searchByCountry.value.toLowerCase().trim()) !== -1) {
                let option = document.createElement("option");
                option.text = teams[i].country;
                option.value = teams[i].fifa_code;
                country.add(option);
            }
        }
        country.style.display = 'inherit';
    }
}

searchByCountry.addEventListener('focus', function () {
    showListWithCountries();
});

searchByCountry.addEventListener('blur', function (e) {
    if (e.relatedTarget === null || e.relatedTarget.id !== 'country-list1') {
        country.style.display = 'none';
    }
});

country.addEventListener('blur', function (e) {
    if (e.relatedTarget === null || e.relatedTarget.id !== 'country-list1') {
        country.style.display = 'none';
    }
});

searchByCountry.addEventListener('keyup', function (e) {
    if (e.key === 'Escape') {
        country.style.display = "none";
    } else {
        showListWithCountries();
    }
});

country.addEventListener('change', function (e) {
    function getSelectedText() {
        if (country.selectedIndex == -1)
            return null;
        return country.options[country.selectedIndex].text;
    }

    searchByCountry.value = getSelectedText();
    country.style.display = 'none';
    player.focus();
}, false);

player.addEventListener('focus', function () {
    player.selectionStart = player.selectionEnd = player.value.length;
});

if (teams === undefined) {
    sendingAjaxRequest('http://worldcup.sfg.io/teams', function (data) {
        teams = data;
    });
}