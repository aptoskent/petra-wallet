// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

/**
 * This type iterates over all nested keys of an object and returns all leafs
 * as period seperated strings.
 *
 * Referenced from here with modifications:
 * https://dev.to/pffigueiredo/typescript-utility-keyof-nested-object-2pa3
 *
 * ```ts
 * const person = { name: { first: '', last: ''}, age: 0 }
 * type PersonKeys = NestedKeyOf<typeof person>
 * // "age" | "name.first" | "name.last"
 * ```
 */
export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

// Used specically for i18n
export type NestedKeyOfI18N<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}:${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];
