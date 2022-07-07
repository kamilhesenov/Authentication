import {ConflictException, Injectable, NotFoundException, Req, Res, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import {Repository} from "typeorm";
import {CreateUserDto} from "./dto/create-user.dto";
import {UserCredentialDto} from "./dto/user-credential.dto";
import * as bcrypt from 'bcrypt';
import {IJwtPayload} from "./jwt-payload.interface";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService
    ) {}

    async register(createUserDto: CreateUserDto){
        const userEmail = await this.userRepository.findOne({where: {email: createUserDto.email}});
        if(userEmail) throw new ConflictException(`User with ${createUserDto.email} email already exist`);

        const user = new UserEntity();
        user.username = createUserDto.username;
        user.phone = createUserDto.phone;
        user.email = createUserDto.email;
        user.password = createUserDto.password;
        const result = await this.userRepository.save(user);
        const {password, ...userResponse} = result;
        return userResponse;
    }
    async validateUserPassword(userCredentialDto: UserCredentialDto): Promise<UserEntity>{
        const {email, password} = userCredentialDto;
        const user = await this.userRepository.findOne({where: {email: userCredentialDto.email}, select: ['id','email', 'password']});
        if(!user) throw new NotFoundException(`User with ${email} email Not Found`);

        const isValidPassword = await bcrypt.compare(password, user.password);
        if(isValidPassword){
            return user;
        }
        else{
            throw new UnauthorizedException('Incorrect password');
        }
    }

    async login(userCredentialDto: UserCredentialDto): Promise<{accessToken: string}>{
     const user = await this.validateUserPassword(userCredentialDto);
     const payload: IJwtPayload = {id: user.id, email: user.email};
     const accessToken = await this.jwtService.sign(payload);
     return {accessToken};
    }
}
