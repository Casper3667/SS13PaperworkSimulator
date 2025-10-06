/* exported checkFieldCount */
/* global loadFile, updateFields */
'use strict';

var yearmod = 442;

$(document).ready(function () {
    hideWarning();
    $('#year').html(getYear());

    $('#input').bind('input change', run);
    $('#save').click(function () { download('pencode.txt', $('#input').val()); });

    $('.controlgroup').controlgroup();

    setTimeout(function () {
        var hash = $(location).attr('hash');
        loadFile((hash && hash.substring(1) + '.txt') || 'instructions.txt');
    }, 100);

    $('.has-tooltip').tooltip();

    setKeyBindings();
});

function setKeyBindings() {
    var justAdded = false;
    $(document).keyup(function(e) {
        if (e.ctrlKey) {
            switch (e.key) {
                case('b'):
                case('i'):
                case('u'):
                case('e'):
                    justAdded = false;
                    break;
                case('>'):
                case('<'):
                    if (e.shiftKey) {
                        justAdded = false;
                    }
                    break;
            }
        }
    });
    $(document).keydown(function(e) {
        if (e.ctrlKey) {
            switch (e.key) {
                case('b'):
                case('i'):
                case('u'):
                    handleAddition(e.key);
                    break;
                case('e'):
                    handleAddition('center');
                    break;
            }
            if (e.shiftKey) {
                switch (e.key) {
                    case('>'):
                        handleAddition('large');
                        break;
                    case('<'):
                        handleAddition('small');
                        break;
                }
            }
        }

        function handleAddition(type) {
            e.preventDefault();
            if(!justAdded) {
                addBlock(type);
                justAdded = true;
            }
        }
    });
}

function run() {
    $('#output').html(processText($('#input').val()));
    $('#output span.sig').css('font-style', 'italic');
    updateFields();
}

String.prototype.replaceAll = function(strReplace, strWith) {
    // See http://stackoverflow.com/a/3561711/556609
    var esc = strReplace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var reg = new RegExp(esc, 'ig');
    return this.replace(reg, strWith);
};

