import ListEditor from './ListEditor';

interface LoreTabProps {
  character: any;
  onUpdate: (character: any) => void;
}

const LoreTab = ({ character, onUpdate }: LoreTabProps) => {
  const handleUpdate = (items: string[]) => {
    const updatedCharacter = { ...character };
    updatedCharacter.character.lore = items;
    onUpdate(updatedCharacter);
  };

  return (
    <ListEditor
      items={character.character.lore}
      section="lore"
      helpTitle="Lore Guidelines"
      helpContent="Create mystical and imaginative background stories for your bot. Focus on unique characteristics and special abilities that make your bot interesting."
      onUpdate={handleUpdate}
    />
  );
};

export default LoreTab; 