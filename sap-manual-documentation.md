# SAP Manual Framework Documentation

## Overview

The SAP Manual Framework is a comprehensive system for creating interactive SAP instruction manuals. It provides reusable components, consistent styling, and interactive elements that guide users through SAP processes step-by-step.

## Quick Start

### 1. Basic Setup

Include the required files in your HTML:

```html
<!DOCTYPE html>
<html lang="is">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SAP Manual - Your Task</title>
    <link rel="stylesheet" href="sap-manual-styles.css">
</head>
<body>
    <!-- Use the base template structure -->
    <script src="sap-manual-components.js"></script>
</body>
</html>
```

### 2. Initialize the Manual

```javascript
SAPManual.init({
    title: "SAP Kerfi - Leiðbeiningar: Your Task Name",
    purpose: "Description of what this manual teaches",
    steps: [
        // Define your steps here
    ],
    warnings: [
        {
            title: "Athugið",
            text: "Important warning message"
        }
    ]
});
```

## Component Reference

### CSS Classes

#### Layout Components
- `.sap-main-container` - Main wrapper for the entire manual
- `.sap-header` - Header section with title and progress
- `.sap-content-area` - Container for sidebar and main content
- `.sap-sidebar` - Left sidebar with overview
- `.sap-main-content` - Main content area

#### SAP Window Components
- `.sap-window` - SAP window container
- `.sap-titlebar` - Window title bar
- `.sap-menu` - Menu bar
- `.sap-toolbar` - Toolbar with buttons
- `.sap-content` - Window content area

#### Form Components
- `.sap-field-group` - Container for form field
- `.sap-field-label` - Field label
- `.sap-input` - Input field
- `.sap-checkbox` - Checkbox input

#### Interactive Elements
- `.clickable-area` - Makes element clickable
- `.click-indicator` - Pulsing circle indicator
- `.click-indicator-box` - Pulsing box indicator
- `.arrow-indicator` - Animated arrow
- `.highlight-field` - Yellow highlight effect

#### Information Boxes
- `.sap-step-info` - Step information header
- `.sap-warning-box` - Warning message box
- `.sap-info-box` - Information/tip box
- `.sap-success-box` - Success message box

### JavaScript API

#### Core Functions

##### `SAPManual.init(config)`
Initialize the manual with configuration.

```javascript
SAPManual.init({
    title: "Manual Title",
    purpose: "Manual purpose",
    steps: [...],
    warnings: [...]
});
```

##### `SAPManual.showStep(stepIndex)`
Show a specific step.

```javascript
SAPManual.showStep(2); // Show step 3 (0-indexed)
```

##### `SAPManual.nextStep()`
Navigate to the next step.

##### `SAPManual.previousStep()`
Navigate to the previous step.

#### Validation Functions

##### `SAPManual.validateCommand(inputId, expectedCommand)`
Validate a command input field.

```javascript
SAPManual.validateCommand('commandField', 'MD04');
```

##### `SAPManual.validateInput(inputId, expectedValue, successMessage)`
Validate any input field.

```javascript
SAPManual.validateInput('materialInput', '41445059', 'Material found!');
```

#### UI Creation Functions

##### `SAPManual.createSAPWindow(options)`
Create a SAP window HTML structure.

```javascript
const windowHTML = SAPManual.createSAPWindow({
    title: 'Window Title',
    hasMenu: true,
    hasToolbar: true,
    menuItems: ['Menu', 'Edit', 'Favorites'],
    content: '<p>Window content</p>',
    toolbarContent: '<button class="sap-button">Save</button>'
});
```

##### `SAPManual.createFormField(label, inputId, value, readonly, width)`
Create a form field HTML.

```javascript
const fieldHTML = SAPManual.createFormField(
    'Material',      // label
    'materialInput', // input ID
    '41445059',      // default value
    false,           // readonly
    '200px'          // width
);
```

##### `SAPManual.createSAPTable(options)`
Create SAP tables with various configurations.

