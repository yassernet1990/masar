import type { Metadata } from "next";
import "./card.css";

export const metadata: Metadata = {
  title: "Yasser Abdulkadir | MASAR",
  description: "Digital business card for Yasser Abdulkadir, Founder & Managing Director of MASAR Procurement & Solutions.",
  alternates: { canonical: "https://masarps.com/card" },
  robots: { index: false, follow: true },
};

const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="dc-icon" aria-hidden="true">{children}</span>
);

export default function CardPage() {
  return (
    <main className="dc-page">
      <div className="dc-glow dc-glow-one" aria-hidden="true" />
      <div className="dc-glow dc-glow-two" aria-hidden="true" />

      <section className="dc-card" aria-label="Yasser Abdulkadir digital business card">
        <a className="dc-brand" href="/" aria-label="MASAR home">
          <img src="/favicon.svg" alt="" width="42" height="42" />
          <span>
            <strong>MASAR</strong>
            <small>Procurement &amp; Solutions</small>
          </span>
        </a>

        <div className="dc-rule" />

        <div className="dc-profile">
          <p className="dc-kicker">DIGITAL BUSINESS CARD</p>
          <h1>Yasser Abdulkadir</h1>
          <p className="dc-role">Founder &amp; Managing Director</p>
          <p className="dc-company">MASAR Procurement &amp; Solutions</p>
        </div>

        <p className="dc-focus">
          Business, Investment &amp; Development Advisory<br />
          Procurement · Commercial · Contracts
        </p>

        <a className="dc-primary" href="/yasser-abdulkadir.vcf" download>
          <Icon>＋</Icon>
          <span><b>Save Contact</b><small>Add Yasser to your iPhone contacts</small></span>
          <span className="dc-arrow">↓</span>
        </a>

        <div className="dc-actions">
          <a href="https://wa.me/447452347280" target="_blank" rel="noopener noreferrer">
            <Icon>W</Icon><span>WhatsApp</span>
          </a>
          <a href="tel:+447452347280">
            <Icon>☎</Icon><span>Call</span>
          </a>
          <a href="https://sa.linkedin.com/in/yasser-abdulkader" target="_blank" rel="noopener noreferrer">
            <Icon>in</Icon><span>LinkedIn</span>
          </a>
          <a href="https://masarps.com" target="_blank" rel="noopener noreferrer">
            <Icon>↗</Icon><span>Website</span>
          </a>
        </div>

        <div className="dc-details">
          <a href="tel:+447452347280"><span>Mobile</span><b>+44 745 234 7280</b></a>
          <a href="https://masarps.com" target="_blank" rel="noopener noreferrer"><span>Website</span><b>masarps.com</b></a>
          <div><span>Company</span><b>MASAR PROCUREMENT &amp; SOLUTIONS LTD</b></div>
          <div><span>UK Company No.</span><b>17408434</b></div>
        </div>

        <footer className="dc-footer">
          <span>A clearer path forward.</span>
          <a href="/?lang=en">Explore MASAR →</a>
        </footer>
      </section>
    </main>
  );
}
