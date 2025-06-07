import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Cria algumas empresas
  const company1 = await prisma.company.create({
    data: {
      name: 'Tech Solutions',
      address: 'Rua da Inovação, 123',
      products: {
        create: [
          { name: 'Software Pro', price: 499.99 },
          { name: 'Hardware Basic', price: 299.99 },
          { name: 'Gadget X', price: 199.99 },
          { name: 'Smartphone Y', price: 699.99 },
          { name: 'Laptop Z', price: 1299.99 },
          { name: 'Tablet A', price: 499.99 },
          { name: 'Smartwatch B', price: 199.99 },
          { name: 'Drone C', price: 999.99 },
          { name: 'VR Headset D', price: 399.99 },
          { name: 'AI Assistant E', price: 249.99 }
        ]
      }
    }
  });

  const company2 = await prisma.company.create({
    data: {
      name: 'AgroTech',
      address: 'Avenida das Plantas, 456',
      products: {
        create: [
          { name: 'Trator Smart', price: 89999.99 },
          { name: 'Sensor Field', price: 2999.99 },
          { name: 'Drone Agrícola', price: 4999.99 },
          { name: 'Irrigação Inteligente', price: 1999.99 },
          { name: 'Colheitadeira Avançada', price: 129999.99 },
          { name: 'Semente Premium', price: 49.99 },
          { name: 'Fertilizante Orgânico', price: 29.99 },
          { name: 'Pesticida Natural', price: 19.99 },
          { name: 'Software de Gestão Agrícola', price: 999.99 },
          { name: 'Sistema de Monitoramento de Culturas', price: 1499.99 }
        ]
      }
    }
  });

  const company3 = await prisma.company.create({
    data: {
      name: 'EcoFriendly',
      address: 'Rua Verde, 789',
      products: {
        create: [
          { name: 'Painel Solar', price: 4999.99 },
          { name: 'Bicicleta Elétrica', price: 1999.99 },
          { name: 'Carregador Solar Portátil', price: 199.99 },
          { name: 'Kit de Jardinagem Sustentável', price: 49.99 },
          { name: 'Filtro de Água Ecológico', price: 29.99 },
          { name: 'Lâmpada LED Inteligente', price: 19.99 },
          { name: 'Compostor Doméstico', price: 99.99 },
          { name: 'Roupas Orgânicas', price: 79.99 },
          { name: 'Produtos de Limpeza Ecológicos', price: 39.99 },
          { name: 'Móveis Sustentáveis', price: 499.99 }
        ]
      }
    }
  });

  const company4 = await prisma.company.create({
    data: {
      name: 'HealthTech',
      address: 'Avenida da Saúde, 321',
      products: {
        create: [
          { name: 'Monitor de Saúde Wearable', price: 299.99 },
          { name: 'Aplicativo de Fitness', price: 9.99 },
          { name: 'Suplemento Nutricional', price: 29.99 },
          { name: 'Equipamento de Ginástica', price: 499.99 },
          { name: 'Kit de Primeiros Socorros', price: 49.99 },
          { name: 'Teste de Saúde em Casa', price: 19.99 },
          { name: 'Alimentos Funcionais', price: 39.99 },
          { name: 'Roupas Esportivas', price: 59.99 },
          { name: 'Acessórios de Yoga', price: 29.99 },
          { name: 'Equipamento de Reabilitação', price: 199.99 }
        ]
      }
    }
  });

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

