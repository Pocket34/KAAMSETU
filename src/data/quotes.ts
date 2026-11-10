export interface Quote {
  id: string;
  quote: string;
  language: 'hi' | 'en';
  translation?: string;
  theme: 'talent' | 'hardwork' | 'dignity' | 'opportunity' | 'entrepreneurship';
}

export const ORIGINAL_QUOTES: Quote[] = [
  {
    id: 'q1',
    quote: 'Your financial condition does not define your potential.',
    language: 'en',
    translation: 'आपकी आर्थिक स्थिति आपकी क्षमता को तय नहीं करती।',
    theme: 'dignity',
  },
  {
    id: 'q2',
    quote: 'Talent has no economic background.',
    language: 'en',
    translation: 'हुनर का कोई आर्थिक दायरा नहीं होता।',
    theme: 'talent',
  },
  {
    id: 'q3',
    quote: 'An opportunity can change an entire generation.',
    language: 'en',
    translation: 'एक सही अवसर पूरी पीढ़ी की दिशा बदल सकता है।',
    theme: 'opportunity',
  },
  {
    id: 'q4',
    quote: 'काम छोटा नहीं होता, अवसर छोटा नहीं होना चाहिए।',
    language: 'hi',
    translation: 'No work is small, and no opportunity should ever be small.',
    theme: 'dignity',
  },
  {
    id: 'q5',
    quote: 'Your skills deserve to be seen.',
    language: 'en',
    translation: 'आपके हुनर को दुनिया के सामने आने का पूरा हक है।',
    theme: 'talent',
  },
  {
    id: 'q6',
    quote: 'हर हुनर को एक मौका मिलना चाहिए।',
    language: 'hi',
    translation: 'Every talent deserves an opportunity.',
    theme: 'opportunity',
  },
  {
    id: 'q7',
    quote: 'दुकान की चारदीवारी नहीं, काम का हुनर ही असली व्यापार है।',
    language: 'hi',
    translation: 'Not the four walls of a shop, but the mastery of your skill is the true business.',
    theme: 'entrepreneurship',
  },
  {
    id: 'q8',
    quote: 'Poverty is a circumstance of today; your capability is the foundation of tomorrow.',
    language: 'en',
    translation: 'गरीबी आज की परिस्थिति हो सकती है, लेकिन आपकी मेहनत कल की बुनियाद है।',
    theme: 'hardwork',
  },
  {
    id: 'q9',
    quote: 'पसीने की कमाई और ईमानदारी का काम, इंसान का सबसे बड़ा सम्मान है।',
    language: 'hi',
    translation: 'Honest labor and hard-earned dignity are a person’s greatest pride.',
    theme: 'dignity',
  },
  {
    id: 'q10',
    quote: 'When skill meets determination, capital follows.',
    language: 'en',
    translation: 'जब हुनर और हौसला एक साथ आते हैं, तो संसाधन खुद राह बना लेते हैं।',
    theme: 'entrepreneurship',
  },
  {
    id: 'q11',
    quote: 'रोटी केवल पेट नहीं भरती, आत्मनिर्भरता इंसान को सिर उठाकर जीना सिखाती है।',
    language: 'hi',
    translation: 'Earning your own living nourishes more than hunger; it teaches you to walk with head held high.',
    theme: 'dignity',
  },
  {
    id: 'q12',
    quote: 'A bridge does not care who walks upon it; it exists only to connect.',
    language: 'en',
    translation: 'पुल किसी की हैसियत नहीं पूछता; उसका काम केवल दो किनारों को मिलाना है।',
    theme: 'opportunity',
  }
];

export function getRandomQuote(): Quote {
  const index = Math.floor(Math.random() * ORIGINAL_QUOTES.length);
  return ORIGINAL_QUOTES[index];
}