function processText(str) {

    str = (
        str
        .replaceAll('&', '&amp;') // Has to happen before other escaping, else it messes them up
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('\n', '<BR>')

        // Digital tags
        .replaceAll('[pre]', '<pre>')
        .replaceAll('[/pre]', '</pre>')
        .replaceAll('[fontred]', '<mark class="fontred">')
        .replaceAll('[fontgreen]', '<mark class="fontgreen">')
        .replaceAll('[fontblue]', '<mark class="fontblue">')
        .replaceAll('[/font]', '</mark>')

        .replaceAll('[center]', '<center>')
        .replaceAll('[/center]', '</center>')

        .replaceAll('[br]', '<BR>')
        .replaceAll('[hr]', '<HR>')

        .replaceAll('[b]', '<B>')
        .replaceAll('[/b]', '</B>')
        .replaceAll('[i]', '<I>')
        .replaceAll('[/i]', '</I>')
        .replaceAll('[u]', '<U>')
        .replaceAll('[/u]', '</U>')

        .replaceAll('[time]', getTimeString())
        .replaceAll('[date]', getDateString())
        .replaceAll('[sign]', '<span class="sig">John Doe</span>')
        .replaceAll('[station]', 'SCCV Horizon')

        .replaceAll('[large]', '<span class="large-text">')
        .replaceAll('[/large]', '</span>')
        .replaceAll('[small]', '<span class="small-text">')
        .replaceAll('[/small]', '</span>')

        .replaceAll('[field]', '<span class="paper_field"></span>')
        .replaceAll('[h1]', '<H1>')
        .replaceAll('[/h1]', '</H1>')
        .replaceAll('[h2]', '<H2>')
        .replaceAll('[/h2]', '</H2>')
        .replaceAll('[h3]', '<H3>')
        .replaceAll('[/h3]', '</H3>')

        .replaceAll('[list]', '<ul>')
        .replaceAll('[/list]', '</ul>')
        .replaceAll('[*]', '<li>')

        .replaceAll('[table]', '<table border=1 cellspacing=0 cellpadding=3 style="border: 1px solid black;">')
        .replaceAll('[/table]', '</td></tr></table>')
        .replaceAll('[grid]', '<table>')
        .replaceAll('[/grid]', '</td></tr></table>')
        .replaceAll('[row]', '</td><tr>')
        .replaceAll('[cell]', '<td>')

        .replaceAll('[logo_scc]', '<img src = ./img/scclogo.png>')
        .replaceAll('[logo_scc_small]', '<img src = ./img/scclogo_small.png>')
        .replaceAll('[logo_nt]', '<img src = ./img/nanotrasenlogo.png>')
        .replaceAll('[logo_nt_small]', '<img src = ./img/nanotrasenlogo_small.png>')
        .replaceAll('[logo_zh]', '<img src = ./img/zhlogo.png>')
        .replaceAll('[logo_zh_small]', '<img src = ./img/zhlogo_small.png>')
        .replaceAll('[logo_idris]', '<img src = ./img/idrislogo.png>')
        .replaceAll('[logo_idris_small]', '<img src = ./img/idrislogo_small.png>')
        .replaceAll('[logo_eridani]', '<img src = ./img/eridanilogo.png>')
        .replaceAll('[logo_eridani_small]', '<img src = ./img/eridanilogo_small.png>')
        .replaceAll('[logo_zavod]', '<img src = ./img/zavodlogo.png>')
        .replaceAll('[logo_zavod_small]', '<img src = ./img/zavodlogo_small.png>')
        .replaceAll('[logo_hp_large]', '<img src = ./img/hplogolarge.png>')
        .replaceAll('[logo_hp]', '<img src = ./img/hplogo.png>')
        .replaceAll('[logo_hp_small]', '<img src = ./img/hplogo_small.png>')
        .replaceAll('[logo_orion]', '<img src = ./img/orionlogo.png>')
        .replaceAll('[logo_orion_small]', '<img src = ./img/orionlogo_small.png>')
        .replaceAll('[logo_pmcg]', '<img src = ./img/pmcglogo.png>')
        .replaceAll('[logo_pmcg_small]', '<img src = ./img/pmcglogo_small.png>')
        .replaceAll('[flag_be]', '<img src = ./img/beflag.png>')
        .replaceAll('[flag_be_small]', '<img src = ./img/beflag_small.png>')
        .replaceAll('[flag_elyra]', '<img src = ./img/elyraflag.png>')
        .replaceAll('[flag_elyra_small]', '<img src = ./img/elyraflag_small.png>')
        .replaceAll('[flag_sol]', '<img src = ./img/solflag.png>')
        .replaceAll('[flag_sol_small]', '<img src = ./img/solflag_small.png>')
        .replaceAll('[flag_coc]', '<img src = ./img/cocflag.png>')
        .replaceAll('[flag_coc_small]', '<img src = ./img/cocflag_small.png>')
        .replaceAll('[flag_dom]', '<img src = ./img/domflag.png>')
        .replaceAll('[flag_dom_small]', '<img src = ./img/domflag_small.png>')
        .replaceAll('[flag_nralakk]', '<img src = ./img/nralakkflag.png>')
        .replaceAll('[flag_nralakk_small]', '<img src = ./img/nralakkflag_small.png>')
        .replaceAll('[flag_pra]', '<img src = ./img/praflag.png>')
        .replaceAll('[flag_pra_small]', '<img src = ./img/praflag_small.png>')
        .replaceAll('[flag_dpra]', '<img src = ./img/dpraflag.png>')
        .replaceAll('[flag_dpra_small]', '<img src = ./img/dpraflag_small.png>')
        .replaceAll('[flag_nka]', '<img src = ./img/nkaflag.png>')
        .replaceAll('[flag_nka_small]', '<img src = ./img/nkaflag_small.png>')
        .replaceAll('[flag_izweski]', '<img src = ./img/izweskiflag.png>')
        .replaceAll('[flag_izweski_small]', '<img src = ./img/izweskiflag_small.png>')
        .replaceAll('[logo_golden]', '<img src = ./img/goldenlogo.png>')
        .replaceAll('[logo_golden_small]', '<img src = ./img/goldenlogo_small.png>')
        .replaceAll('[logo_pvpolice]', '<img src = ./img/pvpolicelogo.png>')
        .replaceAll('[logo_pvpolice_small]', '<img src = ./img/pvpolicelogo_small.png>')
        .replaceAll('[barcode]', '<img src = ./img/barcode[rand(0, 3)].png>')

        .replaceAll('[editorbr]', '')
    );

    str += '<span class="output-end"></span>';

    return str;
}

