export const generateId = (() => {
  let counter = 0;
  return () => (counter++).toString(16);
})();

export const createLinearNumericIdGenerator = (size: number = 9) => {
  let lastCount = 0;
  return () => {
    return (lastCount++).toString().padStart(size, '0');
  };
};