```javascript
// Simple table
const simpleTable = SAPManual.createSAPTable({
    type: 'simple',
    columns: [
        { header: 'Date', field: 'date' },
        { header: 'Type', field: 'type' },
        { header: 'Quantity', field: 'quantity', align: 'right' }
    ],
    data: [
        { date: '08.05.2025', type: 'Stock', quantity: '0' }
    ]
});

// Advanced scrollable table with tabs
const advancedTable = SAPManual.createSAPTable({
    type: 'advanced',
    hasScrolling: true,
    hasSelection: true,
    hasRowNumbers: false,
    tabs: ['Tab1', 'Tab2', 'Tab3'],
    statusPanel: [
        { icon: '📄', label: 'Status', value: '0,00' }
    ],
    columns: [
        { header: 'Material', field: 'material', width: 'medium' },
        { header: 'Description', field: 'desc', width: 'wide' },
        { header: 'Quantity', field: 'qty', width: 'medium', align: 'right' },
        { header: 'Price', field: 'price', width: 'medium', type: 'input' }
    ],
    data: [...],
    emptyRows: 15,
    bottomToolbar: {
        buttons: [
            { label: 'Save', onClick: 'saveData()' }
        ]
    }
});
```

Table column options:
- `header`: Column header text
- `field`: Data field name
- `width`: 'narrow', 'medium', or 'wide'
- `align`: 'left', 'center', or 'right'
- `type`: 'text' (default), 'icon', or 'input'

#### Interactive Functions

##### `SAPManual.addClickHandler(elementId, callback, showIndicator)`
Add click handler with optional visual indicator.

```javascript
SAPManual.addClickHandler('myButton', function() {
    alert('Clicked!');
}, true);
```

##### `SAPManual.highlightElement(elementId, duration)`
Temporarily highlight an element.

```javascript
SAPManual.highlightElement('importantField', 2000);
```

##### `SAPManual.toggleTreeNode(element)`
Toggle tree node expansion.

## Step Configuration

### Basic Step Structure

```javascript
{
    title: "Step Title",
    content: "HTML content or template name",
    validation: function() { /* return true/false */ },
    onShow: function() { /* called when step is shown */ }
}
```

### Using Templates

#### Intro Template
```javascript
{
    title: "Welcome",
    content: "intro",
    description: "Custom description",
    learningPoints: [
        "How to open MD04",
        "How to delete requests"
    ],
    duration: "5 minutes",
    skill: "Basic SAP knowledge"
}
```

#### Command Input Template
```javascript
{
    title: "Open Transaction",
    content: "commandInput",
    description: "Open the MD04 transaction",
    command: "MD04",
    windowTitle: "SAP Easy Access",
    inputId: "commandField",
    hasValidation: true,
    tip: "Use /nMD04 if in another window"
}
```

### Custom Step Content

```javascript
{
    title: "Custom Step",
    content: function(step) {
        return `
            <div class="sap-step-info">
                <h2>${step.title}</h2>
                <p>Custom content here</p>
            </div>
            
            ${SAPManual.createSAPWindow({
                title: 'My Window',
                content: 'Window content'
            })}
        `;
    },
    validation: function() {
        // Custom validation logic
        const input = document.getElementById('myInput');
        return input && input.value.length > 0;
    }
}
```

## Advanced Table Features

### Creating Purchase Order Tables

The framework supports creating complex SAP tables like those found in ME21N (Create Purchase Order) and ME51N (Create Purchase Requisition) transactions.

#### Purchase Order Table Example

