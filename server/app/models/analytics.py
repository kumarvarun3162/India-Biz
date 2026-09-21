"""
Analytics collection schema reference.
One document per listing per day.

{
  _id:              ObjectId,
  listing_id:       ObjectId,       ← ref to listings collection
  date:             "2026-09-21",   ← YYYY-MM-DD string for easy querying
  views:            12,
  whatsapp_clicks:  3,
  phone_clicks:     2,
  created_at:       datetime,
  updated_at:       datetime,
}

Index: (listing_id, date) — unique composite
"""