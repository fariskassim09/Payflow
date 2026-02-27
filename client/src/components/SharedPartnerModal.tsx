import { useState } from 'react';
import { X, Copy, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface SharedPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SharedPartnerModal({ isOpen, onClose }: SharedPartnerModalProps) {
  const [shareCode, setShareCode] = useState('SP-' + Math.random().toString(36).substring(2, 10).toUpperCase());
  const [sharedPartners, setSharedPartners] = useState<Array<{ code: string; name: string; date: string }>>([
    { code: 'SP-ABC12345', name: 'Partner 1', date: '2026-02-20' },
  ]);
  const [newPartnerName, setNewPartnerName] = useState('');

  const generateNewCode = () => {
    const newCode = 'SP-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    setShareCode(newCode);
    toast.success('New sharing code generated!');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareCode);
    toast.success('Sharing code copied to clipboard!');
  };

  const addPartner = () => {
    if (newPartnerName.trim()) {
      const newPartner = {
        code: shareCode,
        name: newPartnerName,
        date: new Date().toISOString().split('T')[0],
      };
      setSharedPartners([...sharedPartners, newPartner]);
      setNewPartnerName('');
      setShareCode('SP-' + Math.random().toString(36).substring(2, 10).toUpperCase());
      toast.success(`${newPartnerName} added to shared partners!`);
    }
  };

  const removePartner = (code: string) => {
    setSharedPartners(sharedPartners.filter(p => p.code !== code));
    toast.success('Partner removed from sharing');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50">
      <div className="bg-card w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Shared Partner</h2>
          <button
            onClick={onClose}
            className="text-secondary-foreground hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Generate Sharing Code Section */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-foreground">Generate Sharing Code</h3>
          
          {/* Current Code Display */}
          <div className="bg-secondary/50 rounded-2xl p-4 space-y-3">
            <p className="text-sm text-secondary-foreground">Your Sharing Code</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-card border border-border rounded-xl px-4 py-3 font-mono font-bold text-accent text-lg">
                {shareCode}
              </div>
              <button
                onClick={copyToClipboard}
                className="p-3 bg-accent text-accent-foreground rounded-xl hover:bg-accent/90 transition-all duration-300 active:scale-95"
              >
                <Copy size={20} />
              </button>
            </div>
            <p className="text-xs text-secondary-foreground">
              Share this code with your partner to let them view your salary summary
            </p>
          </div>

          {/* Generate New Code Button */}
          <button
            onClick={generateNewCode}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary border border-border rounded-xl text-foreground hover:bg-secondary/80 transition-all duration-300 font-medium"
          >
            <RefreshCw size={18} />
            Generate New Code
          </button>
        </div>

        {/* Add Partner Section */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-foreground">Add Shared Partner</h3>
          
          <div className="space-y-3">
            <input
              type="text"
              value={newPartnerName}
              onChange={(e) => setNewPartnerName(e.target.value)}
              placeholder="e.g., Spouse, Partner, Family..."
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder-secondary-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              onClick={addPartner}
              disabled={!newPartnerName.trim()}
              className="w-full px-4 py-3 bg-accent text-accent-foreground rounded-xl hover:bg-accent/90 transition-all duration-300 font-medium disabled:opacity-50 active:scale-95"
            >
              Add Partner
            </button>
          </div>
        </div>

        {/* Shared Partners List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Shared Partners ({sharedPartners.length})</h3>
          
          {sharedPartners.length > 0 ? (
            <div className="space-y-2">
              {sharedPartners.map((partner) => (
                <div
                  key={partner.code}
                  className="flex items-center justify-between bg-secondary/50 rounded-2xl p-4 border border-border hover:shadow-lg hover:shadow-accent/10 transition-all duration-300"
                >
                  <div>
                    <p className="font-semibold text-foreground">{partner.name}</p>
                    <p className="text-xs text-secondary-foreground">
                      Code: {partner.code} • Shared: {partner.date}
                    </p>
                  </div>
                  <button
                    onClick={() => removePartner(partner.code)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-secondary-foreground py-6">
              No shared partners yet. Add one to get started!
            </p>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-3 bg-secondary border border-border rounded-xl text-foreground hover:bg-secondary/80 transition-all duration-300 font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
}
