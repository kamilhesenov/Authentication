import {Body, Controller, HttpCode, Post, Req, UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {CreateUserDto} from "./dto/create-user.dto";
import {UserCredentialDto} from "./dto/user-credential.dto";
import {AuthGuard} from "@nestjs/passport";

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  register(@Body() createUserDto: CreateUserDto){
    return this.userService.register(createUserDto);
  }

  @Post('/login')
  @HttpCode(200)
  login(@Body() userCredentialDto: UserCredentialDto): Promise<{accessToken: string}>{
    return this.userService.login(userCredentialDto);
  }
}
