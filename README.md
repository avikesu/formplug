# Formplug

Formplug is a React 19 form-builder product built on Next.js. It currently ships as a working host application with a drag-and-drop builder, public form submission flow, publishing, sharing, and submission review.

The codebase is being shaped toward a reusable React 19 package. The current app remains the reference implementation while the builder engine, renderer, typed form model, and field registry are being separated from app-specific concerns like auth, routing, and persistence.

## Current Status

- React 19 is the only supported runtime target in v1.
- The Next.js app is the primary way to run and test the product.
- Builder and submit flows now use typed form documents and app-side persistence adapters.
- Field registration is now registry-based, which is the foundation for future custom fields and package extraction.

## Features

- Drag-and-drop form builder
- Live form preview
- Publish and share flow
- Public form submission route
- Submission analytics and table view
- Clerk authentication for protected dashboard routes
- Prisma-backed persistence

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the app for production validation:

```bash
npm run build
```

The app runs at `http://localhost:3000` by default.

## Environment

The app depends on:

- Clerk for authentication
- Prisma/PostgreSQL for persistence

If Google login fails with a `400` response, check the Clerk dashboard configuration for the current instance before changing app code again. The most common remaining cause is OAuth redirect configuration outside the repo.

## Architecture Direction

The active plan is documented here:

- [docs/formplug-app-first-package-plan.md](docs/formplug-app-first-package-plan.md)

Current separation of concerns:

- Reusable layer: typed form model, builder canvas, renderer, field registry, field components, registry provider
- App layer: Clerk auth, Prisma actions, Next.js routes, dashboard pages, host-side adapters

## Key Paths

- [components/FormBuilder.tsx](components/FormBuilder.tsx)
- [components/FormSubmitComponent.tsx](components/FormSubmitComponent.tsx)
- [components/FormElements.tsx](components/FormElements.tsx)
- [components/context/FormElementsContext.tsx](components/context/FormElementsContext.tsx)
- [lib/forms.ts](lib/forms.ts)
- [lib/form-app-adapters.ts](lib/form-app-adapters.ts)
- [actions/form.ts](actions/form.ts)

## Near-Term Plan

1. Finish documentation and testing guidance
2. Add a custom field example that proves the registry extension API
3. Continue isolating app-only concerns from the reusable builder surface
4. Prepare an internal package export surface before extracting a package workspace
