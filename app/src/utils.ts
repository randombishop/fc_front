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


export { 
  castCategories,
  getBackendUrl, 
  fontFamily, 
  colors, 
  hexToRGBA,
  pieChartPalette 
} ;
