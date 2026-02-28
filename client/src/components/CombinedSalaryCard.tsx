import { Edit2 } from 'lucide-react';
import { useSalary } from '@/contexts/SalaryContext';

interface CombinedSalaryCardProps {
  onEditMid: () => void;
  onEditEnd: () => void;
  currentMonth?: Date;
}

export default function CombinedSalaryCard({ onEditMid, onEditEnd, currentMonth }: CombinedSalaryCardProps) {
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
  const avgAllocatedPercentage = (midTotalAllocated + endTotalAllocated) / 2;

  return (
    <div className="bg-gradient-to-br from-accent to-accent/80 rounded-3xl p-6 text-white relative overflow-hidden animate-fade-in">
      {/* Title */}
      <p className="text-sm font-medium opacity-90 mb-4">Expected Salary</p>

      {/* Total Amount */}
      <h2 className="text-4xl font-bold mb-6">RM {((totalSalary || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>

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
          <p className="font-semibold">RM {(midAllocatedAmount + endAllocatedAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div>
          <p className="text-xs opacity-80 mb-1">Remaining</p>
          <p className="font-semibold">RM {((totalRemaining || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div>
          <p className="text-xs opacity-80 mb-1">Allocated</p>
          <p className="font-semibold">{avgAllocatedPercentage.toFixed(1)}%</p>
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
          <p className="text-lg font-bold mb-2">RM {((midSalary || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between opacity-80">
              <span>Allocated:</span>
              <span>RM {((midAllocatedAmount || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between opacity-80">
              <span>Remaining:</span>
              <span>RM {((midRemainingAmount || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between opacity-80">
              <span>Allocated:</span>
              <span>{midTotalAllocated}%</span>
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
          <p className="text-lg font-bold mb-2">RM {((endSalary || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between opacity-80">
              <span>Allocated:</span>
              <span>RM {((endAllocatedAmount || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between opacity-80">
              <span>Remaining:</span>
              <span>RM {((endRemainingAmount || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between opacity-80">
              <span>Allocated:</span>
              <span>{endTotalAllocated}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
