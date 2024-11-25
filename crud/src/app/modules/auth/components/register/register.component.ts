import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../../utils/snack-bar.service';
import { RegisterService } from '../../services/register.service';
import { ZipCodeService } from '../../services/zipCode.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  form: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    profession: new FormControl(null, [Validators.required]),
    birthDate: new FormControl(null, [Validators.required]),
    documentNumber: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    address: new FormGroup({
      zipCode: new FormControl(null, [Validators.required]),
      street: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      number: new FormControl(null, [Validators.required]),
      complement: new FormControl(null),
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
    private registerService: RegisterService,
    private destroyRef: DestroyRef,
    private router: Router,
    private snackBarService: SnackBarService
  ) {}

  onSubmit() {
    this.registerService
      .addUser(this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        complete: () => {
          this.snackBarService.openSnackBar('Usuário cadastrado com sucesso!');
          this.router.navigate(['/products']);
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

  cancelForm() {
    this.form.reset();
    this.router.navigate(['/products']);
  }
}
