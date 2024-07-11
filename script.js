// ==UserScript==
// @name         Mark's (and Treyson's) Steam Script
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  a script that enhances Steam Store pages by displaying Proton compatibility status and Steam Deck compatibility. The script also provides links to the game's ProtonDB and SteamDB pages for more details
// @author       Mark Snyder
// @updateURL    https://github.com/Treyson-Grange/steamStoreScript/blob/master/script.js
// @match        https://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?domain=steampowered.com
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(() => {
    'use strict';

    const $ = jQuery;
    const itemID = window.location.pathname.split('/')[2];
    const steamDBurl = `https://steamdb.info/app/${itemID}/`;
    const protonDBurlApi = `https://www.protondb.com/api/v1/reports/summaries/${itemID}.json`;
    const steamDeckVerifiedApiURL = `https://www.protondb.com/proxy/steam/deck-verified?nAppID=${itemID}`;
    const protonDBurl = `https://www.protondb.com/app/${itemID}`;

    const createSteamDBButton = (url, text) => {
        const btn = document.createElement('a');
        btn.className = 'btnv6_blue_hoverfade btn_large';
        btn.style.cssText = `display: inline-block;`
        btn.href = url;
        btn.target = '_blank';
        btn.innerHTML = `<span>${text}</span>`;
        btn.style.marginTop = '1rem';
        btn.style.marginBottom = '1rem';
        btn.style.height = '40px';
        document.querySelector("#appHubAppName").appendChild(btn);
    };

    const addBadge = (text, backgroundColor, textColor = 'black', imageUrl = '') => {
        const badge = document.createElement('div');

        badge.style.cssText = `
            font-family: "Arial", "Helvetica", "sans-serif";
            text-transform: capitalize;
            text-align: center;
            min-width: 220px;
            font-size: 22px;
            background: ${backgroundColor};
            color: ${textColor};
            padding: 1px;
            border: none;
            border-radius: 2px;
            margin-top: 1rem;
            margin-bottom: 1rem;
            margin-left: 1rem;
            display: inline-block;
            vertical-align: top;
            padding: 0 15px;
            line-height: 40px;
            display: inline-block;
            height: 42px;
        `;
        const span = document.createElement('span');
        span.style.transform = 'scale(0.8, 1)';
        span.style.color = textColor
        span.textContent = text;

        badge.appendChild(span);

        if (imageUrl) {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'No Deck Info';
            img.style.cssText = `
                margin-left: 10px;
                width: 20px;
                height: 20px;
                vertical-align: middle;
            `;
            badge.appendChild(img);
        }

        document.querySelector('#appHubAppName').appendChild(badge);
        badge.outerHTML = `<a href="${protonDBurl}" target="_blank">${badge.outerHTML}</a>`;
    };



    const getProtonDBInfo = () => {
        const lineBreak = document.createElement('br');
        document.querySelector('#appHubAppName').appendChild(lineBreak);
        GM_xmlhttpRequest({
            method: "GET",
            url: protonDBurlApi,
            onload: (response) => {
                try {
                    const data = JSON.parse(response.responseText);
                    const tier = document.querySelector('[data-os="linux"]') ? 'native' : data.tier || 'no info';
                    const colors = {
                        native: ['green', 'white'],
                        platinum: ['rgb(180, 199, 220)'],
                        gold: ['rgb(207, 181, 59)'],
                        silver: ['rgb(192, 192, 192)'],
                        bronze: ['rgb(205, 127, 50)'],
                        borked: ['red'],
                        'no info': ['gray']
                    };
                    addBadge(tier, ...colors[tier]);
                } catch {
                    addBadge('no info', 'gray');
                }
            }
        });
    };

    const getSteamDeckInfo = () => {
        GM_xmlhttpRequest({
            method: "GET",
            url: steamDeckVerifiedApiURL,
            onload: (response) => {
                try {
                    const data = JSON.parse(response.responseText);
                    const categories = {
                        0: ['No Deck Info', 'gray', 'black', 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/steamworks_docs/english/unknown_50_1.png'],
                        1: ['Deck Unplayable', 'red', 'black', 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/steamworks_docs/english/unsupported_50.png'],
                        2: ['Deck Playable', 'rgb(255, 140, 0)', 'black', 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/steamworks_docs/english/playable_50_1.png'],
                        3: ['Deck Verified', 'green', 'white', 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/steamworks_docs/english/verified_50.png'],
                    };
                    const category = categories[data.results.resolved_category] || categories[0];
                    addBadge(...category);
                } catch {
                    addBadge('No Deck Info', 'gray', 'black', 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/steamworks_docs/english/unknown_50_1.png');
                }
            }
        });
    };

    getProtonDBInfo();
    getSteamDeckInfo();
    createSteamDBButton(steamDBurl, 'View on SteamDB');
})();
