import { db } from "./firebase.js";
import { collection, doc, getDocs, setDoc, serverTimestamp } from "firebase/firestore";


async function setQuestData() {

    await setDoc(doc(db, "quests", "quest_1"), {
        quest_task: "Win a game",
        reward: "A random fish grows bigger",
        failure: "A random fish starves",
        page: "quiz.html"
    });
    await setDoc(doc(db, "quests", "quest_2"), {
        quest_task: "Score over 80% on a quiz",
        reward: "You get a new fish!",
        failure: "A random fish DIES",
        page: "thisorthat.html"
    });
    await setDoc(doc(db, "quests", "quest_3"), {
        quest_task: "Do a backflip",
        reward: "A random fish changes colour",
        failure: "A random fish becomes blind",
        page: "quiz.html"
    });
    await setDoc(doc(db, "quests", "quest_4"), {
        quest_task: "Win *game name* 3 times",
        reward: "You get a random fish cosmetic",
        failure: "A random fish becomes ugly",
        page: "thisorthat.html"
    });
}


// Seeds the "hikes" collection with initial data if it is empty
async function seedQuests() {

    // Get a reference to the "hikes" collection
    const questsRef = collection(db, "quests");

    // Retrieve all documents currently in the collection
    const querySnapshot = await getDocs(questsRef);

    // If no documents exist, the collection is empty
    if (querySnapshot.empty) {

        console.log("Quests collection is empty. Seeding data...");
        // Call function to insert default hike documents
        await setQuestData();

    } else {
        // If documents already exist, do not reseed
        console.log("Quests collection already contains data. Skipping seed.");
    }
}

// Shuffle the quests randomly
function shuffleQuests(quests) {

    for (let i = quests.length - 1; i > 0; i--) {

        // Pick a random position in the array
        let j = Math.floor(Math.random() * (i + 1));

        // Swap the two quests
        let temp = quests[i];
        quests[i] = quests[j];
        quests[j] = temp;
    }

    return quests;
}




async function displayCardsDynamically() {

    let cardTemplate = document.getElementById("questCardTemplate");
    const questsCollectionRef = collection(db, "quests");

    try {

        const querySnapshot = await getDocs(questsCollectionRef);

        // Create an empty array to store quests
        let quests = [];

        // Go through each document and add its data to the array
        querySnapshot.forEach(questDoc => {
            quests.push(questDoc.data());
        });
        // Shuffle the quests randomly
        quests = shuffleQuests(quests);
        // Choose a random number of quests to display
        let numberOfQuests = Math.floor(Math.random() * 3) + 1;
        let random_quest_list = [];
        // Go through the quests array and display each quest
        quests.slice(0, numberOfQuests).forEach(quest => {

            // Clone the template
            let newcard = cardTemplate.content.cloneNode(true);


            // Populate the card with hike data
            newcard.querySelector('.card-header').textContent = quest.quest_task; 
            newcard.querySelector('.card-text').textContent = `Reward: ${quest.reward}.`;
            newcard.querySelector('.card-length').textContent = `Failure: ${quest.failure}.`;
            console.log(quest);
            if (quest.page) {
                newcard.querySelector("a").href = quest.page;
            }

            // Attach the card to the container
            document.getElementById("quests-go-here").appendChild(newcard);
            random_quest_list.push(quest);
        });
        console.log(random_quest_list);
        console.log("display");
        return random_quest_list

    } catch (error) {
        console.error("Error getting documents: ", error);
    }
}


// Load quests when the homepage opens
async function loadQuests() {

    // First, make sure quests exist in Firebase
    await seedQuests();

    // Then display the quest cards
    let random_quest_list = await displayCardsDynamically();
    console.log(random_quest_list);
    console.log("load");
    return random_quest_list;
}


// Call the function
loadQuests().then(random_quest_list => {
    startQuestTimer(random_quest_list);
});

// Start the quest timer
function startQuestTimer(random_quest_list) {
    console.log(random_quest_list);
    console.log("start");
    let timeLeft = 60 * 60 * 2 * 1; //Seconds, minutes, hours, days

    const timerDisplay = document.getElementById("questTimer");

    //Timer section
    const countdown = setInterval(function () {

        timeLeft--;

        let prt_days = 0
        let prt_hours = 0
        let prt_minutes = 0
        let prt_seconds

        let days = 0;
        if (timeLeft >= 86400) {
            let days = Math.floor(timeLeft/86400)
            prt_days = `${days}d`
        }
        else {
            prt_days = ``
        }

        let hours = 0;
        if (timeLeft >= 3600) {
            let hours = Math.floor((timeLeft%86400)/3600)
            prt_hours = `${hours}h`
            
        }
        else {
            prt_hours = ``
        }

        let minutes = 0;
        if (timeLeft >= 60) {
            let minutes = Math.floor(((timeLeft%86400)%3600)/60)
            prt_minutes = `${minutes}m`
            
        }
        else {
            prt_minutes = ``
        }

        let seconds = 0;
        if (timeLeft >= 1) {
            let seconds = Math.floor((((timeLeft%86400)%3600)%60))
            prt_seconds = `${seconds}s`
            
        }
        else {
            prt_seconds = ``
        }

        timerDisplay.textContent = `Time remaining: ${prt_days} ${prt_hours} ${prt_minutes} ${prt_seconds}`;
        //End of timer section
        //Timer when 0
        
        if (timeLeft <= 0) {

            clearInterval(countdown);

            random_quest_list.forEach((quest) => {
                let fail = quest.failure;
                if (fail === "A random fish starves") {
                    console.log("bro starved");
                } //quest 1 ^^^
                else if (fail === "A random fish DIES") {
                    console.log("bro died");
                } //quest 2 ^^^
                else if (fail === "A random fish becomes blind") {
                    console.log("bro blind");
                } //quest 3 ^^^
                else if (fail === "A random fish becomes ugly") {
                    console.log("bro ugly");
                } //quest 4 ^^^
            });

            timerDisplay.textContent = "Time is up!";

            document.getElementById("quests-go-here").innerHTML = "";

        } //End timer when 0

    }, 1000);
}
