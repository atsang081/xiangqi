# Chinese Chess (Xiangqi) Game Development Prompt for Qoder

## OBJECTIVE
Build a fully functional Chinese Chess (Xiangqi) game application with complete rule implementation, move validation, win condition checking, and turn-based gameplay mechanics.

## PROJECT OVERVIEW
Create a complete Xiangqi game application that enforces all official World Xiangqi Federation (WXF) rules, including piece movements, special restrictions, capture mechanics, and game-ending conditions.

---

## GAME BOARD SPECIFICATIONS

### Board Layout
- **Dimensions**: 9 vertical lines (files) × 10 horizontal lines (ranks) = 90 intersections
- **Coordinate System**: Use algebraic notation (files 0-8 from left to right, ranks 0-9 from bottom to top)
- **River Position**: Horizontal division between ranks 4 and 5 (ranks 0-4 belong to Red; ranks 5-9 belong to Black)
- **Palace Definition**: 3×3 area at center of each player's territory (files 3-5, ranks 0-2 for Red; files 3-5, ranks 7-9 for Black)
- **Palace Diagonals**: Mark the 5 palace positions with diagonal intersection lines for Advisor and General movement validation

### Board Representation
Implement as 2D array structure:
```
board[file][rank] where file = 0-8, rank = 0-9
Each intersection stores: piece_id, piece_type, piece_owner (RED/BLACK)
```

---

## PIECE DEFINITIONS AND MOVEMENT RULES

### 1. General (King) - 帥/將
**Count**: 1 per player | **Initial Position**: Center of palace (file 4, rank 1 for Red; file 4, rank 8 for Black)

**Movement**:
- Moves exactly 1 intersection orthogonally (up, down, left, right only)
- Cannot move diagonally
- Cannot leave the palace boundaries
- Cannot face opposing General directly on same file with zero intervening pieces (Flying General rule violation)

**Capture**: Yes, by moving to occupied intersection

**Restrictions**:
- Illegal if moves outside palace (3-5 files, 0-2 ranks for Red; 3-5 files, 7-9 ranks for Black)
- Subject to Flying General rule validation before move confirmation

**Special Logic**:
- Winning piece: If this piece is captured or checkmated, player loses immediately
- Check detection: After opponent moves, validate if General is under attack

---

### 2. Advisor (Guard) - 仕/士
**Count**: 2 per player | **Initial Positions**: Adjacent to General (files 3-5, rank 0 and rank 2 for Red)

**Movement**:
- Moves exactly 1 intersection diagonally
- Must stay on the palace diagonal lines only (5 legal positions available: center + 4 corners)
- Cannot move orthogonally
- Cannot leave palace

**Capture**: Yes, by moving to occupied intersection

**Restrictions**:
- Illegal if moves outside palace diagonals
- Cannot move orthogonally to adjacent squares

**Legal Palace Positions** (for both colors in their respective palaces):
- Center: (4, 1) for Red, (4, 8) for Black
- Corners: (3, 0), (5, 0), (3, 2), (5, 2) for Red; (3, 7), (5, 7), (3, 9), (5, 9) for Black

---

### 3. Elephant (Minister) - 象/相
**Count**: 2 per player | **Initial Positions**: Files 2-6, rank 0 for Red; rank 9 for Black

**Movement**:
- Moves exactly 2 intersections diagonally in any direction
- Cannot jump over pieces; blocked if any piece occupies the intermediate diagonal intersection

**Capture**: Yes, by moving to occupied intersection

**Restrictions**:
- **River Crossing**: Cannot cross the river; confined to player's own territory (ranks 0-4 for Red, ranks 5-9 for Black)
- **Blocking Rule**: If any piece (friendly or enemy) occupies the midpoint of the diagonal move, the Elephant cannot move in that direction

**Blocking Logic**:
```
For move from (file1, rank1) to (file2, rank2):
Midpoint = ((file1 + file2) / 2, (rank1 + rank2) / 2)
If midpoint contains any piece: BLOCKED
```

---

### 4. Horse (Knight) - 馬/傌
**Count**: 2 per player | **Initial Positions**: Files 1-7, rank 0 for Red; rank 9 for Black

**Movement**:
- Moves in an "L" shape: 1 intersection orthogonally, then 1 intersection diagonally away
- **NOT like Western chess knights** (no diagonal-first-then-orthogonal)
- Available moves from any position: Up-Left, Up-Right, Down-Left, Down-Right, Left-Up, Left-Down, Right-Up, Right-Down

