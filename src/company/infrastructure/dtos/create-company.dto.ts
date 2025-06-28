import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CompanyType } from './company-type.enum';
import { TransferDto } from './transfer.dto';
export class CompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(CompanyType)
  type: CompanyType;

  @IsNotEmpty()
  @IsDateString()
  joinedAt: string;

  @ValidateIf((o: CompanyDto) => o.type === CompanyType.PYME)
  @IsNotEmpty()
  @IsString()
  pymeCode?: string;

  @ValidateIf((o: CompanyDto) => o.type === CompanyType.CORPORATE)
  @IsNotEmpty()
  @IsString()
  headquarters?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransferDto)
  transfers?: TransferDto[];
}
