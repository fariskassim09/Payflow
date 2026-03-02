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
  // Home & Living
  '🏠', '🛋️', '🛏️', '🚪', '🪟', '🔑', '🧹', '🧺',
  // Food & Dining
  '🍔', '🍕', '☕', '🍜', '🍱', '🥗', '🍰', '🍪',
  '🍩', '🍚', '🥘', '🍲', '🌮', '🌯', '🥙', '🥪',
  '🍞', '🧀', '🥬', '🍅', '🥒', '🌶️', '🥕', '🌽',
  '🥔', '🍳', '🥞', '🥓', '🍗', '🍖', '🌭', '🍿',
  // Transportation
  '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑',
  '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '✈️', '🚁',
  '🛩️', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈',
  '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎',
  '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗',
  '⛽', '🚲', '🛴', '🛵', '🏍️', '🛺', '🚨', '🚔',
  // Shopping & Money
  '🛒', '🛍️', '💳', '💰', '💵', '💴', '💶', '💷',
  '💸', '💹', '🏪', '🏬', '🏢', '🏛️', '🏦', '🏧',
  '💼', '👔', '👗', '👠', '👜', '🎒', '👓', '⌚',
  // Entertainment & Hobbies
  '🎮', '🎯', '🎲', '🎰', '🎪', '🎨', '🎭', '🎬',
  '🎤', '🎧', '🎵', '🎶', '🎸', '🎹', '🎺', '🎻',
  '📚', '📖', '📝', '✏️', '📓', '📔', '📕', '📗',
  '📘', '📙', '📰', '🗞️', '📑', '🎓', '🎯', '🎪',
  // Sports & Fitness
  '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉',
  '🥏', '🎳', '🏓', '🏸', '🏒', '🏑', '🥍', '🏌️',
  '⛳', '🎣', '🎽', '🎿', '⛷️', '🏂', '🪂', '🏋️',
  '🤼', '🤸', '⛹️', '🤺', '🤾', '🏌️', '🏇', '🧘',
  // Health & Medicine
  '🏥', '⚕️', '💊', '💉', '🩹', '🩺', '🧬', '🦠',
  // Travel & Vacation
  '🏖️', '🏝️', '⛱️', '🏔️', '⛰️', '🌋', '⛺', '⛲',
  '🏰', '🏯', '🗼', '🗽', '🗿', '🎡', '🎢', '🎠',
  '⛪', '🕌', '🛕', '🕍', '🛤️', '🛣️', '🗾', '🎑',
  // Utilities & Services
  '💡', '🔧', '🔨', '⚒️', '🛠️', '⚙️', '🔩', '⛓️',
  '🧰', '🧲', '🔌', '🔋', '📱', '💻', '⌨️', '🖱️',
  // Nature & Environment
  '🌿', '🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌷',
  '🌹', '🥀', '🌺', '🌻', '🌼', '🌸', '💐', '🌞',
  // Other
  '🎁', '🎀', '🎊', '🎉', '🎈', '👨‍👩‍👧', '👨‍👩‍👧‍👦', '🐕',
  '🐈', '🐇', '🐿️', '🦝', '⌚', '👒', '🧣', '🎩',
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

  const handleSubmit = () => {
    // Determine which salary to validate against
    let validationSalary = expectedSalary;
    if (salaryFrequency === '2x') {
      validationSalary = formData.salaryType === 'mid' ? getMidMonthlySalary(currentMonth) : getEndMonthlySalary(currentMonth);
    } else {
      validationSalary = getMonthlySalary(currentMonth);
    }

    if (!validationSalary) {
      alert('Please set your expected salary first');
      return;
    }

    if (formData.amount > validationSalary) {
      alert(`Category amount (RM ${formData.amount.toFixed(2)}) cannot exceed salary (RM ${validationSalary.toFixed(2)})`);
      return;
    }

    // Store fixed amount, not percentage
    const newItem = {
      id: editingCategoryId || `${Date.now()}-${Math.random()}`,
      name: formData.name,
      amount: formData.amount,
      group: formData.group,
      icon: formData.icon,
      color: formData.color,
      repeatNextMonth: formData.repeatNextMonth,
      isPaid: formData.markAsPaid,
      percentage: 0, // Will be calculated dynamically
      salaryType: formData.salaryType,
    }

    if (editingCategoryId && editingCategory) {
      updateBudgetItem(editingCategoryId, newItem);
    } else {
      addBudgetItem(newItem);
    }

    setFormData(getInitialFormData());
    setStep('form');
    onClose();
  };

  // Calculate percentage display based on the correct salary
  const displayBaseSalary = salaryFrequency === '2x'
    ? (formData.salaryType === 'mid' ? getMidMonthlySalary(currentMonth) : getEndMonthlySalary(currentMonth))
    : getMonthlySalary(currentMonth);

  const percentage = displayBaseSalary > 0 ? (formData.amount / displayBaseSalary) * 100 : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-[60]">
      <div className="bg-card w-full rounded-t-3xl flex flex-col max-h-[90vh] animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          {step === 'form' ? (
            <>
              <h2 className="text-2xl font-bold text-foreground">
                {editingCategoryId ? 'Edit Category' : 'Add Category'}
              </h2>
              <button
                onClick={onClose}
                className="text-secondary-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep('form')}
                className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
              >
                <ChevronLeft size={20} />
                Back
              </button>
              <h2 className="text-2xl font-bold text-foreground">Select Icon</h2>
              <div className="w-6" />
            </>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {step === 'form' ? (
            <div className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-secondary-foreground mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Groceries, Gas, Entertainment"
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder-secondary-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-secondary-foreground mb-2">
                  Amount (RM)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder-secondary-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              {/* Group Selection */}
              <div>
                <label className="block text-sm font-medium text-secondary-foreground mb-2">
                  Category Group
                </label>
                <select
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value as 'NEEDS' | 'WANTS' | 'SAVINGS' | 'DEBTS' })}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
                >
                  <option value="NEEDS">Needs</option>
                  <option value="WANTS">Wants</option>
                  <option value="SAVINGS">Savings</option>
                  <option value="DEBTS">Debts</option>
                </select>
              </div>

              {/* Salary Type Selection (2x mode only) */}
              {shouldShowSalaryType && (
                <div>
                  <label className="block text-sm font-medium text-secondary-foreground mb-2">
                    Deduct From
                  </label>
                  <select
                    value={formData.salaryType || 'mid'}
                    onChange={(e) => setFormData({ ...formData, salaryType: e.target.value as 'mid' | 'end' })}
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
                  >
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

              {/* Repeat Next Month */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="repeatNextMonth"
                  checked={formData.repeatNextMonth}
                  onChange={(e) => setFormData({ ...formData, repeatNextMonth: e.target.checked })}
                  className="w-4 h-4 rounded border-border"
                />
                <label htmlFor="repeatNextMonth" className="text-sm text-secondary-foreground">
                  Repeat this category next month
                </label>
              </div>

              {/* Mark as Paid */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="markAsPaid"
                  checked={formData.markAsPaid}
                  onChange={(e) => setFormData({ ...formData, markAsPaid: e.target.checked })}
                  className="w-4 h-4 rounded border-border"
                />
                <label htmlFor="markAsPaid" className="text-sm text-secondary-foreground">
                  Mark as paid
                </label>
              </div>
            </div>
          ) : (
            // Icon Selection Grid
            <div className="grid grid-cols-6 gap-3">
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
              onClick={onClose}
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
