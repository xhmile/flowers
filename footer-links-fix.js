/**
 * Переназначаем ссылки в подвале на локальные страницы.
 * Вставьте <script src="footer-links-fix.js"></script> перед закрывающим </body> в index.html
 */
(function(){
  var map = {
    'СОГЛАШЕНИЕ О КОНФИДЕНЦИАЛЬНОСТИ': 'privacy.html',
    'ПУБЛИЧНАЯ ОФЕРТА': 'offer.html'
  };
  var links = document.querySelectorAll('a, [role="link"]');
  links.forEach(function(a){
    var text = (a.textContent || a.innerText || '').trim().toUpperCase();
    if (map[text]) {
      a.setAttribute('href', map[text]);
      a.removeAttribute('target');
      a.addEventListener('click', function(e){
        // убедимся, что переходим по нашему адресу
        a.href = map[text];
      });
    }
  });
})();
