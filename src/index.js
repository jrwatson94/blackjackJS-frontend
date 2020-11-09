

//fetch shuffled deck

const playerHand = document.querySelector('#playerHand')
const dealerHand = document.querySelector('#dealerHand') 


const startGame = () => {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(resp => resp.json())
    .then(deck =>
    renderDeck(deck)  
)}

const startButton = document.querySelector(".start")
startButton.addEventListener("click", event => {
    console.log("clicked")
    startGame()
})


const renderDeck = deck => {
    const id = deck.deck_id
    drawCards(id)
}

const drawCards = id => {
    fetch(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=2`)
    .then(r => r.json())
    .then(cards => renderCards(cards,"#dealerHand"))

    fetch(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=2`)
    .then(r => r.json())
    .then(cards => renderCards(cards,"#playerHand"))
    .then( () => {handValue(dealerHand,playerHand)})
}


const renderCards = (cards,id) => {
    cards.cards.forEach(card => {   
        const cardUl = document.querySelector(id)
        const cardLi = document.createElement("li")
        const cardImage = document.createElement("img")
        
        cardImage.src = card.image
        assignValues(card, cardImage)

        cardLi.append(cardImage)
        cardUl.append(cardLi)  
    })
}


function handValue(dealerHand, playerHand) {
    const playerImages = playerHand.querySelectorAll('img')
    const dealerImages = dealerHand.querySelectorAll('img')
    let playerScore = 0
    let dealerScore = 0


    playerImages.forEach(img =>{
        playerScore += parseInt(img.className)
    })
    dealerImages.forEach(img =>{
        dealerScore += parseInt(img.className)
    })
    const playerScoreElement = document.querySelector(".player-score")
    playerScoreElement.innerText = playerScore

    const dealerScoreElement = document.querySelector(".dealer-score")
    dealerScoreElement.innerText = dealerScore

    if (playerScore > dealerScore){
        alert("YOU WIN!")
    }else{
        alert("YOU LOSE!")
    }

}


function assignValues(card, img) {
    if (card.value === "KING" || card.value === "QUEEN" || card.value === "JACK"){
        img.className= "10"
    } else if (card.value === "ACE"){
        img.className = "11"
    } else {
        img.className = card.value
    }
}

