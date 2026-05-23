# YNKLV — Nommo: AI-Native Infrastructure

> *"In Dogon cosmology, Nommo is the generative word — to name a thing is to bring it into being. We give that name to our intelligence layer with deliberate humility: the word serves the people who speak it, and the people decide."*

**Phase 3 · Part 6 — AI-Native Infrastructure.**
This document designs YNKLV as a future AI-native ecosystem, and binds that
ambition to a discipline. Nommo is the intelligence layer of the Mboka. Its
faculties — **Eké** (Writer / text), **Oro** (Visual / image), and **Bassa**
(Audio / sound) — assist creation, governance, and stewardship. The animating
rule of the entire layer, repeated until it is reflexive: **Nommo proposes;
humans decide.**

---

## 1 — The Nommo Philosophy

Nommo is the generative word in service of human creativity and human judgment.
It is not a replacement for either. The name carries the obligation: in the Dogon
tradition, the word brings things into being, and a power that brings things into
being must be wielded with care by those accountable for what it brings.

Three commitments define the philosophy, and they are not aspirational — they are
constraints encoded into how every Nommo system is built:

**Intelligence amplifies, it does not author.** Nommo helps a creator write,
illustrate, and score; it helps the Indaba understand a proposal; it helps a
steward read the treasury. In every case the human remains the author of the work,
the caster of the vote, the maker of the decision. AI assistance is labelled,
optional, and never the default voice of a person's work or the silent hand on a
decision.

**Intelligence advises, it does not execute.** No Nommo system has the authority
to move funds, change the protocol, pass a proposal, or punish a participant.
Nommo reads and recommends. Action belongs to humans and to the governance
processes humans control. This boundary is absolute and is the single most
important design fact in this document.

**Intelligence serves the homeland, including its languages.** Nommo is built for
the African contexts and languages it operates in — French, English, Swahili,
Lingala — not as an afterthought translated from a Western default, but as a
first-class design obligation. An intelligence layer that did not understand the
people it serves would not be Nommo. It would be extraction wearing a new name.

> Reference class: serious AI-governance literature, the institutional sobriety of
> the Ethereum Foundation, and the restraint of products that treat the user as
> intelligent. We borrow the discipline and refuse the hype.

### 1.1 — The Boundary Is Architectural, Not Promised

A guarantee that lives only in a manifesto is not a guarantee. The separation
between what Nommo may advise and what only humans may decide is enforced by how
the systems are wired, not by good intentions.

Concretely: Nommo holds no key to the Baraka, so it cannot move funds even in
error. Nommo holds no vote in the Indaba, so it cannot pass or block a proposal.
Nommo has no write authority over Sankofa standing, so it cannot lower an EPS or
revoke a Pass. Its outputs are inputs to human processes — summaries, flags,
scenarios — and the human processes hold the only authority that touches money,
votes, voice, or standing. The boundary is a property of the architecture, which
means it cannot be quietly relaxed by a future operator without a visible,
governed change. The Indaba would have to decide it, in the open.

This is the difference between an AI layer that is *trusted to behave* and one
that is *unable to overstep*. Nommo is built to be the second.

---

## 2 — AI Governance Assistants

Governance is where AI is most tempting to over-trust and most dangerous to
over-empower. Nommo's role in the Indaba is to make human governance *better
informed*, never to make it *automatic*.

What Nommo does for the Indaba:

- **Proposal summarization.** Long proposals are reduced to faithful, neutral
  summaries — what is asked, what changes, what it costs, who is affected — with
  the full text always one click away and never replaced.
- **Impact analysis.** Nommo models the likely consequences of a proposal on the
  Baraka, on token supply, on affected cities and cohorts — presented as scenarios
  with stated assumptions, not as verdicts.
- **Surfacing precedent.** Drawing on the Zamani Ledger, Nommo finds prior
  proposals, prior votes, and prior outcomes relevant to the matter at hand, so the
  assembly decides with memory rather than amnesia.
- **Plain-language explainers.** Technical proposals are rendered into plain
  language so that standing, not technical literacy, determines who can
  participate meaningfully.
