import { PartialType } from '@nestjs/mapped-types';
import { CreateRegisteredItemDto } from './create-registered-item.dto';

export class UpdateRegisteredItemDto extends PartialType(CreateRegisteredItemDto) { }
