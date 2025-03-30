interface XMouseEvent { (pArg: MouseEvent): void; }

interface Window 
{
    ErrorDialog: any;
    Wait: any;

    ShowError(pError: Error): void;

    BeginWait(): void;

    EndWait(): void;

    Canvas: any;
    LogonForm: any;
    ConfigForm: any;

    ShowRemoteCMD(): void;

    InitializeMap: any;
    CITHook: any;
}
interface XIElement
{
    HTML: HTMLElement;
}

interface XIPopupPanel extends XIElement
{
    CallPopupClosed(): void;
    Show():void;

    AutoClose: boolean;
    OnPopupClosed: XPopupClosedEvent | null;
    CanClose(pSource: HTMLElement): boolean;
    IsVisible: boolean;
}