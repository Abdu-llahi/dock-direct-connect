import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Download, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface BrokerCarrierAgreementProps {
  isOpen: boolean;
  onClose: () => void;
  loadDetails: {
    id: number;
    origin: string;
    destination: string;
    rate: string;
    shipper: string;
    driver: string;
  };
  onSign: () => void;
}

const BrokerCarrierAgreement = ({ isOpen, onClose, loadDetails, onSign }: BrokerCarrierAgreementProps) => {
  const [isSigned, setIsSigned] = useState(false);
  const [driverSignature, setDriverSignature] = useState('');

  const handleSign = () => {
    if (!driverSignature.trim()) {
      alert('Please enter your digital signature');
      return;
    }
    setIsSigned(true);
    onSign();
  };

  const agreementText = `
BROKER-CARRIER AGREEMENT

Load ID: ${loadDetails.id}
Date: ${new Date().toLocaleDateString()}

PARTIES:
Shipper: ${loadDetails.shipper}
Carrier: ${loadDetails.driver}

LOAD DETAILS:
Origin: ${loadDetails.origin}
Destination: ${loadDetails.destination}
Rate: ${loadDetails.rate}

TERMS AND CONDITIONS:
1. The Carrier agrees to transport the described freight from origin to destination.
2. Payment terms: Net 30 days upon completion and receipt of signed POD.
3. The Carrier shall maintain proper insurance coverage during transport.
4. Any damages or delays must be reported immediately.
5. This agreement is binding upon acceptance by both parties.

By signing below, both parties agree to these terms.
  `;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Broker-Carrier Agreement
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Agreement Document */}
          <div className="border rounded-lg p-6 bg-gray-50">
            <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
              {agreementText}
            </pre>
          </div>

          {/* Signature Section */}
          {!isSigned ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Digital Signature (Type your full name)</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  placeholder="Type your full legal name as signature"
                  value={driverSignature}
                  onChange={(e) => setDriverSignature(e.target.value)}
                />
              </div>
              
              <div className="text-xs text-gray-600">
                By typing your name above, you agree to be legally bound by this electronic signature.
              </div>

              <div className="flex gap-4">
                <Button onClick={handleSign} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Sign Agreement
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Agreement Signed Successfully</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Signed by: {driverSignature} on {new Date().toLocaleString()}
                </p>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => window.print()} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BrokerCarrierAgreement;