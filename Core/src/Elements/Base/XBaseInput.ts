class XBaseInput extends XElement
{
    constructor(pOwner: XElement | HTMLElement | null)
    {
        super(pOwner, "InputContainer");
        this.Input = XUtils.AddElement<HTMLInputElement>(this.HTML, "input", "XBaseButtonInput");
    }

    Input: HTMLInputElement;

    protected override CreateContainer(): HTMLElement 
    {
        return XUtils.AddElement<HTMLElement>(this.Owner, "div", null);
    }
}