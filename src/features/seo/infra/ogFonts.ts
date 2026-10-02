const OLD_UA = "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1";

export interface OgFont {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal" | "italic";
}

/**
 * Loads a Google font subset for the OG image at build time. The identity fonts are open-licensed.
 * Any failure (offline build, blocked network) returns null and the image falls back to the default sans.
 */
export async function loadOgFont(family: string, weight: 400 | 700, text: string, italic = false): Promise<OgFont | null> {
  try {
    const axis = italic ? `ital,wght@1,${weight}` : `wght@${weight}`;
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:${axis}&text=${encodeURIComponent(text)}`, {
        headers: { "User-Agent": OLD_UA },
        signal: AbortSignal.timeout(6000),
      })
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    return { name: family, data: await res.arrayBuffer(), weight, style: italic ? "italic" : "normal" };
  } catch {
    return null;
  }
}
