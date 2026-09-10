/**
 * Dynamic SEO & Document Metadata Hook
 * Module: hooks/useSEO.js
 * 
 * Manages document title, meta tags, Open Graph tags, Twitter card tags,
 * and canonical link tags dynamically for seamless search indexing and social sharing.
 */

import { useEffect } from 'react';

const DEFAULT_TITLE = 'MS Mobiles | Flagship Smartphones & Exceptional Concierge';
const DEFAULT_DESCRIPTION = 'Explore premium flagship smartphones from Apple, Samsung, OnePlus, Nothing, Xiaomi, and Google. Official manufacturer warranty, direct trade-ins, and luxury support at MS Mobiles.';
const DEFAULT_IMAGE = '/og-image.png';

/**
 * Helper to get or create a meta tag by attribute
 */
const setMetaTag = (attribute, name, content) => {
  if (!content) return;
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

/**
 * Helper to get or create a link tag
 */
const setLinkTag = (rel, href) => {
  if (!href) return;
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

export const useSEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  keywords,
} = {}) => {
  useEffect(() => {
    // 1. Set document title
    const formattedTitle = title ? title : DEFAULT_TITLE;
    document.title = formattedTitle;

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }

    // 3. Canonical URL
    const currentUrl = url || window.location.href;
    setLinkTag('canonical', currentUrl);

    // 4. Open Graph Meta Tags
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:site_name', 'MS Mobiles');

    // 5. Twitter Card Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);
  }, [title, description, image, url, type, keywords]);
};

export default useSEO;
