import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';
import { User } from './users.entity';

@Controller('users')
export class UsersController {}
