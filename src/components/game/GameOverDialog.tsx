import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Frown, Minus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface GameOverDialogProps {
  open: boolean;
  result: 'win' | 'loss' | 'draw' | null;
  onNewGame: () => void;
}

export function GameOverDialog({ open, result, onNewGame }: GameOverDialogProps) {
  const { t } = useLanguage();
  
  if (!result) return null;

  const messages = {
    win: {
      title: t.victory,
      description: t.victoryMessage,
      icon: Trophy,
      color: "text-success",
    },
    loss: {
      title: t.defeat,
      description: t.defeatMessage,
      icon: Frown,
      color: "text-destructive",
    },
    draw: {
      title: t.draw,
      description: t.drawMessage,
      icon: Minus,
      color: "text-accent",
    },
  };

  const config = messages[result];
  const Icon = config.icon;

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md w-[90vw]">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-background flex items-center justify-center ${config.color}`}>
              <Icon className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl sm:text-2xl">{config.title}</DialogTitle>
          <DialogDescription className="text-center text-base sm:text-lg">
            {config.description}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="sm:justify-center">
          <Button onClick={onNewGame} size="lg" className="w-full h-11 sm:h-12 text-base sm:text-lg">
            {t.playAgain}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
