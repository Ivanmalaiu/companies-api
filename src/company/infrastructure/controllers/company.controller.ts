import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetCompaniesJoinedLastMonthUseCase } from '../../application/use-cases/get-companies-joined-last-month.use-case';
import { GetCompaniesWithTransfersLastMonthUseCase } from '../../application/use-cases/get-companies-with-transfers-last-month.use-case';
import { RegisterCompanyUseCase } from '../../application/use-cases/register-company.use-case';
import { CompanyDto } from '../dtos/create-company.dto';
import { CompanyType } from '../dtos/company-type.enum';
import { PymeCompany } from '../../../company/domain/entities/pyme-company.entity';
import { CorporateCompany } from '../../../company/domain/entities//corporate-company.entity';
import { v4 as uuidv4 } from 'uuid';
import { Transfer } from '../../../company/domain/entities/company.entity';
import { TransferDto } from '../dtos/transfer.dto';
@Controller('companies')
export class CompanyController {
  constructor(
    private readonly registerCompany: RegisterCompanyUseCase,
    private readonly getJoinedLastMonth: GetCompaniesJoinedLastMonthUseCase,
    private readonly getWithTransfers: GetCompaniesWithTransfersLastMonthUseCase,
  ) {}

  /**
   * POST /companies
   * Registra una empresa nueva (PyME o Corporativa)
   */
  @Post()
  register(@Body() body: CompanyDto) {
    const id = uuidv4(); // Genera un ID único
    const joinedAt = new Date(body.joinedAt); // Se solicita para poder probar los otros endpoints
    const transfers = this.mapTransfers(body.transfers);

    let company: PymeCompany | CorporateCompany;

    if (body.type === CompanyType.PYME) {
      // Creamos instancia concreta de PymeCompany
      company = new PymeCompany(
        id,
        body.name,
        joinedAt,
        body.pymeCode!,
        transfers,
      );
    } else if (body.type === CompanyType.CORPORATE) {
      // Creamos instancia concreta de CorporateCompany
      company = new CorporateCompany(
        id,
        body.name,
        joinedAt,
        body.headquarters!,
        transfers,
      );
    } else {
      throw new Error('Invalid company type'); // Esto no debería pasar si el DTO fue validado correctamente
    }

    this.registerCompany.execute(company);

    return { id };
  }

  /**
   * GET /companies/joined-last-month
   * Devuelve las empresas registradas en el último mes
   */
  @Get('/joined-last-month')
  getCompaniesJoined() {
    return this.getJoinedLastMonth.execute();
  }

  /**
   * GET /companies/with-transfers-last-month
   * Devuelve las empresas con transferencias en el último mes
   */
  @Get('/with-transfers-last-month')
  getCompaniesWithTransfers() {
    return this.getWithTransfers.execute();
  }

  /**
   * Método privado para mapear los transfers DTO a entidades del dominio
   */
  private mapTransfers(dtoTransfers?: TransferDto[]): Transfer[] {
    if (!dtoTransfers || dtoTransfers.length === 0) return [];
    return dtoTransfers.map(
      (t) => new Transfer(uuidv4(), t.amount, new Date(t.date)),
    );
  }
}
