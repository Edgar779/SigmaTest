import { Role } from '../constants';

/** Data type is used to describe the data that is used to sign JWT tokens for Signup/in */
export interface IToken {
  id: string;
  role: Role;
}
