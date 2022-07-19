const cards = document.getElementById("game");
const tries = document.getElementById("tries");
const bestScore = document.getElementById("lowestScore");
const startButton = document.getElementById("start");
const restartButton = document.getElementById("restart");
const hiddenElements = document.querySelectorAll(".hidden");

const COLORS = ["red", "blue", "green", "orange", "purple"];
const IMAGES = [
  "pics/dog1.jpg",
  "pics/dog2.jpg",
  "pics/dog3.jpg",
  "pics/dog4.jpg",
  "pics/dog5.jpg",
];
const ROWS = 2;

let cardsActivelyBeingCompared = [];
let id = 0;
let numTries = 0;

// add event listener to the reset button
restartButton.addEventListener("click", function () {
  window.location.reload();
});

// add event listener to the start button
startButton.addEventListener("click", startGameFunc);

function startGameFunc() {
  //hide the start button
  startButton.classList.add("hidden");

  createCards();

  // display prompt sentences
  for (let el of hiddenElements) {
    el.classList.remove("hidden");
  }

  // display tries
  tries.innerText = 0;

  // display the lowest score
  if (!localStorage.lowestScore) {
    bestScore.innerText = "You haven't played the game!";
  } else {
    bestScore.innerText = localStorage.lowestScore + " tries";
  }
}

function createCards() {
  let scaledArr = [];
  let selectedArr = [];

  // combine 2 arrays
  const combinedArr = COLORS.concat(IMAGES);

  // randomly choose 5 to start the game - optional
  while (selectedArr.length < 5) {
    const random = Math.floor(Math.random() * combinedArr.length);
    if (selectedArr.indexOf(combinedArr[random]) === -1) {
      selectedArr.push(combinedArr[random]);
    }
  }

  // created new color cards
  scale(ROWS);
  shuffleCards();
  displayCards();

  // scale the array
  function scale(times) {
    for (let i = 0; i < times; i++) {
      scaledArr.push(...selectedArr);
    }
  }

  // shuffle the array
  function shuffleCards() {
    const count = scaledArr.length;

    for (let i = 0; i < count; i++) {
      const rand = Math.floor(Math.random() * count);
      const temp = scaledArr[i];
      scaledArr[i] = scaledArr[rand];
      scaledArr[rand] = temp;
    }
  }

  // create elements on DOM
  function displayCards() {
    for (let el of scaledArr) {
      const cardHolder = document.createElement("div");
      const card = document.createElement("img");
      cardHolder.addEventListener("click", clickCardHandler);
      cardHolder.append(card);
      card.style.visibility = "hidden";

      if (el.includes("jpg")) {
        card.setAttribute("src", el);
      } else {
        card.style.backgroundColor = el;
      }

      cards.append(cardHolder);
    }
  }
}

function isValidClickCardHandler(e) {
  if (
    e.target.children[0].style.visibility === "" ||
    cardsActivelyBeingCompared.length > 1
  ) {
    return false;
  }
  return true;
}

// create click event handler
function clickCardHandler(e) {
  if (!isValidClickCardHandler(e)) {
    return;
  }

  if (cardsActivelyBeingCompared.length === 0) {
    firstCardClickedHandler(e);
  } else {
    secondCardClickedHandler(e);
  }
  numTries++;
  tries.innerText = numTries;
  checkEnd();
}

function firstCardClickedHandler(e) {
  flipCard(e);
  id = setTimeout(function () {
    e.target.children[0].style.visibility = "hidden";
    cardsActivelyBeingCompared = [];
  }, 1000);
}

function secondCardClickedHandler(e) {
  clearTimeout(id);
  flipCard(e);
  if (
    cardsActivelyBeingCompared[0].src != cardsActivelyBeingCompared[1].src ||
    cardsActivelyBeingCompared[0].style.backgroundColor !=
      cardsActivelyBeingCompared[1].style.backgroundColor
  ) {
    setTimeout(compareFailed, 1000);
  } else {
    cardsActivelyBeingCompared = [];
  }
}

function flipCard(e) {
  e.target.children[0].style.visibility = "";
  const clickedCard = e.target.children[0];
  cardsActivelyBeingCompared.push(clickedCard);
}

function compareFailed() {
  cardsActivelyBeingCompared[0].style.visibility = "hidden";
  cardsActivelyBeingCompared[1].style.visibility = "hidden";
  cardsActivelyBeingCompared = [];
}

function checkEnd() {
  for (let card of cards.children) {
    const cardChild = card.children;
    if (cardChild[0].style.visibility === "hidden") {
      return;
    }
  }
  setTimeout(() => {
    // tell users they did a good job!
    alert(`You finished the game with ${numTries} tries!`);
    // check the score and save it to the local storage when lowest
    if (!localStorage.lowestScore) {
      localStorage.setItem("lowestScore", numTries);
    } else {
      if (numTries < localStorage.lowestScore) {
        localStorage.setItem("lowestScore", numTries);
        alert(`Congrats! Best Score: ${localStorage.lowestScore}`);
      }
    }

    // reset the game - force it refresh
    window.location.reload();
  }, 500);
}
