from __future__ import annotations

import json
import re
import unicodedata
from io import BytesIO, StringIO
from pathlib import Path

import pandas as pd
import requests


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT / 'public' / 'data' / 'pin-current-mp.json'

PINCODE_SOURCE = 'https://raw.githubusercontent.com/Apoorv-Khatri/Political-Map/main/Political%20Map/pincode_political_map.dta'
WIKIPEDIA_PARSE_API = 'https://en.wikipedia.org/w/api.php'

ALIASES = {
    'ANAKAPALLE': 'Anakapalli',
    'ANANTNAG': 'Anantnag-Rajouri',
    'ANDAMAN & NICOBAR': 'Andaman and Nicobar Islands',
    'ARAMBAG (SC)': 'Arambagh (SC)',
    'AUTONOMOUS DISTRICT (ST)': 'Diphu (ST)',
    'BARRACKPUR': 'Barrackpore',
    'CHIKKBALLAPUR': 'Chikballapur',
    'DADRA & NAGAR HAVELI': 'Dadra and Nagar Haveli (ST)',
    'DAMAN & DIU': 'Daman and Diu',
    'GAUHATI': 'Guwahati',
    'HARDWAR': 'Haridwar',
    'KALIABOR': 'Kaziranga',
    'KODARMA': 'Koderma',
    'MANDSOUR': 'Mandsaur',
    'MANGALDOI': 'Darrang-Udalguri',
    'MAVELIKKARA (SC)': 'Mavelikara (SC)',
    'NARSAPURAM': 'Narasapuram',
    'NOWGONG': 'Nagaon',
    'PONDICHERRY': 'Puducherry',
    'SURGUJA (ST)': 'Sarguja (ST)',
    'TEZPUR': 'Sonitpur',
    'TIRUVALLUR (SC)': 'Thiruvallur (SC)',
    'VADAKARA': 'Vatakara',
}


def collapse_spaces(value: str) -> str:
    return re.sub(r'\s+', ' ', value).strip()


def clean_member_name(value: str) -> str:
    value = re.sub(r'\s*\((?:Died|Resigned|Elected)[^)]*\)\s*$', '', value)
    value = re.sub(r'\[\d+\]', '', value)
    return collapse_spaces(value)


def clean_party(value: str) -> str:
    value = re.sub(r'\[\d+\]', '', value)
    return collapse_spaces(value)


def normalize(value: str) -> str:
    value = unicodedata.normalize('NFKD', str(value))
    value = value.encode('ascii', 'ignore').decode('ascii')
    value = value.lower()
    value = re.sub(r'\([^)]*\)', '', value)
    value = re.sub(r'[^a-z0-9]+', '', value)
    return value


def load_pincode_data() -> pd.DataFrame:
    response = requests.get(PINCODE_SOURCE, headers={'User-Agent': 'Mozilla/5.0'}, timeout=60)
    response.raise_for_status()
    return pd.read_stata(BytesIO(response.content))


def load_current_members() -> pd.DataFrame:
    response = requests.get(
        WIKIPEDIA_PARSE_API,
        params={
            'action': 'parse',
            'page': 'List_of_members_of_the_18th_Lok_Sabha',
            'prop': 'text',
            'format': 'json',
            'origin': '*',
        },
        headers={'User-Agent': 'Mozilla/5.0'},
        timeout=30,
    )
    response.raise_for_status()
    html = response.json()['parse']['text']['*']

    rows: list[dict[str, str]] = []
    for table in pd.read_html(StringIO(html)):
        columns = [str(column).strip() for column in table.columns]
        if 'Constituency' not in columns or 'Name' not in columns:
            continue

        constituency_index = columns.index('Constituency')
        name_index = columns.index('Name')
        party_index = columns.index('Party.1') if 'Party.1' in columns else None

        for _, row in table.iterrows():
            constituency = str(row.iloc[constituency_index]).strip()
            mp_name = clean_member_name(str(row.iloc[name_index]).strip())
            party = clean_party(str(row.iloc[party_index]).strip()) if party_index is not None else ''

            if constituency and constituency != 'nan' and mp_name and mp_name != 'nan':
                rows.append(
                    {
                        'constituency': constituency,
                        'mpName': mp_name,
                        'party': party,
                        'isVacant': mp_name.lower() == 'vacant' or party.lower() == 'vacant',
                    }
                )

    members = pd.DataFrame(rows)
    return members.loc[~members['constituency'].duplicated(keep='last')].reset_index(drop=True)


def build_lookup(pincode_df: pd.DataFrame, members_df: pd.DataFrame) -> dict[str, dict[str, str | bool]]:
    member_map = {normalize(row.constituency): row for row in members_df.itertuples(index=False)}

    lookup: dict[str, dict[str, str | bool]] = {}
    missing_names: set[str] = set()

    for row in pincode_df.sort_values('pincode').itertuples(index=False):
        raw_name = str(getattr(row, 'parliament_name', '')).strip()
        if not raw_name:
            continue

        target_name = ALIASES.get(raw_name, raw_name)
        member_row = member_map.get(normalize(target_name))

        if member_row is None:
            missing_names.add(raw_name)
            continue

        pin = f'{int(getattr(row, "pincode")):06d}'
        lookup[pin] = {
            'constituency': member_row.constituency,
            'mpName': member_row.mpName,
            'party': member_row.party,
            'isVacant': bool(member_row.isVacant),
        }

    if missing_names:
        missing_list = ', '.join(sorted(missing_names))
        raise RuntimeError(f'Could not map these parliament names: {missing_list}')

    return lookup


def main() -> None:
    pincode_df = load_pincode_data()
    members_df = load_current_members()
    lookup = build_lookup(pincode_df, members_df)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_PATH.open('w', encoding='utf-8') as handle:
        json.dump(lookup, handle, ensure_ascii=False, separators=(',', ':'))

    print(f'Wrote {len(lookup)} pin records to {OUTPUT_PATH}')


if __name__ == '__main__':
    main()