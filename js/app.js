//Global Variables
const gallery = document.querySelector(".gallery")
const searchContainer = document.querySelector(".search-container")
let users = [];
let originalData = "";

//fetch Request
fetch('https://randomuser.me/api/?results=12')
  .then(res => res.json())
  .then(data => originalData = data)
  .then(data => generateMarkup(data))

//Markup Generate Function(s)

//Add search bar to the DOM
function generateSearch(data){
  const searchMarkup = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`;
  searchContainer.innerHTML = searchMarkup;
  searchContainer.innerHTML = searchContainer.innerHTML + `<button id="reset">RESET</button>`
};


//adds new markup to the DOM
function addToGallery(markup){
  gallery.innerHTML = gallery.innerHTML + markup;
};


//Generates an object for the user info and displays the cards in the DOM
function generateMarkup(data){
  users = [];
  data.results.map((user) =>{

    let userData = new Object();
    userData.card =
        `<div class="card" id=${data.results.indexOf(user)}>
          <div class="card-img-container">
              <img class="card-img" src="${user.picture.large}" alt="profile picture">
          </div>
          <div class="card-info-container">
              <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
              <p class="card-text">${user.email}</p>
              <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
          </div>
      </div>`;
      userData.modal =
       `<div class="modal-container" id="${data.results.indexOf(user)}">
           <div class="modal">
               <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
               <div class="modal-info-container">
                   <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                   <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                   <p class="modal-text">${user.email}</p>
                   <p class="modal-text cap">${user.location.city}</p>
                   <hr>
                   <p class="modal-text">${user.phone}</p>
                   <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
                   <p class="modal-text">Birthday: ${user.dob.date.slice(5,7)}/${user.dob.date.slice(8,10)}/${user.dob.date.slice(0,4)}</p>
               </div>
           </div>
           <div class="modal-btn-container">
               <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
               <button type="button" id="modal-next" class="modal-next btn">Next</button>
           </div>`;
        users.push(userData);
        let card = userData.card;
        addToGallery(userData.card);
  });
  generateSearch(data);
  searchCards(data);
  resetButton();
  cardClick();
}

//Event Listners

//Card click event listener
function cardClick() {
  let cards = document.querySelectorAll('.card');
    cards.forEach(card => card.addEventListener('click', () =>{
      addToGallery(users[card.id].modal)
      toggleModalDown();
      toggleModalUp();
      removeModal();
    }))
  }


//Close modal event listener
function removeModal(){
    const modal = document.querySelector('.modal-container');
    const xBtn = document.querySelector('.modal-close-btn');
    xBtn.addEventListener('click', () => modal.remove())
    cardClick();
}

//Toggle modals event listeners

function toggleModalDown(){
  const modal = document.querySelector('.modal-container');
  let modalIndex = parseInt(modal.id);
  const prev = document.querySelector('#modal-prev')
  const next = document.querySelector('#modal-next')

  prev.addEventListener('click', () => {
    modal.remove();
    console.log(modalIndex)
    modalIndex = modalIndex-1;
    console.log(modalIndex)
    addToGallery(users[modalIndex].modal)
    removeModal()
    toggleModalUp();
    toggleModalDown();
  })
}

function toggleModalUp(){
  const modal = document.querySelector('.modal-container');
  let modalIndex = parseInt(modal.id);
  const prev = document.querySelector('#modal-prev')
  const next = document.querySelector('#modal-next')

  next.addEventListener('click', () => {
    modal.remove();
    console.log(modalIndex)
    modalIndex = modalIndex+1;
    console.log(modalIndex)
    addToGallery(users[modalIndex].modal)
    removeModal()
    toggleModalDown()
    toggleModalUp();
  })
}

//Search bar keyup event listeners, displays cards to fit the search critera on submit
function searchCards(data){
const searchBar =  document.querySelector("#search-input");
const submit = document.querySelector("#search-submit");
let matches = [];
  submit.addEventListener('click', () => {
    let searchValue = searchBar.value.toLowerCase();
    data.results.forEach((user) => {
      const username = user.name.first.toLowerCase()
      if(username.includes(searchValue)){
        matches.push(user);
      }
    })
  gallery.innerHTML = '';
  let searchData ={};
  searchData.results = matches;
  generateMarkup(searchData);
  })
}

// Reset button event listeners, resets the user cards.
function resetButton(){
  const reset = document.querySelector('#reset');
  reset.addEventListener('click', () => {
    gallery.innerHTML = '';
    generateMarkup(originalData);
  })
}
