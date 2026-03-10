import React, { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { QuotationData, QuotationItem } from './QuotationTemplate';

interface QuotationBuilderProps {
    onSave: (quotation: QuotationData) => void;
    onCancel: () => void;
    initialData?: Partial<QuotationData>;
}

const QuotationBuilder: React.FC<QuotationBuilderProps> = ({
    onSave,
    onCancel,
    initialData
}) => {
    const [formData, setFormData] = useState<QuotationData>({
        // Company Information
        companyName: initialData?.companyName || 'Your Company Name',
        companyAddress: initialData?.companyAddress || '123 Business Street, City, State 12345',
        companyPhone: initialData?.companyPhone || '+1 (555) 123-4567',
        companyEmail: initialData?.companyEmail || 'hello@yourcompany.com',
        companyWebsite: initialData?.companyWebsite || 'www.yourcompany.com',
        companyLogo: initialData?.companyLogo,

        // Client Information
        clientName: initialData?.clientName || '',
        clientCompany: initialData?.clientCompany || '',
        clientEmail: initialData?.clientEmail || '',
        clientPhone: initialData?.clientPhone || '',
        clientAddress: initialData?.clientAddress || '',

        // Quotation Details
        quotationNumber: initialData?.quotationNumber || `QT-${Date.now().toString().slice(-6)}`,
        quotationDate: initialData?.quotationDate || new Date().toISOString().split('T')[0],
        validUntil: initialData?.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        projectType: initialData?.projectType || '',
        serviceType: initialData?.serviceType || '',

        // Items
        items: initialData?.items || [],

        // Pricing
        subtotal: initialData?.subtotal || 0,
        discount: initialData?.discount,
        discountType: initialData?.discountType || 'percentage',
        taxRate: initialData?.taxRate || 0,
        total: initialData?.total || 0,

        // Terms & Notes
        projectTimeline: initialData?.projectTimeline || '',
        paymentTerms: initialData?.paymentTerms || '50% upfront, 50% upon completion',
        notes: initialData?.notes || '',
        termsAndConditions: initialData?.termsAndConditions || [
            'This quotation is valid for 30 days from the date of issue',
            'Payment terms: 50% deposit required to begin work',
            'Final delivery upon receipt of final payment',
            'Revisions beyond agreed scope may incur additional charges'
        ]
    });

    const [newItem, setNewItem] = useState<Partial<QuotationItem>>({
        service: '',
        description: '',
        quantity: 1,
        unitPrice: 0
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addItem = () => {
        if (!newItem.service || !newItem.description) return;
        
        const item: QuotationItem = {
            id: `item-${Date.now()}`,
            service: newItem.service || '',
            description: newItem.description || '',
            quantity: newItem.quantity || 1,
            unitPrice: newItem.unitPrice || 0,
            total: (newItem.quantity || 1) * (newItem.unitPrice || 0)
        };

        setFormData(prev => ({
            ...prev,
            items: [...prev.items, item]
        }));

        setNewItem({
            service: '',
            description: '',
            quantity: 1,
            unitPrice: 0
        });
    };

    const removeItem = (id: string) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== id)
        }));
    };

    const calculateTotals = () => {
        const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
        const discountAmount = formData.discount 
            ? (formData.discountType === 'percentage' 
                ? subtotal * (formData.discount / 100)
                : formData.discount)
            : 0;
        const afterDiscount = subtotal - discountAmount;
        const taxAmount = formData.taxRate ? afterDiscount * (formData.taxRate / 100) : 0;
        const total = afterDiscount + taxAmount;

        setFormData(prev => ({
            ...prev,
            subtotal,
            total
        }));
    };

    const handleSave = () => {
        calculateTotals();
        onSave(formData);
    };

    return (
        <div className="bg-neutral-900 text-white p-6 rounded-lg max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Create Quotation</h2>
                <div className="flex gap-2">
                    <button
                        onClick={handleSave}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors"
                    >
                        <Save size={18} />
                        Save Quotation
                    </button>
                    <button
                        onClick={onCancel}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
                    >
                        <X size={18} />
                        Cancel
                    </button>
                </div>
            </div>

            {/* Company Information */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-neutral-300">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Company Name"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                    />
                    <input
                        type="text"
                        name="companyEmail"
                        value={formData.companyEmail}
                        onChange={handleInputChange}
                        placeholder="Company Email"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                    />
                    <input
                        type="text"
                        name="companyPhone"
                        value={formData.companyPhone}
                        onChange={handleInputChange}
                        placeholder="Company Phone"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                    />
                    <input
                        type="text"
                        name="companyWebsite"
                        value={formData.companyWebsite}
                        onChange={handleInputChange}
                        placeholder="Company Website"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                    />
                    <input
                        type="text"
                        name="companyAddress"
                        value={formData.companyAddress}
                        onChange={handleInputChange}
                        placeholder="Company Address"
                        className="w-full md:col-span-2 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                    />
                </div>
            </div>

            {/* Client Information */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-neutral-300">Client Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleInputChange}
                        placeholder="Client Name *"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                    />
                    <input
                        type="text"
                        name="clientCompany"
                        value={formData.clientCompany}
                        onChange={handleInputChange}
                        placeholder="Client Company"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                    />
                    <input
                        type="email"
                        name="clientEmail"
                        value={formData.clientEmail}
                        onChange={handleInputChange}
                        placeholder="Client Email *"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                    />
                    <input
                        type="tel"
                        name="clientPhone"
                        value={formData.clientPhone}
                        onChange={handleInputChange}
                        placeholder="Client Phone"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                    />
                    <input
                        type="text"
                        name="clientAddress"
                        value={formData.clientAddress}
                        onChange={handleInputChange}
                        placeholder="Client Address"
                        className="w-full md:col-span-2 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                    />
                </div>
            </div>

            {/* Quotation Details */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-neutral-300">Quotation Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        name="quotationNumber"
                        value={formData.quotationNumber}
                        onChange={handleInputChange}
                        placeholder="Quotation Number"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                    />
                    <input
                        type="date"
                        name="quotationDate"
                        value={formData.quotationDate}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30"
                    />
                    <input
                        type="date"
                        name="validUntil"
                        value={formData.validUntil}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30"
                    />
                    <input
                        type="text"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        placeholder="Project Type (e.g., Residential)"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                    />
                    <input
                        type="text"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        placeholder="Service Type (e.g., Exterior Rendering)"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                    />
                    <input
                        type="text"
                        name="projectTimeline"
                        value={formData.projectTimeline}
                        onChange={handleInputChange}
                        placeholder="Timeline (e.g., 2-3 weeks)"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                    />
                </div>
            </div>

            {/* Service Items */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-neutral-300">Service Items</h3>
                
                {/* Add Item Form */}
                <div className="bg-neutral-800 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <input
                            type="text"
                            value={newItem.service || ''}
                            onChange={(e) => setNewItem(prev => ({ ...prev, service: e.target.value }))}
                            placeholder="Service Name"
                            className="bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                        />
                        <input
                            type="text"
                            value={newItem.description || ''}
                            onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Description"
                            className="md:col-span-2 bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                        />
                        <input
                            type="number"
                            value={newItem.quantity || 1}
                            onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                            placeholder="Qty"
                            className="bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                        />
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={newItem.unitPrice || 0}
                                onChange={(e) => setNewItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                                placeholder="Price"
                                className="flex-1 bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                            />
                            <button
                                onClick={addItem}
                                className="px-3 py-2 bg-white text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Items List */}
                <div className="space-y-2">
                    {formData.items.map((item) => (
                        <div key={item.id} className="bg-neutral-800 rounded-lg p-4 flex justify-between items-center">
                            <div className="flex-1">
                                <p className="font-medium">{item.service}</p>
                                <p className="text-sm text-neutral-400">{item.description}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-neutral-400">Qty: {item.quantity}</span>
                                <span className="text-white font-medium">${item.total.toFixed(2)}</span>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {formData.items.length === 0 && (
                        <p className="text-neutral-500 text-center py-4">No items added yet</p>
                    )}
                </div>
            </div>

            {/* Pricing */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-neutral-300">Pricing</h3>
                <div className="bg-neutral-800 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-neutral-400 mb-2">Discount</label>
                            <input
                                type="number"
                                name="discount"
                                value={formData.discount || ''}
                                onChange={handleInputChange}
                                placeholder="0"
                                className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-2">Discount Type</label>
                            <select
                                name="discountType"
                                value={formData.discountType}
                                onChange={handleInputChange}
                                className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount ($)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-2">Tax Rate (%)</label>
                            <input
                                type="number"
                                name="taxRate"
                                value={formData.taxRate || ''}
                                onChange={handleInputChange}
                                placeholder="0"
                                className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                            />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-neutral-700 flex justify-end">
                        <div className="text-right">
                            <p className="text-neutral-400 mb-1">Subtotal: <span className="text-white">${formData.subtotal.toFixed(2)}</span></p>
                            {formData.discount && (
                                <p className="text-green-400 mb-1">
                                    Discount: <span className="text-white">-${(formData.discountType === 'percentage' 
                                        ? formData.subtotal * (formData.discount / 100) 
                                        : formData.discount).toFixed(2)}</span>
                                </p>
                            )}
                            {formData.taxRate && (
                                <p className="text-neutral-400 mb-1">Tax: <span className="text-white">${((formData.subtotal - (formData.discount 
                                    ? (formData.discountType === 'percentage' 
                                        ? formData.subtotal * (formData.discount / 100) 
                                        : formData.discount) 
                                    : 0)) * (formData.taxRate / 100)).toFixed(2)}</span></p>
                            )}
                            <p className="text-xl font-bold text-white mt-2">Total: ${formData.total.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notes & Terms */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-neutral-300">Notes & Terms</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-neutral-400 mb-2">Additional Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder="Any additional notes for the client..."
                            rows={3}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-neutral-400 mb-2">Payment Terms</label>
                        <textarea
                            name="paymentTerms"
                            value={formData.paymentTerms}
                            onChange={handleInputChange}
                            placeholder="Payment terms..."
                            rows={2}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 resize-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuotationBuilder;
