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

// ACTIONS DELETE
export class DeleteCategory implements Action {
  readonly type = indexActions.DELETE_CATEGORY;
}

export class DeleteCategoryFail implements Action {
  readonly type = indexActions.DELETE_CATEGORY_FAIL;
  constructor(public payload: any) {}
}

export class DeleteCategorySuccess implements Action {
  readonly type = indexActions.DELETE_CATEGORY_SUCCESS;
  constructor(public payload: Category) {}
}

// ACTIONS UPDATE
export class UpdateCategory implements Action {
  readonly type = indexActions.UPDATE_CATEGORY;
}

export class UpdateCategoryFail implements Action {
  readonly type = indexActions.UPDATE_CATEGORY_FAIL;
  constructor(public payload: any) {}
}

export class UpdateCategorySuccess implements Action {
  readonly type = indexActions.UPDATE_CATEGORY_SUCCESS;
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
  | DeleteCategory
  | DeleteCategoryFail
  | DeleteCategorySuccess
  | UpdateCategory
  | UpdateCategoryFail
  | UpdateCategorySuccess
  | GetAllCategories
  | GetAllCategoriesFail
  | GetAllCategoriesSuccess
  | UnsetCategories;
