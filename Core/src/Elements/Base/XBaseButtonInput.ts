class XBaseButtonInput extends XBaseInput 
{
    constructor(pOwner: XElement | HTMLElement | null, pClass: string | null = null)
    {
        super(pOwner, pClass);
        this.Button = new XButton(this, "XLookupButton");
        XEventManager.AddEvent(this, this.Button.Container, XEventType.KeyDown, this.OnClick, true);

    }
    Button: XButton;

    OnClick(pArg: KeyboardEvent)
    {
    }
}