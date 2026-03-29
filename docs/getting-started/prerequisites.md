# Prerequisites & Tool Setup

Trinity relies on a few command-line tools to create projects, manage repositories, and run AI agents. This page covers what you need and how to set it up.

Trinity checks for these tools **contextually** — when you try to create a project, start a run, or delete a project, you'll see a clear message if something is missing, along with the exact command to fix it.

## Required Tools

### Git

Git is required for all project operations — creating repos, managing branches, and running worktrees for parallel execution.

**macOS:**

```bash
xcode-select --install
```

A system dialog will appear — click **Install** and wait for it to complete. This installs Git along with other developer tools Trinity uses.

**Linux (Debian/Ubuntu):**

```bash
sudo apt install git
```

**Linux (Fedora):**

```bash
sudo dnf install git
```

**Configure your identity** (required for commits, both platforms):

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Trinity checks this when you create or import a project. If name or email aren't set, you'll be prompted to configure them.

### GitHub CLI (`gh`)

The GitHub CLI is used to create repositories, manage pull requests, and handle branch operations during execution.

**macOS (Homebrew):**

```bash
brew install gh
```

**Linux (Debian/Ubuntu):**

```bash
(type -p wget >/dev/null || sudo apt install wget) \
  && sudo mkdir -p -m 755 /etc/apt/keyrings \
  && out=$(mktemp) && wget -nv -O$out https://cli.github.com/packages/githubcli-archive-keyring.gpg \
  && cat $out | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
  && sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
  && sudo apt update \
  && sudo apt install gh
```

Or see [cli.github.com](https://cli.github.com) for other distributions.

**Authenticate (both platforms):**

```bash
gh auth login
```

Follow the prompts to authenticate with your GitHub account. Trinity checks this when you create or import a project.

#### Delete Permissions

If you want to use the **Delete Project** feature (in Project Settings > Danger Zone), the GitHub CLI needs the `delete_repo` scope. This is not granted by default.

```bash
gh auth refresh -s delete_repo
```

Trinity will prompt you for this if needed when you try to delete a project.

### Node.js

Node.js 18+ is required for Trinity itself and for installing Claude Code CLI.

**macOS (Homebrew):**

```bash
brew install node
```

**macOS (nvm — recommended if you work with multiple Node versions):**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install 22
```

**Linux (Debian/Ubuntu):**

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify it's installed:

```bash
node --version
```

You should see `v18.x.x` or higher.

### Claude Code CLI

Claude Code is the AI agent that powers Trinity's story execution. It's the engine behind the Analyst, Implementer, Auditor, and Documenter phases — the thing that actually writes, reviews, and tests your code.

You don't need Claude Code during project setup or planning. Trinity only checks for it when you're ready to start executing stories.

#### Step 1: Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

Verify the installation:

```bash
claude --version
```

If you see a version number, you're good.

#### Step 2: Authenticate Claude Code

Claude Code needs access to an AI provider. Run:

```bash
claude login
```

This opens your browser to authenticate with Anthropic. Once approved, Claude Code stores the credentials locally.

Alternatively, if you have an Anthropic API key, you can set it as an environment variable:

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

Add this to your shell profile (`~/.zshrc` on macOS, `~/.bashrc` on Linux) so it persists across terminal sessions:

```bash
echo 'export ANTHROPIC_API_KEY="sk-ant-..."' >> ~/.zshrc
source ~/.zshrc
```

#### Step 3: Verify it works

Run a quick test to make sure Claude Code can communicate with the API:

```bash
echo "Say hello" | claude --print
```

You should see a response from Claude. If you get an authentication error, double-check your API key or re-run `claude login`.

#### Updating Claude Code

To update to the latest version:

```bash
npm update -g @anthropic-ai/claude-code
```

#### Troubleshooting Claude Code

**"claude: command not found"** — The global npm bin directory isn't in your PATH. Find it with `npm bin -g` and add it to your shell profile:

```bash
export PATH="$(npm bin -g):$PATH"
```

**"nvm: npm global packages not found"** — If you use `nvm`, global packages are installed per Node version. After switching Node versions, reinstall:

```bash
npm install -g @anthropic-ai/claude-code
```

**Authentication issues** — Re-authenticate:

```bash
claude login
```

Or verify your API key is set:

```bash
echo $ANTHROPIC_API_KEY
```

## Optional Tools

### Docker Desktop

Some projects use Docker Compose for local development services (databases, caches, etc.). Docker is only needed if your project's tech stack includes containerized services.

**Install:** [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)

Trinity detects Docker usage during the onboarding wizard and shows a reminder if Docker Desktop isn't running when needed.

## When Checks Happen

| Action                  | What's checked                                           |
| ----------------------- | -------------------------------------------------------- |
| Create new project      | Git (installed + configured), GitHub CLI (authenticated) |
| Import existing project | Git (installed + configured), GitHub CLI (authenticated) |
| Start execution run     | Claude Code CLI (installed)                              |
| Delete project          | GitHub CLI `delete_repo` scope                           |
| Docker projects         | Docker Desktop (running)                                 |

If a check fails, you'll see an inline alert with the exact command to run. After running the command, click **Check Again** to verify.

## Troubleshooting

### "git: command not found"

- **macOS:** Run `xcode-select --install` to install Xcode Command Line Tools
- **Linux:** Run `sudo apt install git` (Debian/Ubuntu) or `sudo dnf install git` (Fedora)

### "gh: command not found"

The GitHub CLI isn't in your PATH. Restart your terminal after installation, or install it:

- **macOS:** `brew install gh`
- **Linux:** See install instructions above, or visit [cli.github.com](https://cli.github.com)

### "claude: command not found"

The Claude Code CLI isn't installed globally. Run:

```bash
npm install -g @anthropic-ai/claude-code
```

If you use `nvm` or similar, ensure the global bin directory is in your PATH.

### Token expired / authentication errors

GitHub CLI tokens can expire. Re-authenticate:

```bash
gh auth login
```

Or refresh your existing token with additional scopes:

```bash
gh auth refresh -s delete_repo
```

### Git identity not configured

Git requires a name and email for commits. Set them globally:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```
