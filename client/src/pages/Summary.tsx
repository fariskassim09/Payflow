import { useSalary } from '@/contexts/SalaryContext';
import BottomNavigation from '@/components/BottomNavigation';
import MonthNavigation from '@/components/MonthNavigation';

// Design Philosophy: Salary Allocation Planner
// - Group breakdown with percentage and amount
// - Visual cards for each group
// - Summary statistics

export default function Summary() {
  const { expectedSalary, getBudgetsByGroup } = useSalary();

  const groups = [
    { name: 'NEEDS', color: '#3B82F6', icon: '📋' },
    { name: 'WANTS', color: '#8B5CF6', icon: '🎉' },
    { name: 'SAVINGS', color: '#10B981', icon: '💰' },
    { name: 'DEBTS', color: '#F59E0B', icon: '💳' },
  ];

  const getGroupStats = (groupName: 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS') => {
    const items = getBudgetsByGroup(groupName);
    const percentage = items.reduce((sum, item) => sum + item.percentage, 0);
    const amount = (expectedSalary * percentage) / 100;
    return { percentage, amount, itemCount: items.length };
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Main Content */}
      <main className="container mx-auto px-4 pt-6 max-w-2xl">
        {/* Month Navigation */}
        <MonthNavigation />

        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold mb-2">Summary</h2>
          <p className="text-secondary-foreground">Breakdown by allocation group</p>
        </div>

        {/* Group Cards */}
        <div className="space-y-4 mb-12">
          {groups.map((group, index) => {
            const stats = getGroupStats(group.name as 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS');
            return (
              <div
                key={group.name}
                className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{group.icon}</span>
                    <div>
                      <h3 className="font-bold text-foreground">{group.name}</h3>
                      <p className="text-xs text-secondary-foreground">{stats.itemCount} items</p>
                    </div>
                  </div>
                  <div
                    className="w-1 h-12 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-secondary-foreground mb-1">Percentage</p>
                    <p className="text-2xl font-bold" style={{ color: group.color }}>
                      {stats.percentage}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-foreground mb-1">Amount</p>
                    <p className="text-2xl font-bold text-foreground">
                      RM {stats.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-1 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ backgroundColor: group.color, width: `${Math.min(stats.percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Summary */}
        <div className="bg-gradient-to-br from-accent to-accent/80 rounded-2xl p-6 text-white animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="text-sm opacity-90 mb-2">Total Allocated</p>
          <h3 className="text-3xl font-bold mb-4">
            {(() => {
              const total = groups.reduce((sum, group) => {
                const stats = getGroupStats(group.name as 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS');
                return sum + stats.percentage;
              }, 0);
              return total;
            })()}%
          </h3>
          <p className="text-sm opacity-90">
            RM {(() => {
              const total = groups.reduce((sum, group) => {
                const stats = getGroupStats(group.name as 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS');
                return sum + stats.amount;
              }, 0);
              return total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            })()}
          </p>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
