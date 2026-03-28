# Navigating the UI

Trinity's interface is organized around a sidebar navigation with contextual pages for each major feature area.

## Sidebar

The sidebar is always visible on the left side of the screen. It provides access to all major sections:

### Project Selector

At the top of the sidebar, you'll find the active project name. Click it to switch between projects or create a new one.

### Main Navigation

- **Plan** — PRD management, planning dashboard, story graph
- **Run** — execution control, active stories, gate approvals
- **Stories** — browse and filter all stories across PRDs
- **Knowledge** — project knowledge base (vault)
- **Activity** — global activity feed with filters (project, category, actor)
- **Recaps** — activity summaries by time period
- **Metrics** — execution analytics and cost tracking
- **Settings** — project and app configuration

### Task Indicator

The sidebar shows a task indicator when background operations are running (e.g., PRD generation, diagnose). It displays the current phase and progress.

## Page Layouts

### Planning Dashboard

The planning dashboard is your command center for PRD management:

- **PRD tabs** — switch between PRDs using numbered tabs at the top
- **Phase progress** — visual progress bars for each phase
- **Stats cards** — story counts, completion rates, dependency status
- **Action buttons** — generate PRD, add feature, align (pre-PRD) / diagnose (post-PRD)

### Story Graph

The dependency graph visualizes relationships between stories:

- **Nodes** represent stories, colored by status (pending, running, complete, failed)
- **Edges** show dependencies between stories
- **Zoom and pan** to navigate large graphs
- **Click a node** to view story details
- **Layouts** can be saved and restored

### Run Page

The run page shows execution state:

- **Coordinator status** — running, stopped, or idle
- **Active stories** — currently executing with pipeline phase indicators
- **Gate queue** — stories paused at gates waiting for your input
- **Worker status** — how many workers are active and what they're doing

### Story Detail

Click any story to see its full details:

- **Description** and acceptance criteria
- **Metadata** — difficulty, surface area, dependencies, tags
- **Pipeline status** — which agent phase it's in
- **Agent handoffs** — reports from each agent in the pipeline
- **PR and merge status** — for completed stories

### Knowledge Base

The knowledge base is organized as:

- **Books** — top-level containers (your project knowledge, gotchas, this user guide)
- **Sections** — grouped chapters within a book
- **Chapters** — topic areas
- **Pages** — individual knowledge articles

Navigate by expanding sections in the left panel, or use the search bar to find specific content.

### Help Assistant

A floating help button appears in the bottom-right corner of every page. Click it to open a chat where you can ask questions about how to use Trinity. The assistant answers from the user guide — it won't make changes to your project. You can paste screenshots to ask about specific UI elements.

## Common Actions

### Adding a Feature

1. Navigate to **Plan**
2. Click **Architect**
3. Describe what you want in the chat interface
4. Review the generated stories
5. Confirm to add them to your PRD

### Approving a Gate

1. Navigate to **Run**
2. Look for stories with a gate indicator
3. Click the gate to review the agent's request
4. Choose to **Approve**, **Skip**, or provide **Feedback**

### Searching the Knowledge Base

1. Navigate to **Knowledge**
2. Use the search bar at the top
3. Results show matching pages across all books
4. Click a result to navigate directly to that page

### Exporting a Report

1. Navigate to **Recaps**
2. Click the **Reports** button
3. Choose report type (Executive or Technical)
4. Select the time period
5. Click **Download** to get a PDF

## Keyboard Shortcuts

Trinity supports standard navigation patterns:

- Use the sidebar to switch between major sections
- Browser back/forward buttons work for navigation history
- Search is available in the Knowledge Base section

## Responsive Design

Trinity is designed primarily for desktop use. The interface works best on screens 1280px or wider. The sidebar can be collapsed on smaller screens to maximize content area.
