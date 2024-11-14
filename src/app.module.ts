import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { DevConfigService } from './common/providers/DevConfigService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './songs/songs.entity';
import { Artist } from './artists/artists.entity';
import { User } from './users/users.entity';
import { Playlist } from './playlists/playlists.entity';
import { DataSource } from 'typeorm';
import { PlaylistsModule } from './playlists/playlists.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ArtistsModule } from './artists/artists.module';
import { dataSourceOptions, typeOrmAsyncConfig } from 'db/data-source';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from 'env.validation';

const devConfig = { port: 3000 }
const prodConfig = { port: 80 }

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        // ".env.dev", 
        // ".env.prod",
        `${process.cwd()}/.env.${process.env.NODE_ENV}`
      ],
      isGlobal: true,
      load: [configuration],
      validate: validate
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    SongsModule,
    PlaylistsModule,
    AuthModule,
    UsersModule,
    ArtistsModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: DevConfigService,
      useClass: DevConfigService
    },
    {
      provide: 'CONFIG',
      useFactory: () => {
        return process.env.NODE_ENV === 'development' ? devConfig : prodConfig;
      },
    }
  ],
})

export class AppModule {
  constructor() {}
}

/* export class AppModule implements NestModule{
  constructor(private dataSource: DataSource) {
    console.log('dbName ', dataSource.driver.database)
  }

  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes("songs");

    // consumer.apply(LoggerMiddleware).forRoutes({
    //   path:"songs",
    //   method:RequestMethod.POST,
    // });

    consumer.apply(LoggerMiddleware).forRoutes(SongsController);
  }
} */
