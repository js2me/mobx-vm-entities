export const createCounter = () => {
  let counter = 0;
  return () => counter++;
};

export const internalCounter = createCounter();
