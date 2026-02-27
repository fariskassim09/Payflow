import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import BottomNavigation from '@/components/BottomNavigation';

// Design Philosophy: Zen Minimalism with Breathing Space
// - Monochrome donut chart with neon green highlights
// - Animated count-up numbers
// - Generous spacing and breathing room
// - Minimal visual approach with thin lines

export default function Summary() {
  const [categories] = useState([
    { name: 'Housing', value: 1500, color: '#666666' },
    { name: 'Food & Dining', value: 480, color: '#A0A0A0' },
    { name: 'Utilities', value: 180, color: '#666666' },
    { name: 'Shopping', value: 520, color: '#A0A0A0' },
    { name: 'Health & Fitness', value: 120, color: '#666666' },
    { name: 'Savings', value: 1050, color: '#00FF88' },
  ]);

  const totalSpent = categories.reduce((sum, cat) => sum + cat.value, 0);
  const monthlySalary = 4500;
  const savingsRate = ((categories.find(c => c.name === 'Savings')?.value || 0) / monthlySalary * 100).toFixed(1);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-2xl p-3 text-xs text-foreground shadow-lg shadow-accent/20">
          <p className="font-semibold text-accent">{payload[0].name}</p>
          <p className="text-foreground mt-1">RM {payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Main Content */}
      <main className="container mx-auto px-4 pt-8 max-w-2xl">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Financial Summary</h1>
          <p className="text-secondary-foreground">Overview of your monthly spending</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          <div className="bg-card rounded-3xl p-6 border border-border animate-fade-in hover:shadow-lg hover:shadow-accent/10 transition-all duration-300">
            <p className="text-secondary-foreground text-sm mb-2">Total Spent</p>
            <p className="text-3xl font-bold text-foreground">
              RM {totalSpent.toLocaleString()}
            </p>
            <p className="text-xs text-secondary-foreground mt-2">
              {((totalSpent / monthlySalary) * 100).toFixed(1)}% of salary
            </p>
          </div>

          <div className="bg-card rounded-3xl p-6 border border-border animate-fade-in hover:shadow-lg hover:shadow-accent/10 transition-all duration-300" style={{ animationDelay: '0.1s' }}>
            <p className="text-secondary-foreground text-sm mb-2">Savings Rate</p>
            <p className="text-3xl font-bold text-accent">
              {savingsRate}%
            </p>
            <p className="text-xs text-secondary-foreground mt-2">
              RM {(categories.find(c => c.name === 'Savings')?.value || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-card rounded-3xl p-8 border border-border mb-12 animate-fade-in hover:shadow-lg hover:shadow-accent/10 transition-all duration-300" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-bold mb-8">Spending Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry: any) => (
                  <span className="text-xs text-secondary-foreground">
                    {entry.payload.name}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-xl font-bold mb-6">Category Breakdown</h2>
          <div className="space-y-3">
            {categories.map((category, index) => (
              <div
                key={category.name}
                className="flex items-center justify-between bg-card rounded-2xl p-4 border border-border hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${0.35 + index * 0.05}s` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium text-foreground">{category.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    RM {category.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-secondary-foreground">
                    {((category.value / totalSpent) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
