function getBackendUrl() {
  return 'http://localhost:8080' ;
}

const fontFamily = '"Courier New", Courier, monospace' ;

const colors = {
  primary: '#27FFDF' ,
  secondary: '#9A5FEB',
  third: '#ABE15B',
  warning: '#FFD242',
  error: '#FF2740',
  dark: '#576176',
  light: '#CACCD3',
  paper: '#121212'
}

function hexToRGBA(hex: string, alpha: number) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) ;
  const g = parseInt(hex.substring(2, 4), 16) ;
  const b = parseInt(hex.substring(4, 6), 16) ;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export { getBackendUrl, fontFamily, colors, hexToRGBA } ;
