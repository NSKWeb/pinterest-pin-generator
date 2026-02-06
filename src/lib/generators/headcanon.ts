interface Headcanon {
  category: string;
  content: string;
}

export function generateHeadcanons(characterName: string, genre: string): Headcanon[] {
  const name = characterName.trim() || "The character";
  const lowerGenre = genre.toLowerCase();

  const headcanons: Headcanon[] = [];

  // Personality traits based on genre
  const personalityTraits: { [key: string]: string[] } = {
    fantasy: [
      `${name} has a secret affinity for ancient magic that even they haven't fully discovered yet.`,
      `${name} carries a small, seemingly ordinary trinket that is actually a powerful artifact in disguise.`,
      `${name} can communicate with a specific type of magical creature that others can't understand.`,
    ],
    scifi: [
      `${name} has cybernetic enhancements they keep hidden from casual observation.`,
      `${name} remembers fragments of a previous life or timeline that no one else recalls.`,
      `${name} has a deep connection to an alien species or artificial intelligence that guides their decisions.`,
    ],
    romance: [
      `${name} has secretly kept every letter, gift, and memento from past relationships in a carefully organized box.`,
      `${name} believes in soulmates but is terrified of actually meeting theirs.`,
      `${name} has a specific ritual or routine they do every morning to feel ready to face the world emotionally.`,
    ],
    mystery: [
      `${name} notices small details others miss because of a past experience that changed their perspective.`,
      `${name} keeps a journal of seemingly random observations that they believe are connected somehow.`,
      `${name} has a personal code or system for organizing information that no one else can decipher.`,
    ],
    adventure: [
      `${name} has a favorite spot they return to after every journey to reconnect with their roots.`,
      `${name} carries a small item from their first adventure as a reminder of why they started exploring.`,
      `${name} has made a promise to themselves that they would rather forget but can never bring themselves to break.`,
    ],
  };

  // Backstory elements
  const backstories: string[] = [
    `As a child, ${name} witnessed an event that shaped their entire worldview and approach to challenges.`,
    `${name} lost someone important to them and has been searching for a way to make peace with that loss.`,
    `${name} was raised in a completely different environment than where they are now, creating unique cultural perspectives.`,
    `${name} discovered their true calling after a chance encounter with a stranger who saw potential in them.`,
    `${name} made a mistake in their past that they've spent years trying to redeem, often overcompensating as a result.`,
  ];

  // Relationship dynamics
  const relationships: string[] = [
    `${name} has a complicated relationship with authority figures, alternating between respecting and challenging them.`,
    `${name} acts as the peacemaker in their friend group but rarely opens up about their own conflicts.`,
    `${name} has a sibling or close relative they're constantly trying (and sometimes failing) to impress or outdo.`,
    `${name} forms intense, loyal friendships quickly but struggles with casual social interactions.`,
    `${name} has a mentor figure they still quote unconsciously in their decision-making process.`,
  ];

  // Special abilities or quirks
  const abilities: string[] = [
    `${name} has an uncanny ability to always know what time it is without checking any clock.`,
    `${name} can remember the exact details of any conversation they've had, even years later.`,
    `${name} has perfect pitch or another extraordinary sensory ability they use unconsciously.`,
    `${name} is surprisingly good at predicting weather changes based on physical sensations.`,
    `${name} can always find their way back to any place they've been to before, regardless of how complex the route.`,
  ];

  // Add personality based on genre
  const personalityOptions = personalityTraits[lowerGenre] || personalityTraits.fantasy;
  headcanons.push({ category: "Personality", content: personalityOptions[Math.floor(Math.random() * personalityOptions.length)] });

  // Add backstory
  headcanons.push({ category: "Backstory", content: backstories[Math.floor(Math.random() * backstories.length)] });

  // Add relationship
  headcanons.push({ category: "Relationships", content: relationships[Math.floor(Math.random() * relationships.length)] });

  // Add ability
  headcanons.push({ category: "Abilities & Quirks", content: abilities[Math.floor(Math.random() * abilities.length)] });

  return headcanons;
}
