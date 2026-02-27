import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function MonthNavigation() {
  const [date, setDate] = useState(new Date(2026, 1)); // February 2026

  const monthYear = date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1));
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
