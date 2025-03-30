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