import React from 'react';

export interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  year: string;
  location?: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  id_tag?: string; // For identifying specific services like 'exterior-rendering'
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
}

export type Page = 'home' | 'exterior' | 'interior' | 'virtual-tour' | 'aerial' | 'immersive' | 'spatial' | 'animation' | 'real-estate' | 'interior-designers' | 'architects' | 'projects';