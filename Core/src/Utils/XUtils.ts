class XUtils
{
    public static IsNumber(pValue: any): boolean
    {
        return !isNaN(parseFloat(pValue)) && isFinite(pValue);
    }

    public static AddElement<T extends Element>(pOwner: any | HTMLElement | null, pTag: string | null, pClass: string | null = null, pInsert: boolean = false): T
    {
        if (pTag == null)
            throw new Error(`Parameter "pTag" can´t be null`);
        var own: Element;
        if (pOwner == null)
            own = document.body;
        else
            if (pOwner instanceof HTMLElement)
                own = pOwner;
            else
                own = pOwner.HTML;

        var elm = <Element>document.createElement(pTag);

        if (pClass != null)
            elm.className = pClass;

        if (pInsert && own.childNodes.length > 0)
            own.insertBefore(elm, elm.childNodes[0]);
        else
            own.appendChild(elm);

        if (pOwner == null)
            elm.Owner = pOwner;
        else
            if (pOwner instanceof XElement)
                elm.Owner = pOwner;
        return <T>elm;
    }
}