import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    UseGuards,
    Request,
    Query,
} from '@nestjs/common';
import { RegisteredItemsService } from './registered-items.service';
import { CreateRegisteredItemDto } from './dto/create-registered-item.dto';
import { UpdateRegisteredItemDto } from './dto/update-registered-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('registered-items')
@UseGuards(JwtAuthGuard)
export class RegisteredItemsController {
    constructor(
        private readonly registeredItemsService: RegisteredItemsService,
    ) { }

    @Post()
    create(
        @Body() createRegisteredItemDto: CreateRegisteredItemDto,
        @Request() req: any,
    ) {
        return this.registeredItemsService.create(
            createRegisteredItemDto,
            req.user.id,
        );
    }

    @Get()
    findAll(
        @Request() req: any,
        @Query('search') search?: string,
        @Query('category') category?: string,
    ) {
        return this.registeredItemsService.findAll(req.user.id, search, category);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req: any) {
        return this.registeredItemsService.findOne(id, req.user.id);
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updateRegisteredItemDto: UpdateRegisteredItemDto,
        @Request() req: any,
    ) {
        return this.registeredItemsService.update(
            id,
            updateRegisteredItemDto,
            req.user.id,
        );
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req: any) {
        return this.registeredItemsService.remove(id, req.user.id);
    }
}
