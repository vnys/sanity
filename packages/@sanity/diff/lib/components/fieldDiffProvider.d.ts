import * as React from 'react';
import { ObjectField } from './types';
interface FieldDiffContextValue {
    field: ObjectField;
    title: string;
}
declare type Props = {
    children: React.ReactNode;
    field: ObjectField;
};
export declare function FieldDiffProvider(props: Props): React.ReactElement;
export declare function useFieldDiff(): FieldDiffContextValue;
export {};
