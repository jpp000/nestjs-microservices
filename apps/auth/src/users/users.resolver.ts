import { CurrentUser, UserDocument } from '@app/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Resolver(() => UserDocument)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserDocument)
  createUser(@Args('createUserInput') createUserInput: CreateUserDto) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => UserDocument, { name: 'current' })
  getUser(@CurrentUser() user: UserDocument) {
    return user;
  }

  @Query(() => [UserDocument], { name: 'users' })
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
