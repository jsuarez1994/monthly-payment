// MODELS
import { User } from '../../../models/user.model';

export interface UserState {
  user: User;
  authenticated: boolean;
  error: any;
}
