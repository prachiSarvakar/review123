"use client";

export const getUniqueValues = (arr: Record<string, any>[], uniqueRefKey: string) => {
  const uniqueItems: Record<string, any>[] = [];
  let uniqueKeys: Record<string, any> = {};
  arr.forEach((obj: Record<string, any>) => {
    if (uniqueKeys[obj[uniqueRefKey]]) {
    } else {
      uniqueKeys = {
        ...uniqueKeys,
        [obj[uniqueRefKey]]: 1,
      };
      uniqueItems.push(obj);
    }
  });
  return uniqueItems;
};
