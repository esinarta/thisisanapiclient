document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('jsonTextArea').value = 
  `{\n    "key": "value"\n}`;
});

function formatJSON() {
  let original = document.getElementById('jsonTextArea').value;
  let obj;
  try {
    obj = JSON.parse(original);
  } catch (err) {
    document.getElementById('formatLabel').innerHTML = "Not a valid JSON string.";
    return;
  }
  let formatted = JSON.stringify(obj, undefined, 4);
  document.getElementById('jsonTextArea').value = formatted;
}

document.getElementById('jsonTextArea').addEventListener('keydown', function(e) {
  if (e.key == 'Tab') {
    e.preventDefault();
    let start = this.selectionStart;
    let end = this.selectionEnd;

    this.value = this.value.substring(0, start) + "    " + this.value.substring(end);

    this.selectionStart = this.selectionEnd = start + 4;
  }
});