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
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">象棋遊戲規則</DialogTitle>
          <DialogDescription>
            學習象棋基礎，成為高手！
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 text-sm sm:text-base">
            <section>
              <h3 className="font-bold text-base sm:text-lg mb-2">遊戲目標</h3>
              <p>將死對方的將（帥）即可獲勝！</p>
            </section>

            <section>
              <h3 className="font-bold text-base sm:text-lg mb-2">棋子介紹</h3>
              <ul className="space-y-2">
                <li>
                  <strong>將（帥）：</strong>在九宮內每次移動一格，不能與對方的將（帥）面對面。
                </li>
                <li>
                  <strong>士（仕）：</strong>在九宮內沿斜線移動一格。
                </li>
                <li>
                  <strong>象（相）：</strong>沿斜線移動兩格，不能過河，也不能越子。
                </li>
                <li>
                  <strong>馬：</strong>走「日」字形，如果相鄰位置有棋子則會被蹩腳。
                </li>
                <li>
                  <strong>車：</strong>橫豎直線移動任意格數，不能越子。
                </li>
                <li>
                  <strong>炮（砲）：</strong>移動方式與車相同，但吃子時必須跳過一個棋子。
                </li>
                <li>
                  <strong>兵（卒）：</strong>只能向前移動一格，過河後可以左右移動。
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-base sm:text-lg mb-2">特殊規則</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>楚河漢界</strong>將棋盤分為兩半</li>
                <li><strong>九宮</strong>是將（帥）和士（仕）的活動範圍</li>
                <li>象（相）不能過河</li>
                <li>雙方的將（帥）不能在同一直線上面對面</li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-base sm:text-lg mb-2">新手提示</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>用士（仕）和象（相）保護你的將（帥）</li>
                <li>利用車和炮發動強力攻擊</li>
                <li>讓兵（卒）過河以獲得更大的靈活性</li>
                <li>注意馬的蹩腳和炮的跳子</li>
                <li>控制棋盤中央</li>
              </ul>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
