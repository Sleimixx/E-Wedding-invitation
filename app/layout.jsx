import config from "@/config/wedding.json";
import "./globals.css";

export const metadata = {
  title: `${config.couple.brideName} & ${config.couple.groomName} — Wedding Invitation`,
  description: `Join us on ${config.date.display}`,
};

export default function RootLayout({ children }) {
  const theme = config.theme;
  const styleVars = {
    "--color-primary": theme.primary,
    "--color-accent": theme.accent,
    "--color-bg": theme.background,
    "--color-text": theme.text,
    "--font-heading": theme.fontHeading,
    "--font-body": theme.fontBody,
    "--font-script": theme.fontScript,
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={styleVars}>{children}</body>
    </html>
  );
}
