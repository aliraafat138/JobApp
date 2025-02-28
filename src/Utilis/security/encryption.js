import CryptoJs from "crypto-js";

export const generateEncryption = ({
  plainText = "",
  signature = process.env.ENCRYPTION_SIGNATURE,
} = {}) => {
  const encrypt = CryptoJs.AES.encrypt(plainText, signature).toString();
  return encrypt;
};

export const generateDecryption = ({
  cypherText = "",
  signature = process.env.ENCRYPTION_SIGNATURE,
} = {}) => {
  const decrypt = CryptoJs.AES.decrypt(cypherText, signature).toString(
    CryptoJs.enc.Utf8
  );
  return decrypt;
};
