import ListEditor from './ListEditor';

interface StyleTabProps {
  character: any;
  onUpdate: (character: any) => void;
}

const StyleTab = ({ character, onUpdate }: StyleTabProps) => {
  const handleUpdate = (items: string[]) => {
    const updatedCharacter = { ...character };
    updatedCharacter.character.style = items;
    onUpdate(updatedCharacter);
  };

  return (
    <ListEditor
      items={character.character.style}
      section="style"
      helpTitle="Style Guidelines"
      helpContent="Define how your bot should communicate. Include specific instructions about tone, length, and approach to different situations."
      onUpdate={handleUpdate}
    />
  );
};

export default StyleTab; 