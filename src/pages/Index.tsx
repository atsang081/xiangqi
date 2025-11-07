import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerSide, GameState, Move, Position } from '@/lib/xiangqi/types';
import { createInitialBoard, copyBoard } from '@/lib/xiangqi/board';
import { getValidMoves, isInCheck, isCheckmate, isStalemate, isKingCaptured } from '@/lib/xiangqi/moves';
import { getAIMove } from '@/lib/xiangqi/ai';
import { GameBoard } from '@/components/game/GameBoard';
import { GameControls } from '@/components/game/GameControls';
import { RulesDialog } from '@/components/game/RulesDialog';
import { GameOverDialog } from '@/components/game/GameOverDialog';
import { SideSelection } from '@/components/game/SideSelection';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const STORAGE_KEY = 'xiangqi-stats';

const Index = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [playerSide, setPlayerSide] = useState<PlayerSide | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    board: createInitialBoard(),
    currentPlayer: 'red',
    selectedPiece: null,
    validMoves: [],
    moveHistory: [],
    capturedPieces: [],
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
  });
  const [difficulty, setDifficulty] = useState(3);
  const [showRules, setShowRules] = useState(false);
  const [gameResult, setGameResult] = useState<'win' | 'loss' | 'draw' | null>(null);
  const [lastMove, setLastMove] = useState<Position | null>(null);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [isAIThinking, setIsAIThinking] = useState(false);

  useEffect(() => {
    const stats = localStorage.getItem(STORAGE_KEY);
    if (stats) {
      const { wins, losses } = JSON.parse(stats);
      setWins(wins || 0);
      setLosses(losses || 0);
    }
  }, []);

  useEffect(() => {
    if (playerSide && gameState.currentPlayer !== playerSide && !gameState.isCheckmate && !isAIThinking) {
      makeAIMove();
    }
  }, [gameState.currentPlayer, playerSide, gameState.isCheckmate, isAIThinking]);

  const makeAIMove = async () => {
    setIsAIThinking(true);
    const aiSide: PlayerSide = playerSide === 'red' ? 'black' : 'red';
    
    // Reduce artificial delays for better responsiveness
    const delay = difficulty <= 2 ? 300 : difficulty === 3 ? 500 : difficulty === 4 ? 800 : difficulty === 5 ? 1200 : 1500;
    
    setTimeout(() => {
      const aiMove = getAIMove(gameState.board, aiSide, difficulty);
      
      if (aiMove) {
        executeMove(aiMove);
        setLastMove(aiMove.to);
      }
      
      setIsAIThinking(false);
    }, delay);
  };

  const executeMove = (move: Move) => {
    const newBoard = copyBoard(gameState.board);
    newBoard[move.to.y][move.to.x] = { ...move.piece, position: move.to };
    newBoard[move.from.y][move.from.x] = null;

    const nextPlayer: PlayerSide = gameState.currentPlayer === 'red' ? 'black' : 'red';
    const inCheck = isInCheck(newBoard);

    const newGameState: GameState = {
      board: newBoard,
      currentPlayer: nextPlayer,
      selectedPiece: null,
      validMoves: [],
      moveHistory: [...gameState.moveHistory, move],
      capturedPieces: move.capturedPiece 
        ? [...gameState.capturedPieces, move.capturedPiece] 
        : gameState.capturedPieces,
      isCheck: inCheck,
      isCheckmate: false,
      isStalemate: false,
    };

    // Check if a king has been captured
    if (isKingCaptured(newBoard, 'red')) {
      // Red king captured - black wins
      newGameState.isCheckmate = true;
      handleGameEnd(playerSide === 'black' ? 'win' : 'loss');
      setGameState(newGameState);
      return;
    }
    
    if (isKingCaptured(newBoard, 'black')) {
      // Black king captured - red wins
      newGameState.isCheckmate = true;
      handleGameEnd(playerSide === 'red' ? 'win' : 'loss');
      setGameState(newGameState);
      return;
    }

    // Check for checkmate or stalemate
    if (isCheckmate(newBoard, nextPlayer)) {
      newGameState.isCheckmate = true;
      handleGameEnd(nextPlayer === playerSide ? 'loss' : 'win');
    } else if (isStalemate(newBoard, nextPlayer)) {
      newGameState.isStalemate = true;
      // In Xiangqi, stalemate is a loss for the stalemated player
      handleGameEnd(nextPlayer === playerSide ? 'loss' : 'win');
    } else if (inCheck) {
      toast.info(t.check, {
        icon: '⚠️',
      });
    }

    setGameState(newGameState);
  };

  const checkForValidMoves = (board: (any)[][], side: PlayerSide): boolean => {
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        const piece = board[y][x];
        if (piece && piece.side === side) {
          const moves = getValidMoves(piece, board);
          if (moves.length > 0) return true;
        }
      }
    }
    return false;
  };

  const handleGameEnd = (result: 'win' | 'loss' | 'draw') => {
    setGameResult(result);
    
    const newWins = result === 'win' ? wins + 1 : wins;
    const newLosses = result === 'loss' ? losses + 1 : losses;
    
    setWins(newWins);
    setLosses(newLosses);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ wins: newWins, losses: newLosses }));
    
    if (result === 'win') {
      toast.success(`🎉 ${t.victory}`, { duration: 5000 });
    } else if (result === 'loss') {
      toast.error(t.defeatMessage, { duration: 5000 });
    }
  };

  const handleSquareClick = (x: number, y: number) => {
    if (gameState.currentPlayer !== playerSide || gameState.isCheckmate || isAIThinking) return;

    const clickedPiece = gameState.board[y][x];

    // If a piece is selected
    if (gameState.selectedPiece) {
      // Check if clicked position is a valid move
      const isValidMove = gameState.validMoves.some(
        move => move.x === x && move.y === y
      );

      if (isValidMove) {
        const move: Move = {
          from: gameState.selectedPiece.position,
          to: { x, y },
          piece: gameState.selectedPiece,
          capturedPiece: clickedPiece || undefined,
        };
        executeMove(move);
        setLastMove({ x, y });
        
        if (clickedPiece) {
          toast.success(`${t.greatMove} 🎯`);
        } else {
          toast.success(t.greatMove);
        }
      } else if (clickedPiece && clickedPiece.side === playerSide) {
        // Select a different piece
        const moves = getValidMoves(clickedPiece, gameState.board);
        setGameState({
          ...gameState,
          selectedPiece: clickedPiece,
          validMoves: moves,
        });
      } else {
        // Deselect
        setGameState({
          ...gameState,
          selectedPiece: null,
          validMoves: [],
        });
      }
    } else {
      // Select a piece
      if (clickedPiece && clickedPiece.side === playerSide) {
        const moves = getValidMoves(clickedPiece, gameState.board);
        setGameState({
          ...gameState,
          selectedPiece: clickedPiece,
          validMoves: moves,
        });
      }
    }
  };

  const handleUndo = () => {
    if (gameState.moveHistory.length < 2) {
      toast.error(t.undoLimit);
      return;
    }

    // Remove last 2 moves (player + AI)
    const newHistory = gameState.moveHistory.slice(0, -2);
    const newBoard = createInitialBoard();
    
    // Replay moves
    for (const move of newHistory) {
      newBoard[move.to.y][move.to.x] = { ...move.piece, position: move.to };
      newBoard[move.from.y][move.from.x] = null;
    }

    setGameState({
      ...gameState,
      board: newBoard,
      moveHistory: newHistory,
      selectedPiece: null,
      validMoves: [],
      isCheck: false,
      isCheckmate: false,
    });
    
    setLastMove(newHistory.length > 0 ? newHistory[newHistory.length - 1].to : null);
    toast.info(t.undo);
  };

  const handleRestart = () => {
    setGameState({
      board: createInitialBoard(),
      currentPlayer: 'red',
      selectedPiece: null,
      validMoves: [],
      moveHistory: [],
      capturedPieces: [],
      isCheck: false,
      isCheckmate: false,
      isStalemate: false,
    });
    setGameResult(null);
    setLastMove(null);
    toast.info(t.restart);
  };

  const handleDifficultyChange = (level: number) => {
    setDifficulty(level);
    toast.success(`${t.level} ${level}`);
  };

  const handleNewGame = () => {
    handleRestart();
    setGameResult(null);
  };

  const handleSelectSide = (side: PlayerSide) => {
    setPlayerSide(side);
    if (side === 'black') {
      // AI makes first move
      setTimeout(() => makeAIMove(), 500);
    }
    const sideText = side === 'red' ? t.playAsRed : t.playAsBlack;
    const descText = side === 'red' ? t.yourTurn : t.computerThinking;
    toast.success(sideText, {
      description: descText,
    });
  };

  if (!playerSide) {
    return <SideSelection onSelectSide={handleSelectSide} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-3 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
            {language === 'en' ? 'Xiangqi' : '象棋對弈'}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
            {gameState.currentPlayer === playerSide ? t.yourTurn : t.computerThinking}
            {gameState.isCheck && ` - ${t.check}`}
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 items-center lg:items-start justify-center">
          {/* Board - always first on mobile, second on desktop */}
          <div className="order-1 w-full flex justify-center">
            <GameBoard
              board={gameState.board}
              selectedPiece={gameState.selectedPiece}
              validMoves={gameState.validMoves}
              lastMove={lastMove}
              playerSide={playerSide}
              onSquareClick={handleSquareClick}
            />
          </div>

          {/* Controls - below board on mobile, on side on desktop */}
          <div className="order-2 w-full max-w-md lg:max-w-sm">
            <GameControls
              difficulty={difficulty}
              onDifficultyChange={handleDifficultyChange}
              onUndo={handleUndo}
              onRestart={handleRestart}
              onShowRules={() => setShowRules(true)}
              canUndo={gameState.moveHistory.length >= 2}
              wins={wins}
              losses={losses}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button 
            onClick={() => {
              setPlayerSide(null);
              handleRestart();
            }} 
            variant="outline"
            className="bg-green-100 hover:bg-green-200 border-green-300 text-green-800"
          >
            {language === 'en' ? 'Back to Home' : language === 'zh-CN' ? '返回首页' : '返回首頁'}
          </Button>
        </div>

        <RulesDialog open={showRules} onOpenChange={setShowRules} />
        <GameOverDialog 
          open={gameResult !== null} 
          result={gameResult}
          onNewGame={handleNewGame}
        />
      </div>
    </div>
  );
};

export default Index;
