import { connectToDatabase } from '../lib/db';
import { UserModel, IUser } from '../models/user.model';
import { IUserRepository } from '../interfaces/user.repository.interface';

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    await connectToDatabase();
    return UserModel.findOne({ email }).exec();
  }

  async create(user: Partial<IUser>): Promise<IUser> {
    await connectToDatabase();
    const newUser = new UserModel(user);
    return newUser.save();
  }
}
