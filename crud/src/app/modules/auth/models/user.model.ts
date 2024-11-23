export interface User {
  name: string;
  profession: string;
  birthDate: string;
  documentNumber: string;
  email: string;
  password: string;
  phone: string;
  address: Address;
}

export interface Address {
  zipCode: string;
  street: string;
  number: number;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}