
const playerHand = document.querySelector(".player-hand");
const dealerHand = document.querySelector(".dealer-hand");
const statusDiv = document.querySelector(".status");
const playerScoreSpan = document.getElementById("player-score");
const dealerScoreSpan = document.getElementById("dealer-score");
const hitButton = document.getElementById("hit");
const standButton = document.getElementById("stand");
const restartButton = document.getElementById("restart");
const yaySound = document.getElementById("yay");
const booSound = document.getElementById("boo");


const cardImages = {

    '2' : 'cards/heart2.avif',
    '3' : 'cards/club3.jpg',
    '4' : 'cards/club4.jpg',
    '5' : 'cards/diamond5.jpg',
    '6' : 'cards/heart6.jpg' ,
    '7' : 'cards/club7.jpg',
    '8' : 'cards/diamond8.jpg',
    '9' : 'cards/spade9.jpg',
    '10' : 'cards/spade10.jpg',
    'A' : 'cards/hearta.jpg',
    'J' : 'cards/heartj.png',
    'K' : 'cards/heartk.png',
    'Q' : 'cards/heartq.png',
}

let deck = [];
let playerCards = [];
let dealerCards = [];

let playerScore = 0;
let dealerScore = 0;

// function to put all the cards to be used into the deck array


function initializeDeck(){

    const suits = ['hearts' , 'diamonds' , 'clubs', 'spades' ];
    const values = ['2', '3', '4', '5' , '6' , '7' , '8' , '9', '10' ,'J' , 'Q' , 'K', 'A'];

    deck = [];

    suits.forEach(suit=> {
        values.forEach(value => {
            deck.push({value,suit});
        });
    });
}


// shuffle the cards using fisher-yates method

function shuffleDeck(){
    for(let i = deck.length - 1 ; i > 0 ; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j] = deck[j], deck[i]];
    }
}


//function to create and insert image from the deck

function dealCard(handElement){
    return new Promise(resolve =>{
        const card = deck.pop();
        const img  = document.createElement('img');
        img.src = cardImages[card.value];
        img.classList.add('deal');// will add the css style later
        handElement.appendChild(img);
        
        setTimeout(()=>{

            img.classList.remove('deal');
            resolve(card);
        }, 600)

    })
}


//Ace logic of 1 or 11 and Score count

function calculateScore(hand){
    let score = 0;
    let aceCount = 0;

    hand.forEach(card =>{
        if(card.value === 'A'){
            aceCount++;
            score += 11;
        }
        else if(['J', 'Q', 'K'].includes(card.value)){
            score += 10 ;
        }
        else{
            score += parseInt(card.value);
        }
    });

    while(score > 21 && aceCount > 0){
score -= 10;
aceCount--;
    }
    return score;
}


//updates and display scores

function updateScores(){
    playerScoreSpan.textContent = playerScore;
    dealerScoreSpan.textContent = dealerScore;
}

//function to deal two cards each for the player and dealer, calculate and display scores

async function initialDeal(){
    playerCards.push(await dealCard(playerHand));
    dealerCards.push(await dealCard(dealerHand));
    playerCards.push(await dealCard(playerHand));
    dealerCards.push(await dealCard(dealerHand));

    playerScore = calculateScore(playerCards);
    dealerScore = calculateScore(dealerCards);
}

// function to check for end game conditions

function checkForEndGame(){
    if(playerScore === dealerScore){
        statusDiv.textContent = "OW it's a tie";
        disableButtons();
    }
    else if(playerScore > 21){
        statusDiv.textContent = "You have lost";
        booSound.play();
        disableButtons();
    }
    else if(playerScore === 21){
        statusDiv.textContent = "BlackJack you win";
        yaySound.play();
        disableButtons();
    }
}
//disable hit and stand buttons

function disableButtons(){
    hitButton.disabled = true;
    standButton.disabled = true;
}

// enable hit and stand buttons

function enableButtons(){
    hitButton.disabled = false;
    standButton.disabled = false;
}


//hit button

hitButton.addEventListener("click", async () =>{
    playerCards.push(await dealCard(playerHand));
    playerScore = calculateScore(playerCards);
    updateScores();
    checkForEndGame();
})


//stand button

standButton.addEventListener("click", async () =>{
    disableButtons();
    while(dealerScore < 17){
        dealerCards.push(await dealCard(dealerHand));
        dealerScore = calculateScore(dealerCards);
        updateScores();
        if(dealerScore > 21){
            statusDiv.textContent = "You win";
            yaySound.play();
            return;
        }

    }

    if(dealerScore > playerScore){
        statusDiv.textContent = "You have lost";
        booSound.play();
    }
    else{
        statusDiv.textContent = "You win";
        yaySound.play();
    }
})

restartButton.addEventListener("click", () =>{
    playerHand.innerHTML = '';
    dealerHand.innerHTML = '';
    statusDiv.innerHTML = '';

    playerCards = [];
    dealerCards = [];
    playerScore = 0;
    dealerScore = 0;

    updateScores();

    enableButtons();
});

initializeDeck();
shuffleDeck();
enableButtons();