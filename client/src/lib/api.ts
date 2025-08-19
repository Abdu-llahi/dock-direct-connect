const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  details?: any;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || 'An error occurred',
          details: data.details,
        };
      }

      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        error: 'Network error. Please check your connection.',
      };
    }
  }

  // Auth endpoints
  async register(userData: {
    email: string;
    password: string;
    role: 'shipper' | 'driver' | 'admin';
    name: string;
  }) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Shipment endpoints
  async createShipment(shipmentData: {
    originAddress: string;
    destinationAddress: string;
    palletCount: number;
    weight: string;
    loadType: string;
    rate: number;
    description?: string;
    pickupDate?: string;
    deliveryDate?: string;
    isUrgent?: boolean;
    paymentTerms?: string;
  }) {
    return this.request('/api/shipments', {
      method: 'POST',
      body: JSON.stringify(shipmentData),
    });
  }

  async getShipments() {
    return this.request('/api/shipments');
  }

  async updateShipmentStatus(id: string, status: string) {
    return this.request(`/api/shipments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Bid endpoints
  async createBid(bidData: {
    shipmentId: string;
    bidAmount: number;
    message?: string;
  }) {
    return this.request('/api/bids', {
      method: 'POST',
      body: JSON.stringify(bidData),
    });
  }

  async acceptBid(bidId: string) {
    return this.request(`/api/bids/${bidId}/accept`, {
      method: 'POST',
    });
  }

  // Seed endpoint (development only)
  async seedDatabase() {
    return this.request('/api/seed', {
      method: 'POST',
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
