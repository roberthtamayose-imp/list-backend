import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ShareListDto } from './dto/share-list.dto';

@Injectable()
export class ListsService {
  constructor(private prisma: PrismaService) {}

  async create(createListDto: CreateListDto, userId: string) {
    return this.prisma.shoppingList.create({
      data: {
        name: createListDto.name,
        description: createListDto.description,
        ownerId: userId,
      },
      include: {
        owner: {
          select: { id: true, email: true, name: true },
        },
        items: true,
        sharedWith: {
          include: {
            user: { select: { id: true, email: true, name: true } },
          },
        },
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.shoppingList.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { sharedWith: { some: { userId: userId } } },
        ],
      },
      include: {
        owner: {
          select: { id: true, email: true, name: true },
        },
        items: {
          orderBy: { createdAt: 'desc' },
        },
        sharedWith: {
          include: {
            user: { select: { id: true, email: true, name: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const list = await this.prisma.shoppingList.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, email: true, name: true },
        },
        items: {
          orderBy: { createdAt: 'desc' },
        },
        sharedWith: {
          include: {
            user: { select: { id: true, email: true, name: true } },
          },
        },
      },
    });

    if (!list) {
      throw new NotFoundException('Lista não encontrada');
    }

    // Check if user has access
    const hasAccess =
      list.ownerId === userId ||
      list.sharedWith.some((share: { userId: string }) => share.userId === userId);

    if (!hasAccess) {
      throw new ForbiddenException('Você não tem acesso a esta lista');
    }

    return list;
  }

  async update(id: string, updateListDto: UpdateListDto, userId: string) {
    const list = await this.findOne(id, userId);

    // Check if user can edit
    const canEdit =
      list.ownerId === userId ||
      list.sharedWith.some(
        (share: { userId: string; canEdit: boolean }) => share.userId === userId && share.canEdit,
      );

    if (!canEdit) {
      throw new ForbiddenException('Você não tem permissão para editar esta lista');
    }

    return this.prisma.shoppingList.update({
      where: { id },
      data: updateListDto,
      include: {
        owner: {
          select: { id: true, email: true, name: true },
        },
        items: true,
        sharedWith: {
          include: {
            user: { select: { id: true, email: true, name: true } },
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const list = await this.findOne(id, userId);

    if (list.ownerId !== userId) {
      throw new ForbiddenException('Apenas o dono pode excluir a lista');
    }

    return this.prisma.shoppingList.delete({
      where: { id },
    });
  }

  // Share functionality
  async generateShareCode(id: string, userId: string) {
    const list = await this.findOne(id, userId);

    if (list.ownerId !== userId) {
      throw new ForbiddenException('Apenas o dono pode gerar código de compartilhamento');
    }

    const shareCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    return this.prisma.shoppingList.update({
      where: { id },
      data: { shareCode },
      select: { id: true, shareCode: true },
    });
  }

  async joinByCode(code: string, userId: string) {
    const list = await this.prisma.shoppingList.findUnique({
      where: { shareCode: code },
      include: {
        sharedWith: true,
      },
    });

    if (!list) {
      throw new NotFoundException('Código de compartilhamento inválido');
    }

    if (list.ownerId === userId) {
      throw new BadRequestException('Você é o dono desta lista');
    }

    const alreadyShared = list.sharedWith.some(
      (share: { userId: string }) => share.userId === userId,
    );

    if (alreadyShared) {
      throw new BadRequestException('Você já tem acesso a esta lista');
    }

    await this.prisma.listShare.create({
      data: {
        userId,
        listId: list.id,
        canEdit: true,
      },
    });

    return this.findOne(list.id, userId);
  }

  async shareWithUser(id: string, shareListDto: ShareListDto, userId: string) {
    const list = await this.findOne(id, userId);

    if (list.ownerId !== userId) {
      throw new ForbiddenException('Apenas o dono pode compartilhar a lista');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { email: shareListDto.email },
    });

    if (!targetUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (targetUser.id === userId) {
      throw new BadRequestException('Você não pode compartilhar consigo mesmo');
    }

    const alreadyShared = list.sharedWith.some(
      (share: { userId: string }) => share.userId === targetUser.id,
    );

    if (alreadyShared) {
      throw new BadRequestException('Esta lista já foi compartilhada com este usuário');
    }

    await this.prisma.listShare.create({
      data: {
        userId: targetUser.id,
        listId: id,
        canEdit: shareListDto.canEdit ?? true,
      },
    });

    return this.findOne(id, userId);
  }

  async removeShare(id: string, targetUserId: string, userId: string) {
    const list = await this.findOne(id, userId);

    if (list.ownerId !== userId && targetUserId !== userId) {
      throw new ForbiddenException('Você não tem permissão para remover este compartilhamento');
    }

    await this.prisma.listShare.deleteMany({
      where: {
        listId: id,
        userId: targetUserId,
      },
    });

    return this.findOne(id, userId);
  }

  async updateSharePermission(
    id: string,
    targetUserId: string,
    canEdit: boolean,
    userId: string,
  ) {
    const list = await this.findOne(id, userId);

    if (list.ownerId !== userId) {
      throw new ForbiddenException('Apenas o dono pode alterar permissões');
    }

    await this.prisma.listShare.updateMany({
      where: {
        listId: id,
        userId: targetUserId,
      },
      data: { canEdit },
    });

    return this.findOne(id, userId);
  }
}

