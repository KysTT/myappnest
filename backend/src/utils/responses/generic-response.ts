import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

type GenericResponseMessages = Partial<{
  success: string;
  clientKnownRequestError: string;
}>;

export class GenericResponse<T> {
  public data: T | PrismaClientKnownRequestError;
  public message: string;
  #genericErrorMessage: string = 'Something Went Wrong';
  #genericSuccessMessage: string = 'Success';

  constructor(data: T, handlerMessages: GenericResponseMessages) {
    const { success, clientKnownRequestError } = handlerMessages;

    this.data = data;

    if (data instanceof PrismaClientKnownRequestError || data === null) {
      this.message = clientKnownRequestError ?? this.#genericErrorMessage;
    } else if (data satisfies T) {
      this.message = success ?? this.#genericSuccessMessage;
    }
  }
}
