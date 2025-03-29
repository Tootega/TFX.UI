class XElement
{
    constructor(pOwner: XElement | null, pClass: string | null = null)
    {
        this.Owner = pOwner;
        this.Container = this.CreateContainer();        
        this.Element = this.CreateElement(pClass ?? this.constructor.name);     
        this.CreateChildren();
    }

    protected Container: HTMLElement;
    public Element: HTMLElement;
    Owner: XElement | null;

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