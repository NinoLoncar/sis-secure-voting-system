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
        const card = document.createElement('div');
        card.classList.add('card', 'card-width');

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('img-container');
        const img = document.createElement('img');
        img.classList.add('card-img-top', 'image-style');
        img.src = '../images/' + candidate.last_name + '.png';
        img.alt = `Image of ${candidate.first_name}`;
        imgContainer.appendChild(img);

        const ul = document.createElement('ul');
        ul.classList.add('list-group', 'list-group-flush');

        const nameItem = document.createElement('li');
        nameItem.classList.add('list-group-item');
        nameItem.textContent = `Name: ${candidate.first_name} ${candidate.last_name}`;
        ul.appendChild(nameItem);

        const partyItem = document.createElement('li');
        partyItem.classList.add('list-group-item');
        partyItem.textContent = `Party: ${candidate.party}`;
        ul.appendChild(partyItem);

        const voteButton = document.createElement('button');
        voteButton.type = 'submit';
        voteButton.classList.add('btn', 'btn-primary', 'w-100');
        voteButton.textContent = 'VOTE';
        voteButton.addEventListener('click', () => handleVote(candidate.id));

        card.appendChild(imgContainer);
        card.appendChild(ul);
        card.appendChild(voteButton);
        votingContainer.appendChild(card);

    });
}