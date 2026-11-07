import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata = {
  title: "SmileCare Dental Clinic — стоматология в Ташкенте",
  description:
    "Вымышленная клиника SmileCare: услуги, цены, график и ассистент, который помогает записаться на приём и не ставит диагнозы.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}
