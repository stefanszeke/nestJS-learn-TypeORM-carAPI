import { createParamDecorator, ExecutionContext, Next } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.currentUser;
  }
)

// context is the request object