import './globals.css';

export const metadata = {
  title: 'JARVIS | Sistema AURA',
  description: 'Assistente Universal Responsivo Autônomo - Ivan Stein Edition',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="icon" href="https://fav.farm/✨" />
      </head>
      <body>{children}</body>
    </html>
  );
}
