
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Check, Clock, Camera } from "lucide-react";

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'shipper' | 'driver';
  loadId: string;
}

const DocumentModal = ({ isOpen, onClose, userType, loadId }: DocumentModalProps) => {
  const [signature, setSignature] = useState("");

  const documents = [
    {
      id: 1,
      name: "Load Agreement Contract",
      type: "contract",
      status: "signed",
      uploadedBy: "shipper",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      name: "Bill of Lading (BOL)",
      type: "bol",
      status: "pending",
      uploadedBy: "shipper",
      timestamp: "1 hour ago"
    },
    {
      id: 3,
      name: "Pickup Photo - Front",
      type: "photo",
      status: "uploaded",
      uploadedBy: "driver",
      timestamp: "30 minutes ago"
    },
    {
      id: 4,
      name: "Proof of Delivery (POD)",
      type: "pod",
      status: "pending",
      uploadedBy: null,
      timestamp: null
    }
  ];

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Digital signature:', signature);
    setSignature("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'signed':
        return <Badge className="bg-green-500 text-white"><Check className="h-3 w-3 mr-1" />Signed</Badge>;
      case 'uploaded':
        return <Badge className="bg-blue-500 text-white"><Check className="h-3 w-3 mr-1" />Uploaded</Badge>;
      case 'pending':
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-dock-blue" />
            <span>Load Documents - #{loadId}</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="documents" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="sign">Digital Sign</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-4">
            <div className="space-y-3">
              {documents.filter(doc => doc.type !== 'photo').map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{doc.name}</h4>
                    <p className="text-sm text-gray-500">
                      {doc.uploadedBy && `Uploaded by ${doc.uploadedBy}`} {doc.timestamp && `• ${doc.timestamp}`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(doc.status)}
                    <Button variant="outline" size="sm">
                      {doc.status === 'pending' ? 'Upload' : 'View'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {userType === 'shipper' && (
              <div className="border-t pt-4">
                <Button className="w-full bg-dock-blue hover:bg-blue-800">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Document
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="photos" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {documents.filter(doc => doc.type === 'photo').map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4">
                  <div className="aspect-video bg-gray-100 rounded mb-2 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="font-medium text-sm">{doc.name}</h4>
                  <p className="text-xs text-gray-500">{doc.timestamp}</p>
                </div>
              ))}
            </div>

            {userType === 'driver' && (
              <div className="border-t pt-4 space-y-2">
                <Button className="w-full bg-dock-orange hover:bg-orange-600">
                  <Camera className="mr-2 h-4 w-4" />
                  Take Pickup Photo
                </Button>
                <Button variant="outline" className="w-full">
                  <Camera className="mr-2 h-4 w-4" />
                  Take Delivery Photo
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sign" className="space-y-4">
            <form onSubmit={handleSign} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signature">Digital Signature</Label>
                <Input
                  id="signature"
                  placeholder="Type your full name to sign"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  required
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  By typing your name above, you agree to electronically sign this document.
                  This signature has the same legal effect as a handwritten signature.
                </p>
                <p className="text-xs text-gray-500">
                  Document: Load Agreement Contract #{loadId}
                </p>
              </div>

              <Button 
                type="submit" 
                className={`w-full ${
                  userType === 'shipper' 
                    ? 'bg-dock-blue hover:bg-blue-800' 
                    : 'bg-dock-orange hover:bg-orange-600'
                }`}
              >
                Sign Document
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentModal;
