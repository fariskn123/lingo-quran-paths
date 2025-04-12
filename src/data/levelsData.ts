
export interface Word {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  example: {
    arabic: string;
    translation: string;
  };
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  words: Word[];
  challenges: Challenge[];
}

export interface Challenge {
  id: string;
  type: 'multiple-choice' | 'sentence-translation';
  question: string;
  options?: string[];
  correctAnswer: string;
  sentence?: {
    arabic: string;
    translation: string;
    words: string[];
  };
}

export interface Level {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  xpRequired: number;
  lessons: Lesson[];
}

const levelsData: Level[] = [
  {
    id: 'level-1',
    name: 'Power Words',
    description: 'Spiritually rich, high-frequency words',
    emoji: '🟢',
    color: 'level-1',
    xpRequired: 0,
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'Divine Names',
        description: 'Learn the most powerful words in the Qur\'an',
        xpReward: 20,
        words: [
          {
            id: 'word-1-1-1',
            arabic: 'اللّٰه',
            transliteration: 'Allāh',
            meaning: 'God',
            example: {
              arabic: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ',
              translation: 'In the name of Allah, the Most Gracious, the Most Merciful'
            }
          },
          {
            id: 'word-1-1-2',
            arabic: 'رَحْمَة',
            transliteration: 'Raḥmah',
            meaning: 'Mercy',
            example: {
              arabic: 'وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِلْعَالَمِينَ',
              translation: 'And We have not sent you except as a mercy to the worlds'
            }
          },
          {
            id: 'word-1-1-3',
            arabic: 'نُور',
            transliteration: 'Nūr',
            meaning: 'Light',
            example: {
              arabic: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ',
              translation: 'Allah is the Light of the heavens and the earth'
            }
          }
        ],
        challenges: [
          {
            id: 'challenge-1-1-1',
            type: 'multiple-choice',
            question: 'What does اللّٰه mean?',
            options: ['God', 'Light', 'Mercy', 'Prophet'],
            correctAnswer: 'God'
          },
          {
            id: 'challenge-1-1-2',
            type: 'sentence-translation',
            question: 'Translate the following sentence',
            correctAnswer: 'In the name of Allah',
            sentence: {
              arabic: 'بِسْمِ اللّٰهِ',
              translation: 'In the name of Allah',
              words: ['In', 'the name', 'of', 'Allah']
            }
          }
        ]
      },
      {
        id: 'lesson-1-2',
        title: 'Spiritual Concepts',
        description: 'Learn words related to faith and spirituality',
        xpReward: 25,
        words: [
          {
            id: 'word-1-2-1',
            arabic: 'جَنّة',
            transliteration: 'Jannah',
            meaning: 'Paradise',
            example: {
              arabic: 'إِنَّ الْمُتَّقِينَ فِي جَنَّاتٍ وَنَهَرٍ',
              translation: 'Indeed, the righteous will be among gardens and rivers'
            }
          },
          {
            id: 'word-1-2-2',
            arabic: 'إيمان',
            transliteration: 'Īmān',
            meaning: 'Faith',
            example: {
              arabic: 'وَمَن يُؤْمِن بِاللَّهِ يَهْدِ قَلْبَهُ',
              translation: 'And whoever believes in Allah, He guides his heart'
            }
          }
        ],
        challenges: [
          {
            id: 'challenge-1-2-1',
            type: 'multiple-choice',
            question: 'What does جَنّة mean?',
            options: ['Paradise', 'Faith', 'Light', 'Mercy'],
            correctAnswer: 'Paradise'
          }
        ]
      }
    ]
  },
  {
    id: 'level-2',
    name: 'Stories',
    description: 'Narrative words from Qur\'anic stories',
    emoji: '🟡',
    color: 'level-2',
    xpRequired: 50,
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'Prophetic Tales',
        description: 'Learn key words from stories of the Prophets',
        xpReward: 30,
        words: [
          {
            id: 'word-2-1-1',
            arabic: 'قَالَ',
            transliteration: 'Qāla',
            meaning: 'He said',
            example: {
              arabic: 'قَالَ مُوسَىٰ لِقَوْمِهِ',
              translation: 'Moses said to his people'
            }
          },
          {
            id: 'word-2-1-2',
            arabic: 'رَسُول',
            transliteration: 'Rasūl',
            meaning: 'Messenger',
            example: {
              arabic: 'مُحَمَّدٌ رَسُولُ اللَّهِ',
              translation: 'Muhammad is the Messenger of Allah'
            }
          }
        ],
        challenges: [
          {
            id: 'challenge-2-1-1',
            type: 'multiple-choice',
            question: 'What does رَسُول mean?',
            options: ['Messenger', 'He said', 'River', 'Book'],
            correctAnswer: 'Messenger'
          }
        ]
      }
    ]
  },
  {
    id: 'level-3',
    name: 'Judgment Day',
    description: 'Words of afterlife and accountability',
    emoji: '🟠',
    color: 'level-3',
    xpRequired: 100,
    lessons: [
      {
        id: 'lesson-3-1',
        title: 'The Last Day',
        description: 'Learn key terms about the Day of Judgment',
        xpReward: 35,
        words: [
          {
            id: 'word-3-1-1',
            arabic: 'يَوْم',
            transliteration: 'Yawm',
            meaning: 'Day',
            example: {
              arabic: 'يَوْمَ الْقِيَامَةِ',
              translation: 'The Day of Resurrection'
            }
          },
          {
            id: 'word-3-1-2',
            arabic: 'حِسَاب',
            transliteration: 'Ḥisāb',
            meaning: 'Reckoning',
            example: {
              arabic: 'إِنَّ عَلَيْنَا حِسَابَهُم',
              translation: 'Indeed, upon Us is their account'
            }
          }
        ],
        challenges: [
          {
            id: 'challenge-3-1-1',
            type: 'multiple-choice',
            question: 'What does حِسَاب mean?',
            options: ['Reckoning', 'Day', 'Light', 'Book'],
            correctAnswer: 'Reckoning'
          }
        ]
      }
    ]
  },
  {
    id: 'level-4',
    name: 'Prayer & Worship',
    description: 'Words from daily surahs and acts of worship',
    emoji: '🔵',
    color: 'level-4',
    xpRequired: 150,
    lessons: [
      {
        id: 'lesson-4-1',
        title: 'Daily Worship',
        description: 'Learn key terms used in salah and other worship',
        xpReward: 40,
        words: [
          {
            id: 'word-4-1-1',
            arabic: 'صَلَاة',
            transliteration: 'Ṣalāh',
            meaning: 'Prayer',
            example: {
              arabic: 'وَأَقِيمُوا الصَّلَاةَ',
              translation: 'And establish prayer'
            }
          }
        ],
        challenges: [
          {
            id: 'challenge-4-1-1',
            type: 'multiple-choice',
            question: 'What does صَلَاة mean?',
            options: ['Prayer', 'Fasting', 'Charity', 'Pilgrimage'],
            correctAnswer: 'Prayer'
          }
        ]
      }
    ]
  },
  {
    id: 'level-5',
    name: 'Abstract & Legal',
    description: 'Advanced fluency in Qur\'anic concepts',
    emoji: '🟣',
    color: 'level-5',
    xpRequired: 200,
    lessons: [
      {
        id: 'lesson-5-1',
        title: 'Higher Concepts',
        description: 'Master advanced Qur\'anic terminology',
        xpReward: 50,
        words: [
          {
            id: 'word-5-1-1',
            arabic: 'حَلَال',
            transliteration: 'Ḥalāl',
            meaning: 'Permissible',
            example: {
              arabic: 'كُلُوا مِمَّا فِي الْأَرْضِ حَلَالًا طَيِّبًا',
              translation: 'Eat of what is lawful and good on the earth'
            }
          }
        ],
        challenges: [
          {
            id: 'challenge-5-1-1',
            type: 'multiple-choice',
            question: 'What does حَلَال mean?',
            options: ['Permissible', 'Forbidden', 'Doubtful', 'Required'],
            correctAnswer: 'Permissible'
          }
        ]
      }
    ]
  }
];

export default levelsData;
