export declare type Maybe<T> = T | null | undefined;
export declare type Diff = StringDiff | NumberDiff | BooleanDiff | ObjectDiff | ArrayDiff | TypeChangeDiff;
export declare type ValueType = 'array' | 'boolean' | 'null' | 'number' | 'object' | 'string' | 'undefined';
export declare type PathSegment = string | number | {
    _key: string;
};
export declare type Path = PathSegment[];
interface BaseDiff {
    type: 'array' | 'boolean' | 'null' | 'number' | 'object' | 'string' | 'typeChange';
    fromValue: unknown;
    toValue: unknown;
    path: Path;
    isChanged: boolean;
}
export interface StringDiffSegment {
    type: 'unchanged' | 'removed' | 'added';
    text: string;
}
export declare type StringDiff = BaseDiff & {
    type: 'string';
    fromValue: Maybe<string>;
    toValue: Maybe<string>;
    segments: StringDiffSegment[];
};
export declare type NumberDiff = BaseDiff & {
    type: 'number';
    fromValue: Maybe<number>;
    toValue: Maybe<number>;
};
export declare type BooleanDiff = BaseDiff & {
    type: 'boolean';
    fromValue: Maybe<boolean>;
    toValue: Maybe<boolean>;
};
export declare type ObjectDiff<T extends object = object> = BaseDiff & {
    type: 'object';
    fromValue: Maybe<T>;
    toValue: Maybe<T>;
    fields: {
        [fieldName: string]: Diff;
    };
};
export declare type ArrayDiff<T = unknown> = BaseDiff & {
    type: 'array';
    fromValue: Maybe<T[]>;
    toValue: Maybe<T[]>;
    items: Diff[];
};
export declare type TypeChangeDiff = BaseDiff & {
    type: 'typeChange';
    fromType: ValueType;
    toType: ValueType;
};
export interface KeyedSanityObject {
    [key: string]: unknown;
    _key: string;
}
export declare type SanityObject = KeyedSanityObject | Record<string, unknown>;
export {};
