
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { FileCheck, FileText, Download, Printer, Search, ArrowRight, Eye } from 'lucide-react';
import { api, Certificate, CertificateGenerationRequest } from '../services/api';

export const Certificates: React.FC = () => {
  const [activeStep, setActiveStep] = useState<'selection' | 'form' | 'preview'>('selection');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [personId, setPersonId] = useState('');
  const [purpose, setPurpose] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [generatedCertificate, setGeneratedCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const certs = await api.getCertificates();
        setCertificates(certs);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      }
    };
    fetchCertificates();
  }, []);

  const certTypes = [
    { id: 'CHARACTER_CERTIFICATE', title: 'Character Certificate', description: 'Certified conduct verification for employment.' },
    { id: 'RESIDENCE_CERTIFICATE', title: 'Residency Certificate', description: 'Proof of village residence for banking and legal use.' },
    { id: 'INCOME_CERTIFICATE', title: 'Income Certification', description: 'Verification of household income levels.' },
    { id: 'FAMILY_CERTIFICATE', title: 'Family Certificate', description: 'Family relationship verification document.' },
  ];

  const handleGenerate = async () => {
    if (!personId || !selectedType) return;
    
    setLoading(true);
    try {
      // In a real app, you'd get the grama niladhari ID from auth context
      const gramaNiladhariId = 'GN001'; // This should come from auth
      
      const request: CertificateGenerationRequest = {
        personId,
        certificateType: selectedType as any,
        purpose,
        additionalDetails,
        issuedById: gramaNiladhariId
      };
      
      const certificate = await api.generateCertificate(request);
      setGeneratedCertificate(certificate);
      setActiveStep('preview');
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Failed to generate certificate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!generatedCertificate) return;
    
    try {
      const blob = await api.downloadCertificatePdf(generatedCertificate.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate_${generatedCertificate.certificateNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download certificate PDF.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Certificates</h1>
          <p className="text-zinc-500 mt-1">Generate and manage official administrative documents.</p>
        </div>
      </div>

      {activeStep === 'selection' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certTypes.map((cert) => (
            <div 
              key={cert.id}
              onClick={() => { setSelectedType(cert.id); setActiveStep('form'); }}
              className="bg-white border border-zinc-200 rounded-xl p-6 hover:border-zinc-900 cursor-pointer transition-all group"
            >
              <div className="p-3 bg-zinc-50 rounded-lg w-fit text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                <FileCheck size={24} />
              </div>
              <h3 className="font-bold text-zinc-900 mt-6">{cert.title}</h3>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{cert.description}</p>
              <div className="mt-8 flex items-center text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 transition-colors">
                Generate Flow <ArrowRight size={12} className="ml-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeStep !== 'selection' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px]">
          <div className="bg-white border border-zinc-200 rounded-2xl p-8 flex flex-col">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-fit -ml-2 mb-6 text-zinc-400 hover:text-zinc-900"
              onClick={() => setActiveStep('selection')}
            >
              ← Back to selection
            </Button>
            
            <h2 className="text-xl font-bold text-zinc-900 mb-2">Issue {certTypes.find(c => c.id === selectedType)?.title}</h2>
            <p className="text-sm text-zinc-500 mb-8">Fill the required metadata to generate the digital certificate.</p>

            <form className="space-y-6 flex-1" onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Beneficiary NIC</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
                  <input 
                    className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900" 
                    placeholder="e.g. 198765432101"
                    value={personId}
                    onChange={(e) => setPersonId(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Purpose of Issuance</label>
                <textarea 
                  className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 h-24" 
                  placeholder="Mention the specific requirement..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Additional Details</label>
                <textarea 
                  className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 h-24" 
                  placeholder="Any additional information..."
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                />
              </div>

              <div className="pt-4 space-y-3">
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? 'Generating...' : 'Generate Certificate'}
                </Button>
                <p className="text-[10px] text-center text-zinc-400">Certificate will be generated and can be downloaded as PDF.</p>
              </div>
            </form>
          </div>

          <div className="bg-zinc-100 border border-zinc-200 rounded-2xl p-12 flex flex-col items-center justify-center relative overflow-hidden">
            {activeStep === 'form' ? (
              <div className="text-center space-y-4">
                <Eye size={48} className="text-zinc-300 mx-auto" />
                <p className="text-sm text-zinc-400">Live preview will appear here<br/>once form is filled.</p>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center animate-in zoom-in-95 duration-300">
                <div className="bg-white w-full max-w-[400px] h-[520px] shadow-2xl p-12 relative flex flex-col">
                  <div className="border-4 border-zinc-900/5 absolute inset-4" />
                  <div className="text-center mb-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Democratic Socialist Republic of Sri Lanka</h4>
                    <h5 className="text-[8px] font-bold uppercase tracking-widest text-zinc-300 mt-1">Village Administrative Division - Kotte</h5>
                  </div>
                  <div className="text-center space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest border-b border-zinc-900 pb-2 inline-block">
                      {generatedCertificate?.certificateType?.replace(/_/g, ' ') || 'Certificate'}
                    </h3>
                    <div className="text-left mt-8 space-y-2">
                      <p className="text-[10px] text-zinc-600 leading-relaxed">
                        Certificate Number: <strong>{generatedCertificate?.certificateNumber}</strong>
                      </p>
                      <p className="text-[10px] text-zinc-600 leading-relaxed">
                        This is to certify that <strong>{generatedCertificate?.personName}</strong>, 
                        holder of NIC {generatedCertificate?.personId}, is a resident of this area.
                      </p>
                      {generatedCertificate?.purpose && (
                        <p className="text-[10px] text-zinc-600 leading-relaxed mt-2">
                          <strong>Purpose:</strong> {generatedCertificate.purpose}
                        </p>
                      )}
                      {generatedCertificate?.additionalDetails && (
                        <p className="text-[10px] text-zinc-600 leading-relaxed mt-2">
                          <strong>Details:</strong> {generatedCertificate.additionalDetails}
                        </p>
                      )}
                      <p className="text-[10px] text-zinc-600 leading-relaxed mt-4">
                        Issued on: {generatedCertificate?.issuedDate ? new Date(generatedCertificate.issuedDate).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto flex justify-between items-end">
                    <div className="space-y-1">
                      <div className="w-20 h-px bg-zinc-900" />
                      <p className="text-[8px] font-bold uppercase tracking-tighter">
                        {generatedCertificate?.issuedByName || 'Grama Niladhari'}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                      <div className="w-6 h-6 border border-dashed border-zinc-300 rounded" />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex gap-3">
                  <Button variant="outline" className="gap-2 text-xs" onClick={handleDownloadPdf}>
                    <Download size={14} /> Download PDF
                  </Button>
                  <Button variant="outline" className="gap-2 text-xs" onClick={() => window.print()}>
                    <Printer size={14} /> Print
                  </Button>
                  <Button 
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 border-none"
                    onClick={() => {
                      setActiveStep('selection');
                      setPersonId('');
                      setPurpose('');
                      setAdditionalDetails('');
                      setGeneratedCertificate(null);
                    }}
                  >
                    Generate Another
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
