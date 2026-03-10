# Quotation System Documentation

A complete quotation management system for service-based businesses. This system allows you to create, manage, and send professional quotations to clients.

## 📁 Files Overview

```
components/
├── QuotationTemplate.tsx      # Main quotation display component
├── QuotationBuilder.tsx       # Form to create/edit quotations
├── QuotationExample.tsx       # Example dashboard/management page
└── QuoteForm.tsx              # Existing quote request form

utils/
└── quotationUtils.ts          # Helper functions and utilities

Documentation/
├── QUOTATION_TEMPLATE_GUIDE.md  # Templates and examples
└── QUOTATION_SYSTEM_README.md   # This file
```

---

## 🚀 Quick Start

### 1. Basic Usage - Display a Quotation

```tsx
import QuotationTemplate, { QuotationData } from './components/QuotationTemplate';

const quotation: QuotationData = {
    // ... your quotation data
};

<QuotationTemplate quotation={quotation} />
```

### 2. Create a New Quotation

```tsx
import QuotationBuilder from './components/QuotationBuilder';

<QuotationBuilder
    onSave={(quotation) => {
        console.log('Saved quotation:', quotation);
        // Save to database or state
    }}
    onCancel={() => {
        console.log('Cancelled');
    }}
/>
```

### 3. Generate from Quote Form

```tsx
import { createQuotationFromFormData } from './utils/quotationUtils';

// After quote form submission
const quotationData = createQuotationFromFormData(formData);
```

---

## 📋 Component Props

### QuotationTemplate

```typescript
interface QuotationTemplateProps {
    quotation: QuotationData;      // Required: Quotation data
    onDownload?: () => void;        // Optional: Download PDF callback
    onSend?: () => void;            // Optional: Send email callback
    onPrint?: () => void;           // Optional: Print callback
    isPreview?: boolean;            // Optional: Preview mode (default: false)
}
```

### QuotationBuilder

```typescript
interface QuotationBuilderProps {
    onSave: (quotation: QuotationData) => void;  // Required: Save callback
    onCancel: () => void;                         // Required: Cancel callback
    initialData?: Partial<QuotationData>;         // Optional: Pre-fill data
}
```

---

## 🔧 Data Structure

### QuotationData

```typescript
interface QuotationData {
    // Company Information
    companyName: string;
    companyAddress: string;
    companyPhone: string;
    companyEmail: string;
    companyWebsite: string;
    companyLogo?: string;

    // Client Information
    clientName: string;
    clientCompany: string;
    clientEmail: string;
    clientPhone: string;
    clientAddress?: string;

    // Quotation Details
    quotationNumber: string;
    quotationDate: string;
    validUntil: string;
    projectType: string;
    serviceType: string;

    // Items/Services
    items: QuotationItem[];

    // Pricing
    subtotal: number;
    discount?: number;
    discountType?: 'percentage' | 'fixed';
    taxRate?: number;
    total: number;

    // Terms & Notes
    projectTimeline?: string;
    paymentTerms?: string;
    notes?: string;
    termsAndConditions?: string[];
}
```

### QuotationItem

```typescript
interface QuotationItem {
    id: string;
    service: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}
```

---

## 🛠️ Utility Functions

### Import

```typescript
import {
    generateQuotationNumber,
    formatCurrency,
    formatDate,
    calculateQuotationTotals,
    createQuotationItem,
    getDefaultTermsAndConditions,
    getServicePackages,
    createQuotationFromFormData,
    generateSampleQuotation,
    quotationToPlainText,
    downloadQuotationAsPDF,
    sendQuotationViaEmail,
    sendQuotationViaTelegram,
    validateQuotation
} from './utils/quotationUtils';
```

### Common Usage Examples

```typescript
// Generate quotation number
const quoteNum = generateQuotationNumber(); // "QT-123456-789"

// Format currency
const price = formatCurrency(1250.50); // "$1,250.50"

// Format date
const date = formatDate("2024-03-06"); // "March 6, 2024"

// Calculate totals
const totals = calculateQuotationTotals(items, 10, 'percentage', 8);
// Returns: { subtotal, discountAmount, afterDiscount, taxAmount, total }

// Create item
const item = createQuotationItem(
    "3D Rendering",
    "Exterior view",
    2,
    1200
);

// Get preset packages
const packages = getServicePackages();
const exteriorPackage = packages['exterior-rendering'];

// Validate quotation
const errors = validateQuotation(quotation);
if (errors.length > 0) {
    console.error('Invalid quotation:', errors);
}
```

---

## 📱 Integration with Existing QuoteForm

### Auto-Generate Quotation from Form Submission

Modify your `QuoteForm.tsx` to generate a quotation after successful submission:

```tsx
// In QuoteForm.tsx handleSubmit function
import { createQuotationFromFormData } from '../utils/quotationUtils';

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ... existing submission logic ...
    
    if (telegramSuccess) {
        // Generate quotation
        const quotationData = createQuotationFromFormData(formData);
        
        // Store for later use or send to admin
        localStorage.setItem('pendingQuotation', JSON.stringify(quotationData));
        
        // Or notify admin to create quotation
        await notifyAdminToCreateQuotation(formData);
    }
};
```

### Add "Generate Quotation" Button

Create an admin page or modal that:
1. Lists all quote form submissions
2. Allows clicking to generate a quotation
3. Pre-fills the QuotationBuilder with form data

---

## 🎨 Customization

### Styling

