import FormData from 'form-data';
import { jwt } from '../pinata.config';
import { createReadStream } from '../fs';
import axios from 'axios';
import { uploadFileToIPFS } from './upload.file';

export const uploadMetaData = async () => {
  const imageUrl = await uploadFileToIPFS();

  const metadata = {
    name: 'The Holy Knight Jae', // Todo: 원하는 이름을 넣습니다.
    description: "Born in a poor village, Lee Jae-myung could never tolerate injustice. Enlightened by the Holy Light, he joined the Paladins and chose the path of defending justice. Preferring the power of words over violence, he always stands with the weak against the strong. On his shield is engraved the motto: 'Injustice shall not be tolerated.'",
    image: imageUrl,
    attributes: [
      // attributes는 어떤 속성(trait_type)에 값(value)을 넣을 것인지 자신의 프로젝트에 따라서 재량것 지정합니다.
      { "trait_type": "Class", "value": "Holy Paladin of Justice" },
      { "trait_type": "Origin", "value": "Poor Village" },
      { "trait_type": "Signature Skills", "value": "Judgment of Justice" },
      { "trait_type": "Signature Skills", "value": "Light of the People" },
      { "trait_type": "Signature Skills", "value": "Eyes of Truth" },
      { "trait_type": "Signature Skills", "value": "Shield of the Commoners" },
      { "trait_type": "Catchphrase", "value": "The people are the masters." },
      { "trait_type": "Catchphrase", "value": "Lies collapse before the light." },
      { "trait_type": "Catchphrase", "value": "A paladin does not remain silent." },
      { "trait_type": "Gear", "value": "Sword of the People" },
      { "trait_type": "Gear", "value": "Shield of Justice" },
      { "trait_type": "Gear", "value": "Cloak of Light" }
    ],
  };
  console.log('Metadata : ', metadata);

  const data = JSON.stringify({
    pinataMetadata: {
      name: metadata.name,
    },
    pinataContent: metadata,
  });

  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      data,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const tokenUri = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

    console.log('\n메타데이터를 IPFS에 업로드합니다.');
    console.log('Metadata CID:', response.data.IpfsHash);
    console.log('Token URI:', tokenUri);
    return tokenUri;
  } catch (error: any) {
    console.error(error);
  }
};
