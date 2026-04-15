export interface PolicySection {
  heading: string;
  content: string;
}

export interface Policy {
  slug: string;
  title: string;
  effectiveDate: string;
  lastUpdated: string;
  sections: PolicySection[];
}

export const POLICIES: Record<string, Policy> = {
  "privacy-policy": {
    slug: "privacy-policy",
    title: "Privacy Policy",
    effectiveDate: "April 8, 2026",
    lastUpdated: "April 8, 2026",
    sections: [
      {
        heading: "1. Introduction",
        content: "Welcome to Gummy Gurl. We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website gummygurl.com and purchase our products.\n\nBy using this Site, you consent to the practices described in this Privacy Policy.",
      },
      {
        heading: "2. Age Restriction",
        content: "Our products are intended only for individuals 21 years of age or older. We do not knowingly collect or solicit personal information from anyone under the age of 21. If we become aware that we have collected personal information from a person under 21, we will promptly delete it.",
      },
      {
        heading: "3. Information We Collect",
        content: "Personal Information\nWe may collect personal information that you voluntarily provide, including:\n- Full name\n- Billing and shipping address\n- Email address\n- Phone number\n- Payment information (processed securely through third-party providers)\n\nAutomatically Collected Information\nWhen you visit our Site, we may automatically collect:\n- IP address\n- Browser type and device information\n- Pages visited and time spent\n- Referring URLs\n\nCookies & Tracking Technologies\nWe use cookies and similar technologies to:\n- Improve user experience\n- Analyze website traffic\n- Remember user preferences\n- Support marketing and advertising efforts\n\nYou can disable cookies in your browser settings, but some features of the Site may not function properly.",
      },
      {
        heading: "4. How We Use Your Information",
        content: "We use your information to:\n- Process and fulfill orders\n- Provide customer support\n- Send order confirmations and updates\n- Improve our website and services\n- Prevent fraudulent transactions\n- Comply with legal and regulatory obligations\n- Send marketing communications (if you opt in)",
      },
      {
        heading: "5. Payment Processing",
        content: "All payments are processed through secure third-party payment processors. We do not store or have direct access to your full payment details (such as credit card numbers).",
      },
      {
        heading: "6. Sharing Your Information",
        content: "We may share your information with:\n- Payment processors\n- Shipping and fulfillment partners\n- Website hosting and service providers\n- Legal authorities when required by law\n\nWe do not sell your personal information to third parties.",
      },
      {
        heading: "7. Hemp Product Disclaimer",
        content: "Our products are derived from hemp and comply with applicable federal laws, including containing no more than 0.3% Delta-9 THC by dry weight, where applicable.\n\nHowever, laws regarding hemp-derived cannabinoids vary by state and jurisdiction. It is your responsibility to understand the laws in your area before purchasing. We may use your location information to restrict sales where products are not permitted.",
      },
      {
        heading: "8. Data Security",
        content: "We implement reasonable administrative, technical, and physical safeguards to protect your personal information. However, no method of transmission over the Internet is 100% secure.",
      },
      {
        heading: "9. Your Rights & Choices",
        content: "Depending on your location, you may have the right to:\n- Access the personal information we hold about you\n- Request corrections or updates\n- Request deletion of your personal data\n- Opt out of marketing communications\n\nTo exercise these rights, contact us at: hello@gummygurl.com",
      },
      {
        heading: "10. Third-Party Links",
        content: "Our Site may contain links to third-party websites. We are not responsible for the privacy practices of those websites.",
      },
      {
        heading: "11. Changes to This Policy",
        content: "We may update this Privacy Policy at any time. Updates will be posted on this page with a revised \"Last Updated\" date.",
      },
      {
        heading: "12. Contact Us",
        content: "If you have any questions about this Privacy Policy, please contact us:\n\nGummy Gurl\nEmail: hello@gummygurl.com\nWebsite: gummygurl.com",
      },
    ],
  },

  "terms-of-service": {
    slug: "terms-of-service",
    title: "Terms of Service",
    effectiveDate: "April 8, 2026",
    lastUpdated: "April 8, 2026",
    sections: [
      {
        heading: "1. Agreement to Terms",
        content: "These Terms of Service (\"Terms\") constitute a legally binding agreement between you (\"you,\" \"your,\" or \"customer\") and Gummy Gurl (\"Company,\" \"we,\" \"us,\" or \"our\") governing your use of our website located at gummygurl.com (the \"Site\") and the purchase of our products.\n\nBy accessing or using the Site, you agree to be bound by these Terms. If you do not agree, please do not use the Site.",
      },
      {
        heading: "2. Eligibility (21+ Requirement)",
        content: "You must be at least 21 years of age to use this Site or purchase our products. By using this Site, you confirm that you meet this requirement.\n\nWe reserve the right to refuse service, cancel orders, or terminate accounts if we suspect a violation of this policy.",
      },
      {
        heading: "3. Compliance with Laws",
        content: "Our products are derived from hemp and are federally compliant under applicable laws, including containing no more than 0.3% Delta-9 THC by dry weight, where applicable.\n\nHowever, laws vary by state and locality. By purchasing from us, you agree that:\n- You are responsible for understanding your local laws\n- You will not use our products in violation of any laws\n- You are located in a jurisdiction where such products are legal\n\nWe reserve the right to cancel or refuse orders based on shipping location.",
      },
      {
        heading: "4. Product Disclaimer",
        content: "Our products are not intended to diagnose, treat, cure, or prevent any disease. Statements on this Site have not been evaluated by the Food and Drug Administration (FDA).\n\nUse of our products is at your own risk. You should consult a healthcare professional before use, especially if you are pregnant, nursing, taking medications, or have a medical condition.",
      },
      {
        heading: "5. Orders & Payment",
        content: "All orders are subject to acceptance and availability. We reserve the right to:\n- Refuse or cancel any order at our discretion\n- Limit quantities per customer\n- Correct pricing or product errors\n\nPayments are processed securely through third-party providers. By submitting payment, you authorize us to charge your selected payment method.",
      },
      {
        heading: "6. Shipping & Delivery",
        content: "We ship products only to locations where they are legally permitted.\n\nShipping times are estimates and not guaranteed. Gummy Gurl is not responsible for:\n- Carrier delays\n- Lost or stolen packages once marked delivered\n- Delays due to incorrect shipping information provided by the customer",
      },
      {
        heading: "7. Returns & Refunds",
        content: "All sales are subject to our Return Policy.\n\nWe reserve the right to refuse returns that do not meet our policy requirements.",
      },
      {
        heading: "8. Intellectual Property",
        content: "All content on this Site, including logos, product names, designs, images, and text, is the property of Gummy Gurl and may not be used, copied, or reproduced without written permission.",
      },
      {
        heading: "9. Prohibited Uses",
        content: "You agree not to:\n- Use the Site for unlawful purposes\n- Attempt to gain unauthorized access to the Site\n- Interfere with Site functionality or security\n- Resell products where prohibited",
      },
      {
        heading: "10. Limitation of Liability",
        content: "To the fullest extent permitted by law, Gummy Gurl shall not be liable for any:\n- Indirect, incidental, or consequential damages\n- Loss of profits or data\n- Damages resulting from product use or misuse\n\nOur total liability shall not exceed the amount paid for the product in question.",
      },
      {
        heading: "11. Indemnification",
        content: "You agree to indemnify and hold harmless Gummy Gurl from any claims, damages, or expenses arising from your use of the Site or violation of these Terms.",
      },
      {
        heading: "12. Third-Party Services",
        content: "We may use third-party services (payment processors, shipping carriers, analytics tools). We are not responsible for their policies or actions.",
      },
      {
        heading: "13. Termination",
        content: "We reserve the right to terminate or suspend access to the Site at any time, without notice, for any violation of these Terms.",
      },
      {
        heading: "14. Changes to Terms",
        content: "We may update these Terms at any time. Continued use of the Site after changes are posted constitutes acceptance of the updated Terms.",
      },
      {
        heading: "15. Governing Law",
        content: "These Terms shall be governed by and interpreted in accordance with the laws of the State of North Carolina, without regard to conflict of law principles.",
      },
      {
        heading: "16. Contact Information",
        content: "If you have any questions about these Terms, please contact us:\n\nGummy Gurl\nEmail: hello@gummygurl.com\nWebsite: gummygurl.com",
      },
    ],
  },

  "shipping-policy": {
    slug: "shipping-policy",
    title: "Shipping Policy",
    effectiveDate: "April 8, 2026",
    lastUpdated: "April 8, 2026",
    sections: [
      {
        heading: "1. Order Processing",
        content: "All orders placed on gummygurl.com are processed within 1-3 business days (Monday-Friday, excluding holidays).\n\nOrders placed after business hours, on weekends, or on holidays will be processed on the next business day.\n\nOnce your order has been processed and shipped, you will receive a confirmation email with tracking information.",
      },
      {
        heading: "2. Shipping Methods & Delivery Times",
        content: "We ship via trusted carriers such as USPS and UPS.\n\nEstimated delivery times:\n- Standard Shipping: 2-5 business days\n- Expedited Shipping: 1-3 business days (if available at checkout)\n\nPlease note that delivery times are estimates and are not guaranteed.",
      },
      {
        heading: "3. Shipping Rates",
        content: "Shipping rates are calculated at checkout based on your location and selected shipping method.\n\nWe may offer:\n- Flat-rate shipping\n- Free shipping promotions on qualifying orders",
      },
      {
        heading: "4. Legal Restrictions",
        content: "Gummy Gurl ships hemp-derived products only to locations where they are legally permitted.\n\nDue to varying state and local regulations, we reserve the right to:\n- Refuse shipment to certain states or jurisdictions\n- Cancel and refund orders that cannot be legally fulfilled\n\nIt is the customer's responsibility to ensure that products are legal in their shipping location.",
      },
      {
        heading: "5. Order Tracking",
        content: "Once your order has shipped, you will receive a tracking number via email. Please allow up to 24 hours for tracking information to update.",
      },
      {
        heading: "6. Incorrect Shipping Information",
        content: "Customers are responsible for providing accurate shipping information.\n\nIf an order is returned due to:\n- Incorrect or incomplete address\n- Failure to pick up the package\n\nThe customer may be responsible for additional shipping charges to reship the order.",
      },
      {
        heading: "7. Lost, Stolen, or Delayed Packages",
        content: "Once a package has been handed off to the shipping carrier, Gummy Gurl is not responsible for delays, lost, or stolen packages.\n\nIf your package is marked as delivered but not received, please contact the shipping carrier directly.\n\nWe will assist in filing claims when possible but cannot guarantee replacements or refunds.",
      },
      {
        heading: "8. Damaged Shipments",
        content: "If your order arrives damaged, please contact us within 48 hours of delivery at hello@gummygurl.com with:\n- Your order number\n- Photos of the damaged product and packaging\n\nWe will review the issue and determine an appropriate resolution.",
      },
      {
        heading: "9. Order Changes & Cancellations",
        content: "We process orders quickly, so changes or cancellations must be requested immediately after placing your order.\n\nWe cannot guarantee that changes or cancellations can be made once processing has begun.",
      },
      {
        heading: "10. Contact Us",
        content: "If you have any questions regarding shipping, please contact us:\n\nGummy Gurl\nEmail: hello@gummygurl.com\nWebsite: gummygurl.com",
      },
    ],
  },

  "return-policy": {
    slug: "return-policy",
    title: "Return & Refund Policy",
    effectiveDate: "April 8, 2026",
    lastUpdated: "April 8, 2026",
    sections: [
      {
        heading: "1. Overview",
        content: "At Gummy Gurl, we stand behind the quality of our products. Due to the nature of consumable hemp-derived goods, all sales are considered final, except in cases outlined below.",
      },
      {
        heading: "2. Eligibility for Returns or Replacements",
        content: "We only offer returns, replacements, or refunds under the following conditions:\n- The product arrived damaged or defective\n- The incorrect item was shipped\n- The order was significantly incomplete\n\nTo be eligible, you must contact us within 48 hours of delivery.",
      },
      {
        heading: "3. Non-Returnable Items",
        content: "For safety, compliance, and quality control reasons, we do not accept returns for:\n- Opened or used products\n- Products returned without prior approval\n- Items purchased in violation of local laws\n- Change-of-mind purchases",
      },
      {
        heading: "4. Reporting an Issue",
        content: "If there is an issue with your order, please email hello@gummygurl.com within 48 hours of delivery and include:\n- Your order number\n- A description of the issue\n- Clear photos of the product and packaging\n\nFailure to provide sufficient documentation may result in denial of your request.",
      },
      {
        heading: "5. Resolution Process",
        content: "Once your request is reviewed, Gummy Gurl may, at its sole discretion:\n- Issue a replacement product\n- Provide a store credit\n- Issue a refund to the original payment method\n\nWe reserve the right to deny any claim that does not meet the criteria outlined in this policy.",
      },
      {
        heading: "6. Refund Processing",
        content: "If a refund is approved:\n- Refunds will be issued to the original payment method\n- Processing times may vary depending on your financial institution (typically 5-10 business days)",
      },
      {
        heading: "7. Chargebacks & Disputes",
        content: "We encourage customers to contact us directly to resolve any issues before initiating a chargeback.\n\nFiling a fraudulent chargeback or dispute may result in:\n- Order cancellation\n- Account restriction\n- Denial of future purchases\n\nWe reserve the right to provide order details, delivery confirmation, and communication records to payment processors in response to disputes.",
      },
      {
        heading: "8. Shipping Costs",
        content: "Shipping costs are non-refundable unless the issue was caused by an error on our part (e.g., incorrect or damaged item).",
      },
      {
        heading: "9. Contact Information",
        content: "If you have any questions regarding this policy, please contact us:\n\nGummy Gurl\nEmail: hello@gummygurl.com\nWebsite: gummygurl.com",
      },
    ],
  },
};
