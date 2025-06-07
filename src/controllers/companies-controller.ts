import { Request, Response } from 'express';
import { companiesService } from '../services/companies-service';

export const companiesController = {
  async create(req: Request, res: Response) {
    try {
      const { name, address } = req.body;
      const company = await companiesService.createCompany({ name, address });
      return res.status(201).json(company);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const companies = await companiesService.getAllCompanies();
      return res.json(companies);
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro ao buscar empresas' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const company = await companiesService.getCompanyById(id);
      return res.json(company);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { name, address } = req.body;
      const updatedCompany = await companiesService.updateCompany(id, { name, address });
      return res.json(updatedCompany);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await companiesService.deleteCompany(id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  },
};

