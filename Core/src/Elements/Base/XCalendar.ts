class XCalendar extends XElement
{
    constructor(pOwner: XElement | HTMLElement | null, pClass: string | null)
    {
        super(pOwner, pClass);
        this.Header = new XDiv(this.Container, "XCalendar-Header");
        this.LeftArrow = new XButton(this.Header, "XCalendarLeftArrow");
        this.CenterButton = new XButton(this.Header, "XCalendarCenterButton");
        this.RightArrow = new XButton(this.Header, "XCalendarRightArrow");

        this.DaysGrid = new XDiv(this, "XDaysGrid");

        this.MonthsGrid = new XDiv(this, "XMonthsGrid");
        this.MonthsGrid.Hide();

        this.YearsGrid = new XDiv(this, "XYearsGrid");
        this.YearsGrid.Hide();

        this.ViewDate = new Date();
        this.SelectedDate = new Date();
        this.UpdateCalendar();
        this.CenterButton.Container.addEventListener('click', () =>
        {
            this.CurrentPanel = this.CurrentPanel === 'days' ? 'months' : 'years';
            this.UpdateCalendar();
        });
        this.LeftArrow.Container.addEventListener('click', () => this.Navigate(-1));
        this.RightArrow.Container.addEventListener('click', () => this.Navigate(1));
    }

    protected Header: XDiv;
    protected LeftArrow: XButton;
    protected CenterButton: XButton;
    protected RightArrow: XButton;
    protected DaysGrid: XDiv;
    protected MonthsGrid: XDiv;
    protected YearsGrid: XDiv;
    private CurrentPanel: 'days' | 'months' | 'years' = 'days';
    private ViewDate: Date;
    private SelectedDate: Date;


    private ShowYears()
    {
        this.YearsGrid.Show();
        this.YearsGrid.Container.innerHTML = "";

        const currentYear = this.ViewDate.getFullYear();
        const startYear = currentYear - (currentYear % 16) - 1;

        for (let year = startYear; year < startYear + 16; year++)
        {
            const cell = document.createElement('div');
            cell.className = 'YearCell';
            cell.textContent = year.toString();

            const isCurrentDecade = year >= (startYear + 1) && year <= (startYear + 10);
            if (!isCurrentDecade) cell.classList.add('faded');
            if (year === new Date().getFullYear()) cell.classList.add('current');

            cell.addEventListener('click', () =>
            {
                this.ViewDate.setFullYear(year);
                this.CurrentPanel = 'months';
                this.UpdateCalendar();
            });

            this.YearsGrid.Container.appendChild(cell);
        }
    }

    private ShowMonths() 
    {
        this.MonthsGrid.Show();
        this.MonthsGrid.Container.innerHTML = "";
        for (let month = 0; month < 12; month++)
        {
            const cell = document.createElement('div');
            cell.className = 'MonthCell';
            cell.textContent = new Date(this.ViewDate.getFullYear(), month).toLocaleDateString('pt-BR', { month: 'long' });

            if (month === new Date().getMonth() && this.ViewDate.getFullYear() === new Date().getFullYear())
                cell.classList.add('Current');

            cell.addEventListener('click', () =>
            {
                this.ViewDate.setMonth(month);
                this.CurrentPanel = 'days';
                this.UpdateCalendar();
            });

            this.MonthsGrid.Container.appendChild(cell);
        }
    }

    private ShowDays()
    {
        this.DaysGrid.Show();
        this.DaysGrid.Container.innerHTML = '';
        ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach((day, i) =>
        {
            const cell = document.createElement('div');
            cell.textContent = day;
            cell.className = `Day-Header ${i === 0 ? 'Sunday' : ''} ${i === 6 ? 'Saturday' : ''}`;
            this.DaysGrid.Container.appendChild(cell);
        });

        // Dias do mês
        const firstDay = new Date(this.ViewDate.getFullYear(), this.ViewDate.getMonth(), 1);
        const lastDay = new Date(this.ViewDate.getFullYear(), this.ViewDate.getMonth() + 1, 0);

        let date = new Date(firstDay);
        date.setDate(date.getDate() - firstDay.getDay());

        for (let i = 0; i < 42; i++)
        {
            const cell = document.createElement('div');
            cell.className = 'DayCell';

            const isCurrentMonth = date.getMonth() === this.ViewDate.getMonth();
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = this.SelectedDate && date.toDateString() === this.SelectedDate.toDateString();

            if (!isCurrentMonth)
                cell.classList.add('Faded');
            if (isToday)
                cell.classList.add('Current');
            if (isSelected)
                cell.classList.add('Selected');

            cell.textContent = date.getDate().toString();
            let daydate = new Date(date);
            cell.addEventListener('click', () => this.SelectDate(daydate));

            if (date.getDay() === 0)
                cell.classList.add('Sunday');
            if (date.getDay() === 6)
                cell.classList.add('Saturday');

            this.DaysGrid.Container.appendChild(cell);
            date.setDate(date.getDate() + 1);
        }
    }

    private SelectDate(pDate: Date)
    {
        this.SelectedDate = pDate;
        this.ViewDate = new Date(pDate);
        this.UpdateCalendar();
    }

    private Navigate(pDirection: number)
    {
        switch (this.CurrentPanel)
        {
            case 'days':
                this.ViewDate.setMonth(this.ViewDate.getMonth() + pDirection);
                break;

            case 'months':
                this.ViewDate.setFullYear(this.ViewDate.getFullYear() + pDirection);
                break;

            default:
                this.ViewDate.setFullYear(this.ViewDate.getFullYear() + (pDirection * 16));
                break;
        }
        this.UpdateCalendar();
    }


    UpdateCalendar()
    {
        this.DaysGrid.Hide();
        this.MonthsGrid.Hide();
        this.YearsGrid.Hide();
        switch (this.CurrentPanel)
        {
            case 'days':
                this.ShowDays();
                this.CenterButton.SetContent(this.ViewDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }));
                break;

            case 'months':    
                this.ShowMonths();
                this.CenterButton.SetContent(this.ViewDate.getFullYear().toString());
                break;

            default:
                this.ShowYears();
                const year = this.ViewDate.getFullYear() - (this.ViewDate.getFullYear() % 16) - 1;
                this.CenterButton.SetContent(`${year} - ${year + 15}`);
                break;
        }

    }

    protected override CreateContainer(): HTMLElement
    {
        return XUtils.AddElement<HTMLElement>(null, "div", null);
    }

    protected override CreateElement(pClass: string | null = null): HTMLElement
    {
        return <HTMLElement>this.Container;
    }

}