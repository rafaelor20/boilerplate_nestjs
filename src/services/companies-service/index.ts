import { companiesRepository } from '../../repositories/companies-repository';

export const companiesService = {
  async createCompany(data: { name: string; address?: string }) {
    // Regra de negócio: Nome único
    const existingCompany = await companiesRepository.findByName(data.name);
    if (existingCompany) {
      throw new Error('Empresa já cadastrada');
    }

    return companiesRepository.create(data);
  },

  async getAllCompanies() {
    return companiesRepository.findAll();
  },

  async getCompanyById(id: number) {
    const company = await companiesRepository.findById(id);
    if (!company) {
      throw new Error('Empresa não encontrada');
    }
    return company;
  },

  async updateCompany(id: number, data: { name?: string; address?: string }) {
    const company = await companiesRepository.findById(id);
    if (!company) {
      throw new Error('Empresa não encontrada');
    }

    if (data.name && data.name !== company.name) {
      const nameExists = await companiesRepository.findByName(data.name);
      if (nameExists) {
        throw new Error('Nome de empresa já utilizado');
      }
    }

    return companiesRepository.update(id, data);
  },

  async deleteCompany(id: number) {
    const company = await companiesRepository.findById(id);
    if (!company) {
      throw new Error('Empresa não encontrada');
    }

    // Se quiser, pode verificar se a empresa possui produtos e impedir exclusão
    // ou então remover em cascata, dependendo da regra de negócio

    return companiesRepository.delete(id);
  },
};
