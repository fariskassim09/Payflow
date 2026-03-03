import { useState, useEffect } from 'react';
import { X, Copy, RefreshCw, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useSalary } from '@/contexts/SalaryContext';
import { generateSharingCode, deleteShareCode } from '@/lib/firestoreService';

interface SharedPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SharedPartnerModal({ isOpen, onClose }: SharedPartnerModalProps) {
  const { user } = useAuth();
  const { salaryFrequency, budgetItems, monthlySalaries } = useSalary();
  const [shareCode, setShareCode] = useState('SP-' + Math.random().toString(36).substring(2, 10).toUpperCase());
  const [sharedPartners, setSharedPartners] = useState<Array<{ code: string; name: string; date: string }>>([]);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Generate initial code
    setShareCode('SP-' + Math.random().toString(36).substring(2, 10).toUpperCase());
  }, []);

  const generateNewCode = () => {
    const newCode = 'SP-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    setShareCode(newCode);
    toast.success('New sharing code generated!');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareCode);
    toast.success('Sharing code copied to clipboard!');
  };

  const addPartner = async () => {
    if (!newPartnerName.trim()) {
      toast.error('Please enter a partner name');
      return;
    }

    if (!user) {
      toast.error('Please log in to share with partners');
      return;
    }

    setLoading(true);
    try {
      // Save sharing code to Firebase
      await generateSharingCode(user.uid, newPartnerName, {
        salaryFrequency,
        budgetItems,
        monthlySalaries,
      });

      const newPartner = {
        code: shareCode,
        name: newPartnerName,
        date: new Date().toISOString().split('T')[0],
      };
      setSharedPartners([...sharedPartners, newPartner]);
      setNewPartnerName('');
      setShareCode('SP-' + Math.random().toString(36).substring(2, 10).toUpperCase());
      toast.success(`${newPartnerName} added to shared partners!`);
    } catch (error) {
      console.error('Error adding partner:', error);
      toast.error('Failed to add partner. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removePartner = async (code: string) => {
    if (!user) {
      toast.error('Please log in to manage shared partners');
      return;
    }

    setLoading(true);
    try {
      await deleteShareCode(user.uid, code);
      setSharedPartners(sharedPartners.filter(p => p.code !== code));
      toast.success('Partner removed from sharing');
    } catch (error) {
      console.error('Error removing partner:', error);
      toast.error('Failed to remove partner. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-[60]">
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

        {!user && (
          <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 mb-6">
            <p className="text-sm text-accent">Please log in to Settings to share your salary summary with partners</p>
          </div>
        )}

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
                disabled={!user}
                className="p-3 bg-accent text-accent-foreground rounded-xl hover:bg-accent/90 transition-all duration-300 active:scale-95 disabled:opacity-50"
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
            disabled={!user}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary border border-border rounded-xl text-foreground hover:bg-secondary/80 transition-all duration-300 font-medium disabled:opacity-50"
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
              disabled={!user || loading}
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder-secondary-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
            />
            <button
              onClick={addPartner}
              disabled={!newPartnerName.trim() || !user || loading}
              className="w-full px-4 py-3 bg-accent text-accent-foreground rounded-xl hover:bg-accent/90 transition-all duration-300 font-medium disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Partner'
              )}
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
                    disabled={loading}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-300 disabled:opacity-50"
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
