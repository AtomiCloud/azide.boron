import type { Config } from './config';

export interface LegalDocumentVersion {
  version: string;
  effectiveDate: Date;
  content: {
    sections: {
      title: string;
      content: string;
    }[];
  };
  changes?: string;
}

export interface LegalDocument {
  id: string;
  title: string;
  description: string;
  versions: LegalDocumentVersion[];
}

/**
 * Privacy Policy - GDPR and PDPA Compliant
 */
export function getPrivacyPolicy(config: Config): LegalDocument {
  return {
    id: 'privacy',
    title: 'Privacy Policy',
    description: 'How we collect, use, and protect your personal information',
    versions: [
      {
        version: 'Current',
        effectiveDate: new Date('2025-10-28'),
        content: {
          sections: [
            {
              title: '1. Introduction',
              content: `This Privacy Policy describes how we collect, use, disclose, and safeguard your personal information when you visit our website and use our services. This policy is designed to comply with the General Data Protection Regulation (GDPR) and the Personal Data Protection Act (PDPA).

By using our services, you consent to the data practices described in this policy.`,
            },
            {
              title: '2. Information We Collect',
              content: `**Personal Data**

We may collect the following types of personal information:

- Name and contact information (email address)
- Usage data and analytics (pages visited, time spent, interactions)
- Device information (IP address, browser type, operating system)

**Legal Basis for Processing (GDPR)**

We process your personal data under the following legal bases:

- **Consent**: You have given explicit consent for processing your personal data
- **Legitimate Interests**: Processing is necessary for our legitimate business interests
- **Legal Obligation**: Processing is necessary to comply with legal requirements`,
            },
            {
              title: '3. How We Use Your Information',
              content: `We use your personal information for the following purposes:

- To provide and maintain our services
- To improve and personalize user experience
- To communicate with you about updates and service changes
- To analyze usage patterns and optimize our website
- To comply with legal obligations
- To protect against fraud and unauthorized access

We will not use your personal data for purposes other than those described without obtaining your explicit consent.`,
            },
            {
              title: '4. Data Sharing and Disclosure',
              content: `We do not sell, trade, or rent your personal information to third parties.

We may share your information only in the following circumstances:

- **Service Providers**: With trusted third-party service providers who assist in operating our website (e.g., hosting, analytics)
- **Legal Requirements**: When required by law or to protect our legal rights
- **Business Transfers**: In connection with a merger, acquisition, or sale of assets
- **With Your Consent**: When you explicitly authorize us to share your information

All third-party service providers are contractually obligated to maintain data confidentiality and security.`,
            },
            {
              title: '5. Your Rights (GDPR & PDPA)',
              content: `Under GDPR and PDPA, you have the following rights regarding your personal data:

- **Right to Access**: Request a copy of your personal data we hold
- **Right to Rectification**: Request correction of inaccurate or incomplete data
- **Right to Erasure**: Request deletion of your personal data ("right to be forgotten")
- **Right to Restriction**: Request restriction of processing your data
- **Right to Data Portability**: Receive your data in a structured, machine-readable format
- **Right to Object**: Object to processing of your personal data
- **Right to Withdraw Consent**: Withdraw consent at any time without affecting lawful processing

To exercise any of these rights, please contact us using the contact information provided at the end of this policy.`,
            },
            {
              title: '6. Data Security',
              content: `We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

Security measures include:

- Encryption of data in transit (SSL/TLS)
- Secure hosting infrastructure
- Regular security assessments
- Access controls and authentication
- Employee training on data protection

However, no method of transmission over the internet is 100% secure. While we strive to protect your personal data, we cannot guarantee absolute security.`,
            },
            {
              title: '7. Data Retention',
              content: `We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.

Retention periods vary depending on:

- The nature of the data collected
- Legal and regulatory requirements
- Business and operational needs

When personal data is no longer needed, we will securely delete or anonymize it.`,
            },
            {
              title: '8. International Data Transfers',
              content: `Your personal data may be transferred to and processed in countries outside your country of residence. When we transfer data internationally, we ensure appropriate safeguards are in place, including:

- Standard Contractual Clauses (SCCs) approved by the European Commission
- Adequate data protection agreements with service providers
- Compliance with GDPR and PDPA requirements

We ensure that any international transfers comply with applicable data protection laws.`,
            },
            {
              title: "9. Children's Privacy",
              content: `Our services are not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16.

If you believe we have collected information from a child under 16, please contact us immediately, and we will take steps to delete such information.`,
            },
            {
              title: '10. Changes to This Privacy Policy',
              content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.

When we make material changes:

- We will update the "Effective Date" at the top of this policy
- We will notify you via email or prominent notice on our website
- The updated policy will be available in our version history

We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.`,
            },
            {
              title: '11. Contact Information',
              content: `If you have any questions about this Privacy Policy or wish to exercise your data protection rights, please contact us:

**Contact Information**

Email: ${config.legal?.contactEmail || config.social.email}
Data Protection Officer: ${config.legal?.dpoEmail || config.legal?.contactEmail || config.social.email}

We will respond to your request within 30 days as required by law.`,
            },
          ],
        },
      },
    ],
  };
}

/**
 * Terms of Service
 */
export function getTermsOfService(config: Config): LegalDocument {
  return {
    id: 'terms',
    title: 'Terms of Service',
    description: 'Terms and conditions for using our services',
    versions: [
      {
        version: 'Current',
        effectiveDate: new Date('2025-10-28'),
        content: {
          sections: [
            {
              title: '1. Acceptance of Terms',
              content: `By accessing and using this website and our services, you accept and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.

These terms constitute a legally binding agreement between you and us.`,
            },
            {
              title: '2. Description of Service',
              content: `We provide a blog and newsletter platform (collectively, the "Service") that allows users to read content and subscribe to updates.

We reserve the right to modify, suspend, or discontinue the Service at any time without notice.`,
            },
            {
              title: '3. User Conduct',
              content: `When using our Service, you agree not to:

- Violate any applicable laws or regulations
- Infringe upon intellectual property rights
- Transmit harmful code, viruses, or malware
- Attempt to gain unauthorized access to our systems
- Harass, abuse, or harm other users
- Spam or send unsolicited communications
- Scrape or collect data without permission
- Impersonate others or misrepresent your identity

We reserve the right to remove content and suspend users who violate these rules.`,
            },
            {
              title: '4. Intellectual Property Rights',
              content: `**Our Content**

All content on this website, including text, graphics, logos, images, and software, is our property or that of our licensors and is protected by copyright and intellectual property laws.

**Your Content**

If you submit content (e.g., comments, feedback), you grant us a non-exclusive, royalty-free, worldwide license to use, reproduce, and display such content in connection with our Service.

You retain ownership of any intellectual property rights in content you submit.`,
            },
            {
              title: '5. Third-Party Links and Services',
              content: `Our Service may contain links to third-party websites or services. We are not responsible for:

- The content or practices of third-party websites
- Privacy policies of external services
- Accuracy or reliability of third-party information

Your use of third-party services is at your own risk and subject to their terms and conditions.`,
            },
            {
              title: '6. Disclaimer of Warranties',
              content: `OUR SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.

We do not warrant that:

- The Service will be uninterrupted or error-free
- Defects will be corrected
- The Service is free of viruses or harmful components
- Information provided is accurate or reliable

You use the Service at your own risk.`,
            },
            {
              title: '7. Limitation of Liability',
              content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR:

- Indirect, incidental, or consequential damages
- Loss of profits, data, or goodwill
- Service interruptions or data loss
- Third-party actions or content

Our total liability shall not exceed the amount you paid to us (if any) in the 12 months preceding the claim.`,
            },
            {
              title: '8. Indemnification',
              content: `You agree to indemnify and hold us harmless from any claims, losses, damages, liabilities, and expenses (including legal fees) arising from:

- Your use of the Service
- Your violation of these Terms
- Your violation of any rights of another party
- Your content or submissions`,
            },
            {
              title: '9. Termination',
              content: `We may terminate or suspend your access to the Service immediately, without notice, for:

- Violation of these Terms
- Fraudulent or illegal activity
- Extended periods of inactivity
- Any other reason at our discretion

Upon termination:

- Your right to use the Service ceases immediately
- We may delete your data
- Provisions that should survive termination will remain in effect`,
            },
            {
              title: '10. Governing Law and Dispute Resolution',
              content: `These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions.

**Dispute Resolution Process:**

1. **Informal Resolution**: Contact us first to resolve disputes informally
2. **Mediation**: If informal resolution fails, disputes will be submitted to mediation
3. **Arbitration/Litigation**: Final disputes will be resolved through arbitration or litigation in the appropriate jurisdiction

You agree to the exclusive jurisdiction of the courts in the applicable jurisdiction.`,
            },
            {
              title: '11. Changes to Terms',
              content: `We reserve the right to modify these Terms at any time. When we make material changes:

- We will update the "Effective Date"
- We will provide notice through our Service or via email
- Continued use constitutes acceptance of the modified Terms
- Previous versions will be available in our version history

We encourage you to review these Terms periodically.`,
            },
            {
              title: '12. Contact Information',
              content: `If you have questions about these Terms of Service, please contact us:

**Contact Information**

Email: ${config.legal?.contactEmail || config.social.email}

We will respond to inquiries within a reasonable timeframe.`,
            },
          ],
        },
      },
    ],
  };
}

/**
 * Get the current (latest) version of a legal document
 */
export function getCurrentVersion(document: LegalDocument): LegalDocumentVersion {
  const latestVersion = document.versions[document.versions.length - 1];
  if (!latestVersion) {
    throw new Error(`No versions found for document: ${document.id}`);
  }
  return latestVersion;
}

/**
 * Get a specific version of a legal document
 */
export function getVersion(document: LegalDocument, version: string): LegalDocumentVersion | undefined {
  return document.versions.find(v => v.version === version);
}

/**
 * Get all legal documents
 */
export function getAllLegalDocuments(config: Config): LegalDocument[] {
  return [getPrivacyPolicy(config), getTermsOfService(config)];
}
