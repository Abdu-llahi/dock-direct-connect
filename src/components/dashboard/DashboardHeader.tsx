
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Truck, Package, Plus, LogOut, Bell, Home } from "lucide-react";

interface DashboardHeaderProps {
  userType: 'shipper' | 'driver';
  onLogout: () => void;
  emergencyMode?: boolean;
  onEmergencyToggle?: (checked: boolean) => void;
  homeBaseMode?: boolean;
  onHomeBaseToggle?: (checked: boolean) => void;
  onPostLoad?: () => void;
  currentLocation?: string;
}

const DashboardHeader = ({ 
  userType, 
  onLogout, 
  emergencyMode, 
  onEmergencyToggle, 
  homeBaseMode, 
  onHomeBaseToggle, 
  onPostLoad,
  currentLocation 
}: DashboardHeaderProps) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            {userType === 'shipper' ? (
              <Package className="h-8 w-8 text-dock-blue" />
            ) : (
              <Truck className="h-8 w-8 text-dock-orange" />
            )}
            <span className={`text-2xl font-bold ${userType === 'shipper' ? 'text-dock-blue' : 'text-dock-orange'}`}>
              DockDirect
            </span>
            <Badge variant="secondary">
              {userType === 'shipper' ? 'Shipper' : 'Driver'}
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            {userType === 'shipper' && emergencyMode !== undefined && onEmergencyToggle && (
              <div className="flex items-center space-x-2 p-2 border rounded-lg">
                <Bell className={`h-4 w-4 ${emergencyMode ? 'text-red-500' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Emergency Push</span>
                <Switch 
                  checked={emergencyMode}
                  onCheckedChange={onEmergencyToggle}
                />
              </div>
            )}
            {userType === 'driver' && homeBaseMode !== undefined && onHomeBaseToggle && (
              <div className="flex items-center space-x-2 p-2 border rounded-lg">
                <Home className={`h-4 w-4 ${homeBaseMode ? 'text-dock-orange' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Home Base</span>
                <Switch 
                  checked={homeBaseMode}
                  onCheckedChange={onHomeBaseToggle}
                />
              </div>
            )}
            {currentLocation && (
              <div className="text-sm text-gray-600">
                Current Location: <span className="font-semibold">{currentLocation}</span>
              </div>
            )}
            {userType === 'shipper' && onPostLoad && (
              <Button onClick={onPostLoad} className="bg-dock-blue hover:bg-blue-800">
                <Plus className="mr-2 h-4 w-4" />
                Post Load
              </Button>
            )}
            <Button variant="ghost" onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
