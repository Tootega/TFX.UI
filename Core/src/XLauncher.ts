class XLauncher
{
    static Run()
    {
        window.onmousedown = (arg) => XPopupManager.HideAll(arg);
        this.Body = new XDiv(null, "MainDiv");
        new XBaseButtonInput(this.Body);
        //new XDatePicker(this.Body);
    }

    static Body: XDiv;
}

