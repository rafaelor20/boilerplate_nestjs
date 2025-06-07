import { Prisma } from '@prisma/client';
import { prisma } from '@/config';

export const companiesRepository = {
  // Cria uma nova empresa
  async create(data: { name: string; address?: string }) {
    return prisma.company.create({ data });
  },

  // Lista todas as empresas
  async findAll() {
    return prisma.company.findMany({
      include: { products: false }, // opcional, inclui produtos
    });
  },

  // Busca empresa por ID
  async findById(id: number) {
    return prisma.company.findUnique({
      where: { id },
      include: { products: true },
    });
  },

  // Busca empresa por nome (para validar duplicidade)
  async findByName(name: string) {
    return prisma.company.findUnique({
      where: { name },
    });
  },

  // Atualiza uma empresa
  async update(id: number, data: { name?: string; address?: string }) {
    return prisma.company.update({
      where: { id },
      data,
    });
  },

  // Deleta uma empresa e seus produtos associados
  async delete(id: number) {
    // Primeiro, deleta os produtos associados à empresa
    await prisma.product.deleteMany({
      where: { companyId: id },
    });
    // Depois, deleta a empresa
    return prisma.company.delete({
      where: { id },
    });
  },
};

export default companiesRepository;
