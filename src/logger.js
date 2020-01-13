const loggerEl = document.querySelector('.logger');
module.exports.error = function(message, error) {
  loggerEl.innerHTML += `<pre class="error">${message}</pre>`;
  if (!error) {
    return;
  }

  loggerEl.innerHTML += `<pre class="error">${error.message}</pre>`;
  loggerEl.innerHTML += `<pre class="error">${error.stack}</pre>`;
};

module.exports.log = function(message) {
  loggerEl.innerHTML += `<pre class="log">${message}</pre>`;
};
