/// <reference path="XSizeableElement.ts" />
class XBaseDialog extends XSizeableElement implements XIDialog
{
    constructor(pOwner: XElement, pClass: string)
    {
        super(pOwner, pClass);
        this.HTML.parentElement?.remove();
    }

    ShowDialog(pMessage: string)
    {
        if (this.HTML.parentElement == null)
        {
            let ow = this.GetOwner<XIDialogContainer>(a =>
            {
                return true;
            });
        }
    }
}