let buttons = document.querySelectorAll('.task');
let contents = document.querySelectorAll('.content');

buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
        let content = contents[index];
        if (content.style.maxHeight){
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
            //грязный код для 8 задания
            if (index == 7){
                console.log('успех')
                document.querySelector('.rickrollImage').style.transition = 'opacity 1s ease'
                document.querySelector('.rickrollImage').style.opacity = '1'
            }
        } 
    });
});