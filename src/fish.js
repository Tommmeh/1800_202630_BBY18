import { db } from "./firebase.js";
import { collection, doc, getDocs, addDoc, updateDoc, increment, onSnapshot } from "firebase/firestore";

// Each fish lives at: users/{uid}/fish/{fishId}  ->  { name, size }
export class Fish {
  constructor(uid, id, data) {
    this.uid = uid;
    this.id = id;
    this.name = data.name;
    this.size = data.size;
  }

  get ref() {
    return doc(db, "users", this.uid, "fish", this.id);
  }

  // Load the user's fish give them a starter fish if they have none
  static async loadOrCreate(uid) {
    const col = collection(db, "users", uid, "fish");
    const snap = await getDocs(col);
    if (!snap.empty) return snap.docs.map((d) => new Fish(uid, d.id, d.data()));

    const data = { name: "Bubbles", size: 1 };
    const docRef = await addDoc(col, data);
    return [new Fish(uid, docRef.id, data)];
  }

  // quests will call this later
  async grow(amount = 1) {
    await updateDoc(this.ref, { size: increment(amount) });
  }

  // Runs onChange whenever this fish changes in Firestore
  listen(onChange) {
    return onSnapshot(this.ref, (snap) => {
      if (!snap.exists()) return;
      Object.assign(this, snap.data());
      onChange(this);
    });
  }

  // Make the fish img on the page match this fish's data
  applyTo(el) {
    el.style.transform = `scale(${1 + (this.size - 1) * 0.25})`; // +25% per size level
    el.alt = el.title = this.name;
  }
}