# weRent - Nigerian Property Rental Platform

weRent is a frontend-only property rental marketplace prototype for Nigeria. It connects renters, landlords, and assigned agents through a searchable property marketplace, applications, inspections, caution-fee workflows, tenancy support, and role-based workspaces.

## Stack

- HTML5 for the document shell and semantic page structure
- CSS3 for the visual system, responsive layouts, breakpoints, animations, and accessibility states
- Vanilla JavaScript with no framework or build step
- Browser `localStorage` for demo sessions, listings, workflows, notifications, and preferences
- Hash-based client-side routing instead of a server router
- Google Fonts: DM Sans and Space Grotesk
- Remote Unsplash images for property and background imagery
- WhatsApp `wa.me` links for contact actions
- OpenStreetMap links for listing coordinates

 The backend is currently an Express foundation with health endpoints and PostgreSQL configuration. Business API routes, real authentication, payment gateway, analytics, and document storage are not implemented yet.
server/server.js                 Backend process entrypoint
server/src/app.js                Express app, middleware, and health endpoints
server/src/config/database.js    PostgreSQL connection pool
server/src/middleware/auth.js    JWT authentication and role middleware
server/src/routes/auth.js        Registration, login, and current-user routes
server/src/routes/properties.js  Property search, detail, and create routes
server/src/routes/applications.js Application submission and status routes
server/src/db/schema.sql         PostgreSQL users and properties schema
server/test-db.js               PostgreSQL connectivity check
server/.env.example              Backend environment variable template

## Backend Status and Future Integration

The backend can be started from the `server/` directory with:

```bash
cd server
npm install
npm start
```

Database commands:

```bash
npm run db:check
npm run db:init
```

Run `db:init` only after the PostgreSQL credentials in `server/.env` are valid. It applies `server/src/db/schema.sql` and creates the users, properties, and property indexes.

Available endpoints:

- `GET /api/health` - confirms that the API process is running
- `GET /api/health/database` - checks PostgreSQL connectivity
- `POST /api/auth/register` - create a renter, landlord, or agent account
- `POST /api/auth/login` - authenticate and receive a JWT
- `GET /api/auth/me` - retrieve the authenticated user
- `GET /api/properties` - search and filter properties
- `GET /api/properties/:id` - retrieve one property
- `POST /api/properties` - create a property for an authenticated landlord or agent
- `GET /api/applications` - list applications visible to the authenticated user
- `POST /api/applications` - submit an application as a renter
- `PATCH /api/applications/:id/status` - update an application as an agent, landlord, or admin

`server/src/app.js` now provides Express, CORS, Helmet, JSON parsing, and these health endpoints. The database health endpoint currently returns `503` until the PostgreSQL password in the local `.env` file is corrected.

The server also refuses to start when `JWT_SECRET` or `DATABASE_URL` still contains the placeholders from `.env.example`. Replace those values directly in `server/.env`; secrets should not be committed to source control.

`js/services.js` still provides the frontend API-shaped service boundary. Replace the local adapters with `fetch('/api/...')` calls after the backend business routes are implemented. The next backend work should add server-side authentication, authorization, validation, property/listing APIs, image/document storage, verified transactions, real WhatsApp/contact data, geocoded coordinates, audit logs, and refund controls.

## Main Features

### Public marketplace

- Responsive homepage, marketplace, and property-detail views
- Property search by title, city, area, or location text
- Nigerian location selector covering all 36 states plus FCT Abuja
- Property-type and verification filters
- Minimum and maximum annual rent filters
- Grid/list marketplace layouts
- Pagination for property results
- Saved/favorite properties
- Verified and under-review listing states
- Property image gallery in the details modal
- WhatsApp contact links for the listing contact
- OpenStreetMap links using demo listing coordinates

Unauthenticated visitors are redirected to registration when they try to access property results or listing details. The requested route is remembered and restored after registration.

### Authentication simulation

- Sign in, sign up, and password-reset views
- Renter, landlord, and agent role selection during registration
- Session persistence through `localStorage`
- Mobile auth layout hides the promotional panel and uses a full-width form
- Desktop auth layout keeps the property-themed promotional panel
- Responsive auth actions with right-aligned password recovery and full-width primary actions

### Renter workspace

- Overview dashboard
- Search properties and saved homes
- Application submission with proof-of-income upload UI
- Application timeline and status progression
- Inspection scheduling and rescheduling
- Simulated caution-fee payment
- Payment receipt and print action
- Approved-tenancy workspace
- Assigned-agent messaging
- Notifications
- Profile editing and demo account verification
- Maintenance issue reporting
- Refund requests
- Dispute submission

