import React, { createContext, useContext, useState } from 'react';

export interface BudgetItem {
  id: string;
  name: string;
  icon: string;
  percentage: number;
  group: 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS';
  isPaid?: boolean;
  repeatNextMonth?: boolean;
  createdAt?: Date; // Track when category was created
}

export interface BudgetGroup {
  name: 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS';
  items: BudgetItem[];
}

interface SalaryContextType {
  expectedSalary: number;
  setExpectedSalary: (salary: number) => void;
  budgetItems: BudgetItem[];
  updateBudgetItem: (id: string, updates: Partial<BudgetItem>) => void;
  addBudgetItem: (item: BudgetItem) => void;
  removeBudgetItem: (id: string) => void;
  togglePaidStatus: (id: string) => void;
  getBudgetsByGroup: (group: 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS', currentMonth?: Date) => BudgetItem[];
  getTotalPercentage: (currentMonth?: Date) => number;
}

const SalaryContext = createContext<SalaryContextType | undefined>(undefined);

export function SalaryProvider({ children }: { children: React.ReactNode }) {
  const [expectedSalary, setExpectedSalary] = useState(3400);
  const currentDate = new Date(2026, 1); // February 2026
  
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    // NEEDS
    { id: 'sewa', name: 'Sewa', icon: '🏠', percentage: 9, group: 'NEEDS', isPaid: false, repeatNextMonth: true, createdAt: currentDate },
    { id: 'motorcycle', name: 'Motorcycle service', icon: '🔧', percentage: 2, group: 'NEEDS', isPaid: false, repeatNextMonth: true, createdAt: currentDate },
    { id: 'pba', name: 'Pba', icon: '💧', percentage: 1, group: 'NEEDS', isPaid: false, repeatNextMonth: true, createdAt: currentDate },
    { id: 'thb', name: 'Thb', icon: '⚡', percentage: 1, group: 'NEEDS', isPaid: false, repeatNextMonth: true, createdAt: currentDate },
    { id: 'prudential', name: 'Prudential', icon: '🏥', percentage: 4, group: 'NEEDS', isPaid: false, repeatNextMonth: true, createdAt: currentDate },
    { id: 'hibah', name: 'Hibah', icon: '🏥', percentage: 3, group: 'NEEDS', isPaid: false, repeatNextMonth: true, createdAt: currentDate },
    { id: 'mak', name: 'Mak & Ayah', icon: '👨‍👩‍👧', percentage: 9, group: 'NEEDS', isPaid: false, repeatNextMonth: true, createdAt: currentDate },
    // WANTS
    { id: 'food', name: 'Food & Dining', icon: '🍽️', percentage: 8, group: 'WANTS', isPaid: false, repeatNextMonth: true, createdAt: currentDate },
    { id: 'entertainment', name: 'Entertainment', icon: '🎮', percentage: 5, group: 'WANTS', isPaid: false, repeatNextMonth: true, createdAt: currentDate },
    // SAVINGS
    { id: 'savings', name: 'Savings', icon: '💰', percentage: 40, group: 'SAVINGS', isPaid: false, repeatNextMonth: true, createdAt: currentDate },
    // DEBTS
    { id: 'loan', name: 'Loan Payment', icon: '💳', percentage: 8, group: 'DEBTS', isPaid: false, repeatNextMonth: true, createdAt: currentDate },
  ]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const updateBudgetItem = (id: string, updates: Partial<BudgetItem>) => {
    setBudgetItems(items =>
      items.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const addBudgetItem = (item: BudgetItem) => {
    setBudgetItems(items => [...items, { ...item, createdAt: item.createdAt || new Date() }]);
  };

  const removeBudgetItem = (id: string) => {
    setBudgetItems(items => items.filter(item => item.id !== id));
  };

  const togglePaidStatus = (id: string) => {
    setBudgetItems(items =>
      items.map(item => (item.id === id ? { ...item, isPaid: !item.isPaid } : item))
    );
  };

  // Filter categories based on current month and repeat setting
  const getBudgetsByGroup = (group: 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS', currentMonth?: Date) => {
    const month = currentMonth || new Date(2026, 1);
    
    return budgetItems.filter(item => {
      // Must be in the correct group
      if (item.group !== group) return false;
      
      // If created in current month, always show
      if (item.createdAt) {
        const createdDate = new Date(item.createdAt);
        const isSameMonth = createdDate.getFullYear() === month.getFullYear() && 
                           createdDate.getMonth() === month.getMonth();
        if (isSameMonth) return true;
      }
      
      // If not created in current month, only show if repeatNextMonth is true
      return item.repeatNextMonth === true;
    });
  };

  const getTotalPercentage = (currentMonth?: Date) => {
    const items = budgetItems.filter(item => {
      const month = currentMonth || new Date(2026, 1);
      
      if (item.createdAt) {
        const createdDate = new Date(item.createdAt);
        const isSameMonth = createdDate.getFullYear() === month.getFullYear() && 
                           createdDate.getMonth() === month.getMonth();
        if (isSameMonth) return true;
      }
      
      return item.repeatNextMonth === true;
    });
    
    return items.reduce((sum, item) => sum + item.percentage, 0);
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
        togglePaidStatus,
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
