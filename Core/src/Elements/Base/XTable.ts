/// <reference path="XDiv.ts" />
interface XColumnConfig
{
    Title: string;
    Visible: boolean;
    Width: number;
}
class XTableElement extends XElement
{
    constructor(pOwner: XElement | HTMLElement | null, pClass: string | null = null, pTag: string | null = null)
    {
        super(pOwner, pClass, pTag);
    }
    Cells = new XArray<XTableElement>();

    AddCell(pClass: string)
    {
        var cell = new XTableElement(this, pClass, "tr");
        this.Cells.Add(cell);
    }

    protected override CreateContainer(pTag: string | null = null): HTMLElement 
    {
        return XUtils.AddElement<HTMLTableElement>(null, pTag, null);
    }
}

class XDragUtils
{
    private static _Data: any;
    static SetData(pData: any)
    {
        this._Data = pData;
    }
    static GetData<T>(): T
    {
        return <T>this._Data;
    }
}

class XTableHCell extends XTableElement
{
    constructor(pOwner: XElement | HTMLElement | null, pClass: string | null = null, pTag: string | null = null)
    {
        super(pOwner, pClass, pTag);
        this.Content = XUtils.AddElement<HTMLDivElement>(this, "div", "XTableHContent");
        this.Sizer = XUtils.AddElement<HTMLDivElement>(this.Content, "div", "XTableResizer");
        this.Text = XUtils.AddElement<HTMLSpanElement>(this.Content, "div", "XTableHTitle");
        this.ResizerEvents()
        this.DragEvents()
    }
    Sizer: HTMLDivElement;
    Text: HTMLSpanElement;
    Content: HTMLDivElement;
    Data: XColumnConfig | any = null;
    Table: XTable | any = null;
    Row: number = -1;


    SetData(pCell: XColumnConfig)
    {
        this.Data = pCell;
        this.Text.innerHTML = "<spans>" + this.Row + "</span>";
    }

    DragEvents()
    {
        this.HTML.draggable = true;
        this.HTML.addEventListener('dragstart', (e) =>
        {
            XDragUtils.SetData(this);
            this.HTML.classList.add('dragging');
        });

        this.HTML.addEventListener('dragend', (e) =>
        {
            this.HTML.classList.remove('dragging');
        });

        this.HTML.addEventListener('dragover', (e) =>
        {
            e.preventDefault();
            var elm = XDragUtils.GetData<XElement>();
            if (elm == null || elm.UUID == this.UUID)
                return;

            var w = this.HTML.GetRect().Width;
            if (e.offsetX <= 5 || e.offsetX + 6 >= w)
                return;
            console.log(w + " " + e.offsetX);

            this.HTML.classList.remove('ldrag-over');
            this.HTML.classList.remove('rdrag-over');
            if (e.offsetX > w / 2)
                this.HTML.classList.add('rdrag-over');
            else
                this.HTML.classList.add('ldrag-over');
        });

        this.HTML.addEventListener('dragleave', () =>
        {
            this.HTML.classList.remove('ldrag-over');
            this.HTML.classList.remove('rdrag-over');
        });

        this.HTML.addEventListener('drop', (e) =>
        {
            e.preventDefault();
            this.HTML.classList.remove('ldrag-over');
            this.HTML.classList.remove('rdrag-over');
            const elm = XDragUtils.GetData<XElement>();
            if (this.Owner instanceof XElement && elm.UUID != this.UUID)
            {
                var w = this.HTML.clientWidth / 2;
                if (e.offsetX > w)
                    this.Owner.HTML.insertBefore(this.HTML, elm.HTML);
                else
                    this.Owner.HTML.insertBefore(elm.HTML, this.HTML);
            }
        });
    }

    private ResizerEvents()
    {
        let isResizing = false;
        let startX = 0;
        let startWidth = 0;

        this.Sizer.addEventListener('mousedown', (e) =>
        {
            e.stopPropagation();
            e.preventDefault();

            isResizing = true;
            startX = e.clientX;
            startWidth = this.Content.offsetWidth;

            const handleMouseMove = (e: MouseEvent) =>
            {
                if (!isResizing)
                    return;
                const newWidth = startWidth + (e.clientX - startX);
                this.Content.style.width = `${newWidth}px`;
                this.Data.Width = newWidth;
            };

            const handleMouseUp = () =>
            {
                isResizing = false;
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp, { once: true });
        });
    }


    //private updateColumnWidths(field: string, width: number)
    //{
    //    const index = this.Columns.findIndex(c => c.Title === field);
    //    if (index > -1)
    //    {
    //        this.Columns[index].Width = width;
    //        document.querySelectorAll(`th[data-field="${field}"], td[data-field="${field}"]`)
    //            .forEach(el => (el as HTMLElement).style.width = `${width}px`);
    //    }
    //}
}

class XTableHeader extends XElement
{
    constructor(pOwner: XTable)
    {
        super(pOwner, "XTableHeader");
        this.TRows = new XTableElement(this, null, "tr");
        this.Table = pOwner;
    }
    TRows: XTableElement;
    Columns = new XArray<XTableElement>();
    Table: XTable;

    AddColumns(pClass: string): XTableHCell
    {
        var cell = new XTableHCell(this.TRows, pClass, "th");
        cell.Table = this.Table;
        this.Columns.Add(cell);
        return cell;
    }

    protected override CreateContainer(): HTMLElement 
    {
        return XUtils.AddElement<HTMLTableElement>(null, "thead", null);
    }
}

class XTableBody extends XElement
{
    constructor(pOwner: XElement | HTMLElement | null)
    {
        super(pOwner, "");
        this.BRows = new XTableElement(this, null, "tr");
    }
    BRows: XTableElement;
    DataRows = new XArray<XTableElement>();

    AddRow()
    {
        var row = new XTableElement(this, "XTableBR", "td");
        this.DataRows.Add(row);
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
    private Columns: XColumnConfig[] | null = null;
    protected DataSet: any[] = [];
    private RowNumberColumn: XColumnConfig = { Title: '#', Visible: true, Width: 50 };

    GetVisibleColumns(): Array<XColumnConfig>
    {
        if (this.Columns == null)
            return new Array<XColumnConfig>();
        return [this.RowNumberColumn, ...this.Columns.filter(c => c.Visible)];
    }

    SetDataSet(pDataSet: any)
    {
        this.DataSet = pDataSet;
        const fields = Object.keys(this.DataSet[0] || {});
        this.Columns = fields.map(Title => ({ Title, Visible: true, Width: 120 }));
        this.CreateHeader();
    }

    CreateHeader()
    {
        if (this.Columns == null)
            return;
        for (var i = 0; i < this.Columns.length; i++)
        {
            let col = this.Columns[i];
            let cell = this.Header.AddColumns("XTh");
            cell.Row = i;
            cell.SetData(col);
        }
    }

    protected override CreateContainer(): HTMLElement 
    {
        return XUtils.AddElement<HTMLTableElement>(null, "table");
    }
}