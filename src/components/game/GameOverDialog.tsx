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

interface GameOverDialogProps {
  open: boolean;
  result: 'win' | 'loss' | 'draw' | null;
  onNewGame: () => void;
}

export function GameOverDialog({ open, result, onNewGame }: GameOverDialogProps) {
  if (!result) return null;

  const messages = {
    win: {
      title: "🎉 Congratulations! 🎉",
      description: "You won! You're becoming a Chinese Chess master!",
      icon: Trophy,
      color: "text-success",
    },
    loss: {
      title: "Try Again!",
      description: "Don't give up! Every game makes you better!",
      icon: Frown,
      color: "text-destructive",
    },
    draw: {
      title: "It's a Draw!",
      description: "Great game! You both played well!",
      icon: Minus,
      color: "text-accent",
    },
  };

  const config = messages[result];
  const Icon = config.icon;

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className={`w-20 h-20 rounded-full bg-background flex items-center justify-center ${config.color}`}>
              <Icon className="w-12 h-12" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">{config.title}</DialogTitle>
          <DialogDescription className="text-center text-lg">
            {config.description}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="sm:justify-center">
          <Button onClick={onNewGame} size="lg" className="w-full">
            Play Again!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
