import React from 'react';

const iconProps = {
  className: "w-6 h-6",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round" as "round",
  strokeLinejoin: "round" as "round",
};

export const CartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24" strokeWidth="1.5">
    <path d="M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
  </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export const Spinner: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`animate-spin rounded-full border-4 border-t-4 border-gray-500 border-t-indigo-400 ${className || 'h-10 w-10'}`} />
);

// Text Align Icons
export const AlignLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <line x1="17" y1="10" x2="3" y2="10"></line>
        <line x1="21" y1="6" x2="3" y2="6"></line>
        <line x1="21" y1="14" x2="3" y2="14"></line>
        <line x1="17" y1="18" x2="3" y2="18"></line>
    </svg>
);

export const AlignCenterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <line x1="18" y1="10" x2="6" y2="10"></line>
        <line x1="21" y1="6" x2="3" y2="6"></line>
        <line x1="21" y1="14" x2="3" y2="14"></line>
        <line x1="18" y1="18" x2="6" y2="18"></line>
    </svg>
);

export const AlignRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <line x1="21" y1="10" x2="7" y2="10"></line>
        <line x1="21" y1="6" x2="3" y2="6"></line>
        <line x1="21" y1="14" x2="3" y2="14"></line>
        <line x1="21" y1="18" x2="7" y2="18"></line>
    </svg>
);

// Text Style Icons
export const BoldIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className}><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>
);

export const ItalicIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className}><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>
);

export const UnderlineIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className}><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path><line x1="4" y1="21" x2="20" y2="21"></line></svg>
);


// Text Effects Icons
export const CurveTextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <path d="M3,12 A9,9 0 0,1 21,12"></path>
        <text x="5" y="10" fontSize="4" fill="currentColor">T</text>
        <text x="10.5" y="8.5" fontSize="4" fill="currentColor">E</text>
        <text x="16" y="10" fontSize="4" fill="currentColor">X</text>
        <text x="19" y="12" fontSize="4" fill="currentColor">T</text>
    </svg>
);

// History Icons
export const UndoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <path d="M9 14 4 9l5-5"/>
        <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/>
    </svg>
);

export const RedoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <path d="m15 14 5-5-5-5"/>
        <path d="M19.5 9H9a5.5 5.5 0 0 0-5.5 5.5v0A5.5 5.5 0 0 0 9 20h2"/>
    </svg>
);

// Arrange Icons
export const BringToFrontIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M4 16V4a2 2 0 0 1 2-2h10" />
    </svg>
);

export const SendToBackIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <rect x="4" y="4" width="12" height="12" rx="2" />
        <path d="M12 20h6a2 2 0 0 0 2-2V8" />
    </svg>
);

export const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

export const MailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

export const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className} viewBox="0 0 24 24" stroke="currentColor" fill="currentColor">
        <path d="M9.1,2.5L8,5.3L5.2,6.4l2.8,1.1l1.1,2.8l1.1-2.8l2.8-1.1L10.2,5.3L9.1,2.5z M18.1,9.5L17,12.3l-2.8,1.1l2.8,1.1 l1.1,2.8l1.1-2.8l2.8-1.1l-2.8-1.1L18.1,9.5z M14.1,2.5L13,5.3l-2.8,1.1l2.8,1.1l1.1,2.8l1.1-2.8l2.8-1.1L15.2,5.3L14.1,2.5z"/>
    </svg>
);

export const StarIcon: React.FC<{ className?: string; filled?: boolean }> = ({ className, filled = true }) => (
    <svg 
      viewBox="0 0 24 24" 
      className={className || iconProps.className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? "1" : "2"}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
    </svg>
);

export const CogIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className} fill="currentColor" strokeWidth="0">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.58-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.49.49 0 0 0-.48-.44H9.24a.49.49 0 0 0-.48.44l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.58.22l-1.92 3.32a.49.49 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32a.49.49 0 0 0 .58.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54a.49.49 0 0 0 .48.44h3.84a.49.49 0 0 0 .48-.44l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96a.49.49 0 0 0 .58-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.03-1.58zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/>
  </svg>
);