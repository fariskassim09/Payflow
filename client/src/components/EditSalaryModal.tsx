import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSalary } from '@/contexts/SalaryContext';

interface EditSalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMonth?: Date;
}

export default function EditSalaryModal({ isOpen, onClose, currentMonth }: EditSalaryModalProps) {
  const { expectedSalary, setExpectedSalary } = useSalary();
  const month = currentMonth || new Date(2026, 1);
  const [inputValue, setInputValue] = useState(expectedSalary.toString());

  useEffect(() => {
    if (isOpen) {
      setInputValue(expectedSalary.toString());
    }
  }, [isOpen, expectedSalary]);

  const handleSave = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value >= 0) {
      setExpectedSalary(value);
      onClose();
    }
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-3xl p-6 w-full max-w-sm animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Edit Salary</h2>
          <button
            onClick={onClose}
            className="text-secondary-foreground hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Global Salary Info */}
        <div className="mb-4 p-3 bg-secondary/50 rounded-xl">
          <p className="text-sm text-secondary-foreground">Global Expected Salary</p>
          <p className="text-xs text-secondary-foreground mt-1">This salary applies to all months</p>
          <p className="text-lg font-semibold text-foreground mt-2">Current: RM {(expectedSalary || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>

        {/* Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-secondary-foreground mb-2">
            Expected Salary (Global)
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
        <div className="flex gap-3 mb-3">
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
