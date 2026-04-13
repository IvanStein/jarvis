import './globals.css';

export const metadata = {
  title: 'ChatGPT - Ivan',
  description: 'Assistente de IA',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="icon" href="https://fav.farm/🤖" />
      </head>
      <body>{children}</body>
    </html>
  );
}
