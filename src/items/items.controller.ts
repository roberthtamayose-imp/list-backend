import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('lists/:listId/items')
@UseGuards(JwtAuthGuard)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(
    @Param('listId') listId: string,
    @Body() createItemDto: CreateItemDto,
    @Request() req: any,
  ) {
    return this.itemsService.create(listId, createItemDto, req.user.id);
  }

  @Get()
  findAll(@Param('listId') listId: string, @Request() req: any) {
    return this.itemsService.findAll(listId, req.user.id);
  }

  @Get(':id')
  findOne(
    @Param('listId') listId: string,
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.itemsService.findOne(listId, id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('listId') listId: string,
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
    @Request() req: any,
  ) {
    return this.itemsService.update(listId, id, updateItemDto, req.user.id);
  }

  @Patch(':id/toggle')
  toggle(
    @Param('listId') listId: string,
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.itemsService.toggle(listId, id, req.user.id);
  }

  @Delete(':id')
  remove(
    @Param('listId') listId: string,
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.itemsService.remove(listId, id, req.user.id);
  }

  @Delete()
  clearCompleted(@Param('listId') listId: string, @Request() req: any) {
    return this.itemsService.clearCompleted(listId, req.user.id);
  }
}

