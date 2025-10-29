
import React from 'react';

export const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export const LogoLight: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="35" fontFamily="Arial, sans-serif" fontSize="30" fill="#E5E7EB">
            SZÉKELYUDVARHELY
        </text>
    </svg>
);

export const LogoDark: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="35" fontFamily="Arial, sans-serif" fontSize="30" fill="#1F2937">
            SZÉKELYUDVARHELY
        </text>
    </svg>
);


export const HU_Flag: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <rect width="900" height="600" fill="#fff"/>
    <rect width="900" height="400" fill="#388E3C"/>
    <rect width="900" height="200" fill="#D32F2F"/>
  </svg>
);

export const RO_Flag: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <rect width="300" height="600" fill="#002B7F"/>
    <rect x="300" width="300" height="600" fill="#FCD116"/>
    <rect x="600" width="300" height="600" fill="#CE1126"/>
  </svg>
);

export const GB_Flag: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600">
    <rect width="1200" height="600" fill="#012169"/>
    <path d="M0,0 L1200,600 M0,600 L1200,0" stroke="#fff" strokeWidth="60"/>
    <path d="M0,0 L1200,600 M0,600 L1200,0" stroke="#C8102E" strokeWidth="40"/>
    <path d="M600,0 V600 M0,300 H1200" stroke="#fff" strokeWidth="200"/>
    <path d="M600,0 V600 M0,300 H1200" stroke="#C8102E" strokeWidth="120"/>
  </svg>
);

export const DE_Flag: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600">
    <rect width="1000" height="600" fill="#000"/>
    <rect y="200" width="1000" height="400" fill="#D00"/>
    <rect y="400" width="1000" height="200" fill="#FFCE00"/>
  </svg>
);
