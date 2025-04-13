export interface Word {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  example: {
    arabic: string;
    translation: string;
  };
  notes?: string;
  morphology?: string;
  root?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  words: Word[];
  challenges: Challenge[];
  practicePhrase?: string;
  culturalNote?: string;
}

export interface Challenge {
  id: string;
  type: 'multiple-choice' | 'sentence-translation' | 'fill-in-blank' | 'audio-recognition';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  sentence?: {
    arabic: string;
    translation: string;
    words: string[];
  };
  audioUrl?: string;
}

export interface Level {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  xpRequired: number;
  lessons: Lesson[];
  thematicVerse?: {
    arabic: string;
    translation: string;
    reference: string;
  };
}

const levelsData: Level[] = [
  {
    id: 'level-1',
    name: 'Power Words',
    description: 'Spiritually rich, high-frequency words',
    emoji: '🟢',
    color: 'level-1',
    xpRequired: 0,
    thematicVerse: {
      arabic: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ',
      translation: 'In the name of Allah, the Most Gracious, the Most Merciful',
      reference: 'Opening of most chapters of the Quran'
    },
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'Divine Names',
        description: 'Learn the most powerful words in the Qur\'an',
        xpReward: 20,
        practicePhrase: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ',
        culturalNote: 'Muslims begin almost every action with Bismillah, invoking God\'s name.',
        words: [
          {
            id: 'word-1-1-1',
            arabic: 'اللّٰه',
            transliteration: 'Allāh',
            meaning: 'God',
            root: 'أ ل ه',
            notes: 'The proper name of God in Islam, referring to the One true deity.',
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
            root: 'ر ح م',
            notes: 'Connotes tenderness, compassion, and forgiveness.',
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
            root: 'ن و ر',
            notes: 'In Islamic spirituality, light symbolizes divine guidance and illumination.',
            example: {
              arabic: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ',
              translation: 'Allah is the Light of the heavens and the earth'
            }
          },
          {
            id: 'word-1-1-4',
            arabic: 'هُدَى',
            transliteration: 'Hudā',
            meaning: 'Guidance',
            root: 'هـ د ي',
            notes: 'Refers to divine guidance that leads to the right path.',
            example: {
              arabic: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِلْمُتَّقِينَ',
              translation: 'This is the Book, there is no doubt in it, a guidance for the God-conscious'
            }
          },
          {
            id: 'word-1-1-5',
            arabic: 'بَرَكَة',
            transliteration: 'Barakah',
            meaning: 'Blessing',
            root: 'ب ر ك',
            notes: 'Refers to divine favor that brings increase, prosperity and happiness.',
            example: {
              arabic: 'وَجَعَلَنِي مُبَارَكًا أَيْنَ مَا كُنْتُ',
              translation: 'And He has made me blessed wherever I am'
            }
          }
        ],
        challenges: [
          {
            id: 'challenge-1-1-1',
            type: 'multiple-choice',
            question: 'What does اللّٰه mean?',
            options: ['God', 'Light', 'Mercy', 'Prophet'],
            correctAnswer: 'God',
            explanation: 'Allah (اللّٰه) is the Arabic word for God, the one and only deity in Islam.'
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
          },
          {
            id: 'challenge-1-1-3',
            type: 'fill-in-blank',
            question: 'Allah is the _____ of the heavens and the earth.',
            options: ['Light', 'Creator', 'Mercy', 'King'],
            correctAnswer: 'Light',
            explanation: 'This refers to the verse "Allah is the Light of the heavens and the earth" (24:35)'
          },
          {
            id: 'challenge-1-1-4',
            type: 'multiple-choice',
            question: 'Which word means "blessing" in Arabic?',
            options: ['بَرَكَة', 'نُور', 'رَحْمَة', 'هُدَى'],
            correctAnswer: 'بَرَكَة',
            explanation: 'بَرَكَة (Barakah) means blessing or divine favor that brings increase.'
          }
        ]
      },
      {
        id: 'lesson-1-2',
        title: 'Spiritual Concepts',
        description: 'Learn words related to faith and spirituality',
        xpReward: 25,
        practicePhrase: 'الْإِيمَانُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ',
        culturalNote: 'Faith (Iman) in Islam encompasses belief, speech, and action.',
        words: [
          {
            id: 'word-1-2-1',
            arabic: 'جَنّة',
            transliteration: 'Jannah',
            meaning: 'Paradise',
            root: 'ج ن ن',
            notes: 'Literally means "garden." In Islamic theology, it refers to the paradise of the afterlife.',
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
            root: 'أ م ن',
            notes: 'Encompasses belief in Allah, His angels, His books, His messengers, the Last Day, and divine decree.',
            example: {
              arabic: 'وَمَن يُؤْمِن بِاللَّهِ يَهْدِ قَلْبَهُ',
              translation: 'And whoever believes in Allah, He guides his heart'
            }
          },
          {
            id: 'word-1-2-3',
            arabic: 'تَقْوَى',
            transliteration: 'Taqwā',
            meaning: 'God-consciousness',
            root: 'و ق ي',
            notes: 'Often translated as "fear of God" but better understood as heightened God-consciousness that influences one\'s actions.',
            example: {
              arabic: 'إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ',
              translation: 'Indeed, the most noble of you in the sight of Allah is the most righteous of you'
            }
          },
          {
            id: 'word-1-2-4',
            arabic: 'تَوْبَة',
            transliteration: 'Tawbah',
            meaning: 'Repentance',
            root: 'ت و ب',
            notes: 'The act of turning back to Allah after committing a sin, with sincere regret and intention to reform.',
            example: {
              arabic: 'تُوبُوا إِلَى اللَّهِ تَوْبَةً نَصُوحًا',
              translation: 'Turn to Allah in sincere repentance'
            }
          }
        ],
        challenges: [
          {
            id: 'challenge-1-2-1',
            type: 'multiple-choice',
            question: 'What does جَنّة mean?',
            options: ['Paradise', 'Faith', 'Light', 'Mercy'],
            correctAnswer: 'Paradise',
            explanation: 'Jannah (جَنّة) literally means "garden" and refers to paradise in Islamic theology.'
          },
          {
            id: 'challenge-1-2-2',
            type: 'fill-in-blank',
            question: 'The Arabic word for God-consciousness is _____.',
            options: ['إيمان', 'تَقْوَى', 'تَوْبَة', 'جَنّة'],
            correctAnswer: 'تَقْوَى',
            explanation: 'Taqwa (تَقْوَى) means God-consciousness or righteousness.'
          },
          {
            id: 'challenge-1-2-3',
            type: 'sentence-translation',
            question: 'Translate this phrase',
            correctAnswer: 'Turn to Allah in repentance',
            sentence: {
              arabic: 'تُوبُوا إِلَى اللَّهِ',
              translation: 'Turn to Allah in repentance',
              words: ['Turn', 'to', 'Allah', 'in repentance']
            }
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
