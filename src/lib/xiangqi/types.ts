export type PieceType = 'general' | 'advisor' | 'elephant' | 'horse' | 'chariot' | 'cannon' | 'soldier';
export type PlayerSide = 'red' | 'black';

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  type: PieceType;
  side: PlayerSide;
  position: Position;
  id: string;
}

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  capturedPiece?: Piece;
}

export interface GameState {
  board: (Piece | null)[][];
  currentPlayer: PlayerSide;
  selectedPiece: Piece | null;
  validMoves: Position[];
  moveHistory: Move[];
  capturedPieces: Piece[];
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
}

export const PIECE_NAMES: Record<PieceType, { red: string; black: string }> = {
  general: { red: '帥', black: '將' },
  advisor: { red: '仕', black: '士' },
  elephant: { red: '相', black: '象' },
  horse: { red: '馬', black: '馬' },
  chariot: { red: '車', black: '車' },
  cannon: { red: '炮', black: '砲' },
  soldier: { red: '兵', black: '卒' },
};
