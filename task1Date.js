function startTime() {
    let date = new Date();
    let year = date.getFullYear();
    let mounth = date.getMonth();
    let day = date.getDay();
    let dayDate = date.getDate();
    if (day == 0){
        day = 'Воскресенье'
    } else if (day == 1){
        day = 'Понедельник'
    } else if (day == 2){
        day = 'Вторник'
    } else if (day == 3){
        day = 'Среда'
    } else if (day == 4){
        day = 'Четверг'
    } else if (day == 5){
        day = 'Пятница'
    } else if (day == 6){
        day = 'Суббота'
    }
    
    if (mounth === 0) {
        mounth = 'Января';
    } else if (mounth === 1) {
        mounth = 'Февраля';
    } else if (mounth === 2) {
        mounth = 'Марта';
    } else if (mounth === 3) {
        mounth = 'Апреля';
    } else if (mounth === 4) {
        mounth = 'Мая';
    } else if (mounth === 5) {
        mounth = 'Июня';
    } else if (mounth === 6) {
        mounth = 'Июля';
    } else if (mounth === 7) {
        mounth = 'Августа';
    } else if (mounth === 8) {
        mounth = 'Сентября';
    } else if (mounth === 9) {
        mounth = 'Октября';
    } else if (mounth === 10) {
        mounth = 'Ноября';
    } else if (mounth === 11) {
        mounth = 'Декабря';
    }
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let tracker =''
    if (hours>=12){
        hours = hours % 12
        tracker = 'pm'
    } else tracker = 'am'
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    document.querySelector('.dateTimerResult').innerHTML = year + " год, " + dayDate + ' ' + mounth + ", " + day + ', ' + hours + '-' + minutes +'-' + seconds +'(' + tracker + ')'
    setTimeout(startTime, 1000);
}
startTime()