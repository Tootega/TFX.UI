/// <reference path="XSizeableElement.ts" />
class XPopupElement extends XSizeableElement implements XIPopupPanel
{
    constructor(pOwner: XElement, pClass: string)
    {
        super(pOwner, pClass);
        this.ReferenceElement = this;
        this.HTML.style.zIndex = XPopupManager.ZIndex();
        XPopupManager.Add(this);
    }
    AutoClose: boolean = false;
    OnPopupClosed: XPopupClosedEvent | null = null;
    ReferenceElement: XElement | null = null;

    CallPopupClosed(): void
    {
    }

    override Show(pValue: boolean = true)
    {
        super.Show(pValue);
    }

    CanClose(pElement: HTMLElement): boolean
    {
        if (this.ReferenceElement != null)
            return !pElement.IsChildOf(this.ReferenceElement.HTML, true) && this.CheckClose(pElement) && this.IsVisible && !pElement.IsChildOf(this.HTML, true);
        return true;
    }
}