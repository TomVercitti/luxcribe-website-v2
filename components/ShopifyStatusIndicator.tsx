import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchShopInfo } from '../services/shopify';

const ShopifyStatusIndicator: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const info = await fetchShopInfo();
        if (info && info.name) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (e) {
        setStatus('error');
      }
    };
    checkStatus();
  }, []);

  const getStatusContent = () => {
    switch (status) {
      case 'success':
        return {
          color: 'bg-green-500',
          text: 'Shop Connected',
          title: 'Successfully connected to your Shopify store.',
        };
      case 'error':
        return {
          color: 'bg-red-500 animate-pulse',
          text: 'Shop Error',
          title: 'Could not connect to Shopify. Click for details.',
        };
      case 'loading':
      default:
        return {
          color: 'bg-gray-500 animate-pulse',
          text: 'Connecting...',
          title: 'Connecting to Shopify...',
        };
    }
  };

  const { color, text, title } = getStatusContent();

  return (
    <Link to="/about" title={title} className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors">
      <span className={`w-2 h-2 rounded-full ${color}`}></span>
      <span>{text}</span>
    </Link>
  );
};

export default ShopifyStatusIndicator;
