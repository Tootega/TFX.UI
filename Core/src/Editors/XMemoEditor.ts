/// <reference path="../Elements/Base/XBaseInput.ts" />
class XMemoEditor extends XBaseInput
{
    constructor(pOwner: XElement | HTMLElement | null)
    {
        super(pOwner);
        this.Input.className = "XMemoEditor";
    }

    override CreateInput(): HTMLInputElement
    {
        return XUtils.AddElement<HTMLInputElement>(this.HTML, "textarea", "XBaseButtonInput");
    }
}