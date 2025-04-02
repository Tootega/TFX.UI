/// <reference path="XDiv.ts" />

class XTableElement extends XElement
{
    constructor(pOwner: XElement | HTMLElement | null, pClass: string | null = null, pTag: string | null = null)
    {
        super(pOwner, pClass, pTag);
    }

    protected override CreateContainer(pTag: string | null = null): HTMLElement 
    {
        return XUtils.AddElement<HTMLTableElement>(null, pTag, null);
    }
}

class XTableHeader extends XElement
{
    constructor(pOwner: XElement | HTMLElement | null)
    {
        super(pOwner, "XTableHeader");
        this.Row = new XTableElement(this, "XTableHR", "tr");
    }
    Row: XTableElement;
    Columns = new XArray<XTableElement>();

    protected override CreateContainer(): HTMLElement 
    {
        return XUtils.AddElement<HTMLTableElement>(null, "thead", null);
    }

    AddCell(pClass: string)
    {
        var cell = new XTableElement(this.Row, pClass, "th");
        this.Columns.Add(cell); 
    }
}

class XTableBody extends XElement
{
    constructor(pOwner: XElement | HTMLElement | null)
    {
        super(pOwner, "XTableBody");
        this.Row = new XTableElement(this, "XTableBR", "tr");
    }
    Row: XTableElement;
    Columns = new XArray<XTableElement>();

    AddCell(pClass: string)
    {
        var cell = new XTableElement(this.Row, pClass, "td");
        this.Columns.Add(cell);
    }

    protected override CreateContainer(): HTMLElement 
    {
        return XUtils.AddElement<HTMLTableElement>(null, "tbody", null);
    }
}

class XTable extends XElement
{
    constructor(pOwner: XElement | HTMLElement | null, pClass: string | null)
    {
        super(pOwner, pClass);
        this.Header = new XTableHeader(this);
        this.Body = new XTableBody(this);;
    }
    Header: XTableHeader;
    Body: XTableBody;

    protected override CreateContainer(): HTMLElement 
    {
        return XUtils.AddElement<HTMLTableElement>(null, "table");
    }
}