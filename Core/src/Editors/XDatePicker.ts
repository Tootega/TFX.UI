class XDatePicker extends XBaseButtonInput
{
    constructor(pOwner: XElement | HTMLElement | null, pClass: string | null)
    {
        super(pOwner, pClass);
        this.Calendar = new XCalendar(pOwner);
        this.Calendar.IsVisible = false;
        this.Calendar.ReferenceElement = this;
        XPopupManager.Add(this.Calendar);
    }
    Calendar: XCalendar;

    override OnClick(pArg: KeyboardEvent)
    {
        this.Calendar.BindTo(this);
        this.Calendar.Show();
        //this.ToggleCalendar.bind(this)
    }

    private ToggleCalendar()
    {
        this.Calendar.Show();
        this.Calendar.UpdateCalendar();
    }
}