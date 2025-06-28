import { Module } from '@nestjs/common';
import { CompanyController } from './infrastructure/controllers/company.controller';
import { RegisterCompanyUseCase } from './application/use-cases/register-company.use-case';
import { GetCompaniesJoinedLastMonthUseCase } from './application/use-cases/get-companies-joined-last-month.use-case';
import { GetCompaniesWithTransfersLastMonthUseCase } from './application/use-cases/get-companies-with-transfers-last-month.use-case';
import { InMemoryCompanyRepository } from './infrastructure/persistence/in-memory-company.repository';

@Module({
  controllers: [CompanyController],
  providers: [
    RegisterCompanyUseCase,
    GetCompaniesJoinedLastMonthUseCase,
    GetCompaniesWithTransfersLastMonthUseCase,
    { provide: `CompanyRepositoryPort`, useClass: InMemoryCompanyRepository },
  ],
})
export class CompanyModule {}
