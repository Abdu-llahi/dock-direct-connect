import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Calendar, DollarSign, Clock } from 'lucide-react';

interface PendingLoad {
  id: number;
  origin: string;
  destination: string;
  pallets: number;
  weight: string;
  rate: string;
  postedAt: string;
  urgent: boolean;
  bids: number;
  pickupDate: string;
  status: string;
}

const PendingLoadsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');

  // Mock pending loads data
  const pendingLoads: PendingLoad[] = [
    {
      id: 1,
      origin: "Chicago, IL",
      destination: "Detroit, MI",
      pallets: 22,
      weight: "44,000 lbs",
      rate: "$2,400",
      postedAt: "2 hours ago",
      urgent: true,
      bids: 3,
      pickupDate: "Today",
      status: "seeking_driver"
    },
    {
      id: 2,
      origin: "Atlanta, GA",
      destination: "Miami, FL",
      pallets: 15,
      weight: "30,000 lbs",
      rate: "$1,800",
      postedAt: "1 day ago",
      urgent: false,
      bids: 5,
      pickupDate: "Tomorrow",
      status: "seeking_driver"
    },
    {
      id: 3,
      origin: "Dallas, TX",
      destination: "Houston, TX",
      pallets: 18,
      weight: "36,000 lbs",
      rate: "$1,200",
      postedAt: "3 hours ago",
      urgent: false,
      bids: 1,
      pickupDate: "Dec 25",
      status: "seeking_driver"
    },
    {
      id: 4,
      origin: "Los Angeles, CA",
      destination: "Phoenix, AZ",
      pallets: 20,
      weight: "40,000 lbs",
      rate: "$2,100",
      postedAt: "5 hours ago",
      urgent: true,
      bids: 7,
      pickupDate: "Tomorrow",
      status: "seeking_driver"
    }
  ];

  const filteredLoads = pendingLoads.filter(load => {
    const matchesSearch = load.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         load.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || 
                           load.origin.toLowerCase().includes(locationFilter.toLowerCase()) ||
                           load.destination.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });

  const handleCancelLoad = (loadId: number) => {
    console.log('Canceling load:', loadId);
  };

  const handleEditLoad = (loadId: number) => {
    console.log('Editing load:', loadId);
  };

  const handleViewBids = (loadId: number) => {
    console.log('Viewing bids for load:', loadId);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filter Pending Loads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Routes</label>
              <Input
                placeholder="Search origin/destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Pickup Date</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price Range</label>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under_1500">Under $1,500</SelectItem>
                  <SelectItem value="1500_2500">$1,500 - $2,500</SelectItem>
                  <SelectItem value="over_2500">Over $2,500</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                placeholder="Filter by city/state..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Loads List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Pending Loads ({filteredLoads.length})
          </h3>
          <div className="text-sm text-gray-600">
            Total value: ${filteredLoads.reduce((sum, load) => sum + parseInt(load.rate.replace('$', '').replace(',', '')), 0).toLocaleString()}
          </div>
        </div>

        {filteredLoads.map((load) => (
          <Card key={load.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Load Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{load.origin}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-medium">{load.destination}</span>
                    </div>
                    {load.urgent && (
                      <Badge className="bg-red-100 text-red-800">
                        🚨 Urgent
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Weight:</span>
                      <div className="font-medium">{load.weight}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Pallets:</span>
                      <div className="font-medium">{load.pallets}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-500" />
                      <div>
                        <span className="text-gray-500">Pickup:</span>
                        <div className="font-medium">{load.pickupDate}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <div>
                        <span className="text-gray-500">Posted:</span>
                        <div className="font-medium">{load.postedAt}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rate and Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="text-center lg:text-right">
                    <div className="flex items-center gap-1 justify-center lg:justify-end">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-2xl font-bold text-green-600">{load.rate}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {load.bids} bid{load.bids !== 1 ? 's' : ''} received
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <Button
                      size="sm"
                      onClick={() => handleViewBids(load.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      View Bids ({load.bids})
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditLoad(load.id)}
                    >
                      Edit Load
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancelLoad(load.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredLoads.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">No pending loads found</div>
              <p className="text-gray-400">Try adjusting your filters or post a new load</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PendingLoadsTab;