class DateEditor
{
    private container: HTMLElement;
    private input: HTMLInputElement;
    private calendarPopup: HTMLElement;
    private currentViewDate: Date;
    private selectedDate: Date | null = null;
    private currentPanel: 'days' | 'months' | 'years' = 'days';

    constructor(containerId: string)
    {
        this.container = document.getElementById(containerId)!;
        this.currentViewDate = new Date();
        this.init();
    }

    private init()
    {
        // Criar input e botão
        this.input = document.createElement('input');
        this.input.placeholder = 'dd/mm/aaaa';
        this.input.addEventListener('input', this.handleInput.bind(this));
        this.input.addEventListener('blur', this.validateDate.bind(this));

        const button = document.createElement('button');
        button.innerHTML = '📅';
        button.addEventListener('click', this.toggleCalendar.bind(this));

        // Popup do calendário
        this.calendarPopup = document.createElement('div');
        this.calendarPopup.className = 'calendar-popup hidden';

        this.container.append(this.input, button, this.calendarPopup);
        this.updateCalendar();
    }

    private handleInput(e: Event)
    {
        const value = (e.target as HTMLInputElement).value.replace(/\D/g, '');
        let formatted = '';

        if (value.length > 2) formatted = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
        else if (value.length > 4) formatted = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
        else if (value.length > 2) formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
        else formatted = value;

        this.input.value = formatted;
    }

    private validateDate()
    {
        const [d, m, y] = this.input.value.split('/');
        const date = new Date(`${y}-${m}-${d}`);
        if (isNaN(date.getTime()))
        {
            this.input.classList.add('error');
        } else
        {
            this.selectedDate = date;
            this.input.classList.remove('error');
        }
    }

    private toggleCalendar()
    {
        this.calendarPopup.classList.toggle('hidden');
        this.updateCalendar();
    }

    private updateCalendar()
    {
        this.calendarPopup.innerHTML = '';
        this.calendarPopup.appendChild(this.createHeader());
        this.calendarPopup.appendChild(this.createContent());
    }

    private createHeader(): HTMLElement
    {
        const header = document.createElement('div');
        header.className = 'calendar-header';

        const prevButton = document.createElement('button');
        prevButton.innerHTML = '◀';
        prevButton.addEventListener('click', () => this.navigate(-1));

        const nextButton = document.createElement('button');
        nextButton.innerHTML = '▶';
        nextButton.addEventListener('click', () => this.navigate(1));

        const title = document.createElement('button');
        title.className = 'calendar-title';
        title.addEventListener('click', () =>
        {
            this.currentPanel = this.currentPanel === 'days' ? 'months' : 'years';
            this.updateCalendar();
        });

        // Atualizar título conforme o painel atual
        if (this.currentPanel === 'days')
        {
            title.textContent = this.currentViewDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        } else if (this.currentPanel === 'months')
        {
            title.textContent = this.currentViewDate.getFullYear().toString();
        } else
        {
            const year = this.currentViewDate.getFullYear();
            title.textContent = `${year - 6} - ${year + 9}`;
        }

        header.append(prevButton, title, nextButton);
        return header;
    }

    private navigate(direction: number)
    {
        if (this.currentPanel === 'days')
        {
            this.currentViewDate.setMonth(this.currentViewDate.getMonth() + direction);
        } else if (this.currentPanel === 'months')
        {
            this.currentViewDate.setFullYear(this.currentViewDate.getFullYear() + direction);
        } else
        {
            this.currentViewDate.setFullYear(this.currentViewDate.getFullYear() + (direction * 16));
        }
        this.updateCalendar();
    }

    private createContent(): HTMLElement
    {
        const content = document.createElement('div');
        content.className = 'calendar-content';

        if (this.currentPanel === 'days')
        {
            content.appendChild(this.createDaysGrid());
        } else if (this.currentPanel === 'months')
        {
            content.appendChild(this.createMonthsGrid());
        } else
        {
            content.appendChild(this.createYearsGrid());
        }

        return content;
    }

