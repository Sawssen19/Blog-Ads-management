import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private stripe: Promise<Stripe | null>;
  private paymentIntentSubject = new BehaviorSubject<string | null>(null);
  
  constructor(private http: HttpClient) {
    this.stripe = loadStripe(environment.stripePublicKey);
  }

  createPaymentIntent(amount: number, currency: string = 'eur'): Observable<{ clientSecret: string }> {
    return this.http.post<{ clientSecret: string }>(`${environment.apiUrl}/create-payment-intent`, {
      amount,
      currency
    });
  }

  async confirmCardPayment(clientSecret: string, paymentMethod: any): Promise<any> {
    const stripe = await this.stripe;
    if (!stripe) {
      throw new Error('Stripe not loaded');
    }

    return stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod
    });
  }

  getPaymentIntent(): Observable<string | null> {
    return this.paymentIntentSubject.asObservable();
  }

  setPaymentIntent(clientSecret: string | null): void {
    this.paymentIntentSubject.next(clientSecret);
  }
}
