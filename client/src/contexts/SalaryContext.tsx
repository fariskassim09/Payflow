import React, { createContext, useContext, useState } from 'react';

export interface BudgetItem {
  id: string;
  name: string;
  icon: string;
  percentage: number;
  group: 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS';
}

export interface BudgetGroup {
  name: 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS';
  items: BudgetItem[];
}

interface SalaryContextType {
  expectedSalary: number;
  setExpectedSalary: (salary: number) => void;
  budgetItems: BudgetItem[];
  updateBudgetItem: (id: string, percentage: number) => void;
  addBudgetItem: (item: BudgetItem) => void;
  removeBudgetItem: (id: string) => void;
  getBudgetsByGroup: (group: 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS') => BudgetItem[];
  getTotalPercentage: () => number;
}

const SalaryContext = createContext<SalaryContextType | undefined>(undefined);

export function SalaryProvider({ children }: { children: React.ReactNode }) {
  const [expectedSalary, setExpectedSalary] = useState(3400);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    // NEEDS
    { id: 'sewa', name: 'Sewa', icon: '🏠', percentage: 9, group: 'NEEDS' },
    { id: 'motorcycle', name: 'Motorcycle service', icon: '🔧', percentage: 2, group: 'NEEDS' },
    { id: 'pba', name: 'Pba', icon: '💧', percentage: 1, group: 'NEEDS' },
    { id: 'thb', name: 'Thb', icon: '⚡', percentage: 1, group: 'NEEDS' },
    { id: 'prudential', name: 'Prudential', icon: '🏥', percentage: 4, group: 'NEEDS' },
    { id: 'hibah', name: 'Hibah', icon: '🏥', percentage: 3, group: 'NEEDS' },
    { id: 'mak', name: 'Mak & Ayah', icon: '👨‍👩‍👧', percentage: 9, group: 'NEEDS' },
    // WANTS
    { id: 'food', name: 'Food & Dining', icon: '🍽️', percentage: 8, group: 'WANTS' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎮', percentage: 5, group: 'WANTS' },
    // SAVINGS
    { id: 'savings', name: 'Savings', icon: '💰', percentage: 40, group: 'SAVINGS' },
    // DEBTS
    { id: 'loan', name: 'Loan Payment', icon: '💳', percentage: 8, group: 'DEBTS' },
  ]);

  const updateBudgetItem = (id: string, percentage: number) => {
    setBudgetItems(items =>
      items.map(item => (item.id === id ? { ...item, percentage } : item))
    );
  };

  const addBudgetItem = (item: BudgetItem) => {
    setBudgetItems(items => [...items, item]);
  };

  const removeBudgetItem = (id: string) => {
    setBudgetItems(items => items.filter(item => item.id !== id));
  };

  const getBudgetsByGroup = (group: 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS') => {
    return budgetItems.filter(item => item.group === group);
  };

  const getTotalPercentage = () => {
    return budgetItems.reduce((sum, item) => sum + item.percentage, 0);
  };

  return (
    <SalaryContext.Provider
      value={{
        expectedSalary,
        setExpectedSalary,
        budgetItems,
        updateBudgetItem,
        addBudgetItem,
        removeBudgetItem,
        getBudgetsByGroup,
        getTotalPercentage,
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
