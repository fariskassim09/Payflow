import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import BottomNavigation from '@/components/BottomNavigation';
import SalaryHero from '@/components/SalaryHero';
import BudgetCard from '@/components/BudgetCard';
import { BarChart3, Zap, Utensils, Home, ShoppingBag, Heart, DollarSign } from 'lucide-react';

// Design Philosophy: Zen Minimalism with Breathing Space
// - Generous whitespace (48px section gaps)
// - Soft rounded cards (20px radius)
// - Neon green accents for healthy spending
// - Smooth fade-in animations

interface BudgetCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  budget: number;
  spent: number;
  color: string;
}

export default function Dashboard() {
  const [categories, setCategories] = useState<BudgetCategory[]>([
    {
      id: 'housing',
      name: 'Housing',
      icon: <Home size={24} />,
      budget: 1500,
      spent: 1500,
      color: 'accent',
    },
    {
      id: 'food',
      name: 'Food & Dining',
      icon: <Utensils size={24} />,
      budget: 600,
      spent: 480,
      color: 'accent',
    },
    {
      id: 'utilities',
      name: 'Utilities',
      icon: <Zap size={24} />,
      budget: 200,
      spent: 180,
      color: 'accent',
    },
    {
      id: 'shopping',
      name: 'Shopping',
      icon: <ShoppingBag size={24} />,
      budget: 400,
      spent: 520,
      color: 'warning',
    },
    {
      id: 'health',
      name: 'Health & Fitness',
      icon: <Heart size={24} />,
      budget: 150,
      spent: 120,
      color: 'accent',
    },
    {
      id: 'savings',
      name: 'Savings',
      icon: <DollarSign size={24} />,
      budget: 1050,
      spent: 1050,
      color: 'accent',
    },
  ]);

  const monthlySalary = 4500;
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remainingBalance = monthlySalary - totalSpent;

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Main Content */}
      <main className="container mx-auto px-4 pt-8 max-w-2xl">
        {/* Hero Section - Salary Display */}
        <div className="mb-12 animate-fade-in">
          <SalaryHero salary={monthlySalary} remaining={remainingBalance} />
        </div>

        {/* Budget Categories Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-foreground">Budget Categories</h2>
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <BudgetCard category={category} />
              </div>
            ))}
          </div>
        </div>

        {/* Summary Link */}
        <div className="mb-12 flex justify-center animate-fade-in" style={{ animationDelay: `${categories.length * 0.1}s` }}>
          <Link href="/summary">
            <a className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-2xl hover:glow-accent-subtle hover:bg-card/80 transition-all duration-300 text-foreground hover:text-accent active:scale-95">
              <BarChart3 size={20} />
              <span className="font-medium">View Summary</span>
            </a>
          </Link>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
