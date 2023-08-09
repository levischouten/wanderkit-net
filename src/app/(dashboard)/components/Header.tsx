"use client";

import MenuButton from "@/components/MenuButton";
import { Bars3Icon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Item } from "react-stately";

const items = [
  { href: "/", label: "Home" },
  { href: "/blogs", label: "Blog" },
  { href: "/about", label: "About us" },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="flex items-center w-full justify-between px-6 py-6 max-w-7xl mx-auto">
      <div className="flex gap-2 sm:gap-6 items-center">
        <div className="sm:hidden">
          <MenuButton
            icon={<Bars3Icon className="w-6 h-6" />}
            className="p-2"
            onAction={(route) => {
              router.push(route as string);
            }}
          >
            {items.map((item) => (
              <Item key={item.href}>{item.label}</Item>
            ))}
          </MenuButton>
        </div>
        <h2 className="font-bold text-xl">
          <Link href="/">Wanderkit</Link>
        </h2>
        <div className="hidden sm:flex items-center sm:gap-4 font-medium text-sm">
          {items.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      {!pathname.includes("/auth/") && (
        <div className="flex gap-2">
          <Link
            href={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL!}
            className="border rounded border-indigo-500 text-indigo-500 px-4 py-2"
          >
            Login
          </Link>
          <Link
            href={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL!}
            className="rounded bg-indigo-500 text-white px-4 py-2"
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
}
