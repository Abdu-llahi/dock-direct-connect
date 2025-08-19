import { useState, useEffect } from "react";
import { Bell, X, CheckCircle, AlertCircle, Info, Clock, MapPin, Truck, Package, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'bid' | 'location' | 'payment';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  metadata?: {
    loadId?: string;
    amount?: number;
    location?: string;
    driverName?: string;
    shipperName?: string;
  };
}

interface NotificationProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
}

export const NotificationBell = ({ 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onDelete 
}: NotificationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'bid':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'location':
        return <MapPin className="h-5 w-5 text-blue-500" />;
      case 'payment':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-50';
      case 'error':
        return 'border-l-red-500 bg-red-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'info':
        return 'border-l-blue-500 bg-blue-50';
      case 'bid':
        return 'border-l-green-500 bg-green-50';
      case 'location':
        return 'border-l-blue-500 bg-blue-50';
      case 'payment':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMarkAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-gray-50 transition-colors cursor-pointer border-l-4",
                      getTypeColor(notification.type),
                      !notification.read && "bg-blue-50"
                    )}
                    onClick={() => {
                      if (!notification.read) {
                        onMarkAsRead(notification.id);
                      }
                      if (notification.action) {
                        notification.action.onClick();
                      }
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={cn(
                            "text-sm font-medium",
                            !notification.read ? "text-gray-900" : "text-gray-700"
                          )}>
                            {notification.title}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {formatTime(notification.timestamp)}
                            </span>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>

                        {notification.metadata && (
                          <div className="mt-2 space-y-1">
                            {notification.metadata.loadId && (
                              <div className="flex items-center text-xs text-gray-500">
                                <Package className="h-3 w-3 mr-1" />
                                Load #{notification.metadata.loadId}
                              </div>
                            )}
                            {notification.metadata.amount && (
                              <div className="flex items-center text-xs text-gray-500">
                                <DollarSign className="h-3 w-3 mr-1" />
                                ${notification.metadata.amount.toLocaleString()}
                              </div>
                            )}
                            {notification.metadata.location && (
                              <div className="flex items-center text-xs text-gray-500">
                                <MapPin className="h-3 w-3 mr-1" />
                                {notification.metadata.location}
                              </div>
                            )}
                            {notification.metadata.driverName && (
                              <div className="flex items-center text-xs text-gray-500">
                                <Truck className="h-3 w-3 mr-1" />
                                {notification.metadata.driverName}
                              </div>
                            )}
                          </div>
                        )}

                        {notification.action && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 text-xs text-blue-600 hover:text-blue-700 p-0 h-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              notification.action!.onClick();
                            }}
                          >
                            {notification.action.label}
                          </Button>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(notification.id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="w-full text-gray-600 hover:text-gray-800"
              >
                View all notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  };
};

// Example usage component
export const NotificationExample = () => {
  const {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const addSampleNotification = (type: Notification['type']) => {
    const samples = {
      success: {
        title: 'Load Delivered Successfully',
        message: 'Your shipment has been delivered on time and in perfect condition.',
        metadata: { loadId: 'L-2024-001', amount: 2500 }
      },
      bid: {
        title: 'New Bid Received',
        message: 'John Martinez placed a bid of $2,400 on your Chicago to Detroit load.',
        metadata: { loadId: 'L-2024-001', amount: 2400, driverName: 'John Martinez' }
      },
      location: {
        title: 'Driver Location Updated',
        message: 'Sarah Wilson is currently at the pickup location.',
        metadata: { location: 'Chicago Warehouse', driverName: 'Sarah Wilson' }
      },
      payment: {
        title: 'Payment Processed',
        message: 'Your payment of $2,500 has been successfully processed.',
        metadata: { amount: 2500 }
      }
    };

    addNotification({
      type,
      ...samples[type],
      action: {
        label: 'View Details',
        onClick: () => console.log('View details clicked')
      }
    });
  };

  return (
    <div className="flex items-center space-x-4">
      <NotificationBell
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onDelete={deleteNotification}
      />
      
      <div className="flex space-x-2">
        <Button
          size="sm"
          onClick={() => addSampleNotification('success')}
          className="bg-green-600 hover:bg-green-700"
        >
          Success
        </Button>
        <Button
          size="sm"
          onClick={() => addSampleNotification('bid')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Bid
        </Button>
        <Button
          size="sm"
          onClick={() => addSampleNotification('location')}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Location
        </Button>
        <Button
          size="sm"
          onClick={() => addSampleNotification('payment')}
          className="bg-green-600 hover:bg-green-700"
        >
          Payment
        </Button>
      </div>
    </div>
  );
};
