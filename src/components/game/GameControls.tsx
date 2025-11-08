import { Button } from '@/components/ui/button';
import { 
  RotateCcw, 
  Undo, 
  Settings, 
  HelpCircle,
  Trophy 
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

interface GameControlsProps {
  gameMode?: 'computer' | 'player';
  difficulty: number;
  onDifficultyChange: (level: number) => void;
  onUndo: () => void;
  onRestart: () => void;
  onShowRules: () => void;
  canUndo: boolean;
  wins: number;
  losses: number;
}

export function GameControls({
  gameMode = 'computer',
  difficulty,
  onDifficultyChange,
  onUndo,
  onRestart,
  onShowRules,
  canUndo,
  wins,
  losses,
}: GameControlsProps) {
  const { t } = useLanguage();
  
  const difficultyLabels = [
    `${t.level} 1 - ${t.veryEasy} 🌱`,
    `${t.level} 2 - ${t.easy} 🌿`,
    `${t.level} 3 - ${t.medium} 🌳`,
    `${t.level} 4 - ${t.hard} 🔥`,
    `${t.level} 5 - ${t.veryHard} 💪`,
    `${t.level} 6 - ${t.veryHard}+ 🏆`,
  ];

  return (
    <div className="space-y-3 sm:space-y-4 w-full">
      <div className="bg-card rounded-xl p-4 sm:p-6 shadow-lg border-2 border-border">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          <h3 className="font-bold text-base sm:text-lg">{t.wins} / {t.losses}</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-success">{wins}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">{t.wins}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-destructive">{losses}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">{t.losses}</div>
          </div>
        </div>
      </div>

      {gameMode === 'computer' && (
        <div className="bg-card rounded-xl p-4 sm:p-6 shadow-lg border-2 border-border">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            <h3 className="font-bold text-base sm:text-lg">{t.level}</h3>
          </div>
          <Select value={difficulty.toString()} onValueChange={(v) => onDifficultyChange(parseInt(v))}>
            <SelectTrigger className="w-full h-10 sm:h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {difficultyLabels.map((label, index) => (
                <SelectItem key={index + 1} value={(index + 1).toString()}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Button 
          onClick={onUndo} 
          disabled={!canUndo}
          className="w-full h-10 sm:h-11 text-sm sm:text-base"
          variant="outline"
        >
          <Undo className="w-4 h-4 mr-2" />
          {t.undo}
        </Button>
        
        <Button 
          onClick={onRestart}
          className="w-full h-10 sm:h-11 text-sm sm:text-base"
          variant="outline"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {t.restart}
        </Button>
        
        <Button 
          onClick={onShowRules}
          className="w-full h-10 sm:h-11 text-sm sm:text-base"
          variant="outline"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          {t.rules}
        </Button>
      </div>
    </div>
  );
}