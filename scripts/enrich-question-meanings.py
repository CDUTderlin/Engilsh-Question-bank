from __future__ import annotations

import html
import json
import re
import time
from collections import Counter
from pathlib import Path
from typing import Dict, List
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
QUESTIONS_JS_PATH = ROOT / "src" / "data" / "question-bank" / "questions.js"
QUESTIONS_JSON_PATH = ROOT / "src" / "static" / "question-bank" / "questions.json"
CACHE_PATH = ROOT / "scripts" / "cache" / "youdao-question-meanings.json"

WORD_PATTERN = re.compile(r"[A-Za-z]+(?:[-'][A-Za-z]+)*")
TRANS_BLOCK_PATTERN = re.compile(r'<div class="trans-container">\s*<ul>(.*?)</ul>', re.S)
LIST_ITEM_PATTERN = re.compile(r"<li>(.*?)</li>", re.S)
POS_PATTERN = re.compile(
    r"^(?P<pos>(?:n|v|vt|vi|adj|adv|prep|pron|conj|int|num|aux|abbr|art|det)\.)\s*(?P<text>.+)$",
    re.I,
)
KNOWN_POS = ["n.", "v.", "vt.", "vi.", "adj.", "adv.", "prep.", "pron.", "conj.", "int.", "num.", "aux.", "abbr.", "art.", "det."]
WORDNET_POS_MAP = {"n": "n.", "v": "v.", "a": "adj.", "s": "adj.", "r": "adv."}
SUFFIX_POS_HINTS = [
    ("ly", "adv."),
    ("ness", "n."),
    ("tion", "n."),
    ("sion", "n."),
    ("ment", "n."),
    ("ity", "n."),
    ("ship", "n."),
    ("ance", "n."),
    ("ence", "n."),
    ("ism", "n."),
    ("ist", "n."),
    ("er", "n."),
    ("or", "n."),
    ("able", "adj."),
    ("ible", "adj."),
    ("ous", "adj."),
    ("ful", "adj."),
    ("less", "adj."),
    ("ive", "adj."),
    ("al", "adj."),
    ("ic", "adj."),
    ("ify", "v."),
    ("ise", "v."),
    ("ize", "v."),
    ("ate", "v."),
]
MANUAL_OVERRIDES = {
    "fuent": [{"pos": "adj.", "glosses": ["流利的", "流畅的"]}],
    "fuently": [{"pos": "adv.", "glosses": ["流利地", "流畅地"]}],
    "joumal": [{"pos": "n.", "glosses": ["日记", "杂志", "定期刊物"]}],
    "midwestem": [{"pos": "adj.", "glosses": ["中西部的"]}],
    "onpurpose": [{"pos": "adv.", "glosses": ["故意地", "故意"]}],
}

try:
    from nltk.corpus import wordnet as wn
except Exception:  # pragma: no cover - fallback path
    wn = None


def load_js_array(path: Path) -> List[dict]:
    text = path.read_text(encoding="utf-8")
    return json.loads(text[text.index("[") :])


def write_js_array(path: Path, payload: List[dict] | List[str]) -> None:
    path.write_text(
        "export default " + json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def write_json(path: Path, payload: List[dict] | List[str]) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def is_single_word(stem: str) -> bool:
    return bool(WORD_PATTERN.fullmatch(stem.strip()))


def normalize_space(text: str) -> str:
    text = re.sub(r"<[^>]+>", "", text)
    text = html.unescape(text)
    text = text.replace("\u3000", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def split_glosses(text: str) -> List[str]:
    return [part.strip("；; ") for part in re.split(r"[；;]\s*", text) if part.strip("；; ")]


def load_cache() -> Dict[str, dict]:
    if not CACHE_PATH.exists():
        return {}

    return json.loads(CACHE_PATH.read_text(encoding="utf-8"))


def save_cache(cache: Dict[str, dict]) -> None:
    CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    CACHE_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def fetch_youdao_items(word: str, cache: Dict[str, dict]) -> List[str]:
    if word in cache and cache[word].get("items"):
        return cache[word].get("items", [])

    url = f"https://dict.youdao.com/w/eng/{quote(word)}/#keyfrom=dict2.index"
    items: List[str] = []
    error = None
    for attempt in range(3):
        request = Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
            },
        )
        try:
            response = urlopen(request, timeout=20)
            html_text = response.read().decode("utf-8", errors="ignore")
            match = TRANS_BLOCK_PATTERN.search(html_text)
            if match:
                items = []
                for raw_item in LIST_ITEM_PATTERN.findall(match.group(1)):
                    cleaned = normalize_space(raw_item)
                    if not cleaned or cleaned.startswith("【名】"):
                        continue
                    items.append(cleaned)
            else:
                error = "missing_trans_container"

            if items:
                error = None
                break
        except HTTPError as exc:
            error = f"http_{exc.code}"
        except URLError as exc:
            error = f"url_{exc.reason}"
        except Exception as exc:  # pragma: no cover - network variability
            error = type(exc).__name__

        time.sleep(0.3 * (attempt + 1))

    cache[word] = {"items": items, "error": error}
    time.sleep(0.12)
    return items


def detect_wordnet_pos(word: str) -> List[str]:
    if wn is None:
        return []

    counts = Counter()
    try:
        for synset in wn.synsets(word):
            mapped = WORDNET_POS_MAP.get(synset.pos())
            if mapped:
                counts[mapped] += 1
    except LookupError:
        return []

    return [pos for pos, _ in counts.most_common()]


