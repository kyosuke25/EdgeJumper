'use strict';
(function () {
    var stage = document.getElementById('enchant-stage');
    var scale = Math.min(1.3, (window.innerWidth - 26) / 320, Math.max(250, window.innerHeight - 64) / 480);
    stage.style.width = Math.floor(320 * scale) + 'px';
    stage.style.height = Math.floor(480 * scale) + 'px';
    window.addEventListener('keydown', function (event) {
        if (!['Space', 'Enter'].includes(event.code) || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
        if (game && game.currentScene && typeof game.currentScene.primaryAction === 'function') {
            event.preventDefault();
            game.currentScene.primaryAction();
        }
    }, true);
    function align() {
        if (!game) return;
        var rect = stage.getBoundingClientRect();
        game._pageX = Math.round(window.scrollX + rect.left);
        game._pageY = Math.round(window.scrollY + rect.top);
    }
    window.addEventListener('resize', align);
    window.addEventListener('scroll', align);
    var timer = setTimeout(function () {
        document.getElementById('load-status').hidden = false;
    }, 8500);
    gameStart((navigator.language || '').toLowerCase().startsWith('ja') ? 'ja_JP' : 'en_US');
    game.addEventListener('load', function () {
        clearTimeout(timer);
        document.getElementById('load-status').hidden = true;
        align();
    });
})();
