import { createLinearNumericIdGenerator, generateId } from './id';
import { AnyObject } from './types';

declare const process: { env: { NODE_ENV?: string } };

export const generateVMId = (context: AnyObject) => {
  if (!context.shortStaticId) {
    context.shortStaticId = generateId();
  }
  if (!context.generateNumericId) {
    context.generateNumericId = createLinearNumericIdGenerator(5);
  }

  if (!context.idGenerator) {
    context.idGenerator = () =>
      `${context.shortStaticId}_${context.generateNumericId()}`;
  }

  if (process.env.NODE_ENV === 'production') {
    return context.idGenerator();
  } else {
    return `${context.VM?.name}_${context.idGenerator()}`;
  }
};
