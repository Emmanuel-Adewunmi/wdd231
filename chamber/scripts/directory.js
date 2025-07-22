
const directory = document.getElementById('directory');
const gridBtn = document.getElementById('grid-view');
const listBtn = document.getElementById('list-view');

async function getMembers() {
    try {
        const response = await fetch('data/members.json');
        const data = await response.json();
        displayMembers(data.members);
    } catch (error) {
        console.error('Error loading members:', error);
        directory.innerHTML = '<p>Unable to load members at this time.</p>';
    }
}

function displayMembers(members) {
    directory.innerHTML = ''; // Clear first
    members.forEach(member => {
        const card = document.createElement('div');
        card.classList.add('member-card');

        card.innerHTML = `
      <img src="images/${member.icon}" alt="${member.name} logo" loading="lazy" width="120" height="60" >
      <h3>${member.name}</h3>
      <p>${member.address}</p>
      <p>${member.phone}</p>
      <a href="${member.website}" target="_blank">Visit Website</a>
    `;

        directory.appendChild(card);
    });
}

// Toggle views
gridBtn.addEventListener('click', () => {
    directory.classList.add('grid-view');
    directory.classList.remove('list-view');
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
});

listBtn.addEventListener('click', () => {
    directory.classList.add('list-view');
    directory.classList.remove('grid-view');
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
});

getMembers();
