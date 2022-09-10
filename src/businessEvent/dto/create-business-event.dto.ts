import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsEmail, IsIn } from "class-validator"
import { StatusType } from "./custom-types"

export class CreateBusinessEventDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({type: String, description: 'event name'})
    readonly name: string

    @IsString()
    @ApiProperty({type: String, description: 'event start time'})
    readonly event_start: string

    @IsString()
    @ApiProperty({type: String, description: 'event end time'})
    readonly event_end: string

    @IsString()
    @ApiProperty({type: String, description: 'event description'})
    readonly description: string
    
    @IsString()
    @ApiProperty({type: String, description: 'event image'})
    readonly image: string

    @IsString()
    @ApiProperty({type: String, description: 'event features'})
    readonly features: string

    @IsString()
    @IsIn(['daily', 'weekly', 'monthly', 'yearly', ''])
    @ApiProperty({type: "StatusType", description: 'event frequency'})
    frequency?: StatusType
}
