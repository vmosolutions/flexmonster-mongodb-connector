export interface IRegister<Key, Item> {

    addItem(key: Key, item: Item): void | Promise<void>;
    hasItem(key: Key): boolean | Promise<boolean>;
    getItem(key: Key): Item | Promise<Item>;
    deleteItem(key: Key): Item | Promise<Item>;
    isEmpty(): boolean;
}