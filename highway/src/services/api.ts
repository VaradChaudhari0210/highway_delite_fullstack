import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  Experience,
  Slot,
  ExperienceWithSlots,
  BookingPayload,
  BookingResponse,
  PromoValidationResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL;

class ApiService {
  private client: AxiosInstance;

  constructor(baseUrl: string) {
    this.client = axios.create({
      baseURL: `${baseUrl}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.client.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        const message = 
          (error.response?.data as any)?.error || 
          (error.response?.data as any)?.message || 
          error.message || 
          'API request failed';
        
        console.error('API Error:', message);
        throw new Error(message);
      }
    );
  }

  // Get all experiences
  async getExperiences(): Promise<Experience[]> {
    const response = await this.client.get('/experiences');
    return response.data;
  }

  // Get single experience with slots
  async getExperienceById(id: string): Promise<ExperienceWithSlots> {
    const response = await this.client.get(`/experiences/${id}`);
    return response.data;
  }

  // Get slots for an experience
  async getExperienceSlots(id: string, date?: string): Promise<Slot[]> {
    const response = await this.client.get(`/experiences/${id}/slots`, {
      params: date ? { date } : {},
    });
    return response.data;
  }

  // Validate promo code
  async validatePromoCode(code: string, amount?: number): Promise<PromoValidationResponse> {
    const response = await this.client.post('/promo/validate', { code, amount });
    return response.data;
  }

  // Create booking
  async createBooking(payload: BookingPayload): Promise<BookingResponse> {
    const response = await this.client.post('/bookings', payload);
    return response.data;
  }

  // Get booking by reference ID
  async getBooking(referenceId: string): Promise<BookingResponse> {
    const response = await this.client.get(`/bookings/${referenceId}`);
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService(API_BASE_URL);
