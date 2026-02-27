import { useState } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import { useSalary } from '@/contexts/SalaryContext';
import { Eye, EyeOff } from 'lucide-react';

// Design Philosophy: Salary Allocation Planner
// - Shared view for partners to see salary summary
// - Enter sharing code to view shared data
// - Read-only view of budget breakdown

export default function Shared() {
  const { expectedSalary, getBudgetsByGroup } = useSalary();
  const [shareCode, setShareCode] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [error, setError] = useState('');

  const groups = [
    { name: 'Needs', icon: '🛒', key: 'NEEDS' as const },
    { name: 'Wants', icon: '🎉', key: 'WANTS' as const },
    { name: 'Debt', icon: '🏦', key: 'DEBTS' as const },
    { name: 'Savings', icon: '💰', key: 'SAVINGS' as const },
  ];

  const getGroupStats = (groupKey: 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS') => {
    const items = getBudgetsByGroup(groupKey);
    const percentage = items.reduce((sum, item) => sum + item.percentage, 0);
    const amount = (expectedSalary * percentage) / 100;
    return { percentage, amount };
  };

  const totalAllocated = groups.reduce((sum, group) => {
    const stats = getGroupStats(group.key);
    return sum + stats.percentage;
  }, 0);

  const remainingAmount = expectedSalary - (expectedSalary * totalAllocated) / 100;

  const getGroupColor = (groupKey: 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS') => {
    const colors: Record<string, string> = {
      NEEDS: '#3B82F6',
      WANTS: '#EC4899',
      SAVINGS: '#10B981',
      DEBTS: '#EF4444',
    };
    return colors[groupKey];
  };

  const handleViewShared = () => {
    setError('');
    // Simple validation - in production, this would verify against actual shared codes
    if (shareCode.trim().startsWith('SP-')) {
      setIsShared(true);
    } else {
      setError('Invalid sharing code. Please check and try again.');
    }
  };

  const handleBackToInput = () => {
    setIsShared(false);
    setShareCode('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Main Content */}
      <main className="container mx-auto px-4 pt-8 max-w-2xl">
        {!isShared ? (
          // Input View
          <div className="animate-fade-in space-y-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">View Shared Summary</h1>
              <p className="text-secondary-foreground">Enter the sharing code to view your partner's salary summary</p>
            </div>

            {/* Input Card */}
            <div className="bg-card border border-border rounded-3xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-foreground mb-2 uppercase">
                  Sharing Code
                </label>
                <input
                  type="text"
                  value={shareCode}
                  onChange={(e) => setShareCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SP-ABC12345"
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder-secondary-foreground focus:outline-none focus:ring-2 focus:ring-accent font-mono text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleViewShared()}
                />
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <button
                onClick={handleViewShared}
                disabled={!shareCode.trim()}
                className="w-full px-4 py-3 bg-accent text-accent-foreground rounded-xl hover:bg-accent/90 transition-all duration-300 font-medium disabled:opacity-50 active:scale-95"
              >
                View Summary
              </button>
            </div>

            {/* Info Section */}
            <div className="bg-secondary/50 rounded-2xl p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">How it works:</p>
              <ul className="text-xs text-secondary-foreground space-y-1">
                <li>• Ask your partner for their sharing code</li>
                <li>• Enter the code above to view their salary allocation</li>
                <li>• You can see their budget breakdown by category</li>
                <li>• This is a read-only view</li>
              </ul>
            </div>
          </div>
        ) : (
          // Shared Summary View
          <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Shared Summary</h1>
                <p className="text-secondary-foreground">Code: {shareCode}</p>
              </div>
              <button
                onClick={handleBackToInput}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <Eye size={24} />
              </button>
            </div>

            {/* Main Card */}
            <div className="bg-card border border-border rounded-3xl p-6 space-y-6">
              {/* Budget Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  <h2 className="text-lg font-semibold text-foreground">Budget</h2>
                </div>
                <p className="text-2xl font-bold text-accent">
                  RM {expectedSalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Remaining Section */}
              <div className="bg-secondary/30 rounded-2xl p-4 text-center space-y-2">
                <p className="text-sm text-secondary-foreground">Remaining</p>
                <p className="text-4xl font-bold" style={{ color: '#10B981' }}>
                  RM {remainingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Group Breakdown */}
              <div className="space-y-3">
                {groups.map((group) => {
                  const stats = getGroupStats(group.key);
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
                        RM {stats.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={handleBackToInput}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground hover:bg-secondary/80 transition-all duration-300 font-medium"
            >
              Enter Different Code
            </button>

            {/* Info */}
            <div className="bg-secondary/50 rounded-2xl p-4 text-center">
              <p className="text-xs text-secondary-foreground">
                This is a read-only view of the shared salary allocation summary
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
