import { Link, useLocation } from 'wouter';
import { Home, BarChart3, Settings } from 'lucide-react';

// Design Philosophy: Zen Minimalism with Breathing Space
// - Icon-only navigation with subtle labels
// - Thin top divider line
// - Neon green highlight for active tab
// - Smooth fade transition (0.3s)

export default function BottomNavigation() {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/summary', label: 'Summary', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center h-20">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} href={path}>
              <a
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ${
                  isActive(path)
                    ? 'text-accent bg-accent/10'
                    : 'text-secondary-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                <Icon
                  size={24}
                  className={`transition-all duration-300 ${
                    isActive(path) ? 'fill-current' : ''
                  }`}
                />
                <span className="text-xs font-medium">{label}</span>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
