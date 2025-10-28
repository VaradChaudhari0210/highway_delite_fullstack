export interface Experience {
  id: string;
  title: string;
  location: string;
  description: string;
  shortDescription: string;
  price: number;
  imageUrl: string;
}

export interface Slot {
  id: string;
  experienceId: string;
  date: string;
  time: string;
  totalSlots: number;
  availableSlots: number;
}

export interface ExperienceWithSlots extends Experience {
  slotsByDate?: Record<string, Slot[]>;
}

export interface BookingPayload {
  experienceId: string;
  slotId: string;
  fullName: string;
  email: string;
  quantity: number;
  promoCode?: string;
}

export interface BookingResponse {
  id: string;
  experienceId: string;
  slotId: string;
  fullName: string;
  email: string;
  quantity: number;
  subtotal: number;
  taxes: number;
  discount: number;
  total: number;
  promoCode: string | null;
  referenceId: string;
  status: string;
  experience: Experience;
  slot: Slot;
}

export interface PromoValidationResponse {
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  discount: number;
}

export interface BookingDetails {
  experience: Experience;
  date: string;
  time: string;
  quantity: number;
  subtotal: number;
  taxes: number;
  total: number;
}
