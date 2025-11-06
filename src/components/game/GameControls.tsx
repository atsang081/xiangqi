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

interface GameControlsProps {
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
  difficulty,
  onDifficultyChange,
  onUndo,
  onRestart,
  onShowRules,
  canUndo,
  wins,
  losses,
}: GameControlsProps) {
  return (
    <div className="space-y-3 sm:space-y-4 w-full">
      <div className="bg-card rounded-xl p-4 sm:p-6 shadow-lg border-2 border-border">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          <h3 className="font-bold text-base sm:text-lg">戰績</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-success">{wins}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">勝利</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-destructive">{losses}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">失敗</div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl p-4 sm:p-6 shadow-lg border-2 border-border">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          <h3 className="font-bold text-base sm:text-lg">難度</h3>
        </div>
        <Select value={difficulty.toString()} onValueChange={(v) => onDifficultyChange(parseInt(v))}>
          <SelectTrigger className="w-full h-10 sm:h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">第一級 - 非常簡單 🌱</SelectItem>
            <SelectItem value="2">第二級 - 簡單 🌿</SelectItem>
            <SelectItem value="3">第三級 - 中等 🌳</SelectItem>
            <SelectItem value="4">第四級 - 困難 🔥</SelectItem>
            <SelectItem value="5">第五級 - 專家 💪</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Button 
          onClick={onUndo} 
          disabled={!canUndo}
          className="w-full h-10 sm:h-11 text-sm sm:text-base"
          variant="outline"
        >
          <Undo className="w-4 h-4 mr-2" />
          悔棋
        </Button>
        
        <Button 
          onClick={onRestart}
          className="w-full h-10 sm:h-11 text-sm sm:text-base"
          variant="outline"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          重新開始
        </Button>
        
        <Button 
          onClick={onShowRules}
          className="w-full h-10 sm:h-11 text-sm sm:text-base"
          variant="outline"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          遊戲規則
        </Button>
      </div>
    </div>
  );
}
