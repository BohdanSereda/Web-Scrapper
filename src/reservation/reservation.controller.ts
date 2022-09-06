import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationsStatusDto } from './dto/update-reservation-status.dto';
import { ReservationService } from './reservation.service';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiResponse({status: 201, description: 'Create new reservation' })
  @ApiResponse({ status: 500, description: 'Internal server error.'})
  createReservation(@Body() body: CreateReservationDto){
    return this.reservationService.createReservation(body.email, body.date, body.time, body.userName)
  }

  @Get()
  @ApiResponse({status: 200, description: 'Get all reservations with status: "pending"'})
  @ApiResponse({ status: 500, description: 'Internal server error.'})
  getAllPendingReservations(){
    return this.reservationService.getAllPendingReservations()
  }

  @Patch(':id')
  @ApiResponse({status: 200, description: 'Update reservation with status' })
  @ApiResponse({ status: 500, description: 'Internal server error.'})
  updateReservationsStatus(@Param('id') id: string, @Body() updateReservationsStatus: UpdateReservationsStatusDto){
    return this.reservationService.updateReservationsStatus(id, updateReservationsStatus)
  }
}
