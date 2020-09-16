(() => {
    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function createDuck(n) {
        const duckMaterial = { 
            color: ["black", "red"], 
            direction: ["left", "right", "top-left", "top-right"], 
            oppositeDirection: ["right", "left", "top-right", "top-left"]
        };
        const randomDirection = random(0, duckMaterial.direction.length - 1);
        const duckDirection = duckMaterial.direction[randomDirection];
        const ducks = Array(n).fill(null).map(() => {
            return {
                x: random(0, window.innerWidth), 
                y: window.innerHeight, 
                speedX: random(-50, 50),
                speedY: random(5, 10),
                img: 0,
                color: duckMaterial.color[random(0, duckMaterial.color.length - 1)], 
                direction: duckDirection, 
                oppositeDirection: duckMaterial.oppositeDirection[randomDirection]
            };
        });
        return ducks;
    }
    function setBacgroundImage(duckElem, color, direction) {
        duckElem.style.backgroundImage = `url("./assets/images/duck/${color}/${direction}/0.png")`;
    }
    function setupDuckElement(duck) {
        const duckElem = document.createElement("div");
        duckElem.classList = "duck";
        duckElem.style.left = `${duck.x}px`;
        if (duck.direction.search("left") != -1) {
            if (duck.speedX > 0) {
                duck.speedX *= -1;
            }
        } else {
            if (duck.speedX < 0) {
                duck.speedX *= -1;
            }
        }  
        duckElem.style.top = `${duck.y}px`;
        duckElem.style.backgroundImage = `url("./assets/images/duck/${duck.color}/${duck.direction}/0.png")`;
        document.body.appendChild(duckElem);
        return { duck, duckElem };
    }
    function moveDuck(duckElem, duck) {
        width = window.innerWidth;
        height = window.innerHeight;
        duck.x += duck.speedX;
        duck.y -= duck.speedY;
        duckElem.style.left = `${duck.x}px`;
        duckElem.style.top = `${duck.y}px`;
        if (duck.x > width || duck.x < 0) {
            if (duck.x > width) {
                duck.x = width;
            }
            duck.speedX *= -1;
            const temp = duck.direction;
            duck.direction = duck.oppositeDirection;
            duck.oppositeDirection = temp;
            setBacgroundImage(duckElem, duck.color, duck.direction);
        } 
        if (duck.y > height || duck.y < 0) {
            if (duck.y > height) {
                duck.y = height;
            }
            duck.speedY *= -1;
        }
        duck.img += 1;
        if (duck.img > 2) {
            duck.img = 0;
        }
        const bg = duckElem.style.backgroundImage.substring(0, duckElem.style.backgroundImage.length - 7);
        duckElem.style.backgroundImage  = bg + `${duck.img}.png")`;
    }
    function shotDuck(duckElem, duck) {
        if (isOver) {
            return;
        }
        clearInterval(duckElem.interval);
        duckElem.style.backgroundImage = `url('./assets/images/duck/${duck.color}/shot/0.png')`;
        setTimeout(() => {
            duckElem.style.backgroundImage = `url('./assets/images/duck/${duck.color}/dead/0.png')`;
        }, 300);
        duckElem.style.transition = "top 2s";
        duckElem.style.top = `${window.innerHeight}px`;
        setTimeout(() => {
            document.body.removeChild(duckElem);
            const duckCollection = document.querySelector(".duck");
            if (!duckCollection) {
                isWin = true;
                isOver = true;
                console.log("You win");
                document.getElementById("win-sound").play();
                document.querySelector(".win").style.opacity = 1;
            }
        }, 2000);
    }
    function gameOver() {
        const lost = document.querySelector(".win");
        lost.innerHTML = "GAME OVER";
        document.getElementById("lose-sound").play();
        lost.style.opacity = 1;
    }
    function setupBullet(n) {
        const bulletContainer = document.getElementById("bullet");
        bulletContainer.innerHTML = null;
        const bullets = Array(n).fill(null).map(() => {
            const bullet = document.createElement("li");
            bullet.innerHTML = "|";
            return bullet
        });
        bullets.forEach((bullet) => {
            bulletContainer.appendChild(bullet);
        });
    }
    function handleClick() {
        if (isOver) {
            return;
        }
        bullet--;
        setupBullet(bullet);
        const gun = document.getElementById("gun-sound");
        gun.currentTime = 0;
        gun.play();
        if (bullet == 0) {
            new Promise((resolve, reject) => {
                setTimeout(() => { resolve() }, 2000);
            }).then(() => {
                if (!isWin) {
                    console.log("You lose");
                    isOver = true;
                    gameOver();
                }
            });
        }
    }
    function konamiCode(e) {   
        const codeArray = [
            "ArrowUp", 
            "ArrowUp", 
            "ArrowDown",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",
            "ArrowLeft",
            "ArrowRight",
            "b",
            "a"
        ];
        let index = 0;
        return function(e) {
            if (isOver) {
                return;
            }
            (e.key == codeArray[index]) ? index++ : index = 0;
            if (index == codeArray.length) {
                bullet = 10;
                setupBullet(bullet);
                index = 0;
            }
        }
    }
    let isOver = false;
    let isWin = false;
    let bullet = 10;
    let width = window.innerWidth;
    let height = window.innerHeight;
    function App() {
        setupBullet(bullet);
        const ducks = createDuck(5);
        const duckElems = ducks.map(setupDuckElement);
        // moving duck
        duckElems.forEach( ({ duck, duckElem }) => {
            duckElem.interval = setInterval(() => moveDuck(duckElem, duck), 100);
            // shot event
            duckElem.addEventListener('click', shotDuck.bind(null, duckElem, duck));
            
        });
        // click event
        document.body.addEventListener('click', handleClick);
        // timer
        let i = 0;
        const timer = setInterval(() => {
            if (isOver) {
                clearInterval(timer);
            }
            document.getElementById("timer").innerHTML = i;
            i += 1;
        }, 500);
        // konami code
        window.addEventListener('keydown', konamiCode());
    }
    App();
})();