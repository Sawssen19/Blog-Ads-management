import { Pipe, PipeTransform } from '@angular/core';
import { RoleEnum } from '../users/user-list/models/user';

@Pipe({
  name: 'role',
})
export class RolePipe implements PipeTransform {
  transform(value: RoleEnum): string {
    if (value == RoleEnum.Admin) return 'Admin';
    else return 'Utilisateur';
  }
}
