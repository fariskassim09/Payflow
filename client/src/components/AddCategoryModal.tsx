import { useState } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { useSalary } from '@/contexts/SalaryContext';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICON_OPTIONS = [
  '🏠', '🚗', '🍔', '🍕', '📚', '💰', '💳', '🎮',
  '✈️', '👗', '💡', '🏆', '🎵', '🛒', '🍕', '☕',
  '🎁', '🏥', '👨‍👩‍👧', '🌿', '💼', '🏦', '📺', '🎯',
  '🛡️', '🔧', '🎓', '🌍', '💎', '📝', '💧', '⚡',
  '🚗', '✈️', '🔫', '⛽', '🚌', '🍔', '🏪', '🎨',
];

const COLOR_OPTIONS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
  '#6366F1', '#84CC16',
];

export default function AddCategoryModal({ isOpen, onClose }: AddCategoryModalProps) {
  const { addBudgetItem, expectedSalary, salaryFrequency } = useSalary();
  const [step, setStep] = useState<'form' | 'icons' | 'colors'>('form');
  const shouldShowSalaryType = salaryFrequency === '2x';
  const [formData, setFormData] = useState({
    name: '',
    amount: 0,
    group: 'NEEDS' as 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS',
    icon: '🏠',
    color: '#3B82F6',
    repeatNextMonth: true,
    markAsPaid: false,
    salaryType: 'mid' as 'mid' | 'end',
  });

  const handleAddCategory = () => {
    if (!formData.name.trim()) {
      alert('Please enter a category name');
      return;
    }
    if (formData.amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (expectedSalary <= 0) {
      alert('Please set your expected salary first');
      return;
    }
    if (formData.amount > expectedSalary) {
      alert(`Category amount (RM ${formData.amount.toFixed(2)}) cannot exceed expected salary (RM ${expectedSalary.toFixed(2)})`);
      return;
    }
    
    const percentage = (formData.amount / expectedSalary) * 100;
    const newCategory = {
      id: `custom-${Date.now()}`,
      name: formData.name,
      icon: formData.icon,
      percentage: percentage,
      group: formData.group,
    };
    addBudgetItem(newCategory);
    onClose();
      setFormData({
        name: '',
        amount: 0,
        group: 'NEEDS',
        icon: '🏠',
        color: '#3B82F6',
        repeatNextMonth: true,
        markAsPaid: false,
        salaryType: 'mid',
      });
      setStep('form');
    }
  };

  if (!isOpen) return null;

  const percentage = expectedSalary > 0 ? (formData.amount / expectedSalary) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-[60]">
      <div className="bg-card w-full rounded-t-3xl flex flex-col max-h-[85vh] animate-fade-in">
        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 pb-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {step !== 'form' && (
            <button
              onClick={() => setStep('form')}
              className="text-secondary-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          {step === 'form' && <div />}
          <h2 className="text-2xl font-bold text-foreground">Add Category</h2>
          <button
            onClick={onClose}
            className="text-secondary-foreground hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form View */}
        {step === 'form' && (
          <div className="space-y-6">
            {/* Category Name */}
            <div>
              <label className="block text-sm font-medium text-secondary-foreground mb-2 uppercase">
                Category Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rent, Groceries, Savings..."
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder-secondary-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Budget Amount */}
            <div>
              <label className="block text-sm font-medium text-secondary-foreground mb-2 uppercase">
                Budget Amount
              </label>
              <div className="flex items-center gap-2 bg-secondary border border-border rounded-xl px-4 py-3">
                <span className="text-accent font-semibold">RM</span>
                <input
                  type="number"
                  value={formData.amount === 0 ? '' : formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="flex-1 bg-transparent text-foreground placeholder-secondary-foreground focus:outline-none"
                  step="0.01"
                />
              </div>
              <p className="text-xs text-secondary-foreground mt-2">
                {percentage.toFixed(2)}% of salary (RM {(formData.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
              </p>
            </div>

            {/* Category Group */}
            <div>
              <label className="block text-sm font-medium text-secondary-foreground mb-3 uppercase">
                Category Group
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['NEEDS', 'WANTS', 'SAVINGS', 'DEBTS'] as const).map((group) => (
                  <button
                    key={group}
                    onClick={() => setFormData({ ...formData, group })}
                    className={`py-3 rounded-xl font-medium transition-all duration-300 ${
                      formData.group === group
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
              <div>
                <label className="block text-sm font-medium text-secondary-foreground mb-3 uppercase">
                  Deduct From
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['mid', 'end'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, salaryType: type })}
                      className={`py-3 rounded-xl font-medium transition-all duration-300 ${
                        formData.salaryType === type
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

            {/* Icon Selector */}
            <div>
              <label className="block text-sm font-medium text-secondary-foreground mb-3 uppercase">
                Icon
              </label>
              <button
                onClick={() => setStep('icons')}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground hover:border-accent transition-colors text-left"
              >
                {formData.icon} Select Icon
              </button>
            </div>

            {/* Color Selector */}
            <div>
              <label className="block text-sm font-medium text-secondary-foreground mb-3 uppercase">
                Color
              </label>
              <button
                onClick={() => setStep('colors')}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground hover:border-accent transition-colors text-left flex items-center gap-2"
              >
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: formData.color }}
                />
                Select Color
              </button>
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-secondary/50 rounded-xl p-4">
                <div>
                  <p className="font-medium text-foreground">Repeat to Next Month</p>
                  <p className="text-xs text-secondary-foreground">Auto-copy this category every month</p>
                </div>
                <button
                  onClick={() => setFormData({ ...formData, repeatNextMonth: !formData.repeatNextMonth })}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                    formData.repeatNextMonth ? 'bg-accent' : 'bg-secondary'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-background rounded-full transition-all duration-300 ${
                      formData.repeatNextMonth ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between bg-secondary/50 rounded-xl p-4">
                <div>
                  <p className="font-medium text-foreground">Mark as Paid</p>
                  <p className="text-xs text-secondary-foreground">Transaction completed ✓</p>
                </div>
                <button
                  onClick={() => setFormData({ ...formData, markAsPaid: !formData.markAsPaid })}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                    formData.markAsPaid ? 'bg-accent' : 'bg-secondary'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-background rounded-full transition-all duration-300 ${
                      formData.markAsPaid ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>


          </div>
        )}

        {/* Icon Picker */}
        {step === 'icons' && (
          <div className="space-y-4">
            <div className="grid grid-cols-8 gap-2">
              {ICON_OPTIONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => {
                    setFormData({ ...formData, icon });
                    setStep('form');
                  }}
                  className={`aspect-square rounded-2xl text-2xl flex items-center justify-center transition-all duration-300 ${
                    formData.icon === icon
                      ? 'bg-accent/20 border-2 border-accent'
                      : 'bg-secondary border border-border hover:border-accent'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Picker */}
        {step === 'colors' && (
          <div className="space-y-4">
            <div className="grid grid-cols-10 gap-3">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setFormData({ ...formData, color });
                    setStep('form');
                  }}
                  className={`w-12 h-12 rounded-full transition-all duration-300 ${
                    formData.color === color ? 'ring-2 ring-offset-2 ring-accent' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}
        </div>
        {/* Fixed Action Buttons */}
        {step === 'form' && (
          <div className="flex gap-3 p-6 border-t border-border bg-card flex-shrink-0">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-secondary border border-border rounded-xl text-foreground hover:bg-secondary/80 transition-all duration-300 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCategory}
              className="flex-1 px-4 py-3 bg-accent text-accent-foreground rounded-xl hover:bg-accent/90 transition-all duration-300 font-medium active:scale-95"
            >
              Add Category
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
