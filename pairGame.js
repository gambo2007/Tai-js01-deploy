const body = document.querySelector('body');
body.style.display = 'flex';
body.style.alignItems = 'center';
body.style.justifyContent = 'center';
body.style.height = '100vh';
body.style.margin = '0';

const imagePath = 'images/bg.jpeg';
body.style.backgroundImage = `url(${imagePath})`;
body.style.backgroundSize = 'cover';
body.style.backgroundRepeat = 'no-repeat';
body.style.backgroundPosition = 'center center';

const backgroundMusic = new Audio('music/music.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 1;
backgroundMusic.addEventListener('canplaythrough', () => {
    backgroundMusic.play();
});
document.addEventListener('click', () => {
    backgroundMusic.play();
});
body.appendChild(backgroundMusic);

const gameBoard = document.createElement('div');
gameBoard.style.display = 'grid';
gameBoard.style.gridTemplateColumns = 'repeat(5, 1fr)';
gameBoard.style.placeItems = 'center';
gameBoard.style.backgroundColor = '#fe700b';
gameBoard.style.opacity = '0.8';
document.body.appendChild(gameBoard);

let coins = 10000;
const coin = document.createElement('div');
coin.style.position = 'absolute';
coin.style.top = '200px';
coin.style.fontSize = '24px';
coin.style.color = 'white';
gameBoard.appendChild(coin);

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

let allCards = [];
const imagesFolder = 'images';
allCards = ['img1.jpeg', 'img2.jpeg', 'img3.jpeg', 'img4.jpeg', 'img5.jpeg', 'img6.jpeg', 'img7.jpeg', 'img8.jpeg', 'img9.jpeg', 'img10.jpeg'];
allCards = allCards.concat(allCards);
let shuffledCards = shuffle(allCards);
console.log(shuffledCards);
let openedCards = [];
let matchedPairs = 0;

function createGameBoard() {
    for (let i = 0; i < 20; i++) {
        const cardNumber = i + 1;
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = cardNumber;
        card.dataset.initialValue = cardNumber;
        card.style.width = '100px';
        card.style.height = '100px';
        card.style.border = '1px solid blue';
        card.style.backgroundSize = 'cover';
        card.style.cursor = 'pointer';
        card.innerHTML = cardNumber; 
        card.style.textAlign ='center';
        card.style.lineHeight = '100px'
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    }
}

function flipCard() {
    const index = this.dataset.index;
    if (openedCards.length < 2 && !openedCards.includes(index)) {
        const card = this;
        const image = new Image();
        image.src = `images/${shuffledCards[index - 1]}`;

        image.onload = function () {
            card.style.backgroundImage = `url(${image.src})`;
            card.innerHTML = '';
            openedCards.push(index);
            if (openedCards.length === 2) {
                setTimeout(checkMatch, 500);
            }
        };
    }
}

function checkMatch() {
    const [index1, index2] = openedCards;
    const card1 = document.querySelector(`.card[data-index="${index1}"]`);
    const card2 = document.querySelector(`.card[data-index="${index2}"]`);
    if (shuffledCards[index1 - 1] === shuffledCards[index2 - 1]) {
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        openedCards = [];
        matchedPairs++;
        coins += 1000;
        card1.style.visibility = 'hidden'; 
        card2.style.visibility = 'hidden';
        if (matchedPairs === allCards.length / 2) {
            gameBoard.style.display ='none';
            const winMessage = createMessage('Congratulations! You won the game!','green');
            body.appendChild(winMessage);
            setTimeout(()=>{
                winMessage.style.display = 'none';
                gameBoard.style.display ='grid';
                resetGame();
            }, 3000);
        }
    } else {
        setTimeout(() => {
            card1.style.backgroundImage = 'none';
            card2.style.backgroundImage = 'none';
            card1.innerHTML = card1.dataset.initialValue; 
            card2.innerHTML = card2.dataset.initialValue;
        }, 500);
        openedCards = [];
        coins -= 500;

        if (coins <= 0) {
            gameBoard.style.display = 'none';
            const losingMessage = createMessage('Game Over! You ran out of coins.','black');
            body.appendChild(losingMessage);

            setTimeout(() => {
                losingMessage.style.display = 'none';
                gameBoard.style.display = 'grid';
                resetGame();
            }, 3000);
        }
    }
    updatecoin();
}

function updatecoin() {
    coin.textContent = `Coins: ${coins}`;
    coin.style.fontFamily = 'sans-serif';
    coin.style.fontSize= '45px';
    coin.style.webkitTextFillColor = 'transparent';
    const textImg = 'images/vutru.jpeg';
    coin.style.backgroundImage = `url(${textImg})`;
    coin.style.webkitBackgroundClip = 'text';
    coin.style.fontWeight = 'bold';
}

function resetGame() {
    shuffledCards = shuffle(allCards);
    openedCards = [];
    matchedPairs = 0;
    coins = 10000;
    gameBoard.innerHTML = '';
    createGameBoard();
    gameBoard.appendChild(coin);
    updatecoin();
}

function createMessage(text,color) {
    const message = document.createElement('div');
    message.textContent = text;
    message.style.fontSize = '45px';
    message.style.fontFamily = 'sans-serif';
    message.style.color = color;
    message.style.textAlign = 'center';
    message.style.textShadow = '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff';
    return message;
}
createGameBoard();
updatecoin();
