
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  Send, 
  Paperclip, 
  Image, 
  File, 
  MapPin, 
  Clock, 
  User, 
  Truck, 
  Package,
  MoreVertical,
  Phone,
  Video,
  Smile,
  X,
  Check,
  CheckCheck,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: 'driver' | 'warehouse' | 'system';
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'location' | 'status';
  status: 'sent' | 'delivered' | 'read';
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  loadId: string;
  userRole: 'driver' | 'shipper';
}

const ChatModal = ({ isOpen, onClose, loadId, userRole }: ChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'system',
      content: 'Chat session started for Load #L-2024-001',
      timestamp: new Date(Date.now() - 300000),
      type: 'status',
      status: 'read'
    },
    {
      id: '2',
      sender: 'warehouse',
      content: 'Hi! Your load is ready for pickup at Dock 3. Please confirm your ETA.',
      timestamp: new Date(Date.now() - 240000),
      type: 'text',
      status: 'read'
    },
    {
      id: '3',
      sender: 'driver',
      content: 'I\'ll be there in 15 minutes. Can you send me the dock location?',
      timestamp: new Date(Date.now() - 180000),
      type: 'text',
      status: 'read'
    },
    {
      id: '4',
      sender: 'warehouse',
      content: 'Dock 3 is located at the north entrance. Here\'s the exact location:',
      timestamp: new Date(Date.now() - 120000),
      type: 'location',
      status: 'read'
    },
    {
      id: '5',
      sender: 'driver',
      content: 'Perfect, I can see it on the map. I\'ll be there shortly.',
      timestamp: new Date(Date.now() - 60000),
      type: 'text',
      status: 'delivered'
    },
    {
      id: '6',
      sender: 'driver',
      content: 'Just arrived at Dock 3. Ready for loading.',
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate typing indicator
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: userRole === 'driver' ? 'driver' : 'warehouse',
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simulate message delivery and read status
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'delivered' as const }
            : msg
        )
      );
    }, 1000);

    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'read' as const }
            : msg
        )
      );
    }, 3000);

    // Simulate typing indicator from other party
    setTimeout(() => {
      setIsTyping(true);
    }, 1000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: userRole === 'driver' ? 'driver' : 'warehouse',
      content: `Sent: ${file.name}`,
      timestamp: new Date(),
      type: 'file',
      status: 'sent',
      attachments: [{
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size
      }]
    };

    setMessages(prev => [...prev, message]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-green-500" />;
      default:
        return null;
    }
  };

  const renderMessage = (message: Message) => {
    const isOwnMessage = message.sender === userRole;
    
    return (
      <div
        key={message.id}
        className={cn(
          "flex mb-4",
          isOwnMessage ? "justify-end" : "justify-start"
        )}
      >
        <div className={cn(
          "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl",
          message.sender === 'system' 
            ? "bg-gray-100 text-gray-600 text-center mx-auto"
            : isOwnMessage
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-900"
        )}>
          {message.sender !== 'system' && (
            <div className="flex items-center mb-1">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center mr-2",
                message.sender === 'driver' ? "bg-orange-500" : "bg-blue-500"
              )}>
                {message.sender === 'driver' ? (
                  <Truck className="h-3 w-3 text-white" />
                ) : (
                  <Package className="h-3 w-3 text-white" />
                )}
              </div>
              <span className="text-xs font-medium">
                {message.sender === 'driver' ? 'Driver' : 'Warehouse'}
              </span>
            </div>
          )}
          
          <div className="mb-1">
            {message.type === 'location' && (
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Location shared</span>
              </div>
            )}
            
            {message.type === 'file' && message.attachments?.[0] && (
              <div className="flex items-center space-x-2 mb-2 p-2 bg-white/10 rounded">
                <File className="h-4 w-4" />
                <div>
                  <div className="text-sm font-medium">{message.attachments[0].name}</div>
                  <div className="text-xs opacity-75">
                    {(message.attachments[0].size / 1024 / 1024).toFixed(1)} MB
                  </div>
                </div>
              </div>
            )}
            
            <div className="text-sm">{message.content}</div>
          </div>
          
          <div className={cn(
            "flex items-center justify-between text-xs",
            isOwnMessage ? "text-blue-100" : "text-gray-500"
          )}>
            <span>{formatTime(message.timestamp)}</span>
            {isOwnMessage && getStatusIcon(message.status)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl h-[600px] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold">
                  Load #L-2024-001 Chat
                </DialogTitle>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    isOnline ? "bg-green-500" : "bg-gray-400"
                  )} />
                  <span>{isOnline ? 'Online' : 'Offline'}</span>
                  {isTyping && <span className="text-blue-600">• typing</span>}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map(renderMessage)}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-2xl">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-xs text-gray-600 ml-2">typing...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 p-4 border-t bg-white">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-500 hover:text-gray-700"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <Image className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <MapPin className="h-5 w-5" />
            </Button>
            
            <div className="flex-1">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="border-0 focus:ring-0 bg-gray-100 rounded-full"
              />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <Smile className="h-5 w-5" />
            </Button>
            
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatModal;
