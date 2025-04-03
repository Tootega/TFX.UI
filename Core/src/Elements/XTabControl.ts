﻿/// <reference path="Base/XBaseTextButton.ts" />
/// <reference path="Base/XPopupElement.ts" />
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

    SelectionChanged()
    {
        this.ValidateVisibility();
    }

    override SizeChanged()
    {
        if (this.DropdownButton != null)
            this.DropdownButton.IsVisible = this.HTML.scrollWidth > this.HTML.offsetWidth;
        this.ValidateVisibility();
    }

    private ValidateVisibility()
    {
        const painelRect = this.HTML.getBoundingClientRect();
        this.HTML.childNodes.forEach(item =>
        {
            var elm = <HTMLElement>item;
            const rect = elm.getBoundingClientRect();

            if (rect.left < painelRect.left || rect.right > painelRect.right)
                elm.style.visibility = 'hidden';

            else
                elm.style.visibility = 'visible';
        });
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
        this.HTML.addEventListener('wheel', function (event)
        {
            const { deltaY } = event;
            const { scrollTop, scrollHeight, clientHeight } = this;

            if ((deltaY > 0 && (scrollTop + clientHeight >= scrollHeight)) || (deltaY < 0 && scrollTop <= 0))
                event.preventDefault();
        });
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
        this.AddTab("Aninha");
        this.AddTab("Maria");
        //this.AddTab("Joana");
        //this.AddTab("Rebeca");
        //this.AddTab("Antonieta");
        //this.AddTab("Valentina");
        //this.AddTab("Amanda");
        //this.AddTab("Jaqueline");
        //this.AddTab("Helena");
        //this.AddTab("Fernanda");
        //this.AddTab("Sonia");
        //this.AddTab("Larissa");
        //this.AddTab("Eleonora");
        //this.AddTab("Sara");
        //this.AddTab("Sebastina");
        //this.AddTab("Sabrina");
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
    }


    SelectTab(pButton: XTabControlButton)
    {
        if (pButton == null)
            return;
        this.Tabs.ForEach(t =>
        {
            if (t.Button != null && t.Button.Tab != null)
            {
                t.Button?.HTML.classList.remove('Active');
                t.Button.Tab.IsVisible = false;
            }
        });
        if (pButton != null && pButton.Tab != null && pButton.Tab.Button != null)
        {
            pButton.Tab.Button.HTML.classList.add('Active');
            pButton.HTML.classList.add('Active');
            pButton.Tab.IsVisible = true;
        }
        var rbtn = pButton?.Tab?.Button?.HTML.getBoundingClientRect();
        var rctn = this.Header.HTML.getBoundingClientRect();
        var offw = (<HTMLElement>pButton?.Tab?.Button?.HTML?.previousElementSibling)?.offsetWidth ?? 0;
        if (rbtn != null)
        {
            if (rbtn.left < rctn.left)
                this.Header.HTML.scrollLeft -= (rctn.left - rbtn.left) + offw;
            else
                if (rbtn.right > rctn.right)
                    this.Header.HTML.scrollLeft += (rbtn.right - rctn.right) + offw;
        }
        this.Dropdown.IsVisible = false;
        this.ActiveTab = pButton.Tab;
        this.Header.SelectionChanged();
    }

    AddTab(pTitle: string)
    {
        var btn = new XTabControlButton(this.Header);
        btn.Title = pTitle;
        btn.TabControl = this;
        var tab = this.CreateTab();
        tab.Button = btn;
        btn.Tab = tab;
        this.Tabs.Add(tab);
        tab.IsVisible = false;
        if (this.ActiveTab == null)
            this.SelectTab(<any>this.Tabs.FirstOrNull()?.Button);
    }

    CreateTab(): XTabControlTab
    {
        return new XTabControlTab(this.Container);;
    }
}

