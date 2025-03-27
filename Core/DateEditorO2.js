"use strict";
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
//# sourceMappingURL=DateEditorO2.js.map