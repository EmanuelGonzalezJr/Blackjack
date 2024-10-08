const suits = ['Hearts', 'Spades', 'Clubs', 'Diamonds'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];
let playerHand = [];
let dealerHand = [];
let splitHand = [];
let playerScore = 0;
let dealerScore = 0;
let currentHand = 'main';  // Track whether we're playing the main hand or split hand

const playerCardsDiv = document.getElementById('player-cards');
const dealerCardsDiv = document.getElementById('dealer-cards');
const playerScoreDiv = document.getElementById('player-score');
const dealerScoreDiv = document.getElementById('dealer-score');
const messageDiv = document.getElementById('message');

document.getElementById('deal-button').addEventListener('click', deal);
document.getElementById('hit-button').addEventListener('click', hit);
document.getElementById('stand-button').addEventListener('click', stand);
document.getElementById('double-down-button').addEventListener('click', doubleDown);
document.getElementById('split-button').addEventListener('click', split);

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value, suit });
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function deal() {
    createDeck();
    shuffleDeck();

    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];

    playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand);

    updateUI();

    document.getElementById('hit-button').disabled = false;
    document.getElementById('stand-button').disabled = false;
    document.getElementById('double-down-button').disabled = false;
    document.getElementById('split-button').disabled = !(playerHand[0].value === playerHand[1].value); // Enable split if cards are the same
    document.getElementById('deal-button').disabled = true;
    messageDiv.innerText = '';
}

function hit() {
    if (currentHand === 'main') {
        playerHand.push(deck.pop());
        playerScore = calculateScore(playerHand);
    } else {
        splitHand.push(deck.pop());
        playerScore = calculateScore(splitHand);
    }

    updateUI();

    if (playerScore > 21) {
        endGame('Bust! Dealer Wins.');
    }
}

function stand() {
    currentHand = 'main';
    while (dealerScore < 17) {
        dealerHand.push(deck.pop());
        dealerScore = calculateScore(dealerHand);
    }
    updateUI();

    if (dealerScore > 21) {
        endGame('Dealer Busts! You Win!');
    } else if (dealerScore >= playerScore) {
        endGame('Dealer Wins.');
    } else {
        endGame('You Win!');
    }
}

function doubleDown() {
    hit();
    stand();
}

function split() {
    splitHand.push(playerHand.pop());
    document.getElementById('split-button').disabled = true;
    messageDiv.innerText = 'Playing the first hand';
    updateUI();
}

function calculateScore(hand) {
    let score = 0;
    let hasAce = false;

    for (let card of hand) {
        if (card.value === 'A') {
            hasAce = true;
            score += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    }

    if (score > 21 && hasAce) {
        score -= 10;
    }
    return score;
}

function updateUI() {
    playerCardsDiv.innerHTML = handToHTML(playerHand);
    dealerCardsDiv.innerHTML = handToHTML(dealerHand);
    playerScoreDiv.innerText = `Score: ${playerScore}`;
    dealerScoreDiv.innerText = `Score: ${dealerScore}`;
}

function handToHTML(hand) {
    return hand.map(card => `${card.value} of ${card.suit}`).join(' | ');
}

function endGame(message) {
    messageDiv.innerText = message;
    document.getElementById('hit-button').disabled = true;
    document.getElementById('stand-button').disabled = true;
    document.getElementById('double-down-button').disabled = true;
    document.getElementById('deal-button').disabled = false;
}
