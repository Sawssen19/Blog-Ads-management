export interface User {
  id: string;
  description: string;
  role: RoleEnum;
}

export enum RoleEnum {
  Utilisateur = 'Utilisateur',
  Admin = 'Admin',
}
