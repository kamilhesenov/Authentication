import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./jwt-strategy";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        PassportModule.register({defaultStrategy: 'jwt'}),
        JwtModule.register({
            secret: 'topSecret51',
            signOptions: {expiresIn: 600}
        }),
    ],
    controllers: [UserController],
    providers: [UserService, JwtStrategy],
    exports: [JwtStrategy, PassportModule]
})
export class UserModule {
}