```javascript
const poTable = SAPManual.createSAPTable({
    type: 'advanced',
    hasScrolling: true,  // Enable horizontal scrolling
    hasSelection: true,  // Add checkbox column
    tabs: [              // Tab navigation
        'Delivery/Invoice', 
        'Conditions', 
        'Texts', 
        'Address'
    ],
    statusPanel: [       // Status summary section
        { icon: '📄', label: 'Not Yet Sent', value: '0,00' },
        { icon: '🚚', label: 'Not Delivered', value: '0,00' }
    ],
    columns: [
        { header: 'S..', field: 'status', width: 'narrow', type: 'icon' },
        { header: 'Item', field: 'item', width: 'narrow' },
        { header: 'Material', field: 'material', width: 'medium' },
        { header: 'Short Text', field: 'shortText', width: 'wide' },
        { header: 'PO Quantity', field: 'quantity', width: 'medium', align: 'right' },
        { header: 'Net Price', field: 'netPrice', width: 'medium', align: 'right' }
    ],
    data: [...],
    emptyRows: 15,       // Show 15 empty rows
    bottomToolbar: {
        buttons: [
            { label: 'Default Values', onClick: 'setDefaults()' },
            { label: 'Add! Planning', onClick: 'addPlanning()' }
        ]
    }
});
```

#### Table with Input Fields

```javascript
const editableTable = SAPManual.createSAPTable({
    type: 'advanced',
    columns: [
        { header: 'Material', field: 'material', width: 'medium', type: 'input' },
        { header: 'Quantity', field: 'qty', width: 'medium', type: 'input' },
        { header: 'Price', field: 'price', width: 'medium', type: 'input' }
    ],
    data: [
        { material: '', qty: '1', price: '0.00' }
    ]
});
```

### Scrolling Implementation

The framework automatically handles horizontal scrolling for wide tables:

1. **Automatic Scrollbar**: Appears when table content exceeds container width
2. **Synchronized Scrolling**: Custom scrollbar syncs with table content
3. **Drag Support**: Users can drag the scrollbar thumb
4. **Responsive**: Adjusts on window resize

### Table Interaction Functions

##### `SAPManual.toggleAllRows(tableId)`
Toggle selection for all rows in a table.

```javascript
// In your checkbox header
onclick="SAPManual.toggleAllRows('my-table-id')"
```

##### `SAPManual.switchTab(tableId, tabIndex)`
Switch between table tabs.

```javascript
// Tab switching is handled automatically, but can be called manually
SAPManual.switchTab('my-table-id', 2); // Switch to third tab
```

### Handling Table Events

```javascript
// After table creation, add event handlers
document.addEventListener('DOMContentLoaded', function() {
    const table = document.querySelector('.sap-table-advanced');
    
    // Row selection
    table.addEventListener('click', function(e) {
        const row = e.target.closest('tr');
        if (row && row.parentElement.tagName === 'TBODY') {
            row.classList.toggle('selected');
        }
    });
    
    // Cell editing
    table.addEventListener('dblclick', function(e) {
        const cell = e.target.closest('td');
        if (cell && !cell.querySelector('input')) {
            // Open edit dialog
            editCell(cell);
        }
    });
});
```

### Mobile Considerations

For responsive tables on mobile devices:

```javascript
// Hide less important columns on small screens
if (window.innerWidth < 768) {
    const config = {
        type: 'advanced',
        columns: [
            { header: 'Material', field: 'material', width: 'medium' },
            { header: 'Qty', field: 'quantity', width: 'narrow' }
            // Fewer columns for mobile
        ]
    };
}
```

## Complete Example

Here's a complete example of creating a simple SAP manual:

