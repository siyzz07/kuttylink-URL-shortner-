import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';

// Dependency Injection Container (Composition Root)
// This strictly separates object creation from object use, fulfilling Dependency Inversion Principle.
class AuthContainer {
  private static instance: AuthController;

  static getController(): AuthController {
    if (!this.instance) {
      const userRepository = new UserRepository();
      const authService = new AuthService(userRepository);
      this.instance = new AuthController(authService);
    }
    return this.instance;
  }
}

export const authControllerInstance = AuthContainer.getController();
