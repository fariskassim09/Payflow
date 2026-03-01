import { Edit2 } from 'lucide-react';
import { useSalary } from '@/contexts/SalaryContext';

interface CombinedSalaryCardProps {
  onEditMid: () => void;
  onEditEnd: () => void;
  currentMonth?: Date;
}

export default function CombinedSalaryCard({ onEditMid, onEditEnd, currentMonth }: CombinedSalaryCardProps) {
  const { expectedSalary, getMidMonthlySalary, getEndMonthlySalary, getMonthlySalary, getBudgetsByGroup } = useSalary();
  const month = currentMonth || new Date(2026, 1);
  const midSalary = getMidMonthlySalary(month);
  const endSalary = getEndMonthlySalary(month);
  const totalSalary = getMonthlySalary(month);

  // Get items for mid-month
  const midNeedsItems = getBudgetsByGroup('NEEDS', month, 'mid');
  const midWantsItems = getBudgetsByGroup('WANTS', month, 'mid');
  const midSavingsItems = getBudgetsByGroup('SAVINGS', month, 'mid');
  const midDebtsItems = getBudgetsByGroup('DEBTS', month, 'mid');
  const midItems = [...midNeedsItems, ...midWantsItems, ...midSavingsItems, ...midDebtsItems];
  const midAllocatedAmount = midItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  const midRemainingAmount = midSalary - midAllocatedAmount;
  const midAllocatedPercentage = midSalary > 0 ? (midAllocatedAmount / midSalary) * 100 : 0;

  // Get items for end-month
  const endNeedsItems = getBudgetsByGroup('NEEDS', month, 'end');
  const endWantsItems = getBudgetsByGroup('WANTS', month, 'end');
  const endSavingsItems = getBudgetsByGroup('SAVINGS', month, 'end');
  const endDebtsItems = getBudgetsByGroup('DEBTS', month, 'end');
  const endItems = [...endNeedsItems, ...endWantsItems, ...endSavingsItems, ...endDebtsItems];
  const endAllocatedAmount = endItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  const endRemainingAmount = endSalary - endAllocatedAmount;
  const endAllocatedPercentage = endSalary > 0 ? (endAllocatedAmount / endSalary) * 100 : 0;

  const totalRemaining = midRemainingAmount + endRemainingAmount;
  const avgAllocatedPercentage = (midAllocatedPercentage + endAllocatedPercentage) / 2;

  return (
    <div className="bg-gradient-to-br from-accent to-accent/80 rounded-3xl p-6 text-white relative overflow-hidden animate-fade-in">
      {/* Title */}
      <p className="text-sm font-medium opacity-90 mb-4">Total Salary</p>

      {/* Total Amount */}
      <h2 className="text-4xl font-bold mb-6">RM {Math.round(totalSalary || 0)}</h2>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-700"
            style={{ width: `${Math.min(avgAllocatedPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-xs opacity-80 mb-1">Allocated</p>
          <p className="font-semibold">RM {Math.round((midAllocatedAmount + endAllocatedAmount) || 0)}</p>
        </div>
        <div>
          <p className="text-xs opacity-80 mb-1">Remaining</p>
          <p className="font-semibold">RM {Math.round(totalRemaining || 0)}</p>
        </div>
        <div>
          <p className="text-xs opacity-80 mb-1">Percentage</p>
          <p className="font-semibold">{avgAllocatedPercentage.toFixed(2)}%</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/20 mb-6" />

      {/* Salary Cycles */}
      <div className="grid grid-cols-2 gap-4">
        {/* Mid-Month */}
        <div className="bg-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium opacity-80">Mid-Month</p>
            <button
              onClick={onEditMid}
              className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-300"
            >
              <Edit2 size={14} />
            </button>
          </div>
          <p className="text-lg font-bold mb-2">RM {Math.round(midSalary || 0)}</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between opacity-80">
              <span>Allocated:</span>
              <span>RM {Math.round(midAllocatedAmount || 0)}</span>
            </div>
            <div className="flex justify-between opacity-80">
              <span>Remaining:</span>
              <span>RM {Math.round(midRemainingAmount || 0)}</span>
            </div>
            <div className="flex justify-between opacity-80">
              <span>Allocated:</span>
              <span>{midAllocatedPercentage.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* End-Month */}
        <div className="bg-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium opacity-80">End-Month</p>
            <button
              onClick={onEditEnd}
              className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-300"
            >
              <Edit2 size={14} />
            </button>
          </div>
          <p className="text-lg font-bold mb-2">RM {Math.round(endSalary || 0)}</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between opacity-80">
              <span>Allocated:</span>
              <span>RM {Math.round(endAllocatedAmount || 0)}</span>
            </div>
            <div className="flex justify-between opacity-80">
              <span>Remaining:</span>
              <span>RM {Math.round(endRemainingAmount || 0)}</span>
            </div>
            <div className="flex justify-between opacity-80">
              <span>Allocated:</span>
              <span>{endAllocatedPercentage.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
