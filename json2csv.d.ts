declare module 'json2csv' {
    interface ParserOptions {
        fields?: string[];
        delimiter?: string;
        eol?: string;
        excelStrings?: boolean;
        header?: boolean;
        includeEmptyRows?: boolean;
        withBOM?: boolean;
    }

    class Parser<T = any> {
        constructor(options?: ParserOptions);
        parse(data: T[]): string;
    }
}
