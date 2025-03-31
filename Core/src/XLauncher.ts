class XLauncher extends XDiv
{
    static Run()
    {
        window.onmousedown = (arg) => XPopupManager.HideAll(arg);
        this.Body = new XDiv(null, "");
        new XTabControl(this.Body);
    }

    static Body: XDiv;

    constructor()
    {
        super(document.body, "MainDiv");
    }
}

