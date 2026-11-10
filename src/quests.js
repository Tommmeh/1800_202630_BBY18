import { db } from "./firebase.js";
import { collection, doc, getDocs, setDoc, serverTimestamp } from "firebase/firestore";


async function setQuestData() {
    
    await setDoc(doc(db, "quests", "quest_1"), {
        quest_task: "Win a game", 
        reward: "A random fish grows bigger",
        failure: "A random fish starves"   
    });
    await setDoc(doc(db, "quests", "quest_2"), {
        quest_task: "Score over 80% on a quiz", 
        reward: "You get a new fish!",
        failure: "A random fish DIES"   
    });
    await setDoc(doc(db, "quests", "quest_3"), {
        quest_task: "Win a game", 
        reward: "A random fish grows bigger",
        failure: "A random fish starves"   
    });
    await setDoc(doc(db, "quests", "quest_4"), {
        quest_task: "Win *game name* 3 times", 
        reward: "You get a random fish cosmetic",
        failure: "A random fish becomes ugly"  
    });
}
setQuestData();
// // Helper function to add the sample hike documents.
// function setHikeData() {
//     const hikesRef = collection(db, "hikes");
    
//     addDoc(hikesRef, {
//         code: "BBY01", name: "Burnaby Lake Park Trail", city: "Burnaby",
//         level: "easy", details: "A lovely place for a lunch walk.", length: 10,
//         hike_time: 60, lat: 49.2467097082573, lng: -122.9187029619698,
//         last_updated: serverTimestamp()
//     });
//     addDoc(hikesRef, {
//         code: "AM01", name: "Buntzen Lake Trail", city: "Anmore",
//         level: "moderate", details: "Close to town, and relaxing.", length: 10.5,
//         hike_time: 80, lat: 49.3399431028579, lng: -122.85908496766939,
//         last_updated: serverTimestamp()
//     });
//     addDoc(hikesRef, {
//         code: "NV01", name: "Mount Seymour Trail", city: "North Vancouver",
//         level: "hard", details: "Amazing ski slope views.", length: 8.2,
//         hike_time: 120, lat: 49.38847101455571,lng: -122.94092543551031,
//         last_updated: serverTimestamp()
//     });
// }

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
        setQuestData();

    } else {
        // If documents already exist, do not reseed
        console.log("Quests collection already contains data. Skipping seed.");
    }
}

// Call the seeding function when the main.html page loads.
seedQuests();

async function displayCardsDynamically() {
    let cardTemplate = document.getElementById("questCardTemplate");
    const questsCollectionRef = collection(db, "quests");

    try {
        const querySnapshot = await getDocs(questsCollectionRef);
        querySnapshot.forEach(questDoc => {
            // Clone the template
            let newcard = cardTemplate.content.cloneNode(true);
            // Get hike data once
            const quest = questDoc.data(); 

            // Populate the card with hike data
            newcard.querySelector('.card-title').textContent = quest.quest_task; 
            newcard.querySelector('.card-text').textContent = `Reward: ${quest.reward}.`;
            newcard.querySelector('.card-length').textContent = `Failure: ${quest.failure}.`;

            // Attach the new card to the container
            document.getElementById("quests-go-here").appendChild(newcard);
        });
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
}

// Call the function to display cards when the page loads
displayCardsDynamically();