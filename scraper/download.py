import requests
url = "https://queenalba.net/wys2/file_attach/2025/12/05/1764913294-97.jpg"
r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
with open("C:/Users/mapdr/.gemini/antigravity/brain/c0e532ee-d1ed-427f-bf89-08fd4c86f7ce/source_original.jpg", "wb") as f:
    f.write(r.content)
print("Done:", len(r.content), "bytes")
