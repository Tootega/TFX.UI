declare class XArray<T> extends Array<T> {
    constructor(pArg?: number | T[] | any);
}
declare class XLauncher {
    static Run(): void;
    static Body: XDiv;
}
declare class XElement {
    constructor(pOwner: XElement | null, pClass?: string | null);
    protected Container: HTMLElement;
    Element: HTMLElement;
    Owner: XElement | null;
    protected CreateChildren(): void;
    protected CreateContainer(): HTMLElement;
    protected CreateElement(pClass?: string | null): HTMLElement;
}
declare class XBaseInput extends XElement {
    constructor(pOwner: XElement | null, pClass?: string | null);
    protected CreateContainer(): HTMLElement;
    protected CreateElement(pClass?: string | null): HTMLElement;
}
declare class XDiv extends XElement {
    constructor(pOwner: XElement | null, pClass: string | null);
    protected CreateContainer(): HTMLElement;
    protected CreateElement(pClass?: string | null): HTMLElement;
}
declare class XBaseButtonInput extends XBaseInput {
    constructor(pOwner: XElement | null, pClass?: string | null);
    Button: HTMLElement;
    ButtonIcon: HTMLElement;
}
interface Element {
    Owner: XElement | null;
}
declare class XUtils {
    static X(): void;
    static AddElement<T extends Element>(pOwner: XElement | HTMLElement | null, pType: string, pClass: string | null, pInsert?: boolean): T;
}
