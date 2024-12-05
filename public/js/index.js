window.addEventListener('DOMContentLoaded', ()=>{
    setVotingOptions();
})

async function setVotingOptions() {
    let response = await fetch('http://localhost:12000/candidates');
    let candidates = await response.json();
    populateVotingOptions(candidates);
}

function populateVotingOptions(candidates) {
    let votingContainer = document.getElementById('divVotingContainer');
    votingContainer.innerHTML = '';

    candidates.forEach(candidate => {
        let card = createCard(candidate);
        votingContainer.appendChild(card);
    });
}

function createCard(candidate) {
    let card = document.createElement('div');
    card.classList.add('card', 'card-width');

    let imgContainer = createImageContainer(candidate);
    let detailsList = createDetailsList(candidate);
    let voteButton = createVoteButton(candidate);

    card.appendChild(imgContainer);
    card.appendChild(detailsList);
    card.appendChild(voteButton);
    return card;
}

function createImageContainer(candidate) {
    let imgContainer = document.createElement('div');
    imgContainer.classList.add('img-container');
    let img = document.createElement('img');
    img.src = candidate.image_url;
    img.alt = 'candidate image';
    imgContainer.appendChild(img);
    return imgContainer;
}

function createDetailsList(candidate) {
    let ul = document.createElement('ul');
    ul.classList.add('list-group', 'list-group-flush');

    let nameItem = createNameItem(candidate);
    let partyItem = createPartyItem(candidate);

    ul.appendChild(nameItem);
    ul.appendChild(partyItem);
    return ul;
}

function createNameItem(candidate) {
    let nameItem = document.createElement('li');
    nameItem.classList.add('list-group-item');
    nameItem.textContent = `Name: ${candidate.first_name} ${candidate.last_name}`;
    return nameItem;
}

function createPartyItem(candidate) {
    let partyItem = document.createElement('li');
    partyItem.classList.add('list-group-item');
    partyItem.textContent = `Party: ${candidate.party}`;
    return partyItem;
}

function createVoteButton(candidate) {
    let voteButton = document.createElement('button');
    voteButton.type = 'submit';
    voteButton.classList.add('btn', 'btn-primary', 'w-100');
    voteButton.textContent = 'VOTE';
    voteButton.addEventListener('click', () => handleVote(candidate.id));
    return voteButton;
}