import Anthropic from '@anthropic-ai/sdk';
import { Constraints, Place, RecResult, SearchInput } from './types';
import { modeById } from './modes';

const MODEL = 'claude-sonnet-5';
const MAX_CONTINUATIONS = 3;

function buildPrompt(
  library: Place[],
  constraints: Constraints,
  input: SearchInput,
): string {
  const mode = modeById(input.mode);
  const constraintsLine = [
    constraints.dietary.join(', '),
    constraints.exceptions.length ? `exceptions: ${constraints.exceptions.join(', ')}` : '',
    constraints.note,
  ]
    .filter(Boolean)
    .join('; ');

  return `You are the user's personal taste engine. Below is their library of places
they love, each with descriptive ratings and notes. Study the pattern that
connects the ratings and notes to what they enjoy. Do not average the scores;
learn the taste.

LIBRARY:
${JSON.stringify(library, null, 2)}

CONSTRAINTS: ${constraintsLine || 'none'}
MODE TONIGHT: ${mode.name} (${mode.id}) — ${mode.job}. Rank within this mode's logic.
DAYPART: ${input.daypart ?? 'any'}
CITY: ${input.city}
CONTEXT: ${input.occasion ?? 'unspecified'}

Use web search to find real, currently-open, well-reviewed places in ${input.city}
that fit ${input.daypart ?? 'any daypart'} and clear the "nails its specialty" bar. Then rank the top
8 by how well they match THIS user in THIS mode.

Mode logic:
- Peak modes (scene, craft, destination): reward the standout. Constraint-ease
  is a minor factor; a place worth breaking the diet for should still rank high.
- Floor modes (solid & easy, reliable local): reward consistency and low
  variance. Constraint-ease matters more here.

Return ONLY JSON, no preamble, no markdown fences:
{
  "title": "a short, playful, lowercase mood-title for this list, Daylist-style",
  "picks": [
    {
      "name": "...",
      "match": 0-100,
      "why": "one line, specific to THIS user, not generic praise",
      "order": "the one thing to get",
      "dietFlag": "easy | workable | worth-it | hard"
    }
  ]
}`;
}

function parseResult(text: string): RecResult {
  // Strip markdown fences and any preamble/trailing prose around the JSON object.
  const cleaned = text.replace(/```(?:json)?/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('No JSON object found in response');
  }
  const parsed = JSON.parse(cleaned.slice(start, end + 1)) as Partial<RecResult>;
  if (!parsed.title || !Array.isArray(parsed.picks)) {
    throw new Error('Response JSON missing title or picks');
  }
  return {
    title: String(parsed.title),
    picks: parsed.picks
      .filter((p) => p && p.name)
      .map((p) => ({
        name: String(p.name),
        match: Math.max(0, Math.min(100, Number(p.match) || 0)),
        why: String(p.why ?? ''),
        order: String(p.order ?? ''),
        dietFlag: String(p.dietFlag ?? 'workable'),
      })),
  };
}

export async function recommend(
  apiKey: string,
  library: Place[],
  constraints: Constraints,
  input: SearchInput,
): Promise<RecResult> {
  if (!apiKey) {
    throw new Error('Add your Anthropic API key in Settings first.');
  }

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  const prompt = buildPrompt(library, constraints, input);

  let messages: Anthropic.MessageParam[] = [{ role: 'user', content: prompt }];
  let response = await client.messages.create({
    model: MODEL,
    max_tokens: 8192,
    tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 8 }],
    messages,
  });

  // The server-side web_search loop can pause; re-send to let it resume.
  let continuations = 0;
  while (response.stop_reason === 'pause_turn' && continuations < MAX_CONTINUATIONS) {
    messages = [...messages, { role: 'assistant', content: response.content }];
    response = await client.messages.create({
      model: MODEL,
      max_tokens: 8192,
      tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 8 }],
      messages,
    });
    continuations += 1;
  }

  if (response.stop_reason === 'refusal') {
    throw new Error('The engine declined this request. Try a different search.');
  }

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('\n');

  if (!text.trim()) {
    throw new Error('The engine returned no text. Try again.');
  }

  return parseResult(text);
}
