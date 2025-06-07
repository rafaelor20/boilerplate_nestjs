import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const productsRepository = {
  // Cria um produto
  async create(data: { name: string; price: number; companyId: number }) {
    return prisma.product.create({ data });
  },

  // Lista todos os produtos
  async findAll() {
    return prisma.product.findMany({
      include: { company: true }, // inclui dados da empresa
    });
  },

  // Busca produto por ID
  async findById(id: number) {
    return prisma.product.findUnique({
      where: { id },
      include: { company: true },
    });
  },

  // Atualiza um produto
  async update(id: number, data: { name?: string; price?: number; companyId?: number }) {
    return prisma.product.update({
      where: { id },
      data,
    });
  },

  // Deleta um produto
  async delete(id: number) {
    return prisma.product.delete({
      where: { id },
    });
  },

  // Busca produtos de uma empresa específica
  async findByCompanyId(companyId: number) {
    return prisma.product.findMany({
      where: { companyId: companyId},
      include: { company: false }, // não inclui dados da empresa
    });
  },
};

export default productsRepository;
