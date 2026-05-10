# Metrics

## North Star Metric
Audits completed per week.

Not DAU — people use this tool once every few months when they're thinking about costs. Not revenue — that's a lagging indicator. Not signups — you can sign up and never finish an audit.

An audit completed means someone put in their real data and saw a result. That's the moment of value. Everything downstream — email captures, consultation bookings, credit purchases — flows from this single event. If audits completed is growing, everything else will follow.

Target: 500/week by end of month 1. 2,000/week by end of month 3.

## Three Input Metrics

**Landing → audit start rate.**
If someone lands on the homepage and doesn't click through to the form, the headline isn't working or the value prop isn't clear. Target above 40%. Below 25% means rewrite the hero.

**Audit start → completion rate.**
People who open the form but don't submit. This tells me if the form is too complicated. Target above 65%. If it drops, I look at which tool section has the most drop-off and simplify that section first.

**Shared URL click rate.**
What percentage of completed audits generate a shared link that gets at least one click. This is the viral coefficient. If it's above 15%, the product grows on its own. If it's below 5%, the shareable URL isn't compelling enough — probably because the savings number is too small or the page looks bad on link preview.

## What to Instrument First

First thing: fire an event when /api/analyze returns 200. That's the audit completed event. Store it in Supabase with timestamp and total savings amount — no PII needed.

Second: fire an event when the Copy Link button is clicked. Third: fire when the Credex CTA is clicked. That's the conversion event that ties to revenue.

Everything else — page views, time on page, bounce rate — comes from Vercel Analytics which is already running.

## When to Pivot

After 500 audits: if email capture rate is below 8%, the value shown on the results page isn't compelling enough to make people want to save it. Redesign the savings hero section before anything else.

After 1,000 audits: if zero consultation bookings, the Credex CTA isn't working. Either the savings numbers are too small, the CTA copy is wrong, or the threshold for showing it is too high. Drop the threshold from $500 to $200 and see what happens.

After 2,000 audits: if the shared URL click rate is below 5%, the viral loop is broken. The product won't grow organically. At that point I either invest in paid distribution or accept that this is a direct sales tool, not a product-led growth tool.