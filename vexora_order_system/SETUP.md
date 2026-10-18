# VEXORA Order System — Setup

This package adds a real order request form and a login-protected dashboard. Orders are stored in Supabase, not in the visitor's browser.

## 1) Create a Supabase project
1. Go to https://supabase.com/ and create a project.
2. In Project Settings → API (or Connect), copy the Project URL and the **publishable/anon key**.
3. Open `config.js` and replace `YOUR_SUPABASE_PROJECT_URL` and `YOUR_SUPABASE_ANON_KEY`.
   - The browser key is expected to be public. Never put a `service_role` or secret key in any website file.

## 2) Create the orders table
1. In Supabase, open SQL Editor.
2. Paste and run all of `supabase_setup.sql`.
3. Confirm the `orders` table exists and Row Level Security is enabled.

## 3) Secure the dashboard
The SQL policies grant dashboard access to authenticated users, so do NOT allow public account registration.
1. In Supabase → Authentication → Providers / Sign In settings, turn off public sign-ups (wording can vary).
2. In Authentication → Users, create your own admin user with your email and a strong unique password.
3. Do not create accounts for customers. Customers submit orders without logging in.
4. Keep the dashboard URL private as a convenience, but rely on authentication/RLS—not secrecy of the URL—for security.

## 4) Publish on Netlify
1. Upload the whole unzipped `vexora_order_system` folder to Netlify Drop: https://app.netlify.com/drop
2. Ensure `index.html`, `dashboard.html`, `config.js`, `script.js`, `style.css`, and `supabase_setup.sql` are all included.
3. Test a sample order from the public homepage.
4. Open `your-site-url/dashboard.html`, sign in with your admin user, and verify the order appears.

## What works
- Public order form: name, email, optional WhatsApp, service, budget, deadline, project details.
- Orders persist in the Supabase database.
- Private dashboard login; list/search/filter orders; update status; reply by email.
- Customers cannot read orders through the public anonymous role, when the provided RLS policies are installed.

## Important security note
The included simple policies assume only you have authenticated accounts. Disable public sign-ups and do not share your admin login. For a multi-admin business, restrict policies to an explicit admin role or allowlist before adding other users. Add CAPTCHA/rate limiting before advertising the form widely to reduce spam.
