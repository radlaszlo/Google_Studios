
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

export const AppLogo: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 100 95" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M50 41.5C38.68 41.5 29.5 32.32 29.5 21C29.5 9.68 38.68 0.5 50 0.5C61.32 0.5 70.5 9.68 70.5 21C70.5 32.32 61.32 41.5 50 41.5ZM50 35.5C58.28 35.5 65 29.03 65 21C65 12.97 58.28 6.5 50 6.5C41.72 6.5 35 12.97 35 21C35 29.03 41.72 35.5 50 35.5Z" />
        <path d="M53 50.5C53 52.16 51.66 53.5 50 53.5C48.34 53.5 47 52.16 47 50.5C47 48.84 48.34 47.5 50 47.5C51.66 47.5 53 48.84 53 50.5Z" />
        <path d="M53 64.5C53 66.16 51.66 67.5 50 67.5C48.34 67.5 47 66.16 47 64.5C47 62.84 48.34 61.5 50 61.5C51.66 61.5 53 62.84 53 64.5Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M50 89.5C42.82 89.5 37 83.68 37 76.5C37 69.32 42.82 63.5 50 63.5C57.18 63.5 63 69.32 63 76.5C63 83.68 57.18 89.5 50 89.5ZM50 83.5C53.87 83.5 57 80.37 57 76.5C57 72.63 53.87 69.5 50 69.5C46.13 69.5 43 72.63 43 76.5C43 80.37 46.13 83.5 50 83.5Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M26 62.5C18.27 62.5 12 56.23 12 48.5C12 40.77 18.27 34.5 26 34.5C29.69 34.5 33.03 36.1 35.5 38.59C31.54 44.4 31.5 52.41 35.37 58.28C32.96 60.9 29.65 62.5 26 62.5ZM26 56.5C28.42 56.5 30.51 55.43 31.84 53.79C29.7 48.35 30.73 42.33 34.62 38.38C33.51 37.81 32.28 37.5 31 37.5C22.16 37.5 15 44.66 15 53.5C15 58.82 18.8 63.55 23.78 65.41C24.47 61.33 26.68 57.77 29.8 55.45C28.39 56.12 27.22 56.5 26 56.5Z" />
        <path d="M29 51.5C29 53.16 27.66 54.5 26 54.5C24.34 54.5 23 53.16 23 51.5C23 49.84 24.34 48.5 26 48.5C27.66 48.5 29 49.84 29 51.5Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M74 62.5C66.27 62.5 60 56.23 60 48.5C60 40.77 66.27 34.5 74 34.5C77.69 34.5 81.03 36.1 83.5 38.59C79.54 44.4 79.5 52.41 83.37 58.28C80.96 60.9 77.65 62.5 74 62.5ZM74 56.5C71.58 56.5 69.49 55.43 68.16 53.79C70.3 48.35 69.27 42.33 65.38 38.38C66.49 37.81 67.72 37.5 69 37.5C77.84 37.5 85 44.66 85 53.5C85 58.82 81.2 63.55 76.22 65.41C75.53 61.33 73.32 57.77 70.2 55.45C71.61 56.12 72.78 56.5 74 56.5Z" />
        <path d="M77 51.5C77 53.16 75.66 54.5 74 54.5C72.34 54.5 71 53.16 71 51.5C71 49.84 72.34 48.5 74 48.5C75.66 48.5 77 49.84 77 51.5Z" />
        <path d="M42.5 86.5C42.5 87.88 41.38 89 40 89C38.62 89 37.5 87.88 37.5 86.5C37.5 85.12 38.62 84 40 84C41.38 84 42.5 85.12 42.5 86.5Z" />
        <path d="M33 80C33 81.38 31.88 82.5 30.5 82.5C29.12 82.5 28 81.38 28 80C28 78.62 29.12 77.5 30.5 77.5C31.88 77.5 33 78.62 33 80Z" />
        <path d="M26.5 72C26.5 73.38 25.38 74.5 24 74.5C22.62 74.5 21.5 73.38 21.5 72C21.5 70.62 22.62 69.5 24 69.5C25.38 69.5 26.5 70.62 26.5 72Z" />
        <path d="M32.5 91.5C32.5 92.88 31.38 94 30 94C28.62 94 27.5 92.88 27.5 91.5C27.5 90.12 28.62 89 30 89C31.38 89 32.5 90.12 32.5 91.5Z" />
        <path d="M43.5 93C43.5 94.38 42.38 95.5 41 95.5C39.62 95.5 38.5 94.38 38.5 93C38.5 91.62 39.62 90.5 41 90.5C42.38 90.5 43.5 91.62 43.5 93Z" />
        <path d="M57.5 86.5C57.5 87.88 58.62 89 60 89C61.38 89 62.5 87.88 62.5 86.5C62.5 85.12 61.38 84 60 84C58.62 84 57.5 85.12 57.5 86.5Z" />
        <path d="M67 80C67 81.38 68.12 82.5 69.5 82.5C70.88 82.5 72 81.38 72 80C72 78.62 70.88 77.5 69.5 77.5C68.12 77.5 67 78.62 67 80Z" />
        <path d="M73.5 72C73.5 73.38 74.62 74.5 76 74.5C77.38 74.5 78.5 73.38 78.5 72C78.5 70.62 77.38 69.5 76 69.5C74.62 69.5 73.5 70.62 73.5 72Z" />
        <path d="M67.5 91.5C67.5 92.88 68.62 94 70 94C71.38 94 72.5 92.88 72.5 91.5C72.5 90.12 71.38 89 70 89C68.62 89 67.5 90.12 67.5 91.5Z" />
        <path d="M56.5 93C56.5 94.38 57.62 95.5 59 95.5C60.38 95.5 61.5 94.38 61.5 93C61.5 91.62 60.38 90.5 59 90.5C57.62 90.5 56.5 91.62 56.5 93Z" />
    </svg>
);


export const HU_Flag: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <rect width="900" height="200" fill="#D32F2F"/>
    <rect y="200" width="900" height="200" fill="#fff"/>
    <rect y="400" width="900" height="200" fill="#436F4D"/>
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