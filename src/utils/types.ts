/* eslint-disable @typescript-eslint/no-explicit-any */

export type ValueOf<T> = T[keyof T];

export type ExtractEnumKeys<T> = ValueOf<{
  [key in keyof T]: key extends string ? key : never;
}>;

export type Maybe<T> = Nullable<T> | undefined;

export type Nullable<T> = T | null;

export type AnyObject = Record<string, any>;

export type EmptyObject = Record<string, never>;

export type AnyPrimitive = string | number | boolean | null | undefined;

export type AnyFunction = (...args: any) => any;

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type MaybeFalsy<T> = Maybe<T> | '' | false | 0;

export type Class<T, Args extends any[] = any[]> = new (...args: Args) => T;

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type AllPropertiesOptional<T> = keyof T extends never
  ? true
  : {
        [K in keyof T]-?: undefined extends T[K] ? never : K;
      } extends { [K in keyof T]: never }
    ? true
    : false;
