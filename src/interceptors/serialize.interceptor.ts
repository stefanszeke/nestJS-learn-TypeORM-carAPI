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

    // Run something before a request is handled by the request handler
    // console.log('I am running before the handler');
    const request = context.switchToHttp().getRequest();    

    return next.handle().pipe( // runs after the request goes to the controller. and before the response is sent out
      map((data: any) => {
        // console.log("data: " + JSON.stringify(data));
        // console.log("dto: " + this.dto);

        // run something before the response is sent out
        // console.log('I am running before the response is sent out');

        const serializedData = plainToInstance(this.dto, data, { excludeExtraneousValues: true });

        return serializedData;
      })
    );
  }
}

// context is an object that contains information about the request
// next is a function that we call to pass the request to the next interceptor

// plainToInstance is a function from class-transformer,
// it takes a class and an object and returns an instance of that class
// it is used to transform plain objects to class instances