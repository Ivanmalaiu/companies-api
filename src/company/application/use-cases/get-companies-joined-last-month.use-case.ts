import { Inject, Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';
import { Company } from 'src/company/domain/entities/company.entity';
import { CompanyRepositoryPort } from 'src/company/domain/ports/out/company.repository.port';

@Injectable()
export class GetCompaniesJoinedLastMonthUseCase {
  constructor(
    @Inject(`CompanyRepositoryPort`)
    private readonly companyRepository: CompanyRepositoryPort,
  ) {}

  execute(): Company[] {
    const start = subDays(new Date(), 30);
    const end = new Date();

    return this.companyRepository.findJoinedBetween(start, end);
  }
}
