import BannerArt from './assets/banners/art.png';
import BannerBusiness from './assets/banners/business.png';
import BannerCrypto from './assets/banners/crypto.png';
import BannerCulture from './assets/banners/culture.png';
import BannerGM from './assets/banners/gm.png';
import BannerMoney from './assets/banners/money.png';
import BannerNature from './assets/banners/nature.png';
import BannerPolitics from './assets/banners/politics.png';
import BannerSports from './assets/banners/sports.png';
import BannerTechScience from './assets/banners/tech_science.png';


function getBackendUrl() {
  //return 'https://fc.datascience.art' ;
  return 'http://localhost:8080' ;
}

function getTaskUrl(token: string) {
  return getBackendUrl() + '/task/' + token ;
}

const castCategories:any = {
  'c_arts': 'Arts',
  'c_business': 'Business',
  'c_crypto': 'Crypto',
  'c_culture': 'Culture',
  'c_misc': 'Misc',
  'c_money': 'Money',
  'c_nature': 'Nature',
  'c_politics': 'Politics',
  'c_sports': 'Sports',
  'c_tech_science': 'Tech & Science'
}

const castTopics:any = {
  'c_arts': {
    't_music': 'Music',
    't_movies': 'Movies',
    't_books': 'Books',
    't_photography': 'Photography'
  },
  'c_culture': {
    't_travel': 'Travel',
    't_food': 'Food',
    't_history': 'History',
    't_gaming': 'Gaming',
    't_comedy': 'Comedy',
    't_fashion': 'Fashion',
    't_lifestyle': 'Lifestyle'
  },
  'c_tech_science': {
      't_technology': 'Technology',
      't_science': 'Science',
      't_maths': 'Maths',
      't_physics': 'Physics',
      't_security': 'Security',
      't_coding': 'Coding',
      't_artificial_intelligence': 'Artificial Intelligence',
      't_data': 'Data'
   },
  'c_sports': {
      't_football': 'Football', 
      't_basketball': 'Basketball', 
      't_tennis': 'Tennis',
      't_chess': 'Chess'
  },
  'c_business': {
      't_jobs': 'Jobs',
      't_growth': 'Growth',
      't_founders': 'Founders',
      't_advertising': 'Advertising',
      't_marketing': 'Marketing',
      't_real_estate': 'Real Estate'
  },
  'c_crypto': {
      't_ethereum': 'Ethereum',
      't_bitcoin': 'Bitcoin',
      't_solana': 'Solana',
      't_nft': 'NFT',
      't_defi': 'DeFi',
      't_farcaster': 'Farcaster',
      't_degen': 'Degen',
      't_blockchain': 'Blockchain',
      't_prices': 'Prices'
  },
  'c_money': {
      't_economy': 'Economy',
      't_markets': 'Markets',
      't_finance': 'Finance',
      't_trading': 'Trading'
  },
  'c_politics': {
      't_news': 'News',
      't_analysis': 'Analysis',
      't_people': 'People',
      't_elections': 'Elections'
  },
  'c_nature': {
      't_outdoors': 'Outdoors', 
      't_animals': 'Animals', 
      't_dogs': 'Dogs', 
      't_cats': 'Cats'
  },
  'c_misc': {
      't_health': 'Health',
      't_greetings': 'Greetings',
      't_weather': 'Weather',
      't_holidays': 'Holidays',
      't_fitness': 'Fitness',
      't_shopping': 'Shopping',
      't_family': 'Family',
      't_roasting': 'Roasting'
  }
} ;

const fontFamily = '"Courier New", Courier, monospace' ;

const colors = {
  primary: '#27FFDF' ,
  secondary: '#FD5FF1',
  third: '#ABE15B',
  warning: '#FFD242',
  error: '#FF2740',
  dark: '#576176',
  light: '#FAEBD7'
}

function hexToRGBA(hex: string, alpha: number) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) ;
  const g = parseInt(hex.substring(2, 4), 16) ;
  const b = parseInt(hex.substring(4, 6), 16) ;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const darkColors: string[] = [
  "#1192e8",
  "#9f1853",
  "#198038",
  "#b28600",
  "#a56eff",
  "#002d9c",
  "#ee538b",
  "#009d9a",
  "#8a3800",
  "#6929c4",
];


