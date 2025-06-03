/**
 * SAP Manual Framework - JavaScript Components
 * Comprehensive library for creating interactive SAP instruction manuals
 */

let SAPManual = (function() {
    'use strict';

    // Private variables
    let config = {
        steps: [],
        currentStep: 0,
        totalSteps: 0,
        title: '',
        purpose: '',
        warnings: []
    };

    // DOM element references
    let elements = {};

    /**
     * Initialize the SAP Manual
     * @param {Object} userConfig - Configuration object
     */
    function init(userConfig) {
        config = { ...config, ...userConfig };
        config.totalSteps = config.steps.length;

        // Cache DOM elements
        elements = {
            progressIndicator: document.getElementById('progress-indicator'),
            stepContainers: document.getElementById('step-containers'),
            stepOverview: document.getElementById('step-overview'),
            manualTitle: document.getElementById('manual-title'),
            manualPurpose: document.getElementById('manual-purpose'),
            manualWarnings: document.getElementById('manual-warnings'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn')
        };

        // Set manual metadata
        if (elements.manualTitle) elements.manualTitle.textContent = config.title;
        if (elements.manualPurpose) elements.manualPurpose.textContent = config.purpose;

        // Build the manual
        buildProgressIndicator();
        buildStepOverview();
        buildWarnings();
        buildStepContainers();

        // Show first step
        showStep(0);
    }

    /**
     * Build progress indicator
     */
    function buildProgressIndicator() {
        if (!elements.progressIndicator) return;

        elements.progressIndicator.innerHTML = '';

        for (let i = 0; i < config.totalSteps; i++) {
            const step = document.createElement('div');
            step.className = 'sap-progress-step';
            step.id = `prog${i}`;
            step.textContent = i === 0 ? '✓' : i.toString();
            elements.progressIndicator.appendChild(step);
        }
    }

    /**
     * Build step overview in sidebar
     */
    function buildStepOverview() {
        if (!elements.stepOverview) return;

        elements.stepOverview.innerHTML = '';

        config.steps.forEach((step, index) => {
            if (index === 0) return; // Skip intro step
            const li = document.createElement('li');
            li.textContent = step.title;
            elements.stepOverview.appendChild(li);
        });
    }

    /**
     * Build warnings section
     */
    function buildWarnings() {
        if (!elements.manualWarnings || config.warnings.length === 0) return;

        config.warnings.forEach(warning => {
            const warningBox = document.createElement('div');
            warningBox.className = 'sap-warning-box';
            warningBox.style.marginTop = '20px';
            warningBox.innerHTML = `<strong>⚠️ ${warning.title || 'Athugið'}:</strong><br>${warning.text}`;
            elements.manualWarnings.appendChild(warningBox);
        });
    }

    /**
     * Build step containers
     */
    function buildStepContainers() {
        if (!elements.stepContainers) return;

        elements.stepContainers.innerHTML = '';

        config.steps.forEach((step, index) => {
            const container = document.createElement('div');
            container.className = 'sap-step-container';
            container.id = `step${index}`;

            // Add step content based on type
            if (typeof step.content === 'string') {
                container.innerHTML = getStepTemplate(step.content, step);
            } else if (typeof step.content === 'function') {
                container.innerHTML = step.content(step);
            } else {
                container.innerHTML = step.content;
            }

            elements.stepContainers.appendChild(container);
        });
    }

    /**
     * Get step template by name
     */
    function getStepTemplate(templateName, stepData) {
        const templates = {
            intro: `
                <div class="sap-step-info">
                    <h2>${stepData.title}</h2>
                    <p>${stepData.description || 'Þessar leiðbeiningar sýna þér skref fyrir skref hvernig á að framkvæma þessa aðgerð í SAP kerfinu.'}</p>
                </div>
                <div style="text-align: center; padding: 40px 0;">
                    <h3 style="margin-bottom: 20px;">Hvað þú munt læra:</h3>
                    <ul style="list-style: none; text-align: left; display: inline-block; font-size: 16px; line-height: 2;">
                        ${stepData.learningPoints ? stepData.learningPoints.map(point => `<li>✓ ${point}</li>`).join('') : ''}
                    </ul>
                </div>
                <div class="sap-info-box">
                    <strong>Tími:</strong> ${stepData.duration || 'Um 5 mínútur'}<br>
                    <strong>Kunnátta:</strong> ${stepData.skill || 'Grunnþekking á SAP'}
                </div>
            `,

            commandInput: `
                <div class="sap-step-info">
                    <h2>${stepData.title}</h2>
                    <p>${stepData.description}</p>
                </div>
                ${createSAPWindow({
                    title: stepData.windowTitle || 'SAP Easy Access',
                    hasMenu: true,
                    hasToolbar: true,
                    content: `
                        <p style="font-size: 13px; margin-bottom: 10px;">Sláðu inn <strong>${stepData.command}</strong> í skipanasvæðið og ýttu á Enter:</p>
                    `,
                    toolbarContent: `
                        <div class="sap-button">
                            <span>↵</span>
                        </div>
                        <input type="text" class="sap-input" id="${stepData.inputId || 'commandField'}" placeholder="Command field" style="margin-left: 10px; width: 300px;">
                    `
                })}
                <div class="sap-info-box">
                    <strong>Ábending:</strong> ${stepData.tip || `Ef þú ert þegar í öðrum glugga, sláðu inn /n${stepData.command} til að fara beint í ${stepData.command}.`}
                </div>
                ${stepData.hasValidation ? `<button class="sap-nav-button" onclick="SAPManual.validateCommand('${stepData.inputId || 'commandField'}', '${stepData.command}')" style="margin-top: 20px;">Athuga skipun</button>` : ''}
            `
        };

        return templates[templateName] || '';
    }

    /**
     * Show specific step
     */
    function showStep(stepIndex) {
        // Hide all steps
        document.querySelectorAll('.sap-step-container').forEach(container => {
            container.classList.remove('active');
        });

        // Show current step
        const currentStepElement = document.getElementById(`step${stepIndex}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }

        // Update progress
        updateProgress(stepIndex);

        // Update navigation
        updateNavigation(stepIndex);

        // Store current step
        config.currentStep = stepIndex;

        // Scroll to top
        window.scrollTo(0, 0);

        // Execute step's onShow callback if exists
        if (config.steps[stepIndex] && config.steps[stepIndex].onShow) {
            config.steps[stepIndex].onShow();
        }
    }

    /**
     * Update progress indicator
     */
    function updateProgress(currentStep) {
        for (let i = 0; i < config.totalSteps; i++) {
            const progStep = document.getElementById(`prog${i}`);
            if (!progStep) continue;

            if (i < currentStep) {
                progStep.classList.add('completed');
                progStep.classList.remove('active');
                if (i > 0) progStep.textContent = '✓';
            } else if (i === currentStep) {
                progStep.classList.add('active');
                progStep.classList.remove('completed');
            } else {
                progStep.classList.remove('active', 'completed');
            }
        }
    }

    /**
     * Update navigation buttons
     */
    function updateNavigation(currentStep) {
        if (elements.prevBtn) {
            elements.prevBtn.style.display = currentStep === 0 ? 'none' : 'block';
        }

        if (elements.nextBtn) {
            if (currentStep === config.totalSteps - 1) {
                elements.nextBtn.textContent = 'Byrja aftur';
                elements.nextBtn.onclick = () => {
                    config.currentStep = 0;
                    showStep(0);
                };
            } else {
                elements.nextBtn.textContent = 'Næsta skref →';
                elements.nextBtn.onclick = nextStep;
            }
        }
    }

    /**
     * Navigate to next step
     */
    function nextStep() {
        if (config.currentStep < config.totalSteps - 1) {
            // Check if current step has validation
            const currentStepConfig = config.steps[config.currentStep];
            if (currentStepConfig.validation && !currentStepConfig.validation()) {
                return; // Don't proceed if validation fails
            }

            config.currentStep++;
            showStep(config.currentStep);
        }
    }

    /**
     * Navigate to previous step
     */
    function previousStep() {
        if (config.currentStep > 0) {
            config.currentStep--;
            showStep(config.currentStep);
        }
    }

    /**
     * Validate command input
     */
    function validateCommand(inputId, expectedCommand) {
        const input = document.getElementById(inputId);
        if (!input) return false;

        const value = input.value.toUpperCase();
        const expected = expectedCommand.toUpperCase();

        if (value === expected || value === `/N${expected}`) {
            input.classList.add('highlight-field');
            setTimeout(() => {
                alert(`Rétt! ${expectedCommand} glugginn opnast.`);
                nextStep();
            }, 500);
            return true;
        } else {
            alert(`Sláðu inn ${expectedCommand} eða /n${expectedCommand} í skipanasvæðið.`);
            input.focus();
            return false;
        }
    }

    /**
     * Validate input field
     */
    function validateInput(inputId, expectedValue, successMessage) {
        const input = document.getElementById(inputId);
        if (!input) return false;

        if (input.value === expectedValue) {
            input.classList.add('highlight-field');
            setTimeout(() => {
                alert(successMessage || 'Rétt!');
                nextStep();
            }, 500);
            return true;
        } else {
            alert(`Sláðu inn ${expectedValue} í reitinn.`);
            input.focus();
            return false;
        }
    }

    /**
     * Create SAP Window HTML
     */
    function createSAPWindow(options) {
        const defaults = {
            title: 'SAP Window',
            hasMenu: false,
            hasToolbar: false,
            menuItems: ['Menu', 'Edit', 'Favorites', 'Extras', 'System'],
            content: '',
            toolbarContent: ''
        };

        const opts = { ...defaults, ...options };

        let html = '<div class="sap-window">';

        // Titlebar
        html += `<div class="sap-titlebar ${opts.titlebarClass || ''}">${opts.title}</div>`;

        // Menu
        if (opts.hasMenu) {
            html += '<div class="sap-menu">';
            opts.menuItems.forEach(item => {
                html += `<span class="sap-menu-item">${item}</span>`;
            });
            html += '</div>';
        }

        // Toolbar
        if (opts.hasToolbar) {
            html += `<div class="sap-toolbar">${opts.toolbarContent}</div>`;
        }

        // Content
        html += `<div class="sap-content">${opts.content}</div>`;

        html += '</div>';

        return html;
    }

    /**
     * Create form field HTML
     */
    function createFormField(label, inputId, value = '', readonly = false, width = '200px') {
        return `
            <div class="sap-field-group">
                <label class="sap-field-label">${label}</label>
                <input type="text" class="sap-input" id="${inputId}" value="${value}" 
                       ${readonly ? 'readonly' : ''} style="width: ${width}; ${readonly ? 'background: #f0f0f0;' : ''}">
            </div>
        `;
    }

    /**
     * Create click indicator
     */
    function createClickIndicator(type = 'circle', size = 'normal') {
        const sizeClass = size === 'small' ? 'click-indicator-small' : '';
        const typeClass = type === 'box' ? 'click-indicator-box' : 'click-indicator';

        return `<div class="${typeClass} ${sizeClass}"></div>`;
    }

    /**
     * Add click handler with visual feedback
     */
    function addClickHandler(elementId, callback, showIndicator = true) {
        const element = document.getElementById(elementId);
        if (!element) return;

        if (showIndicator) {
            element.style.position = 'relative';
            element.innerHTML += createClickIndicator();
        }

        element.addEventListener('click', function() {
            if (showIndicator) {
                const indicator = this.querySelector('.click-indicator, .click-indicator-box');
                if (indicator) indicator.style.display = 'none';
            }
            callback();
        });
    }

    /**
     * Toggle tree node expansion
     */
    function toggleTreeNode(element) {
        const isExpanded = element.textContent === '▼';
        element.textContent = isExpanded ? '▶' : '▼';

        // Find and toggle child rows
        const row = element.closest('.tree-row');
        const level = parseInt(row.dataset.level);
        let nextRow = row.nextElementSibling;

        while (nextRow && parseInt(nextRow.dataset.level) > level) {
            nextRow.style.display = isExpanded ? 'none' : 'block';
            nextRow = nextRow.nextElementSibling;
        }
    }

    /**
     * Create SAP Table HTML
     */
    function createSAPTable(options) {
        const defaults = {
            type: 'simple', // 'simple', 'advanced', 'purchaseOrder', 'requisition'
            columns: [],
            data: [],
            hasSelection: false,
            hasRowNumbers: false,
            hasScrolling: false,
            scrollWidth: 'auto'
        };

        const opts = { ...defaults, ...options };

        if (opts.type === 'simple') {
            return createSimpleTable(opts);
        } else {
            return createAdvancedTable(opts);
        }
    }

    /**
     * Create simple table
     */
    function createSimpleTable(opts) {
        let html = '<table class="sap-table">';

        // Header
        html += '<thead><tr>';
        opts.columns.forEach(col => {
            html += `<th>${col.header}</th>`;
        });
        html += '</tr></thead>';

        // Body
        html += '<tbody>';
        opts.data.forEach((row, rowIndex) => {
            html += `<tr${row.clickable ? ' class="clickable-area" onclick="' + row.onClick + '"' : ''}>`;
            opts.columns.forEach(col => {
                const value = row[col.field] || '';
                html += `<td${col.align ? ' style="text-align: ' + col.align + '"' : ''}>${value}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody></table>';

        return html;
    }

    /**
     * Create advanced scrollable table
     */
    function createAdvancedTable(opts) {
        const tableId = 'sap-table-' + Math.random().toString(36).substr(2, 9);

        let html = '<div class="sap-table-container">';

        // Tab navigation if needed
        if (opts.tabs) {
            html += '<div class="sap-tab-container">';
            opts.tabs.forEach((tab, index) => {
                html += `<div class="sap-tab${index === 0 ? ' active' : ''}" onclick="SAPManual.switchTab('${tableId}', ${index})">${tab}</div>`;
            });
            html += '</div>';
        }

        // Status panel if needed
        if (opts.statusPanel) {
            html += createStatusPanel(opts.statusPanel);
        }

        // Table with scroll wrapper
        html += `<div class="sap-table-scroll-wrapper" id="${tableId}-wrapper">`;
        html += `<table class="sap-table-advanced" id="${tableId}">`;

        // Header
        html += '<thead><tr>';

        // Selection column
        if (opts.hasSelection) {
            html += '<th class="narrow selection-col"><input type="checkbox" onclick="SAPManual.toggleAllRows(\''+tableId+'\')"></th>';
        }

        // Row numbers
        if (opts.hasRowNumbers) {
            html += '<th class="narrow">#</th>';
        }

        // Data columns
        opts.columns.forEach(col => {
            const widthClass = col.width || 'medium';
            const alignStyle = col.align ? ` style="text-align: ${col.align}"` : '';
            html += `<th class="${widthClass}"${alignStyle}>${col.header}</th>`;
        });

        html += '</tr></thead>';

        // Body
        html += '<tbody>';

        // Empty rows or data
        const rowCount = opts.data.length || opts.emptyRows || 10;

        for (let i = 0; i < rowCount; i++) {
            const row = opts.data[i] || {};
            html += '<tr>';

            // Selection
            if (opts.hasSelection) {
                html += '<td class="selection-col"><input type="checkbox"></td>';
            }

            // Row number
            if (opts.hasRowNumbers) {
                html += `<td class="row-number">${i + 1}</td>`;
            }

            // Data cells
            opts.columns.forEach(col => {
                const value = row[col.field] || '';
                const alignStyle = col.align ? ` style="text-align: ${col.align}"` : '';

                if (col.type === 'icon') {
                    html += `<td class="icon-cell"${alignStyle}>${value ? '<span class="icon-indicator">' + value + '</span>' : ''}</td>`;
                } else if (col.type === 'input') {
                    html += `<td${alignStyle}><input type="text" class="sap-input" style="width: 90%; min-width: 60px;" value="${value}"></td>`;
                } else {
                    html += `<td${alignStyle}>${value}</td>`;
                }
            });

            html += '</tr>';
        }

        html += '</tbody></table></div>';

        // Scrollbar
        if (opts.hasScrolling) {
            html += `<div class="sap-horizontal-scrollbar" id="${tableId}-scrollbar">
                <div class="sap-scrollbar-track">
                    <div class="sap-scrollbar-thumb" id="${tableId}-thumb"></div>
                </div>
            </div>`;
        }

        // Table navigation
        html += `<div class="sap-table-navigation">
            <div class="sap-table-nav-buttons">
                <button class="sap-table-nav-button" title="First page">◀◀</button>
                <button class="sap-table-nav-button" title="Previous page">◀</button>
                <button class="sap-table-nav-button" title="Next page">▶</button>
                <button class="sap-table-nav-button" title="Last page">▶▶</button>
            </div>
            <span style="margin-left: auto; margin-right: 10px; font-size: 11px;">...</span>
            <button class="sap-table-nav-button" style="margin-right: 5px;">⬆</button>
            <button class="sap-table-nav-button">⬇</button>
        </div>`;

        // Bottom toolbar
        if (opts.bottomToolbar) {
            html += createBottomToolbar(opts.bottomToolbar);
        }

        html += '</div>';

        // Initialize scrolling after DOM update
        if (opts.hasScrolling) {
            setTimeout(() => initializeTableScroll(tableId), 100);
        }

        return html;
    }

    /**
     * Create status panel
     */
    function createStatusPanel(items) {
        let html = '<div class="sap-status-panel">';

        items.forEach(item => {
            html += `
                <div class="sap-status-item">
                    <span class="sap-status-icon">${item.icon || '📄'}</span>
                    <span class="sap-status-label">${item.label}</span>
                    <span class="sap-status-value">${item.value}</span>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    /**
     * Create bottom toolbar
     */
    function createBottomToolbar(config) {
        let html = '<div class="sap-bottom-toolbar">';

        // Left side - item dropdown
        html += '<div class="sap-po-dropdown">';
        html += '<label style="font-size: 12px; margin-right: 5px;">Item</label>';
        html += '<select><option>New Item</option></select>';
        html += '</div>';

        // Right side - action buttons
        html += '<div class="sap-action-buttons">';
        config.buttons.forEach(btn => {
            html += `<button class="sap-action-button" onclick="${btn.onClick || ''}">${btn.label}</button>`;
        });
        html += '</div>';

        html += '</div>';
        return html;
    }

    /**
     * Initialize table scrolling
     */
    function initializeTableScroll(tableId) {
        const wrapper = document.getElementById(`${tableId}-wrapper`);
        const scrollbar = document.getElementById(`${tableId}-scrollbar`);
        const thumb = document.getElementById(`${tableId}-thumb`);

        if (!wrapper || !scrollbar || !thumb) return;

        // Update thumb size based on content
        const updateThumb = () => {
            const scrollWidth = wrapper.scrollWidth;
            const clientWidth = wrapper.clientWidth;
            const scrollRatio = clientWidth / scrollWidth;

            if (scrollRatio >= 1) {
                scrollbar.style.display = 'none';
            } else {
                scrollbar.style.display = 'block';
                const thumbWidth = Math.max(20, scrollbar.clientWidth * scrollRatio);
                thumb.style.width = thumbWidth + 'px';

                const scrollLeft = wrapper.scrollLeft;
                const maxScroll = scrollWidth - clientWidth;
                const thumbPosition = (scrollLeft / maxScroll) * (scrollbar.clientWidth - thumbWidth);
                thumb.style.left = thumbPosition + 'px';
            }
        };

        // Sync wrapper scroll with thumb
        wrapper.addEventListener('scroll', updateThumb);

        // Make thumb draggable
        let isDragging = false;
        let startX = 0;
        let startLeft = 0;

        thumb.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startLeft = thumb.offsetLeft;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const newLeft = Math.max(0, Math.min(startLeft + deltaX, scrollbar.clientWidth - thumb.clientWidth));
            thumb.style.left = newLeft + 'px';

            const scrollRatio = newLeft / (scrollbar.clientWidth - thumb.clientWidth);
            const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
            wrapper.scrollLeft = scrollRatio * maxScroll;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Initial update
        updateThumb();

        // Update on window resize
        window.addEventListener('resize', updateThumb);
    }

    /**
     * Toggle all rows selection
     */
    function toggleAllRows(tableId) {
        const table = document.getElementById(tableId);
        if (!table) return;

        const headerCheckbox = table.querySelector('thead input[type="checkbox"]');
        const rowCheckboxes = table.querySelectorAll('tbody input[type="checkbox"]');

        rowCheckboxes.forEach(cb => {
            cb.checked = headerCheckbox.checked;
        });
    }

    /**
     * Switch tab
     */
    function switchTab(tableId, tabIndex) {
        const container = document.getElementById(tableId).closest('.sap-table-container');
        const tabs = container.querySelectorAll('.sap-tab');

        tabs.forEach((tab, index) => {
            if (index === tabIndex) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }

    // Public API
    return {
        init,
        showStep,
        nextStep,
        previousStep,
        validateCommand,
        validateInput,
        createSAPWindow,
        createFormField,
        createSAPTable,
        createClickIndicator,
        addClickHandler,
        toggleTreeNode,
        highlightElement,
        toggleAllRows,
        switchTab,
        // Utility functions for custom steps
        utils: {
            alert: (message) => alert(message),
            confirm: (message) => confirm(message),
            getCurrentStep: () => config.currentStep,
            getStepConfig: (index) => config.steps[index],
            updateStepValidation: (index, validationFn) => {
                if (config.steps[index]) {
                    config.steps[index].validation = validationFn;
                }
            }
        }
    };
})();