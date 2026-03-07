/**
 * Netlify server function for Vike SSR.
 * Serves all non-static requests; static assets are served from dist/client.
 * Vike loads the server build from dist/server/ automatically in production.
 * @see https://vike.dev/netlify-functions
 * @see https://vike.dev/server-integration
 */

import { renderPage } from "vike/server";

/** Run on any path; preferStatic lets Netlify serve static files first. */
export const config = {
  path: "/*",
  preferStatic: true,
};

/**
 * Netlify Functions 2.0 handler: receives Request and Context, returns Response.
 * When invoked via redirect, path is in ?path=:splat; we reconstruct the original URL.
 * @param {Request} request
 * @param {import("@netlify/functions").Context} _context
 * @returns {Promise<Response>}
 */
export default async function handler(request, _context) {
  try {
    const url = new URL(request.url);
    const pathFromQuery = url.searchParams.get("path");
    const urlOriginal =
      pathFromQuery !== null && pathFromQuery !== ""
        ? `${url.origin}/${pathFromQuery}`
        : request.url;
    const pageContextInit = { urlOriginal };
    const pageContext = await renderPage(pageContextInit);
    const { statusCode, headers: headersList, body } = pageContext.httpResponse;

    const headers = new Headers();
    for (const [name, value] of headersList) {
      headers.set(name, value);
    }

    return new Response(body, {
      status: statusCode,
      headers,
    });
  } catch (err) {
    console.error("[Vike SSR]", err);
    return new Response(`SSR error: ${err?.message ?? String(err)}`, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
