import { Injectable } from '@nestjs/common';
import { DatabaseConnection } from './app.database';

@Injectable()
export class AppService {
  constructor(private readonly databaseConnection: DatabaseConnection) {
    this.databaseConnection.connect();
  }

  async dropDatabase() {
    await this.databaseConnection.dropDatabase();
  }
}