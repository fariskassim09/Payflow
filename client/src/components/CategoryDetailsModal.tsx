import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useSalary, BudgetItem } from '@/contexts/SalaryContext';
import { toast } from 'sonner';

interface CategoryDetailsModalProps {
  isOpen: boolean;
  categoryId: string | null;
  onClose: () => void;
}

const ICON_OPTIONS = [
  '🏠', '🚗', '🍔', '🍕', '📚', '💰', '💳', '🎮',
  '✈️', '👗', '💡', '🏆', '🎵', '🛒', '🍕', '☕',
  '🎁', '🏥', '👨‍👩‍👧', '🌿', '💼', '🏦', '📺', '🎯',
  '🛡️', '🔧', '🎓', '🌍', '💎', '📝', '💧', '⚡',
  '🚗', '✈️', '🔫', '⛽', '🚌', '🍔', '🏪', '🎨',
];

export default function CategoryDetailsModal({ isOpen, categoryId, onClose }: CategoryDetailsModalProps) {
  const { budgetItems, updateBudgetItem, removeBudgetItem, expectedSalary } = useSalary();
  const [showIconPicker, setShowIconPicker] = useState(false);

  const category = categoryId ? budgetItems.find(item => item.id === categoryId) : null;

  if (!isOpen || !category) return null;

  const amount = (expectedSalary * category.percentage) / 100;

  const handleUpdateCategory = (updates: Partial<BudgetItem>) => {
    updateBudgetItem(category.id, updates);
    toast.success('Category updated');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this category?')) {
      removeBudgetItem(category.id);
      toast.success('Category deleted');
      onClose();
    }
  };

  const handleIconSelect = (icon: string) => {
    handleUpdateCategory({ icon });
    setShowIconPicker(false);
  };

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percentage = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
    handleUpdateCategory({ percentage });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim()) {
      handleUpdateCategory({ name: e.target.value });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50">
      <div className="bg-card w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Category Details</h2>
          <button
            onClick={onClose}
            className="text-secondary-foreground hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Icon Display */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowIconPicker(!showIconPicker)}
            className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center text-4xl hover:bg-secondary/80 transition-all duration-300"
          >
            {category.icon}
          </button>
        </div>

        {/* Icon Picker */}
        {showIconPicker && (
          <div className="bg-secondary/30 rounded-2xl p-4 mb-6 grid grid-cols-8 gap-2">
            {ICON_OPTIONS.map((icon) => (
              <button
                key={icon}
                onClick={() => handleIconSelect(icon)}
                className="p-2 bg-secondary rounded-lg hover:bg-accent/20 transition-all duration-300 text-2xl"
              >
                {icon}
              </button>
            ))}
          </div>
        )}

        {/* Category Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-secondary-foreground mb-2 uppercase">
            Category Name
          </label>
          <input
            type="text"
            value={category.name}
            onChange={handleNameChange}
            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Percentage & Amount */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-secondary-foreground mb-2 uppercase">
              Percentage
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={category.percentage}
                onChange={handlePercentageChange}
                min="0"
                max="100"
                className="flex-1 bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <span className="text-foreground font-semibold">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-foreground mb-2 uppercase">
              Amount
            </label>
            <div className="bg-secondary border border-border rounded-xl px-4 py-3 text-foreground font-semibold">
              RM {amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Group Info */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-secondary-foreground mb-2 uppercase">
            Group
          </label>
          <div className="bg-secondary border border-border rounded-xl px-4 py-3 text-foreground font-semibold">
            {category.group}
          </div>
        </div>

        {/* Status Toggles */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between bg-secondary/50 rounded-xl p-4">
            <span className="font-semibold text-foreground">Paid</span>
            <button
              onClick={() => handleUpdateCategory({ isPaid: !category.isPaid })}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                category.isPaid ? 'bg-accent' : 'bg-secondary'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-background rounded-full transition-all duration-300 ${
                  category.isPaid ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between bg-secondary/50 rounded-xl p-4">
            <span className="font-semibold text-foreground">Repeat Next Month</span>
            <button
              onClick={() => handleUpdateCategory({ repeatNextMonth: !category.repeatNextMonth })}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                category.repeatNextMonth ? 'bg-accent' : 'bg-secondary'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-background rounded-full transition-all duration-300 ${
                  category.repeatNextMonth ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl hover:bg-destructive/20 transition-all duration-300 font-medium mb-4"
        >
          <Trash2 size={18} />
          Delete Category
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground hover:bg-secondary/80 transition-all duration-300 font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
}
