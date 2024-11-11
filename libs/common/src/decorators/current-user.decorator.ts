import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '@app/common';

const getUserByContext = (context: ExecutionContext): UserDocument => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => getUserByContext(context),
);
