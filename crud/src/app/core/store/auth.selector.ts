import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './auth.reducer';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUser = createSelector(selectUserState, (state) => {
  return state.user;
});
