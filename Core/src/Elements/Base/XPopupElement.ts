class XPopupElement extends XDiv implements XIPopupPanel
{
    constructor(pOwner: XElement | HTMLElement | null, pClass: string | null)
    {
        super(pOwner, pClass);
        this.ReferenceElement = this;
        this.HTML.style.zIndex = XPopupManager.ZIndex();
    }
    AutoClose: boolean = false;
    OnPopupClosed: XPopupClosedEvent | null = null;
    ReferenceElement: XElement | null = null;

    CallPopupClosed(): void
    {
    }


    override Show(pValue: boolean = true)
    {
        this.HTML.style.zIndex = XPopupManager.ZIndex();
        super.Show(pValue);
    }

    CanClose(pElement: HTMLElement): boolean
    {
        if (this.ReferenceElement != null)
            return !pElement.IsChildOf(this.ReferenceElement.HTML, true) && this.CheckClose(pElement) && this.IsVisible && !pElement.IsChildOf(this.HTML, true);
        return true;
    }
}