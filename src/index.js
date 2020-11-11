//global variables
const form = document.querySelector("#form")
const gamePage = document.querySelector(".game-page")

//initial player score
let playerScore = 0
let dealerScore = 0
let userWinStatus = false 

//game board container
const gameBoard = document.createElement("div")

//BOOTSTRAP GRID
//rows
const dealerRow = document.createElement('div')
const playerRow = document.createElement('div')
const startButtonRow = document.createElement('div')
const hitButtonRow = document.createElement('div')
const stayButtonRow = document.createElement('div')

//columns
const dealerScoreColumn = document.createElement("div")
dealerScoreColumn.className = "col-3 align-self-center text-center"
const dealerCardColumn = document.createElement("div")
dealerCardColumn.className = "col-9 h-100"
const dealerScoreDisplay = document.createElement("h4")

const playerScoreColumn = document.createElement("div")
playerScoreColumn.className = "col-3 align-self-center text-center"
const playerCardColumn = document.createElement("div")
playerCardColumn.className = "col-9 h-100"

const playerScoreDisplay = document.createElement("h1")
playerScoreDisplay.className = "player-score-display text-light"

//start game button
const startButton = document.createElement("button")
const resetButton = document.createElement("button")
resetButton.className = "reset"

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

    //search database for existing users
    findUser(username)
    renderGrid()
})

//helper functions for fetch requests
//GET existing user
const findUser = (name) => {
    fetch("http://localhost:3000/users")
    .then(resp => resp.json())
    .then(users => {
        users.forEach(user => {
            if (user.name === name) {
                nameTag.innerText= user.name
                nameTag.id= user.id
            }
        })

        //if no existing user with given name,
        //then create a new one
        if (nameTag.innerText==""){
            createNewUser(name)
        }
    })
}


//POST new User
const createNewUser = name => {
    fetch("http://localhost:3000/users",{
        method:"POST",
        headers:{
            'Content-Type':'application/json', 
            'Accept':'application/json'
        },
        body: JSON.stringify({
            name: name,
            money: 500,
            wins: 0,
            losses: 0
        })
    })
    .then(r => r.json())
    .then(user =>{
        console.log(user.id)
        nameTag.id = user.id
        nameTag.innerText= user.name
    })
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
    hitButton.id = "hitButton"
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

//fetch shuffled deck from deckofcards API (deckofcardsapi.com)
const fetchDeck = url => {
    fetch(url)
    .then(resp => resp.json())
    .then(deck => {
        drawCards(deck)
    })
}

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
    dealerCardColumn.append(renderCard(cards.cards[0],"second-card"))
    dealerCardColumn.append(renderCard(cards.cards[1],"fourth-card"))
    playerCardColumn.append(renderCard(cards.cards[2],"first-card"))
    playerCardColumn.append(renderCard(cards.cards[3],"third-card"))

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
    postHand()
}

const renderCard = (card,id) => {
    const img = document.createElement("img")
    img.className = "card-img"
    img.src = card.image
    img.id = id
    return img
}

const renderPlayerScore = (card1,card2) => {
    playerScore = cardValue(card1) + cardValue(card2)
    playerScoreDisplay.innerText = `${playerScore}`
    playerScoreColumn.append(playerScoreDisplay)
    return playerScore
}

const renderDealerScore = (card1,card2) => {
    dealerScore = cardValue(card1) + cardValue(card2)
    // dealerScoreDisplay.className = "dealer-score-display text-light"
    // dealerScoreDisplay.innerText = `Dealer: ${dealerScore}`
    // dealerScoreColumn.append(dealerScoreDisplay)
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

hitButton.addEventListener("click", e => {
    //find a way to find how to access the player row
    const playerCards = document.querySelector('.player-row.col-9')
    console.log(playerCards)
    //find out how to get the deck id in here
    fetch(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=1`)
    .then(r => r.json())
    .then(cards => {
        console.log(cards)
    })
    //assign the card's elements to consts
    //create img element
    //assign a class or id
    //append to playerCards
    //if over 21 function

})

stayButton.addEventListener("click", e => {
    //access the dealer side
    //activate the {dealer moves} function
    //activate {declare winner} function
    //if over 21 function
    //reset function
    
    
    console.log("stay")
})

startButton.addEventListener("click", () => {
    playerScore = 0
    dealerScore = 0
    dealerScoreColumn.innerHTML=""
    playerScoreColumn.innerHTML =""
    dealerCardColumn.innerHTML=""
    playerCardColumn.innerHTML=""
    fetchDeck('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
})

//posts details of hand to the database 
const postHand = () => {
    const data = {
        user_id: parseInt(nameTag.id),
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
    .then(hand => {
        console.log(hand)
    })
}







