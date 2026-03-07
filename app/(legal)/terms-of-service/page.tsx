import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | SaaS Kit",
  description: "Terms of Service for SaaS Kit.",
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20 lg:max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold">Terms of Service</h1>
      <p className="text-muted-foreground mb-8 text-sm">Last Updated: March 7, 2026</p>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
        <p className="text-muted-foreground">
          By accessing or using SaaS Kit (&quot;the Service&quot;), you agree to be bound by these Terms of
          Service. If you do not agree to these terms, please do not use the Service.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">2. Description of Service</h2>
        <p className="text-muted-foreground">
          SaaS Kit is a visual theme editor for Tailwind CSS and shadcn/ui components. We provide
          tools for creating, customizing, and exporting UI themes, including AI-powered theme
          generation features.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">3. User Accounts</h2>
        <p className="text-muted-foreground">
          You must authenticate via a supported OAuth provider (GitHub or Google) to access
          certain features. You are responsible for maintaining the confidentiality of your
          account and for all activities that occur under your account. You agree to notify us
          immediately of any unauthorized use of your account.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">4. Acceptable Use</h2>
        <p className="text-muted-foreground">You agree not to:</p>
        <ul className="text-muted-foreground list-disc space-y-1 pl-6">
          <li>Use the Service for any unlawful purpose or in violation of any regulations</li>
          <li>Attempt to gain unauthorized access to any part of the Service</li>
          <li>Upload or transmit malicious code or content</li>
          <li>Abuse or circumvent rate limits or usage quotas</li>
          <li>Scrape, crawl, or systematically access the Service without permission</li>
          <li>Republish community themes without proper attribution</li>
          <li>Impersonate any person or entity</li>
        </ul>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">5. Subscription and Payments</h2>
        <p className="text-muted-foreground">
          We offer free and paid (Pro) subscription tiers. Paid subscriptions are billed on a
          recurring monthly basis via our payment provider, Polar. By subscribing to a paid plan,
          you authorize us to charge your payment method on a recurring basis.
        </p>
        <p className="text-muted-foreground">
          You may cancel your subscription at any time. Upon cancellation, you retain Pro access
          until the end of your current billing period. Refunds are not provided for partial
          billing periods except as required by applicable law.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
        <p className="text-muted-foreground">
          Themes you create are owned by you. By publishing a theme to the community gallery, you
          grant SaaS Kit and other users a non-exclusive, royalty-free license to view and use
          that theme. You retain ownership of your original work.
        </p>
        <p className="text-muted-foreground">
          The SaaS Kit platform, including its UI, code, and design, is protected by copyright
          and other intellectual property laws. SaaS Kit is based on{" "}
          <a
            href="https://github.com/jnsahaj/tweakcn"
            className="text-primary hover:underline"
            rel="noreferrer"
            target="_blank"
          >
            tweakcn
          </a>{" "}
          by Sahaj Jain, licensed under the Apache License 2.0.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">7. Community Content</h2>
        <p className="text-muted-foreground">
          You are solely responsible for content you publish to the community gallery. We reserve
          the right to remove content that violates these terms or that we deem inappropriate,
          without prior notice.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">8. Disclaimer of Warranties</h2>
        <p className="text-muted-foreground">
          The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
          express or implied, including but not limited to warranties of merchantability, fitness
          for a particular purpose, or non-infringement. We do not guarantee that the Service
          will be uninterrupted, error-free, or secure.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">9. Limitation of Liability</h2>
        <p className="text-muted-foreground">
          To the maximum extent permitted by law, SaaS Kit shall not be liable for any indirect,
          incidental, special, consequential, or punitive damages, or any loss of profits or
          revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill,
          or other intangible losses, arising from your use of or inability to use the Service.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">10. Termination</h2>
        <p className="text-muted-foreground">
          We reserve the right to suspend or terminate your account and access to the Service at
          our sole discretion, without notice, for conduct that we believe violates these Terms of
          Service or is harmful to other users, us, or third parties. You may delete your account
          at any time from your account settings.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">11. Changes to Terms</h2>
        <p className="text-muted-foreground">
          We may update these Terms of Service from time to time. We will notify you of material
          changes by posting the new terms on this page with an updated date. Continued use of
          the Service after changes constitutes acceptance of the revised terms.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">12. Governing Law</h2>
        <p className="text-muted-foreground">
          These Terms of Service are governed by and construed in accordance with applicable law.
          Any disputes arising under these terms shall be subject to the exclusive jurisdiction
          of the courts in the applicable jurisdiction.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">13. Contact</h2>
        <p className="text-muted-foreground">
          If you have questions about these Terms of Service, please contact us at{" "}
          <a href="mailto:hello@sass-kit-v3.com" className="text-primary hover:underline">
            hello@sass-kit-v3.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
