import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationsStatusDto } from './dto/update-reservation-status.dto';
import { ReservationService } from './reservation.service';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  createReservation(@Body() body: CreateReservationDto){
    return this.reservationService.createReservation(body.email, body.date, body.time, body.userName)
  }

  @Get()
  getAllPendingReservations(){
    return this.reservationService.getAllPendingReservations()
  }

  @Patch(':id')
  updateReservationsStatus(@Param('id') id: string, @Body() status: UpdateReservationsStatusDto){
    return this.reservationService.updateReservationsStatus(id, status)
  }
}
