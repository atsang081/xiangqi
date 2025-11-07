import { Piece, Position, PlayerSide } from './types';
import { isInBounds, isInPalace, hasRiverCrossed, BOARD_WIDTH, BOARD_HEIGHT } from './board';

export function getValidMoves(piece: Piece, board: (Piece | null)[][]): Position[] {
  switch (piece.type) {
    case 'general':
      return getGeneralMoves(piece, board);
    case 'advisor':
      return getAdvisorMoves(piece, board);
    case 'elephant':
      return getElephantMoves(piece, board);
    case 'horse':
      return getHorseMoves(piece, board);
    case 'chariot':
      return getChariotMoves(piece, board);
    case 'cannon':
      return getCannonMoves(piece, board);
    case 'soldier':
      return getSoldierMoves(piece, board);
    default:
      return [];
  }
}

function getGeneralMoves(piece: Piece, board: (Piece | null)[][]): Position[] {
  const moves: Position[] = [];
  const { x, y } = piece.position;
  const directions = [
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
  ];

  for (const { dx, dy } of directions) {
    const newPos = { x: x + dx, y: y + dy };
    if (isInPalace(newPos, piece.side) && isValidMove(piece, newPos, board)) {
      moves.push(newPos);
    }
  }

  // Flying general rule - cannot face opponent's general directly
  const enemySide: PlayerSide = piece.side === 'red' ? 'black' : 'red';
  const enemyGeneral = findGeneral(board, enemySide);
  if (enemyGeneral && enemyGeneral.position.x === x) {
    let blocked = false;
    const start = Math.min(y, enemyGeneral.position.y) + 1;
    const end = Math.max(y, enemyGeneral.position.y);
    for (let checkY = start; checkY < end; checkY++) {
      if (board[checkY][x] !== null) {
        blocked = true;
        break;
      }
    }
    if (!blocked) {
      moves.length = 0; // Can't move anywhere if would create flying general
    }
  }

  return moves;
}

function getAdvisorMoves(piece: Piece, board: (Piece | null)[][]): Position[] {
  const moves: Position[] = [];
  const { x, y } = piece.position;
  const diagonals = [
    { dx: 1, dy: 1 },
    { dx: 1, dy: -1 },
    { dx: -1, dy: 1 },
    { dx: -1, dy: -1 },
  ];

  for (const { dx, dy } of diagonals) {
    const newPos = { x: x + dx, y: y + dy };
    if (isInPalace(newPos, piece.side) && isValidMove(piece, newPos, board)) {
      moves.push(newPos);
    }
  }

  return moves;
}

function getElephantMoves(piece: Piece, board: (Piece | null)[][]): Position[] {
  const moves: Position[] = [];
  const { x, y } = piece.position;
  const elephantMoves = [
    { dx: 2, dy: 2, blockX: 1, blockY: 1 },
    { dx: 2, dy: -2, blockX: 1, blockY: -1 },
    { dx: -2, dy: 2, blockX: -1, blockY: 1 },
    { dx: -2, dy: -2, blockX: -1, blockY: -1 },
  ];

  for (const { dx, dy, blockX, blockY } of elephantMoves) {
    const newPos = { x: x + dx, y: y + dy };
    const blockPos = { x: x + blockX, y: y + blockY };
    
    // Cannot cross river
    if (hasRiverCrossed(newPos, piece.side)) continue;
    
    // Check if path is blocked
    if (board[blockPos.y]?.[blockPos.x] !== null) continue;
    
    if (isInBounds(newPos) && isValidMove(piece, newPos, board)) {
      moves.push(newPos);
    }
  }

  return moves;
}

function getHorseMoves(piece: Piece, board: (Piece | null)[][]): Position[] {
  const moves: Position[] = [];
  const { x, y } = piece.position;
  const horseMoves = [
    { dx: 1, dy: 2, blockX: 0, blockY: 1 },  // Right-Up
    { dx: 1, dy: -2, blockX: 0, blockY: -1 }, // Right-Down
    { dx: -1, dy: 2, blockX: 0, blockY: 1 },  // Left-Up
    { dx: -1, dy: -2, blockX: 0, blockY: -1 }, // Left-Down
    { dx: 2, dy: 1, blockX: 1, blockY: 0 },   // Up-Right
    { dx: 2, dy: -1, blockX: 1, blockY: 0 },  // Up-Left
    { dx: -2, dy: 1, blockX: -1, blockY: 0 }, // Down-Right
    { dx: -2, dy: -1, blockX: -1, blockY: 0 }, // Down-Left
  ];

  for (const { dx, dy, blockX, blockY } of horseMoves) {
    const newPos = { x: x + dx, y: y + dy };
    const blockPos = { x: x + blockX, y: y + blockY };
    
    // Check if horse's leg is blocked
    if (board[blockPos.y]?.[blockPos.x] !== null) continue;
    
    if (isInBounds(newPos) && isValidMove(piece, newPos, board)) {
      moves.push(newPos);
    }
  }

  return moves;
}

function getChariotMoves(piece: Piece, board: (Piece | null)[][]): Position[] {
  const moves: Position[] = [];
  const { x, y } = piece.position;
  const directions = [
    { dx: 0, dy: 1 },   // Up
    { dx: 0, dy: -1 },  // Down
    { dx: 1, dy: 0 },   // Right
    { dx: -1, dy: 0 },  // Left
  ];

  for (const { dx, dy } of directions) {
    let distance = 1;
    while (true) {
      const newPos = { x: x + dx * distance, y: y + dy * distance };
      if (!isInBounds(newPos)) break;
      
      const targetPiece = board[newPos.y][newPos.x];
      if (targetPiece) {
        if (targetPiece.side !== piece.side) {
          moves.push(newPos);
        }
        break;
      }
      
      moves.push(newPos);
      distance++;
    }
  }

  return moves;
}

