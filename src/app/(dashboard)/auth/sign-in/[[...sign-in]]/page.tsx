import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignIn
      appearance={{
        elements: {
          formButtonPrimary:
            "bg-indigo-500 font-inherit hover:bg-indigo-600 text-md",
          rootBox: "mx-auto mt-20",
          card: "shadow-none",
        },
      }}
    />
  );
}
