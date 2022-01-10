import { flattenObject, unflattenObject } from '../src/objects';

const COMPLETELY_FLATTENED_OBJECTS: Array<[object, object]> = [
    [{ x: 'y' }, { x: 'y' }],
    [{ 'x[0]': 'y' }, { x: ['y'] }],
    [{ 'x[0]': 'y', 'x[1]': 'z' }, { x: ['y', 'z'] }],
    [{ 'x[0].a': 'b' }, { x: [{ a: 'b' }] }],
    [{ 'x.y[0]': 'z' }, { x: { y: ['z'] } }],
    [
      { 'a[0].b[0].c': 'x', 'a[0].b[1].c': 'y', 'a[1].d': 'z' },
      {
        a: [{ b: [{ c: 'x' }, { c: 'y' }] }, { d: 'z' }],
      },
    ],
  ],
  PARTIALLY_FLATTENED_OBJECTS: Array<[object, object]> = [
    [{ 'x[0]': { a: 'b' } }, { x: [{ a: 'b' }] }],
    [{ x: { 'y[0]': 'z' } }, { x: { y: ['z'] } }],
    [
      { 'a[0]': { 'b[0].c': 'x' }, 'a[0].b[1]': { c: 'y' }, 'a[1].d': 'z' },
      { a: [{ b: [{ c: 'x' }, { c: 'y' }] }, { d: 'z' }] },
    ],
  ];

describe('flattenObject', () => {
  it(`Correctly flattens objects`, () => {
    COMPLETELY_FLATTENED_OBJECTS.forEach(([flat, deep]) => {
      expect(flattenObject(deep)).toStrictEqual(flat);
    });
  });
});

describe('unflattenObject', () => {
  it(`Correctly unflattens objects`, () => {
    [...COMPLETELY_FLATTENED_OBJECTS, ...PARTIALLY_FLATTENED_OBJECTS].forEach(([flat, deep]) => {
      expect(unflattenObject(flat)).toStrictEqual(deep);
    });
  });
});
