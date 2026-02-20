ALLOWED_KEYWORDS = [
    "خودت",
    "سن",
    "سال",
    "کی",
    "شما",
    "سکونت",
    "محل",
    "کجا",
    "رزومه",
    "تجربه",
    "سابقه",
    "مهارت",
    "پروژه",
    "تحصیلات",
    "آرش",
    "resume",
    "experience",
    "skills",
    "projects",
    "education"
]

def is_in_domain(query: str) -> bool:
    q = query.lower()
    return any(keyword in q for keyword in ALLOWED_KEYWORDS)
