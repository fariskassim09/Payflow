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
}

const STORAGE_KEY = 'salary-planner-data';
const STORAGE_VERSION = '1';

// Save salary data to localStorage
export function saveSalaryDataLocal(data: StoredSalaryData) {
  try {
    const storageData = {
      version: STORAGE_VERSION,
      data,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
    console.log('Salary data saved to localStorage');
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Load salary data from localStorage
export function loadSalaryDataLocal(): StoredSalaryData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    
    // Check version compatibility
    if (parsed.version !== STORAGE_VERSION) {
      console.warn('Storage version mismatch, clearing old data');
      clearSalaryDataLocal();
      return null;
    }

    return parsed.data as StoredSalaryData;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}

// Clear salary data from localStorage
export function clearSalaryDataLocal() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Salary data cleared from localStorage');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

// Check if localStorage is available
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