```javascript
SAPManual.init({
    title: "SAP Kerfi - Delete Purchase Request",
    purpose: "Learn how to delete purchase requests in SAP",
    steps: [
        {
            title: "Welcome",
            content: "intro",
            learningPoints: [
                "How to open MD04",
                "How to find requests",
                "How to mark for deletion",
                "How to confirm deletion"
            ]
        },
        {
            title: "Open MD04",
            content: "commandInput",
            description: "First, open the MD04 transaction",
            command: "MD04",
            hasValidation: true
        },
        {
            title: "Enter Material",
            content: function(step) {
                return `
                    <div class="sap-step-info">
                        <h2>${step.title}</h2>
                        <p>Enter the material number</p>
                    </div>
                    
                    ${SAPManual.createSAPWindow({
                        title: 'Stock/Requirements List',
                        content: `
                            ${SAPManual.createFormField('Material', 'materialInput')}
                            ${SAPManual.createFormField('Plant', 'plantInput', '2900', true)}
                            
                            <button class="sap-button" onclick="showResults()">
                                Execute
                            </button>
                            
                            <div id="results" style="display:none;">
                                <table class="sap-table">
                                    <tr>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Quantity</th>
                                    </tr>
                                    <tr class="clickable-area" onclick="selectRequest()">
                                        <td>25.05.2025</td>
                                        <td>MTRes</td>
                                        <td>1,000</td>
                                    </tr>
                                </table>
                            </div>
                        `
                    })}
                `;
            }
        },
        {
            title: "Mark for Deletion",
            content: function(step) {
                return `
                    <div class="sap-step-info">
                        <h2>${step.title}</h2>
                        <p>Check "Final Issue" to delete</p>
                    </div>
                    
                    ${SAPManual.createSAPWindow({
                        title: 'Change Reservation',
                        content: `
                            <div class="sap-field-group">
                                <input type="checkbox" id="finalIssue" 
                                       onchange="enableSave()">
                                <label for="finalIssue">Final Issue</label>
                            </div>
                            
                            <button class="sap-button" id="saveBtn" 
                                    disabled onclick="saveChanges()">
                                Save
                            </button>
                        `
                    })}
                `;
            }
        },
        {
            title: "Success",
            content: `
                <div class="sap-success-box">
                    <h3>✓ Request Deleted!</h3>
                    <p>The request has been removed from the system.</p>
                </div>
            `
        }
    ],
    warnings: [
        {
            title: "Important",
            text: "Cannot delete requests with goods movements"
        }
    ]
});

// Helper functions for the example
function showResults() {
    if (document.getElementById('materialInput').value === '41445059') {
        document.getElementById('results').style.display = 'block';
    }
}

function selectRequest() {
    SAPManual.nextStep();
}

function enableSave() {
    const checkbox = document.getElementById('finalIssue');
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = !checkbox.checked;
}

function saveChanges() {
    SAPManual.nextStep();
}
```

## Best Practices

1. **Step Validation**: Always validate user input before allowing progression
2. **Visual Feedback**: Use highlights and indicators to guide users
3. **Clear Instructions**: Provide context in step info boxes
4. **Error Handling**: Show helpful error messages for incorrect input
5. **Responsive Design**: Test on different screen sizes
6. **Accessibility**: Use semantic HTML and proper labels

## Customization Tips

### Adding New Templates

Create custom templates by adding to the `getStepTemplate` function:

```javascript
// In your step configuration
{
    content: 'myCustomTemplate',
    customData: 'value'
}

// Modify getStepTemplate in sap-manual-components.js
templates.myCustomTemplate = `
    <div class="sap-step-info">
        <h2>${stepData.title}</h2>
        <p>Custom template with ${stepData.customData}</p>
    </div>
`;
```

### Styling Modifications

Override CSS classes in your own stylesheet:

```css
/* Custom color scheme */
.sap-header {
    background: #1a5490;
}

.sap-progress-step.active {
    background: #ff6b35;
}

/* Custom sizing */
.sap-sidebar {
    width: 350px;
}
```

### Adding Animations

Create custom animations:

```css
@keyframes customPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

.custom-indicator {
    animation: customPulse 1.5s infinite;
}
```

## Troubleshooting

### Common Issues

1. **Steps not showing**: Check that step containers have unique IDs
2. **Validation not working**: Ensure validation functions return boolean
3. **Styling issues**: Check CSS file is loaded correctly
4. **JavaScript errors**: Check browser console for detailed errors

### Debugging Tips

```javascript
// Enable debug mode
SAPManual.debug = true;

// Log current step
console.log('Current step:', SAPManual.utils.getCurrentStep());

// Get step configuration
const stepConfig = SAPManual.utils.getStepConfig(2);
console.log('Step config:', stepConfig);
```

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

Mobile browsers are supported with responsive design.

## License and Usage

This framework is designed for creating educational SAP manuals. Ensure you have appropriate permissions when creating manuals for proprietary SAP processes.