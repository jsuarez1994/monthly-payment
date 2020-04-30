// MODEL
import { Category } from '../../../models/category.model';
// ACTIONS USER
import * as CategoryAction from '../../actions';
// LIST ACTIONS
import * as listActions from '../../actions/categories/list_actions.actions';
// INTERFACE USER
import { CategoryState } from './category.interface';

/**
 * Initialize state to manage
 */
const initState: CategoryState = initializeState();

export function categoryReducer(
  state = initState,
  action: CategoryAction.CategoriesActions
): CategoryState {
  switch (action.type) {
    case listActions.ADD_CATEGORY:
      return returnStateADD_CATEGORY(state);

    case listActions.ADD_CATEGORY_SUCCESS:
      return returnStateADD_CATEGORY_SUCCESS(state, action.payload);

    case listActions.ADD_CATEGORY_FAIL:
      return returnStateADD_CATEGORY_FAIL(state, action.payload);

    case listActions.GET_ALL_CATEGORIES:
      return returnStateGET_ALL_CATEGORIES(state);

    case listActions.GET_ALL_CATEGORIES_SUCCESS:
      return returnStateGET_ALL_CATEGORIES_SUCCESS(state, action.payload);

    case listActions.GET_ALL_CATEGORIES_FAIL:
      return returnStateGET_ALL_CATEGORIES_FAIL(state, action.payload);

    case listActions.UNSET_CATEGORIES:
      return returnStateUNSET_CATEGORIES(state);

    default:
      return state;
  }
}

/**
 * Initialize state to manage
 */
function initializeState(): CategoryState {
  return {
    categories: [],
    loaded: false,
    error: null,
  };
}

/**
 * Return state to action ADD_CATEGORY
 * @param state
 */
function returnStateADD_CATEGORY(state: CategoryState): CategoryState {
  console.log('### ADD Category STATE ###');
  console.log(state);
  return {
    ...state,
    loaded: false,
    error: null,
  };
}

/**
 * Return state to action ADD_CATEGORY_SUCCESS
 * @param state
 * @param action
 */
function returnStateADD_CATEGORY_SUCCESS(
  state: CategoryState,
  params: Category
): CategoryState {
  console.log('### ADD Category SUCCESS STATE ###');
  console.log(state);
  console.log('### ADD Category SUCCESS PARAMS ###');
  console.log(params);

  // Add new Category
  let categoriesState: Category[] = state.categories;
  categoriesState.push(params);

  return {
    ...state,
    categories: categoriesState,
    loaded: true,
    error: null,
  };
}

/**
 * Return state to action ADD_CATEGORY_FAIL
 * @param state
 * @param params
 */
function returnStateADD_CATEGORY_FAIL(
  state: CategoryState,
  params: any
): CategoryState {
  console.log('###  USER FAIL STATE ###');
  console.log(state);
  console.log('###  USER FAIL PARAMS ###');
  console.log(params);
  return {
    ...state,
    loaded: true,
    error: params,
  };
}

/**
 * Return state to action GET_ALL_CATEGORIES
 * @param state
 * @param params
 */
function returnStateGET_ALL_CATEGORIES(state: CategoryState): CategoryState {
  console.log('### GET ALL CATEGORIES ###');
  console.log(state);
  return {
    ...state,
    loaded: false,
    error: null,
  };
}

/**
 * Return state to action GET_ALL_CATEGORIES_SUCCESS
 * @param state
 * @param params
 */
function returnStateGET_ALL_CATEGORIES_SUCCESS(
  state: CategoryState,
  params: Category[]
): CategoryState {
  console.log('### GET ALL CATEGORIES SUCCESS STATE ###');
  console.log(state);
  console.log('### GET ALL CATEGORIES SUCCESS PARAMS ###');
  console.log(params);
  return {
    ...state,
    categories: params,
    loaded: true,
    error: null,
  };
}

/**
 * Return state to action GET_ALL_CATEGORIES_FAIL
 * @param state
 * @param params
 */
function returnStateGET_ALL_CATEGORIES_FAIL(
  state: CategoryState,
  params: any
): CategoryState {
  console.log('### GET ALL CATEGORIES FAIL STATE ###');
  console.log(state);
  console.log('### GET ALL CATEGORIES FAIL PARAMS ###');
  console.log(params);
  return {
    ...state,
    loaded: true,
    error: params,
  };
}

/**
 * Return state to action GET_ALL_CATEGORIES_FAIL
 * @param state
 * @param params
 */
function returnStateUNSET_CATEGORIES(
  state: CategoryState
): CategoryState {
  console.log('### GET ALL CATEGORIES FAIL STATE ###');
  console.log(state);
  return {
    ...state,
    categories: [],
    loaded: true,
    error: null,
  };
}
