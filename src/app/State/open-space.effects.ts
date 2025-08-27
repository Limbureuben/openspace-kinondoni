// import { Injectable } from '@angular/core';
// import { Actions, createEffect, ofType } from '@ngrx/effects';
// import { catchError, map, mergeMap } from 'rxjs/operators';
// import { of } from 'rxjs';
// import { OpenspaceService } from '../service/openspace.service';
// import * as OpenSpaceActions from './open-space.actions';

// @Injectable()
// export class OpenSpaceEffects {
//   constructor(private actions$: Actions, private openSpaceService: OpenspaceService) {
//     console.log('Actions:', this.actions$);
//     console.log('OpenspaceService:', this.openSpaceService);
//   }

//   loadOpenSpaces$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(OpenSpaceActions.loadOpenSpaces),
//       mergeMap(() =>
//         this.openSpaceService.getOpenSpaces().pipe(
//           map(openSpaces => OpenSpaceActions.loadOpenSpacesSuccess({ openSpaces })),
//           catchError(error => of(OpenSpaceActions.loadOpenSpacesFailure({ error: error.message })))
//         )
//       )
//     )
//   );
// }

// import { Injectable } from '@angular/core';
// import { Actions, createEffect, ofType } from '@ngrx/effects';
// import { catchError, map, mergeMap } from 'rxjs/operators';
// import { of } from 'rxjs';
// import { OpenspaceService } from '../service/openspace.service';
// import * as OpenSpaceActions from './open-space.actions';

// @Injectable()
// export class OpenSpaceEffects {
//   constructor(private actions$: Actions) {
//     console.log('Actions:', this.actions$);
//     console.log('OpenspaceService:');
//   }

//   loadOpenSpaces$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(OpenSpaceActions.loadOpenSpaces),
//       mergeMap(() =>
//         getOpenSpaces().pipe(
//           map(openSpaces => OpenSpaceActions.loadOpenSpacesSuccess({ openSpaces })),
//           catchError(error => of(OpenSpaceActions.loadOpenSpacesFailure({ error: error.message })))
//         )
//       )
//     )
//   );
// }

