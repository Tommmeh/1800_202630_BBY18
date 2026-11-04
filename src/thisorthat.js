const rounds = [
  {
    real: "www.paypal.com",
    fake: "www.paypa1.com",

  },
  {
    real: "www.amazon.ca",
    fake: "www.amazon.ca-account-verify.com",
  },
  {
    real: "learn.bcit.ca",
    fake: "bcit-login.help",
  },
  {
    real: "www.netflix.com",
    fake: "www.netf1ix-billing.com",
  },
  {
    real: "accounts.google.com",
    fake: "accounts.g00gle.com",
  }
];

// buttons
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const roundText = document.getElementById("round-text");
const scoreText = document.getElementById("score-text");


let currentRound = 0;
let score = 0;
let realSide = "left"; // which button has the real link this round


function showRound() {
  const round = rounds[currentRound];

  // 50% chance to be left or right
  if (Math.random() < 0.5) {
    realSide = "left";
    leftBtn.textContent = round.real;
    rightBtn.textContent = round.fake;
  } else {
    realSide = "right";
    leftBtn.textContent = round.fake;
    rightBtn.textContent = round.real;
  }

  roundText.textContent = `Round ${currentRound + 1} of ${rounds.length}`;
  feedback.textContent = "";
  leftBtn.disabled = false;
  rightBtn.disabled = false;
  nextBtn.hidden = true;
}

//player picks a side
function checkAnswer(pickedSide) {
  const round = rounds[currentRound];

  if (pickedSide === realSide) {
    score++;
    feedback.textContent = "Safe!"
    feedback.className = "fs-5 text-success";
  } else {
    feedback.textContent = "Hooked! That was the phishing link."
    feedback.className = "fs-5 text-danger";
  }

  scoreText.textContent = `Score: ${score}`;
  leftBtn.disabled = true;   // stop double-clicking
  rightBtn.disabled = true;
  nextBtn.hidden = false;
}

leftBtn.addEventListener("click", () => checkAnswer("left"));
rightBtn.addEventListener("click", () => checkAnswer("right"));

//end or next round
nextBtn.addEventListener("click", () => {
  currentRound++;

  if (currentRound < rounds.length) {
    showRound();
  } else {
    roundText.textContent = "Game over!";
    feedback.textContent = `You spotted ${score} out of ${rounds.length} real links.`;
    feedback.className = "fs-5";
    leftBtn.hidden = true;
    rightBtn.hidden = true;
    nextBtn.hidden = true;
  }
});

// start the game
showRound();
