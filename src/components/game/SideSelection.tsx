import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SideSelectionProps {
  onSelectSide: (side: 'red' | 'black') => void;
}

export function SideSelection({ onSelectSide }: SideSelectionProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-4xl">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-foreground mb-2">
            Chinese Chess
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose Your Side!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card 
            className="p-8 cursor-pointer hover:scale-105 transition-transform duration-200 bg-gradient-to-br from-piece-red/20 to-piece-red/5 border-4 border-piece-red/30 hover:border-piece-red"
            onClick={() => onSelectSide('red')}
          >
            <div className="space-y-4">
              <div className="w-24 h-24 mx-auto rounded-full bg-piece-red flex items-center justify-center text-4xl font-bold text-primary-foreground shadow-lg">
                帥
              </div>
              <h2 className="text-3xl font-bold text-piece-red">Red Side</h2>
              <p className="text-muted-foreground">
                Traditional first player. Red moves first in Chinese Chess!
              </p>
              <Button 
                size="lg" 
                className="w-full bg-piece-red hover:bg-piece-red/90"
              >
                Play as Red
              </Button>
            </div>
          </Card>

          <Card 
            className="p-8 cursor-pointer hover:scale-105 transition-transform duration-200 bg-gradient-to-br from-piece-black/20 to-piece-black/5 border-4 border-piece-black/30 hover:border-piece-black"
            onClick={() => onSelectSide('black')}
          >
            <div className="space-y-4">
              <div className="w-24 h-24 mx-auto rounded-full bg-piece-black flex items-center justify-center text-4xl font-bold text-secondary-foreground shadow-lg">
                將
              </div>
              <h2 className="text-3xl font-bold text-piece-black">Black Side</h2>
              <p className="text-muted-foreground">
                Challenge yourself! Black responds to Red's opening moves.
              </p>
              <Button 
                size="lg" 
                className="w-full bg-piece-black hover:bg-piece-black/90"
              >
                Play as Black
              </Button>
            </div>
          </Card>
        </div>

        <p className="text-sm text-muted-foreground">
          Don't worry! You can change sides anytime by restarting the game.
        </p>
      </div>
    </div>
  );
}
