import { Piece } from '@/lib/xiangqi/types';
import { PIECE_NAMES } from '@/lib/xiangqi/types';

interface GamePieceProps {
  piece: Piece;
  isSelected: boolean;
}

export function GamePiece({ piece, isSelected }: GamePieceProps) {
  const displayName = PIECE_NAMES[piece.type][piece.side];
  const colorClass = piece.side === 'red' ? 'bg-piece-red text-primary-foreground' : 'bg-piece-black text-secondary-foreground';

  return (
    <div
      className={`
        absolute inset-0 rounded-full flex items-center justify-center
        font-bold text-base sm:text-2xl shadow-lg border-2 sm:border-4 border-background
        piece-animate transition-all duration-200
        ${colorClass}
        ${isSelected ? 'piece-selected ring-2 sm:ring-4 ring-accent' : 'hover:scale-105 active:scale-95'}
      `}
    >
      {displayName}
    </div>
  );
}
