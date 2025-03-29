class XLauncher
{
    static Run()
    {
        this.Body = new XDiv(null, "MainDiv");
        new XBaseButtonInput(this.Body)        
    }

    static Body: XDiv;
}

