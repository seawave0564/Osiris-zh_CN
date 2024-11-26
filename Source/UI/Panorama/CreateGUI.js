u8R"(
$.Osiris = (function () {
    var activeTab;
    var activeSubTab = {};

    return {
        rootPanel: (function () {
            const rootPanel = $.CreatePanel('Panel', $.GetContextPanel(), 'OsirisMenuTab', {
                class: "mainmenu-content__container",
                useglobalcontext: "true"
            });

            rootPanel.visible = false;
            rootPanel.SetReadyForDisplay(false);
            rootPanel.RegisterForReadyEvents(true);
            $.RegisterEventHandler('PropertyTransitionEnd', rootPanel, function (panelName, propertyName) {
                if (rootPanel.id === panelName && propertyName === 'opacity') {
                    if (rootPanel.visible === true && rootPanel.BIsTransparent()) {
                        rootPanel.visible = false;
                        rootPanel.SetReadyForDisplay(false);
                        return true;
                    } else if (newPanel.visible === true) {
                        $.DispatchEvent('MainMenuTabShown', 'OsirisMenuTab');
                    }
                }
                return false;
            });

            return rootPanel;
        })(),
        goHome: function () {
            $.DispatchEvent('Activated', this.rootPanel.GetParent().GetParent().GetParent().FindChildInLayoutFile("MainMenuNavBarHome"), 'mouse');
        },
        addCommand: function (command, value = '') {
            var existingCommands = this.rootPanel.GetAttributeString('cmd', '');
            this.rootPanel.SetAttributeString('cmd', existingCommands + command + ' ' + value);
        },
        navigateToTab: function (tabID) {
            if (activeTab === tabID)
                return;

            if (activeTab) {
                var panelToHide = this.rootPanel.FindChildInLayoutFile(activeTab);
                panelToHide.RemoveClass('Active');
            }

            this.rootPanel.FindChildInLayoutFile(tabID + '_button').checked = true;

            activeTab = tabID;
            var activePanel = this.rootPanel.FindChildInLayoutFile(tabID);
            activePanel.AddClass('Active');
            activePanel.visible = true;
            activePanel.SetReadyForDisplay(true);
        },
        navigateToSubTab: function (tabID, subTabID) {
            if (activeSubTab[tabID] === subTabID)
                return;

            if (activeSubTab[tabID]) {
                var panelToHide = this.rootPanel.FindChildInLayoutFile(activeSubTab[tabID]);
                panelToHide.RemoveClass('Active');
            }

            this.rootPanel.FindChildInLayoutFile(subTabID + '_button').checked = true;

            activeSubTab[tabID] = subTabID;
            var activePanel = this.rootPanel.FindChildInLayoutFile(subTabID);
            activePanel.AddClass('Active');
            activePanel.visible = true;
            activePanel.SetReadyForDisplay(true);
        },
        dropDownUpdated: function (tabID, dropDownID) {
            this.addCommand('set', tabID + '/' + dropDownID + '/' + this.rootPanel.FindChildInLayoutFile(dropDownID).GetSelected().GetAttributeString('value', ''));
        }
    };
})();