function getDateString() {
    var date = new Date();
    var yyyy = date.getFullYear() + yearmod;
    var mm = date.getMonth() + 1;
    mm = mm < 10 ? '0' + mm : mm;
    var dd = date.getDate();
    dd = dd < 10 ? '0' + dd : dd;
    return yyyy + '-' + mm + '-' + dd;
}

function getYear() {
    return new Date().getFullYear() + yearmod;
}

function getTimeString() {
    var date = new Date();
    var hh = (date.getHours() < 10 ? "0" : "") + date.getHours();
    var mm = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    return hh + ":" + mm;
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);

  alert('Document saved as ' + filename);
}

function addBlock(type) {
    if (type === 'list') {
        addAtSelectionStart('[list][*]');
        addAtSelectionEnd('[/list]');

    } else if (type === 'table') {
        addAtSelectionStart('[table][row][cell]');
        addAtSelectionEnd('[/table]');

    } else {
        addAtSelectionStart('[' + type + ']');
        if (!isSelfClosingBlock(type)) {
            addAtSelectionEnd('[/' + type + ']');
        }
    }

    run();

    function isSelfClosingBlock(type) {
        return type === 'time' || type === 'date';
    }

    function addAtSelectionStart(txtToAdd) {
        var txt = $('#input');
        var selectionStart = txt.prop('selectionStart');
        var selectionEnd = txt.prop('selectionEnd');
        var textAreaTxt = txt.val();
        txt.val(textAreaTxt.substring(0, selectionStart) + txtToAdd + textAreaTxt.substring(selectionStart));
        setSelectionRange(selectionStart + txtToAdd.length, selectionEnd + txtToAdd.length);
    }

    function addAtSelectionEnd(txtToAdd) {
        var txt = $('#input');
        var selectionStart = txt.prop('selectionStart');
        var selectionEnd = txt.prop('selectionEnd');
        var textAreaTxt = txt.val();
        txt.val(textAreaTxt.substring(0, selectionEnd) + txtToAdd + textAreaTxt.substring(selectionEnd));
        setSelectionRange(selectionStart, selectionEnd);
    }

    function setSelectionRange(selectionStart, selectionEnd) {
        var input = $('#input')[0];
        input.focus();
        if (input.setSelectionRange) {
            input.setSelectionRange(selectionStart, selectionEnd);

        } else if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selectionEnd);
            range.moveStart('character', selectionStart);
            range.select();

        } else {
            console.warn('Could not setCaretToPos, unsupported browser!');
        }
    }
}

function checkFieldCount() {
    var fieldCount = $('span.paper_field').length;
    var fieldWarningShown = $('#warning').is(':visible');

    var showFieldWarning = (fieldCount > 50);

    if (showFieldWarning) {
        showWarning('Your document has <b>' + fieldCount + '</b> fields. Only <b>50</b> fields are allowed. You may need to remove fields or format for multiple pages.');
    }
    else if (fieldWarningShown) {
        hideWarning();
    }
}

function showWarning(html) {
    $('#warningText').html(html);
    $('#wrapper').css('height', 'calc(100vh - 9em)');
    $('#warning').show();
}

function hideWarning() {
    $('#warningText').html('');
    $('#wrapper').css('height', 'calc(100vh - 7em)');
    $('#warning').hide();
}
