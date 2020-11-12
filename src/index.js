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

const nameTag = document.querySelector("#name-tag")

//stats link
const stats = document.querySelector(".stats")

//start game button
const startButton = document.createElement("button")
const resetButton = document.createElement("button")
resetButton.className = "reset"

//hit button
const hitButton = document.createElement('button')

//stay button
const stayButton = document.createElement('button')

//enter button
form.addEventListener("submit", e => {
    e.preventDefault()
    const username = e.target.username.value

    //search database for existing users
    findUser(username)
    renderGrid()
})

stats.addEventListener("click", e=> {
    gamePage.innerHTML = ""
    renderStats(nameTag.id)
})

const renderStats= (id) => {
    fetch(`http://localhost:3000/users/${id}/hands`)
    .then(r=>r.json())
    .then(hands => {
        renderStatsTable(hands)
        let trueCount = 0
        for (hand of hands){
            if (hand.user_won == true) {
                trueCount++
            }

        }
        const winPercentage = trueCount/hands.length
        renderWinPercentage(winPercentage)
        console.log(winPercentage)
    })
}

const renderWinPercentage = (winPercentage) => {
    const winDisplay = document.createElement("h3")
    winDisplay.innerText = `Win Ratio: ${winPercentage*100}%`
    nameTag.append(winDisplay)
}

const renderStatsTable = hands => {
    const statsTable = document.createElement("table")
    const statsTableHeader = document.createElement("thead")
    const statsHeaderRow = document.createElement("tr")
    const statsTableBody = document.createElement("tbody")

    const headerHand = document.createElement("th")
    headerHand.innerText = "Hand"
    const headerUserScore = document.createElement("th")
    headerUserScore.innerText = "User-Score"
    const headerDealerScore = document.createElement("th")
    headerDealerScore.innerText = "Dealer-Score"
    const headerWL = document.createElement("th")
    headerWL.innerText = "W/L"

    statsHeaderRow.append(headerHand,headerUserScore,headerDealerScore,headerWL)
    statsTableHeader.append(statsHeaderRow)
    hands.forEach(hand=> {
        const handNumber = document.createElement("td")
        const userScore = document.createElement("td")
        const dealerScore = document.createElement("td")
        const wl = document.createElement("td")
        
        handNumber.innerText = hand.id
        userScore.innerText = hand.user_score
        dealerScore.innerText = hand.dealer_score
        wl.innerText = hand.user_won

        const tableRow = document.createElement("tr")
        tableRow.append(handNumber,userScore,dealerScore,wl)
        statsTableBody.append(tableRow)
    })
    statsTable.append(statsTableHeader,statsTableBody)
    gamePage.append(statsTable)
}




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
    startButtonRow.className = "start-button-row row justify-content-center"
    startButton.className = "start-button btn-primary h-50"
    startButton.id = "startButton"
    startButton.innerText = "Deal"

    hitButton.className = "start-button btn-primary h-50"
    hitButton.id = "hitButton"
    hitButton.innerText = "Hit"

    stayButton.className = "start-button btn-primary h-50"
    stayButton.id = "stayButton"
    stayButton.innerText = "Stay"

    startButtonRow.append(startButton,hitButton,stayButton)
    
    gameBoard.className = "game-board container border border-dark"
    gameBoard.append(dealerRow,playerRow,startButtonRow)

    gamePage.append(gameBoard)
}
let deckId = ""

//fetch shuffled deck from deckofcards API (deckofcardsapi.com)
const fetchDeck = url => {
    fetch(url)
    .then(resp => resp.json())
    .then(deck => {
        deckId = deck.deck_id
        drawCards(deck)
    })
}

//fetch 4 random cards from deck
//and assign them to user and dealer
const drawCards= deck => {
    // const id = deck.deck_id
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`)
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
    
    
}

const renderCard = (card,id) => {
    const img = document.createElement("img")
    img.className = "card-img"
    img.src = card.image
    img.id = id
    return img
}

const renderNewCard = card => {
    const img = document.createElement("img")
    img.className = "added-card"
    img.src = card.image
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

// const aceStuff = playerScore => {
//     if (playerScore < 21){
//         return 11
//     }else{
//         return 1
//     }
// }

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

const winLose = () => {
    if (playerScore <= dealerScore && dealerScore <= 21 || playerScore > 21){
        const loseMessage = document.createElement("h2")
        loseMessage.innerText = "You Lose"
        loseMessage.className = "lose-msg"

        document.querySelector(".col-3").append(loseMessage)
        userWinStatus = false
        hitButton.disabled = true
        stayButton.disabled = true
    }else {
        const winMessage = document.createElement("h2")
        winMessage.innerText = "You Win!"
        winMessage.className = "win-msg"
        console.log(winMessage)
        document.querySelector(".col-3").append(winMessage)
        userWinStatus = true
        hitButton.disabled = true
        stayButton.disabled = true
    }
    postHand()
}



/*   BUTTON EVENT HANDLERS */
hitButton.addEventListener("click", e => {
    //find a way to find how to access the player row
    console.log(playerCardColumn)
    //find out how to get the deck id in here
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
    .then(r => r.json())
    .then(cards => {
        console.log(cards.cards[0])
        playerCardColumn.append(renderNewCard(cards.cards[0]))
        playerScore += cardValue(cards.cards[0])
        playerScoreDisplay.innerText = `${playerScore}`
        console.log(playerScore)
        if (playerScore > 21 ){
            winLose()
        }
            
    })

})

stayButton.addEventListener("click", e => {
    console.log(dealerCardColumn)
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
    .then(r => r.json())
    .then(card => {
        console.log(card.cards[0])
        dealerHit(card.cards[0])
    })
    //access the dealer side
    //activate the {dealer moves} function
    //activate {declare winner} function
    //if over 21 function
    //reset function
    
    
    console.log("stay")
})
const dealerHit = cardObj => {
    let hitCount = 0
    if (dealerScore < 17){
        dealerCardColumn.append(renderNewCard(cardObj))
        dealerScore += cardValue(cardObj)
        hitCount++
        console.log(dealerScore)
    }
    
    if (hitCount > 0 && dealerScore < 17){
        fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
        .then(r => r.json())
        .then(card => {
            dealerHit(card.cards[0])
        })
    }
    if (dealerScore >= 17){
        winLose()
    }
}

startButton.addEventListener("click", () => {
    stayButton.disabled = false
    hitButton.disabled = false
    playerScore = 0
    dealerScore = 0
    dealerScoreColumn.innerHTML=""
    playerScoreColumn.innerHTML =""
    dealerCardColumn.innerHTML=""
    playerCardColumn.innerHTML=""
    fetchDeck('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
})
