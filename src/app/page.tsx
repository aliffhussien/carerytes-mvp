import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="border-b border-border px-4 py-4 sm:px-6">
        <span className="text-lg font-bold tracking-tight text-teal-deep">
          CareRytes
        </span>
      </header>

      <main className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-16">
        <div className="flex w-full max-w-md flex-col gap-6 sm:max-w-lg">
          <p className="text-sm font-semibold text-teal">
            CareRytes · Cancer treatment cost support
          </p>

          <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            Know your rights. Find your route.
          </h1>

          <p className="text-base leading-7 text-text-secondary">
            Answer a few questions about your situation. CareRytes will show
            possible routes for cancer treatment cost support in Malaysia,
            based on your answers.
          </p>

          <Link
            href="/cancer-support"
            className="flex h-12 w-full items-center justify-center rounded-xl bg-teal px-5 text-base font-semibold text-white transition-colors hover:bg-teal-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-deep"
          >
            Start check
          </Link>

          <div className="rounded-2xl border border-success-border bg-success-bg p-4">
            <p className="text-sm leading-6 text-success-text">
              CareRytes is a navigator. The final decision is always made by
              the official agency or provider.
            </p>
          </div>

          <p className="text-sm leading-6 text-text-muted">
            No ads. No fake promises. Just clearer next steps.
          </p>
        </div>
      </main>
    </div>
  );
}
