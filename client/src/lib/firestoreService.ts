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
  expectedSalary: number;
  sharedCodes?: Array<{
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
    console.log('=== FIRESTORE SAVE DEBUG ===');
    console.log('User ID:', userId);
    console.log('Budget Items count:', data.budgetItems?.length || 0);
    console.log('Budget Items:', JSON.stringify(data.budgetItems, null, 2));
    
    if (!data.budgetItems || !Array.isArray(data.budgetItems)) {
      console.warn('WARNING: budgetItems is missing or not an array!');
    }
    
    const userRef = doc(db, 'users', userId);
    const dataToSave = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    console.log('Final data structure:', {
      salaryFrequency: dataToSave.salaryFrequency,
      budgetItemsCount: dataToSave.budgetItems?.length,
      expectedSalary: dataToSave.expectedSalary,
    });
    
    await setDoc(
      userRef,
      dataToSave,
      { merge: true }
    );
    console.log('✓ Salary data saved to Firestore successfully');
  } catch (error) {
    console.error('✗ Error saving salary data:', error);
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

// Generate and save sharing code (supports anonymous users)
export async function generateSharingCode(
  userId: string | null,
  partnerName: string,
  salaryData: Omit<UserSalaryData, 'userId' | 'updatedAt' | 'sharedCodes'>
): Promise<string> {
  try {
    const code = `SP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Save shared summary
    const sharedRef = doc(collection(db, 'shared'), code);
    await setDoc(sharedRef, {
      code,
      userId: userId || 'anonymous',
      ...salaryData,
      createdAt: new Date().toISOString(),
    } as SharedSummary);

    // Update user's shared codes list only if user is logged in
    if (userId) {
      try {
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
      } catch (error) {
        console.warn('Could not update user shared codes:', error);
        // Continue anyway - the shared code was still created
      }
    }

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
