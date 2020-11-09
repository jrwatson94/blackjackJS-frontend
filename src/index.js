console.log("HELLO")

//fetch shuffled deck
fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
.then(resp => resp.json())
.then(deck =>
    renderDeck(deck)
)

const renderDeck = deck => {
    const id = deck.deck_id
    drawCards(id)
}

const drawCards = id => {
    fetch(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=4`)
    .then(r => r.json())
    .then(cards => renderCards(cards))
}

const renderCards = cards => {
    cards.cards.forEach(card => {
        console.log(card)
        const cardUl = document.querySelector("#dealerHand")
        const cardLi = document.createElement("li")
        const cardImage = document.createElement("img")
        
        cardImage.src = card.image
        assignValues(card, cardImage)

        cardLi.append(cardImage)
        cardUl.append(cardLi)
    })
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