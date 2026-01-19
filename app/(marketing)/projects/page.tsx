import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";

const projects = [
  {
    title: "Industrial Switchgear Upgrade",
    summary:
      "Modernized low-voltage switchgear with smart monitoring and improved safety.",
    tags: ["Industrial", "LV Switchgear", "Monitoring"],
  },
  {
    title: "Data Center Power Backbone",
    summary:
      "Redundant power distribution with high-efficiency busbar trunking systems.",
    tags: ["Data Center", "Busbar", "Redundancy"],
  },
  {
    title: "Commercial EV Charging Hub",
    summary:
      "Multi-site fast-charging rollout with load balancing and remote diagnostics.",
    tags: ["EV Charging", "Fast DC", "Smart Control"],
  },
  {
    title: "Solar + Storage Integration",
    summary:
      "Hybrid PV and battery system designed for peak shaving and reliability.",
    tags: ["Renewables", "Storage", "Energy Mgmt"],
  },
  {
    title: "Airport Lighting Retrofit",
    summary:
      "LED runway lighting upgrade with improved visibility and energy savings.",
    tags: ["Infrastructure", "LED", "Efficiency"],
  },
  {
    title: "Factory Automation Power Panel",
    summary:
      "Custom panel build for high-load automation lines and production control.",
    tags: ["Manufacturing", "Panels", "Automation"],
  },
];

export default function ProjectsPage() {
  return (
    <>
      <section className="pt-10 sm:pt-14">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Projects
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Electrical projects that scale with your business.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            A snapshot of recent work across industrial, commercial, and energy
            infrastructure. Each project is delivered with quality controls and
            clear documentation.
          </p>
        </Reveal>
      </section>

      <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <Reveal key={project.title} delay={index * 0.08}>
            <ProjectCard
              title={project.title}
              summary={project.summary}
              tags={project.tags}
            />
          </Reveal>
        ))}
      </section>
    </>
  );
}
