import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useSalary, BudgetItem } from '@/contexts/SalaryContext';
import { toast } from 'sonner';

interface CategoryDetailsModalProps {
  isOpen: boolean;
  categoryId: string | null;
  onClose: () => void;
  currentMonth?: Date;
}

const ICON_OPTIONS = [
  '🏠', '🚗', '🍔', '🍕', '📚', '💰', '💳', '🎮',
  '✈️', '👗', '💡', '🏆', '🎵', '🛒', '🍕', '☕',
  '🎁', '🏥', '👨‍👩‍👧', '🌿', '💼', '🏦', '📺', '🎯',
  '🛡️', '🔧', '🎓', '🌍', '💎', '📝', '💧', '⚡',
  '🚗', '✈️', '🔫', '⛽', '🚌', '🍔', '🏪', '🎨',
];

export default function CategoryDetailsModal({ isOpen, categoryId, onClose, currentMonth = new Date() }: CategoryDetailsModalProps) {
  const { budgetItems, updateBudgetItem, removeBudgetItem, expectedSalary, salaryFrequency, isCategoryPaidForMonth, toggleCategoryPaidStatus } = useSalary();
  const shouldShowSalaryType = salaryFrequency === '2x';
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [editAmount, setEditAmount] = useState<string>('');
  const [isEditingAmount, setIsEditingAmount] = useState(false);

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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim()) {
      handleUpdateCategory({ name: e.target.value });
    }
  };

  const handleAmountEdit = () => {
    setIsEditingAmount(true);
    setEditAmount(amount.toString());
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditAmount(e.target.value);
  };

  const handleAmountSave = () => {
    const newAmount = parseFloat(editAmount) || 0;
    if (newAmount >= 0 && expectedSalary > 0) {
      const newPercentage = (newAmount / expectedSalary) * 100;
      handleUpdateCategory({ percentage: Math.min(100, newPercentage) });
      setIsEditingAmount(false);
      toast.success('Amount updated');
    } else {
      toast.error('Invalid amount');
    }
  };

  const handleAmountCancel = () => {
    setIsEditingAmount(false);
    setEditAmount('');
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

        {/* Amount & Percentage */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-secondary-foreground mb-2 uppercase">
              Amount
            </label>
            {isEditingAmount ? (
              <input
                type="number"
                value={editAmount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                autoFocus
              />
            ) : (
              <button
                onClick={handleAmountEdit}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground font-semibold hover:bg-secondary/80 transition-all duration-300 text-left"
              >
                RM {(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </button>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-foreground mb-2 uppercase">
              Percentage
            </label>
            <div className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground font-semibold">
              {Math.round(category.percentage)}%
            </div>
          </div>
        </div>

        {/* Amount Edit Actions */}
        {isEditingAmount && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={handleAmountSave}
              className="flex-1 px-4 py-3 bg-accent text-accent-foreground rounded-xl hover:bg-accent/90 transition-all duration-300 font-medium"
            >
              Save
            </button>
            <button
              onClick={handleAmountCancel}
              className="flex-1 px-4 py-3 bg-secondary border border-border rounded-xl text-foreground hover:bg-secondary/80 transition-all duration-300 font-medium"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Group Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-secondary-foreground mb-3 uppercase">
            Category Group
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['NEEDS', 'WANTS', 'SAVINGS', 'DEBTS'] as const).map((group) => (
              <button
                key={group}
                onClick={() => handleUpdateCategory({ group })}
                className={`py-3 rounded-xl font-medium transition-all duration-300 ${
                  category.group === group
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-secondary border border-border text-foreground hover:border-accent'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* Salary Type Selection - Only show for 2x salary */}
        {shouldShowSalaryType && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary-foreground mb-3 uppercase">
              Deduct From
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['mid', 'end'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => handleUpdateCategory({ salaryType: type })}
                  className={`py-3 rounded-xl font-medium transition-all duration-300 ${
                    category.salaryType === type
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary border border-border text-foreground hover:border-accent'
                  }`}
                >
                  {type === 'mid' ? 'Mid-Month' : 'End-Month'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Status Toggles */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between bg-secondary/50 rounded-xl p-4">
            <span className="font-semibold text-foreground">Paid (This Month)</span>
            <button
              onClick={() => toggleCategoryPaidStatus(category.id, currentMonth)}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                isCategoryPaidForMonth(category.id, currentMonth) ? 'bg-accent' : 'bg-secondary'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-background rounded-full transition-all duration-300 ${
                  isCategoryPaidForMonth(category.id, currentMonth) ? 'right-1' : 'left-1'
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
