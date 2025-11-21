import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseConnection } from './app.database';
import { ConfigModule } from '@nestjs/config';
import { QuizModule } from './quizzes/quiz.module';
import { QuestionModule } from './questions/question.module';

@Module({
  imports: [
    AuthModule,
    QuizModule,
    QuestionModule,
    ConfigModule.forRoot({
      isGlobal: true, // allows env vars everywhere
    }),
  ],
  providers: [AppService, DatabaseConnection],
  controllers: [AppController],
})
export class AppModule {}
