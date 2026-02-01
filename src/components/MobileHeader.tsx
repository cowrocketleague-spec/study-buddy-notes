import { Menu, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  onMenuClick: () => void;
  onBackClick?: () => void;
}

export function MobileHeader({ title, showBack, onMenuClick, onBackClick }: MobileHeaderProps) {
  return (
    <header className="lg:hidden flex items-center gap-3 p-4 border-b border-border bg-card">
      {showBack ? (
        <Button variant="ghost" size="icon" onClick={onBackClick}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
      ) : (
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu className="w-5 h-5" />
        </Button>
      )}
      <h1 className="font-semibold text-foreground truncate">{title}</h1>
    </header>
  );
}
