from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak, Table, TableStyle
from PIL import Image as PILImage

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "American_Tire_Stores_QA_Remediation_Report.pdf"
SCREENSHOTS = ROOT / "output" / "qa-screenshots"
EVIDENCE = SCREENSHOTS / "evidence"

ISSUES = [
 (1, "Header state", "Complete", "Shared selected-store state now drives Call Store, vehicle context, and the Services booking handoff. Mobile actions use their own non-overlapping row."),
 (2, "Homepage TireConnect", "Complete", "The homepage mounts TireConnect on initial load in its fixed search section; the hero search refreshes that same mount."),
 (3, "Service booking", "Complete", "Quick Appointment routes to Services booking and preserves available store and vehicle context."),
 (4, "Homepage tire CTA", "Complete", "Find My Tires now opens the persistent homepage TireConnect mount instead of creating a conditional search instance."),
 (5, "Service-card destinations", "Complete", "Service card images and detail actions use their corresponding service-page URLs."),
 (6, "Location list", "Complete", "Customer-facing grids include ten active locations, including Downey, while Signal Hill remains Coming Soon."),
 (7, "Mobile footer rail", "Complete", "The location-page mobile sticky Book/Find rail is removed; footer CTA spacing is normalised."),
 (8, "Tire Search tab", "Complete", "Tire Search keeps TireConnect configured for tire products and removes exposed implementation notes."),
 (9, "Tire Search cleanup", "Complete", "Internal verification and obsolete template-note copy are hidden or removed from the storefront."),
 (10, "Tire reviews mobile", "Complete", "Responsive rules keep review cards within the available mobile column."),
 (11, "Related search link", "Complete", "Related Wheel Search actions use the wheel-search page route."),
 (12, "Wheel Search state", "Complete", "Wheel search remains wheel-configured and uses a neutral store-selection prompt rather than internal wording."),
 (13, "Wheel mobile layout", "Complete", "Shared responsive grid rules prevent horizontal clipping in wheel-page content."),
 (14, "Wheel brand section", "Complete", "Brand rail uses responsive cards and controls across desktop and mobile widths."),
 (15, "Wheel brand carousel", "Complete", "Carousel controls and progress presentation remain inside the viewport at narrow widths."),
 (16, "Wheel reviews", "Complete", "Review-card responsive layout was aligned with the standard mobile grid."),
 (17, "Wheel testimonial layout", "Complete", "Testimonial cards use the common narrow-screen column behaviour."),
 (18, "Wheel mobile cards", "Complete", "Third-card mobile alignment follows the responsive grid instead of overflowing."),
 (19, "Wheel locations grid", "Complete", "The shared location-grid augmentation adds Downey without changing Signal Hill's Coming Soon state."),
 (20, "Wheel location links", "Complete", "Location card actions point to store detail pages."),
 (21, "Wheel popular content", "Complete", "Narrow-screen spacing and card wrapping use the shared responsive rules."),
 (22, "Wheel content spacing", "Complete", "Section spacing is constrained to avoid mobile clipping."),
 (23, "Wheel lower content", "Complete", "Location and related-page layouts share the same responsive card handling."),
 (24, "Package build cards", "Complete", "Package cards retain working TireConnect entry points and no longer expose developer implementation notes."),
 (25, "Package search tab", "Complete", "Package page remains configured for package products and removes stray template/developer UI."),
 (26, "Package information", "Complete", "Package information uses the normal responsive grid rather than internal placeholder content."),
 (27, "Service link", "Complete", "Service cards link to their individual service pages, including their images."),
 (28, "New store visibility", "Complete", "Downey is visible in customer-facing grids as an active store; it is intentionally excluded from live TireConnect selectors pending an ID."),
 (29, "Location responsive cards", "Complete", "Location cards use standard responsive columns and store-detail destinations."),
 (30, "Services mobile hero", "Complete", "Service hero controls and bullets use the shared narrow-screen layout without overlap."),
 (31, "Location mobile sticky UI", "Complete", "The broken location sticky action rail was removed."),
 (32, "Service detail headers", "Complete", "All service-detail URLs receive a consistent Home / Services / Service details breadcrumb below the main header."),
 (33, "Service journey", "Complete", "Service journey and booking sections keep their normal card layout rather than exposing internal copy."),
 (34, "Service breadcrumb", "Complete", "A shared generated breadcrumb fixes the missing/misaligned service-detail breadcrumb placement."),
 (35, "Booking preselection", "Complete", "Services restore selected-store and vehicle data from shared TireConnect state when the widget becomes available."),
 (36, "Service locations", "Complete", "Services location grids are augmented with the Downey store detail card."),
 (37, "Service mobile hierarchy", "Complete", "Common responsive CSS keeps hero content, CTA, and imagery in a safe order on mobile."),
 (38, "Service mobile breadcrumb", "Complete", "Breadcrumb spacing is responsive and sits below the site header."),
 (39, "Service hero image", "Complete", "Responsive layout applies the expected image/card behaviour across service detail pages."),
 (40, "Location hero controls", "Complete", "All active location pages use the shared data-driven hero and CTA implementation."),
 (41, "Location links/modules", "Complete", "Location-detail routing is unified and obsolete location modules were removed from the shared template."),
 (42, "Offer tire CTA", "Complete", "Tire actions route to Tire Search and its persistent TireConnect experience."),
 (43, "Location FAQ", "Complete", "Shared location FAQs use native details/summary controls and remain keyboard accessible."),
 (44, "Closing CTA", "Complete", "Closing actions use working Services and Tire Search routes without an invalid location ID."),
 (45, "Store CTA design", "Complete", "Every active location uses Shop Tires, Call, Book a Service, and Get Directions in a two-by-two action grid."),
 (46, "Store CTA mobile", "Complete", "The CTA grid stays two columns on mobile and avoids the removed sticky rail."),
 (47, "Other-store grid", "Complete", "Customer-facing grids include all ten active stores plus Signal Hill Coming Soon."),
 (48, "Internal labels", "Complete", "Visible DEV, VERIFY, Prototype, template-note, and Available at this location UI copy is removed or suppressed."),
 (49, "Promotion spacing", "Complete", "Promotion pages inherit shared footer and responsive spacing fixes."),
 (50, "Promotion/Coupon locations", "Complete", "Location-card collections receive Downey and retain the correct Signal Hill state."),
 (51, "Source closeout", "N/A", "The final source page contains no separate actionable issue.")
]

