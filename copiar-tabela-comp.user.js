// ==UserScript==
// @name         Copiar tabela composições
// @namespace    https://app.orcafascio.com/
// @updateURL    https://github.com/cesarep/scripts-orsafascio/raw/main/copiar-tabela-comp.user.js
// @downloadURL  https://github.com/cesarep/scripts-orsafascio/raw/main/copiar-tabela-comp.user.js
// @version      0.1
// @description  Adiciona botão nas tabelas de composições para facilmente copia-las para o excel
// @author       César E. Petersen
// @match        https://app.orcafascio.com/banco/*/composicoes/*
// @match        https://app.orcafascio.com/orc/orcamentos/*/composicoes/*
// @icon         https://app.orcafascio.com/img/logo4.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // adicionar botões nas tabelas
    document.querySelectorAll(".maincontent table[class='table'] tr th:first-child").forEach(th => {
        // cria botao
        let btn = document.createElement("a")
        btn.className = "flaticon-copy13";
        btn.style = "color: white";
        btn.href= "#";
        // define evento clique
        btn.onclick = (e) => {
            e.preventDefault()

            // copia com estilo
            let range = document.createRange();
            range.selectNode(th.parentNode.parentNode.parentNode);
            document.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand('copy');

            //navigator.clipboard.writeText()
        }

        th.appendChild(btn)
    })

})();
