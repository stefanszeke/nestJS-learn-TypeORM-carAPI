import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';


interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}


export class SerializeInterceptor implements NestInterceptor {

  constructor(private dto: any) {}
  
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

    const request = context.switchToHttp().getRequest();
    console.log("request: " + request.url, request.method, request.body);


    // Run something before a request is handled by the request handler
    // console.log('I am running before the handler');

    return next.handle().pipe(
      map((data: any) => {
        // run something before the response is sent out
        // console.log('I am running before the response is sent out');

        return plainToInstance(this.dto, data, { 
          excludeExtraneousValues: true,
        })
      })
    );
  }
}

// plainToInstance is a function from class-transformer,
// it takes a class and an object and returns an instance of that class
// it is used to transform plain objects to class instances