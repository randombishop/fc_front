function getBackendUrl() {
  return 'http://localhost:8080' ;
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

const pieChartPalette = [
  '#573D26',
  '#BE2D26',
  '#6BA18A',
  '#E99D2A',
  '#5A86AD',
  '#AC80A6',
  '#74A6AD',
  '#E0DBB7',
  '#576176',
  '#CACCD3',
  '#9B6C4A',
  '#E84627',
  '#95D8BA',
  '#D0D150',
  '#B8D3ED',
  '#D19ECB',
  '#93CFD7',
  '#FFF9D5'
] ;

function today(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function nDaysAgo(n: number): string {
  const date = new Date();
  date.setDate(date.getDate() - n);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}


export { 
  castCategories,
  castTopics,
  getBackendUrl, 
  fontFamily, 
  colors, 
  hexToRGBA,
  pieChartPalette,
  today,
  nDaysAgo 
} ;