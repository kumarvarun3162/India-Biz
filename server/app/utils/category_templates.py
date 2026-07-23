"""
Pre-filled templates for each business category.
When a user selects a category, the frontend uses these to
auto-populate form fields — saving them time and improving listing quality.
"""

CATEGORIES = [
    {
        "slug":        "restaurant",
        "name":        "Restaurant / Dhaba",
        "icon":        "🍽️",
        "description_template": (
            "Authentic home-style meals served fresh daily. "
            "We specialize in [cuisine type] cuisine with recipes passed down "
            "through generations. Family-friendly atmosphere with both dine-in "
            "and takeaway options available."
        ),
        "suggested_hours": {
            "mon": {"open": "08:00", "close": "22:00", "closed": False},
            "tue": {"open": "08:00", "close": "22:00", "closed": False},
            "wed": {"open": "08:00", "close": "22:00", "closed": False},
            "thu": {"open": "08:00", "close": "22:00", "closed": False},
            "fri": {"open": "08:00", "close": "22:00", "closed": False},
            "sat": {"open": "08:00", "close": "23:00", "closed": False},
            "sun": {"open": "09:00", "close": "22:00", "closed": False},
        },
        "field_hints": {
            "business_name": "e.g. Sharma Dhaba, Punjabi Rasoi",
            "description":   "Describe your specialties and cuisine type",
            "address":       "Shop number, street, landmark",
        },
    },
    {
        "slug":        "grocery",
        "name":        "Grocery / Kirana Store",
        "icon":        "🛒",
        "description_template": (
            "Your one-stop neighbourhood kirana store stocking fresh groceries, "
            "daily essentials, packaged foods, and household items. "
            "Trusted by families in [locality] for over [X] years. "
            "Home delivery available on orders above ₹200."
        ),
        "suggested_hours": {
            "mon": {"open": "07:00", "close": "21:00", "closed": False},
            "tue": {"open": "07:00", "close": "21:00", "closed": False},
            "wed": {"open": "07:00", "close": "21:00", "closed": False},
            "thu": {"open": "07:00", "close": "21:00", "closed": False},
            "fri": {"open": "07:00", "close": "21:00", "closed": False},
            "sat": {"open": "07:00", "close": "21:00", "closed": False},
            "sun": {"open": "08:00", "close": "20:00", "closed": False},
        },
        "field_hints": {
            "business_name": "e.g. Gupta General Store, Laxmi Kirana",
            "description":   "List your key products and delivery options",
        },
    },
    {
        "slug":        "mechanic",
        "name":        "Auto Garage / Mechanic",
        "icon":        "🔧",
        "description_template": (
            "Full-service automobile repair and maintenance workshop. "
            "Specializing in [car/bike/truck] repairs including engine overhaul, "
            "AC service, denting & painting, and routine maintenance. "
            "All makes and models accepted. Experienced mechanics, genuine spare parts."
        ),
        "suggested_hours": {
            "mon": {"open": "09:00", "close": "19:00", "closed": False},
            "tue": {"open": "09:00", "close": "19:00", "closed": False},
            "wed": {"open": "09:00", "close": "19:00", "closed": False},
            "thu": {"open": "09:00", "close": "19:00", "closed": False},
            "fri": {"open": "09:00", "close": "19:00", "closed": False},
            "sat": {"open": "09:00", "close": "19:00", "closed": False},
            "sun": {"open": "10:00", "close": "15:00", "closed": False},
        },
        "field_hints": {
            "business_name": "e.g. Ravi Auto Works, Singh Motors",
            "description":   "List your services and vehicle types you handle",
        },
    },
    {
        "slug":        "salon",
        "name":        "Salon / Beauty Parlour",
        "icon":        "✂️",
        "description_template": (
            "Professional beauty and grooming services for men and women. "
            "Services include haircuts, colouring, facials, threading, waxing, "
            "and bridal makeup. Walk-ins welcome, appointments preferred. "
            "Using premium branded products only."
        ),
        "suggested_hours": {
            "mon": {"open": "10:00", "close": "20:00", "closed": False},
            "tue": {"open": "10:00", "close": "20:00", "closed": False},
            "wed": {"open": "10:00", "close": "20:00", "closed": False},
            "thu": {"open": "10:00", "close": "20:00", "closed": False},
            "fri": {"open": "10:00", "close": "20:00", "closed": False},
            "sat": {"open": "09:00", "close": "21:00", "closed": False},
            "sun": {"open": "10:00", "close": "18:00", "closed": False},
        },
        "field_hints": {
            "business_name": "e.g. Priya Beauty Parlour, Looks Salon",
            "description":   "List your services and specialties",
        },
    },
    {
        "slug":        "medical",
        "name":        "Medical Store / Pharmacy",
        "icon":        "💊",
        "description_template": (
            "Licensed pharmacy stocking prescription medicines, OTC drugs, "
            "surgical supplies, and healthcare products. "
            "Registered pharmacist on duty. "
            "Home delivery available for regular customers."
        ),
        "suggested_hours": {
            "mon": {"open": "08:00", "close": "22:00", "closed": False},
            "tue": {"open": "08:00", "close": "22:00", "closed": False},
            "wed": {"open": "08:00", "close": "22:00", "closed": False},
            "thu": {"open": "08:00", "close": "22:00", "closed": False},
            "fri": {"open": "08:00", "close": "22:00", "closed": False},
            "sat": {"open": "08:00", "close": "22:00", "closed": False},
            "sun": {"open": "09:00", "close": "21:00", "closed": False},
        },
        "field_hints": {
            "business_name": "e.g. Jan Aushadhi Store, Life Care Pharmacy",
        },
    },
    {
        "slug":        "tailor",
        "name":        "Tailor / Boutique",
        "icon":        "🧵",
        "description_template": (
            "Expert tailoring and stitching services for all occasions. "
            "Specializing in [men's suits / ladies suits / wedding outfits / uniforms]. "
            "Custom measurements taken, quick delivery. "
            "Alterations and repairs also accepted."
        ),
        "suggested_hours": {
            "mon": {"open": "09:30", "close": "20:00", "closed": False},
            "tue": {"open": "09:30", "close": "20:00", "closed": False},
            "wed": {"open": "09:30", "close": "20:00", "closed": False},
            "thu": {"open": "09:30", "close": "20:00", "closed": False},
            "fri": {"open": "09:30", "close": "20:00", "closed": False},
            "sat": {"open": "09:30", "close": "21:00", "closed": False},
            "sun": {"open": "10:00", "close": "17:00", "closed": False},
        },
        "field_hints": {
            "business_name": "e.g. Fashion Stitch, Royal Boutique",
            "description":   "List your specialties and typical delivery time",
        },
    },
    {
        "slug":        "electronics",
        "name":        "Electronics / Mobile Repair",
        "icon":        "📱",
        "description_template": (
            "Authorised repair centre for smartphones, laptops, and electronics. "
            "Services include screen replacement, battery replacement, "
            "water damage repair, and data recovery. "
            "All brands accepted. Genuine spare parts. 30-day repair warranty."
        ),
        "suggested_hours": {
            "mon": {"open": "10:00", "close": "20:00", "closed": False},
            "tue": {"open": "10:00", "close": "20:00", "closed": False},
            "wed": {"open": "10:00", "close": "20:00", "closed": False},
            "thu": {"open": "10:00", "close": "20:00", "closed": False},
            "fri": {"open": "10:00", "close": "20:00", "closed": False},
            "sat": {"open": "10:00", "close": "20:00", "closed": False},
            "sun": {"open": "11:00", "close": "18:00", "closed": False},
        },
        "field_hints": {
            "business_name": "e.g. TechFix Hub, Mobile Care Centre",
        },
    },
    {
        "slug":        "tutor",
        "name":        "Tutor / Coaching Centre",
        "icon":        "📚",
        "description_template": (
            "Professional coaching for [subjects / board exams / competitive exams]. "
            "Small batch sizes for personalised attention. "
            "Experienced faculty with proven results. "
            "Demo class available free of charge."
        ),
        "suggested_hours": {
            "mon": {"open": "06:00", "close": "20:00", "closed": False},
            "tue": {"open": "06:00", "close": "20:00", "closed": False},
            "wed": {"open": "06:00", "close": "20:00", "closed": False},
            "thu": {"open": "06:00", "close": "20:00", "closed": False},
            "fri": {"open": "06:00", "close": "20:00", "closed": False},
            "sat": {"open": "07:00", "close": "18:00", "closed": False},
            "sun": {"open": "08:00", "close": "14:00", "closed": False},
        },
        "field_hints": {
            "business_name": "e.g. Bright Future Academy, Excel Coaching",
            "description":   "List subjects, classes, and exam types you cover",
        },
    },
    {
        "slug":        "hardware",
        "name":        "Hardware / Building Materials",
        "icon":        "🏗️",
        "description_template": (
            "Complete hardware and building materials store. "
            "Stock includes paints, pipes, fittings, electrical items, "
            "power tools, cement, tiles, and sanitary ware. "
            "Bulk orders welcome. Delivery available for large orders."
        ),
        "suggested_hours": {
            "mon": {"open": "08:00", "close": "20:00", "closed": False},
            "tue": {"open": "08:00", "close": "20:00", "closed": False},
            "wed": {"open": "08:00", "close": "20:00", "closed": False},
            "thu": {"open": "08:00", "close": "20:00", "closed": False},
            "fri": {"open": "08:00", "close": "20:00", "closed": False},
            "sat": {"open": "08:00", "close": "20:00", "closed": False},
            "sun": {"open": "09:00", "close": "14:00", "closed": False},
        },
        "field_hints": {
            "business_name": "e.g. Ambala Hardware, Shree Buildmart",
        },
    },
    {
        "slug":        "other",
        "name":        "Other Business",
        "icon":        "🏪",
        "description_template": (
            "Tell customers what your business does, what makes you unique, "
            "and why they should choose you. "
            "Include your key products or services and any special offers."
        ),
        "suggested_hours": {
            "mon": {"open": "09:00", "close": "18:00", "closed": False},
            "tue": {"open": "09:00", "close": "18:00", "closed": False},
            "wed": {"open": "09:00", "close": "18:00", "closed": False},
            "thu": {"open": "09:00", "close": "18:00", "closed": False},
            "fri": {"open": "09:00", "close": "18:00", "closed": False},
            "sat": {"open": "09:00", "close": "18:00", "closed": False},
            "sun": {"open": "10:00", "close": "15:00", "closed": True},
        },
        "field_hints": {
            "description": "Describe your business and key services",
        },
    },
]

# Fast lookup by slug  →  used in the router
CATEGORY_MAP = {c["slug"]: c for c in CATEGORIES}