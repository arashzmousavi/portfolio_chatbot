import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="fa-IR">
      <body
      className="min-h-screen"
      dir="rtl"
      >
        {children}
      </body>
    </html>
  );
}
