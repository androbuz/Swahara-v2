import * as crypto from 'crypto';

export const PatientIdGenerator = () => {
  const numbers = '0123456789';

  const getRandomPatientChar = (charset: string) =>
    charset[Math.floor(crypto.randomInt(0, charset.length))];

  const randomPatientId = Array.from({ length: 6 }, () =>
    getRandomPatientChar(numbers),
  ).join('');

  return `DHS-${randomPatientId}-MD`;
};
