def get_recommendations(preference):
    # A simple static dataset of items with associated tags/genres
    items = [
        {"title": "Inception", "category": "movie", "genres": ["sci-fi", "action", "thriller", "dream"]},
        {"title": "The Matrix", "category": "movie", "genres": ["sci-fi", "action", "cyberpunk"]},
        {"title": "Interstellar", "category": "movie", "genres": ["sci-fi", "adventure", "space", "drama"]},
        {"title": "Pulp Fiction", "category": "movie", "genres": ["crime", "drama", "cult"]},
        {"title": "Dune", "category": "book", "genres": ["sci-fi", "epic", "fantasy", "desert"]},
        {"title": "1984", "category": "book", "genres": ["dystopian", "classic", "political", "novel"]},
        {"title": "The Lord of the Rings", "category": "book", "genres": ["fantasy", "adventure", "epic"]},
        {"title": "Pride and Prejudice", "category": "book", "genres": ["romance", "classic", "drama"]},
        {"title": "Classical Music Collection", "category": "music", "genres": ["classical", "orchestral", "instrumental"]},
        {"title": "Jazz Standards", "category": "music", "genres": ["jazz", "blues", "vocal"]},
        {"title": "Rock Anthems", "category": "music", "genres": ["rock", "classic rock", "guitar"]},
        {"title": "Electronic Dance Hits", "category": "music", "genres": ["electronic", "dance", "edm"]},
        {"title": "Learn Python Programming", "category": "skill", "genres": ["programming", "coding", "data science"]},
        {"title": "Mastering Digital Photography", "category": "skill", "genres": ["photography", "art", "creative"]},
    ]

    preference_lower = preference.lower()
    recommended_titles = []

    for item in items:
        # Check if preference matches category or any genre
        if preference_lower in item["category"] or any(p in preference_lower for p in item["genres"]):
            recommended_titles.append(item["title"])
        # Also check if any part of the preference matches the title itself
        elif preference_lower in item["title"].lower():
            recommended_titles.append(item["title"])

    # If no specific recommendations, provide some general ones
    if not recommended_titles:
        return ["Explore new topics", "Learn a new skill", "Read a good book"]
    
    # Remove duplicates and return
    return list(set(recommended_titles))