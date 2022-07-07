import {BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity('users')
export class UserEntity{
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void>{
        this.password = await bcrypt.hash(this.password, 10)
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    phone: string;

    @Column({unique: true})
    email: string;

    @Column({select: false})
    password: string;
}
