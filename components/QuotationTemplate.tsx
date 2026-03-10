import React from 'react';
import { 
    Check, 
    FileText, 
    Calendar, 
    DollarSign, 
    Clock, 
    User, 
    Mail, 
    Phone, 
    Building2, 
    ClipboardList,
    Download,
    Send,
    Printer
} from 'lucide-react';

export interface QuotationItem {
    id: string;
    service: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface QuotationData {
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

interface QuotationTemplateProps {
    quotation: QuotationData;
    onDownload?: () => void;
    onSend?: () => void;
    onPrint?: () => void;
    isPreview?: boolean;
}

const QuotationTemplate: React.FC<QuotationTemplateProps> = ({
    quotation,
    onDownload,
    onSend,
    onPrint,
    isPreview = false
}) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calculateDiscount = () => {
        if (!quotation.discount) return 0;
        if (quotation.discountType === 'percentage') {
            return quotation.subtotal * (quotation.discount / 100);
        }
        return quotation.discount;
    };

    const calculateTax = () => {
        if (!quotation.taxRate) return 0;
        const afterDiscount = quotation.subtotal - calculateDiscount();
        return afterDiscount * (quotation.taxRate / 100);
    };

    const discountAmount = calculateDiscount();
    const taxAmount = calculateTax();

    return (
        <div className="min-h-screen bg-neutral-100 py-8 px-4">
            {/* Action Buttons - Hidden when printing */}
            {!isPreview && (
                <div className="max-w-4xl mx-auto mb-6 flex gap-3 justify-end print:hidden">
                    {onDownload && (
                        <button
                            onClick={onDownload}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                        >
                            <Download size={18} />
                            Download PDF
                        </button>
                    )}
                    {onSend && (
                        <button
                            onClick={onSend}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Send size={18} />
                            Send to Client
                        </button>
                    )}
                    {onPrint && (
                        <button
                            onClick={onPrint}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 transition-colors"
                        >
                            <Printer size={18} />
                            Print
                        </button>
                    )}
                </div>
            )}

            {/* Quotation Document */}
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg print:shadow-none print:rounded-none">
                {/* Header */}
                <div className="bg-neutral-900 text-white px-8 py-10 rounded-t-lg print:rounded-none print:bg-neutral-900 print:text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            {quotation.companyLogo && (
                                <img 
                                    src={quotation.companyLogo} 
                                    alt={quotation.companyName}
                                    className="h-12 mb-4 print:h-10"
                                />
                            )}
                            <h1 className="text-3xl font-bold mb-2 print:text-2xl">{quotation.companyName}</h1>
                            <div className="text-neutral-300 space-y-1 text-sm print:text-neutral-400">
                                <p>{quotation.companyAddress}</p>
                                <p>{quotation.companyPhone} | {quotation.companyEmail}</p>
                                <p>{quotation.companyWebsite}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-4xl font-light mb-2 print:text-3xl">QUOTATION</h2>
                            <div className="text-neutral-300 space-y-1 text-sm print:text-neutral-400">
                                <p><span className="text-neutral-500">Quote #:</span> {quotation.quotationNumber}</p>
                                <p><span className="text-neutral-500">Date:</span> {formatDate(quotation.quotationDate)}</p>
                                <p><span className="text-neutral-500">Valid Until:</span> {formatDate(quotation.validUntil)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Client Info */}
                <div className="px-8 py-6 border-b border-neutral-200 print:border-neutral-300">
                    <div className="flex gap-8">
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3 print:text-neutral-600">
                                Quotation For
                            </h3>
                            <div className="space-y-1">
                                <p className="text-lg font-medium text-neutral-900 print:text-black">{quotation.clientName}</p>
                                {quotation.clientCompany && (
                                    <p className="text-neutral-700 print:text-neutral-800">{quotation.clientCompany}</p>
                                )}
                                {quotation.clientAddress && (
                                    <p className="text-neutral-600 print:text-neutral-700">{quotation.clientAddress}</p>
                                )}
                                <div className="flex gap-4 text-neutral-600 print:text-neutral-700 text-sm mt-2">
                                    <span className="flex items-center gap-1">
                                        <Mail size={14} />
                                        {quotation.clientEmail}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Phone size={14} />
                                        {quotation.clientPhone}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 border-l border-neutral-200 pl-8 print:border-neutral-300">
                            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3 print:text-neutral-600">
                                Project Details
                            </h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-neutral-700 print:text-neutral-800">
                                    <Building2 size={16} className="text-neutral-400 print:text-neutral-500" />
                                    <span className="font-medium">Project Type:</span>
                                    <span>{quotation.projectType}</span>
                                </div>
                                <div className="flex items-center gap-2 text-neutral-700 print:text-neutral-800">
                                    <ClipboardList size={16} className="text-neutral-400 print:text-neutral-500" />
                                    <span className="font-medium">Service:</span>
                                    <span>{quotation.serviceType}</span>
                                </div>
                                {quotation.projectTimeline && (
                                    <div className="flex items-center gap-2 text-neutral-700 print:text-neutral-800">
                                        <Clock size={16} className="text-neutral-400 print:text-neutral-500" />
                                        <span className="font-medium">Timeline:</span>
                                        <span>{quotation.projectTimeline}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services Table */}
                <div className="px-8 py-6">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4 print:text-black">Services Breakdown</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-neutral-200 print:border-neutral-300">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-600 print:text-neutral-700">Service</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-600 print:text-neutral-700">Description</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-neutral-600 print:text-neutral-700">Qty</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-600 print:text-neutral-700">Unit Price</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-600 print:text-neutral-700">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quotation.items.map((item, index) => (
                                    <tr 
                                        key={item.id} 
                                        className={`border-b border-neutral-100 print:border-neutral-200 ${
                                            index % 2 === 0 ? 'bg-neutral-50/50 print:bg-white' : 'bg-white print:bg-white'
                                        }`}
                                    >
                                        <td className="py-4 px-4 text-neutral-900 print:text-black font-medium">{item.service}</td>
                                        <td className="py-4 px-4 text-neutral-600 print:text-neutral-700">{item.description}</td>
                                        <td className="py-4 px-4 text-neutral-600 print:text-neutral-700 text-center">{item.quantity}</td>
                                        <td className="py-4 px-4 text-neutral-600 print:text-neutral-700 text-right">
                                            {formatCurrency(item.unitPrice)}
                                        </td>
                                        <td className="py-4 px-4 text-neutral-900 print:text-black text-right font-medium">
                                            {formatCurrency(item.total)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary */}
                <div className="px-8 py-6 bg-neutral-50 print:bg-neutral-100">
                    <div className="flex justify-end">
                        <div className="w-full max-w-sm space-y-3">
                            <div className="flex justify-between text-neutral-600 print:text-neutral-700">
                                <span>Subtotal:</span>
                                <span className="font-medium">{formatCurrency(quotation.subtotal)}</span>
                            </div>
                            {quotation.discount && (
                                <div className="flex justify-between text-green-600 print:text-green-700">
                                    <span>
                                        Discount ({quotation.discountType === 'percentage' ? `${quotation.discount}%` : 'Fixed'}):
                                    </span>
                                    <span className="font-medium">-{formatCurrency(discountAmount)}</span>
                                </div>
                            )}
                            {quotation.taxRate && (
                                <div className="flex justify-between text-neutral-600 print:text-neutral-700">
                                    <span>Tax ({quotation.taxRate}%):</span>
                                    <span className="font-medium">{formatCurrency(taxAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-neutral-900 print:text-black border-t-2 border-neutral-300 print:border-neutral-400 pt-3">
                                <span className="text-lg font-bold">Total:</span>
                                <span className="text-2xl font-bold">{formatCurrency(quotation.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes & Terms */}
                {(quotation.notes || quotation.termsAndConditions) && (
                    <div className="px-8 py-6 border-t border-neutral-200 print:border-neutral-300">
                        {quotation.notes && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-2 print:text-neutral-600">
                                    Notes
                                </h3>
                                <p className="text-neutral-600 print:text-neutral-700">{quotation.notes}</p>
                            </div>
                        )}
                        {quotation.termsAndConditions && quotation.termsAndConditions.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-2 print:text-neutral-600">
                                    Terms & Conditions
                                </h3>
                                <ul className="space-y-2">
                                    {quotation.termsAndConditions.map((term, index) => (
                                        <li key={index} className="flex items-start gap-2 text-neutral-600 print:text-neutral-700 text-sm">
                                            <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>{term}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="px-8 py-6 bg-neutral-50 border-t border-neutral-200 rounded-b-lg print:bg-neutral-100 print:border-neutral-300 print:rounded-none">
                    <div className="text-center text-neutral-500 print:text-neutral-600 text-sm">
                        <p className="font-medium mb-2">Thank you for considering our services!</p>
                        <p>This quotation is valid until {formatDate(quotation.validUntil)}.</p>
                        <p className="mt-2">Questions? Contact us at {quotation.companyEmail} or {quotation.companyPhone}</p>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    @page {
                        margin: 0.5in;
                        size: letter;
                    }
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                }
            `}</style>
        </div>
    );
};

export default QuotationTemplate;
