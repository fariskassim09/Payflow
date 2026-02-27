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
  repeatNextMonth?: boolean;
  onMarkPaid?: (id: string) => void;
  onDelete?: (id: string) => void;
  onTap?: (id: string) => void;
}

export default function SwipeableCategory({
  id,
  icon,
  name,
  percentage,
  amount,
  isPaid = false,
  repeatNextMonth = false,
  onMarkPaid,
  onDelete,
  onTap,
}: SwipeableCategoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsSwiping(false);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      setIsSwiping(true);
      if (diff > 50) {
        // Swiped left
        setIsOpen(true);
      } else if (diff < -50) {
        // Swiped right
        setIsOpen(false);
      }
    }
  };

  const handleClick = () => {
    // Only trigger tap if not swiping
    if (!isSwiping && !isOpen && onTap) {
      onTap(id);
    }
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const handleMarkPaid = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMarkPaid) {
      onMarkPaid(id);
      toast.success(isPaid ? 'Marked as unpaid' : 'Marked as paid');
      setIsOpen(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
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
      {/* Main content - slides left when open */}
      <div
        ref={contentRef}
        className={`bg-card border border-border p-4 flex items-center justify-between transition-all duration-300 relative z-10 cursor-pointer ${
          isOpen ? 'translate-x-[-160px]' : 'translate-x-0'
        }`}
        onClick={handleClick}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className={`text-2xl ${isPaid ? 'opacity-50' : ''}`}>{icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className={`font-semibold ${isPaid ? 'line-through opacity-50' : 'text-foreground'}`}>
                {name}
              </p>
              {isPaid && <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">✓ Paid</span>}
              {repeatNextMonth && <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">↻ Repeat</span>}
            </div>
            <p className="text-xs text-secondary-foreground">{percentage}% of salary</p>
          </div>
        </div>
        <p className={`font-bold text-lg ${isPaid ? 'opacity-50' : 'text-accent'}`}>
          RM {amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Hidden action buttons - visible when swiped */}
      <div className="absolute inset-0 flex items-center justify-end gap-2 bg-secondary/20 px-2 z-0">
        <button
          onClick={handleMarkPaid}
          className="flex items-center gap-1 px-2 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all duration-300 text-xs font-medium whitespace-nowrap"
        >
          {isPaid ? <Circle size={16} /> : <CheckCircle2 size={16} />}
          {isPaid ? 'Unpaid' : 'Paid'}
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1 px-2 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all duration-300 text-xs font-medium whitespace-nowrap"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>

      {/* Close button when open */}
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 z-20"
          aria-label="Close actions"
        />
      )}
    </div>
  );
}
