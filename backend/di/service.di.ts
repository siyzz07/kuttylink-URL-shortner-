import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";
import { UrlService } from "../services/url.service";
import { UrlController } from "../controllers/url.controller";
import { userRepositoryInstance, urlRepositoryInstance } from "./repository.di";

export const authserviceInstance = new AuthService(userRepositoryInstance);
export const authControllerInstance = new AuthController(authserviceInstance);

export const urlServiceInstance = new UrlService(urlRepositoryInstance);
export const urlControllerInstance = new UrlController(urlServiceInstance);