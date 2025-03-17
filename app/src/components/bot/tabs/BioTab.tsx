import ListEditor from './ListEditor';

interface BioTabProps {
  character: any;
  onUpdate: (character: any) => void;
}

const BioTab = ({ character, onUpdate }: BioTabProps) => {
  const handleUpdate = (items: string[]) => {
    const updatedCharacter = { ...character };
    updatedCharacter.character.bio = items;
    onUpdate(updatedCharacter);
  };

  return (
    <ListEditor
      items={character.character.bio}
      section="bio"
      helpTitle="Bio Guidelines"
      helpContent="Write engaging, personal stories about your bot's origin and development. Each line should contribute to building your bot's character and personality."
      onUpdate={handleUpdate}
    />
  );
};

export default BioTab; 