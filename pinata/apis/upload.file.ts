import FormData from 'form-data';
import { jwt } from '../pinata.config';
import { createReadStream } from '../fs';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const uploadFileToIPFS = async () => {
  const fileStream = await createReadStream(); // public/input/image.jpg 등

  const formData = new FormData();
  formData.append('file', fileStream);
  formData.append('pinataMetadata', JSON.stringify({
    name: `MyNFT_Image_${uuidv4()}`
  }));

  const response = await axios.post(
    'https://api.pinata.cloud/pinning/pinFileToIPFS',
    formData,
    {
      maxBodyLength: Infinity,
      headers: {
        Authorization: `Bearer ${jwt}`,
        ...formData.getHeaders(),
      },
    }
  );

  const cid = response.data.IpfsHash;
  const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;

  console.log('이미지를 IPFS에 업로드합니다');
  console.log('Image :', gatewayUrl);

  return gatewayUrl;
};
