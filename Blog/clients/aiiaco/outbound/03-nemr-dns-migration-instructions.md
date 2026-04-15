Hey Nemr,

Quick update - the SEO improvements from our report are now live on aiiaco.com. The 6 new service pages are deployed (ai-revenue-engine, ai-crm-integration, ai-workflow-automation, ai-for-real-estate, ai-for-vacation-rentals, ai-infrastructure). Schema fixes, image pipeline, Person schema for your founder profile, and the duplicate canonical cleanup are all in production.

One thing we need from you to finish the setup: moving your DNS to Cloudflare. This lets us serve the blog directly from aiiaco.com/blog/ so it shares domain authority with the main site. Everything else stays exactly the same - Manus still hosts the site, Google Workspace still handles email, nothing breaks.

Here is exactly what to do:

Step 1: Log into Cloudflare

Go to https://dash.cloudflare.com and log in.

Step 2: Add aiiaco.com

Click "Add a site" (or "Add domain").
Type: aiiaco.com
Click "Continue".
Cloudflare scans your existing DNS records automatically. Takes about 60 seconds.

Step 3: Review DNS records

Cloudflare shows a list of DNS records it found. Check that these are there:

- A record or CNAME pointing to Manus (this is what serves aiiaco.com)
- MX records for email (go@aiiaco.com, nemr@aiiaco.com, alex@aiiaco.com)
- TXT records for email authentication (SPF, DKIM, DMARC)

Do not delete any records. If anything looks wrong or missing, send us a screenshot before continuing.

Click "Continue".

Step 4: Select plan

Choose the Free plan. Covers everything we need.
Click "Continue".

Step 5: Change nameservers on Namecheap

Cloudflare gives you two nameservers. They look something like:
- ada.ns.cloudflare.com
- ben.ns.cloudflare.com

(Exact names will be different - use whatever Cloudflare shows you.)

Now go to Namecheap:
1. Log into https://www.namecheap.com
2. Domain List
3. Click "Manage" next to aiiaco.com
4. Scroll to "Nameservers"
5. Change from "Namecheap BasicDNS" to "Custom DNS"
6. Enter the two Cloudflare nameservers exactly as shown
7. Save

Step 6: Wait

Propagation takes 30 minutes to 48 hours, usually 2 to 4 hours. Cloudflare emails you when the zone is active. The site keeps working normally during propagation. No downtime.

Step 7: Let us know

Once Cloudflare shows "Active" next to aiiaco.com, send us a message. We handle everything else from there.

One note on Cloudflare access: after you add aiiaco.com and change the nameservers, invite us as a member on your Cloudflare account so we can deploy the blog routing. Go to Manage Account (left sidebar) then Members, then Invite, and add contact@montekristobelgrade.com with Administrator role. Once we have access, we handle the rest.

Thanks
