class Monster{
    constructor(typeName){
        this.div
        this.divName = typeName
        console.log(this.divName)
        this.positionX = 0
        this.positionY = 0
        this.health = 10
        this.lookSide
    }

    draw(){
        this.div = document.createElement('div')
        document.querySelector('.gameMap').appendChild(this.div)
        this.div.className = this.divName
        this.div.style.left = this.positionX + 'px'
        this.div.style.top = this.positionY + 'px'
        this.div.style.transform = 'rotate(' + this.lookSide + 'deg' + ')'
    }

    doBorn(posX, posY) {
        this.positionX = posX
        this.positionY = posY
    }

    doDie() {
        let index = allMonsters.indexOf(this)
        if (index > -1) {
            allMonsters.splice(index, 1)
        }
        this.div.remove()
    }
    

    getDamage(damage){
        this.div.style.backgroundColor = 'red'
        this.health -= damage
        if (this.health <= 0){
            this.doDie()
        }
    }

    move(chX, chY) {
        if (this.positionX + chX > 0 && this.positionX + chX < (750-this.div.offsetWidth) && this.positionY + chY > 0 && this.positionY + chY < (750-this.div.offsetWidth)) {
            this.positionX += chX
            this.positionY += chY
        }
    }

}

class Human extends Monster{

    shoot(cursorX, cursorY){
        let bullet = new Bullet(this.positionX, this.positionY, this.lookSide, cursorX, cursorY)
        bullet.draw()
    }
}

class Bullet{
    constructor(posX, posY, lkside, cursX, cursY){
        this.div
        this.positionX = posX + 20
        this.positionY = posY + 20
        this.lookSide = lkside + Math.floor(Math.random() * 21) - 10
        this.cursorXWhenShoot = cursX
        this.cursorYWhenShoot = cursY
        this.damage = 5
        allBullets.push(this)

        //воспроизведение звука выстрела
        let sound = new Audio('./audio/pistolShoot.mp3')
        sound.play()
    }
    draw(){
        this.div = document.createElement( 'div')
        document.querySelector('.gameMap').appendChild(this.div)
        this.div.className = 'gameBullet'
        this.div.style.left = this.positionX + 'px'
        this.div.style.top = this.positionY + 'px'
        this.div.style.transform = 'rotate(' + this.lookSide + 'deg' + ')'
    }
    fly(){
        // если пуля вылетела за пределы карты
        if (this.positionX <= 0 || this.positionX >= 750 || this.positionY <= 0 || this.positionY >= 750){
            document.querySelector('.'+this.div.className).remove()
            let index = allBullets.indexOf(this);
            if (index > -1) {
                allBullets.splice(index, 1);
            }
        }
        // если пуля в пределах карты
        else{
            // перемещение пули под тем же углом, под которым был персонаж в момент выстрела
            autoMove(this, 20)
        }
    }
}
let allMonsters = []
let allBullets = []

// обработчик play menu
let playButton = document.querySelector('.playButton')
let playMenu = document.querySelector('.playMenu')
playButton.addEventListener('click', (event)=>{
    event.stopPropagation()
    gameStart()
})

// отключение функционала клавиш для страницы при игре
document.querySelector('.game').addEventListener('keydown', (event)=>{
    event.preventDefault()
})

