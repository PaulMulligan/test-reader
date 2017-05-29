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
        money: 0,
        effects: []
    };
    
    function hasObject(object) {
    	var has = false;
    	for (var i = 0; i < player.inventory.length; i++) {
    		if (object === player.inventory[i]) {
    			has = true;
    		}
    	}
    	return has;
    };
    
    function dropItem(object) {
    	var index = false;
    	for (var i = 0; i < player.inventory.length; i++) {
    		if (object === player.inventory[i]) {
    			index = i;
    		}
    	}
    	player.inventory.splice(index, 1);
    };
    
    function clearText() {
    	$("#textlayout").empty();
    };
    
    function fillText(text) {
        $("#textlayout").append("<p>" + text + "</p>");
        $("#textlayout").scrollTop($("#textlayout")[0].scrollHeight);
    };
    
    function openEntry(entry) {
        clearText();
        var data = gameData[entry];
        decrementEffects();
        applyEffects(data);
        
        for (var i = 0; i < gameData[entry].text.length; i++) {
        	var text = gameData[entry].text[i];
        	text = replacePointers(data, text);
            text = replaceItems(data, text);
            text = replaceTests(data, text);
            text = appendCapitalism(data, text);
            text = appendCombat(data, text);
            fillText(text);
        }
        
        addChoiceListenerToCode();
        addItemListenerToCode();
        addTestListenerToCode();
        addListenersToStore();
        addCombatListenerToCode();
        
        refreshInventory();
        refreshStats();
    };
    
    function decrementEffects() {
    	var remainingEffects = [];
    	for (var i = 0; i < player.effects.length; i++) {
    		var effect = player.effects[i];
    		effect.delay = effect.delay-1;
    		if (effect.delay <= 0) {
    			triggerEffect(effect);
    		} else {
    			remainingEffects.push(effect);
    		}
    	}
    	player.effects = remainingEffects;
    };
    
    function applyEffects(entry) {
        if (entry.effects) {
            for (var i = 0; i < entry.effects.length; i++) {
                var effect = entry.effects[i];
                if (effect.delay && effect.delay > 0) {
                	player.effects.push(effect);
                } else {
                	triggerEffect(effect);
                }
            }
        }
    };
    
    function triggerEffect(effect) {
    	if (effect.text) {
    		fillText(effect.text);
    	}
    	player[effect.stat] += effect.modifier;
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
    
    function runCombat(target) {
    	if (!$(target).hasClass("got")) {
    		var data = target.parentElement.firstChild.data.split(":");
        	var skill = data[1];
        	var stamina = data[3];
        	var enemyRoll = roll12() + parseInt(skill);
        	var playerRoll = roll12() + player.combat + player.bonuscombat;
        	if (enemyRoll > playerRoll) {
        		player.stamina -= (enemyRoll-playerRoll);
        	} else if (enemyRoll < playerRoll) {
        		stamina -= (playerRoll-enemyRoll);
        		target.parentElement.firstChild.data = data[0] + ":" + data[1] + ":" +  data[2] + ":" + stamina + " ";
        	}
        	refreshStats();
        	if (player.stamina <= 0) {
        		$(target).addClass("got");
        		var newText = 
        		editedText = editedText.replace(choice.value, '<code data-entry="' + entry +'">' + choice.text + '</code>');
        	} else if (stamina <= 0) {
        		$(target).addClass("got");
        	}
    	}
    };
    
    function testStat(target) {
        if (!$(target).hasClass('got')) {
            $(target).addClass('got');
            var stat = player[target.dataset.stat];
            if (player['bonus' + target.dataset.stat]) {
                stat += player['bonus' + target.dataset.stat];
            }
            var roll = roll12();
            var newtext = 'You rolled ' + roll + '+' + stat + '=' + (roll+stat) + ' against ' + target.dataset.goal;
            if (roll + stat >= target.dataset.goal) {
                player[target.dataset.successstat] += parseInt(target.dataset.successmodifier);
                refreshStats();
                newtext += '\n ' + target.dataset.successtext + '\n';
            } else {
                newtext += '\n ' + target.dataset.failuretext + '\n';
            }
            $(target).after(newtext);
        }
    };
    
    function buy(target) {
        if (!$(target).hasClass('got')) {
        	var itemName = target.parentElement.dataset.item;
        	var item = itemData[itemName];
        	if (item) {
        		player.inventory.push(itemName);
        		player.money -= parseInt(target.innerText);
        		refreshInventory();
                refreshStats();
                refreshShop();
        	}
        }
    };
    
    function refreshShop() {
    	 $('td').each(function(index, object) {
         	blockShopItems(object);
    	 });
    };
    
    function sell(target) {
    	if (!$(target).hasClass('got')) {
        	var itemName = target.parentElement.dataset.item;
        	var item = itemData[itemName];
        	if (item) {
        		dropItem(itemName);
        		player.money += parseInt(target.innerText);
        		refreshInventory();
                refreshStats();
                refreshShop();
        	}
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
        
        $("#money").val(player.money);
        $("#stamina").val(player.stamina);
        $("#job").val(player.job);
        $("#defence").val(player.defence);
        $("#race").val(player.race);
    };
    
    function replacePointers(data, editedText) {
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
    
    function replaceTests(data, editedText) {
        if (data.tests) {
            for (var i = 0; i < data.tests.length; i++) {
                var test = data.tests[i];
                editedText = editedText.replace(test.value, '<test data-goal="' + test.goal + '" data-stat="' + test.stat + 
                        '" data-effect="' + test.success.effect + '" data-successtext="' + test.success.text + 
                        '" data-successstat="' + test.success.stat + '" data-successmodifier="' + test.success.modifier + 
                        '" data-failuretext="' + test.failure.text +'">' + test.text + '</item>');
            }
        }
        return editedText;
    };
    
    function appendCapitalism(data, editedText) {
        if (data.shop) {
            var html = "<table><tr><th>Item</th><th>Buy</th><th>Sell</th></tr>";
            for (var i = 0; i < data.shop.length; i++) {
                var shopitem = data.shop[i];
                var item = itemData[shopitem.item];
                html += '<tr data-item="' + shopitem.item + '"><td>' + item.name + '</td><td data-shoptype="buy">' + shopitem.sellsFor + '</td><td data-shoptype="sell">' + shopitem.buysFor + '</td></tr>'
            }
            html += '</table>';
            editedText += html;
        }
        return editedText;
    };
    
    function appendCombat(data, editedText) {
        if (data.combat) {
            var html = "<p>" + data.combat.name + " Skill :" + data.combat.skill + ": Stamina :" + data.combat.stamina + " <combat data-successEntry=" + data.combat.win.entry + ">FIGHT</combat></p>";
            editedText += html;
        }
        return editedText;
    };
    
    function roll12() {
        return (Math.floor(Math.random()*6) + Math.floor(Math.random()*6)); 
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
    
    function addTestListenerToCode() {
        $('test').click(function(event) {
            testStat(event.target);
        });
    };
    
    function addListenersToStore() {
        $('td').each(function(index, object) {
        	blockShopItems(object);
            if (object.dataset.shoptype == "buy") {
                $(object).click(function(event) {
                    buy(event.target);
                });
            } else if (object.dataset.shoptype == "sell") {
                $(object).click(function(event) {
                    sell(event.target);
                });
            }
        });
    };

    function addCombatListenerToCode() {
        $('combat').click(function(event) {
            runCombat(event.target);
        });
    };
    
    function blockShopItems(object) {
        if (object.dataset.shoptype == "buy") {
        	if (object.innerText === "null") {
        		$(object).addClass('got');
        	} else if (player.money >= object.innerText) {
            	$(object).removeClass('got');
            } else {
            	$(object).addClass('got');
            }
        } else if (object.dataset.shoptype == "sell") {
        	if (object.innerText === "null") {
        		$(object).addClass('got');
        	} else if (hasObject(object.parentElement.dataset.item)) {
        		$(object).removeClass('got');
        	} else {
        		$(object).addClass('got');
        	}
        } else {
        	$(object).addClass('got');
        }
    };
    
    function getRandomFromArray(array) {
        return array[Math.floor(Math.random()*array.length)];
    };
    
    openEntry("start");
});