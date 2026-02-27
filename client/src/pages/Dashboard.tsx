import { useState } from 'react';
import { Plus } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import MonthNavigation from '@/components/MonthNavigation';
import SalaryCard from '@/components/SalaryCard';
import CategoryGroup from '@/components/CategoryGroup';
import EditSalaryModal from '@/components/EditSalaryModal';
import AddCategoryModal from '@/components/AddCategoryModal';
import { useSalary } from '@/contexts/SalaryContext';

// Design Philosophy: Salary Allocation Planner
// - Month/year navigation at top
// - Blue gradient salary card with allocation breakdown
// - Grouped budget categories (NEEDS, WANTS, SAVINGS, DEBTS)
// - Smooth animations and transitions

export default function Dashboard() {
  const { getBudgetsByGroup } = useSalary();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  const needsItems = getBudgetsByGroup('NEEDS');
  const wantsItems = getBudgetsByGroup('WANTS');
  const savingsItems = getBudgetsByGroup('SAVINGS');
  const debtsItems = getBudgetsByGroup('DEBTS');

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Main Content */}
      <main className="container mx-auto px-4 pt-6 max-w-2xl">
        {/* Month Navigation */}
        <MonthNavigation />

        {/* Salary Card */}
        <div className="mb-8">
          <SalaryCard onEditClick={() => setIsEditModalOpen(true)} />
        </div>

        {/* Budget Categories Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 text-foreground">Budget Categories</h2>
          <div className="space-y-8">
            {needsItems.length > 0 && (
              <CategoryGroup group="NEEDS" items={needsItems} onCategoryTap={() => setIsAddCategoryOpen(true)} />
            )}
            {wantsItems.length > 0 && (
              <CategoryGroup group="WANTS" items={wantsItems} onCategoryTap={() => setIsAddCategoryOpen(true)} />
            )}
            {savingsItems.length > 0 && (
              <CategoryGroup group="SAVINGS" items={savingsItems} onCategoryTap={() => setIsAddCategoryOpen(true)} />
            )}
            {debtsItems.length > 0 && (
              <CategoryGroup group="DEBTS" items={debtsItems} onCategoryTap={() => setIsAddCategoryOpen(true)} />
            )}
          </div>
        </div>

        {/* Add Category Button */}
        <div className="fixed bottom-24 right-6 animate-fade-in">
          <button
            onClick={() => setIsAddCategoryOpen(true)}
            className="w-14 h-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 active:scale-95"
          >
            <Plus size={24} />
          </button>
        </div>
      </main>

      {/* Edit Salary Modal */}
      <EditSalaryModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />

      {/* Add Category Modal */}
      <AddCategoryModal isOpen={isAddCategoryOpen} onClose={() => setIsAddCategoryOpen(false)} />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
