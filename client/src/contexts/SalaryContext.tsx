import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { 
  saveSalaryDataToFirestore, 
  loadSalaryDataFromFirestore,
  subscribeToSalaryData,
  deleteSalaryDataFromFirestore
} from '@/lib/firebaseService';

export interface BudgetItem {
  id: string;
  name: string;
  icon: string;
  percentage: number;
  group: 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS';
  isPaid?: boolean;
  repeatNextMonth?: boolean;
  createdAt?: Date;
  salaryType?: 'full' | 'mid' | 'end';
  amount?: number;
  monthlyPaidStatus?: Record<string, boolean>;
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
  isPaid?: boolean;
}

interface SalaryContextType {
  salaryFrequency: '1x' | '2x';
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
  isMonthPaid: (date: Date) => boolean;
  toggleMonthPaidStatus: (date: Date) => void;
  isCategoryPaidForMonth: (categoryId: string, date: Date) => boolean;
  toggleCategoryPaidStatus: (categoryId: string, date: Date) => void;
  isLoading: boolean;
}

const SalaryContext = createContext<SalaryContextType | undefined>(undefined);

export function SalaryProvider({ children }: { children: React.ReactNode }) {
  const DEFAULT_SALARY = 0;
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [salaryFrequency, setSalaryFrequencyState] = useState<'1x' | '2x'>('1x');
  const [expectedSalary, setExpectedSalaryState] = useState(DEFAULT_SALARY);
  const [monthlySalaries, setMonthlySalariesState] = useState<MonthlySalary[]>([]);
  const [budgetItems, setBudgetItemsState] = useState<BudgetItem[]>([]);

  const currentDate = new Date(2026, 1);

  // Load data from Firestore when user logs in
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log('👤 User logged in:', user.email);
        setIsLoading(true);

        // Subscribe to real-time updates from Firestore
        const unsubscribeData = subscribeToSalaryData((data) => {
          if (data) {
            setSalaryFrequencyState(data.salaryFrequency || '1x');
            setExpectedSalaryState(data.expectedSalary || DEFAULT_SALARY);
            setMonthlySalariesState(data.monthlySalaries || []);
            setBudgetItemsState(data.budgetItems || []);
          } else {
            // No data in Firestore, use defaults
            setSalaryFrequencyState('1x');
            setExpectedSalaryState(DEFAULT_SALARY);
            setMonthlySalariesState([]);
            setBudgetItemsState([]);
          }
          setIsLoading(false);
          setIsInitialized(true);
        });

        return () => {
          if (unsubscribeData) unsubscribeData();
        };
      } else {
        console.log('👤 User logged out');
        // Clear all data when user logs out
        setSalaryFrequencyState('1x');
        setExpectedSalaryState(DEFAULT_SALARY);
        setMonthlySalariesState([]);
        setBudgetItemsState([]);
        setIsLoading(false);
        setIsInitialized(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Save to Firestore whenever data changes (only after initialization)
  useEffect(() => {
    if (isInitialized && auth.currentUser) {
      const saveData = async () => {
        await saveSalaryDataToFirestore({
          salaryFrequency,
          budgetItems,
          monthlySalaries,
          expectedSalary,
        });
      };

      // Debounce the save to avoid too many writes
      const timer = setTimeout(saveData, 500);
      return () => clearTimeout(timer);
    }
  }, [salaryFrequency, budgetItems, monthlySalaries, expectedSalary, isInitialized]);

  const getMonthlySalary = (date: Date): number => {
    const existing = monthlySalaries.find(
      ms => ms.year === date.getFullYear() && ms.month === date.getMonth()
    );
    if (salaryFrequency === '1x') {
      return existing ? existing.midSalary + existing.endSalary : expectedSalary;
    } else {
      return existing ? existing.midSalary + existing.endSalary : expectedSalary;
    }
  };

  const setExpectedSalary = (salary: number) => {
    setExpectedSalaryState(salary);
  };

  const getMidMonthlySalary = (date: Date): number => {
    const existing = monthlySalaries.find(
      ms => ms.year === date.getFullYear() && ms.month === date.getMonth()
    );
    if (existing) return existing.midSalary;
    
    if (monthlySalaries.length > 0) {
      const sorted = [...monthlySalaries].sort((a, b) => {
        const aDate = new Date(a.year, a.month);
        const bDate = new Date(b.year, b.month);
        return bDate.getTime() - aDate.getTime();
      });
      return sorted[0].midSalary;
    }
    
    return DEFAULT_SALARY / 2;
  };

  const getEndMonthlySalary = (date: Date): number => {
    const existing = monthlySalaries.find(
      ms => ms.year === date.getFullYear() && ms.month === date.getMonth()
    );
    if (existing) return existing.endSalary;
    
    if (monthlySalaries.length > 0) {
      const sorted = [...monthlySalaries].sort((a, b) => {
        const aDate = new Date(a.year, a.month);
        const bDate = new Date(b.year, b.month);
        return bDate.getTime() - aDate.getTime();
      });
      return sorted[0].endSalary;
    }
    
    return DEFAULT_SALARY / 2;
  };

  const setMonthlySalary = (date: Date, salary: number) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    setMonthlySalariesState(prev => {
      const existing = prev.find(ms => ms.year === year && ms.month === month);
      if (existing) {
        return prev.map(ms =>
          ms.year === year && ms.month === month
            ? { ...ms, midSalary: salary / 2, endSalary: salary / 2 }
            : ms
        );
      }
      return [...prev, { year, month, midSalary: salary / 2, endSalary: salary / 2 }];
    });
  };

  const setMidMonthlySalary = (date: Date, salary: number) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    setMonthlySalariesState(prev => {
      const existing = prev.find(ms => ms.year === year && ms.month === month);
      if (existing) {
        return prev.map(ms =>
          ms.year === year && ms.month === month
            ? { ...ms, midSalary: salary }
            : ms
        );
      }
      return [...prev, { year, month, midSalary: salary, endSalary: 0 }];
    });
  };

  const setEndMonthlySalary = (date: Date, salary: number) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    setMonthlySalariesState(prev => {
      const existing = prev.find(ms => ms.year === year && ms.month === month);
      if (existing) {
        return prev.map(ms =>
          ms.year === year && ms.month === month
            ? { ...ms, endSalary: salary }
            : ms
        );
      }
      return [...prev, { year, month, midSalary: 0, endSalary: salary }];
    });
  };

  const resetMonthlySalary = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    setMonthlySalariesState(prev =>
      prev.filter(ms => !(ms.year === year && ms.month === month))
    );
  };

  const addBudgetItem = (item: BudgetItem) => {
    setBudgetItemsState(prev => [...prev, item]);
  };

  const updateBudgetItem = (id: string, updates: Partial<BudgetItem>) => {
    setBudgetItemsState(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const removeBudgetItem = (id: string) => {
    setBudgetItemsState(prev => prev.filter(item => item.id !== id));
  };

  const togglePaidStatus = (id: string) => {
    setBudgetItemsState(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isPaid: !item.isPaid } : item
      )
    );
  };

  const deductFromSalary = (id: string, amount: number, salaryType: 'mid' | 'end') => {
    updateBudgetItem(id, { amount });
  };

  const getBudgetsByGroup = (
    group: 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS',
    currentMonth?: Date,
    salaryType?: 'full' | 'mid' | 'end'
  ): BudgetItem[] => {
    return budgetItems.filter(item => item.group === group);
  };

  const getTotalPercentage = (
    currentMonth?: Date,
    salaryType?: 'full' | 'mid' | 'end'
  ): number => {
    return budgetItems.reduce((sum, item) => sum + item.percentage, 0);
  };

  const getMonthlySalariesData = () => monthlySalaries;

  const isMonthPaid = (date: Date): boolean => {
    const existing = monthlySalaries.find(
      ms => ms.year === date.getFullYear() && ms.month === date.getMonth()
    );
    return existing?.isPaid || false;
  };

  const toggleMonthPaidStatus = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    setMonthlySalariesState(prev =>
      prev.map(ms =>
        ms.year === year && ms.month === month
          ? { ...ms, isPaid: !ms.isPaid }
          : ms
      )
    );
  };

  const isCategoryPaidForMonth = (categoryId: string, date: Date): boolean => {
    const category = budgetItems.find(item => item.id === categoryId);
    if (!category) return false;
    
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    return category.monthlyPaidStatus?.[monthKey] || false;
  };

  const toggleCategoryPaidStatus = (categoryId: string, date: Date) => {
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    updateBudgetItem(categoryId, {
      monthlyPaidStatus: {
        ...budgetItems.find(item => item.id === categoryId)?.monthlyPaidStatus,
        [monthKey]: !isCategoryPaidForMonth(categoryId, date),
      },
    });
  };

  const value: SalaryContextType = {
    salaryFrequency,
    setSalaryFrequency: (freq) => setSalaryFrequencyState(freq),
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
    getMonthlySalariesData,
    isMonthPaid,
    toggleMonthPaidStatus,
    isCategoryPaidForMonth,
    toggleCategoryPaidStatus,
    isLoading,
  };

  return (
    <SalaryContext.Provider value={value}>
      {children}
    </SalaryContext.Provider>
  );
}

export function useSalary() {
  const context = useContext(SalaryContext);
  if (context === undefined) {
    throw new Error('useSalary must be used within a SalaryProvider');
  }
  return context;
}
