import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserRoles } from '../constantes/user-roles.enum';
import { selectUser } from '../store/auth.selector';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  isLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(private store: Store) {}

  checkAuthStatus(): Observable<boolean> {
    const user$ = this.store.select(selectUser);

    return user$.subscribe((user) => {
      this.isLoggedIn$.next(!!user);
      return this.isLoggedIn$;
    });
  }

  checkUserRoles(): Observable<UserRoles> {
    const role =
      (sessionStorage.getItem('USER_ROLE') as UserRoles) ?? UserRoles.USER;
    return new Observable<UserRoles>((observer) => observer.next(role));
  }
}
