import { QuotationData, QuotationItem } from '../components/QuotationTemplate';

/**
 * Generate a unique quotation number
 */
export const generateQuotationNumber = (): string => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `QT-${timestamp}-${random}`;
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount);
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Calculate quotation totals
 */
export const calculateQuotationTotals = (
    items: QuotationItem[],
    discount?: number,
    discountType?: 'percentage' | 'fixed',
    taxRate?: number
) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = discount 
        ? (discountType === 'percentage' ? subtotal * (discount / 100) : discount)
        : 0;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = taxRate ? afterDiscount * (taxRate / 100) : 0;
    const total = afterDiscount + taxAmount;

    return {
        subtotal,
        discountAmount,
        afterDiscount,
        taxAmount,
        total
    };
};

/**
 * Create a new quotation item
 */
export const createQuotationItem = (
    service: string,
    description: string,
    quantity: number,
    unitPrice: number
): QuotationItem => {
    return {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        service,
        description,
        quantity,
        unitPrice,
        total: quantity * unitPrice
    };
};

/**
 * Get default terms and conditions
 */
export const getDefaultTermsAndConditions = (): string[] => {
    return [
        'This quotation is valid for 30 days from the date of issue',
        'A 50% deposit is required to begin work',
        'Final delivery upon receipt of final payment',
        'Includes 2 rounds of revisions per item',
        'Additional revisions billed at $150/hour',
        'All files remain property of the company until final payment is received',
        'Client is responsible for providing all necessary materials and approvals in a timely manner'
    ];
};

/**
 * Get sample service packages with preset pricing
 */
export const getServicePackages = () => {
    return {
        'exterior-rendering': {
            name: 'Exterior Rendering Package',
            basePrice: 1200,
            items: [
                { service: '3D Exterior Rendering', description: 'High-resolution exterior render - front view', quantity: 1, unitPrice: 1200 },
                { service: '3D Exterior Rendering', description: 'High-resolution exterior render - side view', quantity: 1, unitPrice: 1200 },
                { service: '3D Exterior Rendering', description: 'High-resolution exterior render - aerial view', quantity: 1, unitPrice: 1500 },
                { service: 'Revision Rounds', description: '2 rounds of revisions included', quantity: 2, unitPrice: 0 }
            ]
        },
        'interior-visualization': {
            name: 'Interior Visualization Package',
            basePrice: 800,
            items: [
                { service: 'Living Room Rendering', description: 'Photorealistic interior render - living room', quantity: 3, unitPrice: 800 },
                { service: 'Kitchen Rendering', description: 'Photorealistic interior render - kitchen', quantity: 2, unitPrice: 750 },
                { service: 'Bedroom Rendering', description: 'Photorealistic interior render - bedroom', quantity: 2, unitPrice: 700 },
                { service: 'Virtual Staging', description: 'Furniture and decor placement', quantity: 1, unitPrice: 500 }
            ]
        },
        'immersive-tours': {
            name: 'Immersive 3D Tour Package',
            basePrice: 2500,
            items: [
                { service: '3D Virtual Tour', description: 'Interactive 3D tour - up to 2,000 sq ft', quantity: 1, unitPrice: 2500 },
                { service: 'Dollhouse View', description: '3D dollhouse view included', quantity: 1, unitPrice: 300 },
                { service: 'Floor Plan Export', description: '2D floor plan with measurements', quantity: 1, unitPrice: 200 },
                { service: 'Hosting (1 year)', description: 'Annual hosting service', quantity: 1, unitPrice: 500 }
            ]
        },
        'virtual-tour': {
            name: '360° Virtual Tour Package',
            basePrice: 1800,
            items: [
                { service: '360° Panoramic Scenes', description: 'Interactive 360° views - per scene', quantity: 5, unitPrice: 350 },
                { service: 'Interactive Hotspots', description: 'Information points and navigation', quantity: 1, unitPrice: 250 },
                { service: 'Virtual Reality Mode', description: 'VR-compatible viewing mode', quantity: 1, unitPrice: 300 }
            ]
        },
        'aerial-rendering': {
            name: 'Aerial Rendering Package',
            basePrice: 1500,
            items: [
                { service: 'Aerial Site View', description: 'Bird\'s eye view of property', quantity: 2, unitPrice: 1500 },
                { service: 'Context Mapping', description: 'Surrounding area context', quantity: 1, unitPrice: 800 },
                { service: 'Sun Study', description: 'Different times of day (3 variations)', quantity: 1, unitPrice: 600 }
            ]
        },
        'animation': {
            name: '3D Animation Package',
            basePrice: 10000,
            items: [
                { service: 'Storyboard Creation', description: 'Camera path and scene planning', quantity: 1, unitPrice: 800 },
                { service: '3D Walkthrough Animation', description: '60-second architectural animation @ $200/sec', quantity: 60, unitPrice: 200 },
                { service: 'Color Grading', description: 'Professional post-production', quantity: 1, unitPrice: 700 },
                { service: 'Sound Design', description: 'Background music and sound effects', quantity: 1, unitPrice: 500 }
            ]
        }
    };
};