The components use Tailwind CSS. Customize by:

1. **Changing colors**: Replace `neutral-*` classes with your brand colors
2. **Adding logo**: Pass `companyLogo` URL in quotation data
3. **Adjusting layout**: Modify the template structure in `QuotationTemplate.tsx`

### Adding Custom Fields

```typescript
// Extend the interface
interface CustomQuotationData extends QuotationData {
    customField1: string;
    customField2: number;
}

// Update builder form
<input
    type="text"
    name="customField1"
    value={formData.customField1}
    onChange={handleInputChange}
    placeholder="Custom Field"
/>
```

### PDF Generation

To enable PDF download, install `html2pdf.js`:

```bash
npm install html2pdf.js
```

Then uncomment the PDF generation code in `quotationUtils.ts`:

```typescript
import html2pdf from 'html2pdf.js';

export const downloadQuotationAsPDF = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (element) {
        const opt = {
            margin: 0.5,
            filename: `${filename}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        await html2pdf().set(opt).from(element).save();
    }
};
```

---

## 📧 Email Integration

### Using FormSpree

1. Update `.env.local`:
```env
VITE_FORMSPREE_ID=your_formspree_id
```

2. Use the email function:
```typescript
await sendQuotationViaEmail(quotation, clientEmail);
```

### Using Your Own Backend

```typescript
// In quotationUtils.ts, modify sendQuotationViaEmail
export const sendQuotationViaEmail = async (quotation, recipientEmail) => {
    const response = await fetch('https://your-api.com/send-quotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            to: recipientEmail,
            subject: `Quotation #${quotation.quotationNumber}`,
            quotation: quotation
        })
    });
    return response.ok;
};
```

---

## 📊 Example Workflow

### Complete Flow from Quote Request to Quotation

```
1. Client fills out QuoteForm
   ↓
2. Form data sent to Telegram/Email
   ↓
3. Admin reviews request
   ↓
4. Admin clicks "Generate Quotation"
   ↓
5. QuotationBuilder opens with pre-filled data
   ↓
6. Admin customizes services and pricing
   ↓
7. Admin saves and previews quotation
   ↓
8. Admin sends quotation to client via email
   ↓
9. Client reviews and accepts/declines
   ↓
10. Admin updates quotation status
```

---

## 🔐 Best Practices

### Data Security
- Never expose API keys in client-side code
- Use environment variables for sensitive data
- Validate all input data
- Sanitize HTML content

### Quotation Management
- Use unique quotation numbers
- Track quotation status (Draft, Sent, Accepted, Declined)
- Set expiration dates (typically 30 days)
- Keep audit trail of changes
- Backup quotations regularly

### Client Communication
- Send quotations promptly (within 24 hours)
- Follow up within 3-5 business days
- Be clear about what's included/excluded
- Specify revision limits
- Include clear next steps

---

## 🐛 Troubleshooting

### Quotation not displaying correctly
- Check that all required fields are filled
- Verify date formats (YYYY-MM-DD)
- Ensure items array is not empty

### PDF download not working
- Install html2pdf.js: `npm install html2pdf.js`
- Check that element ID matches
- Verify browser supports PDF generation

### Email not sending
- Check FormSpree ID or backend endpoint
- Verify email address is valid
- Check spam folder for test emails

### Calculations incorrect
- Verify item totals (quantity × unitPrice)
- Check discount type (percentage vs fixed)
- Ensure tax rate is percentage (e.g., 8 for 8%)

---

## 📝 Sample Use Cases

### Use Case 1: Quick Quotation from Template

```typescript
const packages = getServicePackages();
const exteriorPackage = packages['exterior-rendering'];

const quotation: QuotationData = {
    ...baseQuotation,
    items: exteriorPackage.items.map(item => createQuotationItem(
        item.service,
        item.description,
        item.quantity,
        item.unitPrice
    )),
    ...calculateQuotationTotals(exteriorPackage.items, 10, 'percentage', 0)
};
```

### Use Case 2: Custom Quote from Form Data

```typescript
// After form submission
const quotation = createQuotationFromFormData(formData);

// Customize based on client requirements
quotation.items.push(createQuotationItem(
    "Rush Delivery",
    "Expedited timeline - 50% faster",
    1,
    500
));

// Apply discount for returning client
quotation.discount = 15;
quotation.discountType = 'percentage';
```

### Use Case 3: Multi-Service Package

```typescript
const packages = getServicePackages();
const items = [
    ...packages['exterior-rendering'].items,
    ...packages['aerial-rendering'].items
];

const quotation: QuotationData = {
    ...baseQuotation,
    items: items.map((item, i) => createQuotationItem(
        item.service,
        item.description,
        item.quantity,
        item.unitPrice * 0.9 // 10% bundle discount
    )),
    ...calculateQuotationTotals(items, 0, 'fixed', 8)
};
```

---

## 📞 Support

For questions or issues:
1. Check the `QUOTATION_TEMPLATE_GUIDE.md` for templates
2. Review example code in `QuotationExample.tsx`
3. Test with `generateSampleQuotation()` utility

---

## 🎯 Next Steps

1. **Customize branding**: Add your logo and colors
2. **Set up email**: Configure FormSpree or your email service
3. **Enable PDF**: Install html2pdf.js for downloads
4. **Add to workflow**: Integrate with your quote request process
5. **Track status**: Implement quotation status tracking
6. **Automate**: Set up automatic follow-up reminders

---

**Happy Quoting! 🚀**
