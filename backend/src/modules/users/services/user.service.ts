import { Injectable } from '@nestjs/common';
import { UserRepository } from '@modules/users/repository/user.repository';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  createUser(name: string, email: string, password: string): Promise<User> {
    return this.userRepository.createUser(name, email, password);
  }

  loginUser(email: string, password: string): Promise<User | null> {
    return this.userRepository.loginUser(email, password);
  }

  findMe(userId: string): Promise<User | null> {
    return this.userRepository.findMe(userId);
  }

  getUserRole(userId: string): Promise<{ role: string } | null> {
    return this.userRepository.getUserRole(userId);
  }

  changeUserRole(userId: string, role: string): Promise<User> {
    return this.userRepository.changeUserRole(userId, role);
  }
}
