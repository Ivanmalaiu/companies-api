import { RegisterCompanyUseCase } from '../register-company.use-case';
import { CompanyRepositoryPort } from '../../../domain/ports/out/company.repository.port';
import { PymeCompany } from '../../../domain/entities/pyme-company.entity';

describe('RegisterCompanyUseCase', () => {
  let useCase: RegisterCompanyUseCase;
  let mockRepository: Partial<CompanyRepositoryPort>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
    };

    useCase = new RegisterCompanyUseCase(
      mockRepository as CompanyRepositoryPort,
    );
  });

  it('should save a new company using the repository', () => {
    const company = new PymeCompany('1', 'Empresa Pyme', new Date(), 'PYM-987');

    useCase.execute(company);

    expect(mockRepository.save).toHaveBeenCalledWith(company);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  });
});
