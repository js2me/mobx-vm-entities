/* eslint-disable @typescript-eslint/no-explicit-any */
type ValueOf<T> = T[keyof T];

type ExtractEnumKeys<T> = ValueOf<{
  [key in keyof T]: key extends string ? key : never;
}>;

type Maybe<T> = Nullable<T> | undefined;

type Nullable<T> = T | null;

type AnyObject = Record<string, any>;

type EmptyObject = Record<string, never>;

type AnyPrimitive = string | number | boolean | null | undefined;

type AnyFunction = (...args: any) => any;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

type MaybeFalsy<T> = Maybe<T> | '' | false | 0;

type Class<T, Args extends any[] = any[]> = new (...args: Args) => T;

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type AllPropertiesOptional<T> = keyof T extends never
  ? true
  : {
        [K in keyof T]-?: undefined extends T[K] ? never : K;
      } extends { [K in keyof T]: never }
    ? true
    : false;
