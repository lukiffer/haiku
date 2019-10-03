export class StorageService {
  getItem(key) {
    const result = window.localStorage.getItem(`haiku:${key}`);
    if (!result) {
      return null;
    }
    return JSON.parse(result);
  }

  setItem(key, value) {
    const item = JSON.stringify(value);
    window.localStorage.setItem(`haiku:${key}`, item);
  }

  removeItem(key) {
    window.localStorage.removeItem(`haiku:${key}`);
  }
}
