import { Request, Response } from 'express';
import httpStatus from 'http-status';
import productsService from '@/services/products-service';

export async function saveProduct(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const user = await userService.createUser({ email, password });
    return res.status(httpStatus.CREATED).json({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}