import { useState, useEffect } from 'react';
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
  '✈️', '👗', '💡', '🏆', '🎵', '🛒', '🍕', '☕',
  '🎁', '🏥', '👨‍👩‍👧', '🌿', '💼', '🏦', '📺', '🎯',
  '🛡️', '🔧', '🎓', '🌍', '💎', '📝', '💧', '⚡',
  '🚗', '✈️', '🔫', '⛽', '🚌', '🍔', '🏪', '🎨',
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
      group: 'NEEDS' as 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS',
      icon: '🏠',
      color: '#3B82F6',
      repeatNextMonth: true,
      markAsPaid: false,
      salaryType: salaryFrequency === '2x' ? ('mid' as 'mid' | 'end') : undefined,
    };
  };
  
  const [formData, setFormData] = useState(getInitialFormData());

  // Reset form when modal opens/closes or editing category changes
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData());
      setStep('form');
    }
  }, [isOpen, editingCategoryId]);

  const handleAddCategory = () => {
    if (!formData.name.trim()) {
      alert('Please enter a category name');
      return;
    }
    if (formData.amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    // Get the appropriate salary for validation based on salary frequency and type
    let validationSalary = expectedSalary;
    if (salaryFrequency === '2x' && formData.salaryType) {
      validationSalary = formData.salaryType === 'mid' ? getMidMonthlySalary(currentMonth) : getEndMonthlySalary(currentMonth);
    } else if (salaryFrequency === '1x') {
      // For 1x mode, use getMonthlySalary which returns the total from monthlySalaries or expectedSalary
      validationSalary = getMonthlySalary(currentMonth);
    }
    
    if (validationSalary <= 0) {
      alert('Please set your expected salary first');
      return;
    }
    if (formData.amount > validationSalary) {
      alert(`Category amount (RM ${formData.amount.toFixed(2)}) cannot exceed salary (RM ${validationSalary.toFixed(2)})`);
      return;
    }
    
    // Store fixed amount, not percentage
    // Percentage is calculated dynamically from the fixed amount and current salary
    const newCategory = {
      id: `custom-${Date.now()}`,
      name: formData.name,
      icon: formData.icon,
      percentage: 0, // Will be calculated dynamically
      amount: formData.amount, // Store the fixed amount
      group: formData.group,
      repeatNextMonth: formData.repeatNextMonth,
      markAsPaid: formData.markAsPaid,
      salaryType: formData.salaryType,
      color: '#3B82F6', // Always blue
    };
    if (editingCategory) {
      // Update existing category
      updateBudgetItem(editingCategory.id, {
        name: formData.name,
        icon: formData.icon,
        percentage: 0, // Will be calculated dynamically
        amount: formData.amount, // Store the fixed amount
        group: formData.group,
        repeatNextMonth: formData.repeatNextMonth,
        isPaid: formData.markAsPaid,
        salaryType: formData.salaryType,
      });
    } else {
      // Add new category
      addBudgetItem(newCategory);
    }
    setFormData({
      name: '',
      amount: 0,
      group: 'NEEDS',
      icon: '🏠',
      color: '#3B82F6',
      repeatNextMonth: true,
      markAsPaid: false,
      salaryType: salaryFrequency === '2x' ? ('mid' as 'mid' | 'end') : undefined,
    });
    setStep('form');
    onClose();
  };

  if (!isOpen) return null;

  // Calculate percentage display based on the correct salary
  let displayBaseSalary = expectedSalary;
  if (salaryFrequency === '2x') {
    // For 2x mode, ALWAYS use the actual mid or end month salary, never expectedSalary
    displayBaseSalary = formData.salaryType === 'mid' ? getMidMonthlySalary(currentMonth) : getEndMonthlySalary(currentMonth);
  }
  const percentage = displayBaseSalary > 0 ? (formData.amount / displayBaseSalary) * 100 : 0;

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
              {editingCategory ? 'Update Category' : 'Add Category'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
