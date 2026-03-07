import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
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

// Helper to sanitize data for Firestore (remove undefined, ensure arrays)
function sanitizeData(data: any): any {
  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  } else if (data !== null && typeof data === 'object') {
    const sanitized: any = {};
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value !== undefined) {
        sanitized[key] = sanitizeData(value);
      }
    });
    return sanitized;
  }
  return data;
}

// Save user salary data to Firestore
export async function saveSalaryData(
  userId: string,
  data: Omit<UserSalaryData, 'userId' | 'updatedAt'>
) {
  if (!userId) {
    console.error('saveSalaryData: No userId provided');
    return;
  }

  try {
    const userRef = doc(db, 'users', userId);
    
    // Ensure data structure is valid
    const budgetItems = Array.isArray(data.budgetItems) ? data.budgetItems : [];
    const monthlySalaries = Array.isArray(data.monthlySalaries) ? data.monthlySalaries : [];
    
    const dataToSave = sanitizeData({
      ...data,
      budgetItems,
      monthlySalaries,
      updatedAt: new Date().toISOString(),
    });
    
    console.log(`[Firestore] Saving data for ${userId}. Items: ${budgetItems.length}`);
    
    await setDoc(userRef, dataToSave, { merge: true });
    console.log('✓ Salary data saved to Firestore successfully');
  } catch (error) {
    console.error('✗ Error saving salary data:', error);
    // Log more details if it's a Firestore error
    if (typeof error === 'object' && error !== null && 'code' in error) {
      console.error(`Firestore Error Code: ${(error as any).code}`);
    }
    throw error;
  }
}

// Load user salary data from Firestore
export async function loadSalaryData(userId: string): Promise<UserSalaryData | null> {
  if (!userId) return null;
  
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
  userId: string | null,
  partnerName: string,
  salaryData: Omit<UserSalaryData, 'userId' | 'updatedAt' | 'sharedCodes'>
): Promise<string> {
  try {
    const code = `SP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Save shared summary
    const sharedRef = doc(collection(db, 'shared'), code);
    await setDoc(sharedRef, sanitizeData({
      code,
      userId: userId || 'anonymous',
      ...salaryData,
      createdAt: new Date().toISOString(),
    }));

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
    const sharedRef = doc(code.startsWith('/') ? doc(db, code) : doc(db, 'shared', code));
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
    const sharedRef = doc(db, 'shared', code);
    await setDoc(sharedRef, {}, { merge: false });

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserSalaryData;
      const updatedCodes = (userData.sharedCodes || []).filter((c) => c.code !== code);
      await updateDoc(userRef, {
        sharedCodes: updatedCodes,
      });
    }
  } catch (error) {
    console.error('Error deleting share code:', error);
    throw error;
  }
}
