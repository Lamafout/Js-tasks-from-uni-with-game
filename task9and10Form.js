//праивльная работа при клике на input  на send
let allInputs = document.querySelectorAll('.someInput')
allInputs.forEach(el =>{
    el.addEventListener('click', ()=>event.stopPropagation())
    el.addEventListener('keydown', ()=>{
        event.stopPropagation()
    })
})
document.querySelector('.form').addEventListener('keydown', (event)=>{
    if (event.code=='Space'){
        event.preventDefault()
    }
})
let textareaRecense = document.querySelector('.textareaRecense')
textareaRecense.addEventListener('click', ()=>event.stopPropagation())
let sendButton = document.querySelector('.formButton')
sendButton.addEventListener('click', ()=>{
    event.stopPropagation()
    allInputs.forEach(el=>{
        el.value = ''
    })
})

// создание переменных для каждого поля
let errorType = document.querySelector('.errorType')
let correctInput = new Array(allInputs.length+1)

// инициализация регулярок для каждого поля
let nameReg = /^[А-ЯЁ][а-яё]*$/
let facultyReg = /^[А-ЯЁ][а-яё]*$/
let departamentReg = /^[А-ЯЁ][А-ЯЁа-яё' ']*$/
let dateReg = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/
let emailReg = /^[\w\d]{2,}@([\w\d]{2,}\.){1,}[\w\d]{2,4}$/
let loginReg = /^[a-zA-Z0-9]{4,}$/
let passwordReg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!_?#$%]).{8,}$/;

// создадим регексы для проверки каждой отднльной части регекса пароля
let passwordRegHightLitera = /^(?=.*[A-Z]).*$/
let passwordRegSmallLitera = /^(?=.*[a-z]).*$/
let passwordRegNumber = /^(?=.*[0-9]).*$/
let passwordRegSpecialSymbol = /^(?=.*[!_?#$%]).*$/

// создание массива регексов для сравнения по индексам с эдементами массива вводов
let allRegs = [nameReg, nameReg, nameReg,
    dateReg, facultyReg, departamentReg, emailReg,
    loginReg, passwordReg, passwordReg]
    
// динамичная проверка корректности заполнения поля
allInputs.forEach((elem, index) => {
    let intervalId
    elem.addEventListener('focus', ()=>{
        intervalId = setInterval(()=>{
            if (allRegs[index].test(elem.value)){
                elem.style.backgroundColor = 'white'
                errorType.innerHTML=''
                correctInput[index]=true

                //проверка на то, что мы работаем с дубликатом пароля
                if (index==allInputs.length-1){
                    if (elem.value == allInputs[index-1].value){
                        correctInput[index+1]=true
                    }
                    else{
                        correctInput[index+1]=false
                    }
                }
            }
            else{
                correctInput[index]=false
                elem.style.backgroundColor = 'red'

                //проверка на то, что мы работаем с дубликатом пароля
                if (index==allInputs.length-1){
                    if (elem.value == allInputs[index-1].value){
                        correctInput[index+1]=true
                    }
                    else{
                        correctInput[index+1]=false
                    }
                }

                //Проверка на то, что мы работаем с первым полем ввода пароля
                if (index!=allInputs.length-1 && (allInputs.length==index+2)){
                    //теперь мы убедились, что у нас первая колонка ввода пароля
                    //нужно проверить, что именно не так сделал пользователь
                    if (!passwordRegHightLitera.test(elem.value)){
                        errorType.innerHTML ='Нужна хотя бы одна заглавная буква!'
                    }
                    else if (!passwordRegNumber.test(elem.value)){
                        errorType.innerHTML = 'Нужна хотя бы одна цифра!'
                    }
                    else if (!passwordRegSmallLitera.test(elem.value)){
                        errorType.innerHTML = 'Нужна хотя бы одна маленькая буква!'
                    }
                    else if (!passwordRegSpecialSymbol.test(elem.value)){
                        errorType.innerHTML = 'Нужен хотя бы один спец символ!'
                    } else errorType.innerHTML = 'Минимум 8 символов!'
                
                }
            }
        }, 500)
    })
    //удаляем интервал при переключении на другой элемент
    //для оптимизации кода
    elem.addEventListener('blur', ()=>{
        clearInterval(intervalId)
    })
})
setInterval(()=>{
    if (correctInput.filter(el=>el==true).length == allInputs.length+1){
        sendButton.disabled = false
    }
    else{
        sendButton.disabled = true
    }
}, 500)