**Capture**: Yes, by moving to occupied intersection

**Restrictions**:
- **Leg Blocking Rule**: If any piece (friendly or enemy) occupies the orthogonal space adjacent to the Horse (in the direction of movement), the Horse CANNOT move in that direction
- Must check blocking before validating diagonal continuation

**Blocking Validation**:
```
For Horse at (file, rank) moving toward direction D:
Check orthogonal space in direction D
If occupied: Move is BLOCKED regardless of diagonal space status
If not occupied: Proceed to validate diagonal space
```

---

### 5. Chariot (Rook) - 車/俥
**Count**: 2 per player | **Initial Positions**: Corners of board (files 0-8, rank 0 for Red; rank 9 for Black)

**Movement**:
- Moves any number of intersections orthogonally (horizontal or vertical)
- Like a Rook in Western chess
- Cannot jump over pieces

**Capture**: Yes, captures first piece in path by landing on it; cannot capture beyond first piece

**Restrictions**:
- Cannot move through pieces (path must be clear to destination)
- Path blocking: Move is illegal if any piece occupies intermediate intersection

**Special Notes**:
- Most powerful piece (aside from combinations)
- Value: 9 points in evaluation functions

---

### 6. Cannon - 炮/砲
**Count**: 2 per player | **Initial Positions**: Files 1-7, rank 2 for Red; rank 7 for Black

**Movement** (Non-Capturing):
- Moves any number of intersections orthogonally (like Chariot when not capturing)
- Cannot jump over pieces when moving without capturing

**Capture Mechanism** (Unique):
- **Must jump over exactly 1 piece** (called "cannon mount")
- The mount can be any piece (friendly or enemy)
- Lands on and captures the first piece AFTER the mount
- Captures only the piece immediately after the mount; cannot capture the mount itself

**Restrictions**:
- Non-capture moves blocked by any piece in path
- Capture move blocked if no mount piece exists in path
- Capture blocked if no enemy piece exists immediately after mount
- Cannot capture adjacent pieces without a mount

**Capture Validation Logic**:
```
For Cannon at (file_c, rank_c) moving toward (file_t, rank_t):
1. If capturing:
   a. Find first piece in path = MOUNT
   b. If no mount found: Move ILLEGAL
   c. Find next piece after mount = TARGET
   d. If target is friendly: Move ILLEGAL
   e. If no target exists: Move ILLEGAL
   f. If target exists and is enemy: CAPTURE ALLOWED
2. If not capturing:
   a. Check path is clear: Path LEGAL
   b. If any piece in path: Move ILLEGAL
```

---

### 7. Soldier (Pawn) - 兵/卒
**Count**: 5 per player | **Initial Positions**: Ranks 3 for Red; rank 6 for Black (spread across files 0, 2, 4, 6, 8)

