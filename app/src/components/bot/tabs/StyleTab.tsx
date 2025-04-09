import ListEditor from './ListEditor';

interface StyleTabProps {
  character: any;
  onUpdate: (character: any) => void;
}

const StyleTab = ({ character, onUpdate }: StyleTabProps) => {
  const handleUpdate = (items: string[]) => {
    const updatedCharacter = { ...character };
    updatedCharacter.style = items;
    onUpdate(updatedCharacter);
  };

  return (
    <ListEditor
      items={character.style}
      section="style"
      helpTitle="Style Guidelines"
      helpContent="Define how your bot should communicate. Include specific instructions about tone, length, and approach to different situations. For example, keep it short, never use hashtags, be kind, etc."
      onUpdate={handleUpdate}
    />
  );
};

export default StyleTab; 