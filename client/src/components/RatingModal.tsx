
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'shipper' | 'driver';
  ratingFor: string;
  loadId: string;
}

const RatingModal = ({ isOpen, onClose, userType, ratingFor, loadId }: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Rating submitted:', { rating, feedback, loadId });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Rate {userType === 'shipper' ? 'Driver' : 'Shipper'}: {ratingFor}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              How was your experience with this {userType === 'shipper' ? 'driver' : 'shipper'}?
            </p>
            <div className="flex justify-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Feedback (Optional)</label>
            <Textarea
              placeholder="Share your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Skip
            </Button>
            <Button 
              type="submit" 
              disabled={rating === 0}
              className={`flex-1 ${
                userType === 'shipper' 
                  ? 'bg-dock-blue hover:bg-blue-800' 
                  : 'bg-dock-orange hover:bg-orange-600'
              }`}
            >
              Submit Rating
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
