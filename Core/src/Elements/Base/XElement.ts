﻿class XElement
{
    static _ID = 0;

    static NextID(): number
    {
        return this._ID++
    }

    constructor(pOwner: XElement | HTMLElement | null, pClass: string | null = null, pTag: string | null = null)
    {
        this.UUID = XElement.NextID();
        this.Owner = pOwner;
        this.HTML = this.CreateContainer(pTag);
        this.HTML.Object = this;
        if (pClass == null)
            pClass = this.constructor.name;
        this.Element = null;
        this.CreateChildren();
        if (!X.IsEmpty(pClass))
            this.HTML.className = pClass
        if (pOwner instanceof XElement)
            pOwner.HTML.appendChild(this.HTML);
        if (pOwner instanceof HTMLElement)
            pOwner.appendChild(this.HTML);
        this._ResizeObserver = new ResizeObserver(() => this.SizeChanged());
        this._ResizeObserver.observe(this.HTML);
        if (pOwner instanceof XElement)
            pOwner.AddChildren(this);
    }

    public HTML: HTMLElement;
    public Element: HTMLElement | null;
    Owner: XElement | HTMLElement | null;
    private _IsVisible: boolean = true;
    UUID: number = 0;
    private _ResizeObserver: ResizeObserver;
    OnResize: XMethod<XElement> | null = null;
    OrderIndex: number = 0;
    Rows: number = 0;
    Cols: number = 0;
    Children: XArray<XElement> = new XArray<XElement>();

    AddChildren(pElement: XElement)
    {
        this.Children.Add(pElement);
    }

    get Rect(): XRect
    {
        return this.HTML.GetRect();
    }

    set Rect(pValue: XRect)
    {
        this.HTML.SetRect(pValue);
    }

    SizeChanged()
    {
        if (this.OnResize != null)
            this.OnResize.apply(this, [this]);
    }

    CheckClose(pElement: HTMLElement): boolean
    {
        return true;
    }

    get IsDrawed(): boolean
    {
        var elm: any = this.HTML;
        while (elm !== null && elm !== document.body)
        {
            if (elm.parentElement == document.body)
                return true;
            var style = window.getComputedStyle(elm);
            if (style.display == "none")
                return false;
            elm = elm.parentElement;
        }
        return false;
    }

    OnHide()
    {
    }

    OnShow()
    {
    }

    Show(pValue: boolean = true)
    {
        var old = this.IsDrawed;
        this._IsVisible = pValue;
        if (pValue === true)
        {
            this.HTML.style.visibility = 'visible';
            this.OnShow();
        }
        else
            if (pValue === false)
            {
                this.HTML.style.visibility = 'hidden';
                this.OnHide();
            }
        if (pValue == old)
            return;
    }

    SetContent(pValue: string)
    {
        if (this.HTML != null)
            this.HTML.innerText = pValue;
    }

    protected CreateChildren()
    {
    }

    protected CreateContainer(pTag: string | null = null): HTMLElement 
    {
        throw new Error("Method not implemented.");
    }

    CanClose(pSource: HTMLElement): boolean
    {
        return true
    }
    get IsVisible(): boolean
    {
        if (!this._IsVisible)
            return this._IsVisible;
        return this.IsDrawed;
    }

    set IsVisible(pValue: boolean)
    {
        this.Show(pValue);
    }


}