(function () {
    var createNavbar = function () {
        var navbar = $.CreatePanel('Panel', $.Osiris.rootPanel, '', {
            class: "content-navbar__tabs content-navbar__tabs--noflow"
        });

        var leftContainer = $.CreatePanel('Panel', navbar, '', {
            style: "horizontal-align: left; flow-children: right; height: 100%; padding-left: 5px;"
        });

        var unloadButton = $.CreatePanel('Button', leftContainer, 'UnloadButton', {
            class: "content-navbar__tabs__btn",
            onactivate: "UiToolkitAPI.ShowGenericPopupOneOptionCustomCancelBgStyle('�ر�Osiris', '����ر�Osiris��?', '', '�ر�', function() { $.Osiris.goHome(); $.Osiris.addCommand('unload'); }, '����', function() {}, 'dim');"
        });

        unloadButton.SetPanelEvent('onmouseover', function () { UiToolkitAPI.ShowTextTooltip('UnloadButton', 'Unload'); });
        unloadButton.SetPanelEvent('onmouseout', function () { UiToolkitAPI.HideTextTooltip(); });

        $.CreatePanel('Image', unloadButton, '', {
            src: "s2r://panorama/images/icons/ui/cancel.vsvg",
            texturewidth: "24",
            class: "negativeColor"
        });

        var centerContainer = $.CreatePanel('Panel', navbar, '', {
            class: "content-navbar__tabs__center-container",
        });

        var hudTabButton = $.CreatePanel('RadioButton', centerContainer, 'hud_button', {
            group: "SettingsNavBar",
            class: "content-navbar__tabs__btn",
            onactivate: "$.Osiris.navigateToTab('hud');"
        });

        $.CreatePanel('Label', hudTabButton, '', { text: "HUD" });

        var visualsTabButton = $.CreatePanel('RadioButton', centerContainer, 'visuals_button', {
            group: "SettingsNavBar",
            class: "content-navbar__tabs__btn",
            onactivate: "$.Osiris.navigateToTab('visuals');"
        });

        $.CreatePanel('Label', visualsTabButton, '', { text: "�Ӿ�" });

        var soundTabButton = $.CreatePanel('RadioButton', centerContainer, 'sound_button', {
            group: "SettingsNavBar",
            class: "content-navbar__tabs__btn",
            onactivate: "$.Osiris.navigateToTab('sound');"
        });

        $.CreatePanel('Label', soundTabButton, '', { text: "����" });
    };

    var createVisualsNavbar = function () {
        var navbar = $.CreatePanel('Panel', $.Osiris.rootPanel.FindChildInLayoutFile('visuals'), '', {
            class: "content-navbar__tabs content-navbar__tabs--dark content-navbar__tabs--noflow"
        });

        var centerContainer = $.CreatePanel('Panel', navbar, '', {
            class: "content-navbar__tabs__center-container",
        });

        var playerInfoTabButton = $.CreatePanel('RadioButton', centerContainer, 'player_info_button', {
            group: "VisualsNavBar",
            class: "content-navbar__tabs__btn",
            onactivate: "$.Osiris.navigateToSubTab('visuals', 'player_info');"
        });

        $.CreatePanel('Label', playerInfoTabButton, '', { text: "�����Ϣ" });

        var outlineGlowTabButton = $.CreatePanel('RadioButton', centerContainer, 'outline_glow_button', {
            group: "VisualsNavBar",
            class: "content-navbar__tabs__btn",
            onactivate: "$.Osiris.navigateToSubTab('visuals', 'outline_glow');"
        });

        $.CreatePanel('Label', outlineGlowTabButton, '', { text: "��������" });

        var modelGlowTabButton = $.CreatePanel('RadioButton', centerContainer, 'model_glow_button', {
            group: "VisualsNavBar",
            class: "content-navbar__tabs__btn",
            onactivate: "$.Osiris.navigateToSubTab('visuals', 'model_glow');"
        });

        $.CreatePanel('Label', modelGlowTabButton, '', { text: "ģ�ͷ���" });
    };

    createNavbar();

    var settingContent = $.CreatePanel('Panel', $.Osiris.rootPanel, 'SettingsMenuContent', {
        class: "full-width full-height"
    });

    var createTab = function (tabName) {
        var tab = $.CreatePanel('Panel', settingContent, tabName, {
            useglobalcontext: "true",
            class: "SettingsMenuTab"
        });

        var content = $.CreatePanel('Panel', tab, '', {
            class: "SettingsMenuTabContent vscroll"
        });

        return content;
    };

    var createVisualsTab = function () {
        var tab = $.CreatePanel('Panel', settingContent, 'visuals', {
            useglobalcontext: "true",
            class: "SettingsMenuTab"
        });

        createVisualsNavbar();

        var content = $.CreatePanel('Panel', tab, '', {
            class: "full-width full-height"
        });

        return content;
    };

    var createSubTab = function (tab, subTabName) {
        var subTab = $.CreatePanel('Panel', tab, subTabName, {
            useglobalcontext: "true",
            class: "SettingsMenuTab"
        });

        var content = $.CreatePanel('Panel', subTab, '', {
            class: "SettingsMenuTabContent vscroll"
        });
        return content;
    };

    var createSection = function (tab, sectionName) {
        var background = $.CreatePanel('Panel', tab, '', {
            class: "SettingsBackground"
        });

        var titleContainer = $.CreatePanel('Panel', background, '', {
            class: "SettingsSectionTitleContianer"
        });

        $.CreatePanel('Label', titleContainer, '', {
            class: "SettingsSectionTitleLabel",
            text: sectionName
        });

        var content = $.CreatePanel('Panel', background, '', {
            class: "top-bottom-flow full-width"
        });

        return content;
    };

    var createDropDown = function (parent, labelText, section, feature, options, defaultIndex = 1) {
        var container = $.CreatePanel('Panel', parent, '', {
            class: "SettingsMenuDropdownContainer"
        });

        $.CreatePanel('Label', container, '', {
            class: "half-width",
            text: labelText
        });

        var dropdown = $.CreatePanel('CSGOSettingsEnumDropDown', container, feature, {
            class: "PopupButton White",
            oninputsubmit: `$.Osiris.dropDownUpdated('${section}', '${feature}');`
        });

        for (let i = 0; i < options.length; ++i) {
            dropdown.AddOption($.CreatePanel('Label', dropdown, i, {
                value: i,
                text: options[i]
            }));
        }

        dropdown.SetSelectedIndex(defaultIndex);
        dropdown.RefreshDisplay();
    };

    var createOnOffDropDown = function (parent, labelText, section, feature) {
        createDropDown(parent, labelText, section, feature, ["On", "Off"]);
    };

    var createYesNoDropDown = function (parent, labelText, section, feature, defaultIndex = 1) {
        createDropDown(parent, labelText, section, feature, ["Yes", "No"], defaultIndex);
    };

    var separator = function (parent) {
        $.CreatePanel('Panel', parent, '', { class: "horizontal-separator" });
    };

    var hud = createTab('hud');

    var bomb = createSection(hud, 'ը��');
    createYesNoDropDown(bomb, "ը������ʱ", 'hud', 'bomb_timer');
    separator(bomb);
    createYesNoDropDown(bomb, "���ը������ʱ", 'hud', 'defusing_alert');

    var killfeed = createSection(hud, '��ɱ��Ϣ');
    separator(killfeed);
    createYesNoDropDown(killfeed, "�������غϻ�ɱ��Ϣ", 'hud', 'preserve_killfeed');

    var time = createSection(hud, '��ʱ��');
    separator(time);
    createYesNoDropDown(time, "�غϼ�ʱ��", 'hud', 'postround_timer');

    var visuals = createVisualsTab();

    var playerInfoTab = createSubTab(visuals, 'player_info');

    var playerInfo = createSection(playerInfoTab, '�����Ϣ');
    createDropDown(playerInfo, "������", 'visuals', 'player_information_through_walls', ['����', '�������', '�ر�'], 2);

    var playerPosition = createSection(playerInfoTab, 'λ��');
    createYesNoDropDown(playerPosition, "���λ�ü�ͷ", 'visuals', 'player_info_position', 0);
    separator(playerPosition);
    createDropDown(playerPosition, "���λ�ü�ͷ��ɫ", 'visuals', 'player_info_position_color', ['��һ������ɫ', '������ɫ'], 0);

    var playerHealth = createSection(playerInfoTab, '����ֵ');
    createYesNoDropDown(playerHealth, "��ʾ�������ֵ", 'visuals', 'player_info_health', 0);
    separator(playerHealth);
    createDropDown(playerHealth, "�������ֵ��ɫ", 'visuals', 'player_info_health_color', ['Health-based', 'White'], 0);

    var playerWeapon = createSection(playerInfoTab, '����');
    createYesNoDropDown(playerWeapon, "��ʾ��ǰ����", 'visuals', 'player_info_weapon', 0);
    separator(playerWeapon);
    createYesNoDropDown(playerWeapon, "��ʾ��ҩ��", 'visuals', 'player_info_weapon_clip', 0);
    separator(playerWeapon);
    createYesNoDropDown(playerWeapon, '��ʾЯ��ը��', 'visuals', 'player_info_bomb_carrier', 0);
    separator(playerWeapon);
    createYesNoDropDown(playerWeapon, '��ʾ���ڰ�װը��', 'visuals', 'player_info_bomb_planting', 0);

    var playerIcons = createSection(playerInfoTab, 'ͼ��');
    createYesNoDropDown(playerIcons, "��ʾ���ͼ��", 'visuals', 'player_info_defuse', 0);
    separator(playerIcons);
    createYesNoDropDown(playerIcons, '��ʾ�ٳ�����ͼ��', 'visuals', 'player_info_hostage_pickup', 0);
    separator(playerIcons);
    createYesNoDropDown(playerIcons, '��ʾӪ������ͼ��', 'visuals', 'player_info_hostage_rescue', 0);
    separator(playerIcons);
    createYesNoDropDown(playerIcons, '��ʾ����äͼ��', 'visuals', 'player_info_blinded', 0);

    var outlineGlowTab = createSubTab(visuals, 'outline_glow');

    var outlineGlow = createSection(outlineGlowTab, 'Outline Glow');
    createOnOffDropDown(outlineGlow, "������", 'visuals', 'outline_glow_enable');

    var playerOutlineGlow = createSection(outlineGlowTab, 'Players');
    createDropDown(playerOutlineGlow, "�������", 'visuals', 'player_outline_glow', ['����', '�������', '�ر�'], 0);
    separator(playerOutlineGlow);
    createDropDown(playerOutlineGlow, "��ҷ�����ɫ", 'visuals', 'player_outline_glow_color', ['��һ������ɫ', '������ɫ', 'Ѫ��'], 0);

    var weaponOutlineGlow = createSection(outlineGlowTab, 'Weapons');
    createYesNoDropDown(weaponOutlineGlow, "��������", 'visuals', 'weapon_outline_glow', 0);
    separator(weaponOutlineGlow);
    createYesNoDropDown(weaponOutlineGlow, "��ҩ����", 'visuals', 'grenade_proj_outline_glow', 0);

    var bombAndDefuseKitOutlineGlow = createSection(outlineGlowTab, 'Bomb & Defuse Kit');
    createYesNoDropDown(bombAndDefuseKitOutlineGlow, "ը������", 'visuals', 'dropped_bomb_outline_glow', 0);
    separator(bombAndDefuseKitOutlineGlow);
    createYesNoDropDown(bombAndDefuseKitOutlineGlow, "��ʱը������", 'visuals', 'ticking_bomb_outline_glow', 0);
    separator(bombAndDefuseKitOutlineGlow);
    createYesNoDropDown(bombAndDefuseKitOutlineGlow, "��������", 'visuals', 'defuse_kit_outline_glow', 0);

    var hostageOutlineGlow = createSection(outlineGlowTab, 'Hostages');
    createYesNoDropDown(hostageOutlineGlow, "���ʷ���", 'visuals', 'hostage_outline_glow', 0);

    var modelGlowTab = createSubTab(visuals, 'model_glow');

    var modelGlow = createSection(modelGlowTab, 'ģ�ͷ���');
    createOnOffDropDown(modelGlow, "������", 'visuals', 'model_glow_enable');

    var playerModelGlow = createSection(modelGlowTab, '���');
    createDropDown(playerModelGlow, "����ģ�Ͷ���", 'visuals', 'player_model_glow', ['����', '������', '�ر�'], 0);
    separator(playerModelGlow);
    createDropDown(playerModelGlow, "����ģ����ɫ", 'visuals', 'player_model_glow_color', ['��һ������ɫ', '������ɫ', 'Ѫ��'], 0);

    $.Osiris.navigateToSubTab('visuals', 'player_info');

    var sound = createTab('sound');

    var playerSoundVisualization = createSection(sound, '����������ӻ�');
    separator(playerSoundVisualization);
    createYesNoDropDown(playerSoundVisualization, "���ӻ���ҽŲ�", 'sound', 'visualize_player_footsteps');

    var bombSoundVisualization = createSection(sound, 'ը���������ӻ�');
    createYesNoDropDown(bombSoundVisualization, "���ӻ���������", 'sound', 'visualize_bomb_plant');
    separator(bombSoundVisualization);
    createYesNoDropDown(bombSoundVisualization, "���ӻ�ը������������", 'sound', 'visualize_bomb_beep');
    separator(bombSoundVisualization);
    createYesNoDropDown(bombSoundVisualization, "���ӻ�ը���������", 'sound', 'visualize_bomb_defuse');

    var weaponSoundVisualization = createSection(sound, '�����������ӻ�');
    createYesNoDropDown(weaponSoundVisualization, "���ӻ���׼������", 'sound', 'visualize_scope_sound');
    separator(weaponSoundVisualization);
    createYesNoDropDown(weaponSoundVisualization, "���ӻ��л���������", 'sound', 'visualize_reload_sound');

    $.Osiris.navigateToTab('hud');
})();
)"
