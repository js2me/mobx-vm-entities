import { internalCounter, createCounter } from './id';
import { AnyObject } from './types';

declare const process: { env: { NODE_ENV?: string } };

export const generateVMId = (context: AnyObject) => {
  if (!context.generateId) {
    const staticId = internalCounter().toString(16);
    const counter = createCounter();

    context.generateId = () =>
      `${staticId}_${counter().toString().padStart(5, '0')}`;
  }

  if (process.env.NODE_ENV === 'production') {
    return context.generateId();
  } else {
    return `${context.VM?.name}_${context.generateId()}`;
  }
};
