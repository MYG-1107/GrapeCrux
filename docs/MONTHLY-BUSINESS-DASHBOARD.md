# GrapeCrux — Monthly Website and Business Dashboard Specification

This is a reporting specification, not a claim that analytics, Search Console or a CRM account has already been connected.

## Executive summary

Report the period, previous-period comparison and data freshness:

- Organic users and sessions.
- Google impressions, clicks, click-through rate and average position.
- Enquiries received in the authorised business inbox.
- Applications received in the recruitment inbox.
- Qualified enquiries, proposals, projects won and projects lost when recorded in an approved CRM or sales tracker.
- Visitor-to-enquiry rate only when the enquiry count and visitor denominator use clearly defined, comparable periods.
- Current Core Web Vitals and website availability status.

## Dashboard sections

### 1. Search visibility

Data source: Google Search Console.

- Impressions and clicks over time.
- Click-through rate and average position.
- Queries with commercial intent.
- Pages with impressions but weak click-through rate.
- Countries and devices.
- Page indexing status and reasons.
- Sitemap discovered URLs versus indexed URLs.

### 2. Website behaviour

Data source: GA4.

- Users, sessions and traffic sources.
- Landing pages and entry paths.
- Most viewed services.
- Blog article views and assisted service visits.
- Device category and country.
- CTA clicks, email clicks, phone clicks and project-assessment completions.
- Form starts and client-side form submission attempts.

A browser form_submit event is not proof that an email was delivered. Do not label it a confirmed lead or send personal form data to GA4.

### 3. Enquiries and applications

Data source: the restricted service and recruitment email inboxes, or an approved CRM populated from those inboxes.

- Enquiries received by service@grapecrux.com.
- Applications received by yaswanth@grapecrux.com.
- Enquiries by service, country and project type when categorised by the team.
- Source and campaign information contained in the received email where available.
- Time to first response, qualification, proposal and outcome where those stages are recorded in the CRM or approved sales tracker.
- Applications reviewed and recruitment stages where those stages are recorded in the approved recruitment process.

The static website does not store submissions in a private database or provide a lead dashboard. Email inboxes and the organisation's approved business records are the source of truth.

### 4. Sales outcomes

Data source: an approved CRM or business tracker.

- Qualified enquiries.
- Proposals sent and accepted.
- Projects won and lost.
- Reasons for lost opportunities.
- Average time between receipt, first review and proposal.
- Actual revenue only when accounting or CRM records provide verified figures.

### 5. Technical health

Data source: GitHub Actions, PageSpeed Insights, Search Console, the hosting provider and periodic form-delivery tests.

- Live SEO audit status and broken links.
- Homepage, robots.txt and sitemap availability.
- TLS certificate expiry.
- Mobile and desktop LCP, INP and CLS.
- Contact and Careers form submission tests.
- Confirmation that each recipient inbox remains activated and receives test messages.
- Security and dependency updates.

## Metric definitions

Enquiry response rate:

Enquiries with a recorded first response ÷ enquiries received during the same period × 100.

Proposal conversion:

Projects won ÷ proposals sent × 100.

Do not use contact-page views, CTA clicks, form starts or client-side form_submit events as confirmed leads.

## Implementation plan

1. Confirm the GA4 property and Search Console domain property.
2. Build a Looker Studio report with GA4 and Search Console connectors.
3. Agree a secure process for adding email enquiries and outcomes to an approved CRM or sales tracker.
4. Use aggregate or anonymised CRM measures in management reports.
5. Have a designated owner review the dashboard and prepare the monthly management report.

## Data protection

Do not export names, email addresses, phone numbers, CV contents or free-text project descriptions into GA4 or an unrestricted dashboard. Restrict mailbox and CRM access to authorised personnel. Apply the organisation-approved retention policy to email messages and applicant documents.
