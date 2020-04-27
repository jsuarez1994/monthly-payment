// NGRX
import { ActionReducerMap } from '@ngrx/store';
// REDUCERS
import * as reducers from './reducers';
// INTERFACES
import { UserState } from './reducers/users/user.interface'

export interface AppState {
  user: UserState;
}

export const appReducers: ActionReducerMap<AppState> = {
    user: reducers.userReducer
}
