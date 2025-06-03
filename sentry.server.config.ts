// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://c3290cc695222e822420e233498325cc@o4507186557485056.ingest.de.sentry.io/4507186559123536",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,
  enabled: process.env.NODE_ENV === 'production',

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: process.env.NODE_ENV === 'development',
  
});
