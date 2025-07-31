import { Box, keyframes } from '@mui/material';
import React from 'react';

const widthAnimation = keyframes`
  to {
    width: 50px;
  }
`;

// 定义尺寸配置
const sizeConfigs = {
  small: {
    width: '60px',
    height: '18px',
    minWidth: '30px',
    backgroundSize: '18px 100%',
    maskRadius: '7px',
    maskPositions: {
      left: 'left 9px top 50%',
      center: 'center',
      right: 'right 9px top 50%'
    }
  },
  medium: {
    width: '100px',
    height: '30px',
    minWidth: '50px',
    backgroundSize: '30px 100%',
    maskRadius: '12px',
    maskPositions: {
      left: 'left 15px top 50%',
      center: 'center',
      right: 'right 15px top 50%'
    }
  },
  large: {
    width: '140px',
    height: '42px',
    minWidth: '70px',
    backgroundSize: '42px 100%',
    maskRadius: '17px',
    maskPositions: {
      left: 'left 21px top 50%',
      center: 'center',
      right: 'right 21px top 50%'
    }
  }
};

interface DotsAnimationProps {
  size?: 'small' | 'medium' | 'large';
}

export const DotsAnimation: React.FC<DotsAnimationProps> = ({ size = 'medium' }) => {
  const config = sizeConfigs[size];
  
  // 为不同尺寸创建不同的动画
  const sizeSpecificAnimation = keyframes`
    to {
      width: ${config.minWidth};
    }
  `;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
      width="100%"
    >
      <Box
        sx={{
          width: config.width,
          height: config.height,
          display: 'grid',
          background: `radial-gradient(farthest-side, currentColor 98%, transparent) center/${config.backgroundSize} no-repeat`,
          color: 'primary.main',
          
          WebkitMask: `
            radial-gradient(${config.maskRadius} at ${config.maskPositions.left}, transparent 95%, black),
            radial-gradient(${config.maskRadius} at ${config.maskPositions.center}, transparent 95%, black),
            radial-gradient(${config.maskRadius} at ${config.maskPositions.right}, transparent 95%, black)
          `,
          mask: `
            radial-gradient(${config.maskRadius} at ${config.maskPositions.left}, transparent 95%, black),
            radial-gradient(${config.maskRadius} at ${config.maskPositions.center}, transparent 95%, black),
            radial-gradient(${config.maskRadius} at ${config.maskPositions.right}, transparent 95%, black)
          `,
          WebkitMaskComposite: 'source-in',
          maskComposite: 'intersect',
          
          animation: `${sizeSpecificAnimation} 1s infinite alternate`,
          
          '&::before': {
            content: '""',
            gridArea: '1/1',
            height: config.height,
            aspectRatio: '1',
            backgroundColor: 'currentColor',
            borderRadius: '50%',
          },
          
          '&::after': {
            content: '""',
            gridArea: '1/1',
            height: config.height,
            aspectRatio: '1',
            backgroundColor: 'currentColor',
            borderRadius: '50%',
            marginLeft: 'auto',
          },
        }}
      />
    </Box>
  );
};