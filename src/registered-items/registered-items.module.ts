import { Module } from '@nestjs/common';
import { RegisteredItemsService } from './registered-items.service';
import { RegisteredItemsController } from './registered-items.controller';

@Module({
    controllers: [RegisteredItemsController],
    providers: [RegisteredItemsService],
    exports: [RegisteredItemsService],
})
export class RegisteredItemsModule { }
