let container = document.querySelector('.elemsResultContainer')
let input = document.querySelectorAll('input[type="radio"]')
let elems = Array.from(document.querySelectorAll('.elemFromContainer'))
let elemsContent = document.querySelector('.elems')

function createBlock(){
    let div = document.createElement('div')
    div.style.border = '2px solid white'
    div.style.height = '100px'
    div.style.width = '100px'
    div.style.borderRadius = '10px'
    div.style.fontSize = '8px'
    return div
}

input.forEach((elem, index) => {
    elem.addEventListener('click', ()=>{
        event.stopPropagation()
        let newBlock
        if (index == 0){
            let textPrompt = prompt('Введите текст, который будет внутри нового блока:')
            while(textPrompt!=null){
                if (textPrompt){
                    newBlock = createBlock()
                    container.appendChild(newBlock)
                    newBlock.innerText = textPrompt
                    newBlock.className = 'elemFromContainer'
                    elems.push(newBlock)
                    alert('Блок создан!')
                    textPrompt = prompt('Введите текст, который будет внутри нового блока:')
                }
                else{
                    alert("Текст - это когда в поле для заполнения есть хоть что-нибудь")
                }           
            }
        }
        if (index == 1){
            newBlock = createBlock()
            container.appendChild(newBlock)
            let newImg = document.createElement('img')
            newImg.style.width = '100%'
            newImg.style.borderRadius = '10px'
            newImg.src = './images/picsForElemsTask/image'+ (Math.floor(Math.random() * (1 - 0 + 1)) + 0) + '.png'
            newBlock.appendChild(newImg)
            newBlock.className = 'elemFromContainer'
            elems.push(newBlock)
            alert('Блок создан!')
        }
        elemsContent.style.maxHeight = elemsContent.scrollHeight + 'px'
        elems
        .forEach(el => {
            el.addEventListener('click', () =>{
                event.stopPropagation()
                el.remove()
            })
        })
    })
})
