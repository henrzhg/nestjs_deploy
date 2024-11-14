import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-users.dto';
import * as bcrypt from 'bcryptjs'
import { LoginDTO } from 'src/auth/dto/login.dto';
import {v4 as uuid4} from 'uuid';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = new User();
        user.email = createUserDto.email;
        user.firstName = createUserDto.firstName;
        user.lastName = createUserDto.lastName;
        user.apiKey = uuid4();

        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(createUserDto.password, salt);
        const savedUser = await this.userRepository.save(user);
        delete savedUser.password;
        return user;
    }

    async findOne(data: LoginDTO): Promise<User> {
        const user = await this.userRepository.findOneBy({ email: data.email });
        if (!user) {
          throw new UnauthorizedException('Could not find user');
        }
        return user;
    }

    async findById(id: number): Promise<User> {
        return this.userRepository.findOneBy({ id });
    }

    async updateSecretKey(userId: number, secret: string): Promise<UpdateResult> {
        return this.userRepository.update(
            { id: userId },
            {
                twoFASecret: secret,
                enable2FA: true
            }
        );
    }

    async disable2FA(userId: number): Promise<UpdateResult> {
        return this.userRepository.update(
            { id: userId },
            {
                enable2FA: false,
                twoFASecret: null
            }
        );
    }

    async findByApiKey(apiKey: string): Promise<User> {
        return this.userRepository.findOneBy({ apiKey })
    }
}
