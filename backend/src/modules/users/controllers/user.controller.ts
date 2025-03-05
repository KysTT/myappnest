import { Body, Controller, Get, Post, Put, Req, Res } from '@nestjs/common';
import { UserService } from '@modules/users/services/user.service';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { GenericResponse } from '@utils/responses/generic-response';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async CreateUser(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<User> {
    const user = await this.userService.createUser(name, email, password);
    response.cookie('id', user.id.toString(), {
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    return user;
  }

  @Post('login')
  async LoginUser(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() response: Response,
  ) {
    const user = await this.userService.loginUser(email, password);
    if (user !== null) {
      response.cookie('id', user.id.toString(), {
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
      return response.status(200).json(
        new GenericResponse<User | null>(user, {
          clientKnownRequestError: 'login failed',
          success: 'login successful',
        }),
      );
    }
    return response.status(400).json(
      new GenericResponse<User | null>(null, {
        clientKnownRequestError: 'login failed',
        success: 'user does not exist',
      }),
    );
  }

  @Post('logout')
  LogoutUser(@Res({ passthrough: true }) response: Response): void {
    response.clearCookie('id');
    response.redirect('localhost:5173/profile');
  }

  @Get('me')
  async findMe(@Req() req: Request): Promise<User | null> {
    return this.userService.findMe(req.cookies['id']);
  }

  @Get('userRole')
  async getUserRole(@Req() req: Request) {
    return this.userService.getUserRole(req.cookies['id']);
  }

  @Put('userRole')
  async changeUserRole(
    @Req() req: Request,
    @Body('role') role: string,
  ): Promise<User> {
    return this.userService.changeUserRole(req.cookies['id'], role);
  }
}
