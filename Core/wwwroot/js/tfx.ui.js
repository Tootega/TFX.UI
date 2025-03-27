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
class XColors {
    static get HighHue() {
        if (XColors._HighHue == null) {
            var hsl = XColors.Colors.Select(c => this.Convert(c)).Where(c => c.H > 0.3 && c.L < 0.7);
            XColors._HighHue = hsl.Select(c => c.RGB);
        }
        return XColors._HighHue;
    }
    static RColor() {
        let r = Math.floor(Math.random() * (this.Colors.length - 1));
        return this.Colors[r];
    }
    static Convert(pColor) {
        var rgb = XHSLColor.StringToRGB(pColor);
        return XHSLColor.RGBToHSL(rgb[0], rgb[1], rgb[2]);
    }
}
XColors.AliceBlue = "#F0F8FF";
XColors.AntiqueWhite = "#FAEBD7";
XColors.Aqua = "#00FFFF";
XColors.Aquamarine = "#7FFFD4";
XColors.Azure = "#F0FFFF";
XColors.Beige = "#F5F5DC";
XColors.Bisque = "#FFE4C4";
XColors.Black = "#000000";
XColors.BlanchedAlmond = "#FFEBCD";
XColors.Blue = "#0000FF";
XColors.BlueViolet = "#8A2BE2";
XColors.Brown = "#A52A2A";
XColors.Burlywood = "#DEB887";
XColors.CadetBlue = "#5F9EA0";
XColors.Chartreuse = "#7FFF00";
XColors.Chocolate = "#D2691E";
XColors.Coral = "#FF7F50";
XColors.CornflowerBlue = "#6495ED";
XColors.Cornsilk = "#FFF8DC";
XColors.Crimson = "#DC143C";
XColors.Cyan = "#00FFFF";
XColors.DarkBlue = "#00008B";
XColors.DarkCyan = "#008B8B";
XColors.DarkGoldenrod = "#B8860B";
XColors.DarkGray = "#A9A9A9";
XColors.DarkGreen = "#006400";
XColors.DarkKhaki = "#BDB76B";
XColors.DarkMagenta = "#8B008B";
XColors.DarkOliveGreen = "#556B2F";
XColors.DarkOrange = "#FF8C00";
XColors.DarkOrchid = "#9932CC";
XColors.DarkRed = "#8B0000";
XColors.DarkSalmon = "#E9967A";
XColors.DarkSeaGreen = "#8FBC8F";
XColors.DarkSlateBlue = "#483D8B";
XColors.DarkSlateGray = "#2F4F4F";
XColors.DarkTurquoise = "#00CED1";
XColors.DarkViolet = "#9400D3";
XColors.DeepPink = "#FF1493";
XColors.DeepSkyBlue = "#00BFFF";
XColors.DimGray = "#696969";
XColors.DodgerBlue = "#1E90FF";
XColors.Firebrick = "#B22222";
XColors.FloralWhite = "#FFFAF0";
XColors.ForestGreen = "#228B22";
XColors.Fuchsia = "#FF00FF";
XColors.Gainsboro = "#DCDCDC";
XColors.GhostWhite = "#F8F8FF";
XColors.Gold = "#FFD700";
XColors.Goldenrod = "#DAA520";
XColors.Gray = "#BEBEBE";
XColors.WebGray = "#808080";
XColors.Green = "#00FF00";
XColors.WebGreen = "#008000";
XColors.GreenYellow = "#ADFF2F";
XColors.Honeydew = "#F0FFF0";
XColors.HotPink = "#FF69B4";
XColors.IndianRed = "#CD5C5C";
XColors.Indigo = "#4B0082";
XColors.Ivory = "#FFFFF0";
XColors.Khaki = "#F0E68C";
XColors.Lavender = "#E6E6FA";
XColors.LavenderBlush = "#FFF0F5";
XColors.LawnGreen = "#7CFC00";
XColors.LemonChiffon = "#FFFACD";
XColors.LightBlue = "#ADD8E6";
XColors.LightCoral = "#F08080";
XColors.LightCyan = "#E0FFFF";
XColors.LightGoldenrod = "#FAFAD2";
XColors.LightGray = "#D3D3D3";
XColors.LightGreen = "#90EE90";
XColors.LightPink = "#FFB6C1";
XColors.LightSalmon = "#FFA07A";
XColors.LightSeaGreen = "#20B2AA";
XColors.LightSkyBlue = "#87CEFA";
XColors.LightSlateGray = "#778899";
XColors.LightSteelBlue = "#B0C4DE";
XColors.LightYellow = "#FFFFE0";
XColors.Lime = "#00FF00";
XColors.LimeGreen = "#32CD32";
XColors.Linen = "#FAF0E6";
XColors.Magenta = "#FF00FF";
XColors.Maroon = "#B03060";
XColors.WebMaroon = "#800000";
XColors.MediumAquamarine = "#66CDAA";
XColors.MediumBlue = "#0000CD";
XColors.MediumOrchid = "#BA55D3";
XColors.MediumPurple = "#9370DB";
XColors.MediumSeaGreen = "#3CB371";
XColors.MediumSlateBlue = "#7B68EE";
XColors.MediumSpringGreen = "#00FA9A";
XColors.MediumTurquoise = "#48D1CC";
XColors.MediumVioletRed = "#C71585";
XColors.MidnightBlue = "#191970";
XColors.MintCream = "#F5FFFA";
XColors.MistyRose = "#FFE4E1";
XColors.Moccasin = "#FFE4B5";
XColors.NavajoWhite = "#FFDEAD";
XColors.NavyBlue = "#000080";
XColors.OldLace = "#FDF5E6";
XColors.Olive = "#808000";
XColors.OliveDrab = "#6B8E23";
XColors.Orange = "#FFA500";
XColors.OrangeRed = "#FF4500";
XColors.Orchid = "#DA70D6";
XColors.PaleGoldenrod = "#EEE8AA";
XColors.PaleGreen = "#98FB98";
XColors.PaleTurquoise = "#AFEEEE";
XColors.PaleVioletRed = "#DB7093";
XColors.PapayaWhip = "#FFEFD5";
XColors.PeachPuff = "#FFDAB9";
XColors.Peru = "#CD853F";
XColors.Pink = "#FFC0CB";
XColors.Plum = "#DDA0DD";
XColors.PowderBlue = "#B0E0E6";
XColors.Purple = "#A020F0";
XColors.WebPurple = "#800080";
XColors.RebeccaPurple = "#663399";
XColors.Red = "#FF0000";
XColors.RosyBrown = "#BC8F8F";
XColors.RoyalBlue = "#4169E1";
XColors.SaddleBrown = "#8B4513";
XColors.Salmon = "#FA8072";
XColors.SandyBrown = "#F4A460";
XColors.SeaGreen = "#2E8B57";
XColors.Seashell = "#FFF5EE";
XColors.Sienna = "#A0522D";
XColors.Silver = "#C0C0C0";
XColors.SkyBlue = "#87CEEB";
XColors.SlateBlue = "#6A5ACD";
XColors.SlateGray = "#708090";
XColors.Snow = "#FFFAFA";
XColors.SpringGreen = "#00FF7F";
XColors.SteelBlue = "#4682B4";
XColors.Tan = "#D2B48C";
XColors.Teal = "#008080";
XColors.Thistle = "#D8BFD8";
XColors.Tomato = "#FF6347";
XColors.Turquoise = "#40E0D0";
XColors.Violet = "#EE82EE";
XColors.Wheat = "#F5DEB3";
XColors.White = "#FFFFFF";
XColors.WhiteSmoke = "#F5F5F5";
XColors.Yellow = "#FFFF00";
XColors.YellowGreen = "#9ACD32";
XColors.Colors = ["#0000FF", "#8A2BE2", "#A52A2A", "#DEB887", "#5F9EA0", "#7FFF00", "#D2691E",
    "#FF7F50", "#6495ED", "#FFF8DC", "#DC143C", "#00FFFF", "#00008B", "#008B8B", "#B8860B", "#A9A9A9", "#006400", "#BDB76B", "#8B008B", "#556B2F", "#FF8C00", "#9932CC", "#8B0000",
    "#E9967A", "#8FBC8F", "#483D8B", "#2F4F4F", "#00CED1", "#9400D3", "#FF1493", "#00BFFF", "#696969", "#1E90FF", "#B22222", "#FFFAF0", "#228B22", "#FF00FF", "#DCDCDC", "#F8F8FF",
    "#FFD700", "#DAA520", "#BEBEBE", "#808080", "#00FF00", "#008000", "#ADFF2F", "#F0FFF0", "#FF69B4", "#CD5C5C", "#4B0082", "#FFFFF0", "#F0E68C", "#E6E6FA", "#FFF0F5", "#7CFC00",
    "#FFFACD", "#ADD8E6", "#F08080", "#E0FFFF", "#FAFAD2", "#D3D3D3", "#90EE90", "#FFB6C1", "#FFA07A", "#20B2AA", "#87CEFA", "#778899", "#B0C4DE", "#FFFFE0", "#00FF00", "#32CD32",
    "#FAF0E6", "#FF00FF", "#B03060", "#800000", "#66CDAA", "#0000CD", "#BA55D3", "#9370DB", "#3CB371", "#7B68EE", "#00FA9A", "#48D1CC", "#C71585", "#191970", "#F5FFFA", "#FFE4E1",
    "#FFE4B5", "#FFDEAD", "#000080", "#FDF5E6", "#808000", "#6B8E23", "#FFA500", "#FF4500", "#DA70D6", "#EEE8AA", "#98FB98", "#AFEEEE", "#DB7093", "#FFEFD5", "#FFDAB9", "#CD853F",
    "#FFC0CB", "#DDA0DD", "#B0E0E6", "#A020F0", "#800080", "#663399", "#FF0000", "#BC8F8F", "#4169E1", "#8B4513", "#FA8072", "#F4A460", "#2E8B57", "#FFF5EE", "#A0522D", "#C0C0C0",
    "#87CEEB", "#6A5ACD", "#708090", "#FFFAFA", "#00FF7F", "#4682B4", "#D2B48C", "#008080", "#D8BFD8", "#FF6347", "#40E0D0", "#EE82EE", "#F5DEB3", "#FFFFFF", "#F5F5F5", "#FFFF00",
    "#9ACD32", "#F0F8FF", "#FAEBD7", "#00FFFF", "#7FFFD4", "#F0FFFF", "#F5F5DC", "#FFE4C4", "#000000", "#FFEBCD"];
