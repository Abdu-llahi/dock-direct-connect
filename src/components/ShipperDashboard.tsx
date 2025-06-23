
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Bell } from "lucide-react";
import LoadPostingModal from "@/components/LoadPostingModal";
import ChatModal from "@/components/ChatModal";
import DocumentModal from "@/components/DocumentModal";
import TrackingModal from "@/components/TrackingModal";
import RatingModal from "@/components/RatingModal";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import LoadList from "@/components/dashboard/LoadList";

interface ShipperDashboardProps {
  onLogout: () => void;
}

const ShipperDashboard = ({ onLogout }: ShipperDashboardProps) => {
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedLoadId, setSelectedLoadId] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [emergencyMode, setEmergencyMode] = useState(false);

  // Mock data with enhanced features
  const activeLoads = [
    {
      id: 1,
      origin: "Chicago, IL",
      destination: "Detroit, MI",
      pallets: 22,
      weight: "44,000 lbs",
      rate: "$2,400",
      urgent: true,
      status: "driver_assigned",
      postedAt: "2 hours ago",
      driver: "Mike Rodriguez",
      driverRating: 4.9,
      tracking: {
        currentLocation: "I-94 near Kalamazoo, MI",
        eta: "2:45 PM",
        progress: 65
      },
      documents: {
        contract: "signed",
        bol: "uploaded",
        pod: "pending"
      }
    },
    {
      id: 2,
      origin: "Atlanta, GA",
      destination: "Miami, FL",
      pallets: 15,
      weight: "30,000 lbs",
      rate: "$1,800",
      urgent: false,
      status: "seeking_driver",
      postedAt: "1 day ago",
      bids: 3
    }
  ];

  const completedLoads = [
    {
      id: 3,
      origin: "Dallas, TX",
      destination: "Houston, TX",
      pallets: 18,
      weight: "36,000 lbs",
      rate: "$1,200",
      completedAt: "3 days ago",
      driver: "Mike Rodriguez"
    }
  ];

  const handleOpenChat = (loadId: number, driver: string) => {
    setSelectedLoadId(loadId.toString());
    setSelectedDriver(driver);
    setShowChatModal(true);
  };

  const handleOpenDocuments = (loadId: number) => {
    setSelectedLoadId(loadId.toString());
    setShowDocumentModal(true);
  };

  const handleOpenTracking = (loadId: number) => {
    setSelectedLoadId(loadId.toString());
    setShowTrackingModal(true);
  };

  const handleOpenRating = (loadId: number, driver: string) => {
    setSelectedLoadId(loadId.toString());
    setSelectedDriver(driver);
    setShowRatingModal(true);
  };

  const handleEmergencyToggle = (checked: boolean) => {
    setEmergencyMode(checked);
    if (checked) {
      console.log('🚨 EMERGENCY PUSH ACTIVATED - Notifying all nearby drivers');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        userType="shipper"
        onLogout={onLogout}
        emergencyMode={emergencyMode}
        onEmergencyToggle={handleEmergencyToggle}
        onPostLoad={() => setShowLoadModal(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Emergency Mode Alert */}
        {emergencyMode && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-red-500" />
              <span className="font-medium text-red-800">Emergency Push Mode Active</span>
            </div>
            <p className="text-sm text-red-600 mt-1">
              All nearby qualified drivers are being notified of your urgent loads.
            </p>
          </div>
        )}

        <StatsCards userType="shipper" />

        {/* Main Content */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active Loads</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <LoadList
              loads={activeLoads}
              userType="shipper"
              onOpenChat={handleOpenChat}
              onOpenDocuments={handleOpenDocuments}
              onOpenTracking={handleOpenTracking}
            />
          </TabsContent>

          <TabsContent value="completed">
            <LoadList loads={completedLoads} userType="shipper" />
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Document Management</CardTitle>
                <CardDescription>Manage contracts, BOLs, and delivery confirmations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a load to manage documents</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {showLoadModal && (
        <LoadPostingModal
          isOpen={showLoadModal}
          onClose={() => setShowLoadModal(false)}
        />
      )}

      {showChatModal && (
        <ChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          userType="shipper"
          conversationWith={selectedDriver}
          loadId={selectedLoadId}
        />
      )}

      {showDocumentModal && (
        <DocumentModal
          isOpen={showDocumentModal}
          onClose={() => setShowDocumentModal(false)}
          userType="shipper"
          loadId={selectedLoadId}
        />
      )}

      {showTrackingModal && (
        <TrackingModal
          isOpen={showTrackingModal}
          onClose={() => setShowTrackingModal(false)}
          loadId={selectedLoadId}
        />
      )}

      {showRatingModal && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          userType="shipper"
          ratingFor={selectedDriver}
          loadId={selectedLoadId}
        />
      )}
    </div>
  );
};

export default ShipperDashboard;
