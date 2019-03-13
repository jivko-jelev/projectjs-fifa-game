sendingAjaxRequest('http://worldcup.sfg.io/teams/group_results', function (data) {
    var order = document.getElementById('order');

    function showTeam(index) {
        let column = 0;
        let row = table.insertRow(table.rows.length);
        let idCell = row.insertCell(column++);
        idCell.innerText = index + 1;
        row.insertCell(column++).innerHTML = `<p class="left">${teams[index].country}</p>`;
        row.insertCell(column++).innerHTML = teams[index].fifa_code;
        row.insertCell(column++).innerHTML = teams[index].group_letter;
        row.insertCell(column++).innerHTML = teams[index].wins;
        row.insertCell(column++).innerHTML = teams[index].draws;
        row.insertCell(column++).innerHTML = teams[index].losses;
        row.insertCell(column++).innerHTML = teams[index].games_played;
        row.insertCell(column++).innerHTML = teams[index].points;
        row.insertCell(column++).innerHTML = teams[index].goals_for;
        row.insertCell(column++).innerHTML = teams[index].goals_against;
        row.insertCell(column++).innerHTML = teams[index].goal_differential;
    }

    function showData() {
        table.innerHTML = '';
        for (let i = 0; i < teams.length; i++) {
            showTeam(i);
        }

        SaveDataToLocalStorage({
            'event': 'Statistics',
            'date': Date(),
            'data': {'Order By': order.options[order.selectedIndex].text}
        });

    }

    var teams = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].ordered_teams.length; j++) {
            teams.push(data[i].ordered_teams[j]);
        }
    }

    var table = document.getElementById('statistics').getElementsByTagName('tbody')[0];
    showData();

    function swap(i, j) {
        let temp = teams[i];
        teams[i] = teams[j];
        teams[j] = temp;
    }

    order.addEventListener('change', function (e) {
        for (let i = 0; i < teams.length - 1; i++) {
            for (let j = i + 1; j < teams.length; j++) {
                switch (order.value) {
                    case 'group-desc' :
                        if (teams[i].group_letter < teams[j].group_letter)
                            swap(i, j);
                        break;
                    case 'group-asc' :
                        if (teams[i].group_letter > teams[j].group_letter)
                            swap(i, j);
                        break;

                    case 'wins-desc' :
                        if (teams[i].wins < teams[j].wins)
                            swap(i, j);
                        break;
                    case 'wins-asc' :
                        if (teams[i].wins > teams[j].wins)
                            swap(i, j);
                        break;

                    case 'country-desc' :
                        if (teams[i].country < teams[j].country)
                            swap(i, j);
                        break;
                    case 'country-asc' :
                        if (teams[i].country > teams[j].country)
                            swap(i, j);
                        break;

                    case 'fifa-code-desc' :
                        if (teams[i].fifa_code < teams[j].fifa_code)
                            swap(i, j);
                        break;
                    case 'fifa-code-asc' :
                        if (teams[i].fifa_code > teams[j].fifa_code)
                            swap(i, j);
                        break;

                    case 'draws-desc' :
                        if (teams[i].draws < teams[j].draws)
                            swap(i, j);
                        break;
                    case 'draws-asc' :
                        if (teams[i].draws > teams[j].draws)
                            swap(i, j);
                        break;

                    case 'losses-desc' :
                        if (teams[i].losses < teams[j].losses)
                            swap(i, j);
                        break;
                    case 'losses-asc' :
                        if (teams[i].losses > teams[j].losses)
                            swap(i, j);
                        break;

                    case 'games-played-desc' :
                        if (teams[i].games_played < teams[j].games_played)
                            swap(i, j);
                        break;
                    case 'games-played-asc' :
                        if (teams[i].games_played > teams[j].games_played)
                            swap(i, j);
                        break;

                    case 'points-desc' :
                        if (teams[i].points < teams[j].points)
                            swap(i, j);
                        break;
                    case 'points-asc' :
                        if (teams[i].points > teams[j].points)
                            swap(i, j);
                        break;

                    case 'goals-for-desc' :
                        if (teams[i].goals_for < teams[j].goals_for)
                            swap(i, j);
                        break;
                    case 'goals-for-asc' :
                        if (teams[i].goals_for > teams[j].goals_for)
                            swap(i, j);
                        break;

                    case 'goals-against-desc' :
                        if (teams[i].goals_against < teams[j].goals_against)
                            swap(i, j);
                        break;
                    case 'goals-against-asc' :
                        if (teams[i].goals_against > teams[j].goals_against)
                            swap(i, j);
                        break;

                    case 'goal-differential-desc' :
                        if (teams[i].goal_differential < teams[j].goal_differential)
                            swap(i, j);
                        break;
                    case 'goal-differential-asc' :
                        if (teams[i].goal_differential > teams[j].goal_differential)
                            swap(i, j);
                        break;
                }
            }
        }
        showData();
    });
});
