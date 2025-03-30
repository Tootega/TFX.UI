class XElement
{
    constructor(pOwner: XElement | HTMLElement | null, pClass: string | null = null)
    {
        this.Owner = pOwner;
        this.Container = this.CreateContainer();        
        this.Element = this.CreateElement(pClass ?? this.constructor.name);     
        this.CreateChildren();
        if (pClass != null && this.Container != null)
            this.Container.className = pClass
        if (pOwner instanceof XElement)
            pOwner.Container.appendChild(this.Container);
        if (pOwner instanceof HTMLElement)
            pOwner.appendChild(this.Container);
    }

    public Container: HTMLElement;
    public Element: HTMLElement;
    Owner: XElement | HTMLElement | null;

    Hide()
    {
        this.Container.style.visibility = 'hidden';
    }

    Show()
    {
        this.Container.style.visibility = 'visible';
    }

    SetContent(pValue: string)
    {
        if (this.Container != null)
            this.Container.innerText = pValue;
    }

    protected CreateChildren()
    {
    }

    protected CreateContainer(): HTMLElement 
    {
        throw new Error("Method not implemented.");
    }

    protected CreateElement(pClass: string | null = null): HTMLElement
    {
        throw new Error("Method not implemented.");
    }
}