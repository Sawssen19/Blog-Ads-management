import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentService } from '../../services/payment.service';
import { environment } from '../../../environments/environment';

declare var Stripe: any;

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <mat-card class="payment-card">
      <mat-card-header>
        <mat-card-title>Paiement sécurisé</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="amount-display">
          <p>Montant à payer: {{ data.amount / 100 }}€</p>
        </div>
        <form id="payment-form" (submit)="submitPayment($event)">
          <div class="form-row">
            <div id="card-element">
              <!-- Stripe Card Element will be inserted here -->
            </div>
            <div id="card-errors" role="alert"></div>
          </div>
          <div class="button-container">
            <button type="button" mat-button (click)="dialogRef.close()">Annuler</button>
            <button type="submit" mat-raised-button color="primary" 
                    [disabled]="isProcessing">
              {{ isProcessing ? 'Traitement...' : 'Payer maintenant' }}
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .payment-card {
      min-width: 400px;
    }
    .amount-display {
      font-size: 1.2em;
      margin: 20px 0;
      text-align: center;
    }
    #payment-form {
      margin-top: 20px;
    }
    .form-row {
      margin: 20px 0;
    }
    #card-element {
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: white;
    }
    #card-errors {
      color: #dc3545;
      margin-top: 8px;
      min-height: 20px;
      font-size: 0.9em;
    }
    .button-container {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 20px;
    }
  `]
})
export class PaymentFormComponent implements OnInit {
  @Output() paymentComplete = new EventEmitter<{ success: boolean, error?: string }>();
  
  private stripe: any;
  private card: any;
  isProcessing = false;

  constructor(
    public dialogRef: MatDialogRef<PaymentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { amount: number },
    private paymentService: PaymentService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    try {
      // Initialize Stripe
      this.stripe = Stripe(environment.stripePublicKey);
      const elements = this.stripe.elements();
      
      // Create card element
      this.card = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            '::placeholder': {
              color: '#aab7c4'
            }
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
          }
        }
      });
      
      // Mount card element
      this.card.mount('#card-element');
      
      // Handle card element errors
      this.card.addEventListener('change', ({ error }: any) => {
        const displayError = document.getElementById('card-errors');
        if (displayError) {
          displayError.textContent = error ? error.message : '';
        }
      });
    } catch (error) {
      console.error('Error initializing Stripe:', error);
      this.showError('Erreur lors de l\'initialisation du paiement');
    }
  }

  async submitPayment(event: Event) {
    event.preventDefault();
    
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    const errorElement = document.getElementById('card-errors');
    if (errorElement) errorElement.textContent = '';

    try {
      // Create payment intent
      const response = await this.paymentService
        .createPaymentIntent(this.data.amount)
        .toPromise();

      if (!response) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = response;

      // Confirm card payment
      const result = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.card,
          billing_details: {
            // Vous pouvez ajouter des détails de facturation ici si nécessaire
          }
        }
      });

      if (result.error) {
        if (errorElement) {
          errorElement.textContent = result.error.message;
        }
        this.paymentComplete.emit({ success: false, error: result.error.message });
        this.showError(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          this.paymentComplete.emit({ success: true });
          this.showSuccess('Paiement réussi !');
          this.dialogRef.close(true);
        }
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      if (errorElement) {
        errorElement.textContent = error.message || 'Une erreur est survenue lors du paiement.';
      }
      this.paymentComplete.emit({ success: false, error: error.message || 'Erreur de paiement' });
      this.showError(error.message || 'Erreur lors du traitement du paiement');
    } finally {
      this.isProcessing = false;
    }
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  ngOnDestroy() {
    if (this.card) {
      this.card.unmount();
    }
  }
}
