import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { StoreService } from '@modules/store/services/store.service';
import { Product } from '@prisma/client';
import { Request } from 'express';
import { type CartItems } from '@modules/store/types/store-types';
import { PaginatedProducts } from '@DTOs/store/store.dto';

@Controller('api/store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  async findProducts(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<PaginatedProducts> {
    const pageInt = parseInt(page) > 0 ? parseInt(page) : 1;
    const limitInt = parseInt(limit) > 0 ? parseInt(limit) : 10;
    return this.storeService.findProducts(pageInt, limitInt);
  }

  @Get('cart')
  async findCart(@Req() req: Request) {
    return this.storeService.findCart(parseInt(req.cookies['id']));
  }

  @Put('addToCart')
  async addProductToCart(
    @Req() req: Request,
    @Body('product_id') product_id: number,
  ): Promise<CartItems[]> {
    return this.storeService.addProductToCart(
      parseInt(req.cookies['id']),
      product_id,
    );
  }

  @Delete('removeFromCart')
  async removeProductFromCart(
    @Req() req: Request,
    @Body('product_id') product_id: number,
  ) {
    return this.storeService.removeProductFromCart(
      parseInt(req.cookies['id']),
      product_id,
    );
  }

  @Put('subtractFromCart')
  async subtractFromCart(
    @Req() req: Request,
    @Body('product_id') product_id: number,
  ): Promise<CartItems[]> {
    return this.storeService.decreaseProductQuantity(
      parseInt(req.cookies['id']),
      product_id,
    );
  }

  @Put('checkout')
  async checkout(@Req() req: Request) {
    return this.storeService.checkout(parseInt(req.cookies['id']));
  }

  @Post('products')
  async createProduct(
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('stock') stock: number,
    @Body('price') price: number,
    @Body('category') category: string,
    @Body('image_url') image_url: string,
  ): Promise<Product> {
    return this.storeService.createProduct(
      name,
      description,
      stock,
      price,
      category,
      image_url,
    );
  }

  @Get('products/:id')
  async findProductById(@Req() req: Request): Promise<Product | null> {
    return this.storeService.findProductById(parseInt(req.params.id));
  }

  @Put('products/:id')
  async editProduct(
    @Req() req: Request,
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('stock') stock: number,
    @Body('price') price: number,
    @Body('category') category: string,
    @Body('image_url') image_url: string,
  ): Promise<Product> {
    return this.storeService.editProduct(
      parseInt(req.params.id),
      name,
      description,
      stock,
      price,
      category,
      image_url,
    );
  }
}
