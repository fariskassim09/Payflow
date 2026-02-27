import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveSalaryDataLocal, loadSalaryDataLocal, isLocalStorageAvailable } from '@/lib/storageService';

export interface BudgetItem {
  id: string;
  name: string;
  icon: string;
  percentage: number;
  group: 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS';
  isPaid?: boolean;
  repeatNextMonth?: boolean;
  createdAt?: Date;
  salaryType?: 'full' | 'mid' | 'end'; // Which salary cycle this belongs to
  amount?: number; // Deducted amount if applicable
}

export interface BudgetGroup {
  name: 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS';
  items: BudgetItem[];
}

interface MonthlySalary {
  year: number;
  month: number;
  midSalary: number;
  endSalary: number;
}

interface SalaryContextType {
  salaryFrequency: '1x' | '2x'; // 1x or 2x per month
  setSalaryFrequency: (frequency: '1x' | '2x') => void;
  expectedSalary: number;
  setExpectedSalary: (salary: number) => void;
  monthlySalaries: Array<{ year: number; month: number; midSalary: number; endSalary: number }>;
  getMonthlySalary: (date: Date) => number;
  getMidMonthlySalary: (date: Date) => number;
  getEndMonthlySalary: (date: Date) => number;
  setMonthlySalary: (date: Date, salary: number) => void;
  setMidMonthlySalary: (date: Date, salary: number) => void;
  setEndMonthlySalary: (date: Date, salary: number) => void;
  resetMonthlySalary: (date: Date) => void;
  budgetItems: BudgetItem[];
  updateBudgetItem: (id: string, updates: Partial<BudgetItem>) => void;
  addBudgetItem: (item: BudgetItem) => void;
  removeBudgetItem: (id: string) => void;
  togglePaidStatus: (id: string) => void;
  deductFromSalary: (id: string, amount: number, salaryType: 'mid' | 'end') => void;
  getBudgetsByGroup: (group: 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS', currentMonth?: Date, salaryType?: 'full' | 'mid' | 'end') => BudgetItem[];
  getTotalPercentage: (currentMonth?: Date, salaryType?: 'full' | 'mid' | 'end') => number;
  getMonthlySalariesData: () => Array<{ year: number; month: number; midSalary: number; endSalary: number }>;
}

const SalaryContext = createContext<SalaryContextType | undefined>(undefined);

export function SalaryProvider({ children }: { children: React.ReactNode }) {
  const DEFAULT_SALARY = 3400;
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Load from localStorage on mount
  const loadInitialData = () => {
    if (isLocalStorageAvailable()) {
      const stored = loadSalaryDataLocal();
      if (stored) {
        return stored;
      }
    }
    return null;
  };

  const initialData = loadInitialData();
  
  const [salaryFrequency, setSalaryFrequencyState] = useState<'1x' | '2x'>(initialData?.salaryFrequency || '1x');
  const [expectedSalary, setExpectedSalary] = useState(DEFAULT_SALARY);
  const [monthlySalaries, setMonthlySalariesState] = useState<MonthlySalary[]>(
    initialData?.monthlySalaries || [{ year: 2026, month: 1, midSalary: 1700, endSalary: 1700 }]
  );
  const currentDate = new Date(2026, 1); // February 2026
  
  const [budgetItems, setBudgetItemsState] = useState<BudgetItem[]>(initialData?.budgetItems || [
    // NEEDS - Full month (1x salary)
    { id: 'sewa', name: 'Sewa', icon: '🏠', percentage: 9, group: 'NEEDS', isPaid: false, repeatNextMonth: true, createdAt: currentDate, salaryType: 'full' },
    { id: 'motorcycle', name: 'Motorcycle service', icon: '🔧', percentage: 2, group: 'NEEDS', isPaid: false, repeatNextMonth: true, createdAt: currentDate, salaryType: 'full' },
    { id: 'pba', name: 'Pba', icon: '💧', percentage: 1, group: 'NEEDS', isPaid: false, repeatNextMonth: true, createdAt: currentDate, salaryType: 'full' },
    { id: 'thb', name: 'Thb', icon: '⚡', percentage: 1, group: 'NEEDS', isPaid: false, repeatNextMonth: true, createdAt: currentDate, salaryType: 'full' },
    { id: 'prudential', name: 'Prudential', icon: '🏥', percentage: 4, group: 'NEEDS', isPaid: false, repeatNextMonth: true, createdAt: currentDate, salaryType: 'full' },
    { id: 'hibah', name: 'Hibah', icon: '🏥', percentage: 3, group: 'NEEDS', isPaid: false, repeatNextMonth: true, createdAt: currentDate, salaryType: 'full' },
    { id: 'mak', name: 'Mak & Ayah', icon: '👨‍👩‍👧', percentage: 9, group: 'NEEDS', isPaid: false, repeatNextMonth: true, createdAt: currentDate, salaryType: 'full' },
    // WANTS
    { id: 'food', name: 'Food & Dining', icon: '🍽️', percentage: 8, group: 'WANTS', isPaid: false, repeatNextMonth: true, createdAt: currentDate, salaryType: 'full' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎮', percentage: 5, group: 'WANTS', isPaid: false, repeatNextMonth: true, createdAt: currentDate, salaryType: 'full' },
    // SAVINGS
    { id: 'savings', name: 'Savings', icon: '💰', percentage: 40, group: 'SAVINGS', isPaid: false, repeatNextMonth: true, createdAt: currentDate, salaryType: 'full' },
    // DEBTS
    { id: 'loan', name: 'Loan Payment', icon: '💳', percentage: 8, group: 'DEBTS', isPaid: false, repeatNextMonth: true, createdAt: currentDate, salaryType: 'full' },
  ]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (isInitialized && isLocalStorageAvailable()) {
      saveSalaryDataLocal({
        salaryFrequency,
        budgetItems,
        monthlySalaries,
      });
    }
  }, [salaryFrequency, budgetItems, monthlySalaries, isInitialized]);

  // Mark as initialized after first render
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const getMonthlySalary = (date: Date): number => {
    const existing = monthlySalaries.find(
      ms => ms.year === date.getFullYear() && ms.month === date.getMonth()
    );
    if (salaryFrequency === '1x') {
      return existing ? existing.midSalary + existing.endSalary : DEFAULT_SALARY;
    } else {
      return existing ? existing.midSalary + existing.endSalary : DEFAULT_SALARY;
    }
  };

  const getMidMonthlySalary = (date: Date): number => {
    const existing = monthlySalaries.find(
      ms => ms.year === date.getFullYear() && ms.month === date.getMonth()
    );
    return existing ? existing.midSalary : DEFAULT_SALARY / 2;
  };

  const getEndMonthlySalary = (date: Date): number => {
    const existing = monthlySalaries.find(
      ms => ms.year === date.getFullYear() && ms.month === date.getMonth()
    );
    return existing ? existing.endSalary : DEFAULT_SALARY / 2;
  };

  const setMonthlySalary = (date: Date, salary: number) => {
    setMonthlySalariesState(prev => {
      const existing = prev.find(
        ms => ms.year === date.getFullYear() && ms.month === date.getMonth()
      );
      const halfSalary = salary / 2;
      if (existing) {
        return prev.map(ms =>
          ms.year === date.getFullYear() && ms.month === date.getMonth()
            ? { ...ms, midSalary: halfSalary, endSalary: halfSalary }
            : ms
        );
      } else {
        return [...prev, { year: date.getFullYear(), month: date.getMonth(), midSalary: halfSalary, endSalary: halfSalary }];
      }
    });
  };

  const setMidMonthlySalary = (date: Date, salary: number) => {
    setMonthlySalariesState(prev => {
      const existing = prev.find(
        ms => ms.year === date.getFullYear() && ms.month === date.getMonth()
      );
      if (existing) {
        return prev.map(ms =>
          ms.year === date.getFullYear() && ms.month === date.getMonth()
            ? { ...ms, midSalary: salary }
            : ms
        );
      } else {
        return [...prev, { year: date.getFullYear(), month: date.getMonth(), midSalary: salary, endSalary: DEFAULT_SALARY / 2 }];
      }
    });
  };

  const setEndMonthlySalary = (date: Date, salary: number) => {
    setMonthlySalariesState(prev => {
      const existing = prev.find(
        ms => ms.year === date.getFullYear() && ms.month === date.getMonth()
      );
      if (existing) {
        return prev.map(ms =>
          ms.year === date.getFullYear() && ms.month === date.getMonth()
            ? { ...ms, endSalary: salary }
            : ms
        );
      } else {
        return [...prev, { year: date.getFullYear(), month: date.getMonth(), midSalary: DEFAULT_SALARY / 2, endSalary: salary }];
      }
    });
  };

  const resetMonthlySalary = (date: Date) => {
    setMonthlySalariesState(prev =>
      prev.map(ms =>
        ms.year === date.getFullYear() && ms.month === date.getMonth()
          ? { ...ms, midSalary: DEFAULT_SALARY / 2, endSalary: DEFAULT_SALARY / 2 }
          : ms
      )
    );
  };

  const updateBudgetItem = (id: string, updates: Partial<BudgetItem>) => {
    setBudgetItemsState(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const addBudgetItem = (item: BudgetItem) => {
    setBudgetItemsState(prev => [...prev, item]);
  };

  const removeBudgetItem = (id: string) => {
    setBudgetItemsState(prev => prev.filter(item => item.id !== id));
  };

  const togglePaidStatus = (id: string) => {
    updateBudgetItem(id, { isPaid: !budgetItems.find(item => item.id === id)?.isPaid });
  };

  const deductFromSalary = (id: string, amount: number, salaryType: 'mid' | 'end') => {
    updateBudgetItem(id, { amount });
  };

  const getBudgetsByGroup = (group: 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS', currentMonth?: Date, salaryType?: 'full' | 'mid' | 'end') => {
    const items = budgetItems.filter(item => {
      if (item.group !== group) return false;
      
      if (currentMonth && item.createdAt) {
        const itemDate = new Date(item.createdAt);
        const isSameMonth = itemDate.getFullYear() === currentMonth.getFullYear() && itemDate.getMonth() === currentMonth.getMonth();
        
        if (!isSameMonth) {
          // Check if item repeats to this month
          if (!item.repeatNextMonth) return false;
        }
      }
      
      if (salaryType && item.salaryType && item.salaryType !== salaryType) return false;
      
      return true;
    });
    
    return items;
  };

  const getTotalPercentage = (currentMonth?: Date, salaryType?: 'full' | 'mid' | 'end') => {
    const groups: Array<'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS'> = ['NEEDS', 'WANTS', 'SAVINGS', 'DEBTS'];
    
    return groups.reduce((total, group) => {
      const items = getBudgetsByGroup(group, currentMonth, salaryType);
      
      return total + items.reduce((sum, item) => {
        if (currentMonth && item.createdAt) {
          const itemDate = new Date(item.createdAt);
          const isSameMonth = itemDate.getFullYear() === currentMonth.getFullYear() && itemDate.getMonth() === currentMonth.getMonth();
          
          if (!isSameMonth && !item.repeatNextMonth) return sum;
        }
        
        return sum + item.percentage;
      }, 0);
    }, 0);
  };

  const setSalaryFrequency = (frequency: '1x' | '2x') => {
    setSalaryFrequencyState(frequency);
  };

  return (
    <SalaryContext.Provider
      value={{
        salaryFrequency,
        setSalaryFrequency,
        expectedSalary,
        setExpectedSalary,
        monthlySalaries,
        getMonthlySalary,
        getMidMonthlySalary,
        getEndMonthlySalary,
        setMonthlySalary,
        setMidMonthlySalary,
        setEndMonthlySalary,
        resetMonthlySalary,
        budgetItems,
        updateBudgetItem,
        addBudgetItem,
        removeBudgetItem,
        togglePaidStatus,
        deductFromSalary,
        getBudgetsByGroup,
        getTotalPercentage,
        getMonthlySalariesData: () => monthlySalaries,
      }}
    >
      {children}
    </SalaryContext.Provider>
  );
}

export function useSalary() {
  const context = useContext(SalaryContext);
  if (!context) {
    throw new Error('useSalary must be used within SalaryProvider');
  }
  return context;
}
