import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservations.repository';
import { ClientProxy } from '@nestjs/microservices';
import { PAYMENTS_SERVICE, User } from '@app/common';
import { map } from 'rxjs';
import { Reservation } from './models/reservation.entity';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentService: ClientProxy,
  ) {}

  create(
    createReservationDto: CreateReservationDto,
    { email, id: userId }: User,
  ) {
    return this.paymentService
      .send('create-charge', { ...createReservationDto.charge, email })
      .pipe(
        map((res) => {
          const reservation = new Reservation({
            ...createReservationDto,
            invoiceId: res.id,
            timestamp: new Date(),
            userId,
          });
          return this.reservationsRepository.create(reservation);
        }),
      );
  }

  findAll() {
    return this.reservationsRepository.find({});
  }

  findOne(id: number) {
    return this.reservationsRepository.findOne({ id });
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { id },
      updateReservationDto,
    );
  }

  remove(id: number) {
    return this.reservationsRepository.findOneAndDelete({ id });
  }
}