const lightColors: string[] = [
  "#33b1ff",
  "#ff7eb6",
  "#6fdc8c",
  "#d2a106",
  "#d4bbff",
  "#4589ff",
  "#d12771",
  "#08bdba",
  "#ba4e00",
  "#8a3ffc",
];

function getColorForItem(palette:string, i:number): string {
  return palette==='dark'?darkColors[i % darkColors.length]:lightColors[i % lightColors.length] ;
}

function getColorForArray(palette:string, n:number): string[] {
  const colors = palette==='dark'?darkColors:lightColors ;
  const ans = [] ;
  const colorsLength = colors.length;
  for (let i = 0; i < n; i++) {
    ans.push(colors[i % colorsLength]) ;
  }
  return ans ;
}

function dateYYYY_MM_DD(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function today(): string {
  const date = new Date();
  return dateYYYY_MM_DD(date);
}

function nDaysAgo(n: number): string {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return dateYYYY_MM_DD(date);
}

function numDaysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDifference = end.getTime() - start.getTime();
  const dayDifference = Math.floor(timeDifference / (1000 * 3600 * 24)) + 1;
  return dayDifference;
}

function deepCopy(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

const banners:any = {
  'c_arts': BannerArt,
  'c_business': BannerBusiness,
  'c_crypto': BannerCrypto,
  'c_culture': BannerCulture,
  'c_misc': BannerGM,
  'c_money': BannerMoney,
  'c_nature': BannerNature,
  'c_politics': BannerPolitics,
  'c_sports': BannerSports,
  'c_tech_science': BannerTechScience
}

const featureTranslation:any = {
  "q_clear": "Clear",
  "q_audience": "Targeted Audience",
  "q_info": "Informative",
  "q_easy": "Easy to understand",
  "q_verifiable": "Verifiable",
  "q_personal": "Personal Touch",
  "q_funny": "Funny",
  "q_meme_ref": "Known meme reference",
  "q_emo_res": "Emotional response",
  "q_happiness": "Happy",
  "q_curiosity": "Triggers curiosity",
  "q_aggressivity": "Aggressive",
  "q_surprise": "Element of surprise",
  "q_interesting_ask": "Interesting Question",
  "q_call_action": "Calls to action"
} ;

const birdScoreThresholds = {
  scoreLow: 15,
  scoreMedium: 25,
  scoreMax: 50
} ;

function insertMentions(
    original: string,
    mentionPositions: number[],
    mentions: string[]
): string {
    
    if (mentions.length !== mentionPositions.length) {
        throw new Error("Mentions and positions arrays must have the same length");
    }

    console.log('insertMentions', original, mentions, mentionPositions) ;
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Step 1: Encode the original string to UTF-8 bytes
    const utf8Bytes = encoder.encode(original);

    // Step 2: Cut the byte array at specified positions
    let parts: Uint8Array[] = [];
    let start = 0;

    for (const pos of mentionPositions) {
        parts.push(utf8Bytes.slice(start, pos));
        start = pos;
    }
    parts.push(utf8Bytes.slice(start)); // Add the last part

    // Step 3: Reconvert the byte parts to strings
    let resultParts: string[] = parts.map(part => decoder.decode(part));

    // Step 4: Insert the mentions between the parts
    let result = resultParts[0];
    for (let i = 0; i < mentions.length; i++) {
        result += mentions[i] + resultParts[i + 1];
    }

    return result;
}

function randomString(length: number = 10): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let nonce = '';
  const charsetLength = charset.length;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsetLength);
    nonce += charset[randomIndex];
  }
  return nonce;
}

export { 
  castCategories,
  castTopics,
  getBackendUrl, 
  getTaskUrl,
  fontFamily, 
  colors, 
  hexToRGBA,
  darkColors,
  lightColors,
  getColorForItem,
  getColorForArray,
  today,
  nDaysAgo,
  numDaysBetween,
  deepCopy,
  banners,
  featureTranslation,
  birdScoreThresholds,
  dateYYYY_MM_DD,
  insertMentions,
  randomString 
} ;
