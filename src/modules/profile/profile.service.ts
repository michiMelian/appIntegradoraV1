import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from 'src/modules/profile/entities/profile.entity';
import { CreateProfileDto } from 'src/modules/profile/dto/create-profile.dto';
import { User } from 'src/modules/users/entities/user.entities';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createProfile(createProfileDto: CreateProfileDto): Promise<Profile> {
    const user = await this.userRepository.findOne({
      where: { id: createProfileDto.user },
    });
    if (!user)
      throw new NotFoundException(
        `El perfil de usuario con ID ${createProfileDto.user} no existe`,
      );

    const newProfile = this.profileRepository.create({
      ...createProfileDto,
      user,
    });

    return await this.profileRepository.save(newProfile);
  }

  async findOneByUserId(userId: number): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!profile)
      throw new NotFoundException(
        `El perfil de usuario con ID ${userId} no existe`,
      );
    return profile;
  }
}
