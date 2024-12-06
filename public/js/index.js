let RSA_PUBLIC = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqE+hkUIgUFzSM4CSNfyPCoPljsh0EZoiEj1BoQOJScZRHPJVAn/3qVGKgiQAWwvL70acWAPhAz693WbibO0gRsG1MWmgZlQY/vhEmgDr6d1/UcSTLRwqx8wtNu0L2u3x0/MmxxKwrOyEZXJD10e/CS92l/Jna7M2EDSE++MhZ6IN26Gf8QZotfqiVeVcbF2e8kjTqjJT6FRUD8wy5RdlB+DdTgQmDXmRZkJvI64Dz+NaC3LX114wBHUqiUbMbDCm6xWTE1/1YUuc98jE8smh5i0EU2sec13gqHEFgQre9EGZxPuUms9hdx1XyOJivlH+KHiuN0YP0QXT/+mRcQgyqwIDAQAB'

window.addEventListener('DOMContentLoaded', ()=>{
    setVotingOptions();
    checkIfUserVoted();
})

async function setVotingOptions() {
    let response = await fetch('http://localhost:12000/candidates');
    let candidates = await response.json();
    populateVotingOptions(candidates);
}

async function checkIfUserVoted() {
    let response = await fetch('http://localhost:12000/voted');
    let data = await response.json();
    if (data.voted) {
        disableVoteButtons();
        displayVoteMessage(response)
    }
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
    voteButton.classList.add('btn-vote','btn', 'btn-primary', 'w-100');
    voteButton.textContent = 'VOTE';
    voteButton.addEventListener('click', () => handleVoteButtonClick(candidate.id));
    return voteButton;
}

async function handleVoteButtonClick(candidateId) {
    let options = setOptions(candidateId);
    let response = await fetch('http://localhost:12000/vote', options);
    disableVoteButtons();
    displayVoteMessage(response)
}

function setOptions(candidateId) {
    return {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({candidate_id: candidateId})
    }
}

function disableVoteButtons() {
    let voteButtons = document.getElementsByClassName('btn-vote');
    for (let button of voteButtons) {
        button.style.display = 'none';
    }
}

function displayVoteMessage(response) {
    response.ok ? displayVoteConfirmationMessage() : displayVoteErrorMessage();
}

function displayVoteConfirmationMessage() {
    let messageDiv = document.getElementById('divVotedMessage');
    messageDiv.style.backgroundColor = 'teal';
    messageDiv.textContent = 'YOU HAVE VOTED!';
    messageDiv.style.display = 'block';
}

function displayVoteErrorMessage() {
    let messageDiv = document.getElementById('divVotedMessage');
    messageDiv.style.backgroundColor = 'red';
    messageDiv.textContent = 'SOMETHING WENT WRONG! PLEASE TRY AGAIN!';
    messageDiv.style.display = 'block';
}


