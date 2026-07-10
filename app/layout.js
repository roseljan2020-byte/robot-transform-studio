export const metadata = {
  title: "Robot Transform Studio — Turn Anything Into a Robot",
  description:
    "AI image generator that transforms cars, animals, fruits and people into epic robots.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, background: "#0E1420" }}>{children}</body>
    </html>
  );
}
