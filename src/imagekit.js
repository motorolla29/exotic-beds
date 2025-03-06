import ImageKit from 'imagekit-javascript';

const imagekit = new ImageKit({
  publicKey: process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: 'https://ik.imagekit.io/motorolla29/',
});

export default imagekit;
