export const convertToNumber = (val: string): number | undefined => {
  const res = +val;
  return isNaN(res) ? undefined : res;
};
