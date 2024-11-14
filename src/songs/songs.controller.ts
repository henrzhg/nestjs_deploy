import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Inject, Param, ParseIntPipe, Post, Put, Query, Req, Request, UseGuards } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongsDTO } from './dto/create-song-dto';
import { Connection } from 'src/common/contants/connection';
import { Song } from './songs.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateSongDto } from './dto/update-song-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ArtistJwtGuard } from 'src/auth/artist-jwt-guard';

@Controller({
    path: "songs"
})
export class SongsController {

    constructor(
        private songsService: SongsService,
        @Inject('CONNECTION')
        private connection:Connection
    ) {
        console.log(`This is a connection string ${this.connection.CONNECTION_STRING}`)
    }

    @Get()
    findAll(): Promise<Song[]> {
        try {
            return this.songsService.findAll();
        } catch (error) {
            throw new HttpException(
                "server error", 
                HttpStatus.INTERNAL_SERVER_ERROR,
                {
                    cause:error
                }
            )
        }
    }

    @Get('pagination')
    pagination(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe)
        page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
        limit: number = 10
    ): Promise<Pagination<Song>> {
        limit = limit > 100 ? 100 : limit;
        try {
            return this.songsService.paginate({
                page,
                limit
            });
        } catch (error) {
            throw new HttpException(
                "server error", 
                HttpStatus.INTERNAL_SERVER_ERROR,
                {
                    cause:error
                }
            )
        }
    }

    @Get(':id')
    findOne(@Param('id', new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) id: number): Promise<Song> {
        return this.songsService.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateSongDto: UpdateSongDto
    ) : Promise<UpdateResult>{
        return this.songsService.update(id, updateSongDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
        return this.songsService.remove(id);
    }

    @Post()
    @UseGuards(ArtistJwtGuard)
    create(
        @Body() createSongDto: CreateSongsDTO,
        @Request() request
    ): Promise<Song> {
        return this.songsService.create(createSongDto);
    }
}
