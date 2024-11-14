import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './artists.entity';

@Injectable()
export class ArtistsService {
    constructor(
        @InjectRepository(Artist)
        private artistRepository: Repository<Artist>
    ) {}

    findArtist(userId: number): Promise<Artist> {
        return this.artistRepository.findOneBy({ user: { id: userId }})
    }
}
