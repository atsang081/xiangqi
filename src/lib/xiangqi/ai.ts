import { Piece, Move, PlayerSide, Position } from './types';
import { getValidMoves, isInCheck, isCheckmate, isStalemate } from './moves';
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

// Positional values for better piece placement
const POSITION_VALUES = {
  general: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  advisor: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  elephant: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 20, 0, 0, 0, 20, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 20, 0, 0, 0, 20, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  horse: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 10, 0, 10, 0, 10, 0, 10, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 10, 0, 10, 0, 10, 0, 10, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 10, 0, 10, 0, 10, 0, 10, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 10, 0, 10, 0, 10, 0, 10, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  chariot: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 10, 10, 10, 10, 10, 10, 10, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 10, 10, 10, 10, 10, 10, 10, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  cannon: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 10, 10, 10, 10, 10, 10, 10, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 10, 10, 10, 10, 10, 10, 10, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  soldier: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [20, 20, 20, 20, 20, 20, 20, 20, 20],
    [25, 25, 25, 25, 25, 25, 25, 25, 25],
    [25, 25, 25, 25, 25, 25, 25, 25, 25],
    [30, 30, 30, 30, 30, 30, 30, 30, 30],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
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

  // Limit search depth for better performance
  const maxDepth = Math.min(difficulty, 4);

  switch (difficulty) {
    case 1:
      return getRandomMove(allMoves);
    case 2:
      return getSimpleMove(allMoves, board);
    case 3:
      return getTacticalMove(allMoves, board, side, 2);
    case 4:
      return getTacticalMove(allMoves, board, side, 3);
    case 5:
      return getTacticalMove(allMoves, board, side, 3);
    case 6:
      return getTacticalMove(allMoves, board, side, 4);
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
    // Use minimax with alpha-beta pruning for better move selection
    const score = minimax(newBoard, depth, -Infinity, Infinity, false, side);
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function minimax(
  board: (Piece | null)[][],
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  side: PlayerSide
): number {
  // Base case: reached maximum depth or game over
  if (depth === 0) {
    return evaluatePosition(board, side);
  }

  const currentSide: PlayerSide = maximizing ? side : (side === 'red' ? 'black' : 'red');
  const pieces = getAllPieces(board, currentSide);
  const allMoves: Move[] = [];

  // Generate all possible moves
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

  if (allMoves.length === 0) {
    // No moves available - checkmate or stalemate
    if (isInCheck(board)) {
      // Checkmate
      return maximizing ? -100000 : 100000;
    } else {
      // Stalemate
      return 0;
    }
  }

  // Early termination: If we find a winning move, take it immediately
  if (depth >= 3) {
    for (const move of allMoves) {
      const newBoard = simulateMove(board, move);
      if (isCheckmate(newBoard, side === 'red' ? 'black' : 'red')) {
        // This is a checkmate move
        return maximizing ? 100000 : -100000;
      }
    }
  }

  if (maximizing) {
    let maxEval = -Infinity;
    // Sort moves to improve alpha-beta pruning efficiency
    allMoves.sort((a, b) => (b.capturedPiece ? 1 : 0) - (a.capturedPiece ? 1 : 0));
    
    for (const move of allMoves) {
      const newBoard = simulateMove(board, move);
      const evalScore = minimax(newBoard, depth - 1, alpha, beta, false, side);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    // Sort moves to improve alpha-beta pruning efficiency
    allMoves.sort((a, b) => (b.capturedPiece ? 1 : 0) - (a.capturedPiece ? 1 : 0));
    
    for (const move of allMoves) {
      const newBoard = simulateMove(board, move);
      const evalScore = minimax(newBoard, depth - 1, alpha, beta, true, side);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return minEval;
  }
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

  // Simplified evaluation for better performance
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

  // Check penalty (simplified)
  if (isInCheck(board)) {
    score -= 300;
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