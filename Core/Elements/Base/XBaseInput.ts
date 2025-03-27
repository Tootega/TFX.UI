class XBaseInput extends XElement
{
    constructor(pOwner: XElement | null, pClass: string | null = null)
    {
        super(pOwner, pClass);
        this.Container.className = "InputContainer";
    }

    protected override CreateContainer(): HTMLElement 
    {
        return XUtils.AddElement<HTMLElement>(this.Owner, "div", null);
    }

    protected CreateElement(pClass: string | null = null): HTMLElement
    {
        return XUtils.AddElement<HTMLInputElement>(this.Container, "input", pClass);
    }

}