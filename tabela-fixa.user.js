// ==UserScript==
// @name         Tabelas fixas
// @namespace    https://app.orcafascio.com/
// @updateURL    https://github.com/cesarep/scripts-orsafascio/raw/main/tabela-fixa.user.js
// @downloadURL  https://github.com/cesarep/scripts-orsafascio/raw/main/tabela-fixa.user.js
// @version      0.1
// @description  Fixa o cabeçalho da tabela no topo da página
// @author       César E. Petersen
// @match        https://app.orcafascio.com/orc/orcamentos/*
// @icon         https://app.orcafascio.com/img/logo4.png
// @grant    GM_addStyle
// ==/UserScript==

GM_addStyle ( `
    .table thead tr:not(#th) {
        position: sticky;
        top: 110px;
    }
` );