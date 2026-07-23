import Link from "next/link";

const supportAreas = [
  {
    id: "cancer",
    title: "Cancer treatment cost support",
    description: "Help with treatment costs, transport, medicine, equipment",
    status: "available" as const,
    href: "/cancer-support",
  },
  {
    id: "dialysis",
    title: "Dialysis support",
    description: "Ongoing dialysis treatment and related costs",
    status: "coming-soon" as const,
  },
  {
    id: "accident",
    title: "Accident / PERKESO support",
    description: "Work-related accident claims and benefits",
    status: "coming-soon" as const,
  },
  {
    id: "disability",
    title: "Disability support",
    description: "Assistance programs for persons with disabilities",
    status: "coming-soon" as const,
  },
  {
    id: "zakat",
    title: "Zakat health support",
    description: "Zakat-based medical assistance routes",
    status: "coming-soon" as const,
  },
  {
    id: "ngo",
    title: "NGO medical aid",
    description: "Non-profit medical assistance organizations",
    status: "coming-soon" as const,
  },
  {
    id: "insurance",
    title: "Insurance / takaful guidance",
    description: "Claim assistance and benefit guidance",
    status: "coming-soon" as const,
  },
  {
    id: "kwsp",
    title: "KWSP health withdrawal guidance",
    description: "Health-related KWSP withdrawal information",
    status: "coming-soon" as const,
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="border-b border-border px-4 py-4 sm:px-6">
        <span className="text-lg font-bold tracking-tight text-teal-deep">
          CareRytes
        </span>
        <p className="mt-1 text-xs text-text-muted">Part of Rytes platform</p>
      </header>

      <main className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-16">
        <div className="flex w-full max-w-2xl flex-col gap-8">
          {/* Hero Section */}
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              Know your rights. Find your route.
            </h1>

            <p className="text-base leading-7 text-text-secondary">
              CareRytes helps you discover possible support routes based on
              your situation. The final decision is always made by the official
              agency or provider.
            </p>

            <p className="text-sm leading-6 text-text-muted">
              No ads. No fake promises. Just clearer next steps.
            </p>
          </div>

          {/* Support Areas Grid */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                Support areas
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {supportAreas.map((area) => (
                <div key={area.id}>
                  {area.status === "available" ? (
                    <Link
                      href={area.href!}
                      className="flex flex-col gap-2 rounded-xl border-2 border-teal bg-teal-soft p-4 transition-colors hover:bg-teal-soft/80"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-foreground">
                          {area.title}
                        </h3>
                        <span className="inline-flex rounded-full bg-teal px-2 py-1 text-xs font-semibold text-white">
                          Available
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary">
                        {area.description}
                      </p>
                    </Link>
                  ) : (
                    <div className="flex flex-col gap-2 rounded-xl border-2 border-border bg-surface p-4 opacity-60">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-foreground">
                          {area.title}
                        </h3>
                        <span className="inline-flex rounded-full border border-border-soft bg-surface-subtle px-2 py-1 text-xs font-semibold text-text-muted">
                          Coming soon
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary">
                        {area.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <p className="text-xs text-text-muted">
              Future support areas are planned for later versions. Current demo focuses on cancer treatment cost support.
            </p>
          </div>

          {/* Info Box */}
          <div className="rounded-2xl border border-info-border bg-info-bg p-4">
            <p className="text-sm leading-6 text-info-text">
              CareRytes is a navigator for possible support routes in Malaysia.
              All routes are verified by official sources and require verification
              from the agency or provider.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
