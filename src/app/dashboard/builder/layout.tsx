'use client';

import { TabProvider } from '@/contexts/contexts';

export default function HomeTabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TabProvider>
      {children}
    </TabProvider>
  );
}