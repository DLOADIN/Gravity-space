import axios from 'axios';
import { z } from 'zod';

// Validation schema for payment request
const paymentRequestSchema = z.object({
  amount: z.number().positive(),
  currency: z.enum(['USD']),
  description: z.string(),
  customerName: z.string(),
  customerEmail: z.string(),
  customerPhone: z.string(),
  orderId: z.string(),
  paymentItems: z.array(z.object({
    code: z.string(),
    quantity: z.number().positive(),
    unitAmount: z.number().positive(),
  })),
});

export type PaymentRequest = z.infer<typeof paymentRequestSchema>;

export class PaymentService {
  private static instance: PaymentService;
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly productCode: string = 'PC-c2bc8851e0';
  private readonly paymentAccount: string = 'PI-e054acfdf9';
  private readonly currency: string = 'USD';

  private constructor() {
    this.apiKey = process.env.IREMBO_PAY_API_KEY || '';
    this.apiUrl = process.env.IREMBO_PAY_API_URL || 'https://api.sandbox.irembopay.com';
  }

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async createPaymentRequest(data: PaymentRequest) {
    try {
      // Validate request data
      const validatedData = paymentRequestSchema.parse(data);

      // Prepare request payload
      const payload = {
        transactionId: validatedData.orderId,
        paymentAccountIdentifier: this.paymentAccount,
        customer: {
          name: validatedData.customerName,
          email: validatedData.customerEmail,
          phoneNumber: validatedData.customerPhone,
        },
        paymentItems: validatedData.paymentItems.map(item => ({
          code: this.productCode,
          quantity: item.quantity,
          unitAmount: item.unitAmount,
          currency: this.currency,
        })),
        description: validatedData.description,
        language: 'EN',
      };

      // Make API request
      const response = await axios.post(
        `${this.apiUrl}/payments/invoices`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'irembopay-secretkey': this.apiKey,
            'X-API-Version': '2',
          },
        }
      );

      // Check if the request was successful
      if (!response.data.success) {
        const errorMessage = response.data.message || 'Payment request failed';
        const errorDetails = response.data.errors || [];
        throw new Error(`${errorMessage}: ${JSON.stringify(errorDetails)}`);
      }

      // Extract the payment link URL from the response
      const paymentLinkUrl = response.data.data.paymentLinkUrl;
      if (!paymentLinkUrl) {
        throw new Error('No payment link URL received from IremboPay');
      }

      return {
        success: true,
        checkoutUrl: paymentLinkUrl, // Map paymentLinkUrl to checkoutUrl for frontend compatibility
        invoiceNumber: response.data.data.invoiceNumber,
      };
    } catch (error) {
      console.error('Payment request failed:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Payment request failed';
        const errorDetails = error.response?.data?.errors || [];
        throw new Error(`${errorMessage}: ${JSON.stringify(errorDetails)}`);
      }
      throw error;
    }
  }

  async verifyPayment(invoiceNumber: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/payments/invoices/${invoiceNumber}`,
        {
          headers: {
            'irembopay-secretkey': this.apiKey,
            'X-API-Version': '2',
          },
        }
      );

      return response.data.data.paymentStatus === 'PAID';
    } catch (error) {
      console.error('Payment verification failed:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Payment verification failed';
        const errorDetails = error.response?.data?.errors || [];
        throw new Error(`${errorMessage}: ${JSON.stringify(errorDetails)}`);
      }
      throw error;
    }
  }
} 