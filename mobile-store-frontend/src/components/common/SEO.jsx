/**
 * Declarative SEO Component
 * Module: components/common/SEO.jsx
 * 
 * Reusable SEO tag wrapper applying dynamic titles, canonical tags,
 * and social graph tags across storefront pages.
 */

import React from 'react';
import useSEO from '../../hooks/useSEO';

export const SEO = ({
  title,
  description,
  image,
  url,
  type = 'website',
  keywords,
}) => {
  useSEO({
    title,
    description,
    image,
    url,
    type,
    keywords,
  });

  return null;
};

export default SEO;
