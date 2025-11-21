import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ACCESS_TOKEN, Role } from '../constants';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token: string = request.get(ACCESS_TOKEN);
    if (!token) {
      /** Check if the route is public */
      if (this.isPublic(context)) {
        return true;
      }
    }

    // 2️⃣ Decode token
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET_SIGNIN);
      request.user = user;
    } catch (err) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    // 3️⃣ Check roles
    const requiredRoles: Role[] = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );
    if (requiredRoles && !requiredRoles.includes(request.user.role)) {
      throw new HttpException(
        'You do not have permissions to access this resource',
        HttpStatus.FORBIDDEN,
      );
    }
    return true;
  }
  private isPublic(context: ExecutionContext): boolean {
    return this.reflector.get<boolean>('isPublic', context.getHandler());
  }
}
