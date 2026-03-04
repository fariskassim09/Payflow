import { useState } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { useSalary } from '@/contexts/SalaryContext';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMonth: Date;
  editingCategoryId?: string | null;
}

const ICON_OPTIONS = [
  '🏠', '🚗', '🍔', '🍕', '📚', '💰', '💳', '🎮',
  '✈️', '👗', '💡', '🏆', '🎵', '🛒', '☕', '🎁',
  '🏥', '👨‍👩‍👧', '🌿', '💼', '🏦', '📺', '🎯', '🛡️',
  '🔧', '🎓', '🌍', '💎', '📝', '💧', '⚡', '🎨',
  '🎬', '🎪', '🎭', '🎸', '🎹', '🎺', '🎻', '🥁',
  '🏃', '🚴', '⛹️', '🏋️', '🤸', '🧘', '🏊', '🚣',
  '🍎', '🥗', '🥘', '🍜', '🍲', '🥙', '🌮', '🌯',
  '🍰', '🎂', '🧁', '🍪', '🍩', '🍫', '🍬', '🍭',
  '🚀', '🛸', '🛰️', '✈️', '🚁', '🚂', '🚆', '🚊',
  '📱', '💻', '⌨️', '🖥️', '🖨️', '📷', '📹', '🎥',
  '👔', '👠', '👞', '👟', '🧤', '🧣', '🎩', '👒',
  '💍', '💄', '💅', '🧴', '🧼', '🧽', '🧹', '🧺',
  '🌸', '🌺', '🌻', '🌷', '🌹', '🥀', '🌼', '🌴',
  '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉',
  '🎰', '🎲', '🃏', '🎴', '🀄', '🎯', '🎳', '🎮',
  '🍷', '🍾', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃',
  '🏖️', '🏝️', '⛱️', '🏔️', '⛰️', '🌋', '🗻', '🏕️',
  '🎒', '👜', '👝', '🛍️', '🎁', '🎀', '🎊', '🎉',
  '📖', '📕', '📗', '📘', '📙', '📚', '📓', '📔',
];

