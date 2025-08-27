import { createReducer, on } from '@ngrx/store';
import * as OpenSpaceActions from './open-space.actions';
import { OpenSpace } from './open-space.model';

export interface OpenSpaceState {
  openSpaces: OpenSpace[];
  error: string | null;
  loading: boolean;
}

const initialState: OpenSpaceState = {
  openSpaces: [],
  error: null,
  loading: false,
};

export const openSpaceReducer = createReducer(
  initialState,
  on(OpenSpaceActions.loadOpenSpaces, (state) => ({
    ...state,
    loading: true
  })),
  on(OpenSpaceActions.loadOpenSpacesSuccess, (state, { openSpaces }) => ({
    ...state,
    loading: false,
    openSpaces,
    error: null
  })),
  on(OpenSpaceActions.loadOpenSpacesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
