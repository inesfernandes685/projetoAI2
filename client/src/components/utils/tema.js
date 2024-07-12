import { createTheme } from '@mui/material/styles';

const tema = createTheme({
  palette: {
    primary: {
      main: '#008B98',
    },
    secondary: {
      main: '#FFFFFF',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          margin: '10px',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffff',
          color: '#008B98',
          borderRadius: '10px',
        },
        cell: {
          color: '#00000',
        },
        columnHeaders: {  
          backgroundColor: '#FFFF',
          color: '#008B98',
        },
        footerContainer: {
          backgroundColor: '#FFFF',
        },
      },
    },
  },
});

export default tema;
