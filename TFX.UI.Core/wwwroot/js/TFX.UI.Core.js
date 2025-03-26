"use strict";
class Launcher {
    static Run() {
        new DateEditor("app");
    }
}
class DateEditorO2 {
    constructor(containerId) {
        this.currentDate = new Date();
        const container = document.getElementById(containerId) || document.body;
        // Criar estrutura principal
        this.wrapper = this.createWrapper();
        this.input = this.createInput();
        this.calendar = this.createCalendar();
        // Montar componentes
        this.wrapper.appendChild(this.input);
        this.wrapper.appendChild(this.createButton());
        this.wrapper.appendChild(this.calendar);
        container.appendChild(this.wrapper);
        // Configurar eventos
        this.setupEvents();
    }
    createWrapper() {
        const wrapper = document.createElement('div');
        wrapper.className = 'date-editor-wrapper';
        return wrapper;
    }
    createInput() {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'DD/MM/YYYY';
        input.className = 'date-input';
        return input;
    }
    createButton() {
        const button = document.createElement('button');
        button.className = 'calendar-button';
        button.innerHTML = '📅';
        return button;
    }
    createCalendar() {
        const calendar = document.createElement('div');
        calendar.className = 'calendar hidden';
        calendar.innerHTML = `
            <div class="calendar-header">
                <button class="nav-button prev">◀</button>
                <span class="month-year"></span>
                <button class="nav-button next">▶</button>
            </div>
            <div class="calendar-grid"></div>
        `;
        return calendar;
    }
    setupEvents() {
        var _a, _b, _c;
        // Eventos de input
        this.input.addEventListener('input', this.applyMask.bind(this));
        this.input.addEventListener('blur', this.validateDate.bind(this));
        // Eventos do calendário
        (_a = this.wrapper.querySelector('.calendar-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleCalendar();
        });
        (_b = this.calendar.querySelector('.prev')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => this.changeMonth(-1));
        (_c = this.calendar.querySelector('.next')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => this.changeMonth(1));
        document.addEventListener('click', () => this.hideCalendar());
    }
    applyMask(e) {
        const input = e.target;
        let value = input.value.replace(/\D/g, '');
        if (value.length > 8)
            value = value.slice(0, 8);
        value = value.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
        input.value = value;
    }
    validateDate() {
        const [day, month, year] = this.input.value.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        const isValid = !!this.input.value.match(/^\d{2}\/\d{2}\/\d{4}$/) &&
            date.getDate() === day &&
            date.getMonth() === month - 1;
        this.input.classList.toggle('invalid', !isValid);
    }
    toggleCalendar() {
        this.calendar.classList.toggle('hidden');
        if (!this.calendar.classList.contains('hidden')) {
            this.updateCalendar();
            this.positionCalendar();
        }
    }
    positionCalendar() {
        const inputRect = this.input.getBoundingClientRect();
        const calendarHeight = this.calendar.offsetHeight;
        const spaceBelow = window.innerHeight - inputRect.bottom;
        if (spaceBelow < calendarHeight + 50) { // Margem de segurança
            this.calendar.style.bottom = 'calc(100% + 5px)';
            this.calendar.style.top = 'auto';
        }
        else {
            this.calendar.style.top = 'calc(100% + 5px)';
            this.calendar.style.bottom = 'auto';
        }
    }
    hideCalendar() {
        this.calendar.classList.add('hidden');
    }
    changeMonth(offset) {
        this.currentDate.setMonth(this.currentDate.getMonth() + offset);
        this.updateCalendar();
    }
    updateCalendar() {
        const monthYear = this.calendar.querySelector('.month-year');
        const daysGrid = this.calendar.querySelector('.calendar-grid');
        monthYear.textContent = new Intl.DateTimeFormat('pt-BR', {
            month: 'long',
            year: 'numeric'
        }).format(this.currentDate);
        daysGrid.innerHTML = '';
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const days = [];
        // Preencher dias do mês anterior
        for (let i = firstDay.getDay() - 1; i >= 0; i--) {
            days.push(new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() - i));
        }
        // Dias do mês atual
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i));
        }
        // Preencher dias do próximo mês
        while (days.length < 42) {
            days.push(new Date(lastDay.getFullYear(), lastDay.getMonth() + 1, days.length - lastDay.getDate() + 1));
        }
        days.forEach(date => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            if (date.getMonth() !== this.currentDate.getMonth()) {
                dayElement.classList.add('other-month');
            }
            if (date.toDateString() === new Date().toDateString()) {
                dayElement.classList.add('today');
            }
            dayElement.textContent = date.getDate().toString();
            dayElement.addEventListener('click', () => {
                this.input.value = date.toLocaleDateString('pt-BR');
                this.hideCalendar();
            });
            daysGrid.appendChild(dayElement);
        });
    }
}
class DateEditorO {
    constructor(container) {
        this.container = container;
        this.currentDate = null;
        this.currentView = 'days';
        this.viewDate = new Date();
        this.renderInput();
        this.renderPopup();
    }
    renderInput() {
        this.input = document.createElement('input');
        this.input.placeholder = 'dd/mm/yyyy';
        this.input.addEventListener('input', this.handleInput.bind(this));
        const button = document.createElement('button');
        button.textContent = '📅';
        button.addEventListener('click', () => this.togglePopup());
        const wrapper = document.createElement('div');
        wrapper.className = 'date-editor';
        wrapper.appendChild(this.input);
        wrapper.appendChild(button);
        this.container.appendChild(wrapper);
    }
    renderPopup() {
        this.popup = document.createElement('div');
        this.popup.className = 'calendar-popup hidden';
        this.container.appendChild(this.popup);
        this.updatePopup();
    }
    togglePopup() {
        this.popup.classList.toggle('hidden');
        this.updatePopup();
    }
    handleInput(e) {
        const input = e.target;
        const masked = this.applyMask(input.value);
        input.value = masked;
        this.validateDate(masked);
    }
    applyMask(value) {
        const cleaned = value.replace(/\D/g, '');
        let masked = '';
        if (cleaned.length > 2)
            masked = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
        else if (cleaned.length > 0)
            masked = `${cleaned.slice(0, 2)}`;
        return masked;
    }
    validateDate(value) {
        const [d, m, y] = value.split('/').map(Number);
        const date = y && m && d ? new Date(y, m - 1, d) : null;
        this.input.classList.toggle('error', !date);
        this.currentDate = date;
    }
    updatePopup() {
        this.popup.innerHTML = '';
        switch (this.currentView) {
            case 'days':
                this.renderDaysView();
                break;
            case 'months':
                this.renderMonthsView();
                break;
            case 'years':
                this.renderYearsView();
                break;
        }
    }
    renderDaysView() {
        const header = this.createHeader();
        const calendar = document.createElement('div');
        calendar.className = 'calendar-days';
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        days.forEach(d => calendar.appendChild(this.createCell(d, 'header')));
        const today = new Date();
        const [year, month] = [this.viewDate.getFullYear(), this.viewDate.getMonth()];
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        // Dias do mês anterior
        const prevMonthLastDate = new Date(year, month, 0).getDate();
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = prevMonthLastDate - i;
            const cell = this.createCell(day.toString(), 'faded prev-month');
            cell.addEventListener('click', () => this.navigateMonth(-1));
            calendar.appendChild(cell);
        }
        // Dias atuais
        for (let i = 1; i <= lastDate; i++) {
            const cell = this.createCell(i.toString());
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                cell.classList.add('current');
            }
            if (this.currentDate && i === this.currentDate.getDate() &&
                month === this.currentDate.getMonth() &&
                year === this.currentDate.getFullYear()) {
                cell.classList.add('selected');
            }
            cell.addEventListener('click', () => this.selectDate(new Date(year, month, i)));
            calendar.appendChild(cell);
        }
        // Dias do próximo mês
        const nextMonthDays = 42 - (firstDay + lastDate);
        for (let i = 1; i <= nextMonthDays; i++) {
            const cell = this.createCell(i.toString(), 'faded next-month');
            cell.addEventListener('click', () => this.navigateMonth(1));
            calendar.appendChild(cell);
        }
        this.popup.appendChild(header);
        this.popup.appendChild(calendar);
    }
    createHeader() {
        const header = document.createElement('div');
        header.className = 'calendar-header';
        const monthYear = document.createElement('div');
        monthYear.textContent = `${this.viewDate.toLocaleString('default', { month: 'long' })} ${this.viewDate.getFullYear()}`;
        monthYear.addEventListener('click', () => this.switchView('months'));
        header.appendChild(monthYear);
        return header;
    }
    navigateMonth(offset) {
        this.viewDate.setMonth(this.viewDate.getMonth() + offset);
        this.updatePopup();
    }
    selectDate(date) {
        this.currentDate = date;
        this.input.value = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        this.popup.classList.add('hidden');
    }
    switchView(view) {
        this.currentView = view;
        this.updatePopup();
    }
    createCell(content, ...classes) {
        const cell = document.createElement('div');
        cell.className = `calendar-cell ${classes.join(' ')}`;
        cell.textContent = content;
        return cell;
    }
    renderMonthsView() {
        const header = this.createYearHeader();
        const grid = document.createElement('div');
        grid.className = 'calendar-grid';
        const today = new Date();
        for (let m = 0; m < 12; m++) {
            const month = new Date(this.viewDate.getFullYear(), m).toLocaleString('default', { month: 'short' });
            const cell = this.createCell(month);
            if (m === today.getMonth() && this.viewDate.getFullYear() === today.getFullYear()) {
                cell.classList.add('current');
            }
            cell.addEventListener('click', () => {
                this.viewDate.setMonth(m);
                this.switchView('days');
            });
            grid.appendChild(cell);
        }
        this.popup.appendChild(header);
        this.popup.appendChild(grid);
    }
    renderYearsView() {
        const header = this.createDecadeHeader();
        const grid = document.createElement('div');
        grid.className = 'calendar-grid';
        const startYear = Math.floor((this.viewDate.getFullYear() - 1) / 10) * 10 + 1;
        const today = new Date();
        for (let y = startYear - 5; y < startYear + 11; y++) {
            const cell = this.createCell(y.toString());
            if (y === today.getFullYear())
                cell.classList.add('current');
            if (y < startYear || y >= startYear + 10)
                cell.classList.add('faded');
            cell.addEventListener('click', () => {
                this.viewDate.setFullYear(y);
                this.switchView('months');
            });
            grid.appendChild(cell);
        }
        this.popup.appendChild(header);
        this.popup.appendChild(grid);
    }
    createYearHeader() {
        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.textContent = this.viewDate.getFullYear().toString();
        header.addEventListener('click', () => this.switchView('years'));
        return header;
    }
    createDecadeHeader() {
        const header = document.createElement('div');
        header.className = 'calendar-header';
        const startYear = Math.floor((this.viewDate.getFullYear() - 1) / 10) * 10 + 1;
        header.textContent = `${startYear} - ${startYear + 9}`;
        return header;
    }
}
class DateEditor {
    constructor(containerId) {
        this.selectedDate = null;
        this.currentPanel = 'days';
        this.container = document.getElementById(containerId);
        this.currentViewDate = new Date();
        this.init();
    }
    init() {
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
        this.input.value = formatted;
    }
    validateDate() {
        const [d, m, y] = this.input.value.split('/');
        const date = new Date(`${y}-${m}-${d}`);
        if (isNaN(date.getTime())) {
            this.input.classList.add('error');
        }
        else {
            this.selectedDate = date;
            this.input.classList.remove('error');
        }
    }
    toggleCalendar() {
        this.calendarPopup.classList.toggle('hidden');
        this.updateCalendar();
    }
    updateCalendar() {
        this.calendarPopup.innerHTML = '';
        this.calendarPopup.appendChild(this.createHeader());
        this.calendarPopup.appendChild(this.createContent());
    }
    createHeader() {
        const header = document.createElement('div');
        header.className = 'calendar-header';
        const prevButton = document.createElement('div');
        prevButton.innerHTML = '◀';
        prevButton.addEventListener('click', () => this.navigate(-1));
        const nextButton = document.createElement('div');
        nextButton.innerHTML = '▶';
        nextButton.addEventListener('click', () => this.navigate(1));
        const title = document.createElement('div');
        title.className = 'calendar-title';
        title.addEventListener('click', () => {
            this.currentPanel = this.currentPanel === 'days' ? 'months' : 'years';
            this.updateCalendar();
        });
        // Atualizar título conforme o painel atual
        if (this.currentPanel === 'days') {
            title.textContent = this.currentViewDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        }
        else if (this.currentPanel === 'months') {
            title.textContent = this.currentViewDate.getFullYear().toString();
        }
        else {
            const year = this.currentViewDate.getFullYear();
            title.textContent = `${year - 6} - ${year + 9}`;
        }
        header.append(prevButton, title, nextButton);
        return header;
    }
    navigate(direction) {
        if (this.currentPanel === 'days') {
            this.currentViewDate.setMonth(this.currentViewDate.getMonth() + direction);
        }
        else if (this.currentPanel === 'months') {
            this.currentViewDate.setFullYear(this.currentViewDate.getFullYear() + direction);
        }
        else {
            this.currentViewDate.setFullYear(this.currentViewDate.getFullYear() + (direction * 16));
        }
        this.updateCalendar();
    }
    createContent() {
        const content = document.createElement('div');
        content.className = 'calendar-content';
        if (this.currentPanel === 'days') {
            content.appendChild(this.createDaysGrid());
        }
        else if (this.currentPanel === 'months') {
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
        const firstDay = new Date(this.currentViewDate.getFullYear(), this.currentViewDate.getMonth(), 1);
        const lastDay = new Date(this.currentViewDate.getFullYear(), this.currentViewDate.getMonth() + 1, 0);
        let date = new Date(firstDay);
        date.setDate(date.getDate() - firstDay.getDay());
        for (let i = 0; i < 42; i++) {
            const cell = document.createElement('div');
            cell.className = 'day-cell';
            const isCurrentMonth = date.getMonth() === this.currentViewDate.getMonth();
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = this.selectedDate && date.toDateString() === this.selectedDate.toDateString();
            if (!isCurrentMonth)
                cell.classList.add('faded');
            if (isToday)
                cell.classList.add('current');
            if (isSelected)
                cell.classList.add('selected');
            cell.textContent = date.getDate().toString();
            cell.addEventListener('click', () => this.selectDate(new Date(date)));
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
        this.selectedDate = date;
        this.input.value = date.toLocaleDateString('pt-BR');
        this.currentViewDate = new Date(date);
        this.updateCalendar();
    }
    createMonthsGrid() {
        const grid = document.createElement('div');
        grid.className = 'months-grid';
        for (let month = 0; month < 12; month++) {
            const cell = document.createElement('div');
            cell.className = 'month-cell';
            cell.textContent = new Date(this.currentViewDate.getFullYear(), month).toLocaleDateString('pt-BR', { month: 'short' });
            if (month === new Date().getMonth() && this.currentViewDate.getFullYear() === new Date().getFullYear()) {
                cell.classList.add('current');
            }
            cell.addEventListener('click', () => {
                this.currentViewDate.setMonth(month);
                this.currentPanel = 'days';
                this.updateCalendar();
            });
            grid.appendChild(cell);
        }
        return grid;
    }
    createYearsGrid() {
        const grid = document.createElement('div');
        grid.className = 'years-grid';
        const currentYear = this.currentViewDate.getFullYear();
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
                this.currentViewDate.setFullYear(year);
                this.currentPanel = 'months';
                this.updateCalendar();
            });
            grid.appendChild(cell);
        }
        return grid;
    }
}
//# sourceMappingURL=TFX.UI.Core.js.map