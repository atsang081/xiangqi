import { Piece as PieceType, Position } from '@/lib/xiangqi/types';
import { BOARD_WIDTH, BOARD_HEIGHT } from '@/lib/xiangqi/board';
import { GamePiece } from './GamePiece';

interface GameBoardProps {
  board: (PieceType | null)[][];
  selectedPiece: PieceType | null;
  validMoves: Position[];
  lastMove: Position | null;
  playerSide: 'red' | 'black';
  onSquareClick: (x: number, y: number) => void;
}

export function GameBoard({
  board,
  selectedPiece,
  validMoves,
  lastMove,
  playerSide,
  onSquareClick,
}: GameBoardProps) {
  const isValidMove = (x: number, y: number) => {
    return validMoves.some(move => move.x === x && move.y === y);
  };

  const isLastMove = (x: number, y: number) => {
    return lastMove && lastMove.x === x && lastMove.y === y;
  };

  const isSelected = (piece: PieceType | null) => {
    return piece && selectedPiece && piece.id === selectedPiece.id;
  };

  // Determine if board should be flipped
  const shouldFlip = playerSide === 'red';

  // Responsive sizing
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const cellSize = isMobile ? 36 : 60;
  const pieceSize = isMobile ? 32 : 50;
  const boardWidth = cellSize * (BOARD_WIDTH - 1);
  const boardHeight = cellSize * (BOARD_HEIGHT - 1);

  return (
    <div className="relative w-full flex justify-center">
      <div 
        className={`inline-block bg-board-bg rounded-lg shadow-2xl border-2 sm:border-4 border-board-line p-2 sm:p-4 ${shouldFlip ? '' : 'rotate-180'}`}
      >
        {/* Board grid */}
        <div 
          className="relative" 
          style={{ 
            width: `${boardWidth}px`, 
            height: `${boardHeight}px`,
            minWidth: `${boardWidth}px`,
            minHeight: `${boardHeight}px`
          }}
        >
          {/* Horizontal lines */}
          {Array.from({ length: BOARD_HEIGHT }).map((_, y) => (
            <div
              key={`h-line-${y}`}
              className="absolute bg-board-line"
              style={{
                left: '0',
                right: '0',
                top: `${y * cellSize}px`,
                height: '2px',
              }}
            />
          ))}
          
          {/* Vertical lines - split by river */}
          {Array.from({ length: BOARD_WIDTH }).map((_, x) => (
            <div key={`v-line-${x}`}>
              <div
                className="absolute bg-board-line"
                style={{
                  left: `${x * cellSize}px`,
                  width: '2px',
                  top: '0',
                  height: `${cellSize * 4}px`,
                }}
              />
              <div
                className="absolute bg-board-line"
                style={{
                  left: `${x * cellSize}px`,
                  width: '2px',
                  top: `${cellSize * 5}px`,
                  height: `${cellSize * 4}px`,
                }}
              />
            </div>
          ))}

          {/* Palace diagonals */}
          {/* Black palace */}
          <svg className="absolute" style={{ 
            left: `${cellSize * 3}px`, 
            top: '0', 
            width: `${cellSize * 2}px`, 
            height: `${cellSize * 2}px` 
          }}>
            <line x1="0" y1="0" x2={cellSize * 2} y2={cellSize * 2} stroke="hsl(var(--board-line))" strokeWidth="2" />
            <line x1={cellSize * 2} y1="0" x2="0" y2={cellSize * 2} stroke="hsl(var(--board-line))" strokeWidth="2" />
          </svg>
          
          {/* Red palace */}
          <svg className="absolute" style={{ 
            left: `${cellSize * 3}px`, 
            top: `${cellSize * 7}px`, 
            width: `${cellSize * 2}px`, 
            height: `${cellSize * 2}px` 
          }}>
            <line x1="0" y1="0" x2={cellSize * 2} y2={cellSize * 2} stroke="hsl(var(--board-line))" strokeWidth="2" />
            <line x1={cellSize * 2} y1="0" x2="0" y2={cellSize * 2} stroke="hsl(var(--board-line))" strokeWidth="2" />
          </svg>

          {/* River text */}
          <div 
            className="absolute left-0 right-0 text-center font-bold text-board-line text-sm sm:text-xl" 
            style={{ top: `${cellSize * 4.2}px` }}
          >
            <span className={shouldFlip ? '' : 'rotate-180 inline-block'}>楚河 漢界</span>
          </div>

          {/* Pieces and interaction points */}
          {Array.from({ length: BOARD_HEIGHT }).map((_, y) =>
            Array.from({ length: BOARD_WIDTH }).map((_, x) => {
              const piece = board[y][x];
              const validMove = isValidMove(x, y);
              const selected = isSelected(piece);
              const lastMoveHighlight = isLastMove(x, y);

              return (
                <div
                  key={`square-${x}-${y}`}
                  className={`absolute cursor-pointer transition-all duration-200 ${shouldFlip ? '' : 'rotate-180'}`}
                  style={{
                    left: `${x * cellSize - pieceSize / 2}px`,
                    top: `${y * cellSize - pieceSize / 2}px`,
                    width: `${pieceSize}px`,
                    height: `${pieceSize}px`,
                  }}
                  onClick={() => onSquareClick(x, y)}
                >
                  {/* Highlight for last move */}
                  {lastMoveHighlight && (
                    <div className="absolute inset-0 bg-info/20 rounded-full animate-pulse" />
                  )}
                  
                  {/* Valid move indicator */}
                  {validMove && !piece && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-highlight rounded-full shadow-lg animate-pulse" />
                    </div>
                  )}
                  
                  {/* Valid capture indicator */}
                  {validMove && piece && (
                    <div className="absolute inset-0 border-4 border-destructive rounded-full animate-pulse" />
                  )}
                  
                  {/* Piece */}
                  {piece && (
                    <GamePiece
                      piece={piece}
                      isSelected={selected}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
