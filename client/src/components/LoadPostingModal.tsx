
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Package, Weight, DollarSign, Clock } from "lucide-react";

interface LoadPostingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoadPostingModal = ({ isOpen, onClose }: LoadPostingModalProps) => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    palletCount: '',
    weight: '',
    loadType: '',
    pickupDate: '',
    pickupTime: '',
    deliveryDate: '',
    loadDescription: '',
    rate: '',
    paymentTerms: '',
    isUrgent: false,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['origin', 'destination', 'weight', 'pickupDate', 'loadDescription', 'rate'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    console.log('Posting load:', formData);
    // In a real app, this would make an API call to create the load
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isUrgent: checked }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-dock-blue" />
            <span>Post New Load</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Origin & Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin" className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Origin</span>
              </Label>
              <Input
                id="origin"
                name="origin"
                placeholder="City, State"
                value={formData.origin}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination" className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Destination</span>
              </Label>
              <Input
                id="destination"
                name="destination"
                placeholder="City, State"
                value={formData.destination}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Load Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="palletCount" className="flex items-center space-x-1">
                <Package className="h-4 w-4" />
                <span>Pallet Count</span>
              </Label>
              <Input
                id="palletCount"
                name="palletCount"
                type="number"
                placeholder="0"
                value={formData.palletCount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight" className="flex items-center space-x-1">
                <Weight className="h-4 w-4" />
                <span>Weight (lbs)</span>
              </Label>
              <Input
                id="weight"
                name="weight"
                placeholder="0"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loadType">Load Type</Label>
              <Select value={formData.loadType} onValueChange={(value) => handleSelectChange('loadType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dry">Dry Goods</SelectItem>
                  <SelectItem value="refrigerated">Refrigerated</SelectItem>
                  <SelectItem value="hazmat">Hazmat</SelectItem>
                  <SelectItem value="fragile">Fragile</SelectItem>
                  <SelectItem value="oversize">Oversize</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pickup & Delivery Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickupDate" className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Pickup Date *</span>
              </Label>
              <Input
                id="pickupDate"
                name="pickupDate"
                type="date"
                value={formData.pickupDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickupTime">Pickup Time</Label>
              <Input
                id="pickupTime"
                name="pickupTime"
                type="time"
                value={formData.pickupTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryDate">Delivery Deadline (Optional)</Label>
            <Input
              id="deliveryDate"
              name="deliveryDate"
              type="date"
              value={formData.deliveryDate}
              onChange={handleChange}
            />
          </div>

          {/* Load Description */}
          <div className="space-y-2">
            <Label htmlFor="loadDescription">Load Description *</Label>
            <Textarea
              id="loadDescription"
              name="loadDescription"
              placeholder="Describe the freight, special requirements, equipment needed..."
              value={formData.loadDescription}
              onChange={handleChange}
              required
              rows={3}
            />
          </div>

          {/* Rate & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rate" className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4" />
                <span>Total Rate ($) *</span>
              </Label>
              <Input
                id="rate"
                name="rate"
                type="number"
                placeholder="0"
                value={formData.rate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms *</Label>
              <Select value={formData.paymentTerms} onValueChange={(value) => handleSelectChange('paymentTerms', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quick_pay">Quick Pay (24 hours)</SelectItem>
                  <SelectItem value="net_15">Net 15 days</SelectItem>
                  <SelectItem value="net_30">Net 30 days</SelectItem>
                  <SelectItem value="cod">Cash on Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Urgent Toggle */}
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>🚨 Mark as Urgent Load</span>
                <Switch
                  checked={formData.isUrgent}
                  onCheckedChange={handleSwitchChange}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Urgent loads get priority placement and instant alerts to nearby drivers. 
                Best for same-day pickups, missed appointments, or emergency orders.
              </p>
            </CardContent>
          </Card>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Special requirements, dock details, contact info..."
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className={formData.isUrgent ? "bg-red-500 hover:bg-red-600" : "bg-dock-blue hover:bg-blue-800"}
            >
              {formData.isUrgent ? "🚨 Post Urgent Load" : "Post Load"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoadPostingModal;
