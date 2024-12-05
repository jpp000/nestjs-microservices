import { Query, Resolver } from '@nestjs/graphql';
import { PaymentIntent } from './models/payment-intent.model';
import { PaymentsService } from './payments.service';

@Resolver(() => PaymentIntent)
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Query(() => [PaymentIntent], { name: 'payments' })
  findAllPayments() {
    return this.paymentsService.findAllPayments();
  }
}
