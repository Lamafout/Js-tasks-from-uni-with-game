let months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь"
  ];
let currentDate = new Date()
let currentMonth = currentDate.getMonth() + 1
let currentYear = currentDate.getFullYear()

function makeCell(ind){
    let div = document.createElement("div")
    div.style.borderRadius = '10px'
    div.style.backgroundColor = 'white'
    div.style.gridColumn = ind.toString() + '/' + (ind+1).toString()
    div.style.textAlign = 'center'
    div.style.paddingTop = '15px'
    div.style.color = 'rgb(79, 122, 187)'
    div.style.fontSize = '3vw'
    return div
}

function drawCalendar(){
    document.querySelector('.monthName').innerHTML = months[currentMonth-1]
    document.querySelector('.yearNumber').innerHTML = currentYear
    let currentFirstDay = new Date(`${currentYear}-${currentMonth}-01`).getDay()
    let daysInCurrentMonth = new Date(currentYear, currentMonth, 0).getDate()
    
    if (currentFirstDay==0) currentFirstDay = 7

    for (i=currentFirstDay; i<=42; i++){
        if (i-currentFirstDay==daysInCurrentMonth) break
        if (i % 7 == 0) document.querySelector('.calendarResult').appendChild(makeCell(7))
        else document.querySelector('.calendarResult').appendChild(makeCell(i % 7))
    }

    let cellArr = Array.from(document.querySelector('.calendarResult')
    .getElementsByTagName('div'))
    .forEach((el, ind) => {
        el.innerText = ind+1
        if ((ind+currentFirstDay) % 7 == 0 || (ind+currentFirstDay) % 7 == 6){
            el.style.backgroundColor = 'rgb(220, 107, 201)'
            el.style.color = 'white'
        }
        if (ind+1==currentDate.getDate() && currentMonth == currentDate.getMonth()+1 && currentYear==currentDate.getFullYear()){
            el.style.backgroundColor = 'rgb(79, 122, 187)'
            el.style.color = 'white'
        }
    })
}

function clearCalendar(){
    document.querySelector('.calendar').querySelectorAll('div:not([class])')
    .forEach(el =>{
        el.remove()
    })
}

drawCalendar()

document.querySelector('.leftArrow')
.addEventListener('click', ()=>{
    event.stopPropagation()
    if (currentMonth == 1){
        currentYear--
        currentMonth = 13
    }
    currentMonth--
    clearCalendar()
    drawCalendar()
})

document.querySelector('.rightArrow')
.addEventListener('click', ()=>{
    event.stopPropagation()
    if (currentMonth == 12){
        currentYear++
        currentMonth = 0
    }
    currentMonth++
    clearCalendar()
    drawCalendar()
})
