import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ListsModule } from './lists/lists.module';
import { ItemsModule } from './items/items.module';
import { RegisteredItemsModule } from './registered-items/registered-items.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ListsModule,
    ItemsModule,
    RegisteredItemsModule,
  ],
})
export class AppModule { }

