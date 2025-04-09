import ListEditor from './ListEditor';

interface LoreTabProps {
  character: any;
  onUpdate: (character: any) => void;
}

const LoreTab = ({ character, onUpdate }: LoreTabProps) => {
  const handleUpdate = (items: string[]) => {
    const updatedCharacter = { ...character };
    updatedCharacter.lore = items;
    onUpdate(updatedCharacter);
  };

  return (
    <ListEditor
      items={character.lore}
      section="lore"
      helpTitle="Lore Guidelines"
      helpContent="List as many background stories about your bot."
      onUpdate={handleUpdate}
    />
  );
};

export default LoreTab; 