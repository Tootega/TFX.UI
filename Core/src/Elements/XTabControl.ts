
class XTabControlButton extends XBaseTextButton
{
    constructor(pOwner: XElement | HTMLElement | null)
    {
        super(pOwner, "XTabControlButton");
        XEventManager.AddEvent(this, this.HTML, XEventType.Click, () =>
        {
            this.TabControl?.SelectTab(this);
        });
    }

    TabControl: XTabControl | null = null;
    Tab: XTabControlTab | null = null;

}

class XTabControlHeader extends XDiv
{
    constructor(pOwner: XElement | HTMLElement | null)
    {
        super(pOwner, "XTabControlHeader");
    }

    DropdownButton: XTabControlButtonList | null = null;

    override SizeChanged()
    {
        if (this.DropdownButton != null)
            this.DropdownButton.IsVisible = this.HTML.scrollWidth > this.HTML.offsetWidth;
    }
}
class XTabControlTab extends XDiv
{
    constructor(pOwner: XElement | HTMLElement | null)
    {
        super(pOwner, "XTabControlTab");
    }
    Button: XTabControlButton | null = null;
}

class XTabControlContainer extends XDiv
{
    constructor(pOwner: XElement | HTMLElement | null)
    {
        super(pOwner, "XTabControlContainer");
    }
}
class XTabControlDropdown extends XPopupElement
{
    constructor(pOwner: XElement | HTMLElement | null)
    {
        super(pOwner, "XTabControlDropdown");
    }
}

class XTabControlButtonList extends XBaseTextButton
{
    constructor(pOwner: XElement | HTMLElement | null)
    {
        super(pOwner, "XTabControlButtonList");
        this.IsVisible = false;
    }
}

class XTabControl extends XDiv
{
    constructor(pOwner: XElement | HTMLElement | null)
    {
        super(pOwner, "XTabControl");
        this.Header = new XTabControlHeader(this);
        this.Container = new XTabControlContainer(this);
        this.Dropdown = new XTabControlDropdown(this);
        XPopupManager.Add(this.Dropdown);
        this.Dropdown.IsVisible = true;
        this.ButtonList = new XTabControlButtonList(this);
        this.ButtonList.Title = "Abas";
        this.Header.DropdownButton = this.ButtonList;

        this.ButtonList.HTML.addEventListener('click', () =>
        {
            this.PopulateDropdown();
        });
        this.AddTab("X21");
        this.AddTab("X21 skjldjlksd");
        this.AddTab("X21 sdkljdflks");
        this.AddTab("X21");
        this.AddTab("X21 skjldjlksd");
        this.AddTab("X21 sdkljdflks");
        this.AddTab("X21");
        this.AddTab("X21 skjldjlksd");
        this.AddTab("X21 sdkljdflks");
        this.AddTab("X21");
        this.AddTab("X21 skjldjlksd");
        this.AddTab("X21 sdkljdflks");
        this.AddTab("X21");
        this.AddTab("X21 skjldjlksd");
        this.AddTab("X21 sdkljdflks");
        this.AddTab("X21");
        this.AddTab("X21 skjldjlksd");
        this.AddTab("X21 sdkljdflks");
        this.AddTab("X21");
        this.AddTab("X21 skjldjlksd");
        this.AddTab("X21 sdkljdflks");
        this.AddTab("X21");
        this.AddTab("X21 skjldjlksd");
        this.AddTab("X21 sdkljdflks");
        this.AddTab("X21");
        this.AddTab("X21 skjldjlksd");
        this.AddTab("X21 sdkljdflks");
    }
    Header: XTabControlHeader;
    Container: XTabControlContainer;
    Dropdown: XTabControlDropdown;
    ButtonList: XTabControlButtonList;
    ActiveTab: XTabControlTab | null = null;

    protected Tabs: XArray<XTabControlTab> = new XArray<XTabControlTab>();


    private PopulateDropdown()
    {
        this.Dropdown.HTML.innerHTML = '';
        this.Tabs.forEach((tab, index) =>
        {
            const item = new XTabControlButton(this.Dropdown);
            item.HTML.className = "XTabControlButtonL";
            if (tab.Button != null)
            {
                if (tab?.Button?.HTML.classList.contains('Active'))
                    item.HTML.classList.add('Active');
                item.TabControl = tab.Button.TabControl;
                item.Tab = tab.Button.Tab;
                item.Title = tab.Button?.Title;
            }

        });
        this.Dropdown.IsVisible = true;
        const orect = this.HTML.getBoundingClientRect();
        const rect = this.ButtonList.HTML.getBoundingClientRect();
        this.Dropdown.HTML.style.right = `${orect.width - rect.left - rect.width}px`;
        this.Dropdown.HTML.style.top = `${rect.bottom}px`;
    }


    SelectTab(pButton: XTabControlButton)
    {
        if (pButton == null)
            return;
        this.Tabs.ForEach(t =>
        {
            t.Button?.HTML.classList.remove('Active');
            t.Button?.Tab?.HTML.classList.remove('Active');
        });
        pButton?.Tab?.Button?.HTML.classList.add('Active');
        pButton.HTML.classList.add('Active');
        pButton.Tab?.HTML.classList.add('Active');
        this.Dropdown.IsVisible = false;
        this.ActiveTab = pButton.Tab;
    }

    AddTab(pTitle: string)
    {
        var btn = new XTabControlButton(this.Header);
        btn.Title = pTitle;
        btn.TabControl = this;
        var tab = new XTabControlTab(this.Container);
        tab.HTML.innerText = new Date().ToString();
        tab.Button = btn;
        btn.Tab = tab;
        this.Tabs.Add(tab);
        if (this.ActiveTab == null)
            this.SelectTab(<any>this.Tabs.FirstOrNull()?.Button);
    }
}

