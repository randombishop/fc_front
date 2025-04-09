import ListEditor from './ListEditor';

interface BioTabProps {
  character: any;
  onUpdate: (character: any) => void;
}

const BioTab = ({ character, onUpdate }: BioTabProps) => {

  const handleUpdate = (items: string[]) => {
    const updatedCharacter = { ...character };
    updatedCharacter.bio = items;
    onUpdate(updatedCharacter);
  };

  return (
    <ListEditor
      items={character.bio}
      section="bio"
      helpTitle="Bio Guidelines"
      helpContent="Write a personal bio for your bot. Write as many lines as possible. A random sample will be used to to build your bot's character each run, generating more diversity in its outputs."
      onUpdate={handleUpdate}
    />
  );

};

export default BioTab; 