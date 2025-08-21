import React, { useState, useRef } from 'react';
import UploadGuideModal from '../components/UploadGuideModal';
import { Spinner } from '../components/icons';

const CustomFormPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    description: '',
  });
  const [fileName, setFileName] = useState<string | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for submission handling
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submissionMessage, setSubmissionMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFileName(selectedFile.name);
    } else {
      setFileName(null);
    }
  };

  const handleProceedToUpload = () => {
    setIsGuideModalOpen(false);
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus('idle');
    setSubmissionMessage('');

    try {
      const response = await fetch('/.netlify/functions/quote-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, fileName }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmissionStatus('success');
        setSubmissionMessage(result.message);
        setFormData({ name: '', email: '', phone: '', company: '', description: '' });
        setFileName(null);
        if(fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setSubmissionStatus('error');
        setSubmissionMessage(result.message);
      }
    } catch (err) {
      console.error(err);
      setSubmissionStatus('error');
      setSubmissionMessage('There was an error submitting your request. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
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

        <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl">
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
              <label className="block text-sm font-medium text-gray-300">Your Design</label>
              <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                   <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <button
                    type="button"
                    onClick={() => setIsGuideModalOpen(true)}
                    className="font-medium text-indigo-400 hover:text-indigo-300 focus:outline-none"
                  >
                    Upload a file
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".png,.svg" />
                  <p className="text-xs text-gray-500">PNG or SVG up to 5MB</p>
                   {fileName && (
                    <p className="text-sm text-green-400 mt-2">Selected: {fileName}</p>
                   )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">Project Description</label>
              <textarea name="description" id="description" rows={6} required value={formData.description} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-indigo-500 focus:border-indigo-500" placeholder="Please describe your project, including materials, dimensions, and any other relevant details."></textarea>
            </div>

            {submissionStatus !== 'idle' && (
              <div className={`p-4 rounded-md text-center font-medium text-base ${
                  submissionStatus === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
              }`}>
                  {submissionMessage}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-gray-600 disabled:cursor-wait"
              >
                {isSubmitting ? <Spinner className="w-6 h-6" /> : 'Send Quote Request'}
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center">
                The form will submit directly to our team. If you've attached a file, please note only the file name is sent as a reference.
            </p>
          </form>
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
