import { ChevronRight } from 'lucide-react';
import { BudgetItem } from '@/contexts/SalaryContext';
import { useSalary } from '@/contexts/SalaryContext';

interface CategoryGroupProps {
  group: 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS';
  items: BudgetItem[];
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

export default function CategoryGroup({ group, items }: CategoryGroupProps) {
  const { expectedSalary } = useSalary();

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
            <div
              key={item.id}
              className="flex items-center justify-between bg-card rounded-2xl p-4 border border-border hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-foreground group-hover:text-accent transition-colors">
                    {item.name}
                  </p>
                  <p className="text-xs text-secondary-foreground">
                    {item.percentage}% of salary
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-semibold text-accent">
                    RM {amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <ChevronRight size={20} className="text-secondary-foreground group-hover:text-accent transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
