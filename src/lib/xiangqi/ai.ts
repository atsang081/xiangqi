import { Piece, Move, PlayerSide, Position } from './types';
import { getValidMoves, isInCheck } from './moves';
import { copyBoard, BOARD_HEIGHT, BOARD_WIDTH } from './board';

const PIECE_VALUES = {
  general: 10000,
  advisor: 200,
  elephant: 200,
  horse: 400,
  chariot: 900,
  cannon: 450,
  soldier: 100,
};

export function getAIMove(
  board: (Piece | null)[][],
  side: PlayerSide,
  difficulty: number
): Move | null {
  const pieces = getAllPieces(board, side);
  const allMoves: Move[] = [];

  for (const piece of pieces) {
    const validMoves = getValidMoves(piece, board);
    for (const move of validMoves) {
      const capturedPiece = board[move.y][move.x];
      allMoves.push({
        from: piece.position,
        to: move,
        piece,
        capturedPiece: capturedPiece || undefined,
      });
    }
  }

  if (allMoves.length === 0) return null;

  switch (difficulty) {
    case 1:
      return getRandomMove(allMoves);
    case 2:
      return getSimpleMove(allMoves, board);
    case 3:
      return getTacticalMove(allMoves, board, side, 1);
    case 4:
      return getTacticalMove(allMoves, board, side, 2);
    case 5:
      return getTacticalMove(allMoves, board, side, 3);
    default:
      return getRandomMove(allMoves);
  }
}

function getRandomMove(moves: Move[]): Move {
  return moves[Math.floor(Math.random() * moves.length)];
}

function getSimpleMove(moves: Move[], board: (Piece | null)[][]): Move {
  // Prefer captures
  const captureMoves = moves.filter(m => m.capturedPiece);
  if (captureMoves.length > 0 && Math.random() > 0.3) {
    return captureMoves[Math.floor(Math.random() * captureMoves.length)];
  }
  return getRandomMove(moves);
}

function getTacticalMove(
  moves: Move[],
  board: (Piece | null)[][],
  side: PlayerSide,
  depth: number
): Move {
  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    const newBoard = simulateMove(board, move);
    const score = evaluatePosition(newBoard, side) + (Math.random() - 0.5) * 50;
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function simulateMove(board: (Piece | null)[][], move: Move): (Piece | null)[][] {
  const newBoard = copyBoard(board);
  newBoard[move.to.y][move.to.x] = { ...move.piece, position: move.to };
  newBoard[move.from.y][move.from.x] = null;
  return newBoard;
}

function evaluatePosition(board: (Piece | null)[][], side: PlayerSide): number {
  let score = 0;
  const enemySide: PlayerSide = side === 'red' ? 'black' : 'red';

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const piece = board[y][x];
      if (!piece) continue;

      const value = PIECE_VALUES[piece.type];
      if (piece.side === side) {
        score += value;
      } else {
        score -= value;
      }
    }
  }

  // Check penalty
  if (isInCheck(board, side)) {
    score -= 500;
  }
  if (isInCheck(board, enemySide)) {
    score += 500;
  }

  return score;
}

function getAllPieces(board: (Piece | null)[][], side: PlayerSide): Piece[] {
  const pieces: Piece[] = [];
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const piece = board[y][x];
      if (piece && piece.side === side) {
        pieces.push(piece);
      }
    }
  }
  return pieces;
}
