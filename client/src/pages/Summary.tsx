import { useState } from 'react';
import { useSalary } from '@/contexts/SalaryContext';
import BottomNavigation from '@/components/BottomNavigation';

// Design Philosophy: Salary Allocation Planner
// - Single card layout with budget overview
// - Remaining amount highlighted in bright green
// - Group breakdown with icon, name, percentage, and amount
// - Support for 1x and 2x monthly salary with separate breakdowns
// - Month navigation to view different months
// - Click on group to see detailed breakdown

export default function Summary() {
  const { getMonthlySalary, getMidMonthlySalary, getEndMonthlySalary, getBudgetsByGroup, salaryFrequency, isMonthPaid } = useSalary();
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth());
  });
  const [selectedGroup, setSelectedGroup] = useState<'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS' | null>(null);

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const monthPaid = isMonthPaid(currentMonth);
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
    return { percentage, amount, items };
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
    const totalAllocated = getTotalStats(monthlySalary, undefined);
    const remainingAmount = monthlySalary - (monthlySalary * totalAllocated) / 100;

    return (
      <div className="min-h-screen bg-background text-foreground pb-24">
        {/* Main Content */}
        <main className="container mx-auto px-4 pt-8 max-w-2xl">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">Summary</h1>
            </div>
            {/* Month Navigation */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePreviousMonth}
                className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground hover:border-accent transition-colors font-medium"
              >
                ← Previous
              </button>
              <span className="text-sm font-semibold text-secondary-foreground">{monthName}</span>
              <button
                onClick={handleNextMonth}
                className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground hover:border-accent transition-colors font-medium"
              >
                Next →
              </button>
            </div>
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
                RM {((monthlySalary || 0)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Remaining Section */}
            <div className="bg-secondary/30 rounded-2xl p-4 text-center space-y-2">
              <p className="text-sm text-secondary-foreground">Remaining</p>
              <p className="text-4xl font-bold" style={{ color: '#10B981' }}>
                RM {((remainingAmount || 0)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Group Breakdown */}
            <div className="space-y-3">
              {groups.map((group) => {
                const stats = getGroupStats(group.key, monthlySalary, undefined);
                const color = getGroupColor(group.key);

                return (
                  <button
                    key={group.key}
                    onClick={() => setSelectedGroup(group.key)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{group.icon}</span>
                      <div>
                        <p className="font-semibold text-foreground">{group.name}</p>
                        <p className="text-xs text-secondary-foreground">
                          {stats.percentage.toFixed(2)}% of salary
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-lg" style={{ color }}>
                      RM {((stats.amount || 0)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </main>

        {/* Detail Modal */}
        {selectedGroup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-[60]">
            <div className="bg-card w-full rounded-t-3xl flex flex-col max-h-[80vh] animate-fade-in">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-2xl font-bold text-foreground">
                  {groups.find(g => g.key === selectedGroup)?.name} Details
                </h2>
                <button
                  onClick={() => setSelectedGroup(null)}
                  className="text-secondary-foreground hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto flex-1 p-6">
                <div className="space-y-3">
                  {getGroupStats(selectedGroup, monthlySalary, undefined).items.length > 0 ? (
                    getGroupStats(selectedGroup, monthlySalary, undefined).items.map((item) => {
                      const itemAmount = (item.percentage * monthlySalary) / 100;
                      return (
                        <div key={item.id} className="bg-secondary/50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{item.icon}</span>
                              <p className="font-semibold text-foreground">{item.name}</p>
                            </div>
                            <p className="font-bold text-accent">
                              RM {itemAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </p>
                          </div>
                          <p className="text-xs text-secondary-foreground">
                            {item.percentage.toFixed(2)}% of salary
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-secondary-foreground py-8">No items in this category</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

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
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Summary</h1>
          </div>
          {/* Month Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePreviousMonth}
              className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground hover:border-accent transition-colors font-medium"
            >
              ← Previous
            </button>
            <span className="text-sm font-semibold text-secondary-foreground">{monthName}</span>
            <button
              onClick={handleNextMonth}
              className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground hover:border-accent transition-colors font-medium"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Total Card */}
        <div className="bg-card border border-border rounded-3xl p-6 space-y-6 mb-6 animate-fade-in">
          {/* Budget Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <h2 className="text-lg font-semibold text-foreground">Total Budget</h2>
            </div>
            <p className="text-2xl font-bold text-accent">
              RM {((monthlySalary || 0)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="h-px bg-border" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-secondary-foreground mb-1">Total Remaining</p>
              <p className="text-xl font-bold" style={{ color: '#10B981' }}>
                RM {((totalRemaining || 0)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
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
              RM {((midSalary || 0)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Remaining Section */}
          <div className="bg-secondary/30 rounded-2xl p-4 text-center space-y-2">
            <p className="text-sm text-secondary-foreground">Remaining</p>
            <p className="text-3xl font-bold" style={{ color: '#10B981' }}>
              RM {((midRemainingAmount || 0)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Group Breakdown */}
          <div className="space-y-3">
            {groups.map((group) => {
              const stats = getGroupStats(group.key, midSalary, 'mid');
              const color = getGroupColor(group.key);

              return (
                <button
                  key={`mid-${group.key}`}
                  onClick={() => setSelectedGroup(group.key)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-left"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{group.icon}</span>
                    <div>
                      <p className="font-semibold text-foreground">{group.name}</p>
                      <p className="text-xs text-secondary-foreground">
                        {stats.percentage.toFixed(2)}% of salary
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-lg" style={{ color }}>
                    RM {((stats.amount || 0)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                </button>
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
              RM {((endSalary || 0)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Remaining Section */}
          <div className="bg-secondary/30 rounded-2xl p-4 text-center space-y-2">
            <p className="text-sm text-secondary-foreground">Remaining</p>
            <p className="text-3xl font-bold" style={{ color: '#10B981' }}>
              RM {((endRemainingAmount || 0)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Group Breakdown */}
          <div className="space-y-3">
            {groups.map((group) => {
              const stats = getGroupStats(group.key, endSalary, 'end');
              const color = getGroupColor(group.key);

              return (
                <button
                  key={`end-${group.key}`}
                  onClick={() => setSelectedGroup(group.key)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-left"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{group.icon}</span>
                    <div>
                      <p className="font-semibold text-foreground">{group.name}</p>
                      <p className="text-xs text-secondary-foreground">
                        {stats.percentage.toFixed(2)}% of salary
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-lg" style={{ color }}>
                    RM {((stats.amount || 0)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-[60]">
          <div className="bg-card w-full rounded-t-3xl flex flex-col max-h-[80vh] animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-bold text-foreground">
                {groups.find(g => g.key === selectedGroup)?.name} Details
              </h2>
              <button
                onClick={() => setSelectedGroup(null)}
                className="text-secondary-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 p-6">
              <div className="space-y-3">
                {getGroupStats(selectedGroup, midSalary, 'mid').items.map((item) => (
                  <div key={item.id} className="bg-secondary/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.icon}</span>
                        <p className="font-semibold text-foreground">{item.name}</p>
                      </div>
                      <p className="font-bold text-accent">
                        RM {((item.percentage * midSalary) / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <p className="text-xs text-secondary-foreground">
                      {item.percentage.toFixed(2)}% of salary
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
