window.addEventListener('DOMContentLoaded', ()=>{
    setVotingOptions();
})

async function setVotingOptions() {
    let response = await fetch('http://localhost:12000/candidates');
    const candidates = await response.json();
    populateVotingOptions(candidates);
}

function populateVotingOptions(candidates) {
    const votingContainer = document.getElementById('divVotingContainer');
    votingContainer.innerHTML = '';

    candidates.forEach(candidate => {
        const card = createCard(candidate);
        votingContainer.appendChild(card);
    });
}

function createCard(candidate) {
    const card = document.createElement('div');
    card.classList.add('card', 'card-width');

    const imgContainer = createImageContainer(candidate);
    const detailsList = createDetailsList(candidate);
    const voteButton = createVoteButton(candidate);

    card.appendChild(imgContainer);
    card.appendChild(detailsList);
    card.appendChild(voteButton);
    return card;
}

function createImageContainer(candidate) {
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('img-container');

    const img = document.createElement('img');
    img.src = candidate.image_url;
    img.alt = 'candidate image';

    imgContainer.appendChild(img);
    return imgContainer;
}

function createDetailsList(candidate) {
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'list-group-flush');

    const nameItem = createNameItem(candidate);
    const partyItem = partyItem();

    ul.appendChild(nameItem);
    ul.appendChild(partyItem);
    return ul;
}

function createNameItem(candidate) {
    const nameItem = document.createElement('li');
    nameItem.classList.add('list-group-item');
    nameItem.textContent = `Name: ${candidate.first_name} ${candidate.last_name}`;
    return nameItem;
}

function createPartyItem(candidate) {
    const partyItem = document.createElement('li');
    partyItem.classList.add('list-group-item');
    partyItem.textContent = `Party: ${candidate.party}`;
    return partyItem;
}

function createVoteButton(candidate) {
    const voteButton = document.createElement('button');
    voteButton.type = 'submit';
    voteButton.classList.add('btn', 'btn-primary', 'w-100');
    voteButton.textContent = 'VOTE';
    voteButton.addEventListener('click', () => handleVote(candidate.id));

    return voteButton;
}