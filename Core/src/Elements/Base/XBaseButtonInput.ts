class XBaseButtonInput extends XBaseInput 
{
    constructor(pOwner: XElement | HTMLElement | null, pClass: string | null = null)
    {
        super(pOwner, pClass);
        this.Button = new XBaseButton(this, "XLookupButton");
        XEventManager.AddEvent(this, this.Button.HTML, XEventType.Click, this.OnClick, true);
    }

    Button: XBaseButton;

    OnClick(pArg: KeyboardEvent)
    {
    }
}