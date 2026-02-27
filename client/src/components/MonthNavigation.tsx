import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface MonthNavigationProps {
  onMonthChange?: (date: Date) => void;
  currentMonth?: Date;
}

export default function MonthNavigation({ onMonthChange, currentMonth: initialMonth }: MonthNavigationProps) {
  const [date, setDate] = useState(initialMonth || new Date(2026, 1)); // February 2026

  const monthYear = date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const handlePrevMonth = () => {
    const newDate = new Date(date.getFullYear(), date.getMonth() - 1);
    setDate(newDate);
    onMonthChange?.(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(date.getFullYear(), date.getMonth() + 1);
    setDate(newDate);
    onMonthChange?.(newDate);
  };

  return (
    <div className="flex items-center justify-between mb-8 animate-fade-in">
      <button
        onClick={handlePrevMonth}
        className="p-2 hover:bg-secondary rounded-lg transition-colors text-secondary-foreground hover:text-foreground"
      >
        <ChevronLeft size={24} />
      </button>
      <h1 className="text-2xl font-bold text-foreground">{monthYear}</h1>
      <button
        onClick={handleNextMonth}
        className="p-2 hover:bg-secondary rounded-lg transition-colors text-secondary-foreground hover:text-foreground"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
