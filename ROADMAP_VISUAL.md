# GSR Automation Build Roadmap (Visual)

This is the visual version of the order-of-operations from START_HERE.md. GitHub renders Mermaid diagrams automatically. Click any node to follow the path.

---

## The "what to build first" decision tree

```mermaid
flowchart TD
    Start([Where do I start?]) --> Q1{Is the foundation set up?}

    Q1 -->|No| Setup[Stage 0: Account Setup<br/>Supabase + Vercel + GitHub<br/>~2 hours]
    Q1 -->|Yes| Q2{Which first feature?}

    Setup --> Q2

    Q2 -->|Recommended| F1[Lower-Thirds Approval<br/>~3 weeks, low risk]
    Q2 -->|Don't choose this first| F2[YouTube Upload<br/>Too fragile for first build]
    Q2 -->|Don't choose this first| F3[Full Dashboard<br/>Too much shell, no function]

    F1 --> S1[Stage 1: Schema<br/>3 Supabase tables<br/>~3 hours]
    S1 --> S2[Stage 2: Dashboard Shell<br/>Next.js + shadcn/ui<br/>~1 week]
    S2 --> S3[Stage 3: Upload Flow<br/>Jakob uploads PNGs<br/>~3-5 days]
    S3 --> S4[Stage 4: AI Regeneration<br/>Claude API for variations<br/>~3-5 days]
    S4 --> S5[Stage 5: Approval Queue<br/>Approve/reject + queue view<br/>~3 days]
    S5 --> S6[Stage 6: Real Episode Test<br/>Use it for a real shoot<br/>~1 week of real use]
    S6 --> Done1([Feature 1 complete<br/>3 weeks total])

    Done1 --> Next{What next?}

    Next --> N1[ProPresenter Push<br/>Phase 2 of lower-thirds]
    Next --> N2[Episode Metadata<br/>Schema for transcripts/descriptions]
    Next --> N3[YouTube Upload<br/>Once metadata is reliable]
    Next --> N4[Guest Pipeline<br/>Outreach/scheduling]

    style F1 fill:#90EE90
    style F2 fill:#FFB6C1
    style F3 fill:#FFB6C1
    style Done1 fill:#87CEEB
```

---

## The system architecture (after feature 1)

```mermaid
flowchart LR
    Jakob[Jakob's Mac<br/>Photoshop] -->|Uploads PNG| Dashboard

    Daniel[Daniel's browser] -->|Approves/Rejects| Dashboard
    Daniel -->|Hits Regenerate| Dashboard

    Dashboard[Next.js Dashboard<br/>on Vercel] -->|Reads/Writes| Supabase
    Dashboard -->|AI Calls| Claude[Claude API]

    Claude -->|Returns variations| Dashboard
    Dashboard -->|Stores variations| Supabase

    Supabase[(Supabase<br/>Postgres + Storage)] -.->|Hands off approved<br/>graphics list| ProPres[ProPresenter<br/>manual for now]

    style Dashboard fill:#90EE90
    style Supabase fill:#90EE90
    style ProPres fill:#FFE4B5
```

The orange ProPresenter box is the only piece that's still manual after feature 1. Phase 2 of this same feature automates it via the ProPresenter API.

---

## The full system at the end (post-feature-1 view)

This is what the system will look like later. Use it as a north star, not a TODO list.

```mermaid
flowchart TB
    subgraph Inputs[" "]
        direction LR
        Footage[Raw footage<br/>QNAP3 server]
        Articles[News articles<br/>RSS feeds]
        Graphics[Graphics files<br/>Jakob's Mac]
        Voice[Voice DNA samples<br/>Repo]
    end

    subgraph Core[" "]
        direction LR
        Dashboard[Dashboard<br/>Next.js]
        DB[(Supabase<br/>SSOT)]
        Orch[n8n<br/>orchestrator<br/>Mac/Cloud]
        AI[Claude API]
    end

    subgraph Outputs[" "]
        direction LR
        YT[YouTube]
        Drop[Dropbox]
        RLN[RightNow Media]
        Pod[Transistor<br/>podcast]
        Stream[Cloudflare<br/>Stream]
        PP[ProPresenter]
    end

    Footage -.read-only.-> Dashboard
    Articles --> Orch
    Graphics --> Dashboard
    Voice --> AI

    Dashboard <--> DB
    Orch <--> DB
    AI <--> DB

    Dashboard --> YT
    Dashboard --> Drop
    Orch --> RLN
    Orch --> Pod
    Orch --> Stream
    Dashboard --> PP

    style DB fill:#90EE90
    style Dashboard fill:#90EE90
```

The green boxes are where everything connects. The point: every input flows into Supabase, every output flows from it. That's why the database choice mattered.

---

## What's NOT on this diagram (by intent)

- **Notion** — not part of the system anymore. If kept, only as a human-readable doc tool, not connected to any of this.
- **Rundown Creator** — fragile dependency. Replaced or wrapped later, not now.
- **Fireside.fm** — gets swapped for Transistor when podcast distribution is built. For now, manual upload continues.
- **StreamHoster** — gets swapped for Cloudflare Stream when video distribution is built. For now, manual continues.
- **All the audit "swap" recommendations** — wait until the workflows that use them are being built.

Everything not on the diagram is a future decision. Don't decide it now.