def infer_pos(word: str, meaning_text: str) -> str:
    lower_word = word.lower()
    lowered_meaning = meaning_text.lower()

    if lower_word in {"onpurpose", "thus"}:
        return "adv."

    for pos in KNOWN_POS:
        if pos in lowered_meaning:
            return pos

    if lowered_meaning.startswith("在") or lowered_meaning.endswith("地") or lowered_meaning in {"故意", "因此", "于是", "这样", "确实如此"}:
        return "adv."

    if "的" in meaning_text:
        return "adj."

    for suffix, pos in SUFFIX_POS_HINTS:
        if lower_word.endswith(suffix):
            return pos

    candidates = detect_wordnet_pos(lower_word)
    if candidates:
        return candidates[0]

    return "n."


def parse_marked_meanings(word: str, meaning_text: str) -> List[dict]:
    normalized = meaning_text.strip()
    normalized = normalized.replace("V", "v.")
    normalized = re.sub(r"(?<!^)(?=(?:n|v|vt|vi|adj|adv|prep|pron|conj|int|num|aux|abbr|art|det)\.)", "\n", normalized, flags=re.I)

    groups = []
    for part in [item.strip() for item in normalized.splitlines() if item.strip()]:
        match = POS_PATTERN.match(part)
        if match:
            pos = match.group("pos").lower()
            gloss_text = match.group("text").strip()
        else:
            pos = infer_pos(word, part)
            gloss_text = part

        glosses = split_glosses(gloss_text)
        if glosses:
            groups.append({"pos": pos, "glosses": glosses})

    if groups:
        return merge_meaning_groups(groups)

    fallback_groups = []
    for gloss in split_glosses(meaning_text) or [meaning_text.strip()]:
        fallback_groups.append({"pos": infer_pos(word, gloss), "glosses": [gloss]})

    return merge_meaning_groups(fallback_groups)


def merge_meaning_groups(groups: List[dict]) -> List[dict]:
    merged = []
    index_map: Dict[str, int] = {}
    for group in groups:
        pos = group["pos"]
        glosses = []
        seen = set()
        for gloss in group["glosses"]:
            normalized = gloss.strip()
            if normalized and normalized not in seen:
                seen.add(normalized)
                glosses.append(normalized)

        if not glosses:
            continue

        if pos in index_map:
            target = merged[index_map[pos]]
            for gloss in glosses:
                if gloss not in target["glosses"]:
                    target["glosses"].append(gloss)
        else:
            index_map[pos] = len(merged)
            merged.append({"pos": pos, "glosses": glosses})

    return merged


def parse_youdao_meanings(word: str, items: List[str], fallback_meaning: str) -> List[dict]:
    groups = []
    for item in items:
        match = POS_PATTERN.match(item)
        if match:
            pos = match.group("pos").lower()
            gloss_text = match.group("text").strip()
        else:
            pos = infer_pos(word, item)
            gloss_text = item

        glosses = split_glosses(gloss_text)
        if glosses:
            groups.append({"pos": pos, "glosses": glosses})

    merged = merge_meaning_groups(groups)
    if merged:
        return merged

    return parse_marked_meanings(word, fallback_meaning)


def format_meaning_line(group: dict, limit: int | None = None) -> str:
    glosses = group["glosses"] if limit is None else group["glosses"][:limit]
    if not glosses:
        return ""
    return f"{group['pos']} {'；'.join(glosses)}"


def build_full_meaning(groups: List[dict]) -> str:
    return "；".join(filter(None, (format_meaning_line(group) for group in groups)))


def build_summary_meaning(groups: List[dict]) -> str:
    return "；".join(filter(None, (format_meaning_line(group, limit=2) for group in groups)))


def enrich_rows(rows: List[dict]) -> List[dict]:
    cache = load_cache()
    unique_words = sorted({row["stem"].strip().lower() for row in rows if is_single_word(row["stem"])})
    total = len(unique_words)

    word_details: Dict[str, dict] = {}
    failures = []
    for index, word in enumerate(unique_words, start=1):
        fallback_row = next(row for row in rows if row["stem"].strip().lower() == word)
        if word in MANUAL_OVERRIDES:
            items = []
            meanings = MANUAL_OVERRIDES[word]
        else:
            items = fetch_youdao_items(word, cache)
            meanings = parse_youdao_meanings(word, items, fallback_row["meaning"])
            if not items:
                failures.append(word)

        word_details[word] = {
            "meanings": meanings,
            "meaning": build_full_meaning(meanings),
            "meaningSummary": build_summary_meaning(meanings),
        }

        if index % 50 == 0 or index == total:
            print(f"[{index}/{total}] processed")

    save_cache(cache)

    if failures:
        print("fallback_words:", ", ".join(failures[:40]))
        if len(failures) > 40:
            print(f"... and {len(failures) - 40} more")

    enriched_rows = []
    for row in rows:
        if not is_single_word(row["stem"]):
            enriched_rows.append(row)
            continue

        details = word_details[row["stem"].strip().lower()]
        enriched = dict(row)
        enriched["meaning"] = details["meaning"]
        enriched["meaningSummary"] = details["meaningSummary"]
        enriched["meanings"] = details["meanings"]
        enriched_rows.append(enriched)

    return enriched_rows


def main() -> None:
    questions = load_js_array(QUESTIONS_JS_PATH)
    enriched_rows = enrich_rows(questions)

    write_js_array(QUESTIONS_JS_PATH, enriched_rows)
    write_json(QUESTIONS_JSON_PATH, enriched_rows)

    print(f"updated {len(enriched_rows)} question rows")


if __name__ == "__main__":
    main()
