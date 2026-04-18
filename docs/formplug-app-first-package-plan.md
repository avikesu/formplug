# Formplug App-First Package Plan

## Goal

Turn the current working Next.js product into a cleaner, package-ready Formplug app first, then extract the reusable React 19 library once the internal boundaries are stable.

This approach keeps the current app usable while making package extraction a controlled follow-up step instead of a rewrite.

## V1 Scope

Included:

- Visual drag-and-drop builder
- Runtime form renderer
- Field and plugin registration API
- Persistence adapter hooks
- Styled React 19 components

Excluded for now:

- Angular, Vue, or plain HTML packages
- PDF and export features
- Reusable analytics and dashboard package

## Product Direction

- React 19 is the only supported application target for v1.
- The current Next.js app remains the reference implementation.
- Future multi-framework support can be planned after the React package boundary is stable.
- Branding remains Formplug.

## Architecture Rule

Reusable layer:

- Builder state
- Field registry
- Runtime renderer
- Default fields
- Adapter and callback contracts

App layer:

- Clerk authentication
- Prisma persistence
- Next.js routes
- Dashboard pages
- Analytics
- Host-side persistence implementation

## Phases

| Phase | Focus | Outcome |
| --- | --- | --- |
| 1 | Product positioning and domain contracts | Formplug is framed as a React 19 form-builder product, with typed builder and runtime models |
| 2 | Decouple reusable code from app services | Builder and renderer stop depending directly on Prisma, Clerk, and server actions |
| 3 | Use the app as the host implementation | The current app keeps working but now consumes cleaner contracts |
| 4 | Extraction readiness | Reusable code can be moved into a package with lower risk |

## Execution Steps

1. Replace generic project messaging with Formplug product messaging in the README and other surfaced copy.
2. Introduce a typed form document model so reusable components stop depending on Prisma-generated Form objects.
3. Refactor the builder shell to accept plain typed data plus save and publish callbacks or adapters.
4. Refactor the runtime submission component to accept a submit callback or adapter instead of importing app server actions directly.
5. Move all JSON parsing and stringification to route, action, or mapper utilities instead of reusable UI components.
6. Evolve the fixed field registry into a default registry plus extension points for custom fields.
7. Keep the designer context, builder canvas, and field components app-agnostic.
8. Update route wrappers so they fetch and deserialize app data, then pass typed props into the reusable layer.
9. Keep Prisma models, server actions, Clerk auth, routes, dashboard pages, and analytics inside the app layer.
10. Add an internal export surface that matches the future package boundary.
11. Extract the reusable package only after the app is fully running on the new contracts.

## Key Files

- [components/FormBuilder.tsx](../components/FormBuilder.tsx)
- [components/FormSubmitComponent.tsx](../components/FormSubmitComponent.tsx)
- [components/FormElements.tsx](../components/FormElements.tsx)
- [components/context/DesignerContext.tsx](../components/context/DesignerContext.tsx)
- [components/Designer.tsx](../components/Designer.tsx)
- [components/DesignerSidebar.tsx](../components/DesignerSidebar.tsx)
- [components/PropertiesFormSidebar.tsx](../components/PropertiesFormSidebar.tsx)
- [components/FormElementSidebar.tsx](../components/FormElementSidebar.tsx)
- [actions/form.ts](../actions/form.ts)
- [app/(dashboard)/builder/[id]/page.tsx](../app/(dashboard)/builder/[id]/page.tsx)
- [app/submit/[formUrl]/page.tsx](../app/submit/[formUrl]/page.tsx)
- [prisma/schema.prisma](../prisma/schema.prisma)
- [README.md](../README.md)
- [package.json](../package.json)

## Verification

1. Existing flows still work: create, build, save, publish, share, submit, and review submissions.
2. Builder and runtime components no longer import app-specific persistence directly.
3. A custom field can be registered without changing builder internals.
4. Reusable modules can be imported without requiring Next.js routes or Prisma-generated types.

## Recommended First Milestone

1. Define the typed form document and mapper utilities.
2. Decouple the builder and submit components from server actions.
3. Open up the field registry for extension.
4. Update the README and product messaging.

## Decisions Already Made

- First milestone is an improved application, not immediate npm publication.
- V1 includes drag-and-drop building, runtime rendering, plugin registration, and persistence adapters.
- Styled components are included for v1.
- Analytics, PDF, and non-React framework support are deferred.
