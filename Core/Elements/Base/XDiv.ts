class XDiv extends XElement
{
    constructor(pOwner: XElement | null, pClass: string | null)
    {
        super(pOwner, pClass);
        if (pClass != null && this.Container != null)
            this.Container.className = pClass
    }

    protected CreateContainer(): HTMLElement 
    {
        return XUtils.AddElement<HTMLElement>(null, "div", null);
    }

    protected override CreateElement(pClass: string | null = null): HTMLElement
    {
        return <HTMLElement>this.Container;
    }
}