XColors._HighHue = null;
class XLauncher {
    static Run() {
        this.Body = new XDiv(null, "MainDiv");
        let x = new XBaseInput(this.Body);
        new XBaseButtonInput(this.Body);
    }
}
class XElement {
    constructor(pOwner, pClass = null) {
        this.Owner = pOwner;
        this.Container = this.CreateContainer();
        this.Element = this.CreateElement(pClass !== null && pClass !== void 0 ? pClass : this.constructor.name);
    }
    CreateContainer() {
        throw new Error("Method not implemented.");
    }
    CreateElement(pClass = null) {
        throw new Error("Method not implemented.");
    }
}
class XDiv extends XElement {
    constructor(pOwner, pClass) {
        super(pOwner, pClass);
        if (pClass != null && this.Container != null)
            this.Container.className = pClass;
    }
    CreateContainer() {
        return XUtils.AddElement(null, "div", null);
    }
    CreateElement(pClass = null) {
        return this.Container;
    }
}
/// <reference path="XColors.ts" />
/// <reference path="Elements/Base/XElement.ts" />
/// <reference path="Elements/Base/XDiv.ts" />
/// <reference path="XDefault.ts" />
/// <reference path="XLauncher.ts" />
class XBaseButtonInput extends XBaseInput {
    constructor(pOwner, pClass = null) {
        super(pOwner, pClass);
    }
}
class XBaseInput extends XElement {
    constructor(pOwner, pClass = null) {
        super(pOwner, pClass);
        this.Container.className = "InputContainer";
    }
    CreateContainer() {
        return XUtils.AddElement(this.Owner, "div", null);
    }
    CreateElement(pClass = null) {
        return XUtils.AddElement(this.Container, "input", pClass);
    }
}
class XUtils {
    static AddElement(pOwner, pType, pClass, pInsert = false) {
        var own;
        if (pOwner == null)
            own = document.body;
        else if (pOwner instanceof HTMLElement)
            own = pOwner;
        else
            own = pOwner.Element;
        var elm = document.createElement(pType);
        if (pClass != null)
            elm.className = pClass;
        if (pInsert && own.childNodes.length > 0)
            own.insertBefore(elm, elm.childNodes[0]);
        else
            own.appendChild(elm);
        if (pOwner == null)
            elm.Owner = pOwner;
        else if (pOwner instanceof XElement)
            elm.Owner = pOwner;
        return elm;
    }
}
//# sourceMappingURL=tfx.ui.js.map