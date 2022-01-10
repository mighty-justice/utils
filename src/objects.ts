import { flatten as flattenArray, isArray, isPlainObject, set } from 'lodash';


// Types sourced from
// https://flut1.medium.com/deep-flatten-typescript-types-with-finite-recursion-cb79233d93ca

type NonObjectKeysOf<T> = {
  [K in keyof T]: T[K] extends Array<any> ?
    K :
    T[K] extends object ? never : K
}[keyof T];

type ValuesOf<T> = T[keyof T];

type ObjectValuesOf<T> = Exclude<
  Extract<ValuesOf<T>, object>,
  Array<any>
>;

type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends ((k: infer I) => void)
  ? I
  : never;

type Flatten<T> = Pick<T, NonObjectKeysOf<T>> &
  UnionToIntersection<ObjectValuesOf<T>>;

function mergeObjects<A extends object, B extends object> (objectA: A, objectB: B): A & B {
  return { ...objectA, ...objectB };
}

function _flattenObject<T> (input: T, prev: string, currentDepth: number): Flatten<T> {
  return Object.entries(input).reduce((output: Flatten<T>, [key, value]) => {
    const newKey = isArray(input) ? (prev ? `${prev}[${key}]` : key) : (prev ? `${prev}.${key}` : key);

    if ((isArray(value) || isPlainObject(value)) && Object.keys(value).length) {
      const flatValues = _flattenObject(value, newKey, currentDepth + 1);
      return mergeObjects(output, flatValues);
    }

    return mergeObjects(output, { [newKey]: value });
  }, {});
}

// This is an alteration of flat's flattenObject function
// that includes has the ability to handle Moment objects.
function flattenObject<T extends object> (input: T): Flatten<T> {
  return _flattenObject(input, '', 1);
}

function unflattenObject (object: Object) {
  const flattenedObject = flattenObject(object);

  return Object.entries(flattenedObject).reduce((objOut, [key, value]) => set(objOut, key, value), {});
}

export {
  flattenArray,
  flattenObject,
  unflattenObject,
};
