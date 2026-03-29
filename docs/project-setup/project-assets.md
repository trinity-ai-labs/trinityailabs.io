# Project Assets

Project assets are reference files you upload to help Trinity's AI agents understand your project visually and contextually. Think wireframes, brand guides, specs, screenshots, or design mockups.

## Uploading Assets

Navigate to your project's assets section to upload files. You can upload:

- **Individual files** — drag and drop or click to browse
- **Entire folders** — directory imports preserve the folder hierarchy automatically

Supported file types include images (PNG, JPG, SVG, WebP), PDFs, and other document formats.

## Folder Organization

When you import a folder, Trinity preserves the directory structure with parent-child relationships. This keeps your assets organized the same way you had them on disk.

## AI-Generated Descriptions

After uploading, Trinity can automatically generate descriptions for your assets using AI:

1. Files are analyzed first (up to 3 concurrently)
2. Then folders are described using their children's descriptions
3. Descriptions are saved back to each asset

This makes assets searchable and helps agents understand what each file contains without opening it.

## How Agents Use Assets

When planning stories, Trinity's planning pipeline can reference your uploaded assets:

- The `{{ASSET_BLOCK}}` in planning prompts tells agents to check for relevant uploads
- Stories get an `assets` field listing which uploaded files are relevant
- Implementing agents know to consult these assets when building features

For example, if you upload a wireframe for a login page, the story for building that login page will reference the wireframe so the implementing agent can match the design.

## Session Scoping

Assets can be scoped to specific sessions:

- **add-feature** — assets uploaded during feature planning
- **align-roadmap** — assets for roadmap alignment
- **align-prd** — assets for PRD alignment
- **onboarding** — assets uploaded during project onboarding

## Storage Limits

When using **Trinity Cloud** storage, each Pro seat includes 5 GB of managed storage (pooled across the team). If you exceed your quota, uploads will be blocked until you free up space or purchase additional 10 GB packs ($5/month each). See [Project Settings — Storage](/docs/project-setup/project-settings#storage) for details.

**BYO S3** and **Local Only** storage have no Trinity-imposed limits.

## Manifest View

The manifest provides a lightweight tree view of all assets with just descriptions (no file content or paths). This is what gets included in prompts so agents know what's available without the overhead of full file data.

## API

| Endpoint                           | Method | Purpose                                                           |
| ---------------------------------- | ------ | ----------------------------------------------------------------- |
| `/api/projects/[id]/assets`        | GET    | List assets (`?tree=1` for nested, `?manifest=1` for lightweight) |
| `/api/projects/[id]/assets`        | POST   | Upload files                                                      |
| `/api/projects/[id]/assets/import` | POST   | Import a directory                                                |
