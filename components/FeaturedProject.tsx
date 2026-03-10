import React from 'react';
import { Page } from '../types';

interface FeaturedProjectProps {
    onNavigate?: (page: Page) => void;
}

const FeaturedProject: React.FC<FeaturedProjectProps> = ({ onNavigate }) => {
  return (
    <></>
  );
};

export default FeaturedProject;