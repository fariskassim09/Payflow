import { useState } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import { Bell, Lock, HelpCircle, Info, Cloud } from 'lucide-react';

// Design Philosophy: Salary Allocation Planner
// - Clean settings interface with toggle switches
// - Organized sections with clear hierarchy
// - Google Firebase authentication for data sync

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    monthlyReminders: true,
    budgetAlerts: true,
    darkMode: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const SettingItem = ({
    icon: Icon,
    title,
    description,
    toggle,
    value,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    toggle?: keyof typeof settings;
    value?: boolean;
  }) => (
    <div className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 active:scale-95">
      <div className="flex items-center gap-4">
        <div className="text-accent">{Icon}</div>
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-secondary-foreground">{description}</p>
        </div>
      </div>
      {toggle && (
        <button
          onClick={() => toggleSetting(toggle)}
          className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
            value ? 'bg-accent' : 'bg-secondary'
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-background rounded-full transition-all duration-300 ${
              value ? 'right-1' : 'left-1'
            }`}
          />
        </button>
      )}
    </div>
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

        {/* Notifications Section */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-lg font-semibold mb-4 text-foreground">Notifications</h2>
          <div className="space-y-3">
            <SettingItem
              icon={<Bell size={24} />}
              title="Enable Notifications"
              description="Receive app notifications"
              toggle="notifications"
              value={settings.notifications}
            />
            <SettingItem
              icon={<Bell size={24} />}
              title="Monthly Reminders"
              description="Get reminded at the start of each month"
              toggle="monthlyReminders"
              value={settings.monthlyReminders}
            />
            <SettingItem
              icon={<Bell size={24} />}
              title="Budget Alerts"
              description="Alert when approaching allocation limits"
              toggle="budgetAlerts"
              value={settings.budgetAlerts}
            />
          </div>
        </div>

        {/* Display Section */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-lg font-semibold mb-4 text-foreground">Display</h2>
          <div className="space-y-3">
            <SettingItem
              icon={<Lock size={24} />}
              title="Dark Mode"
              description="Always use dark theme"
              toggle="darkMode"
              value={settings.darkMode}
            />
          </div>
        </div>

        {/* Help Section */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-lg font-semibold mb-4 text-foreground">Help & Support</h2>
          <div className="space-y-3">
            <button className="w-full text-left transition-all duration-300 active:scale-95">
              <SettingItem
                icon={<HelpCircle size={24} />}
                title="FAQ"
                description="Frequently asked questions"
              />
            </button>
            <button className="w-full text-left transition-all duration-300 active:scale-95">
              <SettingItem
                icon={<Info size={24} />}
                title="About"
                description="App version and information"
              />
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-card rounded-3xl p-6 border border-border text-center animate-fade-in hover:shadow-lg hover:shadow-accent/10 transition-all duration-300" style={{ animationDelay: '0.4s' }}>
          <p className="text-secondary-foreground text-sm mb-2">Salary Planner</p>
          <p className="text-foreground font-semibold mb-4">Version 1.0.0</p>
          <p className="text-xs text-secondary-foreground">
            Premium salary allocation planner with Firebase sync
          </p>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
