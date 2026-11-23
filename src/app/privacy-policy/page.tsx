import TrustPage, { ContactDetails } from "@/components/TrustPage";
import { siteOperator } from "@/lib/siteConfig";
import { pageMetadata } from "@/lib/siteSeo";

const title = "Privacy Policy";
const description = "How ergo-fit handles calculator inputs, browser features, website requests, and correspondence.";

export const metadata = pageMetadata(title, description, "/privacy-policy");

export default function PrivacyPolicy() {
  return (
    <TrustPage title={title} description={description}>
      <section>
        <h2>Calculator and browser activity</h2>
        <p>{siteOperator} operates ergo-fit. Your height, footwear, screen settings, and room measurements are processed in browser memory. The calculator does not send these inputs to us or store them in site cookies or browser storage. Copying a setup writes it to your clipboard. Saving a setup creates a local download. You control where you share either copy.</p>
      </section>
      <section>
        <h2>Hosting, analytics, and email</h2>
        <p>Our hosting provider may process ordinary request data such as IP addresses, requested pages, device or browser information, and timestamps to deliver and secure the site. This version of ergo-fit does not load site analytics or advertising scripts.</p>
        <p>If you email us, we receive the address and message you provide and use them to respond and handle your request. Our email provider processes that correspondence. Please keep health details and other sensitive information out of your message.</p>
      </section>
      <section>
        <h2>Affiliate links and advertising</h2>
        <p>When you visit a merchant or affiliate network, it may collect information about your visit and use cookies or other identifiers to attribute purchases. Its own privacy policy applies to that activity.</p>
        <p>If we activate Google AdSense, Google and its advertising partners may use cookies and similar technology to serve and measure ads, including personalized ads based on visits to this or other sites. We will provide the applicable privacy choices and use a Google-certified consent management platform where required. Where consent is required, advertising technologies subject to consent will be gated by those choices.</p>
        <p>You can manage Google ad personalization through <a href="https://myadcenter.google.com/">My Ad Center</a> and read about <a href="https://policies.google.com/technologies/partner-sites">how Google uses information from partner sites</a>.</p>
      </section>
      <section>
        <h2>Privacy questions and requests</h2>
        <p>You can ask us about this policy or request access, correction, or deletion of information you have sent us. Contact email: <ContactDetails /></p>
      </section>
    </TrustPage>
  );
}
