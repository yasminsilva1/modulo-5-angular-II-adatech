import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../../common/services/loading.service';

let totalRequest: number = 0;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  totalRequest++;
  loadingService.setLoading(true);

  return next(req).pipe(
    finalize(() => {
      totalRequest--;
      if (!totalRequest) {
        loadingService.setLoading(false);
      }
    })
  );
};
