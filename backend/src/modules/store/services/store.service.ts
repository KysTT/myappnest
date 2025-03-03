import { Injectable } from '@nestjs/common';
import { StoreRepository } from '@modules/store/repository/store.repository';
import { Cart, CartItem, Product } from '@prisma/client';

@Injectable()
export class StoreService {
  constructor(private readonly storeRepository: StoreRepository) {}

  async findProducts(): Promise<Product[]> {
    return this.storeRepository.findProducts();
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
  ): Promise<CartItem> {
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
