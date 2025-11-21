import { Document } from 'mongoose';
import { Role } from '../constants';

/** Data type is used to descibe the data model of the Auth collection */
export interface IAuth extends Document {
  email: string;
  password?: string;
  sessions: string[];
  role: Role;
  /**Mathods */
  comparePassword?: any;
}
