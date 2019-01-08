/// <reference types="react" />
export declare function splitName(name?: string | null): string[];
export declare function splitCommaList(str?: string | null): string[];
export declare function formatFullName(firstName?: string, lastName?: string): string;
export declare function formatPhoneNumber(input?: string): string;
export declare function formatDate(value?: string | null, dateFormat?: string): string;
export declare function getNameOrDefault(obj?: {
    [key: string]: any;
}, { field, defaultValue }?: {
    field?: string | undefined;
    defaultValue?: string | undefined;
}): any;
export declare function getOrDefault(obj?: any): any;
export declare function formatSocialSecurityNumber(input?: string): string;
export declare function formatPercentage(value: number | string, decimalPoints?: number): string;
export declare function formatMoney(value?: number | string): string;
export declare function formatParagraphs(field?: string): "--" | JSX.Element[];
export declare function formatCommaSeparatedNumber(value?: number | string): string;
export declare function formatDelimitedList(list?: string[], delimiter?: string): any;
export declare function mapBooleanToText(bool?: boolean | null, { mapUndefinedToNo }?: {
    mapUndefinedToNo: boolean;
}): "--" | "Yes" | "No";
export declare function formatMoneyInput(value?: number | string): number | "" | undefined;
export declare function formatDuration(iso8601?: string): string;
export declare function stripNonAlpha(str?: string | null): string;
export declare function pluralize(baseWord: string, pluralSuffix: string, count: number): string;
export declare function getType(fullType?: string): string | undefined;
export declare function preserveNewLines(body: string): string;
export declare function parseAndPreserveNewlines(body?: string): any;
export declare function getPercentValue(value?: string): string | undefined;
export declare function getPercentDisplay(value?: string): string | number | undefined;
export declare function getDisplayName(component: any): (string | undefined);
export declare function varToLabel(str: string): string;
export declare function toKey(dict: {
    [key: string]: any;
}): string;
