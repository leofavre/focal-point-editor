/**
 * Netlify server function for Vike SSR.
 * Serves all non-static requests; static assets are served from dist/client.
 * Vike loads the server build from dist/server/ automatically in production.
 * @see https://vike.dev/netlify-functions
 * @see https://vike.dev/server-integration
 */

import { renderPage } from "vike/server";

/**
 * Netlify Functions 2.0 handler: receives Request and Context, returns Response.
 * @param {Request} request
 * @param {import("@netlify/functions").Context} _context
 * @returns {Promise<Response>}
 */
export default async function handler(request, _context) {
  const pageContextInit = { urlOriginal: request.url };
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
}
