export const headerStyles = {
  appBar: {
    position: 'static' as const,
    boxShadow: 1,
  },

  toolbar: {
    
  },

  container: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
  },

  logo: {
    height: 64,
    width: 64,
    mr: 2,
  },

  title: {
    variant: 'h6' as const,
    component: 'div' as const,
  },
};