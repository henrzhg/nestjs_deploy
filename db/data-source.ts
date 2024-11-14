import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Artist } from "src/artists/artists.entity";
import { Playlist } from "src/playlists/playlists.entity";
import { Song } from "src/songs/songs.entity";
import { User } from "src/users/users.entity";
import { DataSource, DataSourceOptions } from "typeorm";

export const typeOrmAsyncConfig:TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
        return {
            type: 'postgres',
            database: configService.get<string>('dbName'),
            host: configService.get<string>('dbHost'),
            port: configService.get<number>('dbPort'),
            username: configService.get<string>('dbUsername'),
            password: configService.get<string>('dbPassword'),
            entities: ['dist/**/*.entity.js'],
            // entities: [Song, Artist, User, Playlist],
            synchronize: false,
            migrations: ['dist/db/migrations/*.js'],
        }
    },
}

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    entities: ['dist/**/*.entity.js'],
    synchronize: false,
    migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions)
export default dataSource;