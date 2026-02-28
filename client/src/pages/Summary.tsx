import { useState } from 'react';
import { useSalary } from '@/contexts/SalaryContext';
import BottomNavigation from '@/components/BottomNavigation';

// Design Philosophy: Salary Allocation Planner
// - Single card layout with budget overview
// - Remaining amount highlighted in bright green
// - Group breakdown with icon, name, percentage, and amount
// - Support for 1x and 2x monthly salary with separate breakdowns

export default function Summary() {
  const { getMonthlySalary, getMidMonthlySalary, getEndMonthlySalary, getBudgetsByGroup, salaryFrequency } = useSalary();
  const [currentMonth] = useState(new Date(2026, 1)); // February 2026
  const monthlySalary = getMonthlySalary(currentMonth);
  const midSalary = getMidMonthlySalary(currentMonth);
  const endSalary = getEndMonthlySalary(currentMonth);

  const groups = [
    { name: 'Needs', icon: '🛒', key: 'NEEDS' as const },
    { name: 'Wants', icon: '🎉', key: 'WANTS' as const },
    { name: 'Debt', icon: '🏦', key: 'DEBTS' as const },
    { name: 'Savings', icon: '💰', key: 'SAVINGS' as const },
  ];

  const getGroupStats = (groupKey: 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS', salary?: number, salaryType?: 'full' | 'mid' | 'end') => {
    const items = getBudgetsByGroup(groupKey, currentMonth, salaryType);
    const percentage = items.reduce((sum, item) => sum + item.percentage, 0);
    const baseSalary = salary || monthlySalary;
    const amount = (baseSalary * percentage) / 100;
    return { percentage, amount };
  };

  const getTotalStats = (salary?: number, salaryType?: 'full' | 'mid' | 'end') => {
    return groups.reduce((sum, group) => {
      const stats = getGroupStats(group.key, salary, salaryType);
      return sum + stats.percentage;
    }, 0);
  };

  const getGroupColor = (groupKey: 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS') => {
    const colors: Record<string, string> = {
      NEEDS: '#3B82F6',
      WANTS: '#EC4899',
      SAVINGS: '#10B981',
      DEBTS: '#EF4444',
    };
    return colors[groupKey];
  };

  // 1x Salary Mode
  if (salaryFrequency === '1x') {
    const totalAllocated = getTotalStats(monthlySalary, 'full');
    const remainingAmount = monthlySalary - (monthlySalary * totalAllocated) / 100;

    return (
      <div className="min-h-screen bg-background text-foreground pb-24">
        {/* Main Content */}
        <main className="container mx-auto px-4 pt-8 max-w-2xl">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold">Summary</h1>
          </div>

          {/* Main Card */}
          <div className="bg-card border border-border rounded-3xl p-6 space-y-6 animate-fade-in">
            {/* Budget Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💰</span>
                <h2 className="text-lg font-semibold text-foreground">Budget</h2>
              </div>
              <p className="text-2xl font-bold text-accent">
                RM {((monthlySalary || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Remaining Section */}
            <div className="bg-secondary/30 rounded-2xl p-4 text-center space-y-2">
              <p className="text-sm text-secondary-foreground">Remaining</p>
              <p className="text-4xl font-bold" style={{ color: '#10B981' }}>
                RM {((remainingAmount || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Group Breakdown */}
            <div className="space-y-3">
              {groups.map((group) => {
                const stats = getGroupStats(group.key, monthlySalary, 'full');
                const color = getGroupColor(group.key);

                return (
                  <div key={group.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{group.icon}</span>
                      <div>
                        <p className="font-semibold text-foreground">{group.name}</p>
                        <p className="text-xs text-secondary-foreground">
                          {stats.percentage}% of salary
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-lg" style={{ color }}>
                      RM {((stats.amount || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
    );
  }

  // 2x Salary Mode
  const midTotalAllocated = getTotalStats(midSalary, 'mid');
  const midRemainingAmount = midSalary - (midSalary * midTotalAllocated) / 100;

  const endTotalAllocated = getTotalStats(endSalary, 'end');
  const endRemainingAmount = endSalary - (endSalary * endTotalAllocated) / 100;

  const totalRemaining = midRemainingAmount + endRemainingAmount;

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Main Content */}
      <main className="container mx-auto px-4 pt-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold">Summary</h1>
        </div>

        {/* Total Monthly Card */}
        <div className="bg-card border border-border rounded-3xl p-6 space-y-4 mb-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <h2 className="text-lg font-semibold text-foreground">Total Monthly</h2>
            </div>
            <p className="text-2xl font-bold text-accent">
              RM {((monthlySalary || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="h-px bg-border" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-secondary-foreground mb-1">Total Remaining</p>
              <p className="text-xl font-bold" style={{ color: '#10B981' }}>
                RM {((totalRemaining || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-xs text-secondary-foreground mb-1">Total Allocated</p>
              <p className="text-xl font-bold text-foreground">
                {((midTotalAllocated + endTotalAllocated) / 2).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Mid-Month Card */}
        <div className="bg-card border border-border rounded-3xl p-6 space-y-6 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {/* Budget Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📅</span>
              <h2 className="text-lg font-semibold text-foreground">Mid-Month</h2>
            </div>
            <p className="text-2xl font-bold text-accent">
              RM {((midSalary || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Remaining Section */}
          <div className="bg-secondary/30 rounded-2xl p-4 text-center space-y-2">
            <p className="text-sm text-secondary-foreground">Remaining</p>
            <p className="text-3xl font-bold" style={{ color: '#10B981' }}>
              RM {((midRemainingAmount || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Group Breakdown */}
          <div className="space-y-3">
            {groups.map((group) => {
              const stats = getGroupStats(group.key, midSalary, 'mid');
              const color = getGroupColor(group.key);

              if (stats.percentage === 0) return null;

              return (
                <div key={`mid-${group.key}`} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{group.icon}</span>
                    <div>
                      <p className="font-semibold text-foreground">{group.name}</p>
                      <p className="text-xs text-secondary-foreground">
                        {stats.percentage}% of salary
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-lg" style={{ color }}>
                    RM {((stats.amount || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* End-Month Card */}
        <div className="bg-card border border-border rounded-3xl p-6 space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {/* Budget Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📅</span>
              <h2 className="text-lg font-semibold text-foreground">End-Month</h2>
            </div>
            <p className="text-2xl font-bold text-accent">
              RM {((endSalary || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Remaining Section */}
          <div className="bg-secondary/30 rounded-2xl p-4 text-center space-y-2">
            <p className="text-sm text-secondary-foreground">Remaining</p>
            <p className="text-3xl font-bold" style={{ color: '#10B981' }}>
              RM {((endRemainingAmount || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Group Breakdown */}
          <div className="space-y-3">
            {groups.map((group) => {
              const stats = getGroupStats(group.key, endSalary, 'end');
              const color = getGroupColor(group.key);

              if (stats.percentage === 0) return null;

              return (
                <div key={`end-${group.key}`} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{group.icon}</span>
                    <div>
                      <p className="font-semibold text-foreground">{group.name}</p>
                      <p className="text-xs text-secondary-foreground">
                        {stats.percentage}% of salary
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-lg" style={{ color }}>
                    RM {((stats.amount || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
