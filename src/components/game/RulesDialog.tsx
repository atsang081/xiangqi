import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';

interface RulesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RulesDialog({ open, onOpenChange }: RulesDialogProps) {
  const { t } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">{t.xiangqiRules}</DialogTitle>
          <DialogDescription>
            {t.basicRulesText}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 text-sm sm:text-base">
            <section>
              <h3 className="font-bold text-base sm:text-lg mb-2">{t.basicRules}</h3>
              <p>{t.basicRulesText}</p>
            </section>

            <section>
              <h3 className="font-bold text-base sm:text-lg mb-2">{t.piecesAndMoves}</h3>
              <ul className="space-y-2">
                <li>
                  <strong>{t.general}:</strong> {t.generalMove}
                </li>
                <li>
                  <strong>{t.advisor}:</strong> {t.advisorMove}
                </li>
                <li>
                  <strong>{t.elephant}:</strong> {t.elephantMove}
                </li>
                <li>
                  <strong>{t.horse}:</strong> {t.horseMove}
                </li>
                <li>
                  <strong>{t.chariot}:</strong> {t.chariotMove}
                </li>
                <li>
                  <strong>{t.cannon}:</strong> {t.cannonMove}
                </li>
                <li>
                  <strong>{t.soldier}:</strong> {t.soldierMove}
                </li>
              </ul>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
