import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class TransferDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsDateString()
  date: string; // Se recibe como string ISO en JSON, se transforma luego a Date
}
