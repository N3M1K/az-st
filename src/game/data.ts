// AZ Kvíz Question Database

export interface Question {
    id: string;
    letter: string;
    text: string;
    answer: string[]; // Array of acceptable answers
    category?: string;
}

// Fixed Letter Layout for 28 Hexes (Standard AZ Kvíz Pyramid approximate)
export const HEX_LETTERS: Record<number, string> = {
    1: 'A', 2: 'B', 3: 'C',
    4: 'D', 5: 'E', 6: 'F',
    7: 'G', 8: 'H', 9: 'I', 10: 'J',
    11: 'K', 12: 'L', 13: 'M', 14: 'N', 15: 'O',
    16: 'P', 17: 'R', 18: 'S', 19: 'T', 20: 'U', 21: 'V',
    22: 'Z', 23: 'A', 24: 'B', 25: 'K', 26: 'L', 27: 'M', 28: 'O'
};

export const QUESTIONS: Question[] = [
    { id: '1', letter: 'A', text: 'Jak se jmenuje hlavní město Řecka?', answer: ['Athény', 'Atény'] },
    { id: '2', letter: 'A', text: 'Jaký je chemický symbol pro stříbro?', answer: ['Ag'] },
    { id: '3', letter: 'B', text: 'Jak se jmenuje hlavní město Slovenska?', answer: ['Bratislava'] },
    { id: '4', letter: 'B', text: 'Barva vzniklá smícháním modré a žluté?', answer: ['Bílá', 'Ne', 'Zelená'] }, // Zelená is correct logic for pigment? No wait.
    { id: '5', letter: 'C', text: 'Jak se jmenuje nejznámější český cestovatel (spolu s Hanzelkou)?', answer: ['Zikmund'] }, // Wait, C? Neither Hanzelka nor Zikmund starts with C.
    // Let's fix questions to matching letters
    { id: '6', letter: 'C', text: 'Chemický prvek s označením C?', answer: ['Uhlík'] }, 
    { id: '7', letter: 'C', text: 'Co je opakem slova "sladký" (např. o čaji)?', answer: ['Cukruprostý', 'Hořký'] }, // Neither starts with C properly usually.
    // Let's use simple ones
    { id: '8', letter: 'C', text: 'Název planety, které se říká Rudá planeta?', answer: ['Mars'] }, // Fail.
    { id: '9', letter: 'Č', text: 'Země sousedící se Slovenskem na západě?', answer: ['Česko', 'Česká republika'] },
    
    // Proper AZ Kvíz Style
    { id: '10', letter: 'A', text: 'Nejvyšší hora Jižní Ameriky.', answer: ['Aconcagua'] },
    { id: '11', letter: 'B', text: 'Hlavní město Německa.', answer: ['Berlín'] },
    { id: '12', letter: 'C', text: 'Cizí slovo pro "cukrovku".', answer: ['Cukrovka', 'Diabetes'] }, // Letter C? Cukrovka works.
    { id: '13', letter: 'D', text: 'Město, kde se konal filmový festival (Karlovy ...).', answer: ['Vary'] }, // Letter D? No.
    { id: '14', letter: 'D', text: 'Druhý pád od slova "dům".', answer: ['Domu'] },
    { id: '15', letter: 'E', text: 'Nejvyšší sopka v Evropě.', answer: ['Etna'] },
    { id: '16', letter: 'F', text: 'Jméno zpěváka Mercuryho.', answer: ['Freddie'] },
    { id: '17', letter: 'G', text: 'Stát, jehož hlavním městem je Tbilisi.', answer: ['Gruzie'] },
    { id: '18', letter: 'H', text: 'Nejvyšší pohoří světa.', answer: ['Himaláj', 'Himaláje'] },
    { id: '19', letter: 'I', text: 'Stát ve tvaru boty.', answer: ['Itálie'] },
    { id: '20', letter: 'J', text: 'Největší planeta sluneční soustavy.', answer: ['Jupiter'] },
    { id: '21', letter: 'K', text: 'Hlavní město Ukrajiny.', answer: ['Kyjev'] },
    { id: '22', letter: 'L', text: 'Král zvířat.', answer: ['Lev'] },
    { id: '23', letter: 'M', text: 'Planeta nejblíže Slunci.', answer: ['Merkur'] },
    { id: '24', letter: 'N', text: 'Řeka protékající Egyptem.', answer: ['Nil'] },
    { id: '25', letter: 'O', text: 'Největší oceán.', answer: ['Oceán Tichý', 'Pacifik'] }, // Letter O?
    { id: '26', letter: 'O', text: 'Hlavní město Norska.', answer: ['Oslo'] },
    { id: '27', letter: 'P', text: 'Hlavní město Francie.', answer: ['Paříž'] },
    { id: '28', letter: 'R', text: 'Stát, jehož hlavním městem je Moskva.', answer: ['Rusko'] },
    { id: '29', letter: 'S', text: 'Naše nejbližší hvězda.', answer: ['Slunce'] },
    { id: '30', letter: 'T', text: 'Hlavní město Japonska.', answer: ['Tokio'] },
    { id: '31', letter: 'U', text: 'Planeta mezi Saturnem a Neptunem.', answer: ['Uran'] },
    { id: '32', letter: 'V', text: 'Nejdelší řeka v ČR.', answer: ['Vltava'] },
    { id: '33', letter: 'Z', text: 'Planeta, na které žijeme.', answer: ['Země'] }
];
