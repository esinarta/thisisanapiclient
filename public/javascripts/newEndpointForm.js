document.addEventListener("DOMContentLoaded", () => {
  const initialJSON = `{\n"key": "value"\n}`;
  const jsonText = document.getElementById('jsonTextArea')

  let original = jsonText.value;
  let obj;
  try {
    obj = JSON.parse(original);
  } catch (err) {
    document.getElementById('formatLabel').innerHTML = "Not a valid JSON string.";
    return;
  }
  let formatted = JSON.stringify(obj, undefined, 4);
  jsonText.value = formatted;

  jsonText.addEventListener('keydown', function(e) {
    if (e.key == 'Tab') {
      e.preventDefault();
      let start = this.selectionStart;
      let end = this.selectionEnd;

      const newValue = this.value.substring(0, start) + "    " + this.value.substring(end);

      this.value = newValue;
      this.selectionStart = this.selectionEnd = start + 4;
    }
  });
});