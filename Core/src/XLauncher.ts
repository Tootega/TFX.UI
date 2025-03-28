class XLauncher
{
    static Run()
    {
        this.Body = new XDiv(null, "MainDiv");
        let x = new XBaseInput(this.Body);
        new XBaseButtonInput(this.Body)        
    }

    static Body: XDiv;
}

