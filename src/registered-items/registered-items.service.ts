import {
    Injectable,
    ConflictException,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegisteredItemDto } from './dto/create-registered-item.dto';
import { UpdateRegisteredItemDto } from './dto/update-registered-item.dto';

@Injectable()
export class RegisteredItemsService {
    constructor(private prisma: PrismaService) { }

    async create(createDto: CreateRegisteredItemDto, userId: string) {
        const existing = await this.prisma.registeredItem.findUnique({
            where: {
                userId_name: { userId, name: createDto.name },
            },
        });

        if (existing) {
            throw new ConflictException('Você já possui um item registrado com este nome');
        }

        return this.prisma.registeredItem.create({
            data: {
                ...createDto,
                userId,
            },
        });
    }

    async findAll(userId: string, search?: string, category?: string) {
        const where: any = { userId };

        if (search) {
            where.name = {
                contains: search,
                mode: 'insensitive',
            };
        }

        if (category) {
            where.category = category;
        }

        return this.prisma.registeredItem.findMany({
            where,
            orderBy: [{ category: 'asc' }, { name: 'asc' }],
        });
    }

    async findOne(id: string, userId: string) {
        const item = await this.prisma.registeredItem.findUnique({
            where: { id },
        });

        if (!item) {
            throw new NotFoundException('Item registrado não encontrado');
        }

        if (item.userId !== userId) {
            throw new ForbiddenException('Você não tem acesso a este item registrado');
        }

        return item;
    }

    async update(id: string, updateDto: UpdateRegisteredItemDto, userId: string) {
        const item = await this.findOne(id, userId);

        // Check for duplicate name if name is being changed
        if (updateDto.name && updateDto.name !== item.name) {
            const existing = await this.prisma.registeredItem.findUnique({
                where: {
                    userId_name: { userId, name: updateDto.name },
                },
            });

            if (existing) {
                throw new ConflictException('Você já possui um item registrado com este nome');
            }
        }

        return this.prisma.registeredItem.update({
            where: { id },
            data: updateDto,
        });
    }

    async remove(id: string, userId: string) {
        await this.findOne(id, userId);

        await this.prisma.registeredItem.delete({
            where: { id },
        });

        return { message: 'Item registrado removido com sucesso' };
    }
}
