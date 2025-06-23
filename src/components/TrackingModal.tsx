
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Truck, Navigation } from "lucide-react";

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  loadId: string;
}

const TrackingModal = ({ isOpen, onClose, loadId }: TrackingModalProps) => {
  const trackingData = {
    currentLocation: "I-94 near Kalamazoo, MI",
    eta: "2:45 PM",
    progress: 65,
    driver: "Mike Rodriguez",
    truckNumber: "TR-4521",
    lastUpdate: "5 minutes ago"
  };

  const milestones = [
    { 
      status: "completed", 
      title: "Load Accepted", 
      time: "10:30 AM", 
      location: "Chicago, IL" 
    },
    { 
      status: "completed", 
      title: "Pickup Confirmed", 
      time: "11:45 AM", 
      location: "Chicago Distribution Center" 
    },
    { 
      status: "active", 
      title: "In Transit", 
      time: "12:15 PM", 
      location: "En route to Detroit" 
    },
    { 
      status: "pending", 
      title: "Delivery", 
      time: "2:45 PM (ETA)", 
      location: "Detroit, MI" 
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Navigation className="h-5 w-5 text-dock-blue" />
            <span>Live Tracking - Load #{loadId}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-dock-blue" />
                <span className="font-medium">{trackingData.driver}</span>
                <Badge variant="outline">{trackingData.truckNumber}</Badge>
              </div>
              <Badge className="bg-green-500 text-white">Active</Badge>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{trackingData.currentLocation}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>ETA: {trackingData.eta}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Last updated: {trackingData.lastUpdate}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{trackingData.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-dock-blue h-2 rounded-full transition-all duration-300" 
                style={{ width: `${trackingData.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Route Map Placeholder */}
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Live GPS Map</p>
              <p className="text-xs">Integration ready for Google Maps</p>
            </div>
          </div>

          {/* Milestones */}
          <div className="space-y-3">
            <h4 className="font-medium">Delivery Milestones</h4>
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  milestone.status === 'completed' 
                    ? 'bg-green-500' 
                    : milestone.status === 'active' 
                    ? 'bg-dock-blue' 
                    : 'bg-gray-300'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${
                      milestone.status === 'active' ? 'text-dock-blue' : ''
                    }`}>
                      {milestone.title}
                    </span>
                    <span className="text-sm text-gray-500">{milestone.time}</span>
                  </div>
                  <p className="text-sm text-gray-500">{milestone.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrackingModal;
