import { Inject, Injectable } from '@nestjs/common';
import { Company } from 'src/company/domain/entities/company.entity';
import { CompanyRepositoryPort } from 'src/company/domain/ports/out/company.repository.port';

@Injectable()
export class RegisterCompanyUseCase {
  constructor(
    @Inject(`CompanyRepositoryPort`)
    private readonly companyRepository: CompanyRepositoryPort,
  ) {}

  execute(company: Company): void {
    this.companyRepository.save(company);
  }
}
