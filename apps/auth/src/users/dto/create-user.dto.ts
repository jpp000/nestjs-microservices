import {
  IsArray,
  IsEmail,
  IsOptional,
  IsStrongPassword,
  ValidateNested,
} from 'class-validator';
import { RoleDto } from './role.dto';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => RoleDto)
  roles?: RoleDto[];
}
