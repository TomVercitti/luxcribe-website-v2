import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { pageContent } from '../constants';

interface StaticContentPageProps {
  pageKey: keyof typeof pageContent;
}

const StaticContentPage: React.FC<StaticContentPageProps> = ({ pageKey }) => {
  const page = pageContent[pageKey];

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-playfair">Page Not Found</h1>
        <Link to="/" className="mt-4 inline-block text-indigo-400 hover:text-indigo-300">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 py-16">
        <div className="container mx-auto px-4">
            <div className="prose prose-invert lg:prose-xl mx-auto">
                <h1>{page.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: page.content }} />
            </div>
        </div>
    </div>
  );
};

export default StaticContentPage;
