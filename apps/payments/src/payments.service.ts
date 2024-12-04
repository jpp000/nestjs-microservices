import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { ClientGrpc } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';
import {
  NOTIFICATIONS_SERVICE_NAME,
  NotificationsServiceClient,
} from '@app/common';

@Injectable()
export class PaymentsService {
  private notificationsService: NotificationsServiceClient;

  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: null,
    },
  );

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createCharge({ card, email, amount }: PaymentsCreateChargeDto) {
    // const paymentMethod = await this.stripe.paymentMethods.create({
    //   type: 'card',
    //   card: {
    //     cvc: card.cvc,
    //     number: card.number,
    //     exp_month: card.expMonth,
    //     exp_year: card.expYear,
    //   },
    // });

    const paymentIntent = await this.stripe.paymentIntents.create({
      // payment_method: paymentMethod.id,
      amount: amount * 100,
      confirm: true,
      currency: 'brl',
      payment_method: 'pm_card_visa',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    if (!this.notificationsService) {
      this.notificationsService =
        this.client.getService<NotificationsServiceClient>(
          NOTIFICATIONS_SERVICE_NAME,
        );
    }

    this.notificationsService
      .notifyEmail({
        email,
        text: `Your payment of R$${amount} has completed successfully`,
      })
      .subscribe(() => {});

    return paymentIntent;
  }
}
