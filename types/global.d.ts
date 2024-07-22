declare global {
  declare const process: {
    env: { NODE_ENV?: string };
  };
}

export {};
