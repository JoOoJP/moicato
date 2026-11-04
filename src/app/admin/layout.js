import { Geist, Cormorant_Garamond } from "next/font/google";
import "../globals.css";

// Root layout próprio do painel: fora do [lang], só pt-BR, nunca indexado.
const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

// Painel depende da sessão (cookies): nunca pré-renderizar.
export const dynamic = "force-dynamic";

export const metadata = {
  title: { default: "Painel | Moikato", template: "%s | Painel Moikato" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-osso font-sans text-verdemoikato antialiased">{children}</body>
    </html>
  );
}
