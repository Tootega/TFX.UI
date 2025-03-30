class XBaseInput extends XDiv
{
    constructor(pOwner: XElement | HTMLElement | null)
    {
        super(pOwner, "InputContainer");
        this.Input = XUtils.AddElement<HTMLInputElement>(this.HTML, "input", "XBaseButtonInput");
    }

    Input: HTMLInputElement;
}