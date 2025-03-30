class XLauncher
{
    static Run()
    {
        window.onmousedown = (arg) => XPopupManager.HideAll(arg);
        this.Body = new XDiv(null, "MainDiv");
        new XMenu(this.Body);
        //new XDatePicker(this.Body);
    }

    static Body: XDiv;
}

