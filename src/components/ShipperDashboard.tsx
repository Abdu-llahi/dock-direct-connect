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
import PricingModal from "@/components/monetization/PricingModal";

interface ShipperDashboardProps {
  onLogout: () => void;
}

const ShipperDashboard = ({ onLogout }: ShipperDashboardProps) => {
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<'free' | 'premium'>('free');
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

  const handlePlatformFeeCalculation = (loadRate: string) => {
    const rate = parseFloat(loadRate.replace('$', '').replace(',', ''));
    const feePercentage = currentPlan === 'premium' ? 0.025 : 0.03;
    return (rate * feePercentage).toFixed(2);
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
        {/* Plan Status Alert */}
        {currentPlan === 'free' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-800">Upgrade to Premium</h3>
                <p className="text-sm text-blue-600">
                  Get priority listing, reduced fees (2.5% vs 3%), and emergency push notifications
                </p>
              </div>
              <Button 
                onClick={() => setShowPricingModal(true)}
                className="bg-dock-blue hover:bg-blue-800"
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        )}

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

        {/* Enhanced Stats with Monetization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">This Month's Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Platform fees ({currentPlan === 'premium' ? '2.5%' : '3%'})</span>
                  <span className="font-medium">${currentPlan === 'premium' ? '615' : '738'}</span>
                </div>
                {currentPlan === 'premium' && (
                  <div className="flex justify-between">
                    <span className="text-sm">Premium subscription</span>
                    <span className="font-medium">$29</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${currentPlan === 'premium' ? '644' : '738'}</span>
                </div>
                {currentPlan === 'free' && (
                  <p className="text-xs text-green-600">Save $123/month with Premium!</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Premium Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-2 ${currentPlan === 'premium' ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Emergency Push Notifications
                </div>
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-2 ${currentPlan === 'premium' ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Priority Load Listing
                </div>
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-2 ${currentPlan === 'premium' ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Reduced Platform Fees
                </div>
                {currentPlan === 'free' && (
                  <Button 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => setShowPricingModal(true)}
                  >
                    Upgrade
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Load Insurance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>Protect your loads with optional insurance</p>
                <p className="font-medium">2% additional fee per load</p>
                <p className="text-xs text-gray-600">Covers damage, theft, and delays</p>
                <Button size="sm" variant="outline" className="w-full mt-2">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

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

      {showPricingModal && (
        <PricingModal
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
          userType="shipper"
          currentPlan={currentPlan}
        />
      )}
    </div>
  );
};

export default ShipperDashboard;
