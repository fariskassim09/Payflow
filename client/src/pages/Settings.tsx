import { useState } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import SharedPartnerModal from '@/components/SharedPartnerModal';
import { Lock, HelpCircle, Info, Cloud, Share2, DollarSign, Moon, Sun } from 'lucide-react';
import { useSalary } from '@/contexts/SalaryContext';
import { useTheme } from '@/contexts/ThemeContext';

// Design Philosophy: Salary Allocation Planner
// - Clean settings interface with toggle switches
// - Organized sections with clear hierarchy
// - Google Firebase authentication for data sync
// - Shared partner feature for sharing salary summary

export default function Settings() {
  const { salaryFrequency, setSalaryFrequency } = useSalary();
  const { theme, toggleTheme } = useTheme();
  const [isSharedPartnerOpen, setIsSharedPartnerOpen] = useState(false);

  const SettingItem = ({
    icon: Icon,
    title,
    description,
    onClick,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick?: () => void;
  }) => (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center justify-between p-4 bg-card rounded-2xl border border-border hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 active:scale-95"
    >
      <div className="flex items-center gap-4">
        <div className="text-accent">{Icon}</div>
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-secondary-foreground">{description}</p>
        </div>
      </div>

    </button>
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Main Content */}
      <main className="container mx-auto px-4 pt-8 max-w-2xl">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-secondary-foreground">Manage your preferences</p>
        </div>

        {/* Sync Section */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Cloud size={20} className="text-accent" />
            <h2 className="text-lg font-semibold text-foreground">Sync & Backup</h2>
          </div>
          <GoogleLoginButton />
        </div>

        {/* Shared Partner Section */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Share2 size={20} className="text-accent" />
            <h2 className="text-lg font-semibold text-foreground">Shared Partner</h2>
          </div>
          <SettingItem
            icon={<Share2 size={24} />}
            title="Share Summary"
            description="Generate code to share your salary summary with partner"
            onClick={() => setIsSharedPartnerOpen(true)}
          />
        </div>

        {/* Salary Configuration Section */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={20} className="text-accent" />
            <h2 className="text-lg font-semibold text-foreground">Salary Configuration</h2>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => setSalaryFrequency('1x')}
              className={`w-full text-left flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 active:scale-95 ${
                salaryFrequency === '1x'
                  ? 'bg-accent/10 border-accent'
                  : 'bg-card border-border hover:shadow-lg hover:shadow-accent/10'
              }`}
            >
              <div>
                <h3 className="font-semibold text-foreground">1x Monthly Salary</h3>
                <p className="text-xs text-secondary-foreground">Single salary payment per month</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                salaryFrequency === '1x' ? 'border-accent bg-accent' : 'border-secondary'
              }`}>
                {salaryFrequency === '1x' && <div className="w-2 h-2 bg-background rounded-full" />}
              </div>
            </button>
            <button
              onClick={() => setSalaryFrequency('2x')}
              className={`w-full text-left flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 active:scale-95 ${
                salaryFrequency === '2x'
                  ? 'bg-accent/10 border-accent'
                  : 'bg-card border-border hover:shadow-lg hover:shadow-accent/10'
              }`}
            >
              <div>
                <h3 className="font-semibold text-foreground">2x Monthly Salary</h3>
                <p className="text-xs text-secondary-foreground">Mid-month and end-month payments</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                salaryFrequency === '2x' ? 'border-accent bg-accent' : 'border-secondary'
              }`}>
                {salaryFrequency === '2x' && <div className="w-2 h-2 bg-background rounded-full" />}
              </div>
            </button>
          </div>
        </div>

        {/* Display Section */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-lg font-semibold mb-4 text-foreground">Display</h2>
          <div className="space-y-3">
            <button
              onClick={toggleTheme}
              className="w-full text-left flex items-center justify-between p-4 bg-card rounded-2xl border border-border hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 active:scale-95"
            >
              <div className="flex items-center gap-4">
                <div className="text-accent">
                  {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{theme === 'dark' ? 'Dark' : 'Light'} Theme</h3>
                  <p className="text-xs text-secondary-foreground">Current theme: {theme === 'dark' ? 'Dark' : 'Light'}</p>
                </div>
              </div>
              <div className="text-accent text-sm font-medium">
                {theme === 'dark' ? '🌙' : '☀️'}
              </div>
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-lg font-semibold mb-4 text-foreground">Help & Support</h2>
          <div className="space-y-3">
            <SettingItem
              icon={<HelpCircle size={24} />}
              title="FAQ"
              description="Frequently asked questions"
            />
            <SettingItem
              icon={<Info size={24} />}
              title="About"
              description="App version and information"
            />
          </div>
        </div>

        {/* App Info */}
        <div className="bg-card rounded-3xl p-6 border border-border text-center animate-fade-in hover:shadow-lg hover:shadow-accent/10 transition-all duration-300" style={{ animationDelay: '0.5s' }}>
          <p className="text-secondary-foreground text-sm mb-2">Salary Planner</p>
          <p className="text-foreground font-semibold mb-4">Version 1.0.0</p>
          <p className="text-xs text-secondary-foreground">
            Premium salary allocation planner with Firebase sync and partner sharing
          </p>
        </div>
      </main>

      {/* Shared Partner Modal */}
      <SharedPartnerModal isOpen={isSharedPartnerOpen} onClose={() => setIsSharedPartnerOpen(false)} />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
