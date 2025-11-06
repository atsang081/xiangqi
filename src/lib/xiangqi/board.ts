import { Piece, Position, PlayerSide, PieceType } from './types';

export const BOARD_WIDTH = 9;
export const BOARD_HEIGHT = 10;

export function createInitialBoard(): (Piece | null)[][] {
  const board: (Piece | null)[][] = Array(BOARD_HEIGHT)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(null));

  // Helper to create pieces
  const createPiece = (type: PieceType, side: PlayerSide, x: number, y: number): Piece => ({
    type,
    side,
    position: { x, y },
    id: `${side}-${type}-${x}-${y}`,
  });

  // Black pieces (top)
  board[0][4] = createPiece('general', 'black', 4, 0);
  board[0][3] = createPiece('advisor', 'black', 3, 0);
  board[0][5] = createPiece('advisor', 'black', 5, 0);
  board[0][2] = createPiece('elephant', 'black', 2, 0);
  board[0][6] = createPiece('elephant', 'black', 6, 0);
  board[0][1] = createPiece('horse', 'black', 1, 0);
  board[0][7] = createPiece('horse', 'black', 7, 0);
  board[0][0] = createPiece('chariot', 'black', 0, 0);
  board[0][8] = createPiece('chariot', 'black', 8, 0);
  board[2][1] = createPiece('cannon', 'black', 1, 2);
  board[2][7] = createPiece('cannon', 'black', 7, 2);
  board[3][0] = createPiece('soldier', 'black', 0, 3);
  board[3][2] = createPiece('soldier', 'black', 2, 3);
  board[3][4] = createPiece('soldier', 'black', 4, 3);
  board[3][6] = createPiece('soldier', 'black', 6, 3);
  board[3][8] = createPiece('soldier', 'black', 8, 3);

  // Red pieces (bottom)
  board[9][4] = createPiece('general', 'red', 4, 9);
  board[9][3] = createPiece('advisor', 'red', 3, 9);
  board[9][5] = createPiece('advisor', 'red', 5, 9);
  board[9][2] = createPiece('elephant', 'red', 2, 9);
  board[9][6] = createPiece('elephant', 'red', 6, 9);
  board[9][1] = createPiece('horse', 'red', 1, 9);
  board[9][7] = createPiece('horse', 'red', 7, 9);
  board[9][0] = createPiece('chariot', 'red', 0, 9);
  board[9][8] = createPiece('chariot', 'red', 8, 9);
  board[7][1] = createPiece('cannon', 'red', 1, 7);
  board[7][7] = createPiece('cannon', 'red', 7, 7);
  board[6][0] = createPiece('soldier', 'red', 0, 6);
  board[6][2] = createPiece('soldier', 'red', 2, 6);
  board[6][4] = createPiece('soldier', 'red', 4, 6);
  board[6][6] = createPiece('soldier', 'red', 6, 6);
  board[6][8] = createPiece('soldier', 'red', 8, 6);

  return board;
}

export function isInPalace(pos: Position, side: PlayerSide): boolean {
  const { x, y } = pos;
  if (x < 3 || x > 5) return false;
  if (side === 'red') return y >= 7 && y <= 9;
  return y >= 0 && y <= 2;
}

export function hasRiverCrossed(pos: Position, side: PlayerSide): boolean {
  if (side === 'red') return pos.y <= 4;
  return pos.y >= 5;
}

export function isInBounds(pos: Position): boolean {
  return pos.x >= 0 && pos.x < BOARD_WIDTH && pos.y >= 0 && pos.y < BOARD_HEIGHT;
}

export function copyBoard(board: (Piece | null)[][]): (Piece | null)[][] {
  return board.map(row => row.map(piece => piece ? { ...piece, position: { ...piece.position } } : null));
}
