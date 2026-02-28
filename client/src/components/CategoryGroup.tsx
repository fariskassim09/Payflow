import { useState } from 'react';
import { BudgetItem } from '@/contexts/SalaryContext';
import { useSalary } from '@/contexts/SalaryContext';
import SwipeableCategory from './SwipeableCategory';

interface CategoryGroupProps {
  group: 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS';
  items: BudgetItem[];
  onCategoryTap?: (id: string) => void;
  currentMonth?: Date;
}

const groupColors: Record<string, string> = {
  NEEDS: '#3B82F6',
  WANTS: '#8B5CF6',
  SAVINGS: '#10B981',
  DEBTS: '#F59E0B',
};

const groupLabels: Record<string, string> = {
  NEEDS: 'NEEDS',
  WANTS: 'WANTS',
  SAVINGS: 'SAVINGS',
  DEBTS: 'DEBTS',
};

export default function CategoryGroup({ group, items, onCategoryTap, currentMonth = new Date(2026, 1) }: CategoryGroupProps) {
  const { expectedSalary, togglePaidStatus, removeBudgetItem, isCategoryPaidForMonth, toggleCategoryPaidStatus } = useSalary();

  const groupTotal = items.reduce((sum, item) => sum + item.percentage, 0);
  const groupAmount = (expectedSalary * groupTotal) / 100;

  return (
    <div className="space-y-3">
      {/* Group Header */}
      <div className="flex items-center gap-3 px-4 py-2">
        <div
          className="w-1 h-6 rounded-full"
          style={{ backgroundColor: groupColors[group] }}
        />
        <h3 className="text-sm font-bold text-accent uppercase tracking-wider">{groupLabels[group]}</h3>
        <span className="ml-auto text-xs text-secondary-foreground">{items.length}</span>
      </div>

      {/* Group Items */}
      <div className="space-y-2">
        {items.map((item) => {
          const amount = (expectedSalary * item.percentage) / 100;
          return (
            <SwipeableCategory
              key={item.id}
              id={item.id}
              icon={item.icon}
              name={item.name}
              percentage={item.percentage}
              amount={amount}
              isPaid={item.isPaid}
              repeatNextMonth={item.repeatNextMonth}
              onMarkPaid={togglePaidStatus}
              onDelete={removeBudgetItem}
              onTap={onCategoryTap}
              isMonthPaid={isCategoryPaidForMonth(item.id, currentMonth)}
              onToggleMonthPaid={(id) => toggleCategoryPaidStatus(id, currentMonth)}
            />
          );
        })}
      </div>
    </div>
  );
}
