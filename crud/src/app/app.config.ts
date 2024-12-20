import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { userReducer } from './core/store/auth.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor])),
    provideEnvironmentNgxMask(),
    // provideStore(),
    importProvidersFrom(
      StoreModule.forRoot({
        user: userReducer,
      }),
      StoreDevtoolsModule.instrument({
        maxAge: 25,
      })
    ),
  ],
};
