import { validate } from "class-validator";

export async function validateOne<T extends object>(obj: T): Promise<void> {
  const errors = await validate(obj);

  if (errors.length > 0) {
    throw new Error(errors[0].toString());
  }
}

export async function validateMany<T extends object>(objs: T[]): Promise<void> {
  const validations = await Promise.all(objs.map((obj) => validate(obj)));
  const firstError = validations.find((errors) => errors.length > 0);

  if (firstError) {
    throw new Error(firstError[0].toString());
  }
}
