class XType1
{
    Point: XPoint = new XPoint();
    LeftX: number = 0;
    LeftY: number = 0;
    Used: boolean = false;
    EndX: number = -1;
    StartX: number = -1;

}

class XEditPosition
{
    constructor(pLocation: XPoint)
    {
        this.Point = pLocation;
    }

    Used: boolean = false;
    Point: XPoint;
}
class XForm extends XDiv
{

    constructor(pOwner: XElement | HTMLElement | null)
    {
        super(pOwner, "XForm");
        var edt: any;
        edt = new XDatePicker(this);
        edt.Rows = 1;
        edt.Cols = 8;
        this.Fields.Add(edt);
        edt = new XDatePicker(this);
        edt.Rows = 1;
        edt.Cols = 3;
        this.Fields.Add(edt);
        edt = new XDatePicker(this);
        edt.Rows = 1;
        edt.Cols = 5;
        this.Fields.Add(edt);
        this.Fields.Add(edt);
        edt = new XDatePicker(this);
        edt.Rows = 1;
        edt.Cols = 5;
        this.Fields.Add(edt);
        this.Fields.Add(edt);
        edt = new XDatePicker(this);
        edt.Rows = 1;
        edt.Cols = 5;
        this.Fields.Add(edt);
    }

    Fields: XArray<XIEditor> = new XArray<XIEditor>();

    override SizeChanged()
    {
        this.NomalForm(this.Rect);
    }

    private NomalForm(pConstraint: XRect)
    {
        var rects = new Array<XEditPosition[]>();
        var sw = pConstraint.Width / XDefault.DefaultColCount;
        var sh = XDefault.DefaultRowHeight;
        var mh = 0;
        for (var y = 0; y < 64; y++)
        {
            var rcts: XEditPosition[] = new Array(XDefault.DefaultColCount);
            for (var x = 0; x < XDefault.DefaultColCount; x++)
                rcts[x] = new XEditPosition(new XPoint(x * sw, y * sh));
            rects.Add(rcts);
        }
        var cnt = 0;
        var ordered = this.Fields.OrderBy(c => c.OrderIndex)
        for (var i = 0; i < ordered.length; i++)
        {
            var fld = this.Fields[i];
            fld.OrderIndex = ++cnt;
        }
        var lx = 0;
        var ly = 0;
        for (var i = 0; i < ordered.length; i++)
        {
            var child = this.Fields[i];
            var ret = this.GerPosition(rects, child, child.Rows, child.Cols, ly, lx);
            lx = ret.LeftX;
            ly = ret.LeftY;
            if (child.NewLine)
                lx = XDefault.DefaultColCount;
            var r = new XRect(ret.Point.X + 2, ret.Point.Y, Math.max(sw, child.Cols * sw) - 2, Math.max(sh, child.Rows * XDefault.DefaultRowHeight));
            child.Rect = r;
            if (r.Bottom > mh)
                mh = r.Bottom;
        }
    }

    GerPosition(pRects: any[], pField: XIEditor, pRows: number, pCols: number, pLy: number, pLx: number): XType1
    {
        var sx = -1;
        var sy = -1;
        var ey = -1;
        var ex = -1;
        var ret = new XType1();
        for (var i = pLy; i < pRects.length; i++)
        {
            var rs = pRects[i];
            if (sy == -1)
                sy = i;
            if (i > pLy)
                sx = Math.max(0, sx);
            else
                sx = Math.max(pLx, sx);
            var ret = this.FincX(rs, sx, ex, pCols);
            sx = ret.StartX;
            ex = ret.EndX;
            if (ret.Used)
            {
                if (pRows == (i - sy) + 1)
                {
                    ey = i;
                    break;
                }
            }
            else
                sy = -1;
        }
        if (sy != -1 && sx != -1 && ey != -1 && ex != -1)
        {
            var rx = pRects[sy][sx];
            for (var y = sy; y <= ey; y++)
                for (var x = sx; x <= ex; x++)
                    pRects[y][x].Used = true;
            pLx = ex;
            pLy = sy;
            ret.Point = rx.Point;
            ret.LeftX = pLx;
            ret.LeftY = pLy;
            return ret;
        }

        ret.Point = new XPoint(-1, -1);
        ret.LeftX = pLx;
        ret.LeftY = pLy;
        return ret;
    }

    FincX(pHRects: any[], pStartX: number, pEndX: number, pCols: number): XType1
    {
        var start = pStartX != -1 ? pStartX : 0;
        var ret = new XType1();
        ret.Used = false;
        for (var x = start; x < pHRects.length; x++)
        {
            var r = pHRects[x];
            if (r.Used)
            {
                if (pStartX != -1)
                    pStartX = -1;
                continue;
            }
            if (pStartX == -1)
                pStartX = x;
            if (pCols == (x - pStartX) + 1)
            {
                pEndX = x;
                ret.EndX = pEndX;
                ret.StartX = pStartX;
                ret.Used = true;
                return ret;
            }
        }
        pEndX = pStartX = -1;
        ret.EndX = pEndX;
        ret.StartX = pStartX;
        return ret;
    }

}

