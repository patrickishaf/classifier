import { NaturalLanguageFilters } from "../dto";

const COUNTRY_MAP = {
  tanzania: 'TZ',
  nigeria: 'NG',
  uganda: 'UG',
  sudan: 'SD',
  'united states': 'US',
  united_states: 'US',
  madagascar: 'MG',
  'united kingdom': 'GB',
  united_kingdom: 'GB',
  india: 'IN',
  cameroon: 'CM',
  'cape verde': 'CV',
  cape_verde: 'CV',
  'republic of the congo': 'CG',
  republic_of_the_congo: 'CG',
  mozambique: 'MZ',
  'south africa': 'ZA',
  south_africa: 'ZA',
  mali: 'ML',
  angola: 'AO',
  'dr congo': 'CD',
  dr_congo: 'CD',
  france: 'FR',
  kenya: 'KE',
  zambia: 'ZM',
  eritrea: 'ER',
  gabon: 'GA',
  rwanda: 'RW',
  senegal: 'SN',
  namibia: 'NA',
  gambia: 'GM',
  "côte d'ivoire": 'CI',
  cote_d_ivoire: 'CI',
  ethiopia: 'ET',
  morocco: 'MA',
  malawi: 'MW',
  brazil: 'BR',
  tunisia: 'TN',
  somalia: 'SO',
  ghana: 'GH',
  zimbabwe: 'ZW',
  egypt: 'EG',
  benin: 'BJ',
  'western sahara': 'EH',
  western_sahara: 'EH',
  australia: 'AU',
  china: 'CN',
  botswana: 'BW',
  canada: 'CA',
  liberia: 'LR',
  mauritania: 'MR',
  burundi: 'BI',
  'burkina faso': 'BF',
  burkina_faso: 'BF',
  'central african republic': 'CF',
  central_african_republic: 'CF',
  mauritius: 'MU',
  algeria: 'DZ',
  japan: 'JP',
  'guinea-bissau': 'GW',
  guinea_bissau: 'GW',
  eswatini: 'SZ',
  'sierra leone': 'SL',
  sierra_leone: 'SL',
  comoros: 'KM',
  seychelles: 'SC',
  'south sudan': 'SS',
  south_sudan: 'SS',
  germany: 'DE',
  djibouti: 'DJ',
  niger: 'NE',
  togo: 'TG',
  lesotho: 'LS',
  chad: 'TD',
  'são tomé and príncipe': 'ST',
  sao_tome_and_principe: 'ST',
  libya: 'LY',
  guinea: 'GN',
  'equatorial guinea': 'GQ',
  equatorial_guinea: 'GQ',
};

const GENDER_KEYWORDS = {
  male: 'male',   males: 'male',   man: 'male',   men: 'male', boys: 'male', boy: 'male',
  female: 'female', females: 'female', woman: 'female', women: 'female', girls: 'female', girl: 'female',
};

const AGE_GROUP_KEYWORDS = {
  child: 'child',     children: 'child',
  teenager: 'teenager', teen: 'teenager', teenagers: 'teenager', teens: 'teenager',
  adult: 'adult',     adults: 'adult',
  senior: 'senior',   seniors: 'senior', elderly: 'senior',
};

const AGE_RANGE_KEYWORDS = {
  young: { min_age: 16, max_age: 24 },
};

const SORT_ORDER_KEYWORDS = {
  ascending: 'asc', acending: 'asc', asending: 'asc', increasing: 'asc', asc: 'asc',
  descending: 'desc', desceding: 'desc', desending: 'desc', decreasing: 'desc', desc: 'desc',
}

const SORT_BY_KEYWORDS = {
  age: 'age',
  name: 'name',
  gender: 'gender',
  country: 'country_id',
}

export const parseNaturalLanguageQuery = (q: string): NaturalLanguageFilters => {
  const filters: NaturalLanguageFilters = {};
  const tokens = q.toLowerCase().trim().split(/\s+/);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const nextToken = tokens[i + 1];
    const prevToken = tokens[i - 1];

    if (GENDER_KEYWORDS[token]) {
      filters.gender = GENDER_KEYWORDS[token];
      continue;
    }

    if (AGE_GROUP_KEYWORDS[token]) {
      filters.age_group = AGE_GROUP_KEYWORDS[token];
      continue;
    }

    if (AGE_RANGE_KEYWORDS[token]) {
      Object.assign(filters, AGE_RANGE_KEYWORDS[token]);
      continue;
    }

    if (token === 'above' && nextToken && !Number.isNaN(nextToken)) {
      filters.min_age = parseInt(nextToken);
      i++;
      continue;
    }

    if (token === 'below' && nextToken && !Number.isNaN(nextToken)) {
      filters.max_age = parseInt(nextToken);
      i++;
      continue;
    }

    if ((token === 'from' || token === 'in') && nextToken && COUNTRY_MAP[nextToken]) {
      filters.country_id = COUNTRY_MAP[nextToken];
      i++;
      continue;
    }

    if (COUNTRY_MAP[token]) {
      filters.country_id = COUNTRY_MAP[token];
      continue;
    }

    if (token === 'and' && i != 0 && nextToken) {
      const prevToken = tokens[i - 1];
      if (GENDER_KEYWORDS[prevToken] && GENDER_KEYWORDS[nextToken]) {
        filters.genders = [
          GENDER_KEYWORDS[prevToken],
          GENDER_KEYWORDS[nextToken],
        ];
        i++;
        continue;
      }
      if (COUNTRY_MAP[prevToken] && COUNTRY_MAP[nextToken]) {
        filters.country_ids = [
          COUNTRY_MAP[prevToken],
          COUNTRY_MAP[nextToken],
        ];
        i++;
        continue;
      }
      if (AGE_GROUP_KEYWORDS[prevToken] && AGE_GROUP_KEYWORDS[nextToken]) {
        filters.age_groups = [
          AGE_GROUP_KEYWORDS[prevToken],
          AGE_GROUP_KEYWORDS[nextToken],
        ];
        i++;
        continue;
      }
    }

    if (token === 'order' && i != 0 && SORT_ORDER_KEYWORDS[prevToken]) {
      filters.sort_order = SORT_ORDER_KEYWORDS[prevToken];
      continue;
    }

    if (token === 'of' && nextToken && SORT_BY_KEYWORDS[nextToken]) {
      filters.sort_by = SORT_BY_KEYWORDS[nextToken];
      i++;
      continue;
    }

    if (token === 'page' && nextToken && !Number.isNaN(nextToken)) {
      filters.page = parseInt(nextToken);
      i++;
      continue;
    }

    if (token === 'limit' && nextToken && !Number.isNaN(nextToken)) {
      filters.page_size = parseInt(nextToken);
      i++;
      continue;
    }
  }

  return filters;
}

export default parseNaturalLanguageQuery;