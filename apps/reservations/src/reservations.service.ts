import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ClientProxy } from '@nestjs/microservices';
import { PAYMENTS_SERVICE, User } from '@app/common';
import { map } from 'rxjs';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly prismaService: PrismaService,
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
          return this.prismaService.reservation.create({
            data: {
              startDate: createReservationDto.startDate,
              endDate: createReservationDto.endDate,
              invoiceId: res.id,
              timestamp: new Date(),
              userId,
            },
          });
        }),
      );
  }

  findAll() {
    return this.prismaService.reservation.findMany({});
  }

  findOne(id: number) {
    return this.prismaService.reservation.findFirstOrThrow({
      where: { id },
    });
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.prismaService.reservation.update({
      data: updateReservationDto,
      where: { id },
    });
  }

  remove(id: number) {
    return this.prismaService.reservation.delete({ where: { id } });
  }
}
