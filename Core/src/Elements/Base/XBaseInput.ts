/// <reference path="XDiv.ts" />
class XBaseInput extends XDiv implements XIEditor
{
    constructor(pOwner: XElement | HTMLElement | null)
    {
        super(pOwner, "InputContainer");
        this.Input = this.CreateInput();
        this.ELMTitle = new XDiv(this, "InputTitle");
        this.ELMTitle.HTML.innerText = new Date().toLocaleTimeString();
    }
    Input: HTMLInputElement;
    protected ELMTitle: XDiv;


    NewLine: boolean = false;
    OrderIndex: number = -1;  

    CreateInput(): HTMLInputElement
    {
        return XUtils.AddElement<HTMLInputElement>(this.HTML, "input", "XBaseButtonInput");
    }
}