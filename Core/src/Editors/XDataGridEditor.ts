/// <reference path="../Elements/Base/XBaseInput.ts" />
interface ColumnConfig
{
    field: string;
    visible: boolean;
    width: number;
}
class XDataGridEditor extends XBaseInput
{
    data: any = [];


    constructor(pOwner: XElement | HTMLElement | null)
    {
        super(pOwner);
        for (let i = 0; i < 1000; i++)
        {
            const row: any = {
                id: i,
                nome: `Nome ${i}`,
                email: `email${i}@exemplo.com`,
                cidade: `Cidade ${i % 100}`,
                idade: 20 + (i % 50),
                telefone: `(11) 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
                empresa: `Empresa ${i % 20}`,
                cargo: `Cargo ${i % 10}`,
                salario: 2000 + (i % 50) * 100,
                dataAdmissao: `${(i % 28 + 1).toString().LPad(2, '0')}/01/2023`,
                status: i % 4 === 0 ? 'Ativo' : 'Inativo'
            };
            this.data.push(row);
        }
        this.Title = "Grade de dados";
        var div = new XDiv(this, "XDataGridEditor");
        this.container = div.HTML;
        this.Input = <any>this.container ;
        this.dataset = this.data;
        const fields = Object.keys(this.dataset[0] || {});
        this.columns = fields.map(field => ({ field, visible: true, width: 120 }));
        this.render();
        this.addColumnVisibilityToggle();
    }

    private container: HTMLElement;
    private dataset: any[];
    private columns: ColumnConfig[];
    private sortState: { field: string; direction: 'asc' | 'desc' } | null = null;
    private rowNumberColumn: ColumnConfig = { field: '#', visible: true, width: 50 };

    override CreateInput(): HTMLInputElement 
    {
        return <any>null;
    }

    private render()
    {
        this.container.innerHTML = '';
        const table = document.createElement('table');
        table.style.minWidth = `${this.columns.reduce((acc, col) => acc + (col.visible ? col.width : 0), this.rowNumberColumn.width)}px`;
        this.buildHeader(table);
        this.buildBody(table);
        this.container.appendChild(table);
    }

    private buildHeader(table: HTMLTableElement)
    {
        const thead = document.createElement('thead');
        //thead.style.position = 'sticky';
        //thead.style.top = '0';
        //thead.style.zIndex = '2';
        const headerRow = document.createElement('tr');

        // Coluna de número sequencial
        const rowNumberTh = this.createHeaderTh(this.rowNumberColumn);
        headerRow.appendChild(rowNumberTh);

        // Colunas do dataset
        this.columns.filter(c => c.visible).forEach(colConfig =>
        {
            const th = this.createHeaderTh(colConfig);
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);
    }

    private createHeaderTh(colConfig: ColumnConfig): HTMLTableCellElement
    {
        const th = document.createElement('th');
        th.textContent = colConfig.field;
        th.style.width = `${colConfig.width}px`;

        if (colConfig.field !== '#')
        {
            th.draggable = true;
            th.addEventListener('dragstart', (e) => this.handleDragStart(e, colConfig));
            th.addEventListener('dragover', (e) => this.handleDragOver(e, colConfig));

            // Indicador de ordenação
            if (this.sortState?.field === colConfig.field)
            {
                th.textContent += this.sortState.direction === 'asc' ? ' ▲' : ' ▼';
            }
        }

        // Redimensionador
        const resizer = document.createElement('div');
        resizer.className = 'resizer';
        th.appendChild(resizer);
        this.addResizerEvents(th, resizer, colConfig);

        // Clique para ordenar
        if (colConfig.field !== '#')
        {
            th.addEventListener('click', () => this.sortData(colConfig.field));
        }

        return th;
    }

    private addResizerEvents(th: HTMLTableCellElement, resizer: HTMLDivElement, colConfig: ColumnConfig)
    {
        let isResizing = false;
        let startX = 0;
        let startWidth = 0;

        resizer.addEventListener('mousedown', (e) =>
        {
            isResizing = true;
            startX = e.clientX;
            startWidth = th.offsetWidth;
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', () =>
            {
                isResizing = false;
                document.removeEventListener('mousemove', handleMouseMove);
            });
        });

        const handleMouseMove = (e: MouseEvent) =>
        {
            if (!isResizing) return;
            const newWidth = startWidth + (e.clientX - startX);
            th.style.width = `${newWidth}px`;
            colConfig.width = newWidth;
            document.querySelectorAll(`td[data-field="${colConfig.field}"]`).forEach(td =>
            {
                (<any>td).style.width = `${newWidth}px`;
            });
        };
    }

    private handleDragStart(e: DragEvent, colConfig: ColumnConfig)
    {
        (<any>e).dataTransfer.setData('text/plain', colConfig.field);
    }

    private handleDragOver(e: DragEvent, targetColConfig: ColumnConfig)
    {
        e.preventDefault();
        const draggedField = (<any>e).dataTransfer.getData('text/plain');
        const draggedIndex = this.columns.findIndex(c => c.field === draggedField);
        const targetIndex = this.columns.findIndex(c => c.field === targetColConfig.field);

        if (draggedIndex === -1 || targetIndex === -1) return;

        const temp = this.columns[draggedIndex];
        this.columns[draggedIndex] = this.columns[targetIndex];
        this.columns[targetIndex] = temp;

        this.render();
    }

    private sortData(field: string)
    {
        if (this.sortState?.field === field)
        {
            this.sortState.direction = this.sortState.direction === 'asc' ? 'desc' : 'asc';
        } else
        {
            this.sortState = { field, direction: 'asc' };
        }
        var self = this.sortState;
        this.dataset.sort((a, b) =>
        {
            var e: any = this;
            if (a[field] > b[field])
                return e.sortState.direction === 'asc' ? 1 : -1;
            if (a[field] < b[field])
                return e.sortState.direction === 'asc' ? -1 : 1;
            return 0;
        });

        this.render();
    }

    private addColumnVisibilityToggle()
    {
        const button = document.createElement('button');
        button.className = 'menu-button';
        button.textContent = '☰';

        const menu = document.createElement('div');
        menu.className = 'column-menu';

        this.columns.forEach(col =>
        {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = col.visible;
            checkbox.addEventListener('change', () =>
            {
                col.visible = checkbox.checked;
                this.render();
            });
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(col.field));
            menu.appendChild(label);
        });

        button.addEventListener('click', () =>
        {
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });

        this.HTML.appendChild(button);
        this.HTML.appendChild(menu);
    }

    private buildBody(table: HTMLTableElement)
    {
        const tbody = document.createElement('tbody');
        this.dataset.forEach((rowData, index) =>
        {
            const tr = document.createElement('tr');

            // Número sequencial
            const tdNumber = document.createElement('td');
            tdNumber.textContent = (index + 1).toString();
            tr.appendChild(tdNumber);

            // Dados
            this.columns.filter(c => c.visible).forEach(colConfig =>
            {
                const td = document.createElement('td');
                td.dataset.field = colConfig.field;
                td.textContent = rowData[colConfig.field];
                td.style.width = `${colConfig.width}px`;
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
    }
}
