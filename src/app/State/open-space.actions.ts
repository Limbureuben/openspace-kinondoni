import { createAction, props } from '@ngrx/store';
import { OpenSpace } from './open-space.model';

// Load Open Spaces
export const loadOpenSpaces = createAction('[OpenSpace] Load Open Spaces');

// Load Open Spaces Success
export const loadOpenSpacesSuccess = createAction(
  '[OpenSpace] Load Open Spaces Success',
  props<{ openSpaces: OpenSpace[] }>()
);

// Load Open Spaces Failure
export const loadOpenSpacesFailure = createAction(
  '[OpenSpace] Load Open Spaces Failure',
  props<{ error: string }>()
);
