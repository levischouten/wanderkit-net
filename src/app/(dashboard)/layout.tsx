import Header from "./components/Header";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="bg-gray-100 flex-1">{children}</main>
    </div>
  );
}
