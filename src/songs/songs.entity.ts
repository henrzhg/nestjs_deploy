import { Artist } from "src/artists/artists.entity";
import { Playlist } from "src/playlists/playlists.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('songs')
export class Song{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('date')
    releasedDate: Date;

    @Column('time')
    duration: Date;
    
    @Column('text')
    lyric: string;

    // @Column('varchar', {array:true})
    // artists: string[];

    @ManyToMany(() => Artist, (artist) => artist.songs, { cascade: true })
    @JoinTable({ name: 'songs_artists' })
    artists: Artist[];

    // /**
    //  * Many songs can belong to playlist for each unique user
    //  */
    @ManyToOne(() => Playlist, (playList) => playList.songs)
    playList: Playlist;
}