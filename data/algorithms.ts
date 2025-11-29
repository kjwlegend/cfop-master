import { Algorithm } from '../types';

// The full 119 CFOP Algorithms
export const algorithms: Algorithm[] = [
  // ==========================================
  // PLL (Permutation of Last Layer) - 21 Algs
  // ==========================================
  { id: 'pll-ua', name: 'Ua Perm', category: 'PLL', notation: "M2 U M U2 M' U M2", description: 'Edges cycle counter-clockwise.' },
  { id: 'pll-ub', name: 'Ub Perm', category: 'PLL', notation: "M2 U' M U2 M' U' M2", description: 'Edges cycle clockwise.' },
  { id: 'pll-z', name: 'Z Perm', category: 'PLL', notation: "M' U M2 U M2 U M' U2 M2", description: 'Swap adjacent edges.' },
  { id: 'pll-h', name: 'H Perm', category: 'PLL', notation: "M2 U M2 U2 M2 U M2", description: 'Swap opposite edges.' },
  { id: 'pll-aa', name: 'Aa Perm', category: 'PLL', notation: "x R' U R' D2 R U' R' D2 R2 x'", description: 'Adjacent corner swap (headlights on back).' },
  { id: 'pll-ab', name: 'Ab Perm', category: 'PLL', notation: "x R2 D2 R U R' D2 R U' R x'", description: 'Adjacent corner swap (headlights on front).' },
  { id: 'pll-e', name: 'E Perm', category: 'PLL', notation: "x' R U' R' D R U R' D' R U R' D R U' R' D' x", description: 'Swap adjacent corners.' },
  { id: 'pll-t', name: 'T Perm', category: 'PLL', notation: "R U R' U' R' F R2 U' R' U' R U R' F'", description: 'Swap two corners and two edges.' },
  { id: 'pll-f', name: 'F Perm', category: 'PLL', notation: "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R", description: 'Swap two corners and two edges.' },
  { id: 'pll-ja', name: 'Ja Perm', category: 'PLL', notation: "R' U L' U2 R U' R' U2 R L", description: 'Adjacent corner swap with bar on left.' },
  { id: 'pll-jb', name: 'Jb Perm', category: 'PLL', notation: "R U R' F' R U R' U' R' F R2 U' R' U'", description: 'Adjacent corner swap with bar on front.' },
  { id: 'pll-ra', name: 'Ra Perm', category: 'PLL', notation: "R U' R' U' R U R D R' U' R D' R' U2 R'", description: 'Headlights on left.' },
  { id: 'pll-rb', name: 'Rb Perm', category: 'PLL', notation: "R2 F R U R U' R' F' R U2 R' U2 R", description: 'Headlights on right.' },
  { id: 'pll-y', name: 'Y Perm', category: 'PLL', notation: "F R U' R' U' R U R' F' R U R' U' R' F R F'", description: 'Diagonal corner swap.' },
  { id: 'pll-v', name: 'V Perm', category: 'PLL', notation: "R' U R' d' R' F' R2 U' R' U R' F R F", description: 'Diagonal corner swap + block.' },
  { id: 'pll-na', name: 'Na Perm', category: 'PLL', notation: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'", description: 'Diagonal corner swap, block on bottom.' },
  { id: 'pll-nb', name: 'Nb Perm', category: 'PLL', notation: "R' U R U' R' F' U' F R U R' F R' F' R U' R", description: 'Diagonal corner swap, block on top.' },
  { id: 'pll-ga', name: 'Ga Perm', category: 'PLL', notation: "R2 U R' U R' U' R U' R2 U' D R' U R D'", description: 'Cycle corners and edges.' },
  { id: 'pll-gb', name: 'Gb Perm', category: 'PLL', notation: "R' U' R U D' R2 U R' U R U' R U' R2 D", description: 'Cycle corners and edges.' },
  { id: 'pll-gc', name: 'Gc Perm', category: 'PLL', notation: "R2 U' R U' R U R' U R2 U D' R U' R' D", description: 'Cycle corners and edges.' },
  { id: 'pll-gd', name: 'Gd Perm', category: 'PLL', notation: "R U R' U' D R2 U' R U' R' U R' U R2 D'", description: 'Cycle corners and edges.' },

  // ==========================================
  // OLL (Orientation of Last Layer) - 57 Algs
  // ==========================================
  // All Edges Oriented (7)
  { id: 'oll-21', name: 'OLL 21 (Cross)', category: 'OLL', notation: "R U2 R' U' R U R' U' R U' R'", description: 'Cross' },
  { id: 'oll-22', name: 'OLL 22 (Pi)', category: 'OLL', notation: "R U2 R2 U' R2 U' R2 U2 R", description: 'Pi Shape' },
  { id: 'oll-23', name: 'OLL 23 (Headlights)', category: 'OLL', notation: "R2 D R' U2 R D' R' U2 R'", description: 'Headlights' },
  { id: 'oll-24', name: 'OLL 24 (Chameleon)', category: 'OLL', notation: "r U R' U' r' F R F'", description: 'Chameleon' },
  { id: 'oll-25', name: 'OLL 25 (Bowtie)', category: 'OLL', notation: "F' r U R' U' r' F R", description: 'Bowtie' },
  { id: 'oll-26', name: 'OLL 26 (Anti-Sune)', category: 'OLL', notation: "R U2 R' U' R U' R'", description: 'Anti-Sune' },
  { id: 'oll-27', name: 'OLL 27 (Sune)', category: 'OLL', notation: "R U R' U R U2 R'", description: 'Sune' },
  // Dot Shapes (8)
  { id: 'oll-1', name: 'OLL 1', category: 'OLL', notation: "R U2 R2 F R F' U2 R' F R F'", description: 'Dot, runways' },
  { id: 'oll-2', name: 'OLL 2', category: 'OLL', notation: "F R U R' U' F' f R U R' U' f'", description: 'Dot, dagger' },
  { id: 'oll-3', name: 'OLL 3', category: 'OLL', notation: "f R U R' U' f' U' F R U R' U' F'", description: 'Dot, antipodal' },
  { id: 'oll-4', name: 'OLL 4', category: 'OLL', notation: "f R U R' U' f' U F R U R' U' F'", description: 'Dot, messy' },
  { id: 'oll-17', name: 'OLL 17', category: 'OLL', notation: "R U R' U R' F R F' U2 R' F R F'", description: 'Dot, slash' },
  { id: 'oll-18', name: 'OLL 18', category: 'OLL', notation: "r U R' U R U2 r2 U' R U' R' U2 r", description: 'Dot, crown' },
  { id: 'oll-19', name: 'OLL 19', category: 'OLL', notation: "r' R U R U R' U' r R2 F R F'", description: 'Dot, bunny' },
  { id: 'oll-20', name: 'OLL 20', category: 'OLL', notation: "r U R' U' M2 U R U' R' U' M'", description: 'Dot, X' },
  // Square Shapes (2)
  { id: 'oll-5', name: 'OLL 5', category: 'OLL', notation: "r' U2 R U R' U r", description: 'Square Right' },
  { id: 'oll-6', name: 'OLL 6', category: 'OLL', notation: "r U2 R' U' R U' r'", description: 'Square Left' },
  // Lightning Shapes (6)
  { id: 'oll-7', name: 'OLL 7', category: 'OLL', notation: "r U R' U R U2 r'", description: 'Wide Sune' },
  { id: 'oll-8', name: 'OLL 8', category: 'OLL', notation: "r' U' R U' R' U2 r", description: 'Wide Anti-Sune' },
  { id: 'oll-11', name: 'OLL 11', category: 'OLL', notation: "r U R' U R' F R F' R U2 r'", description: 'Lightning' },
  { id: 'oll-12', name: 'OLL 12', category: 'OLL', notation: "M' R' U' R U' R' U2 R U' M", description: 'Lightning' },
  { id: 'oll-39', name: 'OLL 39', category: 'OLL', notation: "L F' L' U' L U F U' L'", description: 'Big Lightning' },
  { id: 'oll-40', name: 'OLL 40', category: 'OLL', notation: "R' F R U R' U' F' U R", description: 'Big Lightning' },
  // Fish Shapes (4)
  { id: 'oll-9', name: 'OLL 9', category: 'OLL', notation: "R U R' U' R' F R2 U R' U' F'", description: 'Kite' },
  { id: 'oll-10', name: 'OLL 10', category: 'OLL', notation: "R U R' U R' F R F' R U2 R'", description: 'Kite' },
  { id: 'oll-35', name: 'OLL 35', category: 'OLL', notation: "R U2 R2 F R F' R U2 R'", description: 'Fish' },
  { id: 'oll-37', name: 'OLL 37', category: 'OLL', notation: "F R U' R' U' R U R' F'", description: 'Fish' },
  // Knight Shapes (4)
  { id: 'oll-13', name: 'OLL 13', category: 'OLL', notation: "F U R U' R2 F' R U R U' R'", description: 'Knight' },
  { id: 'oll-14', name: 'OLL 14', category: 'OLL', notation: "R' F R U R' F' R F U' F'", description: 'Knight' },
  { id: 'oll-15', name: 'OLL 15', category: 'OLL', notation: "l' U' l L' U' L U l' U l", description: 'Knight' },
  { id: 'oll-16', name: 'OLL 16', category: 'OLL', notation: "r U r' R U R' U' r U' r'", description: 'Knight' },
  // Awkward Shapes (4)
  { id: 'oll-29', name: 'OLL 29', category: 'OLL', notation: "R U R' U' R U' R' F' U' F R U R'", description: 'Awkward' },
  { id: 'oll-30', name: 'OLL 30', category: 'OLL', notation: "F U R U2 R' U' R U R' F'", description: 'Awkward' },
  { id: 'oll-41', name: 'OLL 41', category: 'OLL', notation: "R U R' U R U2 R' F R U R' U' F'", description: 'Awkward' },
  { id: 'oll-42', name: 'OLL 42', category: 'OLL', notation: "R' U' R U' R' U2 R F R U R' U' F'", description: 'Awkward' },
  // L Shapes (6)
  { id: 'oll-47', name: 'OLL 47', category: 'OLL', notation: "F' L' U' L U L' U' L U F", description: 'L Shape' },
  { id: 'oll-48', name: 'OLL 48', category: 'OLL', notation: "F R U R' U' R U R' U' F'", description: 'L Shape' },
  { id: 'oll-49', name: 'OLL 49', category: 'OLL', notation: "r U' r2 U r2 U r2 U' r", description: 'L Shape' },
  { id: 'oll-50', name: 'OLL 50', category: 'OLL', notation: "r' U r2 U' r2 U' r2 U r'", description: 'L Shape' },
  { id: 'oll-53', name: 'OLL 53', category: 'OLL', notation: "l' U2 L U L' U' L U L' U l", description: 'L Shape' },
  { id: 'oll-54', name: 'OLL 54', category: 'OLL', notation: "r U2 R' U' R U R' U' R U' r'", description: 'L Shape' },
  // P Shapes (4)
  { id: 'oll-31', name: 'OLL 31', category: 'OLL', notation: "R' U' F U R U' R' F' R", description: 'P Shape' },
  { id: 'oll-32', name: 'OLL 32', category: 'OLL', notation: "L U F' U' L' U L F L'", description: 'P Shape' },
  { id: 'oll-43', name: 'OLL 43', category: 'OLL', notation: "f' L' U' L U f", description: 'P Shape' },
  { id: 'oll-44', name: 'OLL 44', category: 'OLL', notation: "f R U R' U' f'", description: 'P Shape' },
  // T Shapes (2)
  { id: 'oll-33', name: 'OLL 33', category: 'OLL', notation: "R U R' U' R' F R F'", description: 'T Shape' },
  { id: 'oll-45', name: 'OLL 45', category: 'OLL', notation: "F R U R' U' F'", description: 'T Shape' },
  // C Shapes (2)
  { id: 'oll-34', name: 'OLL 34', category: 'OLL', notation: "R U R2 U' R' F R U R U' F'", description: 'C Shape' },
  { id: 'oll-46', name: 'OLL 46', category: 'OLL', notation: "R' U' R' F R F' U R", description: 'C Shape' },
  // W Shapes (2)
  { id: 'oll-36', name: 'OLL 36', category: 'OLL', notation: "L' U' L U' L' U L U L F' L' F", description: 'W Shape' },
  { id: 'oll-38', name: 'OLL 38', category: 'OLL', notation: "R U R' U R U' R' U' R' F R F'", description: 'W Shape' },
  // I Shapes (4)
  { id: 'oll-51', name: 'OLL 51', category: 'OLL', notation: "f R U R' U' R U R' U' f'", description: 'I Shape' },
  { id: 'oll-52', name: 'OLL 52', category: 'OLL', notation: "R U R' U R U' B U' B' R'", description: 'I Shape' },
  { id: 'oll-55', name: 'OLL 55', category: 'OLL', notation: "R U2 R2 U' R U' R' U2 F R F'", description: 'I Shape' },
  { id: 'oll-56', name: 'OLL 56', category: 'OLL', notation: "F R U R' U' R F' r U R' U' r'", description: 'I Shape' },
  // Corners Correct (2)
  { id: 'oll-28', name: 'OLL 28', category: 'OLL', notation: "r U R' U' r' R U R' U' R U R' U' M' U R U' r'", description: 'Stealth' },
  { id: 'oll-57', name: 'OLL 57', category: 'OLL', notation: "R U R' U' M' U R U' r'", description: 'H-OLL' },

  // ==========================================
  // F2L (First 2 Layers) - 41 Basic Algs
  // ==========================================
  // Group 1: Basic Inserts
  { id: 'f2l-1', name: 'F2L 1', category: 'F2L', notation: "U R U' R'", description: 'Basic Insert' },
  { id: 'f2l-2', name: 'F2L 2', category: 'F2L', notation: "U' F' U F", description: 'Basic Insert' },
  { id: 'f2l-3', name: 'F2L 3', category: 'F2L', notation: "U' R U R' U R U R'", description: 'Insert back' },
  { id: 'f2l-4', name: 'F2L 4', category: 'F2L', notation: "U F' U' F U' F' U' F", description: 'Insert back' },
  // Group 2: Split Pairs (Corner top, Edge top)
  { id: 'f2l-5', name: 'F2L 5', category: 'F2L', notation: "U' R U R' U2 R U' R'", description: 'Reposition' },
  { id: 'f2l-6', name: 'F2L 6', category: 'F2L', notation: "U F' U' F U2 F' U F", description: 'Reposition' },
  { id: 'f2l-7', name: 'F2L 7', category: 'F2L', notation: "U' R U2 R' U2 R U' R'", description: 'Setup to insert' },
  { id: 'f2l-8', name: 'F2L 8', category: 'F2L', notation: "R U2 R' U' F' U' F", description: 'Setup to insert' },
  { id: 'f2l-9', name: 'F2L 9', category: 'F2L', notation: "U R U' R' U' F' U F", description: 'Setup to insert' },
  { id: 'f2l-10', name: 'F2L 10', category: 'F2L', notation: "U2 R U R' U R U' R'", description: 'Setup to insert' },
  { id: 'f2l-11', name: 'F2L 11', category: 'F2L', notation: "U' R U2 R' d R' U' R", description: 'Corner pointing up' },
  { id: 'f2l-12', name: 'F2L 12', category: 'F2L', notation: "d R' U2 R d' R U R'", description: 'Corner pointing up' },
  { id: 'f2l-13', name: 'F2L 13', category: 'F2L', notation: "U' R U R' U F' U' F", description: 'Corner pointing up' },
  { id: 'f2l-14', name: 'F2L 14', category: 'F2L', notation: "U2 R2 U2 R' U' R U' R2", description: 'Corner pointing up' },
  { id: 'f2l-15', name: 'F2L 15', category: 'F2L', notation: "R U' R' U2 F' U' F", description: 'Split pair' },
  { id: 'f2l-16', name: 'F2L 16', category: 'F2L', notation: "F' U F U2 R U R'", description: 'Split pair' },
  // Group 3: Connected Pairs
  { id: 'f2l-17', name: 'F2L 17', category: 'F2L', notation: "R U2 R' U' R U R'", description: 'Connected setup' },
  { id: 'f2l-18', name: 'F2L 18', category: 'F2L', notation: "F' U2 F U F' U' F", description: 'Connected setup' },
  { id: 'f2l-19', name: 'F2L 19', category: 'F2L', notation: "U R U2 R' U R U' R'", description: 'Connected setup' },
  { id: 'f2l-20', name: 'F2L 20', category: 'F2L', notation: "U' F' U2 F U' F' U F", description: 'Connected setup' },
  { id: 'f2l-21', name: 'F2L 21', category: 'F2L', notation: "U2 R U' R' U' F' U F", description: 'Connected setup' },
  { id: 'f2l-22', name: 'F2L 22', category: 'F2L', notation: "U2 F' U F U R U' R'", description: 'Connected setup' },
  // Group 4: Corner in D, Edge in U
  { id: 'f2l-23', name: 'F2L 23', category: 'F2L', notation: "U R U' R' U' R U R'", description: 'Corner in slot' },
  { id: 'f2l-24', name: 'F2L 24', category: 'F2L', notation: "U' F' U F U F' U' F", description: 'Corner in slot' },
  { id: 'f2l-25', name: 'F2L 25', category: 'F2L', notation: "U R U' R' d R' U R", description: 'Corner in slot' },
  { id: 'f2l-26', name: 'F2L 26', category: 'F2L', notation: "U' R U' R' U R U R'", description: 'Corner in slot' },
  { id: 'f2l-27', name: 'F2L 27', category: 'F2L', notation: "R U' R' U R U' R'", description: 'Corner in slot' },
  { id: 'f2l-28', name: 'F2L 28', category: 'F2L', notation: "R U R' U' F' U F", description: 'Corner in slot' },
  // Group 5: Edge in Middle
  { id: 'f2l-29', name: 'F2L 29', category: 'F2L', notation: "d R' U' R d' R U R'", description: 'Edge stuck' },
  { id: 'f2l-30', name: 'F2L 30', category: 'F2L', notation: "U R U' R' U R U' R' U R U' R'", description: 'Edge stuck' },
  { id: 'f2l-31', name: 'F2L 31', category: 'F2L', notation: "U' R U' R' d R' U R", description: 'Edge stuck' },
  { id: 'f2l-32', name: 'F2L 32', category: 'F2L', notation: "R U R' U' R U R' U' R U R'", description: 'Edge stuck' },
  { id: 'f2l-33', name: 'F2L 33', category: 'F2L', notation: "U F' U F U' F' U' F", description: 'Edge stuck' },
  { id: 'f2l-34', name: 'F2L 34', category: 'F2L', notation: "U R U R' U' R U R'", description: 'Edge stuck' },
  { id: 'f2l-35', name: 'F2L 35', category: 'F2L', notation: "U F' U' F d' F R' F' R", description: 'Edge stuck' },
  { id: 'f2l-36', name: 'F2L 36', category: 'F2L', notation: "d R' U2 R d' R U R'", description: 'Edge stuck' },
  // Group 6: Corner and Edge in Slot
  { id: 'f2l-37', name: 'F2L 37', category: 'F2L', notation: "R U' R' d R' U2 R U2 R' U R", description: 'Both in slot wrong' },
  { id: 'f2l-38', name: 'F2L 38', category: 'F2L', notation: "R U' R' U' R U R' U2 R U' R'", description: 'Both in slot wrong' },
  { id: 'f2l-39', name: 'F2L 39', category: 'F2L', notation: "R U R' U2 R U' R' U R U R'", description: 'Both in slot wrong' },
  { id: 'f2l-40', name: 'F2L 40', category: 'F2L', notation: "R U2 R' U R U2 R' U F' U' F", description: 'Both in slot wrong' },
  { id: 'f2l-41', name: 'F2L 41', category: 'F2L', notation: "R U R' U' R U' R' U2 R U' R'", description: 'Both in slot wrong' },
];

export const parseNotation = (notation: string): string[] => {
  // Clean string: Remove parens, handle spaces
  const clean = notation.replace(/[()]/g, '').trim();
  return clean.split(/\s+/).filter(Boolean);
};