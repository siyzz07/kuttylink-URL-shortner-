import { IUserRepository } from '../interfaces/user.repository.interface';
import { IAuthService } from '../interfaces/auth.service.interface';
import { MESSAGES } from '../constants';
import bcrypt from 'bcryptjs';

export class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {}

  async registerUser(userData: any) {
    const { name, email, password } = userData;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error(MESSAGES.USER_ALREADY_EXISTS);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await this.userRepository.create({
      name,
      email,
      passwordHash,
    });

    return {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };
  }
  
  async loginUser(credentials: any) {
    const { email, password } = credentials;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error(MESSAGES.INVALID_CREDENTIALS);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error(MESSAGES.INVALID_CREDENTIALS);
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  }
}
