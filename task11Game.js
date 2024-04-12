class Monster{
    //TODO сделать возможность спавна стрелка
    constructor(typeName){
        this.div
        this.divName = typeName
        console.log(this.divName)
        this.positionX = 0
        this.positionY = 0
        this.health = 10
        this.lookSide
        this.damage = 10
        this.imagePath
    }

    draw(){
        this.div = document.createElement('div')
        document.querySelector('.gameMap').appendChild(this.div)
        this.div.className = this.divName
        this.div.style.left = this.positionX + 'px'
        this.div.style.top = this.positionY + 'px'
        this.div.style.transform = 'rotate(' + this.lookSide + 'deg' + ')'
        this.drawSkin()
    }

    drawSkin(){
        let image = document.createElement('img')
        this.div.appendChild(image)
        image.setAttribute('src', this.imagePath)
        image.style.width = '70px'
        image.style.height = '63px'
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
        score += 250
    }
    

    getDamage(damage){
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

    drawSkin(){
        let image = document.createElement('img')
        this.div.appendChild(image)
        image.setAttribute('src', this.imagePath)
        image.style.width = '76px'
        image.style.height = '36px'
    }

    doDie(){
        super.doDie()
        score -= 750
        gameOver()
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

class Wall{
    constructor(){
        this.div
        this.positionX
        this.positionY
    }

    doBorn(posX, posY, width, height){
        this.positionX = posX
        this.positionY = posY
        this.div = document.createElement( 'div')
        this.div.style.left = this.positionX + 'px'
        this.div.style.top = this.positionY + 'px'
        this.div.style.width = width + 'px'
        this.div.style.height = height + 'px'
        document.querySelector('.gameMap').appendChild(this.div)
        this.div.className = 'gameWall'
        allWalls.push(this)
    }
}
let allMonsters = []
let allBullets = []
let allWalls = []

let score, timeBonus

let timeoutId

// обработчик play menu
let gameContent = document.querySelector('.game')
let playButton = document.querySelector('.playButton')
let playMenu = document.querySelector('.playMenu')
let playScore = document.querySelector('.playScore')
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
    playScore.remove()

    // создание переменнлй для подсчёта очков
    score = 0
    timeBonus = 1000
    let animationInterval
    
    //создание карты
    let gameMap = document.createElement('div')
    gameMap.className = 'gameMap'
    gameContent.appendChild(gameMap)
    
    // создание главного персонажа
    let gamer = new Human('gameCharacter')
    gamer.doBorn(350, 350)
    gamer.draw()
    let gamerImage = 1

    //скорость мностров  игрока
    let speedMonster = 4
    let speedGamer = 5
    
    // появление препятствий
    let wall1 = new Wall()
    wall1.doBorn(100, 100, 50, 300)
    let wall2 = new Wall()
    wall2.doBorn(550, 300, 50, 300)

    //обработка кликов по игрвому полю
    gameContent.addEventListener('click', (event)=>{
        event.stopPropagation()
    })

    //отслеживание положения курсора мыши
    let cursorX, cursorY
    gameMap.addEventListener('mousemove', (event)=>{
        const rect = gameMap.getBoundingClientRect()
        cursorX = event.clientX - rect.left
        cursorY = event.clientY - rect.top
    })
    

    //обработка выстрела по левому клику мыши
    gameMap.addEventListener('mousedown', (event)=>{
        if (event.button == 0){
            gamer.shoot(cursorX, cursorY)
            gamerImage = 3
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
    let spawnTimer = 0, scoreTimer = 0, animationTimer = 0
    function perTime(){
        //подсчёт очков времени
        scoreTimer += 15
        if (scoreTimer == 3000){
            timeBonus *= 0.9
            scoreTimer = 0
        }

        // поворот и отрисовка персонажа
        if (gamerImage == 1){
            gamer.imagePath = './images/policeStand1.png'
        }
        else if (gamerImage == 2){
            gamer.imagePath = './images/policeStand2.png'
        }
        else if (gamerImage == 3){
            gamer.imagePath = './images/policeShoot.png'
        
        }
        turnCharacter(gamer, cursorX, cursorY)

        // полёт пуль
        allBullets.forEach((bullet)=>{
            bullet.fly()
        })

        // анимация движения персонажа
        if (gamerImage == 3){
            setTimeout(()=>{
                gamerImage = 1
                clearTimeout(this)
            }, 100)
        }
        if (isWalkingDown || isWalkingRight || isWalkingLeft || isWalkingUp) {
            animationTimer += 15
            if (gamerImage == 1 && animationTimer >= 150){
                gamerImage = 2
                animationTimer = 0
            }
            else if (gamerImage == 2 && animationTimer >= 150){
                gamerImage = 1
                animationTimer = 0
            }
        }

        // ХОДЬБА в стороны, которые были выбраны игроком
        if (isWalkingUp) {
            //проверка, не стоит ли на пути препятствие
            let moveFlag = 0
            allWalls.forEach((wall, index)=>{
                if ((((gamer.positionX + gamer.div.offsetWidth) <= (wall.positionX)) || ((gamer.positionX) >= (wall.positionX + wall.div.offsetWidth)))
                || ((gamer.positionY - speedGamer) >= (wall.positionY + wall.div.offsetHeight))
                || ((gamer.positionY) < (wall.positionY))) {
                    moveFlag++
                }
            })
            if (moveFlag == allWalls.length) {
                gamer.move(0, -speedGamer)           
            }
        }
        if (isWalkingLeft) {
            //проверка, не стоит ли на пути препятствие
            let moveFlag = 0
            allWalls.forEach((wall)=>{
                if ((((gamer.positionY + gamer.div.offsetHeight) <= (wall.positionY)) || ((gamer.positionY) >= (wall.positionY + wall.div.offsetHeight)))
                || ((gamer.positionX - speedGamer) >= (wall.positionX + wall.div.offsetWidth))
                || ((gamer.positionX) < (wall.positionX))) {
                    moveFlag ++
                }
            })
            if (moveFlag == allWalls.length) {         
                gamer.move(-speedGamer, 0)
            }
        }
        if (isWalkingDown) {
            //проверка, не стоит ли на пути препятствие
            let moveFlag = 0
            allWalls.forEach((wall)=>{
                if ((((gamer.positionX + gamer.div.offsetWidth) <= (wall.positionX)) || ((gamer.positionX) >= (wall.positionX + wall.div.offsetWidth)))
                || ((gamer.positionY + gamer.div.offsetHeight + speedGamer) <= (wall.positionY))
                || ((gamer.positionY) > (wall.positionY))) {
                    moveFlag ++
                }
            })
            if (moveFlag == allWalls.length) {           
                gamer.move(0, speedGamer)
            }
        }
        if (isWalkingRight) {
            //проверка, не стоит ли на пути препятствие
            let moveFlag = 0
            allWalls.forEach((wall)=>{
                if ((((gamer.positionY + gamer.div.offsetHeight) <= (wall.positionY)) || ((gamer.positionY) >= (wall.positionY + wall.div.offsetHeight)))
                        || ((gamer.positionX + gamer.div.offsetWidth + speedGamer) <= (wall.positionX))
                        || ((gamer.positionX) > (wall.positionX))) {
                    moveFlag ++
                }
            })
            if (moveFlag == allWalls.length) {         
                gamer.move(speedGamer, 0)
            }
        }

        // отсчёт таймера для рождения монстра
        spawnTimer += 10

        // рождение монстра
        if (spawnTimer == 1000){
            spawnTimer= 0
            let monster = new Monster('monster')

            // проверка, что монстр не спавнится слишком близко к главному герою или в стене
            let spawnFlag = false
            let spawnX, spawnY
            while (!spawnFlag){
                spawnX = Math.random() * 750, spawnY = Math.random() * 750
                spawnFlag = true
                allWalls.forEach(wall =>{
                    if ((spawnX > wall.positionX) && (spawnX < wall.positionX + wall.div.offsetWidth)
                    && (spawnY > wall.positionY) && (spawnY < wall.positionY + wall.div.offsetHeight)) {
                        spawnFlag = false
                        console.log('spawn')
                        return
                    }
                })
                if (!(Math.abs(spawnX - gamer.positionX) > gamer.div.offsetWidth + 150
                || Math.abs(spawnY - gamer.positionY) > gamer.div.offsetHeight + 150)){
                    spawnFlag = false
                }
            }
            monster.doBorn(spawnX, spawnY)
            allMonsters.push(monster)
            monster.imagePath = './images/monster.png'
            monster.draw()
        }

        // отрисовка всех моснтров из массива (тут много кода)
        allMonsters.forEach((monster)=>{
            if (monster.health < 0){
                monster.doDie()
            }

            // реализация поворота монстра в сторону игрока
            turnCharacter(monster, gamer.positionX, gamer.positionY)

            // постепенное движение монстра к игроку
            if ((Math.abs(gamer.positionX - monster.positionX) > gamer.div.offsetWidth + 20 
            || Math.abs(gamer.positionY - monster.positionY) > gamer.div.offsetHeight + 20)){
                let moveFlag = {
                    down: new Array(allWalls.length).fill(0),
                    left: new Array(allWalls.length).fill(0),
                    up: new Array(allWalls.length).fill(0),
                    right: new Array(allWalls.length).fill(0),
                    sum: function(){
                        return this.down.filter(el => el == 1).length + this.left.filter(el => el == 1).length + this.up.filter(el => el == 1).length + this.right.filter(el => el == 1).length
                    }
                }

                allWalls.forEach((wall, index) =>{
                    let downMove = false, leftMove = false, upMove = false, rightMove = false

                    // движение вниз
                    if ((((monster.positionX + monster.div.offsetWidth) <= (wall.positionX)) || ((monster.positionX) >= (wall.positionX + wall.div.offsetWidth)))
                        || ((monster.positionY + monster.div.offsetHeight + speedMonster * Math.sin(monster.lookSide * Math.PI / 180)) <= (wall.positionY))
                        || ((monster.positionY) > (wall.positionY))){
                            downMove = true
                    }

                    // движение влево
                    if ((((monster.positionY + monster.div.offsetHeight) <= (wall.positionY)) || ((monster.positionY) >= (wall.positionY + wall.div.offsetHeight)))
                        || ((monster.positionX + speedMonster * Math.cos(monster.lookSide * Math.PI / 180)) >= (wall.positionX + wall.div.offsetWidth))
                        || ((monster.positionX) < (wall.positionX))){
                            leftMove = true
                    }

                    // движение вверх
                    if ((((monster.positionX + monster.div.offsetWidth) <= (wall.positionX)) || ((monster.positionX) >= (wall.positionX + wall.div.offsetWidth)))
                        || ((monster.positionY + speedMonster * Math.sin(monster.lookSide * Math.PI / 180)) >= (wall.positionY + wall.div.offsetHeight))
                        || ((monster.positionY) < (wall.positionY))){
                            upMove = true
                    }

                    // движение вправо
                    if ((((monster.positionY + monster.div.offsetHeight) <= (wall.positionY)) || ((monster.positionY) >= (wall.positionY + wall.div.offsetHeight)))
                        || ((monster.positionX + monster.div.offsetWidth + speedMonster * Math.cos(monster.lookSide * Math.PI / 180)) <= (wall.positionX))
                        || ((monster.positionX) > (wall.positionX))){
                            rightMove = true
                    }

                    // инкрементируем соответствующие поля флага
                    // затем будем, опираясь на значения этих полей, выяснять, куда именно не может пойти монстр
                    if (downMove){
                        moveFlag.down[index]++
                    }
                    if (leftMove){
                        moveFlag.left[index]++
                    }
                    if (upMove){
                        moveFlag.up[index]++
                    }
                    if (rightMove){
                        moveFlag.right[index]++
                    }
                })
                // сумма moveFlag - это сумма количества обходимых препятствий для каждой стороны 
                if (moveFlag.sum() == allWalls.length * 4){
                    autoMove(monster, speedMonster)
                }
                else{
                    // проверка, в какую сторону обходить, используя положение монстра относительно середины препятствия (бета)
                    // TODO придумать решение получше
                    // TODO исравить, что он не двигается в углах
                    // сначала проверим, что идти нельзя вниз
                    if (moveFlag.down.filter(el => el == 1).length < allWalls.length){
                        // если ему доступен как лево, так и право
                        if (moveFlag.left.filter(el => el == 1).length == moveFlag.right.filter(el => el == 1).length){
                            // переменная, которая определяет индекс стены, через которую не может пройти монстр вниз
                            let errorIndex = moveFlag.down.indexOf(0)
                            // проверка на то, ближе к левому или правому краю монстр
                            if ((monster.positionX + monster.div.offsetWidth) <= (allWalls[errorIndex].positionX + allWalls[errorIndex].div.offsetWidth / 2)){
                                // монстр двигается влево, так как левый край ему ближе
                                monster.lookSide = 180
                                autoMove(monster, speedMonster)
                            }
                            else{
                                monster.lookSide = 0
                                autoMove(monster, speedMonster)
                            }
                        }
                        // TODO else для определения доступной стороны
                    }
                    // проверка, что нельзя идти вверх
                    if (moveFlag.up.filter(el => el == 1).length < allWalls.length){
                        // далее аналогичная логика с повротом при отсутствии возможности движения вниз
                        if (moveFlag.left.filter(el => el == 1).length == moveFlag.right.filter(el => el == 1).length){
                            let errorIndex = moveFlag.up.indexOf(0)
                            if ((monster.positionX + monster.div.offsetWidth) <= (allWalls[errorIndex].positionX + allWalls[errorIndex].div.offsetWidth / 2)){
                                monster.lookSide = 180
                                autoMove(monster, speedMonster)
                            }
                            else{
                                monster.lookSide = 0
                                autoMove(monster, speedMonster)
                            }
                        }
                        // TODO else для определения доступной стороны
                    }

                    // проверка, что нельзя идти влево
                    if (moveFlag.left.filter(el => el == 1).length < allWalls.length){
                        // логика аналогично
                        if (moveFlag.down.filter(el => el == 1).length == moveFlag.up.filter(el => el == 1).length){
                            let errorIndex = moveFlag.left.indexOf(0)
                            if (monster.positionY + monster.div.offsetHeight <= allWalls[errorIndex].positionY + allWalls[errorIndex].div.offsetHeight/2){
                                monster.lookSide = -90
                                autoMove(monster, speedMonster)
                            }
                            else{
                                monster.lookSide = 90
                                autoMove(monster, speedMonster)
                            }
                        }
                        //  TODO else для определения доступной стороны
                    }

                    // проверка, что нельзя идти вправо
                    if (moveFlag.right.filter(el => el == 1).length < allWalls.length){
                        // логика аналогично
                        if (moveFlag.down.filter(el => el == 1).length == moveFlag.up.filter(el => el == 1).length){
                            let errorIndex = moveFlag.right.indexOf(0)
                            if (monster.positionY + monster.div.offsetHeight <= allWalls[errorIndex].positionY + allWalls[errorIndex].div.offsetHeight/2){
                                monster.lookSide = -90
                                autoMove(monster, speedMonster)
                            }
                            else{
                                monster.lookSide = 90
                                autoMove(monster, speedMonster)
                            }
                        }
                        //  TODO else для определения доступной стороны
                    }
                }
            }
            // если монстр достиг игрока
            else{
                gamer.getDamage(monster.damage)
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

        // достигание пуль стен
        allWalls.forEach((wall) =>{
            allBullets.forEach((bullet, index) =>{
                if (((bullet.positionX > wall.positionX) && (Math.abs(bullet.positionX - wall.positionX) < wall.div.offsetWidth)) 
                && ((bullet.positionY > wall.positionY) && Math.abs(bullet.positionY - wall.positionY) < wall.div.offsetHeight)){
                    bullet.div.remove()
                    allBullets.splice(index, 1)
                    return
                }
            })
        })

        // достигание игрока монстрами
        allMonsters.forEach((monster) =>{

        })

    }
    timeoutId = setInterval(perTime, 15)
    perTime()
}

function turnCharacter(character, cursorX, cursorY){
    let angle = Math.atan2(cursorY - character.positionY, cursorX - character.positionX)
    character.lookSide = angle * (180 / Math.PI)
    character.draw()
    document.querySelector('.'+character.div.className).remove()
}

function autoMove(character, speed){
    let angle = character.lookSide
    character.positionX += speed * Math.cos(angle * Math.PI / 180)
    character.positionY += speed * Math.sin(angle * Math.PI / 180)
    character.div.style.left = character.positionX + 'px'
    character.div.style.top = character.positionY + 'px'
    character.div.style.left += character.positionX + 'px'
    character.div.style.top += character.positionY + 'px'
}

// конец игры, появляется при смерти гг
// TODO допилить. Сейчас я на этапе того, что мне надо сделать покрасивше
function gameOver(){
    clearInterval(timeoutId)
    clearMap()

    // очищаем массивы стен, монстров и пуль
    allBullets.splice(0, allBullets.length)
    allMonsters.splice(0, allMonsters.length)
    allWalls.splice(0, allWalls.length)

    createGameOverMenu()
}

function clearMap(){
    let childList = Array.from(gameContent.children)
    childList.forEach(el => el.remove())
}

function createGameOverMenu(){
    gameContent.appendChild(playMenu)
    playMenu.appendChild(playButton)

    playScore.innerHTML = Math.floor(score + timeBonus) + ' очков'
    playMenu.appendChild(playScore)
}