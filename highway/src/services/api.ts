import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  Experience,
  Slot,
  ExperienceWithSlots,
  BookingPayload,
  BookingResponse,
  PromoValidationResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
      (response) => {
        return response.data?.data || response.data;
      },
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
    return await this.client.get('/experiences');
  }

  // Get single experience with slots
  async getExperienceById(id: string): Promise<ExperienceWithSlots> {
    return await this.client.get(`/experiences/${id}`);
  }

  // Get slots for an experience
  async getExperienceSlots(id: string, date?: string): Promise<Slot[]> {
    return await this.client.get(`/experiences/${id}/slots`, {
      params: date ? { date } : {},
    });
  }

  // Validate promo code
  async validatePromoCode(code: string, amount?: number): Promise<PromoValidationResponse> {
    return await this.client.post('/promo/validate', { code, amount });
  }

  // Create booking
  async createBooking(payload: BookingPayload): Promise<BookingResponse> {
    return await this.client.post('/bookings', payload);
  }

  // Get booking by reference ID
  async getBooking(referenceId: string): Promise<BookingResponse> {
    return await this.client.get(`/bookings/${referenceId}`);
  }
}

// Export singleton instance
export const apiService = new ApiService(API_BASE_URL);
