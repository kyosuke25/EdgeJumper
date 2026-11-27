'use strict';
(function () {
    // Keep local/offline copies free of analytics.
    if (location.origin !== 'https://jump.ky25.com') return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-MX73XC36';
    document.head.appendChild(tag);
})();
