# HA7CH FDE Camp

An open Agent Skill that introduces HA7CH FDE Camp and answers prospective-participant questions about the story, FDE and ANC methods, requirements, curriculum, Whiteboard Interview, certification, suitability, hands-on ANC building, and current cohort.

The conversation starts with why HA7CH came here and what it did before, then explains how the Camp turns that field experience into a training and project path.

## Install

Ask Codex or another compatible coding agent:

> Install the Skill from https://github.com/HA7CH/anc-fde-camp

Or use the Skills CLI:

```bash
npx skills add HA7CH/anc-fde-camp --skill fde-camp
```

After installation, ask the Agent:

> Use $fde-camp to introduce HA7CH FDE Camp and answer my questions about whether my existing AI application experience and delivery challenges fit the Camp, what Codex skills I need, and what I will build.

The Skill is also available through `/fde-camp` in environments that expose installed Skills as slash commands.

## What it covers

- Why HA7CH created FDE Camp
- What HA7CH learned in enterprise fieldwork
- The relationship between FDE, ANC, the trunk, and the leaves
- Who the Camp is for and what participants need
- Two-day, one-night curriculum and field cases
- HA7CH FDE Whiteboard Interview
- HA7CH FDE Certified
- Suitability for builders facing heavy custom delivery
- Day 2: build your own ANC
- One anonymized zero-cohort field case
- Current cohort facts and registration route

Current logistics carry an as-of date in the Skill. Update the Skill to receive the latest published version:

```bash
npx skills update fde-camp
```

Enrollment, payment, outreach, and customer introductions continue through HA7CH's current channels and require the user's explicit action.

## Development

```bash
python3 /path/to/skill-creator/scripts/quick_validate.py .
npx skills add . --list
```

## License

MIT.
