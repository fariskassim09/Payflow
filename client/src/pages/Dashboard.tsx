import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import MonthNavigation from '@/components/MonthNavigation';
import SalaryCard from '@/components/SalaryCard';
import CombinedSalaryCard from '@/components/CombinedSalaryCard';
import CategoryGroup from '@/components/CategoryGroup';
import EditSalaryModal from '@/components/EditSalaryModal';
import EditDualSalaryModal from '@/components/EditDualSalaryModal';
import AddCategoryModal from '@/components/AddCategoryModal';
import { useSalary } from '@/contexts/SalaryContext';

export default function Dashboard() {
  const { getBudgetsByGroup, salaryFrequency, setExpectedSalary } = useSalary();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditDualModalOpen, setIsEditDualModalOpen] = useState(false);
  const [editingSalaryType, setEditingSalaryType] = useState<'mid' | 'end'>('mid');
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Current month
  const [salaryTypeFilter, setSalaryTypeFilter] = useState<'all' | 'mid' | 'end'>('all');
  const [lastMonth, setLastMonth] = useState<string>(new Date().toISOString().slice(0, 7));

  // Reset Expected Salary when month changes
  useEffect(() => {
    const currentMonthStr = currentMonth.toISOString().slice(0, 7);
    if (currentMonthStr !== lastMonth) {
      setExpectedSalary(0);
      setLastMonth(currentMonthStr);
    }
  }, [currentMonth, lastMonth, setExpectedSalary]);

  const getFilteredItems = (items: any[]) => {
    if (salaryTypeFilter === 'all') return items;
    return items.filter(item => item.salaryType === salaryTypeFilter);
  };

  const needsItems = getFilteredItems(getBudgetsByGroup('NEEDS', currentMonth));
  const wantsItems = getFilteredItems(getBudgetsByGroup('WANTS', currentMonth));
  const savingsItems = getFilteredItems(getBudgetsByGroup('SAVINGS', currentMonth));
  const debtsItems = getFilteredItems(getBudgetsByGroup('DEBTS', currentMonth));

  const handleEditMidSalary = () => {
    setEditingSalaryType('mid');
    setIsEditDualModalOpen(true);
  };

  const handleEditEndSalary = () => {
    setEditingSalaryType('end');
    setIsEditDualModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Main Content */}
      <main className="container mx-auto px-4 pt-6 max-w-2xl flex-1 pb-32 overflow-y-auto">
        {/* Month Navigation */}
        <MonthNavigation onMonthChange={setCurrentMonth} currentMonth={currentMonth} />

        {/* Salary Card - Conditional based on frequency */}
        <div className="mb-8">
          {salaryFrequency === '1x' ? (
            <SalaryCard onEditClick={() => setIsEditModalOpen(true)} currentMonth={currentMonth} />
          ) : (
            <CombinedSalaryCard onEditMid={handleEditMidSalary} onEditEnd={handleEditEndSalary} currentMonth={currentMonth} />
          )}
        </div>

        {/* Budget Categories Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-6">Budget Categories</h2>

          {/* Filter Tabs - Only show for 2x salary */}
          {salaryFrequency === '2x' && (
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {(['all', 'mid', 'end'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSalaryTypeFilter(filter)}
                  className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 ${
                    salaryTypeFilter === filter
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary border border-border text-foreground hover:border-accent'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter === 'mid' ? 'Mid-Month' : 'End-Month'}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-8">
            {needsItems.length > 0 && (
              <CategoryGroup key={`NEEDS-${currentMonth.getFullYear()}-${currentMonth.getMonth()}`} group="NEEDS" items={needsItems} onCategoryTap={(id) => { setEditingCategoryId(id); setIsAddCategoryOpen(true); }} currentMonth={currentMonth} />
            )}
            {wantsItems.length > 0 && (
              <CategoryGroup key={`WANTS-${currentMonth.getFullYear()}-${currentMonth.getMonth()}`} group="WANTS" items={wantsItems} onCategoryTap={(id) => { setEditingCategoryId(id); setIsAddCategoryOpen(true); }} currentMonth={currentMonth} />
            )}
            {savingsItems.length > 0 && (
              <CategoryGroup key={`SAVINGS-${currentMonth.getFullYear()}-${currentMonth.getMonth()}`} group="SAVINGS" items={savingsItems} onCategoryTap={(id) => { setEditingCategoryId(id); setIsAddCategoryOpen(true); }} currentMonth={currentMonth} />
            )}
            {debtsItems.length > 0 && (
              <CategoryGroup key={`DEBTS-${currentMonth.getFullYear()}-${currentMonth.getMonth()}`} group="DEBTS" items={debtsItems} onCategoryTap={(id) => { setEditingCategoryId(id); setIsAddCategoryOpen(true); }} currentMonth={currentMonth} />
            )}
          </div>
        </div>
      </main>

      {/* Add Category Button - Fixed at bottom */}
      <div className="fixed bottom-24 right-6 z-40 animate-fade-in">
        <button
          onClick={() => { setEditingCategoryId(null); setIsAddCategoryOpen(true); }}
          className="w-14 h-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 active:scale-95"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Edit Salary Modal (1x mode) */}
      <EditSalaryModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} currentMonth={currentMonth} />

      {/* Edit Dual Salary Modal (2x mode) */}
      <EditDualSalaryModal isOpen={isEditDualModalOpen} onClose={() => setIsEditDualModalOpen(false)} currentMonth={currentMonth} salaryType={editingSalaryType} />

      {/* Add/Edit Category Modal */}
      <AddCategoryModal isOpen={isAddCategoryOpen} onClose={() => { setIsAddCategoryOpen(false); setEditingCategoryId(null); }} currentMonth={currentMonth} editingCategoryId={editingCategoryId} />

      {/* Bottom Navigation - Fixed */}
      <BottomNavigation />
    </div>
  );
}
