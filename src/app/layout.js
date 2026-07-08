import "./globals.css";

export const metadata = {
  title: "Photogallery",
  description: "Client gallery SaaS MVP for photographers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
