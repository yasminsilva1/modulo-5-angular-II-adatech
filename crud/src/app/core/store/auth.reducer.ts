import { createReducer, on } from '@ngrx/store';
import { AuthenticatedUser } from '../../modules/auth/models/authenticated-user.model';
import { setUser } from './auth.actions';

export interface UserState {
  user: AuthenticatedUser | null;
}

export const initialState: UserState = { user: null };

export const userReducer = createReducer(
  initialState,
  on(setUser, (state, { user }) => ({
    ...state,
    user,
  }))
);
