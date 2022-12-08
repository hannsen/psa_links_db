// ==UserScript==
// @name         Psa_link_getter
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  psa_link_getter
// @author       You
// @match        https://psa.pm/*
// @match        https://get-to.link/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=psa.pm
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_listValues
// @grant GM_deleteValue
// ==/UserScript==

(function() {

    'use strict';

    let api_host = GM_getValue('apihost');
    if(!api_host){
        api_host = window.prompt("Enter apihost (https://XXXXX/), no slash at end");
        GM_setValue('apihost', api_host);
    }


    function httpGetAsync(url, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState != 4 )
                return;

            if(xmlHttp.status == 200)
                callback(xmlHttp.responseText);
            else
                alert("Failed request code: " + xmlHttp.status + " Error: " + xmlHttp.statusText + xmlHttp.responseText)
        }
        xmlHttp.open("GET", url, true); // true for asynchronous
        xmlHttp.send(null);
    }


    //
    // Show links code
    //
    const rls_selector = '.sp-wrap.sp-wrap-steelblue, .sp-wrap.sp-wrap-blue';
    const details = document.querySelectorAll(rls_selector);
    function isGoodTitle(title){ return title.endsWith("PSA") || (title.includes('Audio') && title.length < 200);}
    function extractTitle(element){
        let title = element.querySelector('div.sp-head[title]').textContent.trim().replace(/[^\x00-\x7F]/g, "");;
        if(isGoodTitle(title)) return title;
        if(title == 'Info') return '';

        while(element.previousSibling){
            element = element.previousSibling;
            let title = element.textContent.trim();
            if(isGoodTitle(title)) return title;
        }

        console.log(element);
        alert('Could not load title');
        return '';
    }
    details.forEach((element) => {
        if(element.querySelector('.sp-wrap.sp-wrap-blue')) return; // Has children
        let title = extractTitle(element);
        if(title == '') return;

        let links_div = document.createElement('div');
        links_div.classList.add("links_div_unloaded");
        links_div.classList.add("links_div");
        links_div.innerHTML = '<img  src="https://i.stack.imgur.com/MnyxU.gif"></img>'
        links_div.dataset.title = title;
        let elem_body = element.querySelector('.sp-body');
        elem_body.insertBefore(links_div, elem_body.firstChild);
        element.onclick = getLinks;


        element.querySelectorAll('center a').forEach((a) => {
            a.onclick = logClick;
        });
    });


    function getLinks(){
        let links_div = this.querySelector('.links_div_unloaded');
        if(!links_div) return;
        links_div.classList.remove('links_div_unloaded');

        let url = "https://"+api_host+"/api/?GET=" + links_div.dataset.title;
        let getFinished = function(text) {
            if (!text){
                links_div.innerHTML = 'Not available';
                return;
            }
            links_div.innerHTML = '';
            text.split("\n").forEach((inner_text) => {
                if(!inner_text) return;
                let ar = inner_text.split('|');
                let links = decodeURIComponent(ar[1]).split(',');
                links_div.innerHTML += "<br>" + decodeURIComponent(ar[0]) + "<br><br>";
                links.forEach((link) => {
                    links_div.innerHTML += '<a href="'+link+'">' + link + "</a><br>";
                });
            });
        }
        httpGetAsync(url, getFinished);
    }


    //
    // Adding links code
    //
    function logClick(){
        let title = extractTitle(this.closest(rls_selector));
        console.log('setting ' + title)
        GM_setValue('r_'+ title, {'time': Math.floor(Date.now() / 1000), 'url': window.location.pathname.replace(/^\//, '')});
    }

    if(window.location.host == 'get-to.link'){
        setTimeout(sendInfo,1500);
    }

    function sendInfo(){
        let part_name = document.querySelector('h4.entry-title').textContent.trim().replace(/[^a-zA-Z0-9-. ]/, '');
        let one_hour_ago = Math.floor(Date.now() / 1000) - 3600;
        let url = '';
        let rls_title = '';
        GM_listValues().forEach((key) => {
            if(!key.startsWith('r_')) return;
            let title = key.split('_', 2)[1];
            let data = GM_getValue(key);
            if(data.time < one_hour_ago){
                GM_deleteValue(key);
                return;
            }
            if(part_name.startsWith(title)){
                url = data.url;
                rls_title = title;
            }
        });

        if(url && rls_title){
            let links = [];
            document.querySelector('div.entry-content').querySelectorAll('a').forEach((link) => {links.push(link.href)});
            let get_url = "https://"+api_host+"/api/?ADD=" +rls_title + "&URL="+ url +"&PARTNAME="+part_name+"&LINKS=" + encodeURIComponent(links.filter(n => n).join(','));
            httpGetAsync(get_url, function(text){document.body.innerHTML = "<center><b>OK SENT</b></center>" + document.body.innerHTML;});
        }
        else{
            alert('Could not load data for ' + part_name);
        }
    }

})();