    private createDaysGrid(): HTMLElement
    {
        const grid = document.createElement('div');
        grid.className = 'days-grid';

        // Dias da semana
        ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach((day, i) =>
        {
            const cell = document.createElement('div');
            cell.textContent = day;
            cell.className = `day-header ${i === 0 ? 'sunday' : ''} ${i === 6 ? 'saturday' : ''}`;
            grid.appendChild(cell);
        });

        // Dias do mês
        const firstDay = new Date(this.currentViewDate.getFullYear(), this.currentViewDate.getMonth(), 1);
        const lastDay = new Date(this.currentViewDate.getFullYear(), this.currentViewDate.getMonth() + 1, 0);

        let date = new Date(firstDay);
        date.setDate(date.getDate() - firstDay.getDay());

        for (let i = 0; i < 42; i++)
        {
            const cell = document.createElement('div');
            cell.className = 'day-cell';

            const isCurrentMonth = date.getMonth() === this.currentViewDate.getMonth();
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = this.selectedDate && date.toDateString() === this.selectedDate.toDateString();

            if (!isCurrentMonth) cell.classList.add('faded');
            if (isToday) cell.classList.add('current');
            if (isSelected) cell.classList.add('selected');

            cell.textContent = date.getDate().toString();
            cell.addEventListener('click', () => this.selectDate(new Date(date)));

            if (date.getDay() === 0) cell.classList.add('sunday');
            if (date.getDay() === 6) cell.classList.add('saturday');

            grid.appendChild(cell);
            date.setDate(date.getDate() + 1);
        }

        return grid;
    }

    private selectDate(date: Date)
    {
        this.selectedDate = date;
        this.input.value = date.toLocaleDateString('pt-BR');
        this.currentViewDate = new Date(date);
        this.updateCalendar();
    }

    private createMonthsGrid(): HTMLElement
    {
        const grid = document.createElement('div');
        grid.className = 'months-grid';

        for (let month = 0; month < 12; month++)
        {
            const cell = document.createElement('div');
            cell.className = 'month-cell';
            cell.textContent = new Date(this.currentViewDate.getFullYear(), month).toLocaleDateString('pt-BR', { month: 'short' });

            if (month === new Date().getMonth() && this.currentViewDate.getFullYear() === new Date().getFullYear())
            {
                cell.classList.add('current');
            }

            cell.addEventListener('click', () =>
            {
                this.currentViewDate.setMonth(month);
                this.currentPanel = 'days';
                this.updateCalendar();
            });

            grid.appendChild(cell);
        }

        return grid;
    }

    private createYearsGrid(): HTMLElement
    {
        const grid = document.createElement('div');
        grid.className = 'years-grid';

        const currentYear = this.currentViewDate.getFullYear();
        const startYear = currentYear - (currentYear % 16) - 1;

        for (let year = startYear; year < startYear + 16; year++)
        {
            const cell = document.createElement('div');
            cell.className = 'year-cell';
            cell.textContent = year.toString();

            const isCurrentDecade = year >= (startYear + 1) && year <= (startYear + 10);
            if (!isCurrentDecade) cell.classList.add('faded');
            if (year === new Date().getFullYear()) cell.classList.add('current');

            cell.addEventListener('click', () =>
            {
                this.currentViewDate.setFullYear(year);
                this.currentPanel = 'months';
                this.updateCalendar();
            });

            grid.appendChild(cell);
        }

        return grid;
    }
}

// CSS necessário
const style = document.createElement('style');
style.textContent = `
  .calendar-popup {
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    padding: 10px;
    width: 300px;
  }

  .hidden { display: none; }

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .days-grid, .months-grid, .years-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }

  .months-grid { grid-template-columns: repeat(4, 1fr); }
  .years-grid { grid-template-columns: repeat(4, 1fr); }

  .day-cell, .month-cell, .year-cell {
    padding: 5px;
    text-align: center;
    cursor: pointer;
  }

  .day-cell:hover, .month-cell:hover, .year-cell:hover {
    background: #eee;
  }

  .faded { color: #999; }
  .current { color: blue; }
  .selected { background: #90EE90; }
  .sunday { color: red; }
  .saturday { color: blue; }
  .day-header { color: blue; font-weight: bold; }
  .error { border-color: red; }
`;
