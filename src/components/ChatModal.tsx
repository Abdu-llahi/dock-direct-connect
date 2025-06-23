
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageCircle } from "lucide-react";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'shipper' | 'driver';
  conversationWith: string;
  loadId: string;
}

const ChatModal = ({ isOpen, onClose, userType, conversationWith, loadId }: ChatModalProps) => {
  const [message, setMessage] = useState("");
  const [messages] = useState([
    {
      id: 1,
      sender: userType === 'shipper' ? 'driver' : 'shipper',
      content: "Hi, I'm interested in the load from Chicago to Detroit. Can you confirm the pickup time?",
      timestamp: "2:30 PM",
      avatar: "DR"
    },
    {
      id: 2,
      sender: userType,
      content: "Yes, pickup is scheduled for 6:00 PM today. The warehouse will be ready.",
      timestamp: "2:35 PM",
      avatar: "SH"
    },
    {
      id: 3,
      sender: userType === 'shipper' ? 'driver' : 'shipper',
      content: "Perfect! I'm about 30 minutes out. Will send pickup confirmation photos.",
      timestamp: "5:25 PM",
      avatar: "DR"
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    console.log('Sending message:', message);
    setMessage("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md h-[500px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-dock-blue" />
            <span>Chat with {conversationWith}</span>
            <span className="text-sm text-gray-500">Load #{loadId}</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === userType ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${msg.sender === userType ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={msg.sender === 'driver' ? 'bg-dock-orange text-white' : 'bg-dock-blue text-white'}>
                      {msg.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`rounded-lg p-3 ${msg.sender === userType ? 'bg-dock-blue text-white' : 'bg-gray-100 text-gray-900'}`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.sender === userType ? 'text-blue-100' : 'text-gray-500'}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={handleSendMessage} className="flex space-x-2 p-4 border-t">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="sm" className="bg-dock-blue hover:bg-blue-800">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatModal;