// game start
function gameStart(){
    //удаление игрового меню
    playMenu.remove()
    playButton.remove()

    //создание карты и главного персонажа на ней
    let gameContent = document.querySelector('.game')
    let gameMap = document.createElement('div')
    gameMap.className = 'gameMap'
    gameContent.appendChild(gameMap)
    let gamer = new Human('gameCharacter')
    gamer.doBorn(350, 350)
    gamer.draw()

    //обработка кликов по игрвому полю
    gameContent.addEventListener('click', (event)=>{
        event.stopPropagation()
    })

    //отслеживание положения курсора мыши
    let cursorX, cursorY
    gameContent.addEventListener('mousemove', (event)=>{
        cursorX = event.offsetX
        cursorY = event.offsetY
    })

    //обработка выстрела по левому клику мыши
    gameMap.addEventListener('mousedown', (event)=>{
        if (event.button == 0){
            gamer.shoot(cursorX, cursorY)
        }
    })

    //обработка ходьбы персонажа на wasd с возможностью остановить ходьбу, отпустив клавишу
    let isWalkingUp = false
    let isWalkingLeft = false
    let isWalkingDown = false
    let isWalkingRight = false

    window.addEventListener('keydown', (event) => {
        if (event.code === 'KeyW' || event.code === 'ArrowUp') {
            isWalkingUp = true
        }
        if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
            isWalkingLeft = true
        }
        if (event.code === 'KeyS' || event.code === 'ArrowDown') {
            isWalkingDown = true
        }
        if (event.code === 'KeyD' || event.code === 'ArrowRight') {
            isWalkingRight = true
        }
    })

    window.addEventListener('keyup', (event) => {
        if (event.code === 'KeyW' || event.code === 'ArrowUp') {
            isWalkingUp = false
        }
        if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
            isWalkingLeft = false
        }
        if (event.code === 'KeyS' || event.code === 'ArrowDown') {
            isWalkingDown = false
        }
        if (event.code === 'KeyD' || event.code === 'ArrowRight') {
            isWalkingRight = false
        }
    })

    // В основном цикле игры
    

    //глобальный таймер
    let fiveSeconds = 0
    function perTime(){
        // поворот персонажа
        turnCharacter(gamer, cursorX, cursorY)

        // полёт пуль
        allBullets.forEach((bullet)=>{
            bullet.fly()
        })

        // ходьба в стороны, которые были выбраны игроком
        if (isWalkingUp) {
            gamer.move(0, -8)
        }
        if (isWalkingLeft) {
            gamer.move(-8, 0)
        }
        if (isWalkingDown) {
            gamer.move(0, 8)
        }
        if (isWalkingRight) {
            gamer.move(8, 0)
        }

        // отсчёт 5 секунд
        fiveSeconds += 10

        // рождение монстра
        if (fiveSeconds == 1000){
            fiveSeconds = 0
            let monster = new Monster('monster')
            monster.doBorn(Math.random() * 750, Math.random() * 750)
            allMonsters.push(monster)
            monster.draw()
        }

        // отрисовка всех моснтров из массива
        allMonsters.forEach((monster)=>{
            if (monster.health < 0){
                monster.doDie()
            }
            // реализация поворота монстра в сторону игрока
            turnCharacter(monster, gamer.positionX, gamer.positionY)

            // постепенное движение монстра к игроку
            if (Math.abs(gamer.positionX - monster.positionX) > 70 || Math.abs(gamer.positionY - monster.positionY) > 70){
                autoMove(monster, 5)
            }
        })

        // достигание пуль монстров 
        allMonsters.forEach((monster) =>{
            allBullets.forEach((bullet, index) =>{
                if (Math.abs(bullet.positionX - monster.positionX) < monster.div.offsetWidth && Math.abs(bullet.positionY - monster.positionY) < monster.div.offsetHeight){
                    monster.getDamage(bullet.damage)
                    bullet.div.remove()
                    allBullets.splice(index, 1)
                    return
                }
            })
        })

        setTimeout(perTime, 15)
    }
    perTime()
}

function turnCharacter(character, cursorX, cursorY){
    let angle = Math.atan2(cursorY - character.positionY, cursorX - character.positionX)
    character.lookSide = angle * (180 / Math.PI)
    character.draw()
    document.querySelector('.'+character.div.className).remove()
}

function autoMove(character, speed){
    let angle = parseFloat(character.lookSide)
    character.positionX += speed * Math.cos(angle * Math.PI / 180)
    character.positionY += speed * Math.sin(angle * Math.PI / 180)
    character.div.style.left = character.positionX + 'px'
    character.div.style.top = character.positionY + 'px'
    character.div.style.left += character.positionX + 'px'
    character.div.style.top += character.positionY + 'px'
}