- **Multilingual access.** Every summary, explainer, and analysis is available in
  French, English, Swahili, and Lingala. Access to governance is not gated by
  language.

The hard rule, stated plainly and enforced architecturally:

```
   ┌──────────────────────────────────────────────────────────────┐
   │   NOMMO PROPOSES.            HUMANS VOTE.                     │
   │                                                              │
   │   Nommo may summarize, analyze, surface precedent, and       │
   │   explain — in four languages — so that the Indaba decides   │
   │   well-informed.                                             │
   │                                                              │
   │   Nommo may NOT cast a vote, weight a vote, pass a proposal, │
   │   block a proposal, or execute any outcome. Ever.            │
   └──────────────────────────────────────────────────────────────┘
```

Every Nommo output in the governance context is attributed as such — citizens
always know when they are reading an AI summary versus an authored proposal — and
every analysis discloses its assumptions so the assembly can disagree with the
model, not merely with each other.

---

## 3 — Treasury Intelligence Systems

The Baraka is the commons treasury. Nommo serves as its analyst, and only as its
analyst. The boundary here is identical to governance and equally absolute: Nommo
reads and advises; it never holds a key and never moves a coin.

| Treasury function | What Nommo does | What Nommo cannot do |
| --- | --- | --- |
| **Runway modeling** | Project months of operation under stated scenarios | Spend, allocate, or commit funds |
| **Anomaly detection** | Flag unusual flows for human review | Freeze, reverse, or block any transaction |
| **Diversification scenarios** | Model allocation options with assumptions shown | Execute any reallocation |
| **Public dashboards** | Render Baraka state legibly, updated from chain | Hide, smooth, or editorialize the numbers |

Two guarantees protect the commons:

- **Read and advise only.** Nommo has no execution authority over the Baraka. Funds
  move only through the Indaba's governance and the multisig humans control. An
  analyst that could spend the treasury would be a custodian, and Nommo is never a
  custodian.
- **Honest dashboards.** Treasury intelligence presents capital and facts —
  inflows, outflows, holdings, runway — never projections dressed as promises and
  never a "treasury value at target price." The dashboard earns trust by being
  legible, not impressive.

---

## 4 — Contributor AI Systems

Nommo's faculties assist the people who build the homeland. This is where the
philosophy — amplify, never author — meets the daily work of creators in Soko.

```
              ┌───────────────────────── NOMMO ─────────────────────────┐
              │                                                          │
         ┌────┴────┐            ┌────────────┐            ┌─────────────┐
         │   EKÉ   │            │    ORO     │            │    BASSA    │
         │ Writer  │            │  Visual    │            │   Audio     │
         │  text   │            │  image     │            │   sound     │
         └────┬────┘            └─────┬──────┘            └──────┬──────┘
              │                       │                          │
        drafts, edits,          references, studies,        sketches, stems,
        translates              composition aids            sound design aids
              │                       │                          │
              └───────────────────────┴──────────────────────────┘
                                      │
                          the creator remains the author
                          (assistance labelled, optional)
```

Beyond the creative faculties, contributor systems include:

- **Onboarding guides.** Conversational, multilingual help that walks a newcomer
  through minting the Pass, claiming a `.ynklv` name, and making a first
  contribution — patient, plain, and never condescending.
- **Reputation insights.** Sankofa-aware assistants that explain a citizen's EPS in
  human terms: what they have done, what the next contribution unlocks, how the
  Contribution Lattice reflects their standing. Insight, not gamification.

The constraint holds throughout: a creator's work is the creator's. Eké may help
draft a sentence; the writer wrote the piece. Oro may suggest a composition; the
artist made the image. Bassa may sketch a stem; the musician made the song. AI
contribution is disclosed, never silent, and never the default voice.

---

## 5 — Ecosystem Recommendation Systems

Discovery in Soko — finding work, creators, collaborators, and cities — is where
recommendation systems usually become manipulation engines optimized for
engagement at the cost of the person. Nommo's recommendation systems are designed
against that failure mode from the start.

