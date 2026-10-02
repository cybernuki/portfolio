import { LOCALES } from "@/features/i18n/domain/locale";
import { loadPageData } from "@/features/content/infra/load";
import { orderQuests } from "@/features/quests/domain/order";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const sections: string[] = [];
  for (const locale of LOCALES) {
    const { content, contact, discs } = await loadPageData(locale);
    const links = [
      contact.upwork && `- Upwork: ${contact.upwork}`,
      contact.booking && `- Booking: ${contact.booking}`,
      contact.github && `- GitHub: ${contact.github}`,
      contact.linkedin && `- LinkedIn: ${contact.linkedin}`,
    ].filter(Boolean);
    sections.push(
      [
        `## ${locale.toUpperCase()} (${SITE_URL}/${locale})`,
        "",
        `${content.headline} ${content.role}. ${content.place}.`,
        "",
        "### Services",
        ...content.services.map((s) => `- ${s.title}: ${s.tagline}${s.catalogUrl ? ` Fixed-price package: ${s.catalogUrl}` : ""}`),
        "",
        "### Proof",
        ...orderQuests(discs).map((d) => `- ${d.title}${d.link ? ` (${d.link})` : ""}`),
        "",
        "### Contact",
        ...links,
      ].join("\n"),
    );
  }
  const body = [`# Jhonatan Arenas`, "", "> Freelance engineer: MCP servers, Claude Code setup, bots and agents, prototype to production.", "", ...sections, ""].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
