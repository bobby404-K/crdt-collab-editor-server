import { CRDTItem, ItemID } from './types.js';

export class CRDTDoc {
  private clock = 0;
  private items: CRDTItem[] = [];

  constructor(public clientId: string) {}

  insert(char: string, index: number): CRDTItem {
    this.clock++;
    const id: ItemID = { clientId: this.clientId, clock: this.clock };
    const leftId = index > 0 ? this.items[index - 1].id : null;
    const rightId = index < this.items.length ? this.items[index].id : null;

    const item: CRDTItem = { id, leftId, rightId, char, deleted: false };
    this.items.splice(index, 0, item);
    return item;
  }

  delete(index: number): CRDTItem | null {
    if (index >= 0 && index < this.items.length) {
      this.items[index].deleted = true;
      return this.items[index];
    }
    return null;
  }

  getText(): string {
    return this.items.filter(i => !i.deleted).map(i => i.char).join('');
  }

  integrateRemote(item: CRDTItem): void {
    const exists = this.items.find(i => i.id.clientId === item.id.clientId && i.id.clock === item.id.clock);
    if (exists) return;

    // Simple deterministic insertion ordering based on client ID tie-breaking
    let targetIdx = this.items.length;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].id.clock > item.id.clock || (this.items[i].id.clock === item.id.clock && this.items[i].id.clientId > item.id.clientId)) {
        targetIdx = i;
        break;
      }
    }
    this.items.splice(targetIdx, 0, item);
  }
}