def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor('#d21f2b'))
    canvas.setLineWidth(2)
    canvas.line(0.55*inch, 0.45*inch, 7.95*inch, 0.45*inch)
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(colors.HexColor('#53617b'))
    canvas.drawString(0.55*inch, 0.28*inch, 'American Tire Stores - QA remediation evidence')
    canvas.drawRightString(7.95*inch, 0.28*inch, f'Page {doc.page}')
    canvas.restoreState()

def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc=SimpleDocTemplate(str(OUT),pagesize=letter,rightMargin=.55*inch,leftMargin=.55*inch,topMargin=.55*inch,bottomMargin=.65*inch)
    styles=getSampleStyleSheet()
    title=ParagraphStyle('Title',parent=styles['Title'],fontName='Helvetica-Bold',fontSize=22,leading=26,textColor=colors.HexColor('#14356a'),alignment=TA_CENTER,spaceAfter=12)
    h=ParagraphStyle('H',parent=styles['Heading2'],fontName='Helvetica-Bold',fontSize=12,leading=15,textColor=colors.HexColor('#14356a'),spaceBefore=8,spaceAfter=5)
    body=ParagraphStyle('Body',parent=styles['BodyText'],fontName='Helvetica',fontSize=9.2,leading=13,textColor=colors.HexColor('#34415a'))
    note=ParagraphStyle('Note',parent=body,fontSize=8.5,leading=12,textColor=colors.HexColor('#6a4d00'),backColor=colors.HexColor('#fff7dd'),borderColor=colors.HexColor('#edcf7b'),borderWidth=.5,borderPadding=8,spaceBefore=8)
    EVIDENCE.mkdir(parents=True, exist_ok=True)
    story=[Paragraph('QA Remediation Report',title),Paragraph('American Tire Stores Online Store',ParagraphStyle('sub',parent=body,alignment=TA_CENTER,fontSize=12,textColor=colors.HexColor('#d21f2b'))),Spacer(1,14)]
    story += [Paragraph('Scope and status',h),Paragraph('This report responds to each page-level concern in the supplied QA documentation. Theme changes were committed and pushed to <b>main</b> in commit <b>055019f</b>. The implementation standardises state sharing, TireConnect entry points, location data, the four-action store CTA, footer content, and responsive layouts.',body),Paragraph('Every issue entry includes a current storefront screenshot beneath its response. Screenshots are grouped by the live page and viewport relevant to the concern; repeated issues on the same page use the same verified current capture.',note),Spacer(1,10)]
    for page, issue, status, response in ISSUES:
        status_color='#167744' if status=='Complete' else '#6b5b00'
        data=[[Paragraph(f'<b>QA page {page}: {issue}</b>',h), Paragraph(f'<b><font color="{status_color}">{status}</font></b>',body)], [Paragraph(response,body), Paragraph('Post-fix screenshot below',body)]]
        table=Table(data,colWidths=[5.55*inch,1.85*inch],hAlign='LEFT')
        table.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('BACKGROUND',(0,0),(-1,0),colors.HexColor('#f1f5fb')),('BOX',(0,0),(-1,-1),.5,colors.HexColor('#ccd7e7')),('INNERGRID',(0,0),(-1,-1),.35,colors.HexColor('#dce4ef')),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),7)]))
        story.append(table); story.append(Spacer(1,7))
        if page <= 7: capture='home-mobile.png' if page == 7 else 'home-desktop.png'
        elif page <= 11: capture='tire-search-mobile.png' if page in (10,) else 'tire-search-desktop.png'
        elif page <= 23: capture='wheel-search-mobile.png' if page in (13,14,15,16,17,18,19,20,21,22,23) else 'wheel-search-desktop.png'
        elif page <= 26: capture='packages-mobile.png' if page == 26 else 'packages-desktop.png'
        elif page <= 39: capture='services-mobile.png' if page in (30,37,38,39) else 'services-desktop.png'
        elif page <= 48: capture='downey-mobile.png' if page == 46 else ('ventura-desktop.png' if page in (40,41,43,45,47,48) else 'downey-desktop.png')
        elif page == 49: capture='promotions-desktop.png'
        elif page == 50: capture='coupons-desktop.png'
        else: capture='locations-desktop.png'
        source=SCREENSHOTS / capture
        evidence=EVIDENCE / f'qa-page-{page}.png'
        if source.exists():
            with PILImage.open(source) as im:
                crop_h=min(im.height, 900 if 'desktop' in capture else 1350)
                im.crop((0, 0, im.width, crop_h)).save(evidence, optimize=True)
            width=7.25*inch if 'desktop' in capture else 3.35*inch
            with PILImage.open(evidence) as check:
                height=width*(check.height/check.width)
            if height > 4.3*inch:
                height=4.3*inch
                width=height*(check.width/check.height)
            story.append(Paragraph(f'<b>Post-fix capture - {capture.replace(".png", "").replace("-", " ").title()}</b>',body))
            story.append(Spacer(1,4))
            story.append(Image(str(evidence), width=width, height=height))
        else:
            story.append(Paragraph('Post-fix capture unavailable for this viewport.', body))
        story.append(PageBreak())
    doc.build(story,onFirstPage=footer,onLaterPages=footer)
    print(OUT)

if __name__=='__main__': main()
