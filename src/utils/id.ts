export const generateId = () =>
  Math.random().toString() + Date.now().toString();

export const createLinearNumericIdGenerator = (size: number = 9) => {
  let lastCount = 0;
  return () => {
    return (lastCount++).toString().padStart(size, '0');
  };
};