### Landlord workspace

- Managed property listings
- Add property workflow
- Local property image selection and preview
- Base64 image persistence in `localStorage`
- Edit listings
- Activate/deactivate listings
- Verification queue behavior
- Listing contact and map actions

### Agent workspace

- Assigned properties
- Renter/application review
- Document-review progression
- Inspection scheduling
- Caution-fee requests and confirmations
- Transaction history
- Refund review
- Disputes and messages

### Admin workspace

- User management with suspend/activate actions
- Property verification
- Transactions, refunds, and disputes
- Audit logs
- Platform reports
- Printable reports
- Local Settings view
- Compact dashboard density option
- Demo workflow-data reset

## Project Structure

```text
index.html                       Application shell and script load order
README.md                        Project documentation
assets/images/werent-mark.svg    Local brand asset
css/styles.css                   Design system, layouts, responsive rules, and animations
js/app.js                        Main data, hash router, views, workflows, modals, and events
js/services.js                   API-ready service adapter boundaries
js/standalone.js                 Standalone property-detail route renderer
js/property-upload.js            Add-property image upload enhancement
js/access-guard.js               Registration gate for listings and property details
js/marketplace-enhancements.js   State/price filters and WhatsApp/map actions
js/loading.js                    Branded page-load overlay behavior
tests/smoke.html                 Manual browser smoke checks
```

## Routing

The app renders into `#app` and uses URL hashes:

- `#home`
- `#properties`
- `#property/WR-1048`
- `#auth-login`
- `#auth-signup`
- `#auth-forgot`
- `#dashboard/overview`
- `#dashboard/properties`
- `#dashboard/applications`
- `#dashboard/payments`
- `#dashboard/tenancy`
- `#dashboard/messages`
- `#dashboard/profile`
- `#settings`

## Script Load Order

Scripts are loaded in `index.html` in this order:

1. `services.js` - API-shaped service boundaries
2. `app.js` - core data, rendering, routing, views, and event binding
3. `standalone.js` - standalone property-detail rendering
4. `property-upload.js` - image-upload enhancement
5. `access-guard.js` - registration protection and pending-route restoration
6. `marketplace-enhancements.js` - state, price, WhatsApp, and map enhancements
7. `loading.js` - page-load overlay completion behavior

## Run Locally

Open `index.html` directly in a browser, or serve the folder with any static file server. No Node.js installation is required.

For the manual smoke checks, open `tests/smoke.html` and select **Run checks**. The demo property route is `#property/WR-1048`, and the Settings route is `#settings`.

## Demo Accounts

All demo accounts use the password `password123`:

- Renter: `renter@werent.test`
- Landlord: `landlord@werent.test`
- Agent: `agent@werent.test`
- Admin: `admin@werent.test`

## Local Data and Business Rules

The store wrapper in `app.js` prefixes keys with `weRent_`. It persists the current user, saved properties, layout preference, applications, inspections, transactions, refunds, managed listings, messages, notifications, maintenance issues, disputes, profiles, audit logs, verification state, settings, suspended users, and demo password state.

The core caution-fee rule is intentionally repeated throughout the interface:

- The landlord owns the property.
- The assigned agent receives and manages the renter's caution fee.

The payment flow only simulates a transaction and never moves real money.

## Responsive Design and Accessibility

- Breakpoints at 900px, 640px, and 380px
- Responsive public pages, auth views, dashboards, filters, cards, tables, modals, and mobile navigation
- Horizontal scrolling for wide data tables on small screens
- Focus-visible outlines for interactive elements
- Modal dialog semantics, Escape handling, Tab trapping, backdrop close, and focus restoration
- Live regions for loading, toasts, and pagination updates
- Image alt text and control labels where applicable
- Reduced-motion support through `prefers-reduced-motion`
- Page-load, content-rise, stagger, modal, fade, hover, and image animations

## Limitations

This is a browser-only simulation:

- `localStorage` is not secure storage
- Authentication and authorization are not real
- Dashboard routes should receive server-side authorization in production
- Uploaded images are converted to base64 and remain in the current browser
- Demo WhatsApp numbers and map coordinates must be replaced with real listing data
- Payments, refunds, notifications, audit records, and verification are simulated
- Remote fonts and images require network access
- There is no production CSV export implementation yet
- The smoke checks are manual and there is no build, lint, or automated browser-test configuration

## Future Backend Integration

`js/services.js` provides a small API-ready boundary. Replace the local adapters with `fetch('/api/...')` calls when a backend is available. A production version should add server-side authentication, authorization, validation, image/document storage, verified transactions, real WhatsApp/contact data, geocoded coordinates, audit logs, and refund controls.
