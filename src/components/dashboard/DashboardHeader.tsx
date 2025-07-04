
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Truck, Package, Plus, LogOut, Bell, Home, Shield } from "lucide-react";
import Logo from "@/components/ui/logo";

interface DashboardHeaderProps {
  userType: 'shipper' | 'driver' | 'admin';
  userName?: string;
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
  userName,
  onLogout, 
  emergencyMode, 
  onEmergencyToggle, 
  homeBaseMode, 
  onHomeBaseToggle, 
  onPostLoad,
  currentLocation 
}: DashboardHeaderProps) => {
  const getRoleIcon = () => {
    switch (userType) {
      case 'shipper':
        return <Package className="h-8 w-8 text-dock-blue" />;
      case 'driver':
        return <Truck className="h-8 w-8 text-dock-orange" />;
      case 'admin':
        return <Shield className="h-8 w-8 text-gray-600" />;
      default:
        return <Package className="h-8 w-8 text-dock-blue" />;
    }
  };

  const getRoleColors = () => {
    switch (userType) {
      case 'shipper':
        return 'text-dock-blue';
      case 'driver':
        return 'text-dock-orange';
      case 'admin':
        return 'text-gray-600';
      default:
        return 'text-dock-blue';
    }
  };

  const getRoleName = () => {
    switch (userType) {
      case 'shipper':
        return 'Shipper';
      case 'driver':
        return 'Driver';
      case 'admin':
        return 'Admin';
      default:
        return 'User';
    }
  };
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Logo />
            <div className="flex items-center space-x-2">
              {getRoleIcon()}
              <Badge variant="secondary" className={getRoleColors()}>
                {getRoleName()}
              </Badge>
              {userName && (
                <span className="text-sm text-gray-600 hidden sm:block">
                  Welcome, {userName}
                </span>
              )}
            </div>
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
