import type { ClassCopy } from "@/features/services/domain/classes";
import type { FaqCopy } from "@/features/codex/domain/faq";
import type { Locale } from "./locale";

export const SECTION_IDS = ["abilities", "package", "quests", "journey", "codex", "arsenal", "party"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

/** Sections reachable from the menu (the arsenal is a supporting block, not a destination). */
export const MENU_IDS = ["abilities", "package", "quests", "journey", "codex", "party"] as const;
export type MenuId = (typeof MENU_IDS)[number];

export interface SectionCopy {
  /** Game label (the h2). */
  label: string;
  /** Plain label that carries the facts. */
  sub: string;
  kicker: string;
}

/** UI copy only. Facts (services, projects, process, background) come from the content source. Strings only: this crosses the server/client boundary. */
export interface Messages {
  siteTitleSuffix: string;
  skipToContent: string;
  hud: {
    home: string;
    menu: string;
    closeMenu: string;
    sections: string;
    join: string;
    joinShort: string;
    languageSwitch: string;
    options: string;
    closeOptions: string;
  };
  hero: { eyebrow: string; lore: string; plain: string; joinCta: string; questsCta: string; menuLabel: string };
  sections: Record<SectionId, SectionCopy>;
  nav: Record<MenuId, { label: string; sub: string }>;
  abilities: { idealFor: string; gets: string; proof: string; start: string; startFor: string; catalog: string; watch: string; videoTitle: string; close: string; videoFallback: string };
  package: {
    pitch: string;
    plus: string;
    tiers: Array<{ name: string; items: string[] }>;
    cta: string;
    watchFull: string;
    proofLead: string;
    proofLabels: Record<string, string>;
    previewLabel: string;
    play: string;
    pause: string;
  };
  classes: Record<string, ClassCopy>;
  quests: { tablist: string; problem: string; did: string; outcome: string; stack: string; link: string; soon: string; stars: string; openSource: string; clientWork: string };
  journey: { steps: [string, string, string, string]; map: string };
  codex: FaqCopy;
  arsenal: { intro: string };
  party: { loreTail: string; quest: string; hint: string; soon: string; languages: string };
  options: {
    title: string;
    motion: string;
    music: string;
    sfx: string;
    on: string;
    off: string;
    motionAnnounce: string;
    tiers: { full: string; calm: string; static: string };
  };
}

export const MESSAGES: Record<Locale, Messages> = {
  en: {
    siteTitleSuffix: "Freelance engineer",
    skipToContent: "Skip to content",
    hud: {
      home: "Jhonatan Arenas, back to top",
      menu: "Menu",
      closeMenu: "Close menu",
      sections: "Sections",
      join: "Join the party",
      joinShort: "Join",
      languageSwitch: "Switch to Spanish",
      options: "Options",
      closeOptions: "Close options",
    },
    hero: {
      eyebrow: "Freelance engineer · Colombia · UTC-5",
      lore: "I connect your AI to your systems, and ship it.",
      plain: "Custom MCP servers, Claude Code set up for your team, triage bots, and apps taken from prototype to production.",
      joinCta: "Join the party",
      questsCta: "See the quests",
      menuLabel: "Main menu",
    },
    sections: {
      abilities: { label: "Abilities", sub: "What I build for you", kicker: "Chapter I · class select" },
      package: { label: "Featured package", sub: "Deploy your AI-built app to production", kicker: "Featured · fixed-price package" },
      quests: { label: "Quests", sub: "Shipped work and open source", kicker: "Chapter II · quest log" },
      journey: { label: "The Journey", sub: "How we work together", kicker: "Chapter III · the road" },
      codex: { label: "Codex", sub: "Questions, answered", kicker: "Chapter IV · lore" },
      arsenal: { label: "Arsenal", sub: "What I build with", kicker: "Chapter V · equipment" },
      party: { label: "Join the Party", sub: "Hire me or book a call", kicker: "Final chapter" },
    },
    nav: {
      abilities: { label: "Abilities", sub: "What I build for you" },
      package: { label: "Package", sub: "Deploy your AI-built app" },
      quests: { label: "Quests", sub: "Shipped work and open source" },
      journey: { label: "The Journey", sub: "How we work together" },
      codex: { label: "Codex", sub: "Questions, answered" },
      party: { label: "Join the Party", sub: "Hire me or book a call" },
    },
    abilities: { idealFor: "Ideal for", gets: "What you get", proof: "Proof", start: "Start this quest", startFor: "Start this quest:", catalog: "Buy as a fixed-price package", watch: "Watch the 40-second overview", videoTitle: "Overview: Vibe-coded app to production", close: "Close", videoFallback: "Your browser cannot play this video." },
    package: {
      pitch: "A fixed-scope, fixed-price package to take an app built with Lovable, Cursor or Claude live on AWS or a VPS, with the safety net production needs.",
      plus: "plus",
      tiers: [
        { name: "Starter", items: ["secure deploy", "domain", "HTTPS"] },
        { name: "Standard", items: ["CI/CD", "tests", "monitoring"] },
        { name: "Advanced", items: ["infrastructure as code", "backups", "staging"] },
      ],
      cta: "See the package on Upwork",
      watchFull: "Watch the full video (40 s)",
      proofLead: "Proof:",
      proofLabels: { fulepu: "Fulepu AWS migration", subinvoxa: "Subinvoxa" },
      previewLabel: "Preview of the package video",
      play: "Play preview",
      pause: "Pause preview",
    },
    classes: {
      "mcp-servers": {
        name: "The Conduit",
        idealFor: "Teams whose agents need safe access to their APIs, databases and internal tools.",
        gets: ["Typed tools", "Authentication", "Tests and deployment"],
      },
      "ai-coding-harness": {
        name: "The Artificer",
        idealFor: "Teams adopting Claude Code, on laptops and in the cloud.",
        gets: ["CLAUDE.md and AGENTS.md", "A spec-driven workflow and persistent memory", "Claude Code in CI (GitHub Actions)"],
        ownProof: "My own daily setup",
      },
      "bots-agents": {
        name: "The Herald",
        idealFor: "Teams whose support questions pile up in Slack, Discord or Teams.",
        gets: ["Triage and support bots", "Classification with Jev", "Answer agents on AWS Bedrock"],
      },
      "prototype-to-production": {
        name: "The Smith",
        idealFor: "Founders with a Lovable, Cursor or Claude app that needs to go live.",
        gets: ["Tests, CI/CD, Docker", "AWS CDK infrastructure", "Deployment to AWS or a VPS"],
      },
    },
    quests: {
      tablist: "Quests",
      problem: "The problem",
      did: "What I did",
      outcome: "Outcome",
      stack: "Stack",
      link: "Visit",
      soon: "Link coming soon",
      stars: "stars",
      openSource: "Open source",
      clientWork: "Client work",
    },
    journey: { steps: ["The Summons", "The Pact", "The Road", "The Hand-off"], map: "Process steps" },
    codex: {
      languagesQ: "Which languages do you work in?",
      locationQ: "Where are you based, and which time zone?",
      scopeQ: "How does scope work?",
      scopeLead: "Scope is fixed after the discovery call.",
      whereQ: "Where do we work together?",
      whereUpwork: "On Upwork.",
      whereBooking: "Book a call and we start from there.",
      whereBoth: "On Upwork, or book a call first.",
      whereSoon: "Upwork and call booking are coming soon. For now, message me on LinkedIn.",
      backgroundQ: "What is your background?",
    },
    arsenal: { intro: "Technologies grouped by the service they power." },
    party: { loreTail: "Tell me the quest.", quest: "Quest", hint: "Pick a service above and it shows up here.", soon: "Coming soon", languages: "Languages" },
    options: {
      title: "OPTIONS",
      motion: "MOTION",
      music: "MUSIC",
      sfx: "SFX",
      on: "ON",
      off: "OFF",
      motionAnnounce: "Motion",
      tiers: { full: "FULL", calm: "CALM", static: "OFF" },
    },
  },
  es: {
    siteTitleSuffix: "Ingeniero freelance",
    skipToContent: "Saltar al contenido",
    hud: {
      home: "Jhonatan Arenas, volver al inicio",
      menu: "Menú",
      closeMenu: "Cerrar menú",
      sections: "Secciones",
      join: "Únete al grupo",
      joinShort: "Unirme",
      languageSwitch: "Cambiar a inglés",
      options: "Opciones",
      closeOptions: "Cerrar opciones",
    },
    hero: {
      eyebrow: "Ingeniero freelance · Colombia · UTC-5",
      lore: "Conecto tu IA con tus sistemas, y la llevo a producción.",
      plain: "Servidores MCP a medida, Claude Code listo para tu equipo, bots de triage y apps llevadas de prototipo a producción.",
      joinCta: "Únete al grupo",
      questsCta: "Ver las misiones",
      menuLabel: "Menú principal",
    },
    sections: {
      abilities: { label: "Habilidades", sub: "Lo que construyo para ti", kicker: "Capítulo I · elige tu clase" },
      package: { label: "Paquete destacado", sub: "Lleva tu app hecha con IA a producción", kicker: "Destacado · paquete a precio fijo" },
      quests: { label: "Misiones", sub: "Trabajo entregado y código abierto", kicker: "Capítulo II · diario de misiones" },
      journey: { label: "El viaje", sub: "Cómo trabajamos juntos", kicker: "Capítulo III · el camino" },
      codex: { label: "Códice", sub: "Preguntas, respondidas", kicker: "Capítulo IV · crónicas" },
      arsenal: { label: "Arsenal", sub: "Con qué construyo", kicker: "Capítulo V · equipo" },
      party: { label: "Únete al grupo", sub: "Contrátame o agenda una llamada", kicker: "Capítulo final" },
    },
    nav: {
      abilities: { label: "Habilidades", sub: "Lo que construyo para ti" },
      package: { label: "Paquete", sub: "Lleva tu app a producción" },
      quests: { label: "Misiones", sub: "Trabajo entregado y código abierto" },
      journey: { label: "El viaje", sub: "Cómo trabajamos juntos" },
      codex: { label: "Códice", sub: "Preguntas, respondidas" },
      party: { label: "Únete al grupo", sub: "Contrátame o agenda una llamada" },
    },
    abilities: { idealFor: "Ideal para", gets: "Qué recibes", proof: "Prueba", start: "Empezar esta misión", startFor: "Empezar esta misión:", catalog: "Contrátalo como paquete a precio fijo", watch: "Ver el resumen de 40 segundos", videoTitle: "Resumen: De app hecha con IA a producción", close: "Cerrar", videoFallback: "Tu navegador no puede reproducir este video." },
    package: {
      pitch: "Un paquete de alcance y precio fijos para llevar una app hecha con Lovable, Cursor o Claude a AWS o a un VPS, con la red de seguridad que exige producción.",
      plus: "más",
      tiers: [
        { name: "Inicial", items: ["despliegue seguro", "dominio", "HTTPS"] },
        { name: "Estándar", items: ["CI/CD", "pruebas", "monitoreo"] },
        { name: "Avanzado", items: ["infraestructura como código", "respaldos", "staging"] },
      ],
      cta: "Ver el paquete en Upwork",
      watchFull: "Ver el video completo (40 s)",
      proofLead: "Respaldo:",
      proofLabels: { fulepu: "Migración de Fulepu a AWS", subinvoxa: "Subinvoxa" },
      previewLabel: "Vista previa del video del paquete",
      play: "Reproducir vista previa",
      pause: "Pausar vista previa",
    },
    classes: {
      "mcp-servers": {
        name: "El Conducto",
        idealFor: "Equipos cuyos agentes necesitan llegar de forma segura a sus APIs, bases de datos y herramientas internas.",
        gets: ["Herramientas tipadas", "Autenticación", "Pruebas y despliegue"],
      },
      "ai-coding-harness": {
        name: "El Artífice",
        idealFor: "Equipos que adoptan Claude Code, en laptops y en la nube.",
        gets: ["CLAUDE.md y AGENTS.md", "Flujo guiado por especificaciones y memoria persistente", "Claude Code en CI (GitHub Actions)"],
        ownProof: "Mi propia configuración de uso diario",
      },
      "bots-agents": {
        name: "El Heraldo",
        idealFor: "Equipos cuyas preguntas de soporte se acumulan en Slack, Discord o Teams.",
        gets: ["Bots de triage y soporte", "Clasificación con Jev", "Agentes de respuesta sobre AWS Bedrock"],
      },
      "prototype-to-production": {
        name: "El Herrero",
        idealFor: "Fundadores con una app de Lovable, Cursor o Claude que debe salir a producción.",
        gets: ["Pruebas, CI/CD, Docker", "Infraestructura con AWS CDK", "Despliegue en AWS o un VPS"],
      },
    },
    quests: {
      tablist: "Misiones",
      problem: "El problema",
      did: "Qué hice",
      outcome: "Resultado",
      stack: "Tecnologías",
      link: "Visitar",
      soon: "Enlace próximamente",
      stars: "estrellas",
      openSource: "Código abierto",
      clientWork: "Trabajo para clientes",
    },
    journey: { steps: ["La Convocatoria", "El Pacto", "El Camino", "La Entrega"], map: "Pasos del proceso" },
    codex: {
      languagesQ: "¿En qué idiomas trabajas?",
      locationQ: "¿Dónde estás y en qué zona horaria?",
      scopeQ: "¿Cómo funciona el alcance?",
      scopeLead: "El alcance queda fijo después de la llamada de descubrimiento.",
      whereQ: "¿Dónde trabajamos juntos?",
      whereUpwork: "En Upwork.",
      whereBooking: "Agenda una llamada y partimos de ahí.",
      whereBoth: "En Upwork, o agenda primero una llamada.",
      whereSoon: "Upwork y la agenda de llamadas llegan pronto. Por ahora, escríbeme por LinkedIn.",
      backgroundQ: "¿Cuál es tu trayectoria?",
    },
    arsenal: { intro: "Tecnologías agrupadas por el servicio al que aportan." },
    party: { loreTail: "Cuéntame la misión.", quest: "Misión", hint: "Elige un servicio arriba y aparece aquí.", soon: "Próximamente", languages: "Idiomas" },
    options: {
      title: "OPCIONES",
      motion: "MOVIMIENTO",
      music: "MÚSICA",
      sfx: "EFECTOS",
      on: "SÍ",
      off: "NO",
      motionAnnounce: "Movimiento",
      tiers: { full: "COMPLETO", calm: "SUAVE", static: "ESTÁTICO" },
    },
  },
};
