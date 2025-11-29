
export const generateScramble = (length = 20): string => {
  const moves = ['R', 'L', 'U', 'D', 'F', 'B'];
  const modifiers = ['', "'", '2'];
  const scramble: string[] = [];
  
  let lastMove = '';
  let secondLastMove = '';

  for (let i = 0; i < length; i++) {
    let move = '';
    
    // Prevent invalid sequences (e.g., R R, or R L R - avoiding redundancy is complex, basic check here)
    do {
      move = moves[Math.floor(Math.random() * moves.length)];
    } while (move === lastMove || (move === secondLastMove && isOpposite(move, lastMove)));

    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    scramble.push(move + modifier);
    
    secondLastMove = lastMove;
    lastMove = move;
  }

  return scramble.join(' ');
};

const isOpposite = (m1: string, m2: string) => {
  const map: Record<string, string> = {
    'R': 'L', 'L': 'R',
    'U': 'D', 'D': 'U',
    'F': 'B', 'B': 'F'
  };
  return map[m1] === m2;
};
