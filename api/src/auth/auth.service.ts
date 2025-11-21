import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import {
  SignedInDTO,
  SigninDTO,
  CreateAuthDTO,
} from './dto';
import { SESSION_EXPIRATION, Role } from './constants';
import { AuthModel } from './auth.model';
import { IAuth, IToken } from './interface';
import { MongooseUtil } from '../util';

@Injectable()
export class AuthService {
  constructor() {
    this.mongooseUtil = new MongooseUtil();
    this.model = AuthModel;
  }
  //The Model
  private model: Model<IAuth>;
  mongooseUtil: MongooseUtil;
 /** Service API */

  /************************** Service API *************************/
  /** Signup a new user with the username and password */
  async create(dto: CreateAuthDTO): Promise<SignedInDTO> {
    try {
      let auth: IAuth = new this.model({
        email: dto.email,
        password: dto.password,
        role: dto.role,
        sessions: [],
      });
      const loggedInDTO = await this.login(auth);
      auth.sessions.push(loggedInDTO.token);
      auth = await auth.save();
      return loggedInDTO;
    } catch (err) {
      this.mongooseUtil.checkDuplicateKey(err, 'User with this email exists');
      throw err;
    }
  }

  /** only for testing */
  async createAdmin(
    id: string,
    password: string,
    role: Role,
  ): Promise<SignedInDTO> {
    try {
      let auth: IAuth = new this.model({
        _id: id,
        userId: id,
        password: password,
        role: role,
        sessions: [],
      });
      const loggedInDTO = await this.login(auth);
      auth.sessions.push(loggedInDTO.token);
      auth = await auth.save();
      return loggedInDTO;
    } catch (err) {
      this.mongooseUtil.checkDuplicateKey(err, 'User with this email exists');
      throw err;
    }
  }

  /** Singn in a new user with username and password */
  async signin(dto: SigninDTO): Promise<SignedInDTO> {
    const auth: IAuth = await this.model.findOne({ email: dto.email });
    this.checkAuth(auth);
    const isPasswordCorrect = await auth.comparePassword(dto.password);
    this.checkPassword(isPasswordCorrect);
    const loggedInDTO = await this.login(auth);
    auth.sessions.push(loggedInDTO.token);
    await auth.save();
    return loggedInDTO;
  }

  /** Checks for the tokens validity */
  async decodeToken(token: string) {
    if (!token) {
      throw new HttpException(
        'An access token must be set to access this resource',
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      // Verify token
      const decoded = (jwt.verify(
        token,
        process.env.JWT_SECRET_SIGNIN,
      )) as IToken;
      return decoded;
    } catch (err) {
      throw new HttpException(
        'Your session is expired, please login again',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  /*********************** Private Methods ***********************/
  /** generates the response for signed in users */
  private async login(auth: IAuth): Promise<SignedInDTO> {
    const token = await this.generateToken(
      auth,
      process.env.JWT_SECRET_SIGNIN,
      SESSION_EXPIRATION,
    );
    const signedIn: SignedInDTO = {
      token,
      role: auth.role,
    };
    return signedIn;
  }

  /** Generates a token using an IAuth object */
  private async generateToken(
    auth: IAuth,
    secret: string,
    expiration?: string,
  ): Promise<string> {
    const tokenEntity: IToken = {
      id: auth._id.toString(),
      role: auth.role,
    };
    return jwt.sign(tokenEntity, secret);
  }

  /** @throws error if the auth is undefined */
  private checkAuth(auth) {
    if (!auth) {
      throw new HttpException(
        'Such user does not exist in our records',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /** @throws error is the password is incorrect */
  private checkPassword(isCorrect) {
    if (!isCorrect) {
      throw new HttpException(
        'user password does not match',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
//End of Service
