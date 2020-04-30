// NGRX
import { Action } from '@ngrx/store';
// MODELS
import { Category } from '../../../models/category.model';
// LIST INDEX
import * as indexActions from './list_actions.actions';

// ACTIONS ADD
export class AddCategory implements Action {
  readonly type = indexActions.ADD_CATEGORY;
}

export class AddCategoryFail implements Action {
  readonly type = indexActions.ADD_CATEGORY_FAIL;
  constructor(public payload: any) {}
}

export class AddCategorySuccess implements Action {
  readonly type = indexActions.ADD_CATEGORY_SUCCESS;
  constructor(public payload: Category) {}
}

// ACTIONS GET ALL
export class GetAllCategories implements Action {
  readonly type = indexActions.GET_ALL_CATEGORIES;
}

export class GetAllCategoriesFail implements Action {
  readonly type = indexActions.GET_ALL_CATEGORIES_FAIL;
  constructor(public payload: any) {}
}

export class GetAllCategoriesSuccess implements Action {
  readonly type = indexActions.GET_ALL_CATEGORIES_SUCCESS;
  constructor(public payload: Category[]) {}
}

export class UnsetCategories implements Action {
  readonly type = indexActions.UNSET_CATEGORIES;
}

export type CategoriesActions =
  | AddCategory
  | AddCategoryFail
  | AddCategorySuccess
  | GetAllCategories
  | GetAllCategoriesFail
  | GetAllCategoriesSuccess
  | UnsetCategories;
