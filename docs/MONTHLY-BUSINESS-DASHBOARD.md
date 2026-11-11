# GrapeCrux — Monthly Website and Business Dashboard Specification

This is the recommended management reporting structure from the business visibility report. It is a dashboard specification, not a claim that GA4/Search Console/CRM accounts have already been connected.

## Executive summary

Report the period, previous-period comparison and data freshness:
- Organic users and sessions.
- Google impressions, clicks, CTR and average position.
- Confirmed enquiries in the backend.
- Qualified enquiries.
- Proposals sent, projects won and lost.
- Visitor-to-confirmed-enquiry conversion rate.
- Qualified lead rate.
- Current Core Web Vitals and availability status.

## Dashboard sections

### 1. Search visibility
Data source: Google Search Console.
- Impressions and clicks over time.
- CTR and average position.
- Queries with commercial intent.
- Pages with impressions but weak CTR.
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
- CTA clicks, email clicks, phone clicks and assessment completions.
- Form starts and form-submit attempts.

### 3. Confirmed business enquiries
Data source: the private GrapeCrux backend database.
- Total enquiries received.
- Enquiries by service, country and project type.
- Enquiry source, campaign and landing page.
- Notification/acknowledgement email delivery statuses.
- Enquiry statuses: New, Under Review, Qualified, Proposal Sent, Discussion, Won, Lost and Spam.
- Assigned owner and follow-up due date.

### 4. Sales outcomes
Data source: the lead-management dashboard or approved CRM.
- Qualified enquiries.
- Proposals sent.
- Proposals accepted.
- Projects won and lost.
- Reasons for lost opportunities.
- Average time between receipt, first review and proposal.
- Actual revenue only when the accounting/CRM system provides verified figures.

### 5. Technical health
Data source: GitHub Actions, PageSpeed Insights, Search Console and hosting provider.
- Live SEO audit status and broken links.
- Homepage, robots and sitemap uptime checks.
- TLS certificate expiry.
- Mobile and desktop LCP, INP and CLS.
- Form/API availability and email delivery failures.
- Security/dependency updates and backup verification.

## Metric definitions

Lead conversion rate:
Successful enquiries stored by the backend ÷ unique website visitors × 100.

Qualified lead rate:
Qualified enquiries ÷ total legitimate enquiries × 100.

Proposal conversion:
Projects won ÷ proposals sent × 100.

Do not use contact-page views, CTA clicks, email-draft opens or form starts as successful leads. The backend record is the source of truth for enquiry totals; GA4 is for traffic and interaction analysis.

## Implementation plan

1. Confirm the GA4 property and Search Console domain property.
2. Mark generate_lead as a GA4 Key event after a real API receipt has been observed.
3. Build a Looker Studio report with GA4 and Search Console connectors.
4. Export backend aggregate counts only (not names, emails, phone numbers or free-text descriptions) to a restricted management report.
5. Reconcile backend enquiry counts with GA4 confirmed-lead events monthly.
6. Have a designated owner review the dashboard and prepare the monthly management report.

## Data protection

Never export personal enquiry data into GA4 or an unrestricted dashboard. Limit detailed lead records to authorised personnel in the protected lead-management interface. Apply the organisation-approved retention policy to source records and backups.
