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
    <div className="space-y-4">
      <div className="bg-card rounded-xl p-6 shadow-lg border-2 border-border">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-accent" />
          <h3 className="font-bold text-lg">Score</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-success">{wins}</div>
            <div className="text-sm text-muted-foreground">Wins</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-destructive">{losses}</div>
            <div className="text-sm text-muted-foreground">Losses</div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 shadow-lg border-2 border-border">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-accent" />
          <h3 className="font-bold text-lg">Difficulty</h3>
        </div>
        <Select value={difficulty.toString()} onValueChange={(v) => onDifficultyChange(parseInt(v))}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Level 1 - Very Easy 🌱</SelectItem>
            <SelectItem value="2">Level 2 - Easy 🌿</SelectItem>
            <SelectItem value="3">Level 3 - Medium 🌳</SelectItem>
            <SelectItem value="4">Level 4 - Hard 🔥</SelectItem>
            <SelectItem value="5">Level 5 - Expert 💪</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Button 
          onClick={onUndo} 
          disabled={!canUndo}
          className="w-full"
          variant="outline"
        >
          <Undo className="w-4 h-4 mr-2" />
          Undo Move
        </Button>
        
        <Button 
          onClick={onRestart}
          className="w-full"
          variant="outline"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Restart Game
        </Button>
        
        <Button 
          onClick={onShowRules}
          className="w-full"
          variant="outline"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          How to Play
        </Button>
      </div>
    </div>
  );
}
