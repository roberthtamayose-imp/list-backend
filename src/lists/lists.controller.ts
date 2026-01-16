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
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ShareListDto } from './dto/share-list.dto';
import { JoinListDto } from './dto/join-list.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('lists')
@UseGuards(JwtAuthGuard)
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  create(@Body() createListDto: CreateListDto, @Request() req: any) {
    return this.listsService.create(createListDto, req.user.id);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.listsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.listsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateListDto: UpdateListDto,
    @Request() req: any,
  ) {
    return this.listsService.update(id, updateListDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.listsService.remove(id, req.user.id);
  }

  // Share endpoints
  @Post(':id/share-code')
  generateShareCode(@Param('id') id: string, @Request() req: any) {
    return this.listsService.generateShareCode(id, req.user.id);
  }

  @Post('join')
  joinByCode(@Body() joinListDto: JoinListDto, @Request() req: any) {
    return this.listsService.joinByCode(joinListDto.code, req.user.id);
  }

  @Post(':id/share')
  shareWithUser(
    @Param('id') id: string,
    @Body() shareListDto: ShareListDto,
    @Request() req: any,
  ) {
    return this.listsService.shareWithUser(id, shareListDto, req.user.id);
  }

  @Delete(':id/share/:userId')
  removeShare(
    @Param('id') id: string,
    @Param('userId') targetUserId: string,
    @Request() req: any,
  ) {
    return this.listsService.removeShare(id, targetUserId, req.user.id);
  }

  @Patch(':id/share/:userId')
  updateSharePermission(
    @Param('id') id: string,
    @Param('userId') targetUserId: string,
    @Body('canEdit') canEdit: boolean,
    @Request() req: any,
  ) {
    return this.listsService.updateSharePermission(
      id,
      targetUserId,
      canEdit,
      req.user.id,
    );
  }
}

