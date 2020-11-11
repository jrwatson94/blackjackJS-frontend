//global variables
const form = document.querySelector("#form")
const gamePage = document.querySelector(".game-page")

//game board elements
const gameBoard = document.createElement("div")
const dealerRow = document.createElement('div')
const playerRow = document.createElement('div')
const startButtonRow = document.createElement('div')
const hitButtonRow = document.createElement('div')
const stayButtonRow = document.createElement('div')

//columns within game board
const dealerScoreColumn = document.createElement("div")
dealerScoreColumn.className = "col-3 align-self-center text-center"
const dealerCardColumn = document.createElement("div")
dealerCardColumn.className = "col-9 h-100"
const dealerScoreDisplay = document.createElement("h4")

const playerScoreColumn = document.createElement("div")
playerScoreColumn.className = "col-3 align-self-center text-center"
const playerCardColumn = document.createElement("div")
playerCardColumn.className = "col-9 h-100"

const playerScoreDisplay = document.createElement("h4")
playerScoreDisplay.className = "player-score-display text-light"


//start game button
const startButton = document.createElement("button")

//hit button
const hitButton = document.createElement('button')

//stay button
const stayButton = document.createElement('button')

//initial player score
let playerScore = 0
let dealerScore = 0
let userWinStatus = false 

//enter button
form.addEventListener("submit", e => {
    e.preventDefault()
    const username = e.target.username.value
    fetch("http://localhost:3000/users",{
        method:"POST",
        headers:{
            'Content-Type':'application/json', 
            'Accept':'application/json'
        },
        body: JSON.stringify({
            name: username,
            money: 500,
            wins: 0,
            losses: 0
        })
    })
        .then(r => r.json())
        .then (user => {
            renderUser(user)
        })
    renderGrid()
})

function renderUser(user){
    playerScoreDisplay.innerText = `${user.name}: ${playerScore}`
    playerScoreColumn.append(playerScoreDisplay)
    playerScoreDisplay.id = user.id
    console.log(user)
}

/* RENDER GAME BOARD TO PAGE*/
const renderGrid = () => {
    gamePage.innerHTML = ""
    createGameBoard()
}

const createGameBoard = () => {
    //dealer cards row
    dealerRow.className = "dealer-row row"
    dealerRow.append(dealerScoreColumn,dealerCardColumn)
    
    //player card row
    playerRow.className = "player-row row"
    playerRow.append(playerScoreColumn,playerCardColumn)
    
    //Deal button row
    startButtonRow.className = "start-button-row row justify-content-left"
    startButton.className = "start-button btn-primary h-50"
    startButton.id = "startButton"
    startButton.innerText = "Deal"
    startButtonRow.append(startButton)

    startButtonRow.className = "start-button-row row justify-content-center"
    hitButton.className = "start-button btn-primary h-50"
    hitButton.id = hitButton
    hitButton.innerText = "Hit"
    startButtonRow.append(hitButton)

    startButtonRow.className = "start-button-row row justify-content-right"
    stayButton.className = "start-button btn-primary h-50"
    stayButton.id = "stayButton"
    stayButton.innerText = "Stay"
    startButtonRow.append(stayButton)
    
    gameBoard.className = "game-board container border border-dark"
    gameBoard.append(dealerRow,playerRow,startButtonRow)

    gamePage.append(gameBoard)
}

//fetch shuffled deck
const fetchDeck = url => {
    fetch(url)
    .then(resp => resp.json())
    .then(deck =>
    drawCards(deck),
    postHand() 
)}


//fetch 4 random cards from deck
//and assign them to user and dealer
const drawCards= deck => {
    const id = deck.deck_id
    fetch(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=4`)
    .then(r => r.json())
    .then(cards => {
        renderCards(cards)
    })
}

const renderCards = cards => {
    for (let i = 0; i < cards.cards.length; i++) {
        if (i <= 1) { 
            dealerCardColumn.append(renderCard(cards.cards[i]))
        } else{
            playerCardColumn.append(renderCard(cards.cards[i]))
        }
    }
    const playerScoreNum = renderPlayerScore(cards.cards[2],cards.cards[3])
    const dealerScoreNum = renderDealerScore(cards.cards[0],cards.cards[1])

    //win condition
    if (playerScoreNum > dealerScoreNum){
        console.log("YOU WIN")
        userWinStatus = true
    }else {
        console.log("YOU LOSE")
        userWinStatus = false
    }
}

const renderCard = card => {
    const img = document.createElement("img")
    img.className = "card-img"
    img.src = card.image
    return img
}

const renderPlayerScore = (card1,card2) => {
    playerScore = cardValue(card1) + cardValue(card2)
    playerScoreDisplay.append(playerScore)

    return playerScore
}

const renderDealerScore = (card1,card2) => {
    dealerScore = cardValue(card1) + cardValue(card2)
    dealerScoreDisplay.className = "dealer-score-display text-light"
    dealerScoreDisplay.innerText = `Dealer: ${dealerScore}`
    dealerScoreColumn.append(dealerScoreDisplay)
    return dealerScore
}

const cardValue = card => {
    if (card.value === "KING" || card.value === "QUEEN" || card.value === "JACK"){
        return 10
    } else if (card.value === "ACE"){
        return 11
    } else {
        return parseInt(card.value)
    }
}


startButton.addEventListener("click", () => {
    fetchDeck('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
})

postHand = () => {
    const data = {
        user_id: playerScoreDisplay.id,
        user_score: playerScore,
        dealer_score: dealerScore,
        user_won: userWinStatus
    }
    
    fetch('http://localhost:3000/hands', {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    })
    .then(r => r.json())
    .then(hand =>{
        console.log(hand)
    })
}

