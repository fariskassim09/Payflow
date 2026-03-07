import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
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

  // Use refs to always hold the latest state values, avoiding stale closures
  // in async save callbacks that capture state at the time of function creation.
  const salaryFrequencyRef = useRef(salaryFrequency);
  const expectedSalaryRef = useRef(expectedSalary);
  const monthlySalariesRef = useRef(monthlySalaries);
  const budgetItemsRef = useRef(budgetItems);

  useEffect(() => { salaryFrequencyRef.current = salaryFrequency; }, [salaryFrequency]);
  useEffect(() => { expectedSalaryRef.current = expectedSalary; }, [expectedSalary]);
  useEffect(() => { monthlySalariesRef.current = monthlySalaries; }, [monthlySalaries]);
  useEffect(() => { budgetItemsRef.current = budgetItems; }, [budgetItems]);

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

  // Force sync function - always reads from refs to get the latest values,
  // preventing the stale-closure problem where an outdated snapshot of state
  // would be written back to Firestore and overwrite newer data.
  const forceSync = useCallback(async () => {
    if (!user || !isDataLoaded.current) return;

    const dataToSave = {
      salaryFrequency: salaryFrequencyRef.current,
      budgetItems: budgetItemsRef.current,
      monthlySalaries: monthlySalariesRef.current,
      expectedSalary: expectedSalaryRef.current,
    };

    try {
      await saveSalaryData(user.uid, dataToSave);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }, [user]);

  // Debounced auto-save: fires 1 second after any state change.
  // forceSync is stable (useCallback with [user]) so this effect only
  // re-registers when the actual data values or user change.
  useEffect(() => {
    if (isLoading || !user || !isDataLoaded.current) return;

    const timer = setTimeout(() => {
      forceSync();
    }, 1000);

    return () => clearTimeout(timer);
  }, [salaryFrequency, budgetItems, monthlySalaries, expectedSalary, user, isLoading, forceSync]);

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

  // FIX: addBudgetItem now saves using the ref-based snapshot so it always
  // writes the full, up-to-date dataset (including the newly added item)
  // rather than a stale closure over the previous render's state values.
  const addBudgetItem = (item: BudgetItem) => {
    setBudgetItemsState(prev => {
      const updated = [...prev, item];
      // Update the ref immediately so the save below uses the latest value
      budgetItemsRef.current = updated;
      if (user && isDataLoaded.current) {
        saveSalaryData(user.uid, {
          salaryFrequency: salaryFrequencyRef.current,
          budgetItems: updated,
          monthlySalaries: monthlySalariesRef.current,
          expectedSalary: expectedSalaryRef.current,
        }).catch(console.error);
      }
      return updated;
    });
  };

  const updateBudgetItem = (id: string, updates: Partial<BudgetItem>) => {
    setBudgetItemsState(prev => {
      const updated = prev.map(item => (item.id === id ? { ...item, ...updates } : item));
      budgetItemsRef.current = updated;
      if (user && isDataLoaded.current) {
        saveSalaryData(user.uid, {
          salaryFrequency: salaryFrequencyRef.current,
          budgetItems: updated,
          monthlySalaries: monthlySalariesRef.current,
          expectedSalary: expectedSalaryRef.current,
        }).catch(console.error);
      }
      return updated;
    });
  };

  const removeBudgetItem = (id: string) => {
    setBudgetItemsState(prev => {
      const updated = prev.filter(item => item.id !== id);
      budgetItemsRef.current = updated;
      if (user && isDataLoaded.current) {
        saveSalaryData(user.uid, {
          salaryFrequency: salaryFrequencyRef.current,
          budgetItems: updated,
          monthlySalaries: monthlySalariesRef.current,
          expectedSalary: expectedSalaryRef.current,
        }).catch(console.error);
      }
      return updated;
    });
  };

  const togglePaidStatus = (id: string) => {
    setBudgetItemsState(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, isPaid: !item.isPaid } : item);
      budgetItemsRef.current = updated;
      if (user && isDataLoaded.current) {
        saveSalaryData(user.uid, {
          salaryFrequency: salaryFrequencyRef.current,
          budgetItems: updated,
          monthlySalaries: monthlySalariesRef.current,
          expectedSalary: expectedSalaryRef.current,
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
      monthlySalariesRef.current = updated;
      if (user && isDataLoaded.current) {
        saveSalaryData(user.uid, {
          salaryFrequency: salaryFrequencyRef.current,
          budgetItems: budgetItemsRef.current,
          monthlySalaries: updated,
          expectedSalary: expectedSalaryRef.current,
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
