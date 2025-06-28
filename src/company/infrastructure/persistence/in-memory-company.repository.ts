import { Injectable } from '@nestjs/common';
import { Company } from 'src/company/domain/entities/company.entity';
import { CompanyRepositoryPort } from 'src/company/domain/ports/out/company.repository.port';

@Injectable()
export class InMemoryCompanyRepository implements CompanyRepositoryPort {
  private companies: Company[] = [];

  save(company: Company): void {
    this.companies.push(company);
  }
  findJoinedBetween(start: Date, end: Date): Company[] {
    return this.companies.filter(
      (company) => company.joinedAt >= start && company.joinedAt <= end,
    );
  }
  findTransferredCompaniesBetween(start: Date, end: Date): Company[] {
    return this.companies.filter((company) =>
      company.transfers.some((t) => t.date >= start && t.date <= end),
    );
  }
}
