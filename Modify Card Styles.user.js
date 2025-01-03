// ==UserScript==
// @name         Modify Card Styles
// @namespace    http://tampermonkey.net/
// @version      6
// @description  Adds customization options for card styles, including 'Full Art Mode', 'Foil Mode', and more. Applies changes only to Season 4 cards.
// @author       9003
// @match        *://www.nationstates.net/page=deck*
// @grant        none
// ==/UserScript==

//TODO: 
//And offsets

(function () {
    'use strict';

    // Utility to save settings
    function saveSettings(cardID, settings) {
        const allSettings = JSON.parse(localStorage.getItem('cardStyles') || '{}');
        allSettings[cardID] = settings;
        localStorage.setItem('cardStyles', JSON.stringify(allSettings));
    }

        // Utility to save global settings
    function saveGlobalSettings(key, value) {
        const globalSettings = JSON.parse(localStorage.getItem('globalSettings') || '{}');
        globalSettings[key] = value;
        localStorage.setItem('globalSettings', JSON.stringify(globalSettings));
    }

        // Utility to load global settings
    function loadGlobalSettings(key) {
        const globalSettings = JSON.parse(localStorage.getItem('globalSettings') || '{}');
        return globalSettings[key] || false;
    }

    // Utility to load settings
    function loadSettings(cardID) {
        const allSettings = JSON.parse(localStorage.getItem('cardStyles') || '{}');
        return allSettings[cardID] || null;
    }

    // Utility to reset settings to default
    function resetSettings(cardID) {
        const allSettings = JSON.parse(localStorage.getItem('cardStyles') || '{}');
        delete allSettings[cardID];
        localStorage.setItem('cardStyles', JSON.stringify(allSettings));
    }

    // Function to apply settings to a single card
    function applySettingsToCard(cardElement) {
        const cardID = cardElement.getAttribute('data-cardid');
        const season = cardElement.getAttribute('data-season');
        const oops9003Enabled = loadGlobalSettings('oops9003'); // Check global setting

        if (!cardID || season !== '4') return; // Skip if not Season 4

        const settings = loadSettings(cardID);
        const nameElement = cardElement.querySelector('.title');
        if (nameElement) {
            const defaultColor = window.getComputedStyle(nameElement).color;
            nameElement.style.color = (settings && settings.nameColor) || '';
        }

        if (settings && settings.junkMode) {
            let junkOverlay = cardElement.querySelector('.junk-overlay');
            if (!junkOverlay) {
                junkOverlay = document.createElement('div');
                junkOverlay.classList.add('junk-overlay');
                junkOverlay.style.position = 'absolute';
                junkOverlay.style.top = '0';
                junkOverlay.style.left = '0';
                junkOverlay.style.width = '100%';
                junkOverlay.style.height = '100%';
                junkOverlay.style.backgroundColor = 'black';
                junkOverlay.style.zIndex = '1'; // Ensure the overlay is below the buttons
                junkOverlay.style.pointerEvents = 'none'; // Overlay does not block clicks
                cardElement.style.position = 'relative';

                const junkLabel = document.createElement('div');
                junkLabel.textContent = 'JUNK';
                junkLabel.style.color = 'red';
                junkLabel.style.fontSize = '2rem';
                junkLabel.style.fontWeight = 'bold';
                junkLabel.style.position = 'absolute';
                junkLabel.style.top = '50%';
                junkLabel.style.left = '50%';
                junkLabel.style.transform = 'translate(-50%, -50%)';
                junkLabel.style.pointerEvents = 'none'; // Label does not block clicks

                junkOverlay.appendChild(junkLabel);
                cardElement.appendChild(junkOverlay);
            }
            const buttonContainer = cardElement.querySelector('.deckcard-info-cardbuttons');
            if (buttonContainer) {
                buttonContainer.style.zIndex = '2'; // Ensure buttons are above the overlay
                buttonContainer.style.position = 'relative';
            }
        }

        const flagElement = cardElement.querySelector('.bottom');
        if (flagElement) {
            if (settings && settings.removeGradient) {
                const backgroundImage = flagElement.style.backgroundImage;
                if (backgroundImage.includes('linear-gradient')) {
                    const urlMatch = backgroundImage.match(/url\((.*?)\)/);
                    if (urlMatch && urlMatch[0]) {
                        flagElement.style.backgroundImage = urlMatch[0];
                    }
                }
            }

            if (oops9003Enabled) {
              let oops9003Overlay = cardElement.querySelector('.oops9003-overlay');
               if (!oops9003Overlay) {
                    oops9003Overlay = document.createElement('div');
                    oops9003Overlay.classList.add('oops9003-overlay');
                    oops9003Overlay.style.position = 'absolute';
                    oops9003Overlay.style.top = '0';
                    oops9003Overlay.style.left = '0';
                    oops9003Overlay.style.width = '100%';
                    oops9003Overlay.style.height = '100%';
                    oops9003Overlay.style.pointerEvents = 'none';
                    oops9003Overlay.style.backgroundSize = 'cover';
                    oops9003Overlay.style.backgroundBlendMode = 'screen';
                    oops9003Overlay.style.opacity = '.99'; // Adjust transparency if needed
                    oops9003Overlay.style.zIndex = '1'; // Ensure it appears above the card and buttons
                    cardElement.style.position = 'relative';

                    cardElement.appendChild(oops9003Overlay);
                }
                    oops9003Overlay.style.backgroundImage = 'url(https://i.imgur.com/Rqb6PuY.png)';


            } else {
                // Remove overlay if global mode is disabled
                const oops9003Overlay = cardElement.querySelector('.oops9003-overlay');
                if (oops9003Overlay) oops9003Overlay.remove();
            }

            if (settings && settings.foilMode) {
                let foilOverlay = cardElement.querySelector('.foil-overlay');
                if (!foilOverlay) {
                    foilOverlay = document.createElement('div');
                    foilOverlay.classList.add('foil-overlay');
                    foilOverlay.style.position = 'absolute';
                    foilOverlay.style.top = '0';
                    foilOverlay.style.left = '0';
                    foilOverlay.style.width = '100%';
                    foilOverlay.style.height = '100%';
                    foilOverlay.style.pointerEvents = 'none';
                    foilOverlay.style.backgroundSize = 'cover';
                    foilOverlay.style.backgroundBlendMode = 'screen';
                    foilOverlay.style.opacity = '0.5'; // Adjust transparency if needed
                    foilOverlay.style.zIndex = '1'; // Ensure it appears above the card and buttons
                    cardElement.style.position = 'relative';
                    cardElement.appendChild(foilOverlay);
                }

                // Apply the selected foil style
                if (settings.foilStyle === 'rainbow') {
                    foilOverlay.style.backgroundImage = 'url(https://i.imgur.com/Bj5oEuQ.png)';
                } else if (settings.foilStyle === 'bright_boom') {
                    foilOverlay.style.backgroundImage = 'url(https://i.imgur.com/JBBGqfU.png)';
                } else if (settings.foilStyle === 'boom') {
                    foilOverlay.style.backgroundImage = 'url(https://i.imgur.com/RZi3Dn0.gif)';
                } else if (settings.foilStyle === 'blob') {
                    foilOverlay.style.backgroundImage = 'url(https://i.imgur.com/y9PyWYM.png)';
                } else if (settings.foilStyle === 'shimmer') {
                    foilOverlay.style.backgroundImage = 'url(https://i.imgur.com/xljFzDA.png)';
                } else if (settings.foilStyle === 'twinkle') {
                    foilOverlay.style.backgroundImage = 'url(https://i.imgur.com/7ZiBiY4.png)';
                } else if (settings.foilStyle === 'spiral') {
                    foilOverlay.style.backgroundImage = 'url(https://i.imgur.com/3EhaDs3.png)';
                } else if (settings.foilStyle === 'color_spiral') {
                    foilOverlay.style.backgroundImage = 'url(https://i.imgur.com/5Ko2dLB.png)';
                } else if (settings.foilStyle === 'square') {
                    foilOverlay.style.backgroundImage = 'url(https://i.imgur.com/ndysnBl.png)';
                } else if (settings.foilStyle === 'spot') {
                    foilOverlay.style.backgroundImage = 'url(https://i.imgur.com/7QuTQrp.png)';
                } else if (settings.foilStyle === 'spot_slow') {
                    foilOverlay.style.backgroundImage = 'url(https://i.imgur.com/oTBTL8D.png)';
                }
            }

        }

        if (cardID === '85949') {
            const rarityIndicatorBlocks = cardElement.querySelectorAll('.rarity-indicator-block');
            if (rarityIndicatorBlocks.length) {
                rarityIndicatorBlocks.forEach(block => {
                    const img = document.createElement('img');
                    img.src = 'https://i.imgur.com/dk1H2VJ.png';
                    img.alt = 'Rarity';
                    img.style.width = '10px';
                    img.style.height = '10px';
                    img.style.display = 'inline-block';
                    img.style.margin = '0 2px';
                    block.replaceWith(img);
                });
            }
        }
        if (settings && settings.hideMottoBox2) {
            const mottoBox = cardElement.querySelector('.motto-box');
                mottoBox.style.display = 'none';
        }
        //
        if (settings && settings.hideTrophy) {
            const badges = cardElement.querySelectorAll('.trophy');
            badges.forEach(badge => {
                badge.style.display = 'none';
            });
        }


        if (settings && settings.hideName) {
            const mottoBox = cardElement.querySelector('.title');
                mottoBox.style.display = 'none';
        }
        if (settings && settings.hideLowerInfo) {
            const mottoBox = cardElement.querySelector('.lower-info');
                mottoBox.style.display = 'none';
        }

        if (settings && settings.hideBigBadge) {
            const badges = cardElement.querySelectorAll('.badge');
            badges.forEach(badge => {
                badge.style.display = 'none';
            });
        }


        if (settings && settings.pretitle) {
            const mottoBox = cardElement.querySelector('.pretitle');
                mottoBox.style.display = 'none';}

        if (settings && settings.fullArtMode) {
            const pretitleElement = cardElement.querySelector('.pretitle');
            const rarityElement = cardElement.querySelector('.rarity');
            const rarityIndicator = cardElement.querySelector('.rarity-indicator');
            const seasonElement = cardElement.querySelector('footer span');
            const topElement = cardElement.querySelector('.top header');

            if (pretitleElement && rarityElement && topElement) {
                if (!topElement.querySelector('.full-art-title')) {
                    const pretitleText = pretitleElement.textContent.trim();
                    const pretitleDisplay = document.createElement('div');
                    pretitleDisplay.textContent = pretitleText;
                    pretitleDisplay.style.color = settings && settings.nameColor || '#fff';
                    pretitleDisplay.style.fontSize = '0.5rem';
                    pretitleDisplay.style.textAlign = 'center';
                    pretitleDisplay.style.whiteSpace = 'normal';

                    const nameText = nameElement.textContent.trim();
                    const nameDisplay = document.createElement('div');
                    nameDisplay.textContent = nameText;
                    nameDisplay.style.color = settings && settings.nameColor || '#fff';
                    nameDisplay.style.fontSize = '.5rem';
                    nameDisplay.style.textAlign = 'center';
                    nameDisplay.style.whiteSpace = 'normal';
                    nameDisplay.style.lineHeight = '1';

                    rarityElement.style.display = 'none';

                    topElement.appendChild(pretitleDisplay);
                    topElement.appendChild(nameDisplay);

                    pretitleElement.style.display = 'none';
                    nameElement.style.display = 'none';
                }
            }


            if (rarityIndicator && seasonElement) {
                seasonElement.textContent = '';
                seasonElement.appendChild(rarityIndicator);
            }
        }

        const mottoSpan = cardElement.querySelector('.motto');
        if (mottoSpan) {
            mottoSpan.style.color = (settings && settings.textColor) || '';
            if (settings && settings.addMottoBackground) {
                mottoSpan.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                mottoSpan.style.padding = '5px';
                mottoSpan.style.borderRadius = '5px';
            } else {
                mottoSpan.style.backgroundColor = '';
                mottoSpan.style.padding = '';
                mottoSpan.style.borderRadius = '';
            }
        }
    }

    function processAllCards() {
        const oops9003Enabled = loadGlobalSettings('oops9003');
        const cardElements = document.querySelectorAll('.deckcard');
        cardElements.forEach(cardElement => {
            applySettingsToCard(cardElement);
        });
    }

    function addStyleButtons() {
        const cardElements = document.querySelectorAll('.deckcard');
        cardElements.forEach(cardElement => {
            const cardID = cardElement.getAttribute('data-cardid');
            const season = cardElement.getAttribute('data-season');
            if (!cardID || season !== '4') return;

            const buttonContainer = cardElement.querySelector('.deckcard-info-cardbuttons');
            if (!buttonContainer) return;

            const styleButton = document.createElement('button');
            styleButton.textContent = 'Style';
            styleButton.classList.add('button');
            styleButton.style.marginLeft = '10px';

            styleButton.addEventListener('click', () => openStylePopup(cardID, cardElement));

            buttonContainer.appendChild(styleButton);
        });
    }
    function openStylePopup(cardID, cardElement) {
        if (document.querySelector('.style-popup')) return;

        const currentSettings = loadSettings(cardID) || {};
        const globalOops9003 = loadGlobalSettings('oops9003');


        const popup = document.createElement('div');
        popup.classList.add('style-popup');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = '#fff';
        popup.style.border = '1px solid #ccc';
        popup.style.borderRadius = '10px';
        popup.style.padding = '20px';
        popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        popup.style.zIndex = '10000';

        popup.innerHTML = `
        <label style="display:block; margin-top:10px;">
            <input type="checkbox" id="oops-9003-global" ${globalOops9003 ? 'checked' : ''}>Oops All 9003 (Global)
        </label>
        <label style="display:block; margin-top:10px;">
            <input type="checkbox" id="toggle-motto-box" ${currentSettings.hideMottoBox2 ? 'checked' : ''}>Remove Motto Box
        </label>
        <label style="display:block; margin-top:10px;">
            <input type="checkbox" id="toggle-pretitle" ${currentSettings.pretitle ? 'checked' : ''}>Remove pretitle Box
        </label>
        <label style="display:block; margin-top:10px;">
            <input type="number" id="pretitle-offset" placeholder="0" style="width:100px;" value="${currentSettings.pretitleOffset || 0}">
        </label>
        <label style="display:block; margin-top:10px;">
            <input type="checkbox" id="toggle-nation-name" ${currentSettings.hideName ? 'checked' : ''}>Remove name Box
        </label>
        <label style="display:block; margin-top:10px;">
            <input type="checkbox" id="toggle-big-badge" ${currentSettings.hideBigBadge ? 'checked' : ''}>Remove Big badges (WA,Admin,WAD)
        </label>
        <label style="display:block; margin-top:10px;">
            <input type="checkbox" id="toggle-trophys" ${currentSettings.hideTrophy ? 'checked' : ''}>Remove Trophys
        </label>
        <label style="display:block; margin-top:10px;">
            <input type="checkbox" id="toggle-lower-info" ${currentSettings.hideLowerInfo ? 'checked' : ''}>Remove Lower info bar
        </label>
        <label style="display:block; margin-top:10px;">
            <input type="checkbox" id="toggle-gradient" ${currentSettings.removeGradient ? 'checked' : ''}>Remove Linear Gradient
        </label>
        <label style="display:block; margin-top:10px;">
            Motto Color (Hex):
            <input type="text" id="text-color" value="${currentSettings.textColor || ''}" placeholder="#000000" style="width:100px;">
        </label>
        <label style="display:block; margin-top:10px;">
            Name Color (Hex):
            <input type="text" id="name-color" value="${currentSettings.nameColor || ''}" placeholder="#ffffff" style="width:100px;">
        </label>
        <label style="display:block; margin-top:10px;">
            <input type="checkbox" id="add-motto-background" ${currentSettings.addMottoBackground ? 'checked' : ''}> Add Motto Background
        </label>
        <label style="display:block; margin-top:10px;">
            <input type="checkbox" id="junk-mode" ${currentSettings.junkMode ? 'checked' : ''}> Junk Mode
        </label>
        <label style="display:block; margin-top:10px;">
            <input type="checkbox" id="full-art-mode" ${currentSettings.fullArtMode ? 'checked' : ''}> Full Art Mode
        </label>
        <label style="display:block; margin-top:10px;">
            <input type="checkbox" id="foil-mode" ${currentSettings.foilMode ? 'checked' : ''}> Foil Mode
        </label>
        <label style="display:block; margin-top:10px;">
            Foil Style:
            <select id="foil-style">
                <option value="rainbow" ${currentSettings.foilStyle === 'rainbow' ? 'selected' : ''}>Rainbow</option>
                <option value="boom" ${currentSettings.foilStyle === 'boom' ? 'selected' : ''}>Boom</option>
                <option value="bright_boom" ${currentSettings.foilStyle === 'bright_boom' ? 'selected' : ''}>Bright_Boom</option>
                <option value="blob" ${currentSettings.foilStyle === 'blob' ? 'selected' : ''}>Blob</option>
                <option value="shimmer" ${currentSettings.foilStyle === 'shimmer' ? 'selected' : ''}>Shimmer</option>
                <option value="twinkle" ${currentSettings.foilStyle === 'twinkle' ? 'selected' : ''}>Twinkle</option>
                <option value="spiral" ${currentSettings.foilStyle === 'spiral' ? 'selected' : ''}>Spiral</option>
                <option value="color_spiral" ${currentSettings.foilStyle === 'color_spiral' ? 'selected' : ''}>Color spiral</option>
                <option value="square" ${currentSettings.foilStyle === 'square' ? 'selected' : ''}>Square</option>
                <option value="spot" ${currentSettings.foilStyle === 'spot' ? 'selected' : ''}>Spot</option>
                <option value="spot_slow" ${currentSettings.foilStyle === 'spot_slow' ? 'selected' : ''}>Spot slow</option>

            </select>
        </label>
        <button id="apply-settings" style="margin-top:20px;">Apply</button>
        <button id="reset-settings" style="margin-top:20px; margin-left:10px;">Reset</button>
        <button id="close-popup" style="margin-top:20px; margin-left:10px;">Close</button>
    `;

        document.body.appendChild(popup);

        document.getElementById('apply-settings').addEventListener('click', () => {

            const globalOops9003Value = document.getElementById('oops-9003-global').checked;
            saveGlobalSettings('oops9003', globalOops9003Value);

            const newSettings = {
                removeGradient: document.getElementById('toggle-gradient').checked,
                textColor: document.getElementById('text-color').value,
                addMottoBackground: document.getElementById('add-motto-background').checked,
                junkMode: document.getElementById('junk-mode').checked,
                fullArtMode: document.getElementById('full-art-mode').checked,
                foilMode: document.getElementById('foil-mode').checked,
                foilStyle: document.getElementById('foil-style').value,
                nameColor: document.getElementById('name-color').value,
                hideMottoBox2: document.getElementById('toggle-motto-box').checked,
                pretitle: document.getElementById('toggle-pretitle').checked,
                hideName: document.getElementById('toggle-nation-name').checked,
                hideBigBadge: document.getElementById('toggle-big-badge').checked,
                hideTrophy: document.getElementById('toggle-trophys').checked,
                hideLowerInfo: document.getElementById('toggle-lower-info').checked,



            };

            saveSettings(cardID, newSettings);
            //applySettingsToCard(cardElement);
            document.body.removeChild(popup);
            location.reload();

        });

        document.getElementById('reset-settings').addEventListener('click', () => {
            resetSettings(cardID);
            applySettingsToCard(cardElement);
            document.body.removeChild(popup);
            location.reload();

        });

        document.getElementById('close-popup').addEventListener('click', () => {
            document.body.removeChild(popup);
        });
    }


    function initialize() {
        processAllCards();
        addStyleButtons();


        const infoContentElements = document.querySelectorAll('.deckcard-info-content');
        infoContentElements.forEach(element => {
        element.style.position = 'relative'; // Ensure position is set for z-index to work
        element.style.zIndex = '100'; // Set the z-index to 100
    });
    }

    initialize();
})();
