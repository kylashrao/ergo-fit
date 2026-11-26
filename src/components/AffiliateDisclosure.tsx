export default function AffiliateDisclosure({ variant = "inline" }: {
  variant?: "banner" | "inline" | "footer";
}) {
  return (
    <p className={`affiliate-disclosure affiliate-disclosure--${variant}`}>
      <strong>Affiliate disclosure.</strong>{" "}
      If you click a partner link and make a qualifying purchase, we may earn a commission at no extra cost to you.{" "}
      As an Amazon Associate I earn from qualifying purchases.
    </p>
  );
}
