import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Playlist } from "src/playlists/playlists.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "Jane",
    description: "provide firstName of a user",
  })
  @Column()
  firstName: string;

  @ApiProperty({
    example: "Doe",
    description: "provide lastName of a user",
  })
  @Column()
  lastName: string;


  @ApiProperty({
    example: "jane_doe@gmail.com",
    description: "provide the email of a user",
  })
  @Column({unique: true})
  email: string;


  @ApiProperty({
    example: "test1234",
    description: "provide the password of a user",
  })
  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true, type: 'text'})
  twoFASecret: string

  @Column({ default: false, type: 'boolean'})
  enable2FA: boolean

  @Column()
  apiKey: string

  /**
   * A user can create many playLists
   */
  @OneToMany(() => Playlist, (playList) => playList.user)
  playLists: Playlist[];
}