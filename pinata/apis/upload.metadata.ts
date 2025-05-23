import FormData from 'form-data';
import { jwt } from '../pinata.config';
import { createReadStream } from '../fs';
import axios from 'axios';
import { uploadFileToIPFS } from './upload.file';

export const uploadMetaData = async () => {
  const imageUrl = await uploadFileToIPFS();

  const metadata = {
    name: "Lee the Beastcaller",
    // Todo: 원하는 이름을 넣습니다.
    description: "Master of ancient spirits and beasts, Lee Jae-myung seeks to tame the unleashed chaos of Yoon Seok-ryeol, a mythical beast. With the ability to summon and command through sheer will, he brings justice by restoring balance to a world thrown into disarray.",
    image: imageUrl,
    attributes: [
      // attributes는 어떤 속성(trait_type)에 값(value)을 넣을 것인지 자신의 프로젝트에 따라서 재량것 지정합니다.
      { "trait_type": "Class", "value": "Beastmaster / Political Summoner" },
      { "trait_type": "Title", "value": "Caller of Chaos, Restorer of Order" },

      { "trait_type": "Skill", "value": "Summon Chaos" },
      { "trait_type": "Skill", "value": "Mind Chain" },
      { "trait_type": "Skill", "value": "Leash of the People" },
      { "trait_type": "Skill", "value": "Roar of Truth" },

      { "trait_type": "Gear", "value": "Beast Sigil" },
      { "trait_type": "Gear", "value": "Whip of Order" },
      { "trait_type": "Gear", "value": "Flag of the People’s Will" }
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
