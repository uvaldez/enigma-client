
export function generatePassprahse() {
  return Math.random().toString(36).slice(-8);
}

export function copyToClipboard(className) {
  const passphraseLink = document.querySelector(className);
  const range = document.createRange();
  range.selectNode(passphraseLink);
  window.getSelection().addRange(range);
  return document.execCommand('copy');
}
