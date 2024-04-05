let lengthOfRoad = 0
let blockResult = document.querySelector('.blockWithEvent')
blockResult.addEventListener('mouseenter', ()=>{
    let currentMargin = parseInt(window.getComputedStyle(blockResult).marginLeft)
    blockResult.style.marginLeft = (currentMargin - 20) + 'px'
    lengthOfRoad+=20
})
blockResult.addEventListener('mouseleave', () =>{
    let currentMargin = parseInt(window.getComputedStyle(blockResult).marginLeft)
    blockResult.style.marginLeft = (currentMargin + lengthOfRoad) + 'px'
    lengthOfRoad = 0
})