class XBaseInput extends XElement
{
    constructor(pOwner: XElement | HTMLElement | null, pClass: string | null = null)
    {
        super(pOwner, pClass);
        this.HTML.className = "InputContainer";
        this.Input = XUtils.AddElement<HTMLInputElement>(this.HTML, "input", "XBaseButtonInput");
    }

    Input: HTMLInputElement;

    protected override CreateContainer(): HTMLElement 
    {
        return XUtils.AddElement<HTMLElement>(this.Owner, "div", null);
    }
}