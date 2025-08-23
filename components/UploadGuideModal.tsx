import React from 'react';
import { CloseIcon } from './icons';

interface UploadGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

const UploadGuideModal: React.FC<UploadGuideModalProps> = ({ isOpen, onClose, onProceed }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white rounded-lg shadow-2xl z-50 w-[95vw] max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex justify-between items-center p-6 border-b border-gray-700 bg-gray-800">
          <h2 className="text-2xl font-playfair">File Upload Guide for Engraving</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <CloseIcon />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-grow p-8 prose prose-invert lg:prose-lg max-w-none overflow-y-auto">
          <p>For a perfect engraving, please review these critical guidelines before uploading your <strong>.PNG</strong> or <strong>.SVG</strong> file.</p>
          
          <h3>SVG Rules (Best for Logos &amp; Text)</h3>
          <ul>
            <li><strong>MUST convert text to outlines/paths.</strong> This prevents font errors.</li>
            <li><strong>MUST combine overlapping shapes.</strong> Overlaps will burn too dark.</li>
            <li><strong>Keep designs simple.</strong> Very complex files may not engrave cleanly.</li>
          </ul>

          <h3>PNG Rules (Best for Photos)</h3>
          <ul>
            <li><strong>MUST have a Transparent Background.</strong> White or colored backgrounds will be engraved.</li>
            <li><strong>Use high resolution (300 DPI recommended).</strong> Low-quality images will look blurry.</li>
            <li><strong>Use high-contrast Black &amp; White.</strong> The laser only engraves the black parts of the image.</li>
          </ul>

          <p className="mt-6">
            <strong>Remember: Bolder is better!</strong> Extremely thin lines or tiny details may get lost. The maximum file size is <strong>5MB</strong>.
          </p>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 border-t border-gray-700">
            <button
                onClick={onProceed}
                className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-lg font-semibold"
            >
                I Understand &amp; Proceed
            </button>
        </div>
      </div>
    </>
  );
};

export default UploadGuideModal;