/**
 * Create a sample quotation from quote form data
 */
export const createQuotationFromFormData = (formData: any): Partial<QuotationData> => {
    const packages = getServicePackages();
    const selectedPackage = packages[formData.serviceType as keyof typeof packages] || packages['exterior-rendering'];

    const items: QuotationItem[] = selectedPackage.items.map((item, index) => ({
        id: `item-${index}`,
        service: item.service,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice
    }));

    const totals = calculateQuotationTotals(items, 10, 'percentage', 0);

    return {
        clientName: formData.name,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        clientCompany: formData.company,
        projectType: formData.projectType,
        serviceType: formData.serviceType,
        projectTimeline: formData.timeline,
        items,
        subtotal: totals.subtotal,
        discount: 10,
        discountType: 'percentage',
        taxRate: 0,
        total: totals.total,
        notes: formData.projectDetails,
        termsAndConditions: getDefaultTermsAndConditions()
    };
};

/**
 * Generate a complete sample quotation for testing/demo
 */
export const generateSampleQuotation = (): QuotationData => {
    const packages = getServicePackages();
    const selectedPackage = packages['exterior-rendering'];

    const items: QuotationItem[] = selectedPackage.items.map((item, index) => ({
        id: `item-${index}`,
        service: item.service,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice
    }));

    const totals = calculateQuotationTotals(items, 10, 'percentage', 8);

    return {
        // Company Information
        companyName: 'Ember Visualization Studio',
        companyAddress: '123 Creative Avenue, Los Angeles, CA 90001',
        companyPhone: '+1 (555) 123-4567',
        companyEmail: 'hello@emberstudio.com',
        companyWebsite: 'www.emberstudio.com',

        // Client Information
        clientName: 'John Smith',
        clientCompany: 'Smith Development Group',
        clientEmail: 'john@smithdevelopment.com',
        clientPhone: '+1 (555) 987-6543',
        clientAddress: '456 Builder Lane, San Francisco, CA 94102',

        // Quotation Details
        quotationNumber: generateQuotationNumber(),
        quotationDate: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        projectType: 'Residential',
        serviceType: 'Exterior Rendering',

        // Items
        items,

        // Pricing
        subtotal: totals.subtotal,
        discount: 10,
        discountType: 'percentage',
        taxRate: 8,
        total: totals.total,

        // Terms & Notes
        projectTimeline: '3-4 weeks',
        paymentTerms: '50% deposit required to begin work, 50% upon final delivery',
        notes: 'Thank you for considering our services. We look forward to working with you on this exciting project.',
        termsAndConditions: getDefaultTermsAndConditions()
    };
};

/**
 * Convert quotation to plain text for email/Telegram
 */
