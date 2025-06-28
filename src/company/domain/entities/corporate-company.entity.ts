import { Company, Transfer } from './company.entity';

export class CorporateCompany extends Company {
  constructor(
    id: string,
    name: string,
    joinedAt: Date,
    public readonly headquarters: string,
    transfers: Transfer[] = [],
  ) {
    super(id, name, joinedAt, transfers);
  }
}
