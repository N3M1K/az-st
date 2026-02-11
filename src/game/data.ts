// AZ Kvíz Question Database

export interface Question {
    id: string;
    letter: string;
    text: string;
    answer: string[]; // Array of acceptable answers
    category?: string;
}

// Fixed Letter Layout for 28 Hexes (Sequential Numbers)
export const HEX_LETTERS: Record<number, string> = {
    1: '1', 2: '2', 3: '3',
    4: '4', 5: '5', 6: '6',
    7: '7', 8: '8', 9: '9', 10: '10',
    11: '11', 12: '12', 13: '13', 14: '14', 15: '15',
    16: '16', 17: '17', 18: '18', 19: '19', 20: '20', 21: '21',
    22: '22', 23: '23', 24: '24', 25: '25', 26: '26', 27: '27', 28: '28'
};

export const QUESTIONS: Question[] = [
    { id: '1', letter: '1', text: 'Jak se jmenuje hlavní město Řecka?', answer: ['Athény', 'Atény'] },
    { id: '2', letter: '2', text: 'Jaký je chemický symbol pro stříbro?', answer: ['Ag'] },
    { id: '3', letter: '3', text: 'Jak se jmenuje hlavní město Slovenska?', answer: ['Bratislava'] },
    { id: '4', letter: '3', text: 'Měna v Thajsku?', answer: ['Baht'] },
    { id: '5', letter: '4', text: 'Nejznámější český cestovatel (Zikmund a ...)?', answer: ['Hanzelka'] },
    { id: '6', letter: '5', text: 'Řeka v Praze?', answer: ['Vltava'] },
    { id: '7', letter: '6', text: 'Hlavní město Dánska?', answer: ['Kodaň'] },
    { id: '8', letter: '7', text: 'Nejvyšší hora světa?', answer: ['Mount Everest'] },
    { id: '9', letter: '8', text: 'Zakladatel psychoanalýzy?', answer: ['Freud'] },
    { id: '10', letter: '9', text: 'Jednotka hmotnosti?', answer: ['Gram'] },
    { id: '11', letter: '10', text: 'Skladatel Novosvětské symfonie?', answer: ['Dvořák'] },
    { id: '12', letter: '11', text: 'Prvek Cl?', answer: ['Chlor'] },
    { id: '13', letter: '12', text: 'Stát na Apeninském poloostrově?', answer: ['Itálie'] },
    { id: '14', letter: '13', text: 'Ovoce symbol Apple?', answer: ['Jablko'] },
    { id: '15', letter: '14', text: 'Hlavní město Ukrajiny?', answer: ['Kyjev'] },
    { id: '16', letter: '15', text: 'Hlavní město Velké Británie?', answer: ['Londýn'] },
    { id: '17', letter: '16', text: 'Čtvrtá planeta od Slunce?', answer: ['Mars'] },
    { id: '18', letter: '17', text: 'Hlavní město Norska?', answer: ['Oslo'] },
    { id: '19', letter: '18', text: 'Pták symbol moudrosti?', answer: ['Sova'] },
    { id: '20', letter: '19', text: 'Hlavní město ČR?', answer: ['Praha'] },
    { id: '21', letter: '20', text: 'Město filmového festivalu (Karlovy ...)?', answer: ['Vary'] },
    { id: '22', letter: '21', text: 'Řeka v Římě?', answer: ['Tibera'] },
    { id: '23', letter: '22', text: 'Nejbližší hvězda?', answer: ['Slunce'] },
    { id: '24', letter: '23', text: 'Španělské hlavní město?', answer: ['Madrid'] },
    { id: '25', letter: '24', text: 'Hlavní město Japonska?', answer: ['Tokio'] },
    { id: '26', letter: '25', text: 'Sedmá planeta od Slunce?', answer: ['Uran'] },
    { id: '27', letter: '26', text: 'Hlavní město Rakouska?', answer: ['Vídeň'] },
    { id: '28', letter: '27', text: 'Zvíře s pruhy?', answer: ['Zebra'] },
    { id: '29', letter: '28', text: 'Živočich s krunýřem?', answer: ['Želva'] }
];
