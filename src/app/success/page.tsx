import Link from "next/link";

type RedirectProps = {
  searchParams: {
    itineraryId: string;
  };
};

export default function Redirect({ searchParams }: RedirectProps) {
  return (
    <main className="max-w-3xl">
      <div className="flex flex-col gap-8">
        <h1 className="text-4xl lg:text-5xl font-bold">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-indigo-500">
            Thank You{" "}
          </span>
          for your Purchase!
        </h1>
        <div className="max-w-xl flex flex-col gap-4">
          <p>
            You will receive an email once your payment has been processesed,
            after which you can access your Itinerary at any time on the
            following link:{" "}
            <Link
              href={`itinerary/${searchParams.itineraryId}`}
              className="underline underline-offset-2 text-indigo-700"
            >
              {process.env.URL}/itinerary/{searchParams.itineraryId}
            </Link>
          </p>
          <p>
            If you suspect something went wrong, email me here{" "}
            <a
              href="mailto:levi.schouten.werk@gmail.com"
              className="underline underline-offset-2"
            >
              levi.schouten.werk@gmail.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
