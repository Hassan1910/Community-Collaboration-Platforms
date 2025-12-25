# Implementation Plan: Developer Project Showcase

This plan outlines the phases to build the Developer Project Showcase platform using Next.js 16.

## Phase 1: Foundation & Infrastructure
**Goal**: Set up the project structure, database, and UI foundation.
- [x] **Project Setup**: Ensure Next.js 16 + React 19 + Tailwind 4 configuration is optimal.
- [x] **Database Setup**: Initialize a database (PostgreSQL via Supabase or local Docker).
- [x] **ORM Setup**: Set up Prisma for type-safe database access.
- [x] **UI Design System**:
    - [x] Install Shadcn/UI or similar component library.
    - [x] Define the "Developer" aesthetic (Dark mode, monospaced headers, accent colors).
    - [x] Create Layout wrapper (Navbar, Footer).

## Phase 2: Authentication & User Profiles
**Goal**: Allow developers to sign up and establish their identity.
- [x] **Authentication**: Implement Clerk or NextAuth.js (Auth.js).
    - *Requirement*: GitHub Login is mandatory.
- [x] **User Model**: Define schema for `User` (name, bio, github_handle, tech_stack).
- [x] **Profile Page**:
    - View/Edit Profile.
    - Display user's tech stack and bio.
    - List user's submitted projects.

## Phase 3: Core Features - Project Showcase
**Goal**: The main loop - posting and viewing projects.

### Database Schema Updates
- [x] **Project Model**:
    - `id`: CUID
    - `title`: String
    - `description`: String (Short summary)
    - `content`: String (Long description/Markdown)
    - `githubUrl`: String
    - `demoUrl`: String?
    - `tags`: String[]
    - `images`: String[]
    - `userId`: String (Relation to User)
    - `slug`: String (Unique, derived from title)
    - `createdAt`, `updatedAt`

### Feature: Project Submission (`/ship`)
- [x] **Submission Page**: `app/ship/page.tsx`
    - Form with Zod validation.
    - Fields: Title, Tagline, GitHub URL, Demo URL (opt), Tags, Markdown Body.
- [x] **Server Action**: `createProject`
    - Validate input.
    - Create `Project` record.
    - Redirect to `/project/[slug]`.

### Feature: The Feed (`/`)
- [x] **Feed UI**: `app/page.tsx` (or `app/(feed)/page.tsx`)
    - Fetch latest projects.
    - `ProjectCard` component.
    - Grid layout.

### Feature: Project Detail (`/project/[slug]`)
- [x] **Detail UI**: `app/project/[id]/page.tsx`
    - Display project header (title, author, links).
    - Render Markdown content.
    - Display screenshots/images.

## Phase 4: Collaboration & Social Interactions
**Goal**: Build the community aspect.
- [x] **Engagement Models**: Add `Comment`, `Like`/`Upvote`, `Follow` to schema.
- [x] **Comments Section**: Threaded comments on project detail pages.
- [x] **Collaboration Signals**:
    - Add "Seeking Contributors" toggle to Projects.
    - Add filter to Feed: "Show projects needing help".
- [x] **Notifications**: Basic notification system (Someone commented on your project).

## Phase 5: Automated Highlights & Polish
**Goal**: The unique value prop - Weekly Highlights.

## User Review Required
> [!NOTE]
> We are adding a new "Highlights" page that will feature trending projects.

## Proposed Changes

### Data Access
#### [NEW] [highlights.ts](file:///home/hassan/projects/ccp/lib/data/highlights.ts)
- Implement `getWeeklyHighlights()` using Prisma.
- Query logic: Projects created in last 7 days (or all time if not enough), ordered by (likes * 2 + comments).

### UI Components
#### [NEW] [page.tsx](file:///home/hassan/projects/ccp/app/highlights/page.tsx)
- Grid layout for "Weekly Winners".
- Re-use `ProjectCard` but with a "Winner" badge or special styling.

### SEO & Metadata
#### [MODIFY] [page.tsx](file:///home/hassan/projects/ccp/app/project/[slug]/page.tsx)
- Update `generateMetadata` to include open graph images and description.

### Quality of Life
#### [NEW] [loading.tsx](file:///home/hassan/projects/ccp/app/loading.tsx)
- Add a skeleton loader for the main layout.
#### [NEW] [error.tsx](file:///home/hassan/projects/ccp/app/error.tsx)
- Add a graceful error boundary.

## Verification Plan
### Automated Tests
- `pnpm build`: Ensure no type errors.
### Manual Verification
1. **Highlights**: Navigate to `/highlights` locally. Verify that projects with the most engagement appear.
2. **Metadata**: Inspect element on a project page `<head>` to see OG tags.
3. **Loading**: Use network throttling to verify `loading.tsx` appears.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: Clerk
