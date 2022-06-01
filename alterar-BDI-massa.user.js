// ==UserScript==
// @name         Alterar BDI em massa
// @namespace    https://app.orcafascio.com/
// @updateURL    https://github.com/cesarep/scripts-orsafascio/raw/main/alterar-BDI-massa.user.js
// @downloadURL  https://github.com/cesarep/scripts-orsafascio/raw/main/alterar-BDI-massa.user.js
// @version      0.4
// @description  Permite modificação em massa dos BDIs no orçamento
// @author       César E. Petersen
// @match        https://app.orcafascio.com/orc/orcamentos/*
// @icon         https://app.orcafascio.com/img/logo4.png
// @run-at document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // cria botão novo
    var btn = document.createElement("button")
    btn.className="btn btn-group btn-info"
    btn.id="modificaBDImassa"
    btn.style="color: #FFFFFF; width: 113px; padding: 15px 0;"
    btn.innerHTML = 'modificar<br><i class="icone-50 flaticon-more21"></i><br><b>BDI</b>'

    // adiciona botao na página
    document.querySelector(".maincontentinner .row-fluid .span6").appendChild(btn)

    // cria botoes para salvar e cancelar
    var btn_s = document.createElement("a")
    btn_s.className = "btn btn-primary"
    btn_s.innerText = "Salvar"

    var btn_c = document.createElement("a")
    btn_c.className = "btn"
    btn_c.innerText = "Cancelar"

    // cria a linha no final com os botoes
    var btn_td = document.createElement("tr")
    btn_td.className = "mudaBDI"
    btn_td.appendChild(document.createElement("td"))
    btn_td.children[0].colSpan=30
    btn_td.children[0].className = "right"
    btn_td.children[0].appendChild(btn_c)
    btn_td.children[0].appendChild(document.createTextNode( '\u00A0' ))
    btn_td.children[0].appendChild(btn_s)


    // funcoes de auxilio copiadas
    var AtivarBarraDeAcaoDeUmItem = function() {
        window.jQuery('.tr_item').mouseover(function() {
            window.jQuery(this).find('.orc_barra_de_acao').fadeIn(0);
        });
        window.jQuery('.tr_item').mouseout(function() {
            window.jQuery(this).find('.orc_barra_de_acao').fadeOut(0);
        });
    };

    var DesativarBarraDeAcao = function() {
        window.jQuery('.orc_barra_de_acao').each(function() {
            window.jQuery(this).fadeOut(0);
        });
        window.jQuery('.tr_item').mouseover(function() {
            window.jQuery(this).find('.orc_barra_de_acao').fadeOut(0);
        });
    };

    var BdiDifirenciado = function(item) {
        if (item.bdi_porcentagem || item.bdi_porcentagem === 0) {
            return "<br>(BDI - " + (window.converteFloatMoeda(item.bdi_porcentagem)) + "%)";
        } else {
            return "";
        }
    };

    // ativar modificação do BDI
    btn.onclick = function() {
        // bloqueia botão, previnindo adicionar mais campos
        btn.disabled = true

        // bloqueia a barra de ações
        DesativarBarraDeAcao()

        /* adiciona campos novos */
        // cabeçario
        document.querySelector("#table_orc_itens thead tr th:nth-child(3)").insertAdjacentHTML("afterEnd","<th class='mudaBDI'>BDI</th>")
        // colunas novas
        document.querySelectorAll("#table_orc_itens tbody tr td:nth-child(3)").forEach(
            (node) => node.insertAdjacentHTML("afterEnd","<td class='mudaBDI'></td>")
        )
        // inputs
        document.querySelectorAll("#table_orc_itens tbody tr:not([classe='etapa']) td:nth-child(4)").forEach(
            (node) => {
                node.innerHTML = "<input type='text' placeholder='BDI (%)' class='input-block-level muda-bdi-item' style='width: 5em;'></input>"
        })

        // inputs ETAPA
        document.querySelectorAll("#table_orc_itens tbody tr[classe='etapa'] td:nth-child(4)").forEach(
            (etapa) => {
                etapa.innerHTML = "<input type='text' placeholder='BDI Etapa (%)' class='input-block-level muda-bdi-etapa' style='width: 7.5em;'></input>"

                let input = etapa.querySelector("input")
                let tr = etapa.parentElement

                // modifica todos os itens dentro da etapa
                input.oninput = function() {
                    window.jQuery("#table_orc_itens tbody tr:not([classe='etapa'])[item^='"+tr.getAttribute("item")+".'] input").val(input.value)
                }
        })


        // preenche inputs com valores preexistentes
        document.querySelectorAll("#table_orc_itens tbody tr:not([classe='etapa']):not([bdi_porcentagem='null']) td:nth-child(4) input").forEach(
            (node) => {node.setAttribute('value', node.parentElement.parentElement.getAttribute('bdi_porcentagem'))}
        )

        /* adiciona botões para salvar ou cancelar */
        document.querySelector("#table_orc_itens tbody").append(btn_td)
    }

    /* cancela a inserção do BDI */
    var fechaBDI = function() {
        // deleta todas as colunas referentes ao BDI
        document.querySelectorAll("#table_orc_itens .mudaBDI").forEach((node) => node.remove())

        // reabilita o botão
        btn.disabled = false

        // rehabilita a barra de ações
        AtivarBarraDeAcaoDeUmItem()

        // apaga a linha de botões
        document.querySelector("#table_orc_itens tr.mudaBDI").remove()
    }

    btn_c.onclick = fechaBDI;

    /* salva as alterações */
    btn_s.onclick = function() {
        var promises = [];
        var itens = [];

        document.querySelectorAll("#table_orc_itens td.mudaBDI input.muda-bdi-item").forEach(
            (node) => {
                // pega a linha
                let tr = node.parentElement.parentElement;

                // prepara o link, diferente para composições e insumos
                var link = "/orc/orcamentos/" + (window.OrcamentoId()) + (tr.getAttribute("classe") == "composicao" ? "/composicoes" : "/insumos") + "/set_bdi" ;

                // define os dados do input
                let dados = {
                    id: tr.getAttribute('id_secundario'),
                    id_principal: tr.getAttribute('id_principal'),
                    externo: true,
                    bdi: node.value
                };

                // pega o bdi atual
                let bdi_atual = tr.getAttribute('bdi_porcentagem')
                if (bdi_atual == "undefined" || bdi_atual == "null"){
                    bdi_atual = "";
                }

                // modifica apenas os BDIs diferentes dos atuais
                if(dados.bdi != bdi_atual){
                    itens.push(tr.getAttribute("item"))
                    promises.push( window.jQuery.post(link, dados, function(data) {
                        if (data.redirect_to) {
                            window.location.replace(data.redirect_to);
                        }
                        tr.setAttribute("pr_unitario", data.pr_unitario);
                        tr.setAttribute("pr_unitario_mais_bdi", data.pr_unitario_mais_bdi);
                        tr.setAttribute("pr_total_sem_bdi", data.pr_total_sem_bdi);
                        tr.setAttribute("pr_total", data.pr_total);
                        tr.setAttribute("bdi_porcentagem", data.bdi_porcentagem);
                        tr.querySelector(".td_pr_unitario").innerHTML = window.converteFloatMoeda(data.pr_unitario);
                        tr.querySelector(".td_pr_unitario_mais_bdi").innerHTML = "" + (window.converteFloatMoeda(window.round2(data.pr_unitario_mais_bdi))) + (BdiDifirenciado(data));
                        tr.querySelector(".td_pr_total").innerHTML = window.converteFloatMoeda(data.pr_total);
                    }))
                }
            })

        console.log(itens)

        Promise.all(promises).catch(erro => {
            console.log(erro.message)
        }).finally(()=>{
            alert("BDIs modificados")
            fechaBDI();
        })

    }

})();