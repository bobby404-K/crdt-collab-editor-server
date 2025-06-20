export interface ItemID {
  clientId: string;
  clock: number;
}

export interface CRDTItem {
  id: ItemID;
  leftId: ItemID | null;
  rightId: ItemID | null;
  char: string;
  deleted: boolean;
}
