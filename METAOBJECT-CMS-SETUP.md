# American Tire Stores Promotions/Coupons CMS Setup

Create these Metaobject definitions in Shopify Admin under **Content → Metaobjects**.

## Definition: ATS Promotion

- Name: `ATS Promotion`
- Type: `ats_promotion`
- Storefront access: enabled
- Web pages: enabled, using template `ats_promotion`

When Web pages is enabled, every ATS Promotion entry receives its own Shopify URL. The promotions grid automatically links its card to that URL and renders the `ats_promotion` detail template. This is the editable promotion-details page. Do not fill the optional `link` field unless you intentionally want the card to bypass its own details page. `primary_link` is only the optional button inside the detail page and can be left blank.

Fields:

- `title` — Single line text
- `label` — Single line text
- `description` — Multi-line text
- `image` — File
- `expiry` — Single line text
- `locations` — Single line text
- `code` — Single line text
- `offer_value` — Single line text
- `body` — Rich text
- `terms` — Multi-line text
- `link` — URL
- `cta` — Single line text
- `primary_link` — URL
- `primary_cta` — Single line text

## Definition: ATS Coupon

- Name: `ATS Coupon`
- Type: `ats_coupon`
- Storefront access: enabled
- Web pages: enabled, using template `ats_coupon`

Fields:

- `title` — Single line text
- `label` — Single line text
- `description` — Multi-line text
- `image` — File
- `expiry` — Single line text
- `locations` — Single line text
- `code` — Single line text
- `offer_value` — Single line text
- `body` — Rich text
- `terms` — Multi-line text
- `link` — URL
- `cta` — Single line text
- `primary_link` — URL
- `primary_cta` — Single line text

## Theme Editor

For `/pages/promotions`, saved `ATS Promotion` entries render automatically. If there are no entries yet, the page falls back to Theme Editor blocks.
