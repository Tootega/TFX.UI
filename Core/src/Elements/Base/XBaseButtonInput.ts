class XBaseButtonInput extends XBaseInput 
{
    constructor(pOwner: XElement | null, pClass: string | null = null)
    {
        super(pOwner, pClass);
    }

    Button: HTMLElement = XUtils.AddElement<HTMLElement>(this.Container, "div", "XLookupButton");
    ButtonIcon: HTMLElement = XUtils.AddElement<HTMLElement>(this.Button, "div", "XButtonIcon");

}