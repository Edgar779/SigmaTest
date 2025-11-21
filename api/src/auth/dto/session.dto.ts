import { Role } from '..';

export class SessionDTO {
  id: string;
  userId: string;
  email: string;
  role: Role;
  token: string;
}
