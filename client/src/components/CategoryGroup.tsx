import { useState, useMemo } from 'react';
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
  const { expectedSalary, getMonthlySalary, getMidMonthlySalary, getEndMonthlySalary, salaryFrequency, togglePaidStatus, removeBudgetItem, isCategoryPaidForMonth, toggleCategoryPaidStatus } = useSalary();

  const groupTotal = items.reduce((sum, item) => sum + item.percentage, 0);
  
  // Get the correct salary for calculation
  let baseSalary = expectedSalary;
  if (salaryFrequency === '2x') {
    // In 2x mode, check if items are for mid or end month
    const firstItemType = items[0]?.salaryType;
    if (firstItemType === 'mid') {
      baseSalary = getMidMonthlySalary(currentMonth) || 0;
    } else if (firstItemType === 'end') {
      baseSalary = getEndMonthlySalary(currentMonth) || 0;
    } else {
      // Mixed or no type specified, use total
      baseSalary = getMonthlySalary(currentMonth) || 0;
    }
  }
  
  const groupAmount = (baseSalary * groupTotal) / 100;

  // Sort items with useMemo to ensure proper re-rendering when paid status changes
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aIsPaid = isCategoryPaidForMonth(a.id, currentMonth);
      const bIsPaid = isCategoryPaidForMonth(b.id, currentMonth);
      // Unpaid items (false) come first, paid items (true) come last
      return aIsPaid === bIsPaid ? 0 : aIsPaid ? 1 : -1;
    });
  }, [items, currentMonth, isCategoryPaidForMonth]);

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
        {sortedItems.map((item) => {
          // Get the correct salary for this item's calculation
          let itemSalary = expectedSalary;
          if (salaryFrequency === '2x') {
            if (item.salaryType === 'mid') {
              itemSalary = getMidMonthlySalary(currentMonth) || 0;
            } else if (item.salaryType === 'end') {
              itemSalary = getEndMonthlySalary(currentMonth) || 0;
            } else {
              itemSalary = getMonthlySalary(currentMonth) || 0;
            }
          }
          const amount = (itemSalary * item.percentage) / 100;
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
