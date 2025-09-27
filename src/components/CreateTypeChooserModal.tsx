import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { User, Users } from 'lucide-react';

interface CreateTypeChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChoosePairing: () => void;
  onChooseGroup: () => void;
}

export default function CreateTypeChooserModal({ isOpen, onClose, onChoosePairing, onChooseGroup }: CreateTypeChooserModalProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="glass-card border-0 max-w-lg p-0">
        <div className="flex flex-col">
          <DialogHeader className="px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="text-section-header font-semibold">What would you like to create?</DialogTitle>
            </div>
            <DialogDescription className="sr-only">Choose between creating a 1-on-1 pairing or hosting a group activity.</DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1-on-1 Partner */}
              <button
                onClick={() => { onClose(); onChoosePairing(); }}
                className="w-full glass-card rounded-2xl p-4 text-left hover:shadow-lg transition-all duration-200 hover:bg-white/70"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <Label className="font-semibold">Find a 1-on-1 Partner</Label>
                </div>
                <p className="text-subtext text-sm">Create a pairing request to match with a single partner based on your preferences.</p>
              </button>

              {/* Group Activity */}
              <button
                onClick={() => { onClose(); onChooseGroup(); }}
                className="w-full glass-card rounded-2xl p-4 text-left hover:shadow-lg transition-all duration-200 hover:bg-white/70"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <Label className="font-semibold">Host a Group Activity</Label>
                </div>
                <p className="text-subtext text-sm">Create an event that multiple people can join, set details and manage attendees.</p>
              </button>
            </div>

            <div className="pt-2">
              <Button onClick={onClose} variant="outline" className="w-full rounded-full">Cancel</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
