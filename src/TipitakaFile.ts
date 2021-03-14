export interface Entry {
    type: "paragraph" | "heading" | "centered";// | string;
    text: string;
    level?: number;
}

export interface Footnote {
    type: string;
    text: string;
    level?: number;
}

export interface Pali {
    entries: Entry[];
    footnotes: Footnote[];
}

export interface Sinh {
    entries: Entry[];
    footnotes: Footnote[];
}

export interface Page {
    pageNum: number;
    pali: Pali;
    sinh: Sinh;
}

export interface TipitakaFile {
    filename: string;
    pages: Page[];
    bookId: string;
    pageOffset: number;
    collection: string;
}