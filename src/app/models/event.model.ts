export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  capacity: number;
  price: number;
  imageUrl?: string;
  organizer: string;
  category: EventCategory;
  status: EventStatus;
  registrationDeadline: Date;
  currentRegistrations: number;
  isPublished: boolean;
  tags?: string[];
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  registrationDate: Date;
  status: RegistrationStatus;
  paymentStatus: PaymentStatus;
  ticketType: TicketType;
  quantity: number;
  totalAmount: number;
  specialRequirements?: string;
  // Informations personnelles
  fullName: string;
  email: string;
  phoneNumber: string;
  address?: string;
}

export interface Payment {
  id: string;
  registrationId: string;
  amount: number;
  currency: string;
  paymentDate: Date;
  paymentMethod: PaymentMethod;
  transactionId: string;
  status: PaymentStatus;
  billingDetails: BillingDetails;
}

export interface BillingDetails {
  fullName: string;
  email: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phoneNumber?: string;
}

export type EventCategory = 'conference' | 'workshop' | 'seminar' | 'networking' | 'cultural' | 'sports' | 'other';
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'sold_out' | 'ongoing' | 'completed';
export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled' | 'waitlisted';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'paypal' | 'bank_transfer' | 'cash';
export type TicketType = 'standard' | 'vip' | 'early_bird' | 'student' | 'group';
