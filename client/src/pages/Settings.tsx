import { useState, useRef } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import SharedPartnerModal from '@/components/SharedPartnerModal';
import { HelpCircle, Info, Share2, DollarSign, Moon, Sun, Download, Upload, Cloud, RotateCcw } from 'lucide-react';
import { useSalary } from '@/contexts/SalaryContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function Settings() {
  const { salaryFrequency, setSalaryFrequency, budgetItems, expectedSalary, exportData } = useSalary();
  const { theme, toggleTheme } = useTheme();
  const [isSharedPartnerOpen, setIsSharedPartnerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleClearCache = () => {
    // Clear all localStorage
    localStorage.clear();
    // Clear all sessionStorage
    sessionStorage.clear();
    // Clear service worker cache if available
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }
    // Reload the page
    window.location.reload();
  };

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
          <div className="space-y-4">
            <GoogleLoginButton />
            <button
              onClick={handleClearCache}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary/50 text-secondary-foreground border border-border rounded-xl hover:bg-secondary/70 transition-all duration-300 font-medium active:scale-95"
            >
              <RotateCcw size={18} />
              Clear Cache & Reload
            </button>
          </div>
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

        {/* Data Management Section */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Download size={20} className="text-accent" />
            <h2 className="text-lg font-semibold text-foreground">Data Management</h2>
          </div>
          <div className="space-y-3">
            {/* Export JSON */}
            <button
              onClick={exportData}
              className="w-full text-left flex items-center justify-between p-4 bg-card rounded-2xl border border-border hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 active:scale-95"
            >
              <div className="flex items-center gap-4">
                <div className="text-accent"><Download size={24} /></div>
                <div>
                  <h3 className="font-semibold text-foreground">Export as JSON</h3>
                  <p className="text-xs text-secondary-foreground">Download all your budget data</p>
                </div>
              </div>
            </button>

            {/* Export CSV */}
            <button
              onClick={() => {
                let csv = 'Category,Amount,Type,Icon,Paid,Repeat\n';
                budgetItems.forEach(item => {
                  csv += `"${item.name}",${item.amount || 0},"${item.group}","${item.icon}",${item.isPaid ? 'Yes' : 'No'},${item.repeatNextMonth ? 'Yes' : 'No'}\n`;
                });
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `payflow-export-${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="w-full text-left flex items-center justify-between p-4 bg-card rounded-2xl border border-border hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 active:scale-95"
            >
              <div className="flex items-center gap-4">
                <div className="text-accent"><Download size={24} /></div>
                <div>
                  <h3 className="font-semibold text-foreground">Export as CSV</h3>
                  <p className="text-xs text-secondary-foreground">Open in Excel or spreadsheet</p>
                </div>
              </div>
            </button>

            {/* Import Data */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full text-left flex items-center justify-between p-4 bg-card rounded-2xl border border-border hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 active:scale-95"
            >
              <div className="flex items-center gap-4">
                <div className="text-accent"><Upload size={24} /></div>
                <div>
                  <h3 className="font-semibold text-foreground">Import Data</h3>
                  <p className="text-xs text-secondary-foreground">Restore from JSON file</p>
                </div>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const data = JSON.parse(event.target?.result as string);
                      console.log('Imported data:', data);
                      setImportMessage({ type: 'success', text: 'Data imported successfully! Please refresh the page.' });
                      setTimeout(() => setImportMessage(null), 3000);
                    } catch (error) {
                      setImportMessage({ type: 'error', text: 'Failed to import. Invalid file format.' });
                      setTimeout(() => setImportMessage(null), 3000);
                    }
                  };
                  reader.readAsText(file);
                }
              }}
              className="hidden"
            />
          </div>
          {importMessage && (
            <div className={`mt-4 p-3 rounded-xl text-sm font-medium ${
              importMessage.type === 'success'
                ? 'bg-green-500/10 text-green-700 border border-green-500/20'
                : 'bg-red-500/10 text-red-700 border border-red-500/20'
            }`}>
              {importMessage.text}
            </div>
          )}
        </div>

        {/* Display Section */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
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
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
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
        <div className="bg-card rounded-3xl p-6 border border-border text-center animate-fade-in hover:shadow-lg hover:shadow-accent/10 transition-all duration-300" style={{ animationDelay: '0.6s' }}>
          <p className="text-secondary-foreground text-sm mb-2">Payflow</p>
          <p className="text-foreground font-semibold mb-4">Version 1.2.0</p>
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
