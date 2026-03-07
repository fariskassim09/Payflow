import { db, auth } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  query, 
  where,
  deleteDoc 
} from 'firebase/firestore';
import { BudgetItem } from '@/contexts/SalaryContext';

export interface StoredSalaryData {
  salaryFrequency: '1x' | '2x';
  budgetItems: BudgetItem[];
  monthlySalaries: Array<{
    year: number;
    month: number;
    midSalary: number;
    endSalary: number;
  }>;
  expectedSalary?: number;
  userId: string;
  lastUpdated: string;
}

const COLLECTION_NAME = 'user_salaries';

/**
 * Save salary data to Firestore (cloud-only, no local storage)
 */
export async function saveSalaryDataToFirestore(data: Omit<StoredSalaryData, 'userId' | 'lastUpdated'>) {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('No user logged in. Cannot save to Firestore.');
      return false;
    }

    const docRef = doc(db, COLLECTION_NAME, user.uid);
    await setDoc(docRef, {
      ...data,
      userId: user.uid,
      lastUpdated: new Date().toISOString(),
    }, { merge: true });

    console.log('✅ Salary data saved to Firestore');
    return true;
  } catch (error) {
    console.error('❌ Error saving to Firestore:', error);
    return false;
  }
}

/**
 * Load salary data from Firestore (one-time fetch)
 */
export async function loadSalaryDataFromFirestore(): Promise<StoredSalaryData | null> {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('No user logged in. Cannot load from Firestore.');
      return null;
    }

    const docRef = doc(db, COLLECTION_NAME, user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('✅ Salary data loaded from Firestore');
      return docSnap.data() as StoredSalaryData;
    } else {
      console.log('ℹ️ No salary data found in Firestore for this user');
      return null;
    }
  } catch (error) {
    console.error('❌ Error loading from Firestore:', error);
    return null;
  }
}

/**
 * Subscribe to real-time updates from Firestore
 * This will call the callback whenever data changes
 */
export function subscribeToSalaryData(
  callback: (data: StoredSalaryData | null) => void
): (() => void) | null {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('No user logged in. Cannot subscribe to Firestore.');
      return null;
    }

    const docRef = doc(db, COLLECTION_NAME, user.uid);
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        console.log('🔄 Real-time data update from Firestore');
        callback(docSnap.data() as StoredSalaryData);
      } else {
        console.log('ℹ️ No data found in Firestore');
        callback(null);
      }
    }, (error) => {
      console.error('❌ Error subscribing to Firestore:', error);
      callback(null);
    });

    return unsubscribe;
  } catch (error) {
    console.error('❌ Error setting up Firestore subscription:', error);
    return null;
  }
}

/**
 * Delete salary data from Firestore
 */
export async function deleteSalaryDataFromFirestore(): Promise<boolean> {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('No user logged in. Cannot delete from Firestore.');
      return false;
    }

    const docRef = doc(db, COLLECTION_NAME, user.uid);
    await deleteDoc(docRef);

    console.log('✅ Salary data deleted from Firestore');
    return true;
  } catch (error) {
    console.error('❌ Error deleting from Firestore:', error);
    return false;
  }
}

/**
 * Check if user has data in Firestore
 */
export async function hasUserData(): Promise<boolean> {
  try {
    const user = auth.currentUser;
    if (!user) return false;

    const docRef = doc(db, COLLECTION_NAME, user.uid);
    const docSnap = await getDoc(docRef);

    return docSnap.exists();
  } catch (error) {
    console.error('❌ Error checking user data:', error);
    return false;
  }
}
