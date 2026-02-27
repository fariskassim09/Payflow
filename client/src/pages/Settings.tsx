import { useState } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import SharedPartnerModal from '@/components/SharedPartnerModal';
import { Lock, HelpCircle, Info, Cloud, Share2 } from 'lucide-react';

// Design Philosophy: Salary Allocation Planner
// - Clean settings interface with toggle switches
// - Organized sections with clear hierarchy
// - Google Firebase authentication for data sync
// - Shared partner feature for sharing salary summary

export default function Settings() {
  const [settings, setSettings] = useState({
    darkMode: true,
  });
  const [isSharedPartnerOpen, setIsSharedPartnerOpen] = useState(false);

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
    onClick,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    toggle?: keyof typeof settings;
    value?: boolean;
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
      {toggle && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSetting(toggle);
          }}
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
        <div className="bg-card rounded-3xl p-6 border border-border text-center animate-fade-in hover:shadow-lg hover:shadow-accent/10 transition-all duration-300" style={{ animationDelay: '0.4s' }}>
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
