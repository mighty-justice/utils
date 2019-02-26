/// <reference types="react" />
export declare function canReplaceSymbols(template: string, chars: string[]): boolean;
export declare function replaceSymbolsWithChars(template: string, chars: string[]): string;
export declare function hasStringContent(value: unknown): value is string;
export declare function hasStringOrNumberContent(value: unknown): value is number | string;
export declare function splitName(name?: string | null): string[];
export declare function splitCommaList(str?: string | null): string[];
export declare function formatFullName(firstName?: string, lastName?: string): string;
export declare function formatPhoneNumber(input?: string | null): string;
export declare function formatDate(value?: string | null, dateFormat?: string): string;
export declare function getNameOrDefault(obj?: unknown, { field, defaultValue }?: {
    field?: string | undefined;
    defaultValue?: string | undefined;
}): any;
export declare function getOrDefault(value?: any): any;
export declare function formatSocialSecurityNumber(value?: null | string): string;
export declare function formatPercentage(value: null | number | string, decimalPoints?: number): string;
export declare function formatMoney(value?: null | number | string): string;
export declare function formatParagraphs(value?: null | string): "--" | JSX.Element[];
export declare function formatCommaSeparatedNumber(value?: null | number | string): string;
export declare function formatDelimitedList(list?: null | string[], delimiter?: string): any;
export declare function mapBooleanToText(bool?: boolean | null, { mapUndefinedToNo }?: {
    mapUndefinedToNo: boolean;
}): "--" | "Yes" | "No";
export declare function formatMoneyInput(value?: null | number | string): number | null | undefined;
export declare function formatDuration(iso8601?: null | string): string;
export declare function formatWebsite(website: string | undefined, text?: string): (string | JSX.Element);
export declare function stripNonAlpha(str?: string | null): string;
export declare function pluralize(baseWord: string, pluralSuffix: string, count: number): string;
export declare function getType(fullType?: null | string): string | null | undefined;
export declare function preserveNewLines(body: string): string;
export declare function parseAndPreserveNewlines(body?: string): any;
export declare function getDisplayName(component: any): (string | undefined);
export declare function varToLabel(str: string): string;
export declare function toKey(dict: {
    [key: string]: any;
}): string;
