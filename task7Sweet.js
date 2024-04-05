let arrowButton = document.querySelector('.sweetHeaderButton')
let sweetContent = document.querySelector('.sweetContent')

// 1. Обработка нажатия на кнопку развёртывания списка
let currentContent = document.querySelector('.sweet')
arrowButton.addEventListener('click', () => {
    event.stopPropagation()
    if (sweetContent.style.maxHeight){
        sweetContent.style.maxHeight = null
        arrowButton.setAttribute('src', './images/downArrow.png')

    } else {
        sweetContent.style.maxHeight = sweetContent.scrollHeight + "px"
        // перерасчитываем размер блока content сразу, а не при следующем его раскрытии 
        currentContent.style.maxHeight = currentContent.scrollHeight + sweetContent.scrollHeight + "px"
        arrowButton.setAttribute('src', './images/upArrow.png')
    } 
})

// 2. Создание массива элементов списка и их отрисовка
let sweetListContainer = document.querySelector('.sweetList')
function createSweet(sweetName){
    let li = document.createElement('li')
    li.innerHTML = sweetName
    li.style.textAlign = 'start'
    li.className = 'someSweet'
    sweetListContainer.appendChild(li)
    return li
}
let sweetList = [createSweet('Пончик'), createSweet('Тортик'), createSweet('Зефирчик'), createSweet('Рахат-лукум')]

// 3. Удаление элементов списка
sweetList.forEach((el, index) => {
    el.addEventListener('click', () => {
      event.stopPropagation()
      el.style.transition = 'opacity 0.5s ease'
      el.style.opacity = '0'
      setTimeout(() => {
        el.remove()
        sweetList.pop(index)
        //появление надписи сладости закончились
        if (sweetList.length == 0){
          let sweetsOverLabel = document.createElement('p')
          sweetsOverLabel.innerHTML = 'Сладости закончились!'
          sweetsOverLabel.style.textAlign = 'start'
          sweetListContainer.appendChild(sweetsOverLabel)
        }
      }, 500)
    })
})
  