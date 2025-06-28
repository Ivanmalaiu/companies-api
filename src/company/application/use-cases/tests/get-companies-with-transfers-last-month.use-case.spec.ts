import { GetCompaniesWithTransfersLastMonthUseCase } from '../get-companies-with-transfers-last-month.use-case';
import { CompanyRepositoryPort } from '../../../domain/ports/out/company.repository.port';
import { PymeCompany } from '../../../domain/entities/pyme-company.entity';
import { subDays } from 'date-fns';

describe('GetCompaniesWithTransfersLastMonthUseCase', () => {
  let useCase: GetCompaniesWithTransfersLastMonthUseCase;
  let mockRepository: Partial<CompanyRepositoryPort>;

  beforeEach(() => {
    mockRepository = {
      findTransferredCompaniesBetween: jest.fn(),
    };

    useCase = new GetCompaniesWithTransfersLastMonthUseCase(
      mockRepository as CompanyRepositoryPort,
    );
  });

  it('should return companies with transfers in the last month', () => {
    const start = subDays(new Date(), 30);
    const end = new Date();

    const mockCompanies = [
      new PymeCompany('1', 'Empresa Transferidora', new Date(), 'PYM-567'),
    ];

    (
      mockRepository.findTransferredCompaniesBetween as jest.Mock
    ).mockReturnValue(mockCompanies);

    const result = useCase.execute();

    expect(mockRepository.findTransferredCompaniesBetween).toHaveBeenCalledWith(
      start,
      end,
    );
    expect(result).toBe(mockCompanies);
  });
});
