class XArray<T> extends Array<T>
{
    constructor(pArg?: number | T[] | any)
    {
        super();
        if (pArg != null)
        {
            if (pArg.length > 0)
            {
                for (var i = 0; i < pArg.length; i++)
                    this[i] = pArg[i];
            }
            else
            {
                if (pArg > 0)
                {
                    this.length = pArg;
                    for (var i = 0; i < this.length; i++)
                        this[i] = <T>null;
                }
            }
        }
    }
}
