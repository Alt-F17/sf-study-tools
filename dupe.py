import json
from collections import Counter

with open(r'src/data/wordJumbleWords.json') as f:
    words = [e['word'] for e in json.load(f)]

dups = [w for w, c in Counter(words).items() if c > 1]
print('Duplicates:', dups)