import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationsStatusDto } from './dto/update-reservation-status.dto';
import { Reservation } from './entities/reservation.entity';
import { ReservationService } from './reservation.service';

@ApiTags('Reservations')
@Controller('reservation')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    @Post()
    @ApiOperation({ summary: 'Reservation creation' })
    @ApiResponse({
        status: 201,
        description: 'Create new reservation.',
        type: Reservation,
    })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    createReservation(
        @Body() body: CreateReservationDto,
    ): Promise<Reservation> {
        return this.reservationService.createReservation(
            body.email,
            body.date,
            body.time,
            body.userName,
        );
    }

    @Get()
    @ApiOperation({ summary: 'Reservations finding' })
    @ApiResponse({
        status: 200,
        description: 'Get all reservations with status: "pending"',
        type: Reservation,
    })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async getAllPendingReservations(): Promise<Reservation[]> {
        return this.reservationService.getAllPendingReservations();
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Reservation status updating' })
    @ApiResponse({
        status: 200,
        description: 'Update reservation with status.',
        type: Reservation,
    })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    @ApiResponse({ status: 404, description: 'Not found' })
    async updateReservationsStatus(
        @Param('id') id: string,
        @Body() updateReservationsStatus: UpdateReservationsStatusDto,
    ): Promise<Reservation> {
        return this.reservationService.updateReservationsStatus(
            id,
            updateReservationsStatus,
        );
    }
}
