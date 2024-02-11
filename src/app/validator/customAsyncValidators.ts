import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { APIService } from '../API.service';


@Injectable({ providedIn: 'root' })
export class CustomAsyncValidators {
  constructor() { }

  createValidator(api: APIService): AsyncValidatorFn {
    return (control: AbstractControl): Promise<any> => {
      return api
        .ListUserByEmail(control.value)
        .then(data => {
          const items = data.items
          if (items.length > 0) {
            return { emailExists: true };
          } else {
            return null
          }
        }).catch((err) => {
          console.log(err);
          return { serverError: true };
        });
    };
  }

  phoneIdValidator(api: APIService): AsyncValidatorFn {
    return (control: AbstractControl): Promise<any> => {
      console.log(control.value.replace("+",""))
      return api
        .GetCollaboratorData(control.value.replace("+",""))
        .then(data => {
          if (data?.id  == control.value.replace("+","")) {
            return { phoneExist: true };
          } else {
            return null
          }
        }).catch((err) => {
          console.log(err);
          return { serverError: true };
        });
    };
  }
}