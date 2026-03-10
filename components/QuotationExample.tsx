import React, { useState } from 'react';
import QuotationTemplate, { QuotationData } from './QuotationTemplate';
import QuotationBuilder from './QuotationBuilder';
import { generateSampleQuotation, downloadQuotationAsPDF, sendQuotationViaEmail } from '../utils/quotationUtils';
import { FileText, Plus, Eye, Send } from 'lucide-react';

const QuotationExample: React.FC = () => {
    const [view, setView] = useState<'list' | 'builder' | 'preview'>('list');
    const [quotations, setQuotations] = useState<QuotationData[]>([]);
    const [selectedQuotation, setSelectedQuotation] = useState<QuotationData | null>(null);

    const handleCreateNew = () => {
        setSelectedQuotation(null);
        setView('builder');
    };

    const handleSaveQuotation = (quotation: QuotationData) => {
        if (selectedQuotation) {
            // Update existing
            setQuotations(prev => prev.map(q => 
                q.quotationNumber === selectedQuotation.quotationNumber ? quotation : q
            ));
        } else {
            // Add new
            setQuotations(prev => [...prev, quotation]);
        }
        setView('list');
        setSelectedQuotation(null);
    };

    const handleViewQuotation = (quotation: QuotationData) => {
        setSelectedQuotation(quotation);
        setView('preview');
    };

    const handleEditQuotation = (quotation: QuotationData) => {
        setSelectedQuotation(quotation);
        setView('builder');
    };

    const handleDeleteQuotation = (quotationNumber: string) => {
        if (confirm('Are you sure you want to delete this quotation?')) {
            setQuotations(prev => prev.filter(q => q.quotationNumber !== quotationNumber));
        }
    };

    const handleDownloadPDF = async () => {
        if (selectedQuotation) {
            await downloadQuotationAsPDF(
                'quotation-document', 
                `Quotation-${selectedQuotation.quotationNumber}`
            );
        }
    };

    const handleSendEmail = async () => {
        if (selectedQuotation) {
            const success = await sendQuotationViaEmail(
                selectedQuotation,
                selectedQuotation.clientEmail
            );
            if (success) {
                alert('Quotation sent successfully!');
            } else {
                alert('Failed to send quotation. Please check your email configuration.');
            }
        }
    };

    const handleLoadSample = () => {
        const sample = generateSampleQuotation();
        setQuotations(prev => [...prev, sample]);
        alert('Sample quotation generated!');
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-8">
            <div className="">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Quotations</h1>
                        <p className="text-neutral-400">Create and manage service quotations</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleLoadSample}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
                        >
                            <FileText size={18} />
                            Load Sample
                        </button>
                        <button
                            onClick={handleCreateNew}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors"
                        >
                            <Plus size={18} />
                            Create Quotation
                        </button>
                    </div>
                </div>

                {/* Quotations List */}
                {view === 'list' && (
                    <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-neutral-800">
                                    <tr>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-400">Quote #</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-400">Client</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-400">Service</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-400">Date</th>
                                        <th className="text-right py-4 px-6 text-sm font-semibold text-neutral-400">Amount</th>
                                        <th className="text-right py-4 px-6 text-sm font-semibold text-neutral-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-800">
                                    {quotations.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-12 text-center text-neutral-500">
                                                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                                                <p className="text-lg mb-2">No quotations yet</p>
                                                <p className="text-sm mb-4">Create your first quotation to get started</p>
                                                <button
                                                    onClick={handleCreateNew}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors"
                                                >
                                                    <Plus size={18} />
                                                    Create Quotation
                                                </button>
                                            </td>
                                        </tr>
                                    ) : (
                                        quotations.map((quote, index) => (
                                            <tr key={index} className="hover:bg-neutral-800/50 transition-colors">
                                                <td className="py-4 px-6 text-white font-medium">{quote.quotationNumber}</td>
                                                <td className="py-4 px-6">
                                                    <div>
                                                        <p className="text-white font-medium">{quote.clientName}</p>
                                                        {quote.clientCompany && (
                                                            <p className="text-neutral-500 text-sm">{quote.clientCompany}</p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-neutral-400">{quote.serviceType}</td>
                                                <td className="py-4 px-6 text-neutral-400">{new Date(quote.quotationDate).toLocaleDateString()}</td>
                                                <td className="py-4 px-6 text-right text-white font-medium">
                                                    ${quote.total.toFixed(2)}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleViewQuotation(quote)}
                                                            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
                                                            title="View"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditQuotation(quote)}
                                                            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <FileText size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteQuotation(quote.quotationNumber)}
                                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Send size={18} className="rotate-180" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Builder View */}
                {view === 'builder' && (
                    <div>
                        <button
                            onClick={() => setView('list')}
                            className="mb-4 text-neutral-400 hover:text-white transition-colors"
                        >
                            ← Back to List
                        </button>
                        <QuotationBuilder
                            onSave={handleSaveQuotation}
                            onCancel={() => setView('list')}
                            initialData={selectedQuotation || undefined}
                        />
                    </div>
                )}

                {/* Preview View */}
                {view === 'preview' && selectedQuotation && (
                    <div>
                        <div className="mb-4 flex gap-3">
                            <button
                                onClick={() => setView('list')}
                                className="text-neutral-400 hover:text-white transition-colors"
                            >
                                ← Back to List
                            </button>
                            <button
                                onClick={() => handleEditQuotation(selectedQuotation)}
                                className="text-neutral-400 hover:text-white transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDownloadPDF}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
                            >
                                Download PDF
                            </button>
                            <button
                                onClick={handleSendEmail}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Send size={18} />
                                Send to Client
                            </button>
                        </div>
                        <div id="quotation-document">
                            <QuotationTemplate
                                quotation={selectedQuotation}
                                isPreview={true}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuotationExample;
