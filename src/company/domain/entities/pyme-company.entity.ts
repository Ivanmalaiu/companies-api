import { Company, Transfer } from './company.entity';

export class PymeCompany extends Company {
  constructor(
    id: string,
    name: string,
    joinedAt: Date,
    public readonly pymeCode: string,
    transfers: Transfer[] = [],
  ) {
    super(id, name, joinedAt, transfers);
  }
}
