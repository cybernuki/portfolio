import { NextResponse, type NextRequest } from "next/server";
import { detectLocale } from "@/features/i18n/domain/locale";

/** Browser language detection: "/" redirects to the best locale. The visible switch lets people override it. */
export function proxy(request: NextRequest) {
  const locale = detectLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}`;
  const res = NextResponse.redirect(url, 307);
  res.headers.set("Vary", "Accept-Language");
  return res;
}

export const config = { matcher: ["/"] };
