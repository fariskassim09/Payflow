import { useState, useRef } from 'react';
import { Trash2, CheckCircle2, Circle } from 'lucide-react';
import { toast } from 'sonner';

interface SwipeableCategoryProps {
  id: string;
  icon: string;
  name: string;
  percentage: number;
  amount: number;
  isPaid?: boolean;
  onMarkPaid?: (id: string, paid: boolean) => void;
  onDelete?: (id: string) => void;
}

export default function SwipeableCategory({
  id,
  icon,
  name,
  percentage,
  amount,
  isPaid = false,
  onMarkPaid,
  onDelete,
}: SwipeableCategoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (diff > 50) {
      // Swiped left
      setIsOpen(true);
    } else if (diff < -50) {
      // Swiped right
      setIsOpen(false);
    }
  };

  const handleMarkPaid = () => {
    if (onMarkPaid) {
      onMarkPaid(id, !isPaid);
      toast.success(isPaid ? 'Marked as unpaid' : 'Marked as paid');
      setIsOpen(false);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
      toast.success('Category deleted');
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Hidden action buttons */}
      <div className="absolute inset-0 flex items-center justify-end gap-2 bg-destructive/10 px-4 z-0">
        <button
          onClick={handleMarkPaid}
          className="flex items-center gap-2 px-3 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all duration-300 text-sm font-medium"
        >
          {isPaid ? <Circle size={18} /> : <CheckCircle2 size={18} />}
          {isPaid ? 'Unpaid' : 'Paid'}
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-3 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all duration-300 text-sm font-medium"
        >
          <Trash2 size={18} />
          Delete
        </button>
      </div>

      {/* Main content */}
      <div
        className={`bg-card border border-border p-4 flex items-center justify-between transition-all duration-300 ${
          isOpen ? 'translate-x-[-140px]' : 'translate-x-0'
        }`}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className={`text-2xl ${isPaid ? 'opacity-50' : ''}`}>{icon}</div>
          <div className="flex-1">
            <p className={`font-semibold ${isPaid ? 'line-through opacity-50' : 'text-foreground'}`}>
              {name}
            </p>
            <p className="text-xs text-secondary-foreground">{percentage}% of salary</p>
          </div>
        </div>
        <p className={`font-bold text-lg ${isPaid ? 'opacity-50' : 'text-accent'}`}>
          RM {amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Close button when open */}
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 z-10"
          aria-label="Close actions"
        />
      )}
    </div>
  );
}
