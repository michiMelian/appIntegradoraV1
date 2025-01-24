import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { CreateTagDto } from 'src/modules/tag/dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const newTag = this.tagRepository.create(createTagDto);
    return await this.tagRepository.save(newTag);
  }

  async findAll(): Promise<Tag[]> {
    return await this.tagRepository.find();
  }

  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag)
      throw new NotFoundException(`Etiqueta con ID ${id} no encontrada`);
    return tag;
  }

  async updateTag(id: number, updateTag: UpdateTagDto) {
    try {
      const Tag = await this.tagRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!Tag) {
        throw new NotFoundException('Etiqueta no encontrada');
      }

      Object.assign(Tag, updateTag);

      await this.tagRepository.save(Tag);

      return {
        message: 'Etiqueta actualizada correctamente',
        data: Tag,
      };
    } catch (error) {
      console.error('Error en updateTask', error);
      throw new InternalServerErrorException('Error al actualizar la etiqueta');
    }
  }

  async removeTag(id: number): Promise<void> {
    const result = await this.tagRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(
        `Etiqueta con ID ${id} no encontrada al intentar eliminarla`,
      );
  }
}
