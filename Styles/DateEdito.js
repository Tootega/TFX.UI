"use strict";
class DateEditor {
    constructor(containerId) {
        this._CselectedDate = null;
        this._CurrentPanel = 'days';
        this._Container = document.getElementById(containerId);
        this._CurrentViewDate = new Date();
        // Criar input e botão
        this._Input = document.createElement('input');
        this._Input.placeholder = 'dd/mm/aaaa';
        this._Input.addEventListener('input', this.handleInput.bind(this));
        this._Input.addEventListener('blur', this.validateDate.bind(this));
        const button = document.createElement('button');
        button.innerHTML = '📅';
        button.addEventListener('click', this.toggleCalendar.bind(this));
        // Popup do calendário
        this._CalendarPopup = document.createElement('div');
        this._CalendarPopup.className = 'calendar-popup hidden';
        this._Container.append(this._Input, button, this._CalendarPopup);
        this.updateCalendar();
    }
    handleInput(e) {
        const value = e.target.value.replace(/\D/g, '');
        let formatted = '';
        if (value.length > 2)
            formatted = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
        else if (value.length > 4)
            formatted = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
        else if (value.length > 2)
            formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
        else
            formatted = value;
        this._Input.value = formatted;
    }
    validateDate() {
        const [d, m, y] = this._Input.value.split('/');
        const date = new Date(`${y}-${m}-${d}`);
        if (isNaN(date.getTime())) {
            this._Input.classList.add('error');
        }
        else {
            this._CselectedDate = date;
            this._Input.classList.remove('error');
        }
    }
    toggleCalendar() {
        this._CalendarPopup.classList.toggle('hidden');
        this.updateCalendar();
    }
    updateCalendar() {
        this._CalendarPopup.innerHTML = '';
        this._CalendarPopup.appendChild(this.createHeader());
        this._CalendarPopup.appendChild(this.createContent());
    }
    createHeader() {
        const header = document.createElement('div');
        header.className = 'calendar-header';
        const prevButton = document.createElement('div');
        prevButton.className = "arrow";
        prevButton.innerHTML = '◀';
        prevButton.addEventListener('click', () => this.navigate(-1));
        const nextButton = document.createElement('div');
        nextButton.className = "arrow";
        nextButton.innerHTML = '▶';
        nextButton.addEventListener('click', () => this.navigate(1));
        const title = document.createElement('div');
        title.className = 'calendar-title';
        title.addEventListener('click', () => {
            this._CurrentPanel = this._CurrentPanel === 'days' ? 'months' : 'years';
            this.updateCalendar();
        });
        // Atualizar título conforme o painel atual
        if (this._CurrentPanel === 'days') {
            title.textContent = this._CurrentViewDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        }
        else if (this._CurrentPanel === 'months') {
            title.textContent = this._CurrentViewDate.getFullYear().toString();
        }
        else {
            const year = this._CurrentViewDate.getFullYear();
            title.textContent = `${year - 6} - ${year + 9}`;
        }
        header.append(prevButton, title, nextButton);
        return header;
    }
    navigate(direction) {
        if (this._CurrentPanel === 'days') {
            this._CurrentViewDate.setMonth(this._CurrentViewDate.getMonth() + direction);
        }
        else if (this._CurrentPanel === 'months') {
            this._CurrentViewDate.setFullYear(this._CurrentViewDate.getFullYear() + direction);
        }
        else {
            this._CurrentViewDate.setFullYear(this._CurrentViewDate.getFullYear() + (direction * 16));
        }
        this.updateCalendar();
    }
    createContent() {
        const content = document.createElement('div');
        content.className = 'calendar-content';
        if (this._CurrentPanel === 'days') {
            content.appendChild(this.createDaysGrid());
        }
        else if (this._CurrentPanel === 'months') {
            content.appendChild(this.createMonthsGrid());
        }
        else {
            content.appendChild(this.createYearsGrid());
        }
        return content;
    }
    createDaysGrid() {
        const grid = document.createElement('div');
        grid.className = 'days-grid';
        // Dias da semana
        ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach((day, i) => {
            const cell = document.createElement('div');
            cell.textContent = day;
            cell.className = `day-header ${i === 0 ? 'sunday' : ''} ${i === 6 ? 'saturday' : ''}`;
            grid.appendChild(cell);
        });
        // Dias do mês
        const firstDay = new Date(this._CurrentViewDate.getFullYear(), this._CurrentViewDate.getMonth(), 1);
        const lastDay = new Date(this._CurrentViewDate.getFullYear(), this._CurrentViewDate.getMonth() + 1, 0);
        let date = new Date(firstDay);
        date.setDate(date.getDate() - firstDay.getDay());
        for (let i = 0; i < 42; i++) {
            const cell = document.createElement('div');
            cell.className = 'day-cell';
            const isCurrentMonth = date.getMonth() === this._CurrentViewDate.getMonth();
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = this._CselectedDate && date.toDateString() === this._CselectedDate.toDateString();
            if (!isCurrentMonth)
                cell.classList.add('faded');
            if (isToday)
                cell.classList.add('current');
            if (isSelected)
                cell.classList.add('selected');
            cell.textContent = date.getDate().toString();
            let dt = new Date(date);
            cell.addEventListener('click', () => this.selectDate(dt));
            if (date.getDay() === 0)
                cell.classList.add('sunday');
            if (date.getDay() === 6)
                cell.classList.add('saturday');
            grid.appendChild(cell);
            date.setDate(date.getDate() + 1);
        }
        return grid;
    }
    selectDate(date) {
        this._CselectedDate = date;
        this._Input.value = date.toLocaleDateString('pt-BR');
        this._CurrentViewDate = new Date(date);
        this._CalendarPopup.className = 'calendar-popup hidden';
    }
    createMonthsGrid() {
        const grid = document.createElement('div');
        grid.className = 'months-grid';
        for (let month = 0; month < 12; month++) {
            const cell = document.createElement('div');
            cell.className = 'month-cell';
            cell.textContent = new Date(this._CurrentViewDate.getFullYear(), month).toLocaleDateString('pt-BR', { month: 'short' });
            if (month === new Date().getMonth() && this._CurrentViewDate.getFullYear() === new Date().getFullYear()) {
                cell.classList.add('current');
            }
            cell.addEventListener('click', () => {
                this._CurrentViewDate.setMonth(month);
                this._CurrentPanel = 'days';
                this.updateCalendar();
            });
            grid.appendChild(cell);
        }
        return grid;
    }
    createYearsGrid() {
        const grid = document.createElement('div');
        grid.className = 'years-grid';
        const currentYear = this._CurrentViewDate.getFullYear();
        const startYear = currentYear - (currentYear % 16) - 1;
        for (let year = startYear; year < startYear + 16; year++) {
            const cell = document.createElement('div');
            cell.className = 'year-cell';
            cell.textContent = year.toString();
            const isCurrentDecade = year >= (startYear + 1) && year <= (startYear + 10);
            if (!isCurrentDecade)
                cell.classList.add('faded');
            if (year === new Date().getFullYear())
                cell.classList.add('current');
            cell.addEventListener('click', () => {
                this._CurrentViewDate.setFullYear(year);
                this._CurrentPanel = 'months';
                this.updateCalendar();
            });
            grid.appendChild(cell);
        }
        return grid;
    }
}
//# sourceMappingURL=DateEdito.js.map