import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSalary } from '@/contexts/SalaryContext';

interface EditDualSalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMonth?: Date;
  salaryType: 'mid' | 'end';
}

export default function EditDualSalaryModal({ isOpen, onClose, currentMonth, salaryType }: EditDualSalaryModalProps) {
  const { getMidMonthlySalary, getEndMonthlySalary, setMidMonthlySalary, setEndMonthlySalary } = useSalary();
  const month = currentMonth || new Date(2026, 1);
  const currentMidSalary = getMidMonthlySalary(month);
  const currentEndSalary = getEndMonthlySalary(month);
  const currentSalary = salaryType === 'mid' ? currentMidSalary : currentEndSalary;
  const [inputValue, setInputValue] = useState(currentSalary.toString());

  useEffect(() => {
    if (isOpen) {
      setInputValue(currentSalary.toString());
    }
  }, [isOpen, salaryType, currentSalary]);

  const handleSave = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value > 0) {
      if (salaryType === 'mid') {
        setMidMonthlySalary(month, value);
      } else {
        setEndMonthlySalary(month, value);
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  const monthName = ((month || 0)).toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const title = salaryType === 'mid' ? 'Mid-Month Salary' : 'End-Month Salary';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-3xl p-6 w-full max-w-sm animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Edit {title}</h2>
          <button
            onClick={onClose}
            className="text-secondary-foreground hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Month Info */}
        <div className="mb-4 p-3 bg-secondary/50 rounded-xl">
          <p className="text-sm text-secondary-foreground">Month</p>
          <p className="text-lg font-semibold text-foreground">{monthName}</p>
          <p className="text-xs text-secondary-foreground mt-1">Current: RM {((currentSalary || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>

        {/* Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-secondary-foreground mb-2">
            {title}
          </label>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-foreground">RM</span>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder-secondary-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-secondary border border-border rounded-xl text-foreground hover:bg-secondary/80 transition-all duration-300 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-accent text-accent-foreground rounded-xl hover:bg-accent/90 transition-all duration-300 font-medium active:scale-95"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
