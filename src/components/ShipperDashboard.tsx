import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Package, Plus, LogOut, Clock, MapPin, Weight, DollarSign, MessageCircle, FileText, Navigation, Star, Bell } from "lucide-react";
import LoadPostingModal from "@/components/LoadPostingModal";
import ChatModal from "@/components/ChatModal";
import DocumentModal from "@/components/DocumentModal";
import TrackingModal from "@/components/TrackingModal";
import RatingModal from "@/components/RatingModal";

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
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-dock-blue" />
              <span className="text-2xl font-bold text-dock-blue">DockDirect</span>
              <Badge variant="secondary">Shipper</Badge>
            </div>
            <div className="flex items-center space-x-4">
              {/* Emergency Mode Toggle */}
              <div className="flex items-center space-x-2 p-2 border rounded-lg">
                <Bell className={`h-4 w-4 ${emergencyMode ? 'text-red-500' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Emergency Push</span>
                <Switch 
                  checked={emergencyMode}
                  onCheckedChange={handleEmergencyToggle}
                />
              </div>
              <Button onClick={() => setShowLoadModal(true)} className="bg-dock-blue hover:bg-blue-800">
                <Plus className="mr-2 h-4 w-4" />
                Post Load
              </Button>
              <Button variant="ghost" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Loads</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">1 urgent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$24,600</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Match Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18min</div>
              <p className="text-xs text-muted-foreground">Industry avg: 4hrs</p>
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
            <div className="grid gap-4">
              {activeLoads.map((load) => (
                <Card key={load.id} className={load.urgent ? "border-red-200 bg-red-50" : ""}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-lg">
                            {load.origin} → {load.destination}
                          </CardTitle>
                          {load.urgent && (
                            <Badge className="bg-red-500 text-white urgent-pulse">
                              URGENT
                            </Badge>
                          )}
                        </div>
                        <CardDescription>Posted {load.postedAt}</CardDescription>
                        {load.driver && (
                          <div className="flex items-center space-x-2 text-sm">
                            <span>Driver: <strong>{load.driver}</strong></span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{load.driverRating}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <Badge variant={load.status === 'seeking_driver' ? 'destructive' : 'default'}>
                        {load.status === 'seeking_driver' ? 'Seeking Driver' : 'Driver Assigned'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span>{load.pallets} pallets</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Weight className="h-4 w-4 text-gray-500" />
                        <span>{load.weight}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold text-green-600">{load.rate}</span>
                      </div>
                      {load.tracking && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-dock-blue">ETA: {load.tracking.eta}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {load.status === 'seeking_driver' ? (
                        <>
                          <Button variant="outline" size="sm">
                            View {load.bids} Bids
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenDocuments(load.id)}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Documents
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenChat(load.id, load.driver!)}
                          >
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Chat
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenTracking(load.id)}
                          >
                            <Navigation className="h-3 w-3 mr-1" />
                            Track
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenDocuments(load.id)}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Documents
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Tracking Progress Bar */}
                    {load.tracking && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Delivery Progress</span>
                          <span>{load.tracking.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-dock-blue h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${load.tracking.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{load.tracking.currentLocation}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid gap-4">
              {completedLoads.map((load) => (
                <Card key={load.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {load.origin} → {load.destination}
                        </CardTitle>
                        <CardDescription>
                          Completed {load.completedAt} • Driver: {load.driver}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-500 text-white">Completed</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span>{load.pallets} pallets</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Weight className="h-4 w-4 text-gray-500" />
                        <span>{load.weight}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold text-green-600">{load.rate}</span>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          View Receipt
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
