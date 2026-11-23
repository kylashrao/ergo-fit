import { notFound } from "next/navigation";
import EditorialPage, { EditorialLinks } from "@/components/EditorialPage";
import { guides, type SlugPageProps } from "@/lib/editorial";
import { pageMetadata, siteUrl } from "@/lib/siteSeo";

export const ensureStatic = "navigation";

export function generateStaticParams() {
  return guides.map(({ slug }) => ({ slug }));
}

async function getGuide(params: SlugPageProps["params"]) {
  const { slug } = await params;
  const guide = guides.find((entry) => entry.slug === slug);
  if (!guide) notFound();
  return guide;
}

export async function generateMetadata({ params }: SlugPageProps) {
  const guide = await getGuide(params);
  const metadata = pageMetadata(guide.title, guide.description, `/guides/${guide.slug}`);
  return { ...metadata, openGraph: { ...metadata.openGraph, type: "article" as const } };
}

export default async function GuidePage({ params }: SlugPageProps) {
  const guide = await getGuide(params);
  const url = siteUrl(`/guides/${guide.slug}`);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        mainEntityOfPage: { "@id": `${url}#webpage` },
        headline: guide.title,
        description: guide.description,
        inLanguage: "en",
        publisher: { "@type": "Organization", name: "ergo-fit", url: siteUrl("/") },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#webpage`,
        url,
        mainEntity: guide.faqs.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };

  return (
    <EditorialPage title={guide.title} description={guide.description} parent={{ href: "/guides", label: "All guides" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
      }} />
      <div className="editorial-reading">
        <article className="panel editorial-article">
          {guide.sections.map(({ heading, paragraphs }) => <section key={heading}>
            <h2>{heading}</h2>
            {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>)}
          <section id="faq">
            <h2>Frequently asked questions</h2>
            {guide.faqs.map(({ question, answer }) => <div className="guide-answer" key={question}>
              <h3>{question}</h3><p>{answer}</p>
            </div>)}
          </section>
          <section>
            <h2>Sources</h2>
            <ul>{guide.sources.map(({ href, label }) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
          </section>
        </article>
        <aside className="article-sidebar">
          <section className="panel">
            <h2>Practical takeaways</h2>
            <ul>{guide.takeaways.map((takeaway) => <li key={takeaway}>{takeaway}</li>)}</ul>
          </section>
          <EditorialLinks title="Related calculators and setups" links={guide.links} />
          <div className="disclosures">
            <p>These estimates are educational workstation sizing guidance, not medical advice.</p>
            <p>We may earn a commission on purchases made through affiliate links on matched gear pages.</p>
          </div>
        </aside>
      </div>
    </EditorialPage>
  );
}
