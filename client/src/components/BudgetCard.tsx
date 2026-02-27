import { ReactNode } from 'react';

interface BudgetCardProps {
  category: {
    id: string;
    name: string;
    icon: ReactNode;
    budget: number;
    spent: number;
    color: string;
  };
}

// Design Philosophy: Zen Minimalism with Breathing Space
// - Dark card background (#1A1A1A) with subtle border
// - Rounded corners (20px)
// - Thin progress bar (4-6px)
// - Neon green for healthy, red for overspending
// - Smooth progress animation (0.8s)

export default function BudgetCard({ category }: BudgetCardProps) {
  const percentage = (category.spent / category.budget) * 100;
  const isOverBudget = category.spent > category.budget;
  const remaining = category.budget - category.spent;

  const getProgressColor = () => {
    if (isOverBudget) return 'bg-destructive';
    if (percentage > 80) return 'bg-yellow-500';
    return 'bg-accent';
  };

  return (
    <div className="budget-card group hover:shadow-lg hover:shadow-accent/10 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="text-accent group-hover:scale-110 transition-transform duration-300">
            {category.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors duration-300">
              {category.name}
            </h3>
            <p className="text-xs text-secondary-foreground">
              {isOverBudget
                ? `Over by RM ${Math.abs(remaining).toLocaleString()}`
                : `RM ${remaining.toLocaleString()} left`}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-foreground">
            RM {category.spent.toLocaleString()}
          </p>
          <p className="text-xs text-secondary-foreground">
            / RM {category.budget.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="budget-progress">
        <div
          className={`budget-progress-bar ${getProgressColor()} ${
            isOverBudget ? 'danger' : percentage > 80 ? 'warning' : ''
          }`}
          style={{
            width: `${Math.min(percentage, 100)}%`,
          }}
        />
      </div>

      {/* Percentage */}
      <div className="mt-2 flex justify-between items-center">
        <span className="text-xs text-secondary-foreground">
          {Math.round(percentage)}% spent
        </span>
        {isOverBudget && (
          <span className="text-xs text-destructive font-medium">Over budget</span>
        )}
      </div>
    </div>
  );
}
