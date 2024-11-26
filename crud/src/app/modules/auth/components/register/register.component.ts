import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormControlState,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { SnackBarService } from '../../../../utils/snack-bar.service';
import { AuthService } from '../../services/auth.service';
import { ZipCodeService } from '../../services/zipCode.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgxMaskDirective,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  form: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    profession: new FormControl(null, [Validators.required]),
    birthDate: new FormControl(null, [Validators.required]),
    documentNumber: new FormControl(null, [
      Validators.minLength(11),
      Validators.maxLength(11),
      this.validateDocumentNumber,
    ]),
    phone: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    passwordConfirm: new FormControl(null, [Validators.required]),
    address: new FormGroup({
      zipCode: new FormControl(null, [Validators.required]),
      street: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      number: new FormControl(null, [Validators.required]),
      complement: new FormControl(null, [Validators.required]),
      neighborhood: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      city: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      state: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
    }),
  });

  constructor(
    private zipCodeService: ZipCodeService,
    private authService: AuthService,
    private destroyRef: DestroyRef,
    private router: Router,
    private snackBarService: SnackBarService
  ) {}

  onSubmit() {
    this.authService
      .register(this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        complete: () => {
          this.snackBarService.openSnackBar('Usuário cadastrado com sucesso!');
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.snackBarService.openSnackBar('Erro ao cadastrar usuário.');
          // console.error('Erro ao cadastrar usuário:', err);
        },
      });
  }

  private isValidZipCode(zipCode: string): boolean {
    return /^[0-9]{8}$/.test(zipCode);
  }

  fetchAddress(): void {
    const zipCode = this.form.get('address.zipCode')?.getRawValue();
    if (!this.isValidZipCode(zipCode)) {
      console.error('CEP inválido.');
      return;
    }
    this.zipCodeService
      .getAddressByZipCode(zipCode)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.handleAddressResponse(data);
        },
        error: (err) => console.error('Erro ao buscar o CEP:', err),
      });
  }

  private handleAddressResponse(data: any) {
    if (data.erro) {
      console.error('CEP não encontrado.');
    } else {
      this.form.patchValue({
        address: {
          street: data.logradouro,
          complement: data.complemento,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
        },
      });
    }
  }

  // Método que valida se um CPF fornecido é válido
  private validateDocumentNumber({
    value,
  }: FormControlState<string>): { [key: string]: boolean } | null {
    if (!value) return { requiredDocument: true };

    value = value.replace(/[^\d]+/g, '');
    if (value == '') return { emptyDocument: true };

    // Elimina CPFs invalidos conhecidos
    if (value.length != 11 || value === value[0].repeat(value.length)) {
      return { repeatCharacters: true };
    }

    // Valida 1o digito
    let add = 0;

    for (let i = 0; i < 9; i++) {
      add += parseInt(value.charAt(i)) * (10 - i);
    }

    let rev = 11 - (add % 11);

    if (rev == 10 || rev == 11) rev = 0;

    if (rev != parseInt(value.charAt(9))) return { invalidDocument: true };

    // Valida 2o digito
    add = 0;
    for (let i = 0; i < 10; i++) {
      add += parseInt(value.charAt(i)) * (11 - i);
    }

    rev = 11 - (add % 11);

    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(value.charAt(10))) return { invalidDocument: true };

    return null;
  }

  cancelForm() {
    this.form.reset();
    this.router.navigate(['/products']);
  }
}
