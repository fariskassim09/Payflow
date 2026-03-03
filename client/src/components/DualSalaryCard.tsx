import { Edit2 } from 'lucide-react';
import { useSalary } from '@/contexts/SalaryContext';

interface DualSalaryCardProps {
  onEditMid: () => void;
  onEditEnd: () => void;
  currentMonth?: Date;
}

export default function DualSalaryCard({ onEditMid, onEditEnd, currentMonth }: DualSalaryCardProps) {
  const { getMidMonthlySalary, getEndMonthlySalary, getBudgetsByGroup } = useSalary();
  const month = currentMonth || new Date(2026, 1);
  const midSalary = getMidMonthlySalary(month);
  const endSalary = getEndMonthlySalary(month);
  const totalSalary = midSalary + endSalary;

  // Get items for mid-month
  const midNeedsItems = getBudgetsByGroup('NEEDS', month, 'mid');
  const midWantsItems = getBudgetsByGroup('WANTS', month, 'mid');
  const midSavingsItems = getBudgetsByGroup('SAVINGS', month, 'mid');
  const midDebtsItems = getBudgetsByGroup('DEBTS', month, 'mid');
  const midItems = [...midNeedsItems, ...midWantsItems, ...midSavingsItems, ...midDebtsItems];
  const midTotalAllocated = midItems.reduce((sum, item) => sum + item.percentage, 0);
  const midAllocatedAmount = (midSalary * midTotalAllocated) / 100;
  const midRemainingAmount = midSalary - midAllocatedAmount;

  // Get items for end-month
  const endNeedsItems = getBudgetsByGroup('NEEDS', month, 'end');
  const endWantsItems = getBudgetsByGroup('WANTS', month, 'end');
  const endSavingsItems = getBudgetsByGroup('SAVINGS', month, 'end');
  const endDebtsItems = getBudgetsByGroup('DEBTS', month, 'end');
  const endItems = [...endNeedsItems, ...endWantsItems, ...endSavingsItems, ...endDebtsItems];
  const endTotalAllocated = endItems.reduce((sum, item) => sum + item.percentage, 0);
  const endAllocatedAmount = (endSalary * endTotalAllocated) / 100;
  const endRemainingAmount = endSalary - endAllocatedAmount;

  const totalRemaining = midRemainingAmount + endRemainingAmount;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Mid-Month Salary Card */}
      <div className="bg-gradient-to-br from-accent to-accent/80 rounded-3xl p-6 text-white relative overflow-hidden">
        <button
          onClick={onEditMid}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-300"
        >
          <Edit2 size={18} />
        </button>

        <p className="text-sm font-medium opacity-90 mb-2">Mid-Month Salary</p>
        <h2 className="text-3xl font-bold mb-4">RM {((midSalary || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>

        <div className="mb-4">
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${Math.min(midTotalAllocated, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-xs opacity-80 mb-1">Allocated</p>
            <p className="font-semibold">RM {((midAllocatedAmount || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-xs opacity-80 mb-1">Remaining</p>
            <p className="font-semibold">RM {((midRemainingAmount || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-xs opacity-80 mb-1">Allocated</p>
            <p className="font-semibold">{Math.round(midTotalAllocated)}%</p>
          </div>
        </div>
      </div>

      {/* End-Month Salary Card */}
      <div className="bg-gradient-to-br from-accent to-accent/80 rounded-3xl p-6 text-white relative overflow-hidden">
        <button
          onClick={onEditEnd}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-300"
        >
          <Edit2 size={18} />
        </button>

        <p className="text-sm font-medium opacity-90 mb-2">End-Month Salary</p>
        <h2 className="text-3xl font-bold mb-4">RM {((endSalary || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>

        <div className="mb-4">
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${Math.min(endTotalAllocated, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-xs opacity-80 mb-1">Allocated</p>
            <p className="font-semibold">RM {((endAllocatedAmount || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-xs opacity-80 mb-1">Remaining</p>
            <p className="font-semibold">RM {((endRemainingAmount || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-xs opacity-80 mb-1">Allocated</p>
            <p className="font-semibold">{Math.round(endTotalAllocated)}%</p>
          </div>
        </div>
      </div>

      {/* Total Summary */}
      <div className="bg-card border border-border rounded-3xl p-6 animate-fade-in">
        <p className="text-sm text-secondary-foreground mb-2">Total Monthly</p>
        <h3 className="text-2xl font-bold text-foreground mb-4">RM {((totalSalary || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-secondary-foreground mb-1">Total Remaining</p>
            <p className="text-lg font-semibold text-accent">RM {((totalRemaining || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-xs text-secondary-foreground mb-1">Total Allocated</p>
            <p className="text-lg font-semibold text-foreground">{Math.round((midTotalAllocated + endTotalAllocated) / 2)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
