class XStageTabControlTab extends XTabControlTab
{
    constructor(pOwner: XElement | HTMLElement | null)
    {
        super(pOwner);
        this.Form = new XForm(this);
    }
    Form: XForm;
}

class XStageTabControl extends XTabControl
{
    constructor(pOwner: XElement | HTMLElement | null)
    {
        super(pOwner);
        this.HTML.classList.add("Main");
    }

    CreateTab(): XTabControlTab
    {
        return new XStageTabControlTab(this.Container);;
    }
}

