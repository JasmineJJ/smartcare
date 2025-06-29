import { ReactNode } from 'react';

type LayoutProps = { children: ReactNode };

export default function Layout({ children }: LayoutProps) {
  return <div className="container mx-auto px-4">{children}</div>;
}
