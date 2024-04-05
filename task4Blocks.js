const listBlock = Array.from(document.getElementsByClassName('block'))
let blocks = document.querySelector('.blocks')

function doMagic(ind) {
    let block = listBlock[ind];
    let currentRotation = block.style.transform.replace(/[^0-9.-]/g, '')
    let newRotation = Number(currentRotation) + 90
    block.style.transform = `rotate(${newRotation}deg)`
    block.style.height = block.offsetHeight * 1.5 + 'px';
    block.style.width = block.offsetWidth * 1.5 + 'px';
}

listBlock.forEach((el, ind) => {
    el.addEventListener('click', () => {
        event.stopPropagation()
        function startTime(){
            doMagic(ind);
            blocks.style.maxHeight = blocks.scrollHeight + el.offsetHeight + "px"
            setTimeout(startTime, 50)
        }
        startTime()
    })
})