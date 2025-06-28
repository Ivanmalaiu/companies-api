export abstract class Company {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly joinedAt: Date = new Date(),
    public readonly transfers: Transfer[] = [],
  ) {}
}

export class Transfer {
  constructor(
    public readonly id: string,
    public readonly amount: number,
    public readonly date: Date,
  ) {}
}
