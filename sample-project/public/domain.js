// Original synthetic service domain shared by the workflow and MCP examples.
export const CATALOG = Object.freeze({ exterior: { label: 'Exterior windows', rate: 8, minimum: 120 }, interior: { label: 'Interior windows', rate: 6, minimum: 100 }, both: { label: 'Inside + outside', rate: 13, minimum: 180 } });
export function quoteService({ service = 'exterior', units, stories = 1 }) {
  if (!CATALOG[service] || !Number.isInteger(units) || units < 1 || units > 200 || !Number.isInteger(stories) || stories < 1 || stories > 3) throw new Error('Choose a service, 1–200 windows, and 1–3 stories.');
  const item = CATALOG[service];
  const base = Math.max(item.minimum, units * item.rate);
  const premium = stories === 1 ? 0 : stories === 2 ? 35 : 75;
  return { service, label: item.label, units, stories, currency: 'USD', amount: base + premium, steps: [`${units} windows × $${item.rate} = $${units * item.rate}`, `Minimum charge: $${item.minimum}`, `Height premium: $${premium}`], sourceId: 'fictional-catalog-v1', disclaimer: 'Synthetic demonstration prices; not a Blue Ocean or irha offer.' };
}
export function parseRequest(text) {
  if (typeof text !== 'string' || !text.trim() || text.length > 4000) throw new Error('Enter a request of 1–4000 characters.');
  const number = text.match(/\b(\d{1,3})\s*(?:(?:exterior|interior|inside|outside)\s+)?(?:windows?|panes?)\b/i);
  const story = text.match(/\b([123])\s*[- ]?(?:stor(?:y|ies)|floors?)\b/i);
  return { service: /both|inside and out|inside.*outside/i.test(text) ? 'both' : /inside|interior/i.test(text) ? 'interior' : 'exterior', units: number ? Number(number[1]) : null, stories: story ? Number(story[1]) : /two[- ]stor/i.test(text) ? 2 : /three[- ]stor/i.test(text) ? 3 : 1, needsHuman: /person|human|manager|complaint|refund|emergency/i.test(text) };
}
export function draftQuote(quote) { return `Draft for review: ${quote.label} for ${quote.units} windows in a ${quote.stories}-story property is $${quote.amount} in this fictional catalog. Scheduling and final scope need confirmation.`; }
export const JOBS = Object.freeze([{ id: 'DEMO-101', status: 'awaiting_review', service: 'exterior', nextAction: 'Confirm scope with the customer' }, { id: 'DEMO-102', status: 'scheduled', service: 'both', nextAction: 'Review the fictional appointment record' }]);
