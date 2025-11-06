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
    { dx: 1, dy: 2, blockX: 0, blockY: 1 },
    { dx: 1, dy: -2, blockX: 0, blockY: -1 },
    { dx: -1, dy: 2, blockX: 0, blockY: 1 },
    { dx: -1, dy: -2, blockX: 0, blockY: -1 },
    { dx: 2, dy: 1, blockX: 1, blockY: 0 },
    { dx: 2, dy: -1, blockX: 1, blockY: 0 },
    { dx: -2, dy: 1, blockX: -1, blockY: 0 },
    { dx: -2, dy: -1, blockX: -1, blockY: 0 },
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
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
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
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
  ];

  for (const { dx, dy } of directions) {
    let distance = 1;
    let jumpedOver = false;
    
    while (true) {
      const newPos = { x: x + dx * distance, y: y + dy * distance };
      if (!isInBounds(newPos)) break;
      
      const targetPiece = board[newPos.y][newPos.x];
      
      if (!jumpedOver) {
        if (targetPiece) {
          jumpedOver = true;
        } else {
          moves.push(newPos);
        }
      } else {
        if (targetPiece) {
          if (targetPiece.side !== piece.side) {
            moves.push(newPos);
          }
          break;
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

export function isInCheck(board: (Piece | null)[][], side: PlayerSide): boolean {
  const general = findGeneral(board, side);
  if (!general) return false;

  const enemySide: PlayerSide = side === 'red' ? 'black' : 'red';

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const piece = board[y][x];
      if (piece && piece.side === enemySide) {
        const moves = getValidMoves(piece, board);
        if (moves.some(move => move.x === general.position.x && move.y === general.position.y)) {
          return true;
        }
      }
    }
  }

  return false;
}
