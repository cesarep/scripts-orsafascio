// ==UserScript==
// @name         Substituições de Composições
// @namespace    https://app.orcafascio.com/
// @updateURL    https://github.com/cesarep/scripts-orsafascio/raw/main/subst-comp.user.js
// @downloadURL  https://github.com/cesarep/scripts-orsafascio/raw/main/subst-comp.user.js
// @version      0.1
// @description  Adiciona botões para salvar opções de substituição de composições, e aplicar diversas de uma só vez
// @author       César E. Petersen
// @match        https://app.orcafascio.com/orc/orcamentos/*/composicoes
// @icon         https://app.orcafascio.com/img/logo4.png
// ==/UserScript==


(function() {
    'use strict';

    // Modais de substituicao
    document.querySelectorAll('div[id^=substituir]').forEach(m => {
        // cria botão para salvar substituição
        let b = document.createElement('button')
        b.type="button"
        b.disabled=true
        b.className = "btn btn-info";
        b.innerHTML = "<i class='flaticon-save29'></i>   Salvar Substitução"
        m.querySelector('.modal-footer').prepend(b)

        // escutar formulário para liberar botão
        m.querySelector('form').addEventListener('DOMNodeInserted', e => {
            // libera botão
            if(e.target.id=="id_do_item") b.disabled = false;
        })

        // linha da composicao
        let linha_c = document.querySelector("a[href='#" + m.id + "']").parentElement.parentElement
        // codigo
        let cod_c = linha_c.getAttribute('cod')
        // banco
        let banco = linha_c.children[1].innerText

        // salvar substituição no armazenamento local
        b.addEventListener('click', e => salva_subst(linha_c.getAttribute('cod'), banco, m.querySelector('form').elements, b))
    })

    // Incluir tabela de substituições salvas
    let t = document.createElement('table')
    t.className='table table-hover'
    t.innerHTML = `<thead>
    <tr>
      <th colspan=6 class='center'>Lista de Substituições Salvas</th>
    </tr>
    <tr>
      <th></th>
      <th>Código</th>
      <th>Descrição</th>
      <th colspan=2>Substituto</th>
      <th></th>
    </tr>
    </thead>`

    let tabela = JSON.parse(localStorage.substComp ?? '{}')

    unsafeWindow.remove_subst = remove_subst;

    let lin_html = ""

    for (const [key, value] of Object.entries(tabela)) {
        if(document.querySelector("tr[cod='"+value.cod_comp+"']")){
            let is_ins = value.classe_do_item == 'insumo'
             lin_html += `<tr class='${is_ins ? 'warning' : 'success'}'>
              <td><input type='checkbox' checked value='${key}' class='subst-comp-chk'></td>
              <td>${value.cod_comp}/${value.banco_comp}</td>
              <td>${document.querySelector("tr[cod='"+value.cod_comp+"']")?.children[2].innerText ?? "Não utilizada nesse orçamento"}</td>
              <td><i class="${is_ins ? 'flaticon-bricks9' : 'flaticon-bricks3'} icone-18"></i></td>
              <td><b>${value.banco_do_item}/${value.input_codigo}</b> - ${value.descricao}</td>
              <td><a href="#" onclick="remove_subst('${key}')"><i class='flaticon-garbage1'></i></a></td>
            </tr>`
        }
    }
    t.innerHTML += lin_html + `<tfoot><tr><td colspan=3 class='center'></td><td colspan=3 class='center'></td></tr></tfoot>`

    document.querySelector('.maincontentinner').prepend(t)

    // botoes para backup da lista
    let bkp_b = document.createElement('a')
    bkp_b.className = "btn"
    bkp_b.innerHTML = "<i class='flaticon-save29'></i> Backup da lista"
    bkp_b.download = "substituicoes_comps.json"
    bkp_b.addEventListener('click', e => {
        let blob = new Blob([localStorage.substComp], {type: 'application/json'});
        bkp_b.href = window.URL.createObjectURL(blob)
    })
    t.querySelector('tfoot td').append(bkp_b)

    let bkp_imp = document.createElement('input')
    bkp_imp.type="file"
    bkp_imp.addEventListener('input', e => {
        e.target.files[0].text().then(t => {
            let tabela = JSON.parse(localStorage.substComp ?? '{}')
            let tabela_imp = JSON.parse(t)
            Object.assign(tabela, tabela_imp);
            localStorage.substComp = JSON.stringify(tabela)
            alert('Substituições importadas')
            location.reload()
        })
    })
    t.querySelector('tfoot td').append(bkp_imp)

    // botões para aplicar substituições
    let btn_subst = document.createElement('button')
    btn_subst.className = "btn btn-primary"
    btn_subst.innerHTML = `<i class='flaticon-exchange1'></i> Aplicar as substituições selecionadas`

    btn_subst.addEventListener('click', e => {
        let token = document.querySelector('meta[name=csrf-token]').content
        let tabela = JSON.parse(localStorage.substComp ?? '{}')

        // pega as chaves das subst selecionadas
        let substs = [...document.querySelectorAll('.subst-comp-chk:checked')].map(c => subst_comp(tabela, c.value, token))

        Promise.all(substs).then(res => {
            location.reload()
        }).catch(err => {
            location.reload()
        })
    })

    t.querySelector('tfoot td:last-child').append(btn_subst)

})();

async function salva_subst(cod, banco, inputs, btn) {
    console.log(inputs)

    let tabela = JSON.parse(localStorage.substComp ?? '{}')

    let desc = await info_item({
        'banco_do_item': inputs.banco_do_item.value,
        'classe_do_item': inputs.classe_do_item.value,
        'input_codigo': inputs.input_codigo.value
    })

    tabela[banco+'-'+cod] = {
        'cod_comp': cod,
        'banco_comp': banco,
        'id_do_item': inputs.id_do_item.value,
        'banco_do_item': inputs.banco_do_item.value,
        'classe_do_item': inputs.classe_do_item.value,
        'input_codigo': inputs.input_codigo.value,
        'descricao': desc[0].descricao,
    }

    localStorage.substComp = JSON.stringify(tabela)

    btn.innerHTML = "Salvo"
    btn.disabled = true
}

function remove_subst(key) {
    let tabela = JSON.parse(localStorage.substComp ?? '{}')
    if(confirm('Tem certeza que deseja remover essa substituição?')){
        delete tabela[key]
        localStorage.substComp = JSON.stringify(tabela)
        document.querySelector(`tr[data-key='${key}']`).remove()
    }
}

async function info_item(item) {
    return await unsafeWindow.jQuery.post('composicoes/autocompletar.json', {
        'field': 'codigo',
        'classe': item.classe_do_item,
        'filtro': item.input_codigo,
        'banco': item.banco_do_item,
    })
}

async function subst_comp(tabela, key, token) {
    let url = document.querySelector(`tr[cod='${tabela[key].cod_comp}'] a`).href + '/update_substituir'

    let data = {
        'utf8': "✓",
        'authenticity_token': token,
        'input_codigo': tabela[key].input_codigo,
        'id_do_item': tabela[key].id_do_item,
        'banco_do_item': tabela[key].banco_do_item,
        'classe_do_item': tabela[key].classe_do_item
    }

    return await fetch(url, {
        method: "POST",
        redirect: 'manual',
        body: JSON.stringify(data),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then(res => {
        console.log('RESPOSTA', res)
    }).catch(err => {
        console.log('ERRO', err)
    })
}
