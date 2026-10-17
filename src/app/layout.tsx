import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Poppins } from "next/font/google";
import { BootLoader, bootedFlagScript } from "@/features/loader/BootLoader";
import { getStoreInfo } from "@/lib/catalog/repository";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const store = getStoreInfo();

export const metadata: Metadata = {
  title: `${store.name} | ${store.tagline}`,
  description: `Peça online na ${store.name}: carvões, essências, narguilés, rosh e acessórios. Delivery e retirada em São Paulo.`,
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} ${bebas.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootedFlagScript }} />
      </head>
      <body className="min-h-dvh font-sans">
        <BootLoader />
        {children}
      </body>
    </html>
  );
}
