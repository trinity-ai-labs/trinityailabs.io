# AI Model Configuration

Trinity uses a tiered model system to balance quality and cost across different operations. You can configure which models are used at each tier.

## Model Tiers

Trinity has four tiers, each suited to different types of work:

### Reasoning Tier

The most capable tier, used for tasks requiring deep thinking:

- Complex story implementation (difficulty 4-5)
- Full PRD generation (architect phase)
- Codebase audits
- Architecture analysis

**Minimum intelligence level:** Opus-class models

### Standard Tier

The everyday workhorse, used for routine tasks:

- Regular story implementation (difficulty 1-3)
- Analyst and implementer phases for simpler stories
- Story auditing

**Minimum intelligence level:** Sonnet-class models

### Fast Tier

Quick, bounded judgment tasks:

- Onboarding Q&A
- Documentation generation
- Roadmap section generation
- PRD editing
- Calibrator and dependency-mapper pipeline phases

**Minimum intelligence level:** Sonnet-class models

### Micro Tier

Mechanical, low-intelligence tasks:

- Classification and scoring
- Preflight checklists
- Recap search triage
- Status checks

**Minimum intelligence level:** Haiku-class models

## Providers

Trinity supports three AI providers:

### Anthropic

The primary provider with three model families:

- **Claude Opus 4.6** — highest capability, used for reasoning tier
- **Claude Sonnet 4.6** — balanced performance, used for standard and fast tiers
- **Claude Haiku 4.5** — fast and efficient, used for micro tier

### DeepSeek

Alternative provider with two models:

- **DeepSeek Reasoner** — reasoning-capable model
- **DeepSeek Chat** — general-purpose model

### Ollama

Local model support for offline/private execution:

- **Qwen3 Coder** — code-focused model
- **GLM 4.7** — general-purpose
- **DeepSeek Coder** — code-focused

## Configuring Models

1. Navigate to **Settings**
2. Find the AI Models section
3. For each tier, select a provider and model from the dropdown

Settings are stored as `provider:model` strings (e.g., `anthropic:claude-opus-4-6`).

### Defaults

| Tier      | Default Model     |
| --------- | ----------------- |
| Reasoning | Claude Opus 4.6   |
| Standard  | Claude Sonnet 4.6 |
| Fast      | Claude Sonnet 4.6 |
| Micro     | Claude Haiku 4.5  |

## Dynamic Tier Resolution

Some operations dynamically choose between tiers based on context:

- **Story execution** — stories with difficulty 4+ or large surface area automatically use the reasoning tier instead of standard
- **Planning pipeline** — the architect phase uses reasoning, while calibrator and dependency-mapper use fast

This means a low-difficulty story costs less than a high-difficulty one, even though both go through the same pipeline.

## Fallback Behavior

If a non-Anthropic model fails during execution:

1. The operation is retried once with the Anthropic fallback model for that tier
2. If the fallback also fails, the operation fails normally

This provides resilience when using alternative providers — you get automatic fallback to the primary provider without losing the cost savings of using alternatives for successful runs.

## Timeout Tiers

Each model tier has associated timeout limits:

| Tier               | Timeout    |
| ------------------ | ---------- |
| Micro              | 5 minutes  |
| Fast (Short)       | 15 minutes |
| Standard (Default) | 30 minutes |
| Reasoning (Long)   | 1 hour     |

Operations that exceed their timeout are cancelled and marked as failed.

## Cost Considerations

Model costs vary significantly:

- **Reasoning tier** is the most expensive — use it only where quality matters (Trinity does this automatically for hard stories)
- **Standard tier** offers the best quality-to-cost ratio for most work
- **Fast tier** is cost-effective for bounded tasks that don't need deep reasoning
- **Micro tier** is very cheap, used for mechanical classification

The Metrics dashboard tracks token usage and cost by operation, helping you understand where your budget goes.

## Tips

- **Start with defaults** — the default configuration is well-balanced for most projects
- **Use DeepSeek for cost savings** — if you have a DeepSeek API key, using it for the fast or standard tier can reduce costs significantly
- **Use Ollama for privacy** — local models keep all data on your machine, but expect slower execution and potentially lower quality
- **Monitor the cost tab** — check Metrics → Cost to understand your spending patterns before making changes
- **Don't downgrade reasoning** — the reasoning tier handles your most complex stories; using a less capable model here leads to more failures and retries, which can cost more in the end
