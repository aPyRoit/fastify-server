document.getElementById('apiButton').addEventListener('click', () => {
  fetch('/api')
    .then(res => res.text())
    .then(data => document.getElementById('result').innerText = data)
})
