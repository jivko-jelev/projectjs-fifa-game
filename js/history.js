function SaveDataToLocalStorage(data)
{
    var a = [];
    if(localStorage.getItem('session')!==null) {
        a = JSON.parse(localStorage.getItem('session'));
    }
    a.push(data);
    localStorage.setItem('session', JSON.stringify(a));
    console.log(JSON.parse(localStorage.getItem('session')));
}

