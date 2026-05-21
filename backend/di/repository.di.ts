import { UserRepository } from "../repositories/user.repository";
import { UrlRepository } from "../repositories/url.repository";


export const userRepositoryInstance = new UserRepository();
export const urlRepositoryInstance = new UrlRepository();