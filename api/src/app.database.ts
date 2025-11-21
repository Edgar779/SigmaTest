import { Injectable } from '@nestjs/common';
import { connect, connection } from 'mongoose';
import { MONGO_CONN_STR } from './app.contstants';

@Injectable()
export class DatabaseConnection {
  async connect() {
    // Mongoose options
    const options: any = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    try {
      await connect(MONGO_CONN_STR, options);
      console.log('database connected');
    } catch (e) {
      console.log('error connecting to the db::: ', e);
    }
  }

  dropDatabase = async () => {
    await connection.dropDatabase();
  };
}