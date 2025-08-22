import React, { useState, useRef } from 'react';
import { Spinner } from '../components/icons';
import UploadGuideModal from '../components/UploadGuideModal';

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

const CustomFormPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    description: '',
  });
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // State and ref for file upload functionality
  const [file, setFile] = useState<File | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setErrorMessage("File size cannot exceed 5MB.");
        handleClearFile();
      } else {
        setFile(selectedFile);
        setErrorMessage(""); // Clear previous errors
      }
    }
  };

  const handleClearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleProceedToUpload = () => {
    setIsGuideModalOpen(false);
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmissionState('submitting');
    setErrorMessage('');

    try {
        const response = await fetch("https://formspree.io/f/xpwlvrro", {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: new FormData(e.target as HTMLFormElement)
        });

        if (response.ok) {
            setSubmissionState('success');
            setFormData({ name: '', email: '', phone: '', company: '', description: '' });
            handleClearFile();
        } else {
            const data = await response.json();
            if (data.errors) {
                setErrorMessage(data.errors.map((error: any) => error.message).join(', '));
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
            setSubmissionState('error');
        }
    } catch (error) {
        setErrorMessage('Failed to send request. Please check your network connection.');
        setSubmissionState('error');
    }
  };

  const handleReset = () => {
    setSubmissionState('idle');
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair">Bulk &amp; Custom Quotes</h1>
          <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
            Have a large order, a corporate gift inquiry, or a completely unique idea? Fill out the form below, and we'll get back to you with a custom quote.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl min-h-[400px]">
          {submissionState === 'success' ? (
            <div className="text-center flex flex-col items-center justify-center h-full">
              <svg className="w-16 h-16 text-green-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-semibold text-green-300">Request Sent Successfully!</h2>
              <p className="mt-2 text-gray-300">Thank you for your inquiry. Our team will review your request and get back to you shortly.</p>
              <button
                onClick={handleReset}
                className="mt-8 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                    <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                    <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Phone Number</label>
                    <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300">Company (Optional)</label>
                    <input type="text" name="company" id="company" value={formData.company} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300">Project Description</label>
                  <textarea name="description" id="description" rows={6} required value={formData.description} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-indigo-500 focus:border-indigo-500" placeholder="Please describe your project, including materials, dimensions, quantity, and any other relevant details."></textarea>
                </div>
                
                <div>
                    <label htmlFor="attachment" className="block text-sm font-medium text-gray-300">Attach Design File (Optional)</label>
                    <div className="mt-1">
                        <button
                            type="button"
                            onClick={() => setIsGuideModalOpen(true)}
                            className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-3 px-4 rounded-md transition-colors text-center"
                        >
                            Choose File...
                        </button>
                        <input
                            type="file"
                            id="attachment"
                            name="attachment"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".png,.svg,.jpeg,.jpg,.pdf,.ai,.eps"
                        />
                    </div>
                    {file && (
                        <div className="mt-2 flex items-center justify-between text-sm bg-gray-900/50 p-2 rounded-md">
                            <span className="text-gray-300 truncate">
                                Selected: {file.name}
                            </span>
                            <button type="button" onClick={handleClearFile} className="ml-2 text-red-500 hover:text-red-400 font-semibold">
                                Remove
                            </button>
                        </div>
                    )}
                    <p className="mt-2 text-xs text-gray-500">Max file size: 5MB. Allowed types: PNG, SVG, JPG, PDF, AI, EPS.</p>
                </div>
                
                {errorMessage && (
                  <p className="text-center text-red-400 bg-red-900/30 p-3 rounded-md">{errorMessage}</p>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={submissionState === 'submitting'}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    {submissionState === 'submitting' ? (
                      <>
                        <Spinner className="w-6 h-6 mr-2" />
                        Sending...
                      </>
                    ) : (
                      'Send Quote Request'
                    )}
                  </button>
                </div>
            </form>
          )}
        </div>
      </div>
      <UploadGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onProceed={handleProceedToUpload}
      />
    </>
  );
};

export default CustomFormPage;