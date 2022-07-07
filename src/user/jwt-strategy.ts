import {PassportStrategy} from '@nestjs/passport';
import {Strategy, ExtractJwt} from 'passport-jwt';
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {IJwtPayload} from "./jwt-payload.interface";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import {Repository} from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'topSecret51'
        });
    }

    async validate(payload: IJwtPayload): Promise<UserEntity>{
        const user = await this.userRepository.findOne({where: {email: payload.email}});
        if(!user) throw new UnauthorizedException();
        return user;
    }
}
