import { IUserRepository } from "../interfaces/user.repository.interface";
import { IAuthService } from "../interfaces/auth.service.interface";
import { HTTP_STATUS, MESSAGES } from "../constants";
import { AppError } from "../utils/appError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService implements IAuthService {
  private userRepository: IUserRepository;

  constructor(userrepository: IUserRepository) {
    this.userRepository = userrepository;
  }

  async registerUser(userData: any) {
    const { name, email, password } = userData;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError(MESSAGES.USER_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
    }

    const passwordHash = await bcrypt.hash(password, 10);

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
      throw new AppError(MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError(MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_REFRESH_SECRET || "refresh_fallback_secret",
      { expiresIn: "7d" }
    );

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      accessToken,
      refreshToken,
    };
  }
}
