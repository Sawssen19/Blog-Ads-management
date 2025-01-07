import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  stripe: any;

  async ngOnInit(): Promise<void> {
    this.stripe = await loadStripe(environment.stripePublicKey);
    console.log('Stripe initialized:', this.stripe);
  }

  handlePaymentSimulation() {
    console.log('Simulating payment...');
    alert('Le paiement par stripe a été effectué avec succès! 🎉');
  }
}