export const quotationToPlainText = (quotation: QuotationData): string => {
    let text = `📋 QUOTATION #${quotation.quotationNumber}\n\n`;
    text += `FROM: ${quotation.companyName}\n`;
    text += `TO: ${quotation.clientName}`;
    if (quotation.clientCompany) text += ` (${quotation.clientCompany})`;
    text += `\n\n`;
    text += `Project: ${quotation.projectType} - ${quotation.serviceType}\n`;
    text += `Timeline: ${quotation.projectTimeline || 'TBD'}\n\n`;
    text += `SERVICES:\n`;
    
    quotation.items.forEach((item, index) => {
        text += `${index + 1}. ${item.service} - ${item.quantity} x $${item.unitPrice.toFixed(2)} = $${item.total.toFixed(2)}\n`;
        text += `   ${item.description}\n`;
    });
    
    text += `\n`;
    text += `Subtotal: $${quotation.subtotal.toFixed(2)}\n`;
    if (quotation.discount) {
        text += `Discount: -$${(quotation.subtotal - (quotation.total / (1 + (quotation.taxRate || 0) / 100))).toFixed(2)}\n`;
    }
    if (quotation.taxRate) {
        text += `Tax: $${(quotation.total - (quotation.subtotal - (quotation.discount || 0))).toFixed(2)}\n`;
    }
    text += `TOTAL: $${quotation.total.toFixed(2)}\n\n`;
    text += `Valid until: ${formatDate(quotation.validUntil)}\n`;
    text += `Payment Terms: ${quotation.paymentTerms || '50% deposit, 50% on completion'}`;
    
    return text;
};

/**
 * Download quotation as PDF (requires html2pdf or similar library)
 */
export const downloadQuotationAsPDF = async (elementId: string, filename: string): Promise<void> => {
    // This would use a library like html2pdf.js or jspdf
    // Implementation depends on your chosen PDF generation library
    console.log('Download PDF:', elementId, filename);
    
    // Example with html2pdf.js:
    // const element = document.getElementById(elementId);
    // if (element) {
    //     const opt = {
    //         margin: 0.5,
    //         filename: `${filename}.pdf`,
    //         image: { type: 'jpeg', quality: 0.98 },
    //         html2canvas: { scale: 2 },
    //         jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    //     };
    //     await html2pdf().set(opt).from(element).save();
    // }
};

/**
 * Send quotation via email
 */
export const sendQuotationViaEmail = async (
    quotation: QuotationData,
    recipientEmail: string,
    subject?: string,
    message?: string
): Promise<boolean> => {
    const defaultSubject = `Quotation #${quotation.quotationNumber} - ${quotation.serviceType}`;
    const defaultMessage = `Dear ${quotation.clientName},\n\nPlease find attached your quotation for ${quotation.serviceType}.\n\nTotal Amount: $${quotation.total.toFixed(2)}\n\nThis quotation is valid until ${formatDate(quotation.validUntil)}.\n\nIf you have any questions, please don't hesitate to contact us.\n\nBest regards,\n${quotation.companyName}`;

    // Implementation depends on your email service
    // Could use FormSpree, EmailJS, SendGrid, etc.
    console.log('Send email to:', recipientEmail);
    console.log('Subject:', subject || defaultSubject);
    console.log('Message:', message || defaultMessage);
    
    return true;
};

/**
 * Send quotation via Telegram
 */
export const sendQuotationViaTelegram = async (
    quotation: QuotationData,
    botToken: string,
    chatId: string
): Promise<boolean> => {
    const message = quotationToPlainText(quotation);
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown',
            }),
        });

        return response.ok;
    } catch (error) {
        console.error('Error sending to Telegram:', error);
        return false;
    }
};

/**
 * Validate quotation data
 */
export const validateQuotation = (quotation: QuotationData): string[] => {
    const errors: string[] = [];

    if (!quotation.clientName) errors.push('Client name is required');
    if (!quotation.clientEmail) errors.push('Client email is required');
    if (!quotation.quotationNumber) errors.push('Quotation number is required');
    if (!quotation.quotationDate) errors.push('Quotation date is required');
    if (!quotation.validUntil) errors.push('Validity date is required');
    if (quotation.items.length === 0) errors.push('At least one service item is required');
    if (quotation.total <= 0) errors.push('Total amount must be greater than zero');

    return errors;
};
