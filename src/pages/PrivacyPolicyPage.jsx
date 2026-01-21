/**
 * Public Privacy Policy Page
 * Content is managed from Admin > Settings > Legal
 */

import React from 'react';
import { ROUTES } from '@/constants';
import { Link } from 'react-router-dom';

const getLegalSettings = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem('legalSettings');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const PrivacyPolicyPage = () => {
  const legal = getLegalSettings();
  const content = legal?.privacyPolicy || 'The site owner has not provided a privacy policy yet.';
  const companyName = legal?.companyName || 'Salman Nasir';

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-3">Legal</p>
          <h1 className="text-3xl md:text-4xl font-bold text-font-primary mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500">
            Last updated by {companyName}
          </p>
        </div>

        <article className="prose prose-sm sm:prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
          {content}
        </article>

        <div className="mt-10 text-sm text-gray-500">
          <Link to={ROUTES.HOME} className="underline hover:text-primary">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

