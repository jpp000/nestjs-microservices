import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@app/common';

const getUserByContext = (context: ExecutionContext): User => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => getUserByContext(context),
);
