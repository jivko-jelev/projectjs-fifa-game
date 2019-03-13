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
            'event': 'View Team Statistics',
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
        let orderValue = order.value.split('-');
        for (let i = 0; i < teams.length - 1; i++) {
            for (let j = i + 1; j < teams.length; j++) {
                if (orderValue[1]=='desc' && teams[i][orderValue[0]] < teams[j][orderValue[0]]){
                    swap(i, j);
                }else if(orderValue[1]=='asc' && teams[i][orderValue[0]] > teams[j][orderValue[0]]) {
                    swap(i, j);
                }
            }
        }
        showData();
    });
});