**Movement** (Before Crossing River):
- Moves exactly 1 intersection **forward only** (away from player's side)
- Cannot move sideways or backward
- Cannot move diagonally

**Movement** (After Crossing River):
- Moves exactly 1 intersection forward OR 1 intersection sideways (left/right)
- Forms a "T" shaped movement pattern
- **Still cannot move backward** under any circumstances

**Capture**: By moving forward (or sideways after crossing river) into enemy piece

**Restrictions**:
- **No Backward Movement**: Ever; illegal move
- **No Retreat**: Cannot move toward player's own side
- **No Promotion**: Unlike Western chess, does not promote to other pieces
- **River Crossing Condition**: Soldier gains sideways movement only after crossing to opponent's territory

**River Crossing Logic**:
```
Soldier crossed river = (Red soldier rank ≥ 5) OR (Black soldier rank ≤ 4)
```

---

## SPECIAL GAME RULES AND RESTRICTIONS

### Flying General Rule (對面將)
**Definition**: Two Generals cannot directly face each other on the same file with zero intervening pieces.

**Implementation**:
- After each move, scan the file containing the moved piece
- Check if both Generals are on the same file
- Iterate through ranks between Generals; if no pieces exist between them, move is ILLEGAL
- Must reject move before finalizing turn

**Validation Function**:
```
IF move_causes_generals_facing():
    REJECT_MOVE("Flying General: Move illegal")
```

---

### Check and Checkmate Detection

**Check** (將):
- General is under direct attack from opponent's piece
- Opponent must announce "Check" (optional in casual play)
- Defending player MUST resolve check by:
  1. Moving General to safety
  2. Blocking the attack with another piece
  3. Capturing the attacking piece
  4. Removing cannon mount (if attack is from cannon)

**Checkmate** (將死):
- General is under attack (in check)
- No legal move exists to escape attack
- Player loses immediately
- Win condition for opponent

**Stalemate** (無著):
- Player has no legal moves available
- Player LOSES (unlike Western chess)
- Opponent wins immediately

**Check Detection Logic**:
```
FOR each opponent piece:
    IF piece can capture General:
        RETURN Check = TRUE
        
RETURN Check = FALSE
```

**Checkmate Detection Logic**:
```
IF General in Check:
    FOR each friendly piece:
        FOR each legal move of piece:
            simulate_move()
            IF General no longer in check after move:
                RETURN Checkmate = FALSE
    RETURN Checkmate = TRUE
```

---

### Perpetual Check Rule (長將)
**Definition**: A player cannot indefinitely deliver check to opponent's General.

**Implementation**:
- Track move history (last 8-16 moves minimum)
- If same piece delivers check to General 3+ times consecutively without changing strategy:
  - Move is ILLEGAL
  - Player must change move pattern
  - Penalty: Loss of game in tournament play

**Tournament Rule**: Strict prohibition; player must escape the pattern

---

### Perpetual Chase Rule (長捉)
**Definition**: A player cannot indefinitely threaten to capture the same opponent piece.

**Implementation**:
- Track threatened pieces and move patterns
- If same piece is threatened with capture 3+ times consecutively without capturing or changing pattern:
  - Move is ILLEGAL
  - Player must change strategy
  - Penalty: Loss of game in tournament play

**Tournament Rule**: Strict prohibition; player must escape the pattern

---

## GAME FLOW AND TURN STRUCTURE

### Turn Sequence
1. **Red's Turn** (always starts first, except in handicap games)
2. **Move Selection**: Select piece and target intersection
3. **Move Validation**: Check all movement rules, capture rules, and special restrictions
4. **Legality Check**: Verify move does not leave/place own General in check (including Flying General)
5. **Move Execution**: Remove captured piece (if any); place piece at target
6. **Post-Move Validation**:
   - Check if opponent in check
   - Check if opponent checkmated
   - Check if opponent stalemated
   - Check for draw conditions
7. **Turn End**: Switch to Black's turn
8. **Repeat** until game end

---

## WIN, LOSS, AND DRAW CONDITIONS

### Victory Conditions (Player Wins)
1. **Checkmate**: Opponent's General is in check and has no legal move to escape
2. **Resignation**: Opponent concedes
3. **Time Expiration**: In timed games, opponent's time runs out
4. **Stalemate**: Opponent has no legal moves available
5. **Rule Violation**: Opponent makes illegal move (cannot escape perpetual check/chase)

### Loss Conditions (Player Loses)
1. **Checkmate**: Own General is checkmated
2. **Stalemate**: Own player has no legal moves
3. **Resignation**: Player concedes
4. **Time Expiration**: Player's time runs out
5. **Rule Violation**: Player repeatedly attempts illegal moves or violates perpetual check/chase rules

### Draw Conditions
1. **Mutual Agreement**: Both players agree to draw
2. **Insufficient Material**: Both players have only defensive pieces remaining (both sides cannot deliver checkmate)
   - Example: Only Generals and Advisors remain
3. **Move Limit Without Capture**:
   - **World Xiangqi Federation (WXF) Rule**: No capture in 50 moves → draw
   - **Chinese Xiangqi Association (CXA) Rule**: No capture in 60 moves → draw
   - Track consecutive non-capturing moves; reset on any capture
4. **Threefold Repetition**: Same board position repeats 3 times with same player to move → draw
   - Track board hash/state; detect repetition
5. **Insufficient Attack Pieces**: If neither side can force checkmate with remaining pieces → draw

---

## DATA STRUCTURES AND VARIABLES

### Board State
```
board = 2D array [9][10]
Each cell: {
  piece_id: int (1-32),
  piece_type: string (GENERAL, ADVISOR, ELEPHANT, HORSE, CHARIOT, CANNON, SOLDIER),
  piece_owner: string (RED, BLACK),
  position: {file: int 0-8, rank: int 0-9}
}
```

### Game State
```
game_state = {
  current_turn: string (RED, BLACK),
  move_history: array of Move objects,
  board_history: array of board states (for repetition detection),
  capture_count: int (for 50/60-move rule),
  check_status: boolean,
  game_over: boolean,
  winner: string (RED, BLACK, DRAW),
  move_count: int (total moves played)
}
```

### Move Object
```
move = {
  from_position: {file, rank},
  to_position: {file, rank},
  piece_type: string,
  piece_id: int,
  is_capture: boolean,
  captured_piece: piece object (if capture),
  timestamp: datetime,
  move_notation: string (in standard notation)
}
```

### Piece Class
```
Piece {
  id: int,
  type: GENERAL | ADVISOR | ELEPHANT | HORSE | CHARIOT | CANNON | SOLDIER,
  owner: RED | BLACK,
  current_position: {file, rank},
  is_captured: boolean,
  
  get_legal_moves(board_state): array of {file, rank},
  can_move_to(target_position, board_state): boolean,
  validate_move(from, to, board_state): boolean
}
```

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Core Board and Piece Setup
- [ ] Implement 9×10 board representation
- [ ] Create Piece class hierarchy for all 7 piece types
- [ ] Initialize starting position (all 32 pieces)
- [ ] Implement piece getters/setters

### Phase 2: Movement Validation Engine
- [ ] General movement (1 orthogonal in palace)
- [ ] Advisor movement (1 diagonal in palace only)
- [ ] Elephant movement (2 diagonal with blocking; no river crossing)
- [ ] Horse movement (1 ortho + 1 diagonal with leg blocking)
- [ ] Chariot movement (any orthogonal; no jumping)
- [ ] Cannon movement (any orthogonal non-capture; mount-jump capture)
- [ ] Soldier movement (forward before river; forward + sideways after)

### Phase 3: Special Rules Engine
- [ ] Flying General detection and prevention
- [ ] Check detection algorithm
- [ ] Checkmate detection algorithm
- [ ] Stalemate detection algorithm
- [ ] Perpetual check prevention
- [ ] Perpetual chase prevention

### Phase 4: Game State Management
- [ ] Turn alternation (Red → Black → Red)
- [ ] Move history tracking
- [ ] Board history tracking (for repetition detection)
- [ ] Capture count tracking (for 50/60-move rule)

### Phase 5: Win/Loss/Draw Detection
- [ ] Checkmate logic
- [ ] Stalemate logic
- [ ] Draw by mutual agreement
- [ ] Draw by insufficient material
- [ ] Draw by 50/60-move rule
- [ ] Draw by threefold repetition

### Phase 6: User Interface (if building UI)
- [ ] Display board with all pieces
- [ ] Highlight legal moves for selected piece
- [ ] Highlight attacked squares
- [ ] Show move history
- [ ] Display check/checkmate/draw notifications

### Phase 7: Testing and Validation
- [ ] Test all piece movements individually
- [ ] Test capture scenarios
- [ ] Test Flying General prevention
- [ ] Test checkmate detection
- [ ] Test stalemate detection
- [ ] Test draw conditions
- [ ] Test edge cases (Cannon mount capture, Horse leg blocking, etc.)

---

## IMPORTANT NOTES FOR DEVELOPERS

1. **Coordinate System**: Use consistent coordinate system throughout (file 0-8, rank 0-9; or file a-i, rank 1-10)

2. **Move Validation Order**: Always validate in this order:
   - Piece exists at source position
   - Piece belongs to current player
   - Destination is within board boundaries
   - Basic piece movement rules
   - Capture rules (if destination occupied)
   - Special restrictions (river, palace, blocking)
   - General not left in check after move
   - Flying General rule not violated

3. **Repetition Tracking**: Use board state hash/checksum to efficiently detect repeated positions

4. **Performance Optimization**: Pre-compute legal moves for AI/analysis rather than calculating on-demand

5. **Rule Priorities**: WXF rules take precedence for international compatibility; CXA rules as alternative

6. **Error Handling**: Reject illegal moves gracefully; provide clear error messages to player

7. **Notation Standard**: Implement standard Xiangqi move notation for game recording and replay

---

## QUEST MODE EXECUTION STEPS

1. **Spec Generation**: Review and approve all game rules defined above
2. **Component Development**: Create piece classes and movement validators
3. **Engine Development**: Build game state engine with rule enforcement
4. **Integration**: Connect all components; test full game flow
5. **Validation**: Run comprehensive test suite against all rules
6. **Refinement**: Address any edge cases or bugs discovered
7. **Documentation**: Generate code comments and user guide

---

**Start with Phase 1 immediately; use chain-of-thought reasoning before implementing each piece's movement validation.**