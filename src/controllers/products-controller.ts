import { Request, Response } from 'express';
import { productsService } from '../services/products-service';

export const productsController = {
  async create(req: Request, res: Response) {
    try {
      const { name, price, companyId } = req.body;
      const product = await productsService.createProduct({
        name,
        price,
        companyId,
      });
      return res.status(201).json(product);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const products = await productsService.getAllProducts();
      return res.json(products);
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const product = await productsService.getProductById(id);
      return res.json(product);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { name, price, companyId } = req.body;
      const updatedProduct = await productsService.updateProduct(id, {
        name,
        price,
        companyId,
      });
      return res.json(updatedProduct);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await productsService.deleteProduct(id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  },

  async getByCompany(req: Request, res: Response) {
    try {
      const companyId = parseInt(req.params.companyId);
      const products = await productsService.getProductsByCompany(companyId);
      return res.json(products);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  },
};
