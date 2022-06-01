// ==UserScript==
// @name         Título Informativo Composições
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Modifica o título da aba do navegador para um mais informativo
// @author       César E. Petersen
// @match        https://app.orcafascio.com/*/composicoes/*
// @icon         https://app.orcafascio.com/img/logo4.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let desc = document.querySelector(".widgettitle").innerText;
    let cod = document.querySelector(".flaticon-airplane49")?.innerText || document.querySelector(".pagetitle h1").innerText

     document.querySelector("title").text = cod + " - " + desc
})();