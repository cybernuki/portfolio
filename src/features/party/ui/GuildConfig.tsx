"use client";

import { useEffect } from "react";
import { guildStore } from "./guildStore";

/** Registers the real service and quest ids with the selection store. Renders nothing. */
export function GuildConfig({ services, quests }: { services: string[]; quests: string[] }) {
  const servicesKey = services.join("|");
  const questsKey = quests.join("|");
  useEffect(() => {
    guildStore.configure({ services: servicesKey.split("|"), quests: questsKey.split("|") });
  }, [servicesKey, questsKey]);
  return null;
}
