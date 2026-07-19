import "./globals.css";

export const metadata = {
  title: "ONSTYLE 마케팅 랩",
  description: "마케팅 자동화 솔루션",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* 스타일 깨짐 완벽 방지를 위해 Tailwind CDN을 백업으로 넣어 둡니다 */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="antialiased m-0 p-0 bg-gray-50">{children}</body>
    </html>
  );
}