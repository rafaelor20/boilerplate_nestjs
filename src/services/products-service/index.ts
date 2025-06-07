import { productsRepository } from '../../repositories/productsRepository';
import { companiesRepository } from '../../repositories/companies-repository';

export const productsService = {
  async createProduct(data: { name: string; price: number; companyId: number }) {
    // Valida se a empresa existe
    const company = await companiesRepository.findById(data.companyId);
    if (!company) {
      throw new Error('Empresa não encontrada');
    }

    if (!data.name || data.name.length < 3) {
      throw new Error('O nome do produto deve ter no mínimo 3 caracteres');
    }

    if (data.price <= 0) {
      throw new Error('O preço deve ser maior que zero');
    }

    return productsRepository.create(data);
  },

  async getAllProducts() {
    return productsRepository.findAll();
  },

  async getProductById(id: number) {
    const product = await productsRepository.findById(id);
    if (!product) {
      throw new Error('Produto não encontrado');
    }
    return product;
  },

  async updateProduct(id: number, data: { name?: string; price?: number; companyId?: number }) {
    const product = await productsRepository.findById(id);
    if (!product) {
      throw new Error('Produto não encontrado');
    }

    if (data.companyId) {
      const company = await productsRepository.findById(data.companyId);
      if (!company) {
        throw new Error('Empresa não encontrada');
      }
    }

    if (data.name && data.name.length < 3) {
      throw new Error('O nome do produto deve ter no mínimo 3 caracteres');
    }

    if (data.price !== undefined && data.price <= 0) {
      throw new Error('O preço deve ser maior que zero');
    }

    return productsRepository.update(id, data);
  },

  async deleteProduct(id: number) {
    const product = await productsRepository.findById(id);
    if (!product) {
      throw new Error('Produto não encontrado');
    }

    return productsRepository.delete(id);
  },

  async getProductsByCompany(companyId: number) {
    const company = await companiesRepository.findById(companyId);
    if (!company) {
      throw new Error('Empresa não encontrada');
    }

    return productsRepository.findByCompanyId(companyId);
  },
};

