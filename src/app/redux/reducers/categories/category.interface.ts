// MODELS
import { Category } from '../../../models/category.model';

export interface CategoryState {
  categories: Category[];
  loaded: boolean;
  error: any;
}
