//global variables
const form = document.querySelector("#form")
const gamePage = document.querySelector(".game-page")

//game board elements
const gameBoard = document.createElement("div")
const dealerRow = document.createElement('div')
const playerRow = document.createElement('div')
const startButtonRow = document.createElement('div')

//columns within game board
const dealerScoreColumn = document.createElement("div")
dealerScoreColumn.className = "col-3 align-self-center text-center"
const dealerCardColumn = document.createElement("div")
dealerCardColumn.className = "col-9 h-100"

const playerScoreColumn = document.createElement("div")
playerScoreColumn.className = "col-3 align-self-center text-center"
const playerCardColumn = document.createElement("div")
playerCardColumn.className = "col-9 h-100"

const playerScoreDisplay = document.createElement("h4")
playerScoreDisplay.className = "player-score-display text-light"

//enter button
form.addEventListener("submit", e => {
    e.preventDefault()
    const username = e.target.username.value
    fetch("http://localhost:3000/users/",{
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            name: username,
            money: 500,
            wins: 0,
            losses: 0
        })
        
        })
        .then(r => r.json())
        .then(user => {
            updateName(user)
    })
    renderGrid()
})

<<<<<<< HEAD
function updateName(user){
    // playerScoreDisplay.innerText = user.name
    // playerScoreColumn.append(playerScoreDisplay)
    console.log(user)

}

=======
//global variables
const enter = document.querySelector(".enter-button")
const gamePage = document.querySelector(".game-page")

//game board elements
const gameBoard = document.createElement("div")
const dealerRow = document.createElement('div')
const playerRow = document.createElement('div')
const startButtonRow = document.createElement('div')

//columns within game board
const dealerScoreColumn = document.createElement("div")
dealerScoreColumn.className = "col-3 align-self-center text-center"
const dealerCardColumn = document.createElement("div")
dealerCardColumn.className = "col-9 h-100"

const playerScoreColumn = document.createElement("div")
playerScoreColumn.className = "col-3 align-self-center text-center"
const playerCardColumn = document.createElement("div")
playerCardColumn.className = "col-9 h-100"

//enter button
enter.addEventListener("click", e => {
    renderGrid()
})

>>>>>>> 7908bb95b23c21588d88c17e26433426b1f6b1df
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
    startButtonRow.className = "start-button-row row justify-content-center"
    const startButton = document.createElement("button")
    startButton.className = "start-button btn-primary h-50"
    startButton.innerText = "Deal"
    startButtonRow.append(startButton)
    
    gameBoard.className = "game-board container border border-dark"
    gameBoard.append(dealerRow,playerRow,startButtonRow)

    gamePage.append(gameBoard)
}

//fetch shuffled deck
const fetchDeck = url => {
    fetch(url)
    .then(resp => resp.json())
    .then(deck =>
    drawCards(deck)  
)}

fetchDeck('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')

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
        alert("YOU WIN")
    } else if (playerScoreNum == dealerScoreNum){
        alert("PUSH")
    }else {
        alert("YOU LOSE")
    }
}
<<<<<<< HEAD

const renderCard = card => {
    const img = document.createElement("img")
    img.className = "card-img"
    img.src = card.image
    return img
}

const renderPlayerScore = (card1,card2) => {
    const playerScore = cardValue(card1) + cardValue(card2)
    playerScoreDisplay.append(playerScore)

    return playerScore
}

const renderDealerScore = (card1,card2) => {
    const dealerScore = cardValue(card1) + cardValue(card2)
    const dealerScoreDisplay = document.createElement("h4")
    dealerScoreDisplay.className = "dealer-score-display text-light"
    dealerScoreDisplay.innerText = `Dealer: ${dealerScore}`
    dealerScoreColumn.append(dealerScoreDisplay)
    return dealerScore
}

=======

const renderCard = card => {
    const img = document.createElement("img")
    img.className = "card-img"
    img.src = card.image
    return img
}

const renderPlayerScore = (card1,card2) => {
    const playerScore = cardValue(card1) + cardValue(card2)
    const playerScoreDisplay = document.createElement("h4")
    playerScoreDisplay.className = "player-score-display text-light"
    playerScoreDisplay.innerText = `Player: ${playerScore}`
    playerScoreColumn.append(playerScoreDisplay)
    return playerScore
}

const renderDealerScore = (card1,card2) => {
    const dealerScore = cardValue(card1) + cardValue(card2)
    const dealerScoreDisplay = document.createElement("h4")
    dealerScoreDisplay.className = "dealer-score-display text-light"
    dealerScoreDisplay.innerText = `Dealer: ${dealerScore}`
    dealerScoreColumn.append(dealerScoreDisplay)
    return dealerScore
}

>>>>>>> 7908bb95b23c21588d88c17e26433426b1f6b1df
const cardValue = card => {
    if (card.value === "KING" || card.value === "QUEEN" || card.value === "JACK"){
        return 10
    } else if (card.value === "ACE"){
        return 11
    } else {
        return parseInt(card.value)
    }
}
<<<<<<< HEAD
=======


>>>>>>> 7908bb95b23c21588d88c17e26433426b1f6b1df
