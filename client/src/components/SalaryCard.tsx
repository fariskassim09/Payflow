import { Edit2 } from 'lucide-react';
import { useSalary } from '@/contexts/SalaryContext';

interface SalaryCardProps {
  onEditClick: () => void;
  currentMonth?: Date;
}

export default function SalaryCard({ onEditClick, currentMonth }: SalaryCardProps) {
  const { expectedSalary, budgetItems, getBudgetsByGroup, getMonthlySalary } = useSalary();
  const month = currentMonth || new Date(2026, 1);
  const monthlySalary = getMonthlySalary(month);

  // Get all items for current month
  const needsItems = getBudgetsByGroup('NEEDS', month);
  const wantsItems = getBudgetsByGroup('WANTS', month);
  const savingsItems = getBudgetsByGroup('SAVINGS', month);
  const debtsItems = getBudgetsByGroup('DEBTS', month);
  
  const monthlyItems = [...needsItems, ...wantsItems, ...savingsItems, ...debtsItems];
  const totalAllocated = monthlyItems.reduce((sum, item) => sum + item.percentage, 0);
  const allocatedAmount = (monthlySalary * totalAllocated) / 100;
  const remainingAmount = monthlySalary - allocatedAmount;
  const allocatedPercentage = totalAllocated;

  return (
    <div className="bg-gradient-to-br from-accent to-accent/80 rounded-3xl p-6 text-white relative overflow-hidden animate-fade-in">
      {/* Edit Button */}
      <button
        onClick={onEditClick}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-300"
      >
        <Edit2 size={18} />
      </button>

      {/* Title */}
      <p className="text-sm font-medium opacity-90 mb-2">Total Salary</p>

      {/* Amount */}
      <h2 className="text-4xl font-bold mb-6">RM {Math.round(monthlySalary || 0)}</h2>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-700"
            style={{ width: `${Math.min(allocatedPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs opacity-80 mb-1">Allocated</p>
          <p className="font-semibold">RM {Math.round(allocatedAmount || 0)}</p>
        </div>
        <div>
          <p className="text-xs opacity-80 mb-1">Remaining</p>
          <p className="font-semibold">RM {Math.round(remainingAmount || 0)}</p>
        </div>
        <div>
          <p className="text-xs opacity-80 mb-1">Percentage</p>
          <p className="font-semibold">{allocatedPercentage.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
}
