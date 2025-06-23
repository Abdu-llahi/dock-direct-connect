
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Home } from "lucide-react";
import ChatModal from "@/components/ChatModal";
import DocumentModal from "@/components/DocumentModal";
import RatingModal from "@/components/RatingModal";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import LoadList from "@/components/dashboard/LoadList";
import LoadFilters from "@/components/dashboard/LoadFilters";

interface DriverDashboardProps {
  onLogout: () => void;
}

const DriverDashboard = ({ onLogout }: DriverDashboardProps) => {
  const [searchRadius, setSearchRadius] = useState("100");
  const [sortBy, setSortBy] = useState("distance");
  const [showChatModal, setShowChatModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedLoadId, setSelectedLoadId] = useState("");
  const [selectedShipper, setSelectedShipper] = useState("");
  const [homeBaseMode, setHomeBaseMode] = useState(false);

  // Enhanced mock data
  const availableLoads = [
    {
      id: 1,
      origin: "Chicago, IL",
      destination: "Detroit, MI",
      distance: "45 miles",
      pallets: 22,
      weight: "44,000 lbs",
      rate: "$2,400",
      urgent: true,
      postedAt: "2 hours ago",
      pickupTime: "Today 6:00 PM",
      shipper: "Walmart Distribution",
      shipperRating: 4.8,
      towardHome: true,
      stackable: false
    },
    {
      id: 2,
      origin: "Milwaukee, WI",
      destination: "Indianapolis, IN",
      distance: "78 miles",
      pallets: 15,
      weight: "30,000 lbs",
      rate: "$1,950",
      urgent: false,
      postedAt: "4 hours ago",
      pickupTime: "Tomorrow 8:00 AM",
      shipper: "Target Distribution",
      shipperRating: 4.6,
      towardHome: false,
      stackable: true,
      stackInfo: "Possible 2nd pickup in Fort Wayne"
    },
    {
      id: 3,
      origin: "Grand Rapids, MI",
      destination: "Cleveland, OH",
      distance: "92 miles",
      pallets: 18,
      weight: "36,000 lbs",
      rate: "$2,100",
      urgent: false,
      postedAt: "6 hours ago",
      pickupTime: "Tomorrow 2:00 PM",
      shipper: "Amazon Fulfillment",
      shipperRating: 4.9,
      towardHome: true,
      stackable: false
    }
  ];

  const myLoads = [
    {
      id: 4,
      origin: "Atlanta, GA",
      destination: "Miami, FL",
      status: "in_transit",
      rate: "$1,800",
      deliveryTime: "Tomorrow 10:00 AM",
      shipper: "Home Depot Distribution",
      shipperRating: 4.7,
      paymentStatus: "escrow_held",
      documents: {
        pickup_photos: 2,
        pod_required: true
      }
    }
  ];

  const completedLoads = [
    {
      id: 5,
      origin: "Dallas, TX",
      destination: "Houston, TX",
      rate: "$1,200",
      completedAt: "3 days ago",
      shipper: "Walmart Distribution"
    }
  ];

  const filteredLoads = homeBaseMode 
    ? availableLoads.filter(load => load.towardHome)
    : availableLoads;

  const handleAcceptLoad = (loadId: number) => {
    console.log('Accepting load:', loadId);
  };

  const handleOpenChat = (loadId: number, shipper: string) => {
    setSelectedLoadId(loadId.toString());
    setSelectedShipper(shipper);
    setShowChatModal(true);
  };

  const handleOpenDocuments = (loadId: number) => {
    setSelectedLoadId(loadId.toString());
    setShowDocumentModal(true);
  };

  const handleOpenRating = (loadId: number, shipper: string) => {
    setSelectedLoadId(loadId.toString());
    setSelectedShipper(shipper);
    setShowRatingModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        userType="driver"
        onLogout={onLogout}
        homeBaseMode={homeBaseMode}
        onHomeBaseToggle={setHomeBaseMode}
        currentLocation="Chicago, IL"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Home Base Alert */}
        {homeBaseMode && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <Home className="h-5 w-5 text-dock-orange" />
              <span className="font-medium text-orange-800">Home Base Mode Active</span>
            </div>
            <p className="text-sm text-orange-600 mt-1">
              Showing loads that route toward your home base to minimize empty miles.
            </p>
          </div>
        )}

        <StatsCards userType="driver" />

        {/* Main Content */}
        <Tabs defaultValue="available" className="space-y-4">
          <TabsList>
            <TabsTrigger value="available">Available Loads</TabsTrigger>
            <TabsTrigger value="myloads">My Loads</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            <LoadFilters
              searchRadius={searchRadius}
              setSearchRadius={setSearchRadius}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
            <LoadList
              loads={filteredLoads}
              userType="driver"
              onOpenChat={handleOpenChat}
              onAcceptLoad={handleAcceptLoad}
            />
          </TabsContent>

          <TabsContent value="myloads">
            <div className="grid gap-4">
              {myLoads.map((load) => (
                <div key={load.id} className="p-4 border rounded-lg bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">
                        {load.origin} → {load.destination}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Delivery: {load.deliveryTime}
                      </p>
                      <p className="text-sm">
                        Shipper: <strong>{load.shipper}</strong>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Badge className="bg-blue-500 text-white">In Transit</Badge>
                      <Badge variant="outline" className="block text-center">
                        Payment: {load.paymentStatus === 'escrow_held' ? 'Escrowed' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-lg font-semibold text-green-600">{load.rate}</div>
                    <div className="text-sm text-gray-600">
                      {load.documents.pickup_photos} photos uploaded • POD required
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenChat(load.id, load.shipper)}
                    >
                      Chat
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenDocuments(load.id)}
                    >
                      <Camera className="h-3 w-3 mr-1" />
                      Upload POD
                    </Button>
                    <Button size="sm" className="bg-dock-blue hover:bg-blue-800">
                      Mark Complete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <LoadList loads={completedLoads} userType="driver" />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {showChatModal && (
        <ChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          userType="driver"
          conversationWith={selectedShipper}
          loadId={selectedLoadId}
        />
      )}

      {showDocumentModal && (
        <DocumentModal
          isOpen={showDocumentModal}
          onClose={() => setShowDocumentModal(false)}
          userType="driver"
          loadId={selectedLoadId}
        />
      )}

      {showRatingModal && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          userType="driver"
          ratingFor={selectedShipper}
          loadId={selectedLoadId}
        />
      )}
    </div>
  );
};

export default DriverDashboard;
