/// <reference path="XDiv.ts" />
class XBaseInput extends XDiv implements XIEditor
{
    constructor(pOwner: XElement | HTMLElement | null)
    {
        super(pOwner, "InputContainer");
        this.Input = XUtils.AddElement<HTMLInputElement>(this.HTML, "input", "XBaseButtonInput");
    }
    Input: HTMLInputElement;

    Rows: number = 0;
    Cols: number = 0;
    NewLine: boolean = false;
    OrderIndex: number = -1;  
}