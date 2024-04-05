let rickrollImage = document.querySelector('.rickrollImage')
let transperentContent = document.querySelector('.transperent')
transperentContent.addEventListener('click', ()=>{
    if (!transperentContent.style.maxHeight){
        rickrollImage.style.transition = 'opacity 1s ease'
        rickrollImage.style.opacity = '1'
    }
}, {capture: true})
rickrollImage.addEventListener('mouseenter', ()=>{
    rickrollImage.style.transition = 'opacity 1s ease'
    rickrollImage.style.opacity = '0'
})
rickrollImage.addEventListener('mouseleave', ()=>{
    rickrollImage.style.transition = 'opacity 1s ease'
    rickrollImage.style.opacity = '1'
})