import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { BudgetItem } from '@/contexts/SalaryContext';

export interface UserSalaryData {
  userId: string;
  salaryFrequency: '1x' | '2x';
  budgetItems: BudgetItem[];
  monthlySalaries: Array<{
    year: number;
    month: number;
    midSalary: number;
    endSalary: number;
  }>;
  sharedCodes: Array<{
    code: string;
    partnerName: string;
    sharedAt: string;
  }>;
  updatedAt: string;
}

export interface SharedSummary {
  code: string;
  userId: string;
  salaryFrequency: '1x' | '2x';
  budgetItems: BudgetItem[];
  monthlySalaries: Array<{
    year: number;
    month: number;
    midSalary: number;
    endSalary: number;
  }>;
  createdAt: string;
}

// Save user salary data to Firestore
export async function saveSalaryData(
  userId: string,
  data: Omit<UserSalaryData, 'userId' | 'updatedAt'>
) {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(
      userRef,
      {
        ...data,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    console.log('Salary data saved to Firestore');
  } catch (error) {
    console.error('Error saving salary data:', error);
    throw error;
  }
}

// Load user salary data from Firestore
export async function loadSalaryData(userId: string): Promise<UserSalaryData | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserSalaryData;
    }
    return null;
  } catch (error) {
    console.error('Error loading salary data:', error);
    throw error;
  }
}

// Generate and save sharing code
export async function generateSharingCode(
  userId: string,
  partnerName: string,
  salaryData: Omit<UserSalaryData, 'userId' | 'updatedAt' | 'sharedCodes'>
): Promise<string> {
  try {
    const code = `SP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Save shared summary
    const sharedRef = doc(collection(db, 'shared'), code);
    await setDoc(sharedRef, {
      code,
      userId,
      ...salaryData,
      createdAt: new Date().toISOString(),
    } as SharedSummary);

    // Update user's shared codes list
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const currentSharedCodes = userDoc.exists()
      ? (userDoc.data() as UserSalaryData).sharedCodes || []
      : [];

    await updateDoc(userRef, {
      sharedCodes: [
        ...currentSharedCodes,
        {
          code,
          partnerName,
          sharedAt: new Date().toISOString(),
        },
      ],
    });

    return code;
  } catch (error) {
    console.error('Error generating sharing code:', error);
    throw error;
  }
}

// Load shared summary using code
export async function loadSharedSummary(code: string): Promise<SharedSummary | null> {
  try {
    const sharedRef = doc(db, 'shared', code);
    const docSnap = await getDoc(sharedRef);

    if (docSnap.exists()) {
      return docSnap.data() as SharedSummary;
    }
    return null;
  } catch (error) {
    console.error('Error loading shared summary:', error);
    throw error;
  }
}

// Delete sharing code
export async function deleteShareCode(userId: string, code: string) {
  try {
    // Delete shared summary
    const sharedRef = doc(db, 'shared', code);
    await setDoc(sharedRef, {}, { merge: false });

    // Update user's shared codes list
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserSalaryData;
      const updatedCodes = userData.sharedCodes.filter((c) => c.code !== code);
      await updateDoc(userRef, {
        sharedCodes: updatedCodes,
      });
    }
  } catch (error) {
    console.error('Error deleting share code:', error);
    throw error;
  }
}
