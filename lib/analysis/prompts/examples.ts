export const ANALYSIS_FEW_SHOT_EXAMPLES = `
<examples>
<example>
<input>
<title>AI meeting notes for remote teams</title>
<description>A SaaS tool that joins video calls, transcribes discussions, and auto-generates action items synced to Linear and Notion.</description>
<industry>B2B SaaS</industry>
<target_audience>Engineering managers, product teams at 50–500 person companies</target_audience>
<primary_target_market>United States</primary_target_market>
</input>
<output>
{"validationScore":72,"problemStatement":"Remote teams lose decisions and action items across meetings.","marketPotential":"Large and growing; crowded but differentiated by deep Linear/Notion sync.","risks":[{"title":"Incumbent competition","severity":"high","description":"Otter, Fireflies, and Notion AI cover overlapping use cases."}],"opportunities":[{"title":"Workflow-native integrations","description":"Deep two-way sync with PM tools is underserved."}],"competitors":[{"name":"Otter.ai","strengths":"Strong transcription brand","weaknesses":"Limited PM tool sync","differentiator":"Native Linear/Notion action-item workflow"}],"mvpFeatures":[{"feature":"Calendar-connected bot for Zoom/Meet","priority":"must_have","rationale":"Core capture loop."}]}
</output>
</example>

<example>
<input>
<title>Generic food delivery app</title>
<description>An app to order food from restaurants with delivery tracking and ratings, like Uber Eats but cheaper.</description>
<industry>Consumer</industry>
<target_audience>Everyone who orders food</target_audience>
<primary_target_market>Global</primary_target_market>
</input>
<output>
{"validationScore":28,"problemStatement":"Food delivery convenience is real but already well served.","marketPotential":"Massive TAM but winner-take-most dynamics favor incumbents with logistics scale.","risks":[{"title":"Capital intensity","severity":"high","description":"Competing on price requires subsidized delivery economics."},{"title":"No wedge","severity":"high","description":"Broad positioning without a niche or geography focus."}],"opportunities":[{"title":"Hyper-local niche","description":"Focus on one cuisine or city with unique supply partnerships."}],"competitors":[{"name":"DoorDash","strengths":"Scale and restaurant network","weaknesses":"High fees for restaurants","differentiator":"None stated in current idea"}],"mvpFeatures":[{"feature":"Single-city pilot with 10 partner restaurants","priority":"must_have","rationale":"Validate unit economics before scaling."}]}
</output>
</example>

<example>
<input>
<title>Compliance checklist for indie game studios</title>
<description>A lightweight tool that walks solo and small game devs through platform store compliance (Apple, Steam, consoles) with templates and deadline reminders.</description>
<industry>Gaming / Developer Tools</industry>
<target_audience>Indie game developers, 1–10 person studios</target_audience>
<primary_target_market>Worldwide</primary_target_market>
</input>
<output>
{"validationScore":65,"problemStatement":"Small studios waste weeks on store compliance and resubmissions.","marketPotential":"Niche but underserved; willingness to pay for time savings is high.","risks":[{"title":"Platform policy changes","severity":"medium","description":"Checklists must be kept current as store rules evolve."}],"opportunities":[{"title":"Community templates","description":"Crowdsourced checklists per platform build trust and SEO."}],"competitors":[{"name":"Manual spreadsheets","strengths":"Free and familiar","weaknesses":"Error-prone and not kept up to date","differentiator":"Guided workflows with platform-specific updates"}],"mvpFeatures":[{"feature":"Apple App Store checklist wizard","priority":"must_have","rationale":"Highest pain point for mobile indies."},{"feature":"Email deadline reminders","priority":"nice_to_have","rationale":"Retention hook after first submission."}]}
</output>
</example>
</examples>
`.trim();
