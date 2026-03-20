# Dependency Graph

The Graph page (`/graph`) provides an interactive visualization of your story dependencies, making it easy to understand the execution order and relationships between stories.

## Overview

Stories are displayed as nodes in a directed acyclic graph (DAG), with edges showing dependency relationships. The graph updates in real-time as stories progress through execution.

## Features

### Visual Indicators

- **Status colors** — each node is colored by its story status (pending, in progress, passed, merged, etc.)
- **Depth-based gradients** — a 25-color rainbow from yellow to cyan shows dependency depth at a glance
- **Checkpoint flags** — checkpoint stories are visually distinct with flag icons and dashed borders

### Interaction

- **Click** a node to highlight its ancestor chain — see exactly what a story depends on
- **Double-click** to open the story detail page
- **Drag** nodes to manually arrange them in custom layout mode
- **Mini-map** in the corner for navigating large graphs

### Layout Options

| Layout | Description |
|--------|-------------|
| Horizontal | Left-to-right flow |
| Vertical | Top-to-bottom flow |
| Horizontal Compact | Tighter horizontal spacing |
| Vertical Compact | Tighter vertical spacing |
| Custom | Manually arranged, saved per-project |

Custom layouts are saved automatically when you drag nodes. You can set a default layout per PRD.

### Controls

- **PRD selector** — filter by specific PRD or view all
- **Dead ends toggle** — show/hide stories with no dependents
- **External deps toggle** — show cross-PRD dependency edges
- **Set default** — remember your preferred layout per PRD
- **Delete layout** — remove saved custom layouts

## Cross-PRD Dependencies

Stories can depend on stories from other PRDs using the `"N:X.Y.Z"` format (e.g., `"1:1.2.1"` depends on story 1.2.1 from PRD 1). When "External deps" is enabled, these cross-PRD edges are visible in the graph.

## Tips

- Use the graph to identify bottlenecks — stories with many dependents are critical path
- Checkpoints appear as gates in the graph — everything downstream waits for them
- The compact layouts work better for large PRDs with many stories
- Custom layouts persist across sessions, so arrange once and it stays
