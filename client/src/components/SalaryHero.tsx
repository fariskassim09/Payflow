import { useEffect, useState } from 'react';

interface SalaryHeroProps {
  salary: number;
  remaining: number;
}

// Design Philosophy: Zen Minimalism with Breathing Space
// - Large bold typography (44px) for salary amount
// - Neon green accent for visual emphasis
// - Subtle divider lines
// - Smooth count-up animation (1.2s)

export default function SalaryHero({ salary, remaining }: SalaryHeroProps) {
  const [displaySalary, setDisplaySalary] = useState(0);
  const [displayRemaining, setDisplayRemaining] = useState(0);

  useEffect(() => {
    // Animate salary count-up
    let start = 0;
    const duration = 1200;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplaySalary(Math.floor(salary * progress));
      setDisplayRemaining(Math.floor(remaining * progress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [salary, remaining]);

  return (
    <div className="space-y-8">
      {/* Monthly Salary */}
      <div className="space-y-2 animate-fade-in">
        <p className="salary-label">Monthly Salary</p>
        <div className="salary-amount animate-count-up">
          RM {(displaySalary || 0).toLocaleString()}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border animate-fade-in" style={{ animationDelay: '0.2s' }} />

      {/* Remaining Balance */}
      <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <p className="salary-label">Remaining Balance</p>
        <div className={`text-4xl font-bold ${
          remaining >= 0 ? 'text-accent' : 'text-destructive'
        }`}>
          RM {(displayRemaining || 0).toLocaleString()}
        </div>
        <p className="text-sm text-secondary-foreground">
          {remaining >= 0 ? 'Available to spend' : 'Over budget'}
        </p>
      </div>

      {/* Health Indicator */}
      {remaining >= 0 && (
        <div className="flex items-center gap-2 text-accent animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="w-2 h-2 rounded-full bg-accent animate-glow-pulse" />
          <span className="text-sm font-medium">On track</span>
        </div>
      )}
      {remaining < 0 && (
        <div className="flex items-center gap-2 text-destructive animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="w-2 h-2 rounded-full bg-destructive" />
          <span className="text-sm font-medium">Over budget</span>
        </div>
      )}
    </div>
  );
}
