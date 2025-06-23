
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Weight, DollarSign, MapPin, Star, MessageCircle, FileText, Navigation, Home } from "lucide-react";

interface Load {
  id: number;
  origin: string;
  destination: string;
  pallets: number;
  weight: string;
  rate: string;
  urgent?: boolean;
  status?: string;
  postedAt?: string;
  driver?: string;
  driverRating?: number;
  shipper?: string;
  shipperRating?: number;
  pickupTime?: string;
  distance?: string;
  towardHome?: boolean;
  stackable?: boolean;
  stackInfo?: string;
  tracking?: {
    currentLocation: string;
    eta: string;
    progress: number;
  };
  bids?: number;
}

interface LoadListProps {
  loads: Load[];
  userType: 'shipper' | 'driver';
  onOpenChat?: (loadId: number, person: string) => void;
  onOpenDocuments?: (loadId: number) => void;
  onOpenTracking?: (loadId: number) => void;
  onAcceptLoad?: (loadId: number) => void;
}

const LoadList = ({ loads, userType, onOpenChat, onOpenDocuments, onOpenTracking, onAcceptLoad }: LoadListProps) => {
  return (
    <div className="grid gap-4">
      {loads.map((load) => (
        <Card key={load.id} className={load.urgent ? "border-red-200 bg-red-50" : ""}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 flex-wrap">
                  <CardTitle className="text-lg">
                    {load.origin} → {load.destination}
                  </CardTitle>
                  {load.urgent && (
                    <Badge className="bg-red-500 text-white urgent-pulse">
                      URGENT
                    </Badge>
                  )}
                  {load.towardHome && (
                    <Badge variant="outline" className="text-dock-orange border-dock-orange">
                      <Home className="h-3 w-3 mr-1" />
                      Home Route
                    </Badge>
                  )}
                  {load.stackable && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Stackable
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  {load.distance && `${load.distance} • `}
                  {load.postedAt && `Posted ${load.postedAt}`}
                </CardDescription>
                {((userType === 'shipper' && load.driver) || (userType === 'driver' && load.shipper)) && (
                  <div className="flex items-center space-x-2 text-sm">
                    <span>
                      {userType === 'shipper' ? 'Driver' : 'Shipper'}: 
                      <strong> {userType === 'shipper' ? load.driver : load.shipper}</strong>
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{userType === 'shipper' ? load.driverRating : load.shipperRating}</span>
                    </div>
                  </div>
                )}
                {load.stackInfo && (
                  <p className="text-sm text-green-600 font-medium">{load.stackInfo}</p>
                )}
              </div>
              <div className="space-y-2">
                {load.status && (
                  <Badge variant={load.status === 'seeking_driver' ? 'destructive' : 'default'}>
                    {load.status === 'seeking_driver' ? 'Seeking Driver' : 
                     load.status === 'driver_assigned' ? 'Driver Assigned' :
                     load.status === 'in_transit' ? 'In Transit' : load.status}
                  </Badge>
                )}
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{load.rate}</div>
                  <div className="text-sm text-gray-500">Total pay</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span>{load.pallets} pallets</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Weight className="h-4 w-4 text-gray-500" />
                  <span>{load.weight}</span>
                </div>
                {load.pickupTime && (
                  <div><strong>Pickup:</strong> {load.pickupTime}</div>
                )}
              </div>
              <div className="flex justify-end items-center space-x-2">
                {load.status === 'seeking_driver' && userType === 'shipper' ? (
                  <>
                    <Button variant="outline" size="sm">
                      View {load.bids} Bids
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onOpenDocuments?.(load.id)}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Documents
                    </Button>
                  </>
                ) : userType === 'driver' && !load.status ? (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onOpenChat?.(load.id, load.shipper!)}
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Chat
                    </Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button 
                      onClick={() => onAcceptLoad?.(load.id)}
                      className="bg-dock-orange hover:bg-orange-600"
                      size="sm"
                    >
                      Accept Load
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onOpenChat?.(load.id, userType === 'shipper' ? load.driver! : load.shipper!)}
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Chat
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onOpenTracking?.(load.id)}
                    >
                      <Navigation className="h-3 w-3 mr-1" />
                      Track
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onOpenDocuments?.(load.id)}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Documents
                    </Button>
                  </>
                )}
              </div>
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
  );
};

export default LoadList;
