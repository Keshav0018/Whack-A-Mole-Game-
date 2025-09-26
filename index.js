const gameTimeEl = document.querySelector(".game-time");
const holesEl = document.querySelectorAll(".box");
const startBtn = document.querySelector(".btn-start");
const moles = document.querySelectorAll(".mole");
const score = document.querySelector(".count");
const addOns = document.querySelector(".addOns");

const bgAudio = new Audio("./bg.wav");
const hitSound = new Audio("hit.mp3");
const bombSound = new Audio("bomb.mp3");

document.body.addEventListener("click", () => {
  bgAudio.volume = 0.5;
  bgAudio.play();
  bgAudio.loop = true;
});

// Helper function
const shakeScreen = function () {
  // Add shake class then remove it
  document.body.classList.add("shake");
  setTimeout(() => {
    document.body.classList.remove("shake");
  }, 300);
};

const removeAllMoles = function () {
  moles.forEach((mol) => {
    mol.style.opacity = 0;
    mol.style.transform = "translateY(30%)";
    mol.style.pointerEvents = "none";
  });
};

const backToHole = function (el) {
  el.style.opacity = 0;
  el.style.transform = "translateY(30%)";
};

const sendBack = function (el) {
  el.style.opacity = 0;
  el.style.transform = "translateY(30%)";
  el.style.pointerEvents = "none";
};

const resetGame = function () {
  // Clear all intervals
  clearInterval(timeInterval);
  arrIntervals.forEach((interval) => {
    clearInterval(interval);
  });

  // Reseting game
  game.time = 60;
  game.difficulty = "easy";
  gameTimeEl.innerText = `60s`;
};

const findAddOns = function (type) {
  addOns.style.opacity = 1;
  if (type == "bomb") {
    addOns.style.color = "red";
    addOns.innerText = "-5";
  } else {
    addOns.style.color = "green";
    addOns.innerText = "+1";
  }
};

const playSound = function (type) {
  if (type == "bomb") {
    bombSound.currentTime = 0;
    bombSound.play();
  } else {
    hitSound.currentTime = 0;
    hitSound.play();
  }
};

let scale = 1.0;

const levels = {
  easy: {
    probability: 8,
    time: 1600,
  },

  med: {
    probability: 7,
    time: 1000,
  },

  hard: {
    probability: 5,
    time: 900,
  },
};

let game = {
  time: 60,
  difficulty: "easy",
};

let timeInterval;
let arrIntervals = [];
let count = 0;

const displayMole = function (hole, moleType = "mole") {
  const mole = hole.querySelector(".mole");

  // Setting img,clicking ,opacity

  mole.src = `./${moleType}.png`;
  mole.style.pointerEvents = "auto";
  mole.style.opacity = 1;

  // If king Mole then change the width and translate slight and exit
  if (moleType == "kingMole") {
    mole.style.width = "300%";
    mole.style.transform = "translateY(-10%)";
    return;
  } else if (moleType == "bomb") {
    mole.style.width = "150%";
    // Setting up the bomb properly
    mole.style.transform = "translateY(-10%) translateX(15%)";
  } else {
    // is a mole

    // Setting the mole
    mole.style.width = "185%";
    mole.style.transform = "translateY(-20%)";
  }

  // Removing the mole after - s and maiking after - s plus 100ms

  setTimeout(function () {
    mole.style.opacity = 0;
    mole.style.transform = "translateY(30%)";
  }, levels[game.difficulty].time);

  setTimeout(function () {
    mole.style.pointerEvents = "none";
  }, levels[game.difficulty].time + 100);
};

const startGame = function () {
  // Init count  & scale
  count = 0;
  score.innerText = count;
  scale = 1.0;

  // if its start then changing to  reset and making count 0 again
  if (startBtn.innerText == "Start") {
    startBtn.innerText = "Reset";
  } else if (startBtn.innerText == "Reset") {
    startBtn.innerText = "Start";
    resetGame();

    // Return for user to click start
    return;
  }

  const changeTime = function () {
    game.time--;

    if (game.time == 0) {
      // set btn to start again and remove all and reset and display the king mole
      startBtn.innerText = "Start";
      resetGame();
      removeAllMoles();
      displayMole(document.querySelector(".box-5"), "kingMole");
    }

    if (game.time == 45) {
      game.difficulty = "med";
    }

    if (game.time == 20) {
      game.difficulty = "hard";
    }

    gameTimeEl.innerText = `${game.time}s`.padStart(3, "0");
  };

  // Timer
  timeInterval = setInterval(changeTime, 1000);
  //

  // time to set intervals at random time
  let time = 1000;

  holesEl.forEach((hole) => {
    // Probability logic
    time += 100;

    const intervalForMoles = setInterval(function () {
      const randomNumberMole = Math.ceil(
        Math.random() * levels[game.difficulty].probability
      );

      const randomNumberBomb = Math.ceil(Math.random() * 50);

      if (randomNumberBomb == 1) {
        displayMole(hole, "bomb");
      } else if (randomNumberMole == 1) {
        displayMole(hole);
      }
    }, time);

    arrIntervals.push(intervalForMoles);
  });
};

moles.forEach((mol) => {
  mol.addEventListener("click", function (e) {
    e.preventDefault();

    // If it is a bomb then
    if (mol.src == "http://127.0.0.1:5500/bomb.png") {
      playSound("bomb");
      setTimeout(function () {
        shakeScreen();
        findAddOns("bomb");
        count = count - 5;
        score.innerText = count;
        mol.style.opacity = 0;
        setTimeout(removeAllMoles, 100);
      }, 100);

      //  Remove the mole if it is not the king
      setTimeout(function () {
        addOns.style.opacity = 0;
        sendBack(mol);
      }, 500);
    } else if (mol.src == "http://127.0.0.1:5500/mole.png") {
      playSound();

      findAddOns();
      count++;
      mol.src = "./crying-mole.png";
      //  Remove the mole if it is not the king
      setTimeout(function () {
        addOns.style.opacity = 0;
        sendBack(mol);
      }, 500);

      score.innerText = count;
    } else if (mol.src == "http://127.0.0.1:5500/kingMole.png") {
      // Changing translate and scale
      let translate = mol.style.transform.split(" ")[0].slice(11, -2) * 1 + 2;
      scale = scale - 0.01;
      playSound();
      findAddOns();
      count++;

      mol.style.transform = `translateY(${translate--}%) scale(${scale})`;

      // First set to crying
      setTimeout(function () {
        mol.src = "./crying-mole.png";
      }, 1800);

      // Then send back
      setTimeout(function () {
        addOns.style.opacity = 0;
        sendBack(mol);
      }, 2000);
      score.innerText = count;
    }
  });
});

startBtn.addEventListener("click", function () {
  startGame();
});
