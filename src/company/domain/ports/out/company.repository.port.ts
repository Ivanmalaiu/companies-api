import { Company } from '../../entities/company.entity';

export interface CompanyRepositoryPort {
  save(company: Company): void;
  findJoinedBetween(start: Date, end: Date): Company[];
  findTransferredCompaniesBetween(start: Date, end: Date): Company[];
}