function getCannonMoves(piece: Piece, board: (Piece | null)[][]): Position[] {
  const moves: Position[] = [];
  const { x, y } = piece.position;
  const directions = [
    { dx: 0, dy: 1 },   // Up
    { dx: 0, dy: -1 },  // Down
    { dx: 1, dy: 0 },   // Right
    { dx: -1, dy: 0 },  // Left
  ];

  for (const { dx, dy } of directions) {
    let distance = 1;
    let jumpedOver = false;
    
    while (true) {
      const newPos = { x: x + dx * distance, y: y + dy * distance };
      if (!isInBounds(newPos)) break;
      
      const targetPiece = board[newPos.y][newPos.x];
      
      if (!jumpedOver) {
        // Non-capturing move - can only move to empty squares
        if (targetPiece) {
          // Found a piece to jump over
          jumpedOver = true;
        } else {
          // Can move to empty square
          moves.push(newPos);
        }
      } else {
        // After jumping over a piece
        if (targetPiece) {
          // Can capture if it's an enemy piece
          if (targetPiece.side !== piece.side) {
            moves.push(newPos);
          }
          // Stop in either case (can't jump over more than one piece)
          break;
        } else {
          // Can't move to empty squares after jumping (unless capturing)
          // This is intentionally left empty
        }
      }
      
      distance++;
    }
  }

  return moves;
}

function getSoldierMoves(piece: Piece, board: (Piece | null)[][]): Position[] {
  const moves: Position[] = [];
  const { x, y } = piece.position;
  const forward = piece.side === 'red' ? -1 : 1;

  // Forward move
  const forwardPos = { x, y: y + forward };
  if (isInBounds(forwardPos) && isValidMove(piece, forwardPos, board)) {
    moves.push(forwardPos);
  }

  // Lateral moves (only after crossing river)
  if (hasRiverCrossed(piece.position, piece.side)) {
    const leftPos = { x: x - 1, y };
    const rightPos = { x: x + 1, y };
    
    if (isInBounds(leftPos) && isValidMove(piece, leftPos, board)) {
      moves.push(leftPos);
    }
    if (isInBounds(rightPos) && isValidMove(piece, rightPos, board)) {
      moves.push(rightPos);
    }
  }

  return moves;
}

function isValidMove(piece: Piece, newPos: Position, board: (Piece | null)[][]): boolean {
  const targetPiece = board[newPos.y][newPos.x];
  return !targetPiece || targetPiece.side !== piece.side;
}

function findGeneral(board: (Piece | null)[][], side: PlayerSide): Piece | null {
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const piece = board[y][x];
      if (piece && piece.type === 'general' && piece.side === side) {
        return piece;
      }
    }
  }
  return null;
}

export function isInCheck(board: (Piece | null)[][]): boolean {
  // Check if any piece is attacking the general
  const redGeneral = findGeneral(board, 'red');
  const blackGeneral = findGeneral(board, 'black');
  
  if (!redGeneral || !blackGeneral) return false;
  
  // Check if red general is in check
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const piece = board[y][x];
      if (piece && piece.side === 'black') {
        const moves = getValidMoves(piece, board);
        if (moves.some(move => move.x === redGeneral.position.x && move.y === redGeneral.position.y)) {
          return true;
        }
      }
    }
  }
  
  // Check if black general is in check
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const piece = board[y][x];
      if (piece && piece.side === 'red') {
        const moves = getValidMoves(piece, board);
        if (moves.some(move => move.x === blackGeneral.position.x && move.y === blackGeneral.position.y)) {
          return true;
        }
      }
    }
  }
  
  return false;
}

export function isCheckmate(board: (Piece | null)[][], side: PlayerSide): boolean {
  // First check if the side is in check
  if (!isInCheck(board)) return false;
  
  // Check if the side has any legal moves
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const piece = board[y][x];
      if (piece && piece.side === side) {
        const moves = getValidMoves(piece, board);
        // Try each move to see if it gets out of check
        for (const move of moves) {
          const newBoard = simulateMove(board, piece, move);
          if (!isInCheck(newBoard)) {
            // Found a move that gets out of check
            return false;
          }
        }
      }
    }
  }
  
  // No legal moves to get out of check - checkmate
  return true;
}

export function isStalemate(board: (Piece | null)[][], side: PlayerSide): boolean {
  // Check if the side is NOT in check
  if (isInCheck(board)) return false;
  
  // Check if the side has any legal moves
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const piece = board[y][x];
      if (piece && piece.side === side) {
        const moves = getValidMoves(piece, board);
        if (moves.length > 0) {
          // Found at least one legal move
          return false;
        }
      }
    }
  }
  
  // No legal moves and not in check - stalemate
  return true;
}

export function isKingCaptured(board: (Piece | null)[][], side: PlayerSide): boolean {
  // Check if the specified side's king is still on the board
  return findGeneral(board, side) === null;
}

function simulateMove(board: (Piece | null)[][], piece: Piece, to: Position): (Piece | null)[][] {
  const newBoard = board.map(row => row.map(p => p ? { ...p } : null));
  const from = piece.position;
  
  // Move the piece
  newBoard[to.y][to.x] = { ...piece, position: to };
  newBoard[from.y][from.x] = null;
  
  return newBoard;
}