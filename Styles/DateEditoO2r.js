"use strict";
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
//# sourceMappingURL=DateEditoO2r.js.map