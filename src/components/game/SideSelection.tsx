import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SideSelectionProps {
  onSelectSide: (side: 'red' | 'black') => void;
}

export function SideSelection({ onSelectSide }: SideSelectionProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-6 sm:space-y-8 max-w-4xl w-full">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2">
            象棋對弈
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            選擇你的陣營！
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <Card 
            className="p-6 sm:p-8 cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200 bg-gradient-to-br from-piece-red/20 to-piece-red/5 border-2 sm:border-4 border-piece-red/30 hover:border-piece-red"
            onClick={() => onSelectSide('red')}
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-piece-red flex items-center justify-center text-3xl sm:text-4xl font-bold text-primary-foreground shadow-lg">
                帥
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-piece-red">紅方</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                傳統先手方，紅方先走！
              </p>
              <Button 
                size="lg" 
                className="w-full h-11 sm:h-12 text-base sm:text-lg bg-piece-red hover:bg-piece-red/90"
              >
                選擇紅方
              </Button>
            </div>
          </Card>

          <Card 
            className="p-6 sm:p-8 cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200 bg-gradient-to-br from-piece-black/20 to-piece-black/5 border-2 sm:border-4 border-piece-black/30 hover:border-piece-black"
            onClick={() => onSelectSide('black')}
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-piece-black flex items-center justify-center text-3xl sm:text-4xl font-bold text-secondary-foreground shadow-lg">
                將
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-piece-black">黑方</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                挑戰自己！黑方應對紅方的開局。
              </p>
              <Button 
                size="lg" 
                className="w-full h-11 sm:h-12 text-base sm:text-lg bg-piece-black hover:bg-piece-black/90"
              >
                選擇黑方
              </Button>
            </div>
          </Card>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground">
          別擔心！你可以隨時重新開始來更換陣營。
        </p>
      </div>
    </div>
  );
}