export default function AddCategoryModal({ isOpen, onClose, currentMonth, editingCategoryId }: AddCategoryModalProps) {
  const { addBudgetItem, updateBudgetItem, budgetItems, expectedSalary, salaryFrequency, getMidMonthlySalary, getEndMonthlySalary, getMonthlySalary } = useSalary();
  const editingCategory = editingCategoryId ? budgetItems.find(item => item.id === editingCategoryId) : null;
  const [step, setStep] = useState<'form' | 'icons'>('form');
  const shouldShowSalaryType = salaryFrequency === '2x';
  
  // Initialize form data - either from editing category or empty
  const getInitialFormData = () => {
    if (editingCategory) {
      // Use the actual amount stored in the category, not calculated from percentage
      return {
        name: editingCategory.name,
        amount: editingCategory.amount || 0,
        group: editingCategory.group,
        icon: editingCategory.icon,
        color: '#3B82F6',
        repeatNextMonth: editingCategory.repeatNextMonth ?? true,
        markAsPaid: editingCategory.isPaid ?? false,
        salaryType: editingCategory.salaryType as 'mid' | 'end' | undefined,
      };
    }
    return {
      name: '',
      amount: 0,
      group: 'expense',
      icon: '🏠',
      color: '#3B82F6',
      repeatNextMonth: true,
      markAsPaid: false,
      salaryType: undefined,
    };
  };

  const [formData, setFormData] = useState<{
    name: string;
    amount: number;
    group: string;
    icon: string;
    color: string;
    repeatNextMonth: boolean;
    markAsPaid: boolean;
    salaryType?: 'mid' | 'end';
  }>(getInitialFormData());

  const handleClose = () => {
    // Reset form and step when closing
    setFormData(getInitialFormData());
    setStep('form');
    onClose();
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('Please enter a category name');
      return;
    }

    if (formData.amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const newItem: any = {
      id: editingCategory?.id || Date.now().toString(),
      name: formData.name,
      amount: formData.amount,
      group: formData.group,
      icon: formData.icon,
      percentage: 0,
      repeatNextMonth: formData.repeatNextMonth,
      isPaid: formData.markAsPaid,
      salaryType: formData.salaryType,
    };

    if (editingCategory) {
      updateBudgetItem(editingCategory.id, newItem);
    } else {
      addBudgetItem(newItem);
    }

    // Reset form and close
    setFormData(getInitialFormData());
    setStep('form');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-background rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="w-10">
            {step === 'icons' && (
              <button
                onClick={() => setStep('form')}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
          </div>
          <h2 className="text-xl font-bold text-foreground flex-1 text-center">
            {step === 'form' ? (editingCategoryId ? 'Edit Category' : 'Add Category') : 'Select Icon'}
          </h2>
          <div className="w-10">
            <button
              onClick={handleClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'form' ? (
            <div className="space-y-4">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-secondary-foreground mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Groceries, Gas, Entertainment"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-secondary-foreground mb-2">
                  Amount (RM)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.amount || ''}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Category Group */}
              <div>
                <label className="block text-sm font-medium text-secondary-foreground mb-2">
                  Category Group
                </label>
                <div className="flex gap-2 flex-wrap">
                  {['NEEDS', 'WANTS', 'SAVINGS', 'DEBTS'].map((group) => (
                    <button
                      key={group}
                      type="button"
                      onClick={() => setFormData({ ...formData, group: group.toLowerCase() })}
                      className={`flex-1 min-w-[80px] px-3 py-2 rounded-lg font-medium transition-colors ${
                        formData.group === group.toLowerCase()
                          ? 'bg-accent text-white'
                          : 'bg-secondary border border-border text-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>

              {/* Salary Type (only for 2x salary) */}
              {shouldShowSalaryType && (
                <div>
                  <label className="block text-sm font-medium text-secondary-foreground mb-2">
                    Salary Type
                  </label>
                  <select
                    value={formData.salaryType || ''}
                    onChange={(e) => setFormData({ ...formData, salaryType: (e.target.value || undefined) as 'mid' | 'end' | undefined })}
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">Both Salaries</option>
                    <option value="mid">Mid-Month</option>
                    <option value="end">End-Month</option>
                  </select>
                </div>
              )}

              {/* Icon Selection Button */}
              <div>
                <label className="block text-sm font-medium text-secondary-foreground mb-2">
                  Icon
                </label>
                <button
                  onClick={() => setStep('icons')}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground hover:bg-secondary/80 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {formData.icon} Select Icon
                </button>
              </div>

              {/* Repeat Next Month Toggle */}
              <div className="flex items-center justify-between p-4 bg-secondary rounded-xl border border-border">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-foreground">Repeat Next Month</label>
                  <p className="text-xs text-secondary-foreground">Auto-copy this category every month</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, repeatNextMonth: !formData.repeatNextMonth })}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    formData.repeatNextMonth ? 'bg-accent' : 'bg-border'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      formData.repeatNextMonth ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Mark as Paid Toggle */}
              <div className="flex items-center justify-between p-4 bg-secondary rounded-xl border border-border">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-foreground">Mark as Paid</label>
                  <p className="text-xs text-secondary-foreground">Exclude from remaining balance</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, markAsPaid: !formData.markAsPaid })}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    formData.markAsPaid ? 'bg-accent' : 'bg-border'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      formData.markAsPaid ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          ) : (
            // Icon Selection Grid
            <div className="grid grid-cols-5 gap-3 sm:grid-cols-6">
              {ICON_OPTIONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => {
                    setFormData({ ...formData, icon });
                    setStep('form');
                  }}
                  className={`aspect-square rounded-xl flex items-center justify-center text-2xl transition-all ${
                    formData.icon === icon
                      ? 'bg-accent border-2 border-accent scale-110'
                      : 'bg-secondary hover:bg-secondary/80 border border-border'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'form' && (
          <div className="border-t border-border p-6 flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-secondary border border-border rounded-xl text-foreground hover:bg-secondary/80 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors font-medium"
            >
              {editingCategoryId ? 'Update' : 'Add'} Category
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
