import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const emigrantsCollection = collection(db, "emigrants");

// POST
export const addEmigrant = async (data: any) => {
  await addDoc(emigrantsCollection, data);
};

// GET
export const getEmigrants = async () => {
  const snapshot = await getDocs(emigrantsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// PUT
export const updateEmigrant = async (id: string, data: any) => {
  const docRef = doc(db, "emigrants", id);
  await updateDoc(docRef, data);
};

// DELETE
export const deleteEmigrant = async (id: string) => {
  const docRef = doc(db, "emigrants", id);
  await deleteDoc(docRef);
};