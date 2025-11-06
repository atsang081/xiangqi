import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RulesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RulesDialog({ open, onOpenChange }: RulesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">How to Play Chinese Chess</DialogTitle>
          <DialogDescription>
            Learn the basics of Xiangqi and become a master!
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-bold text-lg mb-2">Goal</h3>
              <p>Capture the opponent's General (帥/將) to win the game!</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">The Pieces</h3>
              <ul className="space-y-2">
                <li>
                  <strong>General (帥/將):</strong> Moves one space at a time within the palace. Cannot face the opponent's General directly.
                </li>
                <li>
                  <strong>Advisor (仕/士):</strong> Moves one space diagonally within the palace.
                </li>
                <li>
                  <strong>Elephant (相/象):</strong> Moves exactly two spaces diagonally. Cannot cross the river or jump over pieces.
                </li>
                <li>
                  <strong>Horse (馬):</strong> Moves in an "L" shape (2 spaces in one direction, 1 space perpendicular). Can be blocked if a piece is adjacent.
                </li>
                <li>
                  <strong>Chariot (車):</strong> Moves any number of spaces horizontally or vertically. Cannot jump over pieces.
                </li>
                <li>
                  <strong>Cannon (炮/砲):</strong> Moves like a chariot but must jump over exactly one piece to capture.
                </li>
                <li>
                  <strong>Soldier (兵/卒):</strong> Moves one space forward. After crossing the river, can also move sideways.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">Special Rules</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>The <strong>River</strong> divides the board in the middle</li>
                <li>The <strong>Palace</strong> is the 3×3 area where the General and Advisors must stay</li>
                <li>Elephants cannot cross the river</li>
                <li>The two Generals cannot face each other directly on the same file</li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">Tips for Beginners</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Protect your General with Advisors and Elephants</li>
                <li>Use Chariots and Cannons for powerful attacks</li>
                <li>Advance your Soldiers across the river for more flexibility</li>
                <li>Watch out for Horse blocks and Cannon jumping</li>
                <li>Control the center of the board</li>
              </ul>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
