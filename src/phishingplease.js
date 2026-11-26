// Phishing Please: keep the real emails, report the phish.

const emails = [
  {
    from: "security@paypa1-support.com",
    subject: "URGENT: Your account is locked",
    body: "We noticed strange activity. Click here within 1 hour or your account will be closed.",
    isPhish: true
  },
  {
    from: "noreply@bcit.ca",
    subject: "Your grades are posted",
    body: "Final grades for COMP 1800 are now on Learning Hub.",
    isPhish: false
  },
  {
    from: "hr-payroll@gmail.com",
    subject: "Update your direct deposit",
    body: "Reply with your bank number and password so we can pay you on time.",
    isPhish: true
  },
  {
    from: "order-update@amazon.ca",
    subject: "Your package has shipped",
    body: "Your order #702-3391 is on the way. Track it in Your Orders on amazon.ca.",
    isPhish: false
  },
  {
    from: "prizes@canada-lotto-winner.co",
    subject: "You WON $5,000!!!",
    body: "Congratulations! Send a $20 processing fee to claim your prize today.",
    isPhish: true
  },
  {
    from: "no-reply@accounts.google.com",
    subject: "New sign-in on Windows",
    body: "We noticed a new sign-in to your account. If this was you, you don't need to do anything.",
    isPhish: false
  },
  {
    from: "it-helpdesk@bcit-login.help",
    subject: "Mailbox full: verify now",
    body: "Your mailbox is 99% full. Log in at the link below to keep receiving email.",
    isPhish: true
  },
  {
    from: "info@netflix.com",
    subject: "New on Netflix this week",
    body: "Check out the latest shows added to your list.",
    isPhish: false
  },
  {
    from: "ceo.boss.office@outlook.com",
    subject: "Quick favour",
    body: "I'm in a meeting. Can you buy 5 gift cards and send me the codes? I'll pay you back.",
    isPhish: true
  },
  {
    from: "receipts@starbucks.ca",
    subject: "Your receipt",
    body: "Thanks for your visit! Total: $6.45. Earn Stars on your next order.",
    isPhish: false
  }
];

// page elements
const scoreText = document.getElementById("score-text");
const timerText = document.getElementById("timer-text");
const emailCard = document.getElementById("email-card");
const fromText = document.getElementById("email-from");
const subjectText = document.getElementById("email-subject");
const bodyText = document.getElementById("email-body");
const choiceBtns = document.getElementById("choice-btns");
const keepBtn = document.getElementById("keep-btn");
const reportBtn = document.getElementById("report-btn");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const startBtn = document.getElementById("start-btn");

let deck = [];             // shuffled copy of emails for this game
let index = 0;             // which email we're on
let score = 0;
let currentEmail = null;
let timeLimit = 15;        // seconds for the current email
const minTime = 5;         // the clock never goes below this
let timeLeft = 0;
let countdown = null;

// shuffle a copy of the array so each game has a new order
function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function updateScore() {
  scoreText.textContent = `Score: ${score} / ${deck.length}`;
}

// put the next email on screen and start its clock
function showEmail() {
  currentEmail = deck[index];

  fromText.textContent = currentEmail.from;
  subjectText.textContent = currentEmail.subject;
  bodyText.textContent = currentEmail.body;

  feedback.textContent = "";
  keepBtn.disabled = false;
  reportBtn.disabled = false;
  nextBtn.hidden = true;
  emailCard.hidden = false;
  choiceBtns.hidden = false;

  startTimer();
}

// countdown for one email
function startTimer() {
  clearInterval(countdown);
  timeLeft = timeLimit;
  timerText.textContent = `Time: ${timeLeft}`;
  timerText.hidden = false;

  countdown = setInterval(() => {
    timeLeft--;
    timerText.textContent = `Time: ${timeLeft}`;
    if (timeLeft <= 0) {
      checkAnswer(null); // ran out of time
    }
  }, 1000);
}

// pickedPhish: true = Report, false = Keep, null = time ran out
function checkAnswer(pickedPhish) {
  clearInterval(countdown);
  keepBtn.disabled = true; 
  reportBtn.disabled = true;

  if (pickedPhish === null) {
    feedback.textContent = "Too slow!";
    feedback.className = "fs-5 mt-3 text-danger";
  } else if (pickedPhish === currentEmail.isPhish) {
    score++;
    feedback.textContent = "Correct!";
    feedback.className = "fs-5 mt-3 text-success";
  } else {
    feedback.textContent = "Wrong!";
    feedback.className = "fs-5 mt-3 text-danger";
  }

  updateScore();

  // each email gets 1 second less, down to minTime
  timeLimit = Math.max(minTime, timeLimit - 1);

  index++;
  if (index < deck.length) {
    nextBtn.hidden = false;
  } else {
    endGame();
  }
}

function endGame() {
  timerText.hidden = true;
  choiceBtns.hidden = true;
  feedback.textContent += ` Game over! You sorted ${score} / ${deck.length} correctly.`;
  startBtn.textContent = "Play again";
  startBtn.hidden = false;
}

keepBtn.addEventListener("click", () => checkAnswer(false));
reportBtn.addEventListener("click", () => checkAnswer(true));
nextBtn.addEventListener("click", showEmail);

// start or play again
startBtn.addEventListener("click", () => {
  deck = shuffle(emails);
  index = 0;
  score = 0;
  timeLimit = 15;
  updateScore();
  startBtn.hidden = true;
  showEmail();
});
