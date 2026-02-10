import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ListsService } from '../lists/lists.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    private prisma: PrismaService,
    private listsService: ListsService,
  ) { }

  private async checkEditPermission(listId: string, userId: string) {
    const list = await this.listsService.findOne(listId, userId);

    const canEdit =
      list.ownerId === userId ||
      list.sharedWith.some(
        (share: { userId: string; canEdit: boolean }) => share.userId === userId && share.canEdit,
      );

    if (!canEdit) {
      throw new ForbiddenException('Você não tem permissão para editar itens desta lista');
    }

    return list;
  }

  async create(listId: string, createItemDto: CreateItemDto, userId: string) {
    await this.checkEditPermission(listId, userId);

    let itemData: any = { ...createItemDto, listId };

    // If registeredItemId is provided, use registered item defaults
    if (createItemDto.registeredItemId) {
      const registeredItem = await this.prisma.registeredItem.findUnique({
        where: { id: createItemDto.registeredItemId },
      });

      if (registeredItem) {
        const { registeredItemId, ...dtoFields } = createItemDto;
        // Remove undefined fields so they don't override defaults
        const overrides: any = {};
        if (dtoFields.name !== undefined) overrides.name = dtoFields.name;
        if (dtoFields.quantity !== undefined) overrides.quantity = dtoFields.quantity;
        if (dtoFields.unit !== undefined) overrides.unit = dtoFields.unit;
        if (dtoFields.category !== undefined) overrides.category = dtoFields.category;
        if (dtoFields.completed !== undefined) overrides.completed = dtoFields.completed;

        itemData = {
          name: registeredItem.name,
          quantity: registeredItem.defaultQuantity,
          unit: registeredItem.defaultUnit,
          category: registeredItem.category,
          ...overrides,
          registeredItemId,
          listId,
        };
      }
    }

    const item = await this.prisma.shoppingItem.create({
      data: itemData,
    });

    // Update list timestamp
    await this.prisma.shoppingList.update({
      where: { id: listId },
      data: { updatedAt: new Date() },
    });

    return item;
  }

  async findAll(listId: string, userId: string) {
    await this.listsService.findOne(listId, userId);

    return this.prisma.shoppingItem.findMany({
      where: { listId },
      orderBy: [
        { completed: 'asc' },
        { category: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findOne(listId: string, itemId: string, userId: string) {
    await this.listsService.findOne(listId, userId);

    const item = await this.prisma.shoppingItem.findFirst({
      where: {
        id: itemId,
        listId,
      },
    });

    if (!item) {
      throw new NotFoundException('Item não encontrado');
    }

    return item;
  }

  async update(
    listId: string,
    itemId: string,
    updateItemDto: UpdateItemDto,
    userId: string,
  ) {
    await this.checkEditPermission(listId, userId);
    await this.findOne(listId, itemId, userId);

    const item = await this.prisma.shoppingItem.update({
      where: { id: itemId },
      data: updateItemDto,
    });

    // Update list timestamp
    await this.prisma.shoppingList.update({
      where: { id: listId },
      data: { updatedAt: new Date() },
    });

    return item;
  }

  async toggle(listId: string, itemId: string, userId: string) {
    await this.checkEditPermission(listId, userId);
    const item = await this.findOne(listId, itemId, userId);

    const updatedItem = await this.prisma.shoppingItem.update({
      where: { id: itemId },
      data: { completed: !item.completed },
    });

    // Update list timestamp
    await this.prisma.shoppingList.update({
      where: { id: listId },
      data: { updatedAt: new Date() },
    });

    return updatedItem;
  }

  async remove(listId: string, itemId: string, userId: string) {
    await this.checkEditPermission(listId, userId);
    await this.findOne(listId, itemId, userId);

    await this.prisma.shoppingItem.delete({
      where: { id: itemId },
    });

    // Update list timestamp
    await this.prisma.shoppingList.update({
      where: { id: listId },
      data: { updatedAt: new Date() },
    });

    return { message: 'Item removido com sucesso' };
  }

  async clearCompleted(listId: string, userId: string) {
    await this.checkEditPermission(listId, userId);

    const result = await this.prisma.shoppingItem.deleteMany({
      where: {
        listId,
        completed: true,
      },
    });

    // Update list timestamp
    await this.prisma.shoppingList.update({
      where: { id: listId },
      data: { updatedAt: new Date() },
    });

    return { message: `${result.count} itens removidos` };
  }
}

