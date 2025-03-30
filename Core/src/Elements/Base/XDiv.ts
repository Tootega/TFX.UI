﻿class XDiv extends XElement
{
    constructor(pOwner: XElement | HTMLElement | null, pClass: string | null)
    {
        super(pOwner, pClass);
    }

    protected override CreateContainer(): HTMLElement 
    {
        return XUtils.AddElement<HTMLElement>(null, "div", null);
    }

    protected override CreateElement(pClass: string | null = null): HTMLElement
    {
        return <HTMLElement>this.HTML;
    }
}