class TabControl
{

    constructor(container: HTMLElement)
    {
        this.container = container;
        this.injectStyles();
        this.createStructure();
    }

    private injectStyles()
    {
        if (TabControl.stylesInjected) return;

        const style = document.createElement('style');
        style.textContent = `
            .tab-buttons {
                display: flex;
                gap: 4px;
                margin-bottom: -1px;
            }

            .tab-button {
                padding: 8px 16px;
                border: 1px solid #ccc;
                background: #f0f0f0;
                cursor: pointer;
                border-radius: 4px 4px 0 0;
                transition: background 0.2s;
            }

            .tab-button:hover {
                background: #e0e0e0;
            }

            .tab-button.active {
                background: white;
                border-bottom-color: white;
            }

            .tab-content-container {
                border: 1px solid #ccc;
                padding: 16px;
                border-radius: 0 4px 4px 4px;
            }

            .tab-content {
                display: none;
            }

            .tab-content.active {
                display: block;
            }

            .tab-overflow-button {
                position: absolute;
                right: 0;
                top: 0;
                background: #f0f0f0;
                border: 1px solid #ccc;
                border-radius: 0 4px 0 0;
                padding: 8px 12px;
                cursor: pointer;
                z-index: 1;
            }

            .tab-dropdown {
                position: fixed;
                background: white;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                z-index: 1000;
                max-height: 300px;
                overflow-y: auto;
            }

            .tab-dropdown-item {
                padding: 8px 16px;
                cursor: pointer;
                white-space: nowrap;
            }

            .tab-dropdown-item:hover {
                background: #f0f0f0;
            }

            .tab-buttons {
                position: relative;
                padding-right: 40px; /* Espaço para o botão de overflow */
                overflow-x: hidden;
            }
        `;

        document.head.appendChild(style);
        TabControl.stylesInjected = true;
    }

    private createStructure()
    {
        this.container.innerHTML = '';

        this.buttonsContainer = document.createElement('div');
        this.buttonsContainer.className = 'tab-buttons';

        const contentContainer = document.createElement('div');
        contentContainer.className = 'tab-content-container';

        this.container.append(this.buttonsContainer, contentContainer);
        this.createOverflowElements();
        this.setupResizeObserver();
    }
    private container: HTMLElement;
    private tabs: { title: string; content: string; button: HTMLButtonElement; contentElement: HTMLDivElement }[] = [];
    private activeTabIndex: number = 0;
    private static stylesInjected = false;

    buttonsContainer: HTMLDivElement;
    private overflowButton: HTMLButtonElement;
    private dropdownContainer: HTMLDivElement;
    private resizeObserver: ResizeObserver;


    private createOverflowElements()
    {
        // Botão de overflow
        this.overflowButton = document.createElement('button');
        this.overflowButton.className = 'tab-overflow-button';
        this.overflowButton.innerHTML = '&#8943;';
        this.overflowButton.style.display = 'none';
        this.overflowButton.addEventListener('click', (e) => this.toggleDropdown(e));

        // Dropdown
        this.dropdownContainer = document.createElement('div');
        this.dropdownContainer.className = 'tab-dropdown';
        this.dropdownContainer.style.display = 'none';

        this.buttonsContainer.appendChild(this.overflowButton);
        this.container.appendChild(this.dropdownContainer);
    }

    private setupResizeObserver()
    {
        this.resizeObserver = new ResizeObserver(() => this.checkOverflow());
        this.resizeObserver.observe(this.buttonsContainer);
    }

    private checkOverflow()
    {
        const tabsWidth = Array.from(this.buttonsContainer.children)
            .slice(0, -1) // Exclui o botão de overflow
            .reduce((acc, child) => acc + child.clientWidth, 0);

        const containerWidth = this.buttonsContainer.clientWidth - this.overflowButton.clientWidth;

        this.overflowButton.style.display =
            tabsWidth > containerWidth ? 'block' : 'none';
    }

    private toggleDropdown(event: MouseEvent)
    {
        event.stopPropagation();
        const isVisible = this.dropdownContainer.style.display === 'block';

        this.dropdownContainer.style.display = isVisible ? 'none' : 'block';

        if (!isVisible)
        {
            this.updateDropdownPosition();
            this.populateDropdown();
            setTimeout(() => window.addEventListener('click', this.closeDropdown.bind(this)));
        }
    }

    private updateDropdownPosition()
    {
        const rect = this.overflowButton.getBoundingClientRect();
        this.dropdownContainer.style.left = `${rect.left - rect.width}px`;
        this.dropdownContainer.style.top = `${rect.bottom}px`;
    }

    private populateDropdown()
    {
        this.dropdownContainer.innerHTML = '';
        this.tabs.forEach((tab, index) =>
        {
            const item = document.createElement('div');
            item.className = 'tab-dropdown-item';
            item.textContent = tab.title;
            item.addEventListener('click', () =>
            {
                this.setActiveTab(index);
                this.closeDropdown();
            });
            this.dropdownContainer.appendChild(item);
        });
    }

    private closeDropdown()
    {
        this.dropdownContainer.style.display = 'none';
        window.removeEventListener('click', this.closeDropdown.bind(this));
    }

    public addTab(title: string, content: string): void
    {
        const buttonsContainer = this.container.querySelector('.tab-buttons') as HTMLDivElement;
        const contentContainer = this.container.querySelector('.tab-content-container') as HTMLDivElement;

        const button = document.createElement('button');
        button.className = 'tab-button';
        button.textContent = title;

        var idx = this.tabs.length;
        button.addEventListener('click', () => this.setActiveTab(idx));

        button.addEventListener('click', () => this.setActiveTab(this.tabs.length));

        const contentElement = document.createElement('div');
        contentElement.className = 'tab-content';
        contentElement.innerHTML = content;

        buttonsContainer.appendChild(button);
        contentContainer.appendChild(contentElement);

        this.tabs.push({ title, content, button, contentElement });

        if (this.tabs.length === 1)
        {
            this.setActiveTab(0);
        }
    }

    private setActiveTab(index: number): void
    {
        if (index < 0 || index >= this.tabs.length) return;

        this.tabs.forEach((tab, i) =>
        {
            const isActive = i === index;
            tab.button.classList.toggle('active', isActive);
            tab.contentElement.classList.toggle('active', isActive);
        });

        this.activeTabIndex = index;
    }
}