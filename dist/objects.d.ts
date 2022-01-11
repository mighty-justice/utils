import { flatten as flattenArray } from 'lodash';
declare type NonObjectKeysOf<T> = {
    [K in keyof T]: T[K] extends Array<any> ? K : T[K] extends object ? never : K;
}[keyof T];
declare type ValuesOf<T> = T[keyof T];
declare type ObjectValuesOf<T> = Exclude<Extract<ValuesOf<T>, object>, Array<any>>;
declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
declare type Flatten<T> = Pick<T, NonObjectKeysOf<T>> & UnionToIntersection<ObjectValuesOf<T>>;
declare function flattenObject<T extends object>(input: T): Flatten<T>;
declare function unflattenObject(object: Object): {};
export { flattenArray, flattenObject, unflattenObject };
