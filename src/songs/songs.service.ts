import { Injectable } from '@nestjs/common';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { Song } from './songs.entity';
import { CreateSongsDTO } from './dto/create-song-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSongDto } from './dto/update-song-dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Artist } from 'src/artists/artists.entity';

@Injectable()
export class SongsService {
    constructor(
        @InjectRepository(Song)
        private songRepository: Repository<Song>,
        @InjectRepository(Artist)
        private artistRepository: Repository<Artist>
    ) {}

    private songs = [];


    async create(songDTO: CreateSongsDTO) {
        const song = new Song()
        song.title = songDTO.title
        song.artists = songDTO.artists
        song.duration = songDTO.duration
        song.lyric = songDTO.lyrics
        song.releasedDate = songDTO.releasedDate

        const artists = await this.artistRepository.findBy({ id: In(songDTO.artists)})
        song.artists = artists

        return await this.songRepository.save(song)
    }


    findAll(): Promise<Song[]> {
        return this.songRepository.find()
    }

    findOne(id: number): Promise<Song> {
        return this.songRepository.findOneBy({ id })
    }


    remove(id : number) : Promise<DeleteResult> {
        return this.songRepository.delete(id)
    }

    update(id: number, updateSongDto: UpdateSongDto): Promise<UpdateResult> {
        return this.songRepository.update(id, updateSongDto)
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
        // return paginate<Song>(this.songRepository, options)

        const queryBuilder = this.songRepository.createQueryBuilder('c');
        queryBuilder.orderBy('c.releasedDate', 'DESC');

        return paginate<Song>(queryBuilder, options)
    }
}
