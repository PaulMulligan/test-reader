//For a given number:
//STAT+01: 100%
//STAT+02: 100%
//STAT+03: 97.22%
//STAT+04: 91.66%
//STAT+05: 83.33%
//STAT+06: 72.22%
//STAT+07: 58.33%
//STAT+08: 41.66%
//STAT+09: 27.77%
//STAT+10: 16.66%
//STAT+11: 8.33%
//STAT+12: 2.78%

//Basic training: up to 6
//Advanced training: up to 12
//Average stat: 3
//Average easy: Up to difficulty 7
//Average medium: Up to difficulty 10
//Average hard: Up to difficulty 12

$(document).ready(function() {
    console.log('Starting code');
    
    var player = {
        firstname: "Hero",
        race: "Human",
        combat: 4,
        survival: 4,
        magic: 4,
        charm: 4,
        dexterity: 4,
        bonuscombat: 0,
        bonussurvival: 0,
        bonusmagic: 0,
        bonuscharm: 0,
        bonusdexterity: 0,
        stamina: 20,
        job: "None",
        defence: 0,
        bonusdefence: 0,
        inventory: [],
        money: 0
    };
    
    function fillText(text) {
        $("#textlayout").empty();
        $("#textlayout").append(text + "<br/>");
        $("#textlayout").scrollTop($("#textlayout")[0].scrollHeight);
    };
    
    function openEntry(entry) {
        var data = gameData[entry];
        var text = replacePointers(data);
        text = replaceItems(data, text);
        fillText(text);
        addChoiceListenerToCode();
        addItemListenerToCode();
    };
    
    function getItem(target) {
        var jtarget = $(target);
        if (!jtarget.hasClass('got')) {
            player.inventory.push(target.dataset.item);
            jtarget.addClass('got');
            refreshInventory();
            refreshStats();
        }
    };
    
    function refreshInventory() {
        $("#inventory").empty();
        player.bonuscombat = 0;
        player.bonussurvival = 0;
        player.bonusmagic = 0;
        player.bonuscharm = 0;
        player.bonusdexterity = 0;
        for (var i = 0; i < player.inventory.length; i++) {
            var itemKey = player.inventory[i];
            var item = itemData[itemKey];
            if (item) {
                $("#inventory").append('<div title="' + item.description + '">' + item.name + '</div>');
                if (item.bonus) {
                    player[item.bonus.stat] += item.bonus.modifier;
                }
            }
        }
    };
    
    function refreshStats() {
        $("#combat").val(player.combat + player.bonuscombat);
        $("#survival").val(player.survival + player.bonussurvival);
        $("#magic").val(player.magic + player.bonusmagic);
        $("#charm").val(player.charm + player.bonuscharm);
        $("#dexterity").val(player.dexterity + player.bonusdexterity);
    };
    
    function replacePointers(data) {
        var editedText = data.text;
        for (var i = 0; i < data.choices.length; i++) {
            var choice = data.choices[i];
            var valid = false;
            if (choice.condition) {
                if (choice.condition.type == "item") {
                    for (var j = 0; j < player.inventory.length; j++) {
                        var item = player.inventory[j];
                        if (item == choice.condition.item) {
                            valid = true;
                        }
                    }
                }
            } else {
                valid = true;
            }
            
            if (valid) {
                var entry;
                if (choice.entry) {
                    entry = choice.entry;
                } else if (choice.random) {
                    entry = getRandomFromArray(choice.random);
                }
                editedText = editedText.replace(choice.value, '<code data-entry="' + entry +'">' + choice.text + '</code>');
            } else {
                editedText = editedText.replace(choice.value, '<locked >' + choice.text + '</locked>');
            }
            
        }
        return editedText;
    };
    
    function replaceItems(data, editedText) {
        if (data.items) {
            for (var i = 0; i < data.items.length; i++) {
                var item = data.items[i];
                editedText = editedText.replace(item.value, '<item data-item="' + item.item +'">' + item.text + '</item>');
            }
        }
        return editedText;
    };
    
    function addChoiceListenerToCode() {
        $('code').click(function(event) {
            openEntry(event.target.dataset.entry);
        });
    };
    
    function addItemListenerToCode() {
        $('item').click(function(event) {
            getItem(event.target);
        });
    };
    
    function getRandomFromArray(array) {
        return array[Math.floor(Math.random()*array.length)];
    };
    
    openEntry("start");
});