What Nommo recommends:

- **Discovery in Soko** — surfacing work a person is likely to value, weighted
  toward diversity and quality rather than pure popularity.
- **Matching** — connecting creators with collaborators, builders with cities, and
  contributors with the City Charters where their work fits.

The guarantees that make recommendation trustworthy:

| Guarantee | What it means in practice |
| --- | --- |
| **No engagement maximization** | Nommo does not optimize for time-on-app, addiction, or outrage. It optimizes for genuine value to the person and the commons. |
| **Anti-manipulation** | No dark-pattern nudging, no manufactured urgency, no pay-to-rank that buries earned quality beneath purchased placement. |
| **Transparency** | A person can see *why* something was recommended, in plain language. Recommendations are explainable, not opaque. |
| **Contestability** | A creator can understand and dispute how their work is surfaced. The system is accountable to the people it ranks. |
| **No reputation laundering** | Recommendation draws on real Sankofa standing; it cannot be gamed by Sybil clusters (see §7). |

---

## 6 — Reputation Intelligence (with Sankofa)

Sankofa's reputation layer is graph-based and history-weighted, which makes it
structurally resistant to fraud. Nommo strengthens that resistance with
intelligence — and is bound by the most important rule in the reputation context:
**Nommo never auto-punishes.**

How it works:

```
   Nommo (analysis)              Sankofa / Indaba (human review)
   ─────────────────             ────────────────────────────────
   Detect Sybil-shaped     ──▶   A human reviews the flag
   clusters, anomalous
   Lattice patterns,       ──▶   A human decides: dismiss, investigate,
   fraud signatures              or escalate to the Indaba

   Surface evidence for    ──▶   Standing is adjusted, if at all, only
   a human to weigh              by a human or a governance decision

   FLAG  ─────────────────────▶  HUMANS DECIDE  ─────────────▶  OUTCOME
```

The discipline:

- **AI flags; humans judge.** Nommo can surface a suspicious pattern with its
  evidence. It cannot lower an EPS, revoke a Pass, or strip standing. A flag is an
  input to human review, never an automatic sentence.
- **No automated punishment.** Because standing is biographical and a person's
  citizenship is at stake, the cost of a false positive is real. Nommo's role is to
  help humans see; the consequence is always decided by humans.
- **Detection is itself auditable.** The reasoning behind a flag is recorded and
  reviewable, so that the detector can be corrected — and so that detection cannot
  quietly become a tool of bias.

---

## 7 — Decentralized AI Coordination

Over time, Nommo is intended to become less a single hosted intelligence and more
a coordinated layer — models and compute marshaled across the ecosystem rather
than owned by one party. This is a long-horizon design posture, stated honestly as
a direction rather than a finished system.

The principles that govern that evolution:

- **Attribution and provenance.** Where Nommo's faculties draw on creators' work,
  the provenance is recorded. The Zamani Ledger's logic — permanent, verifiable
  memory — extends to model inputs and outputs so that contribution can be traced.
- **Openness posture.** YNKLV's default leans toward open weights and open
  interfaces, consistent with the conviction that infrastructure a civilization
  depends on should not be a closed box owned by a single party. Where openness is
  constrained — by safety or by partners — the constraint is disclosed, not hidden.
- **Data dignity.** This is the non-negotiable core. Creators consent to and
  benefit from the use of their work in training. Data is not extracted from the
  homeland to enrich an outside party; if a creator's work trains Nommo, the
  creator agreed and the creator shares in the value. Consent is explicit,
  revocable where feasible, and never buried in terms.

Data dignity is the African-origin principle applied to AI: Africa as origin, not
as a dataset to be mined. The same logic that gives creators 90% in Soko gives
them standing and benefit in the intelligence built partly from their work.

The coordination is staged honestly, so that ambition never outruns
accountability:

| Stage | Posture | What stays fixed across all stages |
| --- | --- | --- |
| **Hosted** | Nommo runs as governed, hosted faculties (Eké/Oro/Bassa) | The advise-only boundary; consent and attribution |
| **Federated** | Models and compute coordinated across willing participants | The advise-only boundary; consent and attribution |
| **Open** | Open weights and interfaces where safety and partners allow | The advise-only boundary; consent and attribution |

The right-hand column never moves. Whatever Nommo becomes technically, it remains
an instrument that advises humans, records its provenance, and uses no one's work
without consent and benefit. The architecture evolves; the discipline does not.

---

## 8 — Responsible-AI Guarantees

These are the guarantees that keep Nommo an instrument of the people rather than a
power over them. They are stated as commitments the ecosystem can be held to.

- **Human-in-the-loop, always.** Every consequential output of Nommo passes
  through a human decision. Nommo proposes; humans decide. There is no path by
  which a model decides on the commons' behalf.
- **Transparency.** Nommo's outputs are labelled as AI-generated. Its analyses
  disclose their assumptions. Its recommendations are explainable. A citizen always
  knows when they are reading a machine.
- **Auditability.** The reasoning behind flags, recommendations, and analyses is
  recorded and reviewable. What cannot be audited cannot be trusted with a
  civilization's decisions.
- **Attribution.** AI assistance to creative work is disclosed, never silent. The
  human author is always named as the author.
- **Bias vigilance, especially for African languages and contexts.** Nommo is
  built and continually tested for the languages and realities it serves —
  French, English, Swahili, Lingala, and the cultural contexts beneath them. A
  model that performs well in English and poorly in Lingala is a failed model here,
  not an acceptable one. Bias is treated as a defect, not a footnote.
- **Human governance remains central.** The Indaba governs Nommo, including the
  question of how far Nommo's autonomy may ever extend. The intelligence layer is
  accountable to the citizens, never the reverse.

---

## 9 — Where Nommo Advises, Where Humans Decide, What Nommo May Never Do

This is the document's load-bearing table. If a future system is unsure where a
capability belongs, it belongs in the most restrictive column that fits.

| Domain | Nommo advises | Humans decide | Nommo may NEVER |
| --- | --- | --- | --- |
| **Governance (Indaba)** | Summarize, analyze impact, surface precedent, explain, translate | Propose, debate, vote, pass | Cast/weight a vote; pass or block a proposal; execute an outcome |
| **Treasury (Baraka)** | Model runway, flag anomalies, scenario analysis, dashboards | Allocate, spend, diversify, approve grants | Hold a key; move, freeze, or commit funds |
| **Creation (Soko)** | Draft, illustrate, score via Eké/Oro/Bassa; suggest | Author, publish, release the work | Author silently; publish on a creator's behalf; be the default voice |
| **Discovery (Soko)** | Recommend, match, surface, explain why | Choose what to view, buy, collaborate on | Manipulate, maximize engagement, sell ranking, hide reasons |
| **Reputation (Sankofa)** | Detect Sybil/fraud patterns, surface evidence | Review flags, adjust standing, escalate | Auto-punish; lower EPS; revoke a Pass; strip standing |
| **AI coordination** | Coordinate models/compute, record provenance | Govern openness, consent, and autonomy limits | Use creators' data without consent or benefit; obscure provenance |

The pattern across every row is the same, and it is the whole design: **Nommo
sees and suggests; humans choose and act; and the things that touch a person's
money, vote, voice, or standing are never the machine's to decide.**

---

## 10 — Nommo, Restated

Nommo is the generative word in service of the people who speak it. It makes the
Indaba better informed, the Baraka more legible, the creator more capable, and
discovery more honest — in four languages, with its assumptions shown and its
outputs labelled. It detects fraud without judging it, models the treasury without
touching it, and assists creation without authoring it.

The line that governs all of it does not move: Nommo proposes; humans decide. An
AI-native ecosystem built any other way would not be Nommo. It would be the thing
the homeland was built to escape — value and decision extracted from the people
who produce them. Nommo exists to make sure that does not happen, and to make the
people who build the Mboka more powerful, never less.

---

*Zamani Foundation*
*Cultural Epoch 03 — EXPANSION*

> *"The word brings things into being. The people decide what should be."*
