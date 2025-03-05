import { Injectable } from '@nestjs/common';
import { StoreRepository } from '@modules/store/repository/store.repository';
import { Product } from '@prisma/client';
import { type CartItems } from '@modules/store/types/store-types';
import { PaginatedProducts } from '@DTOs/store/store.dto';

@Injectable()
export class StoreService {
  constructor(private readonly storeRepository: StoreRepository) {}

  async findProducts(page: number, limit: number): Promise<PaginatedProducts> {
    const { products, total } = await this.storeRepository.findProducts(
      page,
      limit,
    );
    const totalPages = Math.ceil(total / limit);
    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }
  async findProductById(product_id: number): Promise<Product | null> {
    return this.storeRepository.findProductById(product_id);
  }

  async findCart(user_id: number) {
    return this.storeRepository.findCart(user_id);
  }

  async createProduct(
    name: string,
    description: string,
    stock: number,
    price: number,
    category: string,
    image_url: string,
  ): Promise<Product> {
    return this.storeRepository.createProduct(
      name,
      description,
      stock,
      price,
      category,
      image_url,
    );
  }

  async editProduct(
    product_id: number,
    name: string,
    description: string,
    stock: number,
    price: number,
    category: string,
    image_url: string,
  ): Promise<Product> {
    return this.storeRepository.editProduct(
      product_id,
      name,
      description,
      stock,
      price,
      category,
      image_url,
    );
  }

  async addProductToCart(
    user_id: number,
    product_id: number,
  ): Promise<CartItems[]> {
    return this.storeRepository.addProductToCart(user_id, product_id);
  }

  async removeProductFromCart(user_id: number, product_id: number) {
    return this.storeRepository.removeProductFromCart(user_id, product_id);
  }

  async decreaseProductQuantity(user_id: number, product_id: number) {
    return this.storeRepository.decreaseProductQuantity(user_id, product_id);
  }

  async checkout(user_id: number) {
    return this.storeRepository.checkout(user_id);
  }
}
