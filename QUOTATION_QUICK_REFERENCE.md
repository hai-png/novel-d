# Quotation System - Quick Reference

## 📦 Components

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `QuotationTemplate` | Display formatted quotation | `quotation`, `onDownload`, `onSend` |
| `QuotationBuilder` | Create/edit quotations | `onSave`, `onCancel`, `initialData` |
| `QuotationExample` | Dashboard example | None |

---

## 🔧 Utilities

```typescript
import { 
    generateQuotationNumber,      // "QT-123456-789"
    formatCurrency,               // "$1,250.50"
    formatDate,                   // "March 6, 2024"
    calculateQuotationTotals,     // { subtotal, total, ... }
    createQuotationItem,          // Create line item
    getServicePackages,           // Preset service packages
    createQuotationFromFormData,  // From quote form
    generateSampleQuotation,      // Demo data
    quotationToPlainText,         // For email/Telegram
    validateQuotation             // Check for errors
} from './utils/quotationUtils';
```

---

## 📋 Required Fields

```typescript
const requiredFields = [
    'clientName',
    'clientEmail', 
    'quotationNumber',
    'quotationDate',
    'validUntil',
    'items',          // At least 1
    'total'           // > 0
];
```

---

## 💰 Service Packages

```typescript
const packages = getServicePackages();
// Available keys:
// - 'exterior-rendering'
// - 'interior-visualization'
// - 'immersive-tours'
// - 'virtual-tour'
// - 'aerial-rendering'
// - 'animation'
```

---

## 🎯 Common Patterns

### Create from Form Data
```typescript
const quotation = createQuotationFromFormData(formData);
```

### Add Custom Item
```typescript
quotation.items.push(createQuotationItem(
    "Service Name",
    "Description",
    1,          // quantity
    1000        // unit price
));
```

### Apply Discount
```typescript
quotation.discount = 10;
quotation.discountType = 'percentage';  // or 'fixed'
```

### Calculate Totals
```typescript
const totals = calculateQuotationTotals(
    items,
    10,   // discount
    'percentage',
    8     // tax rate
);
```

---

## 📧 Send Quotation

### Via Email
```typescript
await sendQuotationViaEmail(
    quotation,
    'client@email.com',
    'Custom Subject',
    'Custom Message'
);
```

### Via Telegram
```typescript
await sendQuotationViaTelegram(
    quotation,
    botToken,
    chatId
);
```

---

## 🎨 Template Structure

```
┌─────────────────────────────────────┐
│  HEADER (Company Info + Logo)       │
│  QUOTATION # | Date | Valid Until   │
├─────────────────────────────────────┤
│  CLIENT INFO  │  PROJECT DETAILS    │
├─────────────────────────────────────┤
│  SERVICES TABLE                     │
│  ┌─────────────────────────────┐    │
│  │ Service | Desc | Qty | $    │    │
│  └─────────────────────────────┘    │
├─────────────────────────────────────┤
│  SUBTOTAL | DISCOUNT | TAX | TOTAL  │
├─────────────────────────────────────┤
│  NOTES & TERMS                      │
└─────────────────────────────────────┘
```

---

## ✅ Validation Checklist

- [ ] Client name and email filled
- [ ] Unique quotation number
- [ ] Valid dates (issue < expiry)
- [ ] At least one service item
- [ ] All items have quantity > 0
- [ ] All items have price ≥ 0
- [ ] Total calculated correctly
- [ ] Terms and conditions included
- [ ] Company contact info present

---

## 🔢 Pricing Reference

| Service | Price Range |
|---------|-------------|
| Exterior Rendering (per view) | $800 - $1,500 |
| Interior Visualization (per room) | $600 - $1,200 |
| Immersive 3D Tour (base) | $2,000 - $4,000 |
| Virtual Tour 360° (per scene) | $200 - $500 |
| Aerial Rendering (per view) | $1,200 - $2,500 |
| 3D Animation (per second) | $150 - $300 |

---

## 📊 Status Workflow

```
Draft → Sent → Viewed → Accepted/Declined
              ↓
           Expired (after 30 days)
```

---

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| Total = 0 | Check item quantities and prices |
| Date format error | Use YYYY-MM-DD format |
| PDF not downloading | Install `html2pdf.js` |
| Email not sending | Check FormSpree ID |

---

## 💡 Pro Tips

1. **Pre-fill from form**: Use `createQuotationFromFormData()` to save time
2. **Use packages**: Start with preset packages, then customize
3. **Bundle discounts**: Offer 10-15% for multi-service packages
4. **Set reminders**: Follow up 3-5 days after sending
5. **Track everything**: Log all quotations sent and their status
6. **PDF always**: Send as PDF, never editable format
7. **Clear expiry**: Always include validity period (30 days standard)

---

## 📁 File Locations

```
/components/QuotationTemplate.tsx    # Display component
/components/QuotationBuilder.tsx     # Form component
/components/QuotationExample.tsx     # Dashboard example
/utils/quotationUtils.ts             # Helper functions
/QUOTATION_TEMPLATE_GUIDE.md         # Templates & examples
/QUOTATION_SYSTEM_README.md          # Full documentation
```

---

## 🎯 Quick Start Code

```typescript
import QuotationTemplate from './components/QuotationTemplate';
import { generateSampleQuotation } from './utils/quotationUtils';

function App() {
    const quotation = generateSampleQuotation();
    
    return (
        <QuotationTemplate 
            quotation={quotation}
            onDownload={() => console.log('Download PDF')}
            onSend={() => console.log('Send to client')}
        />
    );
}
```

---

**Need more details?** See `QUOTATION_SYSTEM_README.md` for full documentation.
