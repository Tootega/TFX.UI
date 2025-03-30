class XElement
{
    constructor(pOwner: XElement | HTMLElement | null, pClass: string | null = null)
    {
        this.Owner = pOwner;
        this.HTML = this.CreateContainer();
        if (pClass == null)
            pClass = this.constructor.name;
        this.Element = null;
        this.CreateChildren();
        this.HTML.className = pClass
        if (pOwner instanceof XElement)
            pOwner.HTML.appendChild(this.HTML);
        if (pOwner instanceof HTMLElement)
            pOwner.appendChild(this.HTML);
    }

    public HTML: HTMLElement;
    public Element: HTMLElement | null;
    Owner: XElement | HTMLElement | null;
    private _IsVisible: boolean = true;

    BindTo(pElement: XElement)
    {
        const editorRect = pElement.HTML.getBoundingClientRect();
        const dropdownRect = this.HTML.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let top;
        const spaceBelow = viewportHeight - editorRect.bottom;
        const spaceAbove = editorRect.top;

        if (dropdownRect.height <= spaceBelow)
            top = editorRect.bottom;
        else
            if (dropdownRect.height <= spaceAbove)
                top = editorRect.top - dropdownRect.height;
            else
                top = spaceBelow > spaceAbove ? editorRect.bottom : editorRect.top - dropdownRect.height;

        let left;
        const spaceRight = viewportWidth - editorRect.left;

        if (dropdownRect.width <= spaceRight)
            left = editorRect.left; 
        else
        {
            const spaceLeft = editorRect.right;
            if (dropdownRect.width <= spaceLeft)
                left = editorRect.right - dropdownRect.width; 
            else
                left = Math.max(0, viewportWidth - dropdownRect.width); 
        }

        this.HTML.style.position = 'fixed';
        this.HTML.style.top = `${top}px`;
        this.HTML.style.left = `${left}px`;

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

    protected CreateContainer(): HTMLElement 
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