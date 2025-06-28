import { GetCompaniesJoinedLastMonthUseCase } from '../get-companies-joined-last-month.use-case';
import { CompanyRepositoryPort } from '../../../domain/ports/out/company.repository.port';
import { PymeCompany } from '../../../domain/entities/pyme-company.entity';
import { subDays } from 'date-fns';

describe('GetCompaniesJoinedLastMonthUseCase', () => {
  let useCase: GetCompaniesJoinedLastMonthUseCase;
  let mockRepository: Partial<CompanyRepositoryPort>;

  beforeEach(() => {
    mockRepository = {
      findJoinedBetween: jest.fn(),
    };
    useCase = new GetCompaniesJoinedLastMonthUseCase(
      mockRepository as CompanyRepositoryPort,
    );
  });

  it('should return companies joined in the last month', () => {
    // const oneMonthAgo = subMonths(new Date(), 1);
    const start = subDays(new Date(), 30);
    const end = new Date();
    const mockCompanies = new PymeCompany(
      '1',
      'Test Co',
      new Date(),
      'PYM-123',
    );
    (mockRepository.findJoinedBetween as jest.Mock).mockReturnValue(
      mockCompanies,
    );

    const result = useCase.execute();

    expect(mockRepository.findJoinedBetween).toHaveBeenCalledWith(start, end);
    expect(result).toBe(mockCompanies);
  });
});
