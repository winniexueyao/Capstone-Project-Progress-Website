'use client';

import { AppWrapper } from '@/components/AppWrapper';

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
