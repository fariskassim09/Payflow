import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { saveSalaryData, loadSalaryData } from '@/lib/firestoreService';

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
  forceSync: () => Promise<void>;
}

const SalaryContext = createContext<SalaryContextType | undefined>(undefined);

export function SalaryProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const DEFAULT_SALARY = 0;
  const [isLoading, setIsLoading] = useState(true);
  const isDataLoaded = useRef(false);
  
  // State
  const [salaryFrequency, setSalaryFrequencyState] = useState<'1x' | '2x'>('1x');
  const [expectedSalary, setExpectedSalaryState] = useState(DEFAULT_SALARY);
  const [monthlySalaries, setMonthlySalariesState] = useState<MonthlySalary[]>([]);
  const [budgetItems, setBudgetItemsState] = useState<BudgetItem[]>([]);

  // Helper to get current state values for saving
  // This avoids closure issues in async functions
  const getCurrentData = () => ({
    salaryFrequency,
    budgetItems,
    monthlySalaries,
    expectedSalary,
  });

  // Load data from Firestore when user changes
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        setSalaryFrequencyState('1x');
        setExpectedSalaryState(DEFAULT_SALARY);
        setMonthlySalariesState([]);
        setBudgetItemsState([]);
        setIsLoading(false);
        isDataLoaded.current = false;
        return;
      }

      try {
        setIsLoading(true);
        const userData = await loadSalaryData(user.uid);
        
        if (userData) {
          setSalaryFrequencyState(userData.salaryFrequency || '1x');
          setExpectedSalaryState(userData.expectedSalary || DEFAULT_SALARY);
          setMonthlySalariesState(userData.monthlySalaries || []);
          setBudgetItemsState(userData.budgetItems || []);
        } else {
          setSalaryFrequencyState('1x');
          setExpectedSalaryState(DEFAULT_SALARY);
          setMonthlySalariesState([]);
          setBudgetItemsState([]);
        }
        isDataLoaded.current = true;
      } catch (error) {
        console.error('Error loading user data:', error);
        isDataLoaded.current = true;
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  // Force sync function for manual triggering
  const forceSync = async (customData?: any) => {
    if (!user || !isDataLoaded.current) return;
    
    const dataToSave = customData || {
      salaryFrequency,
      budgetItems,
      monthlySalaries,
      expectedSalary,
    };
    
    try {
      await saveSalaryData(user.uid, dataToSave);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  // Save to Firestore whenever data changes
  useEffect(() => {
    if (isLoading || !user || !isDataLoaded.current) return;

    const timer = setTimeout(() => {
      forceSync();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [salaryFrequency, budgetItems, monthlySalaries, expectedSalary, user, isLoading]);

  const getMonthlySalary = (date: Date): number => {
    const existing = monthlySalaries.find(
      ms => ms.year === date.getFullYear() && ms.month === date.getMonth()
    );
    return existing ? existing.midSalary + existing.endSalary : expectedSalary;
  };

  const setExpectedSalary = (salary: number) => {
    setExpectedSalaryState(salary);
  };

  const getMidMonthlySalary = (date: Date): number => {
    const existing = monthlySalaries.find(
      ms => ms.year === date.getFullYear() && ms.month === date.getMonth()
    );
    if (existing) return existing.midSalary;
    return expectedSalary / 2;
  };

  const getEndMonthlySalary = (date: Date): number => {
    const existing = monthlySalaries.find(
      ms => ms.year === date.getFullYear() && ms.month === date.getMonth()
    );
    if (existing) return existing.endSalary;
    return expectedSalary / 2;
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
        return prev.map(ms => ms.year === year && ms.month === month ? { ...ms, midSalary: salary } : ms);
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
        return prev.map(ms => ms.year === year && ms.month === month ? { ...ms, endSalary: salary } : ms);
      }
      return [...prev, { year, month, midSalary: 0, endSalary: salary }];
    });
  };

  const resetMonthlySalary = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    setMonthlySalariesState(prev => prev.filter(ms => !(ms.year === year && ms.month === month)));
  };

  // SUPER SYNC: Immediate save for budget item actions
  const addBudgetItem = (item: BudgetItem) => {
    setBudgetItemsState(prev => {
      const updated = [...prev, item];
      // Trigger immediate save with the new data
      if (user && isDataLoaded.current) {
        saveSalaryData(user.uid, {
          salaryFrequency,
          budgetItems: updated,
          monthlySalaries,
          expectedSalary,
        }).catch(console.error);
      }
      return updated;
    });
  };

  const updateBudgetItem = (id: string, updates: Partial<BudgetItem>) => {
    setBudgetItemsState(prev => {
      const updated = prev.map(item => (item.id === id ? { ...item, ...updates } : item));
      if (user && isDataLoaded.current) {
        saveSalaryData(user.uid, {
          salaryFrequency,
          budgetItems: updated,
          monthlySalaries,
          expectedSalary,
        }).catch(console.error);
      }
      return updated;
    });
  };

  const removeBudgetItem = (id: string) => {
    setBudgetItemsState(prev => {
      const updated = prev.filter(item => item.id !== id);
      if (user && isDataLoaded.current) {
        saveSalaryData(user.uid, {
          salaryFrequency,
          budgetItems: updated,
          monthlySalaries,
          expectedSalary,
        }).catch(console.error);
      }
      return updated;
    });
  };

  const togglePaidStatus = (id: string) => {
    setBudgetItemsState(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, isPaid: !item.isPaid } : item);
      if (user && isDataLoaded.current) {
        saveSalaryData(user.uid, {
          salaryFrequency,
          budgetItems: updated,
          monthlySalaries,
          expectedSalary,
        }).catch(console.error);
      }
      return updated;
    });
  };

  const deductFromSalary = (id: string, amount: number, salaryType: 'mid' | 'end') => {
    updateBudgetItem(id, { amount });
  };

  const getBudgetsByGroup = (group: 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS'): BudgetItem[] => {
    return budgetItems.filter(item => item.group === group);
  };

  const getTotalPercentage = (): number => {
    return budgetItems.reduce((sum, item) => sum + item.percentage, 0);
  };

  const getMonthlySalariesData = () => monthlySalaries;

  const isMonthPaid = (date: Date): boolean => {
    const existing = monthlySalaries.find(ms => ms.year === date.getFullYear() && ms.month === date.getMonth());
    return existing?.isPaid || false;
  };

  const toggleMonthPaidStatus = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    setMonthlySalariesState(prev => {
      const updated = prev.map(ms => ms.year === year && ms.month === month ? { ...ms, isPaid: !ms.isPaid } : ms);
      if (user && isDataLoaded.current) {
        saveSalaryData(user.uid, {
          salaryFrequency,
          budgetItems,
          monthlySalaries: updated,
          expectedSalary,
        }).catch(console.error);
      }
      return updated;
    });
  };

  const isCategoryPaidForMonth = (categoryId: string, date: Date): boolean => {
    const category = budgetItems.find(item => item.id === categoryId);
    if (!category) return false;
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    return category.monthlyPaidStatus?.[monthKey] || false;
  };

  const toggleCategoryPaidStatus = (categoryId: string, date: Date) => {
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const category = budgetItems.find(item => item.id === categoryId);
    if (!category) return;
    
    const updatedStatus = {
      ...(category.monthlyPaidStatus || {}),
      [monthKey]: !isCategoryPaidForMonth(categoryId, date),
    };
    
    updateBudgetItem(categoryId, { monthlyPaidStatus: updatedStatus });
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
    forceSync,
  };

  return <SalaryContext.Provider value={value}>{children}</SalaryContext.Provider>;
}

export function useSalary() {
  const context = useContext(SalaryContext);
  if (context === undefined) throw new Error('useSalary must be used within SalaryProvider');
  return context;
}
