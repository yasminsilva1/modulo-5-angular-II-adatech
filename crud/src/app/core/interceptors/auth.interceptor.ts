import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, filter, throwError } from 'rxjs';
import { selectUser } from '../store/auth.selector';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const store = inject(Store);

  if (req.url.includes('/auth')) {
    return next(req);
  }

  const token = sessionStorage.getItem('USER_TOKEN');

  const newReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
  return next(newReq).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        if (
          err.status === HttpStatusCode.Unauthorized ||
          err.status === HttpStatusCode.Forbidden
        ) {
          router.navigate(['/auth/login']);
        }
        if (err.status === HttpStatusCode.InternalServerError) {
          alert('Erro de servidor');
        }
        if (err.status === HttpStatusCode.NotFound) {
          alert('URL não encontrada');
        }
      }
      return throwError(() => err);
    })
  );

  // *  COM NGRX STORE
  // const user$ = store.select(selectUser);

  // user$.pipe(filter((user) => !!user)).subscribe((user) => {
  //   const newReq = req.clone({
  //     setHeaders: {
  //       Authorization: `Bearer ${user?.token}`,
  //     },
  //   });

  //   return next(newReq).pipe(
  //     catchError((err: unknown) => {
  //       if (err instanceof HttpErrorResponse) {
  //         if (
  //           err.status === HttpStatusCode.Unauthorized ||
  //           err.status === HttpStatusCode.Forbidden
  //         ) {
  //           router.navigate(['/auth/login']);
  //         }

  //         if (err.status === HttpStatusCode.InternalServerError) {
  //           alert('Erro de servidor');
  //         }

  //         if (err.status === HttpStatusCode.NotFound) {
  //           alert('URL não encontrada');
  //         }
  //       }

  //       return throwError(() => err);
  //     })
  //   );
  // });

  // return next